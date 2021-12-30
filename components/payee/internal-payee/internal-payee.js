define([
    "knockout",
    "ojL10n!resources/nls/internal-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton"
], function(ko, ResourceBundle, commonPayee) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.internal = ko.toJS(Params.model);
        self.validationTracker = Params.validator;
        self.payeeDetails = ko.observable(self.internal);
        self.payments = commonPayee.payments;
        self.payments.payee.internal = ResourceBundle.payments.payee.internal;

        Params.baseModel.registerElement([
            "internal-account-input"
        ]);
    };
});