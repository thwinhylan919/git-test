define([
  "knockout",
  "ojL10n!resources/nls/dashboard-new-registered",
  "ojs/ojselectcombobox",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojknockout",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojavatar",
  "ojs/ojmodel",
  "ojs/ojcollectiontabledatasource",
  "ojs/ojpopup",
  "ojs/ojdialog",
  "ojs/ojlabel",
  "ojs/ojselectcombobox", "ojs/ojdatetimepicker", "ojs/ojradioset", "ojs/ojcheckboxset"

], function(ko, locale) {
  "use strict";

  return function(params) {
    const self = this;

    self.loadComponent = ko.observable();
    self.loadModule = ko.observable();
    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = locale;
    params.baseModel.registerComponent("aggregate-accounts-list", "account-aggregation");

    self.SelectBank = function() {
      params.dashboard.loadComponent("aggregate-accounts-list", {});
    };

  };
});