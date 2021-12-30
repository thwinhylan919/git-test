define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/account-details",
    "ojs/ojknockout",
    "ojs/ojbutton",
    "ojs/ojchart",
    "ojs/ojvalidation"
], function(ko, componentModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.orientationValue = ko.observable("vertical");
        self.accountTransactionCurrency = ko.observable();
        self.nls = resourceBundle;
        self.pageData = ko.observable();
        self.nicknameDetails = ko.observable();
        self.dataLoaded = ko.observable(false);
        rootParams.dashboard.headerName(self.nls.accountDetails.labels.accountDetails);
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("account-transactions", "accounts");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerComponent("statement-request", "accounts");
        rootParams.baseModel.registerTransaction("cheque-book-request", "demand-deposits");
        rootParams.baseModel.registerComponent("cheque-status-inquiry", "demand-deposits");
        rootParams.baseModel.registerComponent("cheque-stop-unblock", "demand-deposits");
        rootParams.baseModel.registerComponent("quick-links", "widgets/dashboard");
        self.taskCode = ko.observable();
        self.selectedSettlementAccount = ko.observable(self.params.id ? self.params.id.value : null);
        self.additionalDetails = ko.observable();
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("action-header");
        self.balanceHeading = ko.observable("balances");
        self.limitsHeading = ko.observable("limits");
        self.facilitiesHeading = ko.observable("facilities");
        self.accountNumber = ko.observable();

        self.fetchDetails = function() {
            self.dataLoaded(false);

            componentModel.fetchAccountDetails(ko.utils.unwrapObservable(self.params.id.value)).done(function(data) {
                self.pageData(data.demandDepositAccountDTO);
                self.accountTransactionCurrency(data.demandDepositAccountDTO.currencyCode);
                self.nicknameDetails(data.demandDepositAccountDTO);
                self.dataLoaded(true);
            });
        };

        self.fetchDetails();

        self.selectedSettlementAccount.subscribe(function(newValue) {
            self.accountNumber(newValue);
            self.dataLoaded(false);

            componentModel.fetchAccountDetails(newValue).done(function(data) {
                self.pageData(data.demandDepositAccountDTO);
                self.nicknameDetails(data.demandDepositAccountDTO);
                self.dataLoaded(true);
            });
        });
    };
});