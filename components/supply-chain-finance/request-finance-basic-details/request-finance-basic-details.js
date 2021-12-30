define([
    "ojL10n!resources/nls/request-finance-global",
    "./model",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojlabel",
    "ojs/ojradioset"
], function (resourceBundle, Model, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        params.baseModel.registerElement("help");
        self.modelInstance = params.rootModel.modelInstance;
        self.showAssociatedParties = ko.observable(false);
        self.showPrograms = ko.observable(true);
        self.currencyLoaded = ko.observable(false);
        self.partyList = ko.observableArray();
        self.programNameList = ko.observableArray();
        self.currencyList = ko.observableArray();

        self.queryParameter = ko.observable({
            criteria: []
        });

        self.getPrograms = function (spokeId) {

            const jsonDataProgramStatus = self.nls.ProgramStatus,
                programStatusArray = [];

            Object.keys(jsonDataProgramStatus).forEach(function (key) {
                programStatusArray.push(key);
            });

            const promises = [];

            self.queryParameter().criteria = [];

            self.queryParameter().criteria.push({
                operand: "role",
                operator: "ENUM",
                value: ["S"]
            }, {
                operand: "associatedPartyList.associatedPartyKey.id",
                operator: "EQUALS",
                value: [spokeId]
            }, {
                operand: "status",
                operator: "EQUALS",
                value: programStatusArray
            });

            promises.push(Model.programsget(JSON.stringify(self.queryParameter())));

            self.queryParameter().criteria = [];

            self.queryParameter().criteria.push({
                operand: "role",
                operator: "ENUM",
                value: ["B"]
            }, {
                operand: "associatedPartyList.associatedPartyKey.id",
                operator: "EQUALS",
                value: [spokeId]
            }, {
                operand: "status",
                operator: "EQUALS",
                value: programStatusArray
            });

            promises.push(Model.programsget(JSON.stringify(self.queryParameter())));

            Promise.all(promises).then(function (array) {
                self.showPrograms(false);
                self.programNameList([]);

                let i;

                if (array[0] && array[0].programs) {

                    for (i = 0; i < array[0].programs.length; i++) {
                        self.programNameList.push({
                            code: array[0].programs[i].programCode,
                            label: array[0].programs[i].programName,
                            role: array[0].programs[i].role,
                            productCode: array[0].programs[i].programProduct ? array[0].programs[i].programProduct.productCode : "-",
                            relation: array[0].programs[i].relation
                        });
                    }

                }

                if (array[1] && array[1].programs) {

                    for (i = 0; i < array[1].programs.length; i++) {
                        self.programNameList.push({
                            code: array[1].programs[i].programCode,
                            label: array[1].programs[i].programName,
                            role: array[1].programs[i].role,
                            productCode: array[1].programs[i].programProduct ? array[1].programs[i].programProduct.productCode : "-",
                            relation: array[1].programs[i].relation
                        });
                    }

                }

                ko.tasks.runEarly();
                self.showPrograms(true);
            });
        };

        self.queryParameter().criteria.push({
            operand: "relation",
            operator: "ENUM",
            value: ["BOTH"]
        });

        Model.counterPartiesget(JSON.stringify(self.queryParameter())).then(function (response) {
            self.showAssociatedParties(false);
            self.partyList([]);

            if (response.associatedParties) {

                for (let i = 0; i < response.associatedParties.length; i++) {
                    self.partyList.push({
                        code: response.associatedParties[i].id.value,
                        label: response.associatedParties[i].name
                    });
                }

            }

            ko.tasks.runEarly();
            self.showAssociatedParties(true);

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

        if (self.modelInstance.payLoad.counterpartyId && self.modelInstance.payLoad.counterpartyId() !== null && self.modelInstance.payLoad.counterpartyId() !== "") {
            self.getPrograms(self.modelInstance.payLoad.counterpartyId());
        }

        const associatedPartySubscription = self.modelInstance.payLoad.counterpartyId.subscribe(function (newValue) {
                self.getPrograms(newValue);

                for (let i = 0; i < self.partyList().length; i++) {
                    if (self.partyList()[i].code === newValue) {
                        self.modelInstance.navData.associatedParty.name(self.partyList()[i].label);
                    }
                }

                self.modelInstance.navData.searchModified(true);
            }),
            programCodeSubscription = self.modelInstance.payLoad.programCode.subscribe(function (newValue) {
                for (let i = 0; i < self.programNameList().length; i++) {
                    if (self.programNameList()[i].code === newValue) {
                        self.modelInstance.navData.program.name(self.programNameList()[i].label);
                        self.modelInstance.payLoad.role(self.programNameList()[i].role);
                        self.modelInstance.validationData.productCode(self.programNameList()[i].productCode);
                        self.modelInstance.validationData.relation(self.programNameList()[i].relation);
                    }
                }

                self.modelInstance.navData.searchModified(true);
            });

        self.submitStepOne = function () {
            const tracker = document.getElementById("form_tracker");

            if (params.baseModel.showComponentValidationErrors(tracker)) {
                if (self.modelInstance.validationData.productCode() && self.modelInstance.validationData.productCode() !== "-") {
                    Model.productGet(self.modelInstance.validationData.productCode()).then(function (response) {
                        if (response.programProduct) {
                            if ((response.programProduct.debtor === "A" && self.modelInstance.validationData.relation() === "A") || (response.programProduct.debtor === "S" && self.modelInstance.validationData.relation() === "CP")) {
                                params.rootModel.dataLoaded(false);
                                params.rootModel.selectedComponent("request-finance-invoice-list");
                                ko.tasks.runEarly();
                                params.rootModel.dataLoaded(true);
                            } else {
                                params.baseModel.showMessages(null, [self.nls.programProductErrorMessage], "ERROR");
                            }
                        } else {
                            params.baseModel.showMessages(null, [self.nls.programProductErrorMessage], "ERROR");
                        }
                    });
                } else {
                    params.baseModel.showMessages(null, [self.nls.programProductValueErrorMessage], "ERROR");
                }
            }

        };

        self.clearStepOne = function () {
            params.rootModel.dataLoaded(false);

            self.modelInstance.payLoad.totalAmount.currency(null);
            self.modelInstance.navData.associatedParty(null);
            self.modelInstance.payLoad.counterpartyId(null);
            self.modelInstance.navData.program.name(null);
            self.modelInstance.payLoad.programCode(null);
            self.modelInstance.navData.financeFor("INVOICE");
            self.modelInstance.payLoad.role(null);

            ko.tasks.runEarly();

            params.rootModel.dataLoaded(true);
        };

        self.dispose = function () {
            associatedPartySubscription.dispose();
            programCodeSubscription.dispose();
        };
    };
});