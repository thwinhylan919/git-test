define([
    "knockout",
    "ojL10n!resources/nls/payment-peer-to-peer",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojknockout-validation"
], function(ko, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.p2ppaymentData = ko.observable();
        self.resource = ResourceBundle;

        Params.baseModel.registerElement([
            "row",
            "page-section"
        ]);

        Params.baseModel.registerComponent("review-payment-peer-to-peer-existing", "payments");

        if (self.stageTwo()) {
            Params.dashboard.loadComponent("review-payment-peer-to-peer-existing", {
                payeeDetails: self.payeeDetails,
                verifyPayment: self.verifyPayment,
                cancelPayment: self.cancelPayment,
                paymentId: self.paymentId,
                retainedData: self
            });
        }
    };
});