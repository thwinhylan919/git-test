define([
  "ojs/ojcore",
  "knockout",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojaccordion",
  "ojs/ojlabel",
  "ojs/ojvalidationgroup",
  "ojs/ojdatetimepicker"
], function(oj, ko, ResourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.resource = ResourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.isRequired = params.rootModel.validation.mandatory;
    self.testInput = ko.observableArray();
    self.isDisabled = ko.observable(params.isDisabled);
    self.errorMessage = ko.observable();
    self.patternSelected = ko.observable("dd MMM yyyy");
    self.errorMessage(params.rootModel.errorMessage);

    if (params.formData) {
      self.testInput = params.formData.values;
      params.formData.displayValues()[0] = self.testInput()[0];
    }

    self.dateChange = function() {
      params.formData.displayValues()[0] = self.testInput()[0];
    };

    self.dateConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      pattern: self.patternSelected()
    }));
  };
});
