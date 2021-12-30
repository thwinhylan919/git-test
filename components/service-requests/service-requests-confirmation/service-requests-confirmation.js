define([
    "knockout",
      "ojL10n!resources/nls/service-requests-configuration",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function(ko, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.model = Params.model;
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    self.flowsLoaded = ko.observable(false);
    Params.dashboard.headerName(self.resource.serviceRequest.detailHeader);
  };
});