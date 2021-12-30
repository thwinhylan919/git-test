define([
  "knockout",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojradioset",
  "ojs/ojselectcombobox"
], function(ko, ResourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.resource = ResourceBundle;
    self.isDisabled = ko.observable(params.isDisabled);
    self.formData = ko.observable(false);
    self.testInput = ko.observableArray();
    self.isRequired = params.rootModel.validation.mandatory;
    self.dropListValues = params.rootModel.values;
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);

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

    if (self.isDisabled() === true) {
      self.formData(true);
    }

    if (params.formData) {
      self.testInput = params.formData.values;
      params.formData.displayValues = params.formData.values;
    }

    if (self.isDisabled() === false) {
      self.formData(true);
    }
  };
});