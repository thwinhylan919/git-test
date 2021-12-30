define([

  "knockout",

  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojvalidationgroup",
  "ojs/ojselectcombobox",
  "ojs/ojradioset"
], function(ko, ResourceBundle) {
  "use strict";

  return function(params) {
    const self = this;
    let tracker;

    ko.utils.extend(self, params.rootModel);
    self.id = params.id;
    self.index = params.index;
    self.resource = ResourceBundle;
    self.uniqueId = ko.observable();
    self.buttonShow = ko.observable(true);
    self.location = parseInt(self.id.split("_")[1]);
    self.selectedOption = ko.observable();
    self.isDetails = ko.observable(true);
    self.isDisabled = ko.observable(false);

    if (params.id) {
      self.uniqueId(params.id);
    }

    self.formField = ko.observable({
      type: "PDCS",
      name: null,
      label: null,
      hintText: null,
      errorMessage: null,
      sequenceNumber: null,
      validation: {
        mandatory: ko.observable(true)
      },
      values: []
    });

    self.showHideDetails = function() {
      if (!self.isDetails()) {
        self.isDetails(true);
      } else {
        tracker = document.getElementById(self.id + "track");

        if (!params.baseModel.showComponentValidationErrors(tracker)) {
          return;
        }

        self.isDetails(false);
      }
    };

    self.optionList = ko.observableArray([{
        code: "country1",
        description: ko.observable()
      },
      {
        code: "country2",
        description: ko.observable()
      },
      {
        code: "country3",
        description: ko.observable()
      }
    ]);

    if (params.payload) {
      self.formField().type = params.payload.type;
      self.formField().name = params.payload.name;
      self.formField().label = params.payload.label;
      self.formField().errorMessage = params.payload.errorMessage;
      self.formField().sequenceNumber = params.payload.sequenceNumber;
      self.formField().validation = params.payload.validation;
      self.formField().validation.mandatory = ko.observable(params.payload.validation.mandatory());
      self.optionList().splice(0, self.optionList().length);
    }

    if (params.rootModel.type) {
      self.formField().type = params.rootModel.type;
      self.formField().name = params.rootModel.name;
      self.formField().label = params.rootModel.label;
      self.formField().errorMessage = params.rootModel.errorMessage;
      self.formField().sequenceNumber = params.rootModel.sequenceNumber;
      self.formField().validation = params.rootModel.validation;
      self.formField().validation.mandatory = ko.observable(params.rootModel.validation.mandatory());
      self.optionList().splice(0, self.optionList().length);
      self.isDisabled(true);
      self.buttonShow(false);
    }

    self.saveCountryStates = function() {
      tracker = document.getElementById(self.id + "track");

      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }

      self.isDetails(false);
      params.rootModel.storePayload(self);
    };

    self.deleteCountryStates = function() {
      params.rootModel.deleteComponent(self);
    };
  };
});