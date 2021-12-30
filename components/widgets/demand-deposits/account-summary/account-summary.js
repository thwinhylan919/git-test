define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/account-summary",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, AccountSummaryModel, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.nls = resourceBundle;
        self.accountDetaislLoaded = ko.observable(false);
        self.actionHeaderHeading = self.nls.pageTitle.accountSummaryTitle;
        self.selectedValue = ko.observable();
        self.conventionalAccountsAvailable = ko.observable(false);
        self.islamicAccountsAvailable = ko.observable(false);

        const accountDataSource = ko.observableArray();
        let accountResponse;

        self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(accountDataSource, { idAttribute: "accountId" }));

        self.typeOfAccounts = [{
            id: "CON",
            label: self.nls.accountSummary.conventionalAccount
        }, {
            id: "ISL",
            label: self.nls.accountSummary.islamicAccount
        }];

        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerComponent("account-details", "demand-deposits");
        rootParams.baseModel.registerComponent("td-corporate-details", "term-deposits");

        self.selectedAccountTypeChangedHandler = function (event) {
            accountDataSource.removeAll();

            ko.utils.arrayPushAll(accountDataSource, accountResponse.filter(function (item) {

                return item.module.indexOf(event.detail.value) > -1;
            }));
        };

        function createDataSource(accounts) {
            accountResponse = accounts;

            accountResponse.forEach(function (element) {
                element.accountId = element.id.value;
                element.productName = element.id.displayValue;

                element.rawAvailableBalance = element.equivalentAvailableBalance.amount;

                if (element.module === "CON") {
                    self.conventionalAccountsAvailable(true);
                } else if (element.module === "ISL") {
                    self.islamicAccountsAvailable(true);
                }

            });

            if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
                accountDataSource.removeAll();
                ko.utils.arrayPushAll(accountDataSource, accountResponse);
            }
        }

        if (!(rootParams.data && rootParams.data.accountList)) {
            AccountSummaryModel.getAccountDetails().then(function (data) {

                createDataSource(data.accounts);

            });

        } else {
            createDataSource(rootParams.data.accountList);
        }

        self.showAccountDetails = function (data) {
            rootParams.dashboard.loadComponent("account-details", data);
        };

        self.downloadAccounts = function (data) {
            AccountSummaryModel.downloadAccounts(data);
        };
    };
});