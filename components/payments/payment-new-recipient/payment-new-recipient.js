define([
    "knockout",
    "ojL10n!resources/nls/payment-new-recipient",
    "ojs/ojinputnumber",
    "ojs/ojknockout-validation"
], function(ko, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        self.payments = ResourceBundle.payments;
        self.transferMode = ko.observable();
        self.validationTracker = ko.observable();
        self.isPeerToPeer = ko.observable(true);
        rootParams.baseModel.registerComponent("payment-peer-to-peer", "payments");

        self.transferModeChange = function(event) {
            if (event.detail.value) {
                self.isPeerToPeer(event.detail.value === "EMAIL" || event.detail.value === "MOBILE");
            }
        };

        self.transferModeArray = ko.observableArray([{
                code: "EMAIL",
                value: self.payments.email
            },
            {
                code: "MOBILE",
                value: self.payments.mobile
            },
            {
                code: "BANKACCOUNT",
                value: self.payments.bankAccount
            }
        ]);
    };
});