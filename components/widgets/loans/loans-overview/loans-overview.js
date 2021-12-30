define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/accounts-overview",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup"
], function (ko, LoanOverviewModel, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.accountsListLoaded = ko.observable(false);
        self.totalAmount = ko.observable();
        self.totalLoans = ko.observable();
        self.outstanding = ko.observable();
        self.currency = ko.observable();

        LoanOverviewModel.getLoanAccounts().then(function (data) {
            let totalLoans=0,
             totalAmount=0,
             totalOutstandingBalance=0;

                for (let i = 0; i < data.summary.items.length; i++){
            totalLoans += data.summary.items[i].count;
            totalAmount += data.summary.items[i].totalApprovedAmount.amount;
            totalOutstandingBalance+=data.summary.items[i].totalOutstandingBalance.amount;
                }

             self.totalAmount= totalAmount;
            self.totalLoans =totalLoans;
            self.outstanding = totalOutstandingBalance;
            self.currency = data.accounts[0].approvedAmount.currency;
            self.accountsListLoaded(true);
        });

    };
});