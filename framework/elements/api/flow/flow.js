define([
    "ojs/ojcore",
    "ojs/ojrouter",
    "base-models/flows/contract",
    "jquery",
    "knockout",
    "ojL10n!resources/nls/flow",
    "framework/js/configurations/config",
    "ojs/ojbutton",
    "ojs/ojtrain",
    "ojs/ojanimation"
], function(oj, Router, Contracts, $, ko, locale, Configurations) {
    "use strict";

    return function(rootParams) {
        let trainElement;

        const self = this,
            stageTransitionAnimation = "none",
            stageState = new Map(),
            stagePaths = Object.create(null),
            flowComponentPath = function(props) {
                return "flows/" + props.flowName + "/" + props.componentName + (Configurations.development.enabled ? "/loader" : "");
            },
            flowComponentLoader = function(flowName, _componentName, _componentConfig, resolvedComponentPath) {
                const componentName = resolvedComponentPath.split("/")[2];

                if (componentName) {
                    return flowComponentPath({
                        flowName: flowName,
                        componentName: componentName
                    });
                }
            },
            rootRouterInstance = rootParams.rootRouterInstance || rootParams.dashboard.rootRouter,
            getDefaultIcons = function(contract) {
                // eslint-disable-next-line obdx-string-validations
                let rootClass = "icons ";

                switch (contract) {
                    case "submit":
                        rootClass += "icon-submit";
                        break;
                    case "next":
                        rootClass += "icon-forward-arrow";
                        break;
                    case "back":
                        rootClass += "icon-back-arrow";
                        break;
                    case "confirm":
                        rootClass += "icon-confirm";
                        break;
                    case "draft":
                        rootClass += "icon-save";
                        break;
                    case "cancel":
                        rootClass += "icon-cancel";
                        break;
                }

                return rootClass;
            },
            contractHooks = Object.seal(Object.keys(Contracts).reduce(function(accumulator, currentValue) {
                accumulator[currentValue] = {
                    action: null,
                    label: locale.buttons[currentValue],
                    icon: getDefaultIcons(currentValue)
                };

                return accumulator;
            }, {})),
            updateTrainStep = function(routerState) {
                self.resetContracts(false);
                ko.tasks.runEarly();

                if (routerState && self.flowRouter.states.length > 2) {

                    trainElement.updateStep(trainElement.selectedStep, {
                        visited: true
                    });

                    trainElement.updateStep(routerState.id, {
                        disabled: false
                    });

                    self.selectedStepValue(routerState.id);
                }

                self.resetContracts(true);
            },
            editAction = function(stateIndex) {
                const states = self.flowRouter.states,
                    state = states[stateIndex];

                if (state) {
                    self.flowRouter.go(state.id);
                }
            },
            removeEmptyObjects = function(object) {
                let key;

                for (key in object) {
                    if (!object[key] || typeof object[key] !== "object") {
                        // eslint-disable-next-line no-continue
                        continue;
                    }

                    removeEmptyObjects(object[key]);

                    if (Object.keys(object[key]).length === 0) {
                        delete object[key];
                    }
                }

                return object;
            },
            animateStage = function(animationProps) {
                if (stageTransitionAnimation !== "none") {
                    oj.AnimationUtils[stageTransitionAnimation](document.getElementById(self.flowDOMId + "flow-component"), Object.assign({
                        duration: "0.5s",
                        timingFunction: "ease-in-out"
                    }, animationProps || {}));
                }
            };

        self.flowConfig = null;
        self.flowRouter = null;
        self.noAccess = ko.observable(false);
        self.flowDOMId = rootParams.baseModel.incrementIdCount();
        self.reviewComponent = ko.observable();
        self.selectedStepValue = ko.observable();
        self.resetContracts = ko.observable(true);

        self.flowParameters = {
            flowName: ko.utils.unwrapObservable(rootParams.rootModel).params.flowName,
            flowStartIndex: ko.utils.unwrapObservable(rootParams.rootModel).params.flowStartIndex,
            flowStageRootModel: Object.assign(ko.utils.unwrapObservable(rootParams.rootModel).params.flowStageRootModel || {}, { editAction: editAction }),
            flowMode: ko.utils.unwrapObservable(rootParams.rootModel).params.flowMode
        };

        self.locale = locale;
        self.routerInit = ko.observable(false);
        self.stepArray = ko.observableArray();

        self.setContractHooks = function(customContractHook) {
            self.resetContracts(false);
            ko.tasks.runEarly();

            Object.keys(contractHooks).forEach(function(key) {
                if (customContractHook[key]) {
                    contractHooks[key].action = customContractHook[key].action;
                    contractHooks[key].label = customContractHook[key].label || locale.buttons[key];
                    contractHooks[key].icon = customContractHook[key].icon || getDefaultIcons(key);
                } else {
                    contractHooks[key].action = null;
                    contractHooks[key].label = locale.buttons[key];
                    contractHooks[key].icon = getDefaultIcons(key);
                }
            });

            self.resetContracts(true);
        };

        self.setStageState = function(key, state) {
            return stageState.set(key, state);
        };

        self.getStageState = function(key) {
            return stageState.get(key);
        };

        self.computeContractClass = function(index) {
            switch (index) {
                case 0:
                    return "action-button-primary";
                case 1:
                    return "action-button-secondary";
                default:
                    return "action-button-tertiary";
            }
        };

        self.computeContractLabel = function(contract) {
            return contractHooks[contract.name].label;
        };

        self.computeContractIcon = function(contract) {
            return contractHooks[contract.name].icon;
        };

        self.computeContractAction = function(_event, contract) {
            switch (contract.name) {
                case "cancel":
                    rootParams.dashboard.switchModule(true);
                    break;
                case "back":
                    animateStage({
                        direction: "right"
                    });

                    rootParams.dashboard.hideDetails();
                    break;
                case "confirm":
                    if (self.flowConfig.props.confirmationType.version === "v2") {
                        rootParams.baseModel.registerComponent(self.flowConfig.props.confirmationType.name, self.flowConfig.name, flowComponentLoader.bind(null, self.flowConfig.name));
                    }

                    contractHooks.confirm.action();
                    break;
                case "draft":
                    contractHooks.draft.action();
                    break;
                case "submit":
                case "next": {
                    const stages = self.flowRouter.states,
                        currentStage = self.flowRouter.currentState(),
                        currentStageId = currentStage.id,
                        currentStageIndex = stages.findIndex(function(stage) {
                            return stage.id === currentStageId;
                        }),
                        nextStageIndex = currentStageIndex + 1;

                    if (nextStageIndex > stages.length - 1) {
                        return;
                    }

                    currentStage.canExit = contractHooks[contract.name].action;
                    self.flowRouter.go(stages[nextStageIndex].id);

                    animateStage({
                        direction: "left"
                    });

                    if (contract.name === "submit") {
                        self.setStageState(self.flowConfig.stages[self.flowConfig.stages.length - 1].component, {
                            payload: self.flowConfig.stages.filter(function(_element, index, array) {
                                return index !== array.length - 1;
                            }).reduce(function(accumulator, currentElement) {
                                let stagePayload = (self.getStageState(currentElement.component) && self.getStageState(currentElement.component).payload) || {};

                                stagePayload = JSON.parse(JSON.stringify(stagePayload));

                                return $.extend(true, accumulator, removeEmptyObjects(stagePayload));
                            }, {}),
                            mode: "review"
                        });
                    }

                    break;
                }
                default:
                    return false;
            }
        };

        self.selectedTrainStep = function(event) {
            if (event.detail.originalEvent && (
                    event.detail.originalEvent.currentTarget.className.includes("oj-train-button") ||
                    event.detail.originalEvent.currentTarget.className.includes("oj-train-label")
                )) {
                event.preventDefault();
            }
        };

        self.triggerPrefetch = rootParams.baseModel.debounce(function(contract) {
            if (rootParams.baseModel.large() && (contract.name === "next" || contract.name === "submit")) {
                const currentStageId = self.flowRouter.currentState().id,
                    nextStageIndex = self.flowRouter.states.findIndex(function(stage) {
                        return stage.id === currentStageId;
                    }) + 1;

                if (nextStageIndex > self.flowRouter.states.length - 1) {
                    return;
                }

                const nextComponent = self.flowRouter.states[nextStageIndex].id;

                if (!stagePaths[nextComponent].isFetched) {
                    stagePaths[nextComponent].isFetched = true;
                    rootParams.baseModel.preFetch([stagePaths[nextComponent].path]);
                }
            }
        }, 100);

        require(["flows/" + self.flowParameters.flowName + "/flow.config"], function(flowConfig) {
            self.flowConfig = flowConfig;

            if (self.flowParameters.flowMode !== "readonly") {
                let startFrom = 0;

                const routerConfiguration = {};

                if (self.flowParameters.flowStartIndex &&
                    Number.isSafeInteger(self.flowParameters.flowStartIndex) &&
                    self.flowParameters.flowStartIndex >= 0 &&
                    self.flowParameters.flowStartIndex < self.flowConfig.stages.length - 1) {
                    startFrom = self.flowParameters.flowStartIndex;
                }

                self.flowConfig.stages = self.flowConfig.stages.map(self.flowConfig.contractResolver);

                if (rootParams.baseModel.filterAuthorisedComponents(self.flowConfig.stages, "component").length < self.flowConfig.stages.length) {
                    self.noAccess(true);
                }

                self.flowConfig.stages.forEach(function(stage, index, array) {
                    routerConfiguration[stage.component] = {
                        label: stage.component,
                        value: stage,
                        isDefault: index === startFrom
                    };

                    rootParams.baseModel.registerComponent(stage.component, self.flowParameters.flowName, flowComponentLoader.bind(null, self.flowParameters.flowName));

                    stagePaths[stage.component] = {
                        path: flowComponentPath({
                            flowName: self.flowParameters.flowName,
                            componentName: stage.component
                        }),
                        isFetched: false
                    };

                    self.stepArray.push({
                        visited: false,
                        disabled: index !== 0,
                        id: stage.component,
                        label: array.length - 1 === index ? locale.review : rootParams.baseModel.format(locale.stage, { stageNumber: index + 1 })
                    });
                });

                self.flowRouter = rootRouterInstance.getChildRouter(self.flowConfig.name) || rootRouterInstance.createChildRouter(self.flowConfig.name).configure(routerConfiguration);

                self.dispose = function() {
                    self.subscription.dispose();
                    self.flowRouter.dispose();
                };

                Router.sync().then(function() {
                    self.routerInit(true);
                }).then(function() {
                    trainElement = document.getElementById(self.flowDOMId + "train");
                    self.subscription = self.flowRouter.currentState.subscribe(updateTrainStep);
                });
            } else {
                const reviewComponentName = flowConfig.stages[flowConfig.stages.length - 1].component;

                rootParams.baseModel.registerComponent(reviewComponentName, self.flowParameters.flowName, flowComponentLoader.bind(null, self.flowParameters.flowName));

                self.setStageState(reviewComponentName, {
                    mode: "readonly",
                    payload: self.flowParameters.flowStageRootModel.data,
                    rawApprovalData: self.flowParameters.flowStageRootModel
                });

                self.reviewComponent(reviewComponentName);
            }
        });
    };
});