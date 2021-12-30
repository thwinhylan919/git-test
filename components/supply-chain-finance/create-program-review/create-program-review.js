define([
    "ojL10n!resources/nls/create-program-review",
    "knockout",
    "./model",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojcheckboxset",
    "ojs/ojbutton",
    "ojs/ojavatar",
    "ojs/ojpagingtabledatasource"
], function (resourceBundle, ko, Model, oj) {
    "use strict";

    return function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;

        self.selectedCounterParties = ko.observableArray();
        self.headerText = ko.observable();
        self.disbursementModeValue = ko.observable();
        self.disbursementModeLoaded = ko.observable(false);

        if (params.rootModel.params.mode && params.rootModel.params.mode === "approval") {
            self.modelInstance = params.rootModel.params.data;
            self.counterPartiesList = params.rootModel.params.data.associatedParties;
            self.isVisible = ko.observable(false);

            if (self.modelInstance.autoAcceptance) {
                self.autoAcceptanceApplicable = ko.observable(self.nls.autofields.yes);
            } else {
                self.autoAcceptanceApplicable = ko.observable(self.nls.autofields.no);
            }

            if (self.modelInstance.autoFinance) {
                self.autoFinanceApplicable = ko.observable(self.nls.autofields.yes);
                self.disbursementModeCode = ko.observable(self.modelInstance.disbursementMode);
            } else {
                self.autoFinanceApplicable = ko.observable(self.nls.autofields.no);
            }

            let initials;

            for (let i = 0; i < self.counterPartiesList.length; i++) {

                const names = self.counterPartiesList[i].name.split(/\s+/);

                if (names.length > 0) {
                    initials = names[0].substring(0, 1).toUpperCase();

                    if (names.length > 1) {
                        initials += names[1].substring(0, 1).toUpperCase();
                    }
                }

                self.selectedCounterParties().push({
                    associatedPartyInitials: initials,
                    associatedPartyName: self.counterPartiesList[i].name,
                    associatedPartyId: self.counterPartiesList[i].id
                });
            }

            (function (extensionObject) {
                extensionObject.isSet = true;
                extensionObject.data = self.params.data;
                extensionObject.template = "supply-chain-finance/create-program-review/create-program-cards-checker";

                extensionObject.customFields = {
                    resourceBundle: self.nls,
                    programName: self.modelInstance.programName,
                    programId: self.modelInstance.programCode
                };
            })(self.params.confirmScreenExtensions);

        } else {
            self.modelInstance = params.rootModel.params.data;
            self.counterPartiesList = params.rootModel.params.fetchedCounterparties;
            self.isVisible = ko.observable(true);

            for (let i = 0; i < self.counterPartiesList.length; i++) {
                if (self.counterPartiesList[i].selected().length !== 0) {
                    self.selectedCounterParties().push(self.counterPartiesList[i]);
                }
            }

            if (self.modelInstance.autoAcceptance()) {
                self.autoAcceptanceApplicable = ko.observable(self.nls.autofields.yes);
            } else {
                self.autoAcceptanceApplicable = ko.observable(self.nls.autofields.no);
            }

            if (self.modelInstance.autoFinance()) {
                self.autoFinanceApplicable = ko.observable(self.nls.autofields.yes);
                self.disbursementModeCode = ko.observable(self.modelInstance.disbursementMode());
            } else {
                self.autoFinanceApplicable = ko.observable(self.nls.autofields.no);
            }
        }

        if (self.autoFinanceApplicable() === "Yes") {
            Model.disbursementModeGet().then(function (response) {
                for (let i = 0; i < response.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel.length; i++) {
                    if (self.disbursementModeCode() === response.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel[i].code) {
                        self.disbursementModeValue(response.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel[i].description);
                        break;
                    }
                }

                self.disbursementModeLoaded(true);
            });
        }

        params.baseModel.registerComponent("select-role", "supply-chain-finance");

        self.currentCpValue = ko.observableArray(["checked"]);
        self.checkBoxDisabled = ko.observable("true");

        self.onClickEditProgram = function (data) {
            if (data === "editLinkedParties") {
                params.rootModel.params.editAssociatedParties = true;
            }

            params.rootModel.params.fetchedCounterparties = self.counterPartiesList;
            params.dashboard.hideDetails();
        };

        self.goToConfirmScreen = function (data) {
            const confirmMessage = self.nls.confirmScreen.confirmMessage;
            let transactionName = self.nls.componentHeader;

            if (params.rootModel.params.isEditMode && params.rootModel.params.isEditMode()) {
                transactionName = self.nls.editComponentHeader;
            }

            params.dashboard.loadComponent("confirm-screen", {
                transactionResponse: data,
                transactionName: transactionName,
                customFields: {
                    resourceBundle: self.nls,
                    programName: self.modelInstance.programName,
                    programId: self.modelInstance.programCode
                },
                confirmScreenExtensions: {
                    confirmScreenMsgEval: function (data) {
                        return confirmMessage;
                    },
                    isSet: true,
                    template: "supply-chain-finance/create-program-review/create-program-cards"
                }
            });
        };

        if ((params.rootModel.params.isEditMode && params.rootModel.params.isEditMode()) || (params.rootModel.params.mode && params.rootModel.params.mode === "approval" && params.rootModel.params.data.status && params.rootModel.params.data.status !== null && params.rootModel.params.data.status !== "")) {
            params.dashboard.headerName(self.nls.editComponentHeader);
            self.headerText(self.nls.reviewScreen.editHeader);
        } else {
            params.dashboard.headerName(self.nls.componentHeader);
            self.headerText(self.nls.reviewScreen.reviewHeader);
        }

        self.dataSource56 = new oj.ArrayTableDataSource(self.selectedCounterParties, "id.value");

        self.onClickConfirm = function () {
            if (params.rootModel.params.isEditMode && params.rootModel.params.isEditMode()) {
                params.rootModel.params.editProgram().then(function (data) {
                    self.goToConfirmScreen(data);
                });
            } else {
                params.rootModel.params.createProgram().then(function (data) {
                    self.goToConfirmScreen(data);
                });
            }
        };

        self.onClickBack = function () {
            params.rootModel.params.editAssociatedParties = true;
            params.rootModel.params.fetchedCounterparties = self.counterPartiesList;
            params.dashboard.hideDetails();
        };

        self.onClickCancel = function () {
            params.dashboard.switchModule(true);
        };
    };
});