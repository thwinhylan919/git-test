define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/file-identifier-edit",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpopup"
], function(ko, FUIDModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel.params);
        self.Nls = resourceBundle.fileIdentifierEdit;
        rootParams.dashboard.headerName(self.Nls.fIMaintenance);

        const getNewKoModel = function() {
            const KoModel = FUIDModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.validationTracker = ko.observable();
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.debitAccountNumbers = ko.observableArray();
        self.isDebitAccountsLoaded = ko.observable(false);
        self.debitAccountsMap = {};

        self.back = function() {
            history.go(-1);
        };

        self.FUIDUpdateModel = getNewKoModel().FUIDDetailsUpdateModel;
        self.FUIDUpdateModel.description(self.selectedFUID().description);

        if (self.partyDetail) {
            self.FUIDUpdateModel.partyId(self.partyDetail.party.value());
        } else {
            self.FUIDUpdateModel.partyId("ADMIN");
        }

        self.FUIDUpdateModel.templateId(self.selectedFUID().templateId);
        self.FUIDUpdateModel.fileIdentifier(self.selectedFUID().fileIdentifier);
        self.FUIDUpdateModel.approvalType(self.selectedFUID().approvalType);

        if (self.selectedFUID().debitAccountNumber.value) { self.FUIDUpdateModel.debitAccountNumber([self.selectedFUID().debitAccountNumber.value]); }

        self.FUIDUpdateModel.partialProcessingTolerance(self.selectedFUID().partialProcessingTolerance);
        self.FUIDUpdateModel.maxNoOfRecords(self.selectedFUID().maxNoOfRecords);

        if (self.partyDetail) {
            FUIDModel.listDebitAccountNumbers(self.partyDetail.party.value()).done(function(data) {
                for (let i = 0; i < data.accounts[0].accountsList.length; i++) {
                    self.debitAccountsMap[data.accounts[0].accountsList[i].accountNumber.value] = data.accounts[0].accountsList[i].accountNumber.displayValue;

                    self.debitAccountNumbers.push({
                        displayValue: data.accounts[0].accountsList[i].accountNumber.displayValue,
                        code: data.accounts[0].accountsList[i].accountNumber.value
                    });
                }

                self.isDebitAccountsLoaded(true);
            });
        }

        self.save = function() {
            self.stageOne(false);
            self.stageTwo(true);
        };

        self.confirm = function() {
            if (self.FUIDUpdateModel.debitAccountNumber()) { self.FUIDUpdateModel.debitAccountNumber(self.FUIDUpdateModel.debitAccountNumber() + ""); }

            const updateFUIDPayload = ko.toJSON(self.FUIDUpdateModel);

            FUIDModel.updateFUIDDetails(updateFUIDPayload, self.FUIDUpdateModel.fileIdentifier(), self.FUIDUpdateModel.partyId()).done(function(data, status, jqXhr) {
                self.stageTwo(false);

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.Nls.transactionName
                }, self);
            });
        };

        self.cancel = function() {
            self.stageOne(true);
            self.stageTwo(false);
        };
    };
});