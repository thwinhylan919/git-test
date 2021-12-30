define([

  "knockout",

  "ojL10n!resources/nls/td-open",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(ko, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.locale=locale;
    rootParams.dashboard.headerName(self.locale.openTermDeposit.newDeposit);
    self.params.depositTypesLoaded(true);
  };
});