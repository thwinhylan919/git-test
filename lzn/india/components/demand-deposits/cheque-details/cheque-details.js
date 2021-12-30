define([
  "knockout",
  "ojL10n!resources/nls/cheque-details",
  "ojs/ojvalidation",
  "ojs/ojradioset",
  "ojs/ojknockout-validation"
], function (ko, locale) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.locale = locale;
    self.chequeNo = rootParams.chequeNo;
    self.validationTracker = rootParams.validator;
    self.optionSelected = rootParams.defaultOption;

    self.selectChequeDetails = function (event) {
      self.optionSelected("Number");
      self.chequeNo.startChequeNumber(null);
      self.chequeNo.endChequeNumber(null);
    };
  };
});