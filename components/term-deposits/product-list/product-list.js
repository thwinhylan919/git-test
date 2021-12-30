define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/td-open",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(ko, OpenTdModel, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.locale=locale;

    OpenTdModel.getDepositType().then(function(data) {
      self.params.setProductList(data);
    });
  };
});