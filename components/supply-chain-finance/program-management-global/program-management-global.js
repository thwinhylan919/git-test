define([
    "ojL10n!resources/nls/program-management-global",
    "knockout",
    "./model",
    "jquery",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojtrain"
], function (resourceBundle, ko, Model, $) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.isGlobalLoaded = ko.observable(true);
        self.selectedStepValue = ko.observable("create-program-parameters");
        self.autoAcceptInvoice = ko.observable(self.nls.no);
        self.invoiceSwitch = ko.observable(false);
        self.showNumberPicker = ko.observable(false);
        self.showDisbursementDetails = ko.observable(false);
        self.autoFinance = ko.observable(self.nls.no);
        self.financeSwitch = ko.observable(false);
        self.showAll = ko.observable(true);
        self.counterPartiesNo = ko.observable();
        self.fetchedProgramTypes = ko.observable();
        self.fetchedDisbursementMode = ko.observable();
        self.currencyList = ko.observableArray();
        self.programTypesLoaded = ko.observable(false);
        self.disbursementModeLoaded = ko.observable(false);
        self.currencyLoaded = ko.observable(false);

        self.queryParameter = ko.observable({
            criteria: []
        });

        self.sortByParameter = ko.observableArray();
        self.count = ko.observable();
        self.fetchedCounterparties = ko.observableArray();
        self.counterpartiesLoaded = ko.observable(false);
        self.partyDetails = ko.observable();
        self.partyName = ko.observable();
        self.partyId = ko.observable();
        params.baseModel.registerElement("modal-window");

        self.taxonomyDefinition = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.scf.dto.program.ProgramDTO");

        const getNewKoModel = function () {
            const KoModel = Model.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.data : getNewKoModel();

        if (params.rootModel.previousState) {
            self.modelInstance.associatedParties = ko.mapping.fromJS(params.rootModel.previousState.data.associatedParties());

            if (self.modelInstance.autoAcceptance()) {
                self.autoAcceptInvoice(self.nls.yes);
                self.invoiceSwitch(true);
                self.showNumberPicker(true);
            }

            if (self.modelInstance.autoFinance()) {
                self.autoFinance(self.nls.yes);
                self.financeSwitch(true);
                self.showDisbursementDetails(true);
            }

            self.showAll(params.rootModel.previousState.showAll);
        }

        if (params.rootModel.params.programDetails) {
            self.isEditMode = ko.observable(true);
        }

        if (params.rootModel.params.programDetails && !params.rootModel.previousState) {
            self.isEditMode = ko.observable(true);

            self.modelInstance.programCode = ko.mapping.fromJS(params.rootModel.params.programDetails().programCode);
            self.modelInstance.programName = ko.mapping.fromJS(params.rootModel.params.programDetails().programName);
            self.modelInstance.programProduct = ko.mapping.fromJS(params.rootModel.params.programDetails().programProduct);
            self.modelInstance.associatedParties = ko.mapping.fromJS(params.rootModel.params.programDetails().associatedParties);
            self.modelInstance.role = ko.mapping.fromJS(params.rootModel.params.programDetails().role);
            self.modelInstance.autoAcceptance = ko.mapping.fromJS(params.rootModel.params.programDetails().autoAcceptance);
            self.modelInstance.acceptanceDays = ko.mapping.fromJS(params.rootModel.params.programDetails().acceptanceDays);
            self.modelInstance.disbursementCurrency = ko.mapping.fromJS(params.rootModel.params.programDetails().disbursementCurrency);
            self.modelInstance.disbursementMode = ko.mapping.fromJS(params.rootModel.params.programDetails().disbursementMode);
            self.modelInstance.autoFinance = ko.mapping.fromJS(params.rootModel.params.programDetails().autoFinance);
            self.modelInstance.effectiveDate = ko.mapping.fromJS(params.rootModel.params.programDetails().effectiveDate);
            self.modelInstance.expiryDate = ko.mapping.fromJS(params.rootModel.params.programDetails().expiryDate);
            self.modelInstance.status = ko.mapping.fromJS(params.rootModel.params.programDetails().status);

            self.counterPartiesNo(self.modelInstance.associatedParties().length);

            if (self.modelInstance.autoAcceptance()) {
                self.autoAcceptInvoice(self.nls.yes);
                self.invoiceSwitch(true);
                self.showNumberPicker(true);
            }

            if (self.modelInstance.autoFinance()) {
                self.autoFinance(self.nls.yes);
                self.financeSwitch(true);
                self.showDisbursementDetails(true);
            }
        }

        self.stepArray = ko.observableArray([{
                label: self.nls.firstStep,
                id: "create-program-parameters",
                visited: true,
                disabled: false
            },
            {
                label: self.nls.secondStep,
                id: "create-program-link",
                visited: false,
                disabled: false
            }
        ]);

        params.baseModel.registerComponent("create-program-parameters", "supply-chain-finance");
        params.baseModel.registerComponent("create-program-link", "supply-chain-finance");

        self.trainListener = function (event) {
            const tracker = document.getElementById("form_tracker");

            if (!params.baseModel.showComponentValidationErrors(tracker)) {
                event.preventDefault();
            }
        };

        self.previousStep = function () {
            const train = document.getElementById("train"),
                prev = train.getPreviousSelectableStep();

            for (let j = 0; j < train.steps.length; j++) {
                if (train.selectedStep === train.steps[j].id) {
                    train.steps[j].visited = true;
                    train.steps[j].disabled = false;

                    if (j > 0) {
                        train.steps[j - 1].visited = true;
                        train.steps[j - 1].disabled = false;
                    }

                    break;
                }
            }

            if (prev !== null && params.baseModel.showComponentValidationErrors(document.getElementById("form_tracker"))) {
                self.isGlobalLoaded(false);
                self.selectedStepValue(prev);
                ko.tasks.runEarly();
                self.isGlobalLoaded(true);
            }
        };

        self.nextStep = function () {
            const train = document.getElementById("train"),
                next = train.getNextSelectableStep();

            for (let j = 0; j < train.steps.length; j++) {
                if (train.selectedStep === train.steps[j].id) {
                    train.steps[j].visited = true;
                    train.steps[j].disabled = false;

                    if (j < 1) {
                        train.steps[j + 1].visited = true;
                        train.steps[j + 1].disabled = false;
                    }

                    break;
                }
            }

            if (next !== null && params.baseModel.showComponentValidationErrors(document.getElementById("form_tracker"))) {
                self.isGlobalLoaded(false);
                self.selectedStepValue(next);
                ko.tasks.runEarly();
                self.isGlobalLoaded(true);
            }
        };

        Model.programTypesget(JSON.stringify(self.queryParameter()), JSON.stringify(self.sortByParameter()), self.count()).then(function (response) {
            self.fetchedProgramTypes(response.programProducts);
            self.programTypesLoaded(true);
        });

        Model.disbursementModeGet().then(function (response) {
            self.fetchedDisbursementMode(response.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel);
            self.disbursementModeLoaded(true);
        });

        Model.currencyget().then(function (response) {
            self.currencyLoaded(false);

            for (let i = 0; i < response.currencyList.length; i++) {
                self.currencyList.push({
                    code: response.currencyList[i].code,
                    description: response.currencyList[i].code
                });
            }

            ko.tasks.runEarly();
            self.currencyLoaded(true);
        });

        if (!params.rootModel.previousState) {

            self.queryParameter().criteria.push({
                operand: "relation",
                operator: "ENUM",
                value: ["COUNTER_PARTY"]
            });

            Model.counterPartiesget(JSON.stringify(self.queryParameter()), JSON.stringify(self.sortByParameter()), self.count()).then(function (response) {
                let responseData = null;

                if (response.associatedParties.length > 0) {
                    responseData = $.map(response.associatedParties, function (v) {
                        const newObj = {};

                        if (v.status !== "INITIATED" && v.status !== "CLOSED" && v.status !== "OTHERS") {
                            newObj.associatedPartyName = v.name;

                            newObj.associatedPartyId = {
                                value: v.id.value,
                                displayValue: v.id.displayValue
                            };

                            let address, addressArray;

                            if (v.address && v.address !== null && v.address.line1) {
                                address = v.address.line1;

                                if (v.address.line2) {
                                    addressArray = address.split(/(?=[\s\S])/);

                                    if (addressArray[addressArray.length - 1] !== ",") {
                                        address = address.concat(",");
                                    }

                                    address = address.concat(v.address.line2);
                                }

                                if (v.address.state) {
                                    addressArray = address.split(/(?=[\s\S])/);

                                    if (addressArray[addressArray.length - 1] !== ",") {
                                        address = address.concat(",");
                                    }

                                    address = address.concat(v.address.state);
                                }

                                if (v.address.country) {
                                    addressArray = address.split(/(?=[\s\S])/);

                                    if (addressArray[addressArray.length - 1] !== ",") {
                                        address = address.concat(",");
                                    }

                                    address = address.concat(v.address.country);
                                }

                                if (v.address.zipCode) {
                                    addressArray = address.split(/(?=[\s\S])/);

                                    if (addressArray[addressArray.length - 1] !== ",") {
                                        address = address.concat(",");
                                    }

                                    address = address.concat(v.address.zipCode);
                                }
                            } else {
                                address = "";
                            }

                            newObj.associatedPartyAddress = address;
                            newObj.borderColor = ko.observable("unselect-color");
                            newObj.isDisabled = ko.observable(false);

                            return newObj;
                        }
                    });

                    self.fetchedCounterparties(responseData);
                }

                for (let j = 0; j < self.fetchedCounterparties().length; j++) {
                    const parts = self.fetchedCounterparties()[j].associatedPartyName.split(/\s+/);

                    self.fetchedCounterparties()[j].associatedPartyInitials = "";
                    self.fetchedCounterparties()[j].selected = ko.observableArray([]);
                    self.fetchedCounterparties()[j].sequenceNo = j;

                    for (let i = 0; i < parts.length; i++) {
                        if (parts[i].length > 0 && parts[i] !== "") {
                            self.fetchedCounterparties()[j].associatedPartyInitials = self.fetchedCounterparties()[j].associatedPartyInitials + parts[i][0];
                        }

                        if (self.fetchedCounterparties()[j].associatedPartyInitials.length === 2) {
                            break;
                        }
                    }
                }

                if (self.modelInstance.associatedParties().length > 0) {
                    for (let i = 0; i < self.modelInstance.associatedParties().length; i++) {
                        for (let j = 0; j < self.fetchedCounterparties().length; j++) {

                            if (self.modelInstance.associatedParties()[i].id.value() === self.fetchedCounterparties()[j].associatedPartyId.value) {

                                if (self.isEditMode() && self.modelInstance.associatedParties()[i].outstandingInvoice) {
                                    self.fetchedCounterparties()[j].isDisabled(true);
                                }

                                self.fetchedCounterparties()[j].selected.push("checked");
                                self.fetchedCounterparties()[j].borderColor("select-color");
                                break;
                            }
                        }
                    }
                }
            });
        } else {
            self.fetchedCounterparties(params.rootModel.previousState.fetchedCounterparties);

            if (params.rootModel.previousState.editAssociatedParties) {
                self.selectedStepValue("create-program-link");
            }
        }

        self.createProgram = function () {
            return new Promise(function (resolve, reject) {
                Model.programpost(ko.toJSON(ko.mapping.toJS(self.modelInstance))).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };

        self.editProgram = function () {
            return new Promise(function (resolve, reject) {
                Model.programUpdate(self.modelInstance.programCode(), ko.toJSON(ko.mapping.toJS(self.modelInstance))).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };

        Model.mepartyget().then(function (response) {
            self.partyDetails(response);
            self.partyId(self.partyDetails().party.id.displayValue);
            self.partyName(self.partyDetails().party.personalDetails.fullName);
        });

        self.onClickViewAttributes = function () {
            $("#bannerContainer").trigger("openModal");
        };
    };
});