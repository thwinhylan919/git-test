define([
  "knockout",
  "ojL10n!resources/nls/location-create",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext"
], function(ko, locale) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = locale;
    self.id = ko.observable();
    self.atm = ko.observable();
    self.branch = ko.observable();
    self.type = ko.observable();
    params.baseModel.registerComponent("location-add", "location-maintenance");

    self.search = function() {
      if (self.atm()) {
        self.type("ATM");
      } else
        {self.type("BRANCH");}

      params.dashboard.loadComponent("location-add", {});
    };
  };
});
