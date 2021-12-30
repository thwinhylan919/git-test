define([

  "knockout",

  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojlabel",
  "ojs/ojradioset"
], function(ko, ResourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.resource = ResourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);
    self.isDisabled = ko.observable(params.isDisabled);
    self.testInput = ko.observableArray();
    self.isRequired = params.rootModel.validation.mandatory;

    let j;

    for (j = 0; j < self.values.length - 1; j++) {
      for (let k = j + 1; k < self.values.length; k++) {
        if (self.values[j].sequenceNumber > self.values[k].sequenceNumber) {
          const temp = self.values[j];

          self.values[j] = self.values[k];
          self.values[k] = temp;
        }
      }
    }

    if (params.formData) {
      self.testInput = params.formData.values;
      params.formData.displayValues = params.formData.values;
    }
  };
});