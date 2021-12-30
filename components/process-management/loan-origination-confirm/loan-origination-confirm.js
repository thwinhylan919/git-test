define([
  "ojL10n!resources/nls/loan-origination-confirm",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojbutton"
], function (resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    params.baseModel.registerComponent("loan-film-strip", "process-management");
    params.baseModel.registerComponent("application-tracker-film-strip", "process-management");
    self.nls = resourceBundle;

    let parameters = {};

    if (params.rootModel.params.mode && params.rootModel.params.mode === "draft") {
      params.rootModel.params.data.referenceNumber = params.rootModel.params.data.processManagementDTO.refId;

      parameters = {
        jqXHR: {
          responseJSON: params.rootModel.params.data,
          status: 201
        },
        txnRefId: params.rootModel.params.data.processManagementDTO.refId,
        transactionName: self.nls.header,
        confirmScreenExtensions: {
          isSet: true,
          template: "confirm-screen/loan-origination-template",
          buttonTemplate: "confirm-screen/loan-origination-template",
          resource: self.nls
        }
      };
    } else if (params.rootModel.params.data.jsonNode) {
      parameters = {
        jqXHR: params.rootModel.params.jqXhr,
        transactionName: self.nls.header,
        hostReferenceNumber: params.rootModel.params.data.jsonNode.data.applicationNumber,
        confirmScreenExtensions: {
          isSet: true,
          template: "confirm-screen/loan-origination-template",
          buttonTemplate: "confirm-screen/loan-origination-template",
          resource: self.nls
        }
      };

    } else {
      parameters = {
        jqXHR: params.rootModel.params.jqXhr,
        transactionName: self.nls.header,
        confirmScreenExtensions: {
          isSet: true,
          template: "confirm-screen/loan-origination-template",
          buttonTemplate: "confirm-screen/loan-origination-template",
          resource: self.nls
        }
      };
    }

    params.dashboard.loadComponent("confirm-screen", parameters, self);

    self.loadFilmStrip = function () {
      params.dashboard.loadComponent("loan-film-strip", self);
    };

    self.loadAppTracker = function () {
      params.dashboard.loadComponent("application-tracker-film-strip", self);
    };
  };
});