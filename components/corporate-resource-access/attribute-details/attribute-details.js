define(["./model", "knockout", "jquery",
        "ojL10n!resources/nls/attribute-details",
        "ojs/ojformlayout",
        "ojs/ojvalidationgroup",
        "ojs/ojbutton",
        "ojs/ojcheckboxset"
    ],
    function (Model, ko, $, resourceBundle) {
        "use strict";

        return function (params) {
            const self = this;

            self.nls = resourceBundle;

            const rootParams = params.rootModel.previousState ? params.rootModel.previousState : params.rootModel.params;

            params.baseModel.registerComponent("entity-details", "corporate-resource-access");
            params.baseModel.registerComponent("mapping-train", "corporate-resource-access");
            params.baseModel.registerComponent("attribute-list", "corporate-resource-access");
            params.baseModel.registerComponent("access-type", "corporate-resource-access");
            params.baseModel.registerComponent("transaction-details", "corporate-resource-access");

            self.isUserSelected = rootParams.isUserSelected;
            self.attributeData = rootParams.attributeData;
            self.accessData = rootParams.accessData;
            self.accessData.futureAttributeAccess = ko.observable(self.accessData.futureAttributeAccess);
            self.accessData.partyLevelAccess = ko.observableArray(self.accessData.partyLevelAccess);
            self.selectedItem = ko.observableArray([]);
            self.attributeName = rootParams.attributeName;

            if (self.isUserSelected) {
                params.dashboard.headerName(self.nls.componentHeaderUser);
            } else {
                params.dashboard.headerName(self.nls.componentHeaderParty);
            }

            self.partyId = rootParams.partyId;
            self.partyName = rootParams.partyName;
            self.moduleName = rootParams.moduleName ? rootParams.moduleName : rootParams.selectedModule.description;
            self.userData = rootParams.userData;

            self.nextPressed = ko.observable(false);
            self.editPressed = ko.observable(rootParams.editPressed ? rootParams.editPressed : false);
            self.selectedStepValue = ko.observable();
            self.selectedStepLabel = ko.observable();
            self.disabled = params.disabled;

            self.stepArray = rootParams.stepArray ? ko.observableArray(rootParams.stepArray) : ko.observableArray([{
                    label: params.baseModel.format(self.nls.mappingTrain.resourceMap, {
                        attributeName: rootParams.attributeName
                    }),
                    id: "attribute-details",
                    visited: false,
                    disabled: !!self.editPressed()
                },
                {
                    label: self.nls.mappingTrain.transMap,
                    id: "transaction-details",
                    visited: false,
                    disabled: !!self.editPressed()
                }
            ]);

            const deleteMessageData = {
                partyId: self.partyId,
                partyName: self.partyName,
                attributeName: self.attributeName
            };

            if (params.rootModel.params.accessLevel === "USER") {
                deleteMessageData.username = self.userData.username;
                self.deleteMessage = params.baseModel.format(self.nls.AttributeDetails.deleteMessageUser, deleteMessageData);

            } else if (params.rootModel.params.accessLevel === "PARTY") {
                self.deleteMessage = params.baseModel.format(self.nls.AttributeDetails.deleteMessageParty, deleteMessageData);
            }

            if (self.editPressed()) {
                self.disabled = ko.observable(false);
            } else {
                self.disabled = ko.observable(true);
            }

            self.nextPressed.subscribe(function (newValue) {

                if (newValue) {
                    self.selectedStepLabel(self.stepArray()[1].label);
                    self.selectedStepValue(self.stepArray()[1].id);
                    self.stepArray()[0].visited = false;
                }

                const dataPassed = ko.mapping.toJS({
                    accessData: self.accessData,
                    attributeData: self.attributeData,
                    partyId: self.partyId,
                    partyName: self.partyName,
                    moduleName: self.moduleName,
                    userData: self.userData,
                    selectedStepValue: self.selectedStepValue,
                    selectedStepLabel: self.selectedStepLabel,
                    stepArray: self.stepArray,
                    nextPressed: false,
                    editPressed: self.editPressed,
                    attributeName: self.attributeName,
                    isUserSelected: self.isUserSelected,
                    accessLevel: rootParams.accessLevel,
                    selectedModule: rootParams.selectedModule,
                    value: rootParams.value

                });

                params.dashboard.loadComponent("transaction-details", dataPassed);
            });

            self.editPressed.subscribe(function (newValue) {
                if (newValue) {
                    self.disabled(false);

                    self.stepArray = ko.observableArray([{
                            label: params.baseModel.format(self.nls.mappingTrain.resourceMap, {
                                attributeName: rootParams.attributeName
                            }),
                            id: "attribute-details",
                            visited: false,
                            disabled: !!self.editPressed()
                        },
                        {
                            label: self.nls.mappingTrain.transMap,
                            id: "transaction-details",
                            visited: false,
                            disabled: !!self.editPressed()
                        }
                    ]);
                }
            });

            self.onClickBack = function (event) {

                const dataPassed = {
                    hideValidate: true,
                    isModuleSelected: true,
                    partyDetailsFetched: true,
                    partyId: params.rootModel.params.partyId,
                    partyName: params.rootModel.params.partyName,
                    selectedModule: params.rootModel.params.selectedModule,
                    mappingData: params.rootModel.params.mappingData,
                    cameBack: true,
                    value: params.rootModel.params.value
                };

                if (event && params.rootModel.params.accessLevel === "USER") {

                    dataPassed.userData = params.rootModel.params.userData;
                    dataPassed.isUserSelected = params.rootModel.params.isUserSelected;

                    params.dashboard.loadComponent("user-base", dataPassed);

                } else if (event && params.rootModel.params.accessLevel === "PARTY") {

                    params.dashboard.loadComponent("party-base", dataPassed);
                }
            };

            self.onClickEdit70 = function (event) {
                if (event) {
                    self.editPressed(true);
                }
            };

            self.onClickNext88 = function (event) {
                if (event) {
                    self.nextPressed(true);
                }
            };

            self.onClickCancel85 = function () {
                params.dashboard.switchModule();
            };

            self.deleteClicked = function () {
                $("#deleteConfirmationModal").trigger("openModal");
            };

            self.hideModal = function () {
                $("#deleteConfirmationModal").hide();
            };

            function findSelectedTasks(taskHierarchy) {
                if (!taskHierarchy) {
                    return [];
                }

                const selectedTasks = [];

                for (let i = 0; i < taskHierarchy.length; i++) {
                    for (let j = 0; j < taskHierarchy[i].childTasks.length; j++) {
                        if (taskHierarchy[i].childTasks[j].allowed) {
                            selectedTasks.push(taskHierarchy[i].childTasks[j].id);
                        }
                    }
                }

                return selectedTasks;
            }

            function buildPayload(payload) {

                $.extend(payload, ko.mapping.toJS(self.accessData));

                payload.attributeInclusionList = [];

                for (let i = 0; i < self.attributeData.length; i++) {
                    const attributeInclusion = {};

                    attributeInclusion.attributeId = self.attributeData[i].id;
                    attributeInclusion.name = self.attributeData[i].name;
                    attributeInclusion.status = self.attributeData[i].status;
                    attributeInclusion.taskIds = findSelectedTasks(self.attributeData[i].tasks);

                    payload.attributeInclusionList.push(attributeInclusion);
                }

                return payload;
            }

            self.deleteAttributeAccess = function () {
                const payload = {};

                buildPayload(payload);

                if (self.accessData.accessLevel === "PARTY") {
                    delete payload.partyLevelAccess;

                    Model.deletePartyAttributeAccess(self.accessData.partyId.value, self.accessData.id, ko.mapping.toJSON(payload)).then(function (data) {

                        params.dashboard.loadComponent("confirm-screen", {
                            transactionName: self.nls.componentHeaderParty,
                            transactionResponse: data
                        });
                    });
                } else if (self.accessData.accessLevel === "USER") {
                    delete payload.futureAttributeAccess;

                    if (payload.partyLevelAccess.indexOf("true") !== -1) {
                        payload.partyLevelAccess = true;
                    } else {
                        payload.partyLevelAccess = false;
                    }

                    Model.deleteUserAttributeAccess(self.accessData.userId, self.accessData.id, ko.mapping.toJSON(payload)).then(function (data) {

                        params.dashboard.loadComponent("confirm-screen", {
                            transactionName: self.nls.componentHeaderUser,
                            transactionResponse: data
                        });
                    });
                }
            };
        };
    });