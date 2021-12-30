define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/domestic-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojbutton"
], function(oj, ko, $, domesticPayeeModel, ResourceBundle, commonPayee) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.domestic = ko.toJS(Params.model);
        self.validationTracker = Params.validator;
        self.payments = commonPayee.payments;
        self.payments.payee.domestic = ResourceBundle.payments.payee.domestic;
        self.payeeDetails = ko.observable(self.domestic);
        self.domesticPayeeType = ko.observable("INDIA");
        self.network("IFSC");
        self.groupValid = ko.observable();
        self.dummyAdditionalBankDetails = ko.observable();
        self.refreshLookup(true);

        self.openLookup = function() {
            $("#menuButtonDialog").trigger("openModal");
        };

        Params.baseModel.registerElement("bank-look-up");

        self.validateCode = [{
            validate: function(value) {
                if (value.length > 11 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.payee.domestic.invalidError));
                }
            }
        }];

        const dummyAdditionalBankDetailsSubscribe = self.dummyAdditionalBankDetails.subscribe(function(data) {
            self.additionalBankDetails(data);
        });

        self.dispose = function() {
            dummyAdditionalBankDetailsSubscribe.dispose();
        };

        self.verifyCode = function() {
            const tracker = document.getElementById("verify-code-tracker");

            if (tracker.valid === "valid") {
                domesticPayeeModel.getBankDetailsDCC(self.bankDetailsCode()).done(function(data) {
                    self.additionalBankDetails(data);
                });
            }
        };
    };
});