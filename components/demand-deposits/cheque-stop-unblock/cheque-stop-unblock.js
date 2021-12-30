define([
  "knockout",
    "./model",
    "ojL10n!resources/nls/cheque-stop-unblock",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojswitch",
  "ojs/ojradioset",
  "ojs/ojinputtext",
  "ojs/ojvalidationgroup"
], function(ko, StopUnblockChequeModel, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.chequeNo = ko.observable();
    self.chequeStopUnblockLocale = locale;
    self.chequeInstructionType = ko.observable("STOP");
    self.actionSelected = ko.observable("Stop");
    self.validationTracker = ko.observable();
    self.accountNumber = ko.observable();
    self.additionalDetails = ko.observable();
    self.selectedAccount = ko.observable();
    self.defaultOption = ko.observable("Number");
    ko.utils.extend(self, rootParams.rootModel);
    self.dispose = null;

    const confirmScreenExtensions = {};

    if (self.params.id) {
      self.accountNumber(self.params.id.value);

      self.additionalDetails({
        account: {
          id: self.params.id
        }
      });
    }

    rootParams.dashboard.headerName(locale.compName.compName);
    rootParams.baseModel.registerElement("account-input");

    const getNewKoModel = function() {
      return ko.mapping.fromJS(StopUnblockChequeModel.getNewModel());
    };

    self.stopUnblockChequeModelInstance = self.stopUnblockChequeModelInstance || getNewKoModel();
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerComponent("cheque-details-range", "demand-deposits");
    rootParams.baseModel.registerComponent("review-cheque-stop-unblock", "demand-deposits");

    self.review = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("unblockCheque"))) {
        return;
      }

      self.stopUnblockChequeModelInstance.stopUnblockCheque.startChequeNumber(self.stopUnblockChequeModelInstance.chequeNo.startChequeNumber());
      self.stopUnblockChequeModelInstance.stopUnblockCheque.endChequeNumber(self.stopUnblockChequeModelInstance.chequeNo.endChequeNumber());
      self.stopUnblockChequeModelInstance.stopUnblockCheque.chequeInstructionType(self.chequeInstructionType());

      rootParams.dashboard.loadComponent("review-cheque-stop-unblock", {
        mode: "review",
        data: self.stopUnblockChequeModelInstance.stopUnblockCheque,
        confirmScreenExtensions: confirmScreenExtensions,
        accountNumber: self.accountNumber
      }, self);
    };

    self.taxonomy = rootParams.dashboard.getTaxonomyDefinition("com.ofss.digx.app.dda.dto.instructions.cheque.RevokeStopChequeInstructionDTO");

    self.switchAction = function(event) {
      if (event.detail.value === "Stop") {
        self.actionSelected("Stop");
        self.chequeInstructionType("STOP");
      } else {
        self.actionSelected("Unblock");
        self.chequeInstructionType("REVOKE");
      }
    };
  };
});