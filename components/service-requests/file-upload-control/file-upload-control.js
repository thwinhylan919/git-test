define([

  "knockout",

  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojvalidationgroup",
  "ojs/ojlabel",
  "ojs/ojradioset"
], function(ko, ResourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.resource = ResourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.id = params.id;
    self.index = params.index;
    self.buttonShow = ko.observable(true);
    self.uniqueId = ko.observable();
    self.isDisabled = ko.observable(false);
    self.location = parseInt(self.id.split("_")[1]);

    if (params.id) {
      self.uniqueId(params.id);
    }

    self.isDetails = ko.observable(true);

    let tracker;

    self.formField = ko.observable({
      type: "FFFU",
      name: null,
      label: null,
      hintText: null,
      errorMessage: null,
      sequenceNumber: null,
      validation: {
        minLength: null,
        maxLength: null,
        mandatory: ko.observable(true),
        textBoxValidationType: null
      }
    });

    if (params.payload) {
      self.isDetails(false);
      self.formField().type = params.payload.type;
      self.formField().name = params.payload.name;
      self.formField().label = params.payload.label;
      self.formField().hintText = params.payload.hintText;
      self.formField().errorMessage = params.payload.errorMessage;
      self.formField().sequenceNumber = params.payload.sequenceNumber;
      self.formField().validation = params.payload.validation;
      self.formField().validation.mandatory = ko.observable(params.payload.validation.mandatory());
      self.isDetails(true);
    }

    if (params.rootModel.type) {
      self.formField().type = params.rootModel.type;
      self.formField().name = params.rootModel.name;
      self.formField().label = params.rootModel.label;
      self.formField().hintText = params.rootModel.hintText;
      self.formField().errorMessage = params.rootModel.errorMessage;
      self.formField().sequenceNumber = params.rootModel.sequenceNumber;
      self.formField().validation = params.rootModel.validation;
      self.formField().validation.mandatory = ko.observable(params.rootModel.validation.mandatory());
      self.isDisabled(true);
      self.isDetails(true);
      self.buttonShow(false);
    }

    self.saveFileUpload = function() {
      tracker = document.getElementById(self.id + "track");

      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }

      self.isDetails(false);
      params.rootModel.storePayload(self);
    };

    self.copyFileUpload = function() {
      params.rootModel.copyComponent(self);
    };

    self.deleteFileUpload = function() {
      params.rootModel.deleteComponent(self);
    };

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
  };
});