define([
  "ojL10n!resources/nls/account-summary",
  "ojL10n!resources/nls/td-summary",
  "ojL10n!resources/nls/loan-summary"
], function(locale, tdLocale, loanLocale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.accounts = rootParams.rootModel.accounts;
    self.module = rootParams.moduleData;
    self.CSA = locale;
    self.TRD = tdLocale;
    self.LON = loanLocale;
    rootParams.baseModel.registerComponent("account-summary", "widgets/demand-deposits");
    rootParams.baseModel.registerComponent("td-summary", "widgets/term-deposits");
    rootParams.baseModel.registerComponent("loan-summary", "widgets/loans");
  };
});
