define([

  "knockout",

  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion"
], function(ko, ResourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = ResourceBundle;
    self.label = ko.observable(params.rootModel());
  };
});