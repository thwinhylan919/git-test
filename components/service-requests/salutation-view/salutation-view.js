define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojradioset",
  "ojs/ojselectcombobox"
], function(ko, $, SalutationModel, ResourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.resource = ResourceBundle;
    self.labelName = ko.observable();
    self.isDisabled = ko.observable(params.isDisabled);
    self.formData = ko.observable(false);
    self.salutationList = ko.observableArray();
    self.displayValue = ko.observableArray();
    self.testInput = ko.observableArray();
    self.isRequired = params.rootModel.validation.mandatory;
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);

    if (self.isDisabled() === true) {
      self.formData(true);
    }

    if (params.formData) {
      self.testInput = params.formData.values;
    }

    self.valueChange = function() {
      self.displayValue = params.formData.displayValues;

      let j;

      for (j = 0; j < self.salutationList().length; j++) {
        if (self.salutationList()[j].code === self.testInput()[0]) {
          self.displayValue()[0] = self.salutationList()[j].description;
        }
      }
    };

    if (self.isDisabled() === false) {
      SalutationModel.getSalutationData().done(function(data) {
        $("#salutation").empty();

        const len = data.enumRepresentations[0].data.length;
        let i;

        for (i = 0; i < len; i++) {
          self.salutationList().push({
            code: data.enumRepresentations[0].data[i].code,
            description: data.enumRepresentations[0].data[i].description
          });
        }

        self.formData(true);
      });
    }
  };
});