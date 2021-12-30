define([
  "knockout",
"jquery",
"./model",
  "ojL10n!resources/nls/merchant",
"ojs/ojinputnumber",
"ojs/ojinputtext",
"ojs/ojselectcombobox",
"ojs/ojcheckboxset",
"ojs/ojlistview",
"ojs/ojtable",
"ojs/ojpagingcontrol",
"ojs/ojpagingtabledatasource",
"ojs/ojarraytabledatasource",
"ojs/ojknockout-validation",
"ojs/ojbutton"
], function(ko, $, merchantModel, ResourceBundle) {
"use strict";

return function(Params) {
  const self = this;

  ko.utils.extend(self, Params.rootModel);
  self.resource = ResourceBundle;
  self.userAccountFlagArray = ko.observableArray();
  self.commissionAccountFlagArray = ko.observableArray();
  self.viewMode = ko.observable(Params.rootModel.params.viewMode);
  self.reviewMode = ko.observable(Params.rootModel.params.reviewMode);
  self.stageReview = ko.observable(false);
  self.refresh = ko.observable(true);
  self.stageOne = ko.observable(false);
  self.merchantCode = self.params.merchantCode;
  self.merchantPayload = ko.observable(Params.rootModel.params.payload);
  self.code = ko.observable(self.merchantPayload().code()) || ko.observable();
  self.remittanceType = ko.observable(self.merchantPayload().remittanceType()) || ko.observable("OUTWARD");
  self.description = ko.observable(self.merchantPayload().description()) || ko.observable();
  self.merchantAccount = ko.observable(self.merchantPayload().merchantAccount()) || ko.observable();
  self.commissionAccount = ko.observable(self.merchantPayload().commissionAccount()) || ko.observable();
  self.userAccountFlag = ko.observable(self.merchantPayload().userAccountFlag()) || ko.observable();
  self.commissionAccountFlag = ko.observable(self.merchantPayload().commissionAccountFlag()) || ko.observable();
  self.accountType = ko.observable(self.merchantPayload().accountType()) || ko.observable();
  self.failureUrl = ko.observable(self.merchantPayload().failureUrl()) || ko.observable();
  self.successUrl = ko.observable(self.merchantPayload().successUrl()) || ko.observable();
  self.checksumAlgorithm= ko.observable(self.merchantPayload().checksumAlgorithm ? self.merchantPayload().checksumAlgorithm() : "none");
  self.securityKey = ko.observable(self.merchantPayload().securityKey ? self.merchantPayload().securityKey() : null);
  self.checksumType = ko.observable(self.merchantPayload().checksumType ? self.merchantPayload.checksumType() : "none");
  self.show = ko.observable(false);

  if(self.commissionAccountFlag() === "ENABLED"){
    self.commissionAccountFlag(true);
    self.commissionAccountFlagArray(["commissionAccountFlag"]);
    self.commissionAccountType = ko.observable(self.merchantPayload().commissionAccountType()) || ko.observable();
    self.commissionAccount = ko.observable(self.merchantPayload().commissionAccount()) || ko.observable();
  }else{
    self.commissionAccountFlag(false);
  }

  if(self.userAccountFlag() === true){
    self.userAccountFlagArray(["userAccountFlag"]);
  }

  if(self.remittanceType() === "OUTWARD"){
      self.show(false);
  }else{
      self.show(true);
      self.redirectionUrl = ko.observable(self.merchantPayload().redirectionUrl()) || ko.observable();
  }

  Params.dashboard.headerName(self.resource.merchant.header);

  Params.baseModel.registerElement([
    "action-header",
    "confirm-screen",
    "internal-account-input"
  ]);

  Params.baseModel.registerComponent("merchant-dashboard", "merchant");
  Params.baseModel.registerComponent("create-merchant", "merchant");
  Params.baseModel.registerComponent("view-qr-code", "merchant");

  self.editMerchant = function() {
    self.viewMode(false);
    self.reviewMode(false);
    self.stageOne(true);

    Params.dashboard.loadComponent("create-merchant", {
      editMode: true,
      data:self.merchantPayload()
    });
  };

  self.deleteMerchant = function() {
    merchantModel.deleteMerchant(self.merchantCode).done(function(data, status, jqXhr) {
      Params.dashboard.loadComponent("confirm-screen", {
        jqXHR: jqXhr,
        transactionName: Params.baseModel.format(self.resource.merchant.deleteaccountsuccess, {
          name: self.merchantCode
        }),
        template: "merchant/confirm-screen-templates/delete-merchant"
      }, self);
    }).fail(function() {
      $("#deleteMerchant").hide();
    });
  };

  self.back = function() {
    history.back();
  };

  self.goToDashoard = function() {
    Params.dashboard.switchModule();
  };

  self.showQRCode = function() {
    $("#qrCode").trigger("openModal");
  };

  self.hidePopup = function() {
    $("#deleteMerchant").hide();
  };

  self.openPopup = function() {
    $("#deleteMerchant").trigger("openModal");
  };
};
});