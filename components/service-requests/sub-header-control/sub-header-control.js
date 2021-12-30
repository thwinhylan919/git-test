define([

  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojvalidationgroup"
], function(ko, $, ResourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.resource = ResourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.id = params.id;
    self.index = params.index;

    let tracker;

    self.showSave = ko.observable(true);
    self.location = parseInt(self.id.split("_")[1]);

    $(document).on("focusin", "#" + self.id + 1, function() {
      if (!self.showSave()) {
        self.showSave(true);
      }
    });

    self.formField = ko.observable({
      name: null,
      type: "SBH",
      sequenceNumber: null,
      values: [{
        code: null,
        description: null
      }]
    });

    if (params.payload) {
      self.formField(params.payload);
    }

    self.saveSubHeader = function() {
      tracker = document.getElementById(self.id + "track");

      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }

      params.rootModel.storePayload(self);
      self.showSave(false);
    };

    self.deleteSubHeader = function() {
      params.rootModel.deleteComponent(self);
    };
  };
});