define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/account-type-dialog",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function(ko, $, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.payments = ResourceBundle.payments;
        $("#choiseDialog").trigger("openModal");
        Params.baseModel.registerComponent("demand-draft-payee", "payee");
        Params.baseModel.registerComponent("bank-account-payee", "payee");
        self.accountType = ko.observable("bank-account-payee");
        self.modalCloseHandler = Params.modalCloseHandler;

        self.createPayee = function() {
            $("#choiseDialog").trigger("closeModal");
            self.selectedTab = "";

            Params.dashboard.loadComponent("manage-accounts", {
                applicationType: "payee",
                defaultTab: self.accountType()
            }, self);
        };
    };
});