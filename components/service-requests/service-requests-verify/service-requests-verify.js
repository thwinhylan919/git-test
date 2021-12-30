define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/service-request-create",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojselectcombobox",
  "ojs/ojswitch",
  "ojs/ojlistview",
  "ojs/ojarraydataprovider"
], function(ko, ServiceRequestVerifyView, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;
    let i;

    self.resource = resourceBundle;
    ko.utils.extend(self, params.rootModel.params);

    self.getMessage = function() {
      let message;

      if (params.rootModel.confirmMessage) {
        message = params.rootModel.confirmMessage;
      } else {
        message = self.resource.defaultMessage;
      }

      return message;
    };

    self.formArray = ko.observableArray();
    self.transactionName = ko.observable(params.rootModel.params.requestName);
    self.userFormData = params.rootModel.params.dataArray;
    params.dashboard.headerName(params.rootModel.params.formHeader);
    params.baseModel.registerElement("confirm-screen");

    if (params.rootModel.params.formHeader) {
      self.transactionName(params.rootModel.params.formHeader);
    }

    self.displayData = ko.observableArray();
    self.viewId = ko.observable();
    self.displayData = self.userFormData;

    for (i = 0; i < self.userFormData.length; i++) {
      if (self.userFormData[i].type === "PDDP") {
        self.formArray().push({
          id: self.userFormData[i].name,
          type: self.userFormData[i].type,
          label: self.userFormData[i].label,
          values: self.userFormData[i].displayValues(),
          displayValues: self.userFormData[i].displayValues(),
          indirectionTypes: self.userFormData[i].indirectedValue
        });
      } else {
        self.formArray().push({
          id: self.userFormData[i].name,
          type: self.userFormData[i].type,
          label: self.userFormData[i].label,
          values: self.userFormData[i].values(),
          displayValues: self.userFormData[i].displayValues(),
          indirectionTypes: self.userFormData[i].indirectedValue
        });
      }
    }

    self.createRequest = function() {
      const payloadString = "{\"elements\":" + ko.toJSON(self.formArray()) + "}";

      payloadString.replace(/"/g, /\"/);
      params.rootModel.params.SRDefinitionDTO().requestData = payloadString;

      ServiceRequestVerifyView.addServiceRequestVerify(ko.toJSON(params.rootModel.params.SRDefinitionDTO())).done(function(data) {
        params.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.transactionName(),
          confirmScreenExtensions: {
            confirmScreenMsgEval: self.getMessage,
            taskCode: "SR_N_CRT",
            isSet: true,
            template: "service-request/service-request-confirm"
          }
        }, self);
      });
    };

    self.onBack = function() {
      self.goToPreview = ko.observable(true);
      self.viewId(params.rootModel.params.viewId);
      params.baseModel.registerComponent("service-requests-base-form", "service-requests");

      params.dashboard.loadComponent("service-requests-base-form", {
        viewId: self.viewId(),
        displayData: self.displayData
      }, self);
    };
  };
});
