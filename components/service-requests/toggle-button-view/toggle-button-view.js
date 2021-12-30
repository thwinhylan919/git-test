define([

  "knockout",

  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojlabel",
  "ojs/ojradioset",
  "ojs/ojbutton"
], function(ko, ResourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.resource = ResourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);
    self.isDisabled = ko.observable(params.isDisabled);
    self.isRequired = params.rootModel.validation.mandatory;

    if (params.formData) {
      self.testInput = params.formData.values;
    }
  };
});