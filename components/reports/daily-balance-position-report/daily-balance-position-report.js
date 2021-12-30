define([
    "knockout",

  "ojL10n!resources/nls/wallets-report",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function(ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle.wallets;
    self.validationTracker = ko.observable();
  };
});