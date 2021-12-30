define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/merchant",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojradioset",
  "ojs/ojlistview",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource",
  "ojs/ojknockout-validation",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup"
], function (ko, merchantModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(merchantModel.getNewModel());

        return KoModel;
      };

    ko.utils.extend(self, rootParams.rootModel.params);
    self.resource = ResourceBundle;
    self.createMode = ko.observable(rootParams.rootModel.params.createMode);
    self.editMode = ko.observable(rootParams.rootModel.params.editMode);
    self.validationTracker = ko.observable();
    self.searchValue = ko.observable();
    self.stageReview = ko.observable(false);
    self.userAccountFlagArray = ko.observableArray();
    self.commissionAccountFlagArray = ko.observableArray();
    self.stageEdit = ko.observable(false);
    self.isBranchesLoaded = ko.observable(true);
    self.branches = ko.observableArray();
    self.branchesMap = {};
    self.componentName = ko.observable(self.resource.merchant.merchant_header);
    self.viewMode = ko.observable(true);
    self.stageOne = ko.observable(true);
    self.stageTwo = ko.observable(false);
    self.merchants = [];
    self.merchantsList = ko.observableArray();
    self.merchantDetails = ko.observable();
    self.merchantId = ko.observable();
    self.merchantDescription = ko.observable();
    self.componentId = ko.observable();
    self.checksumAlgorithmList = ko.observableArray("");
    self.checksumTypeList = ko.observableArray("");
    self.checksumType = ko.observable("none");
    self.isChecksumAlgo = ko.observable(false);
    self.merchantPayload = ko.observable();
    self.merchantPayload(getNewKoModel().merchantModel);
    self.securityKey = ko.observable();

    if(self.editMode() === true){
      self.payload = ko.observable(rootParams.rootModel.params.data);
      self.checksumAlgorithm = ko.observable(self.payload().checksumAlgorithm ? self.payload().checksumAlgorithm() : "none" ) ;
      self.securityKey=ko.observable(self.payload().securityKey ? self.payload().securityKey() : null);
      self.remittanceType = ko.observable(self.payload().remittanceType());
      self.commissionAccountFlag = ko.observable(self.payload().commissionAccountFlag());
      self.userAccountFlag = ko.observable(self.payload().userAccountFlag());
      self.failureUrl = ko.observable(self.payload().failureUrl());
      self.successUrl = ko.observable(self.payload().successUrl());
      self.code = ko.observable(self.payload().code());
      self.description = ko.observable(self.payload().description()) ;
      self.accountType = ko.observable(self.payload().accountType());
      self.merchantAccount = ko.observable(self.payload().merchantAccount());
      self.approvalMode =ko.observable(false);
      self.commissionAccount = ko.observable();
      self.show = self.show || ko.observable(false);
      self.approvalMode(true);
      self.stageOne(true);
      self.stageReview(false);
    }else{
       self.checksumAlgorithm = ko.observable("none");
       self.remittanceType = ko.observable("OUTWARD");
       self.commissionAccountFlag = ko.observable(false);
       self.userAccountFlag = ko.observable();
       self.failureUrl = ko.observable();
       self.successUrl = ko.observable();
       self.code = ko.observable();
       self.description = ko.observable();
       self.branch = ko.observable();
       self.commissionBranch = ko.observable();
       self.accountType = ko.observable();
       self.merchantAccount = ko.observable();
       self.approvalMode =ko.observable(false);
       self.show = self.show || ko.observable(false);
       self.commissionAccountType = ko.observable();
       self.commissionAccount = ko.observable();
       self.redirectionUrl = ko.observable();
      }

      if(self.checksumAlgorithm() !== null && self.checksumAlgorithm() === "none"){
        self.isChecksumAlgo(false);
      }else{
        self.isChecksumAlgo(true);
      }

      if(self.commissionAccountFlag() === "ENABLED"){
        self.commissionAccountFlag(true);
        self.commissionAccountFlagArray(["commissionAccountFlag"]);
        self.commissionAccountType = ko.observable(self.payload().commissionAccountType());
        self.commissionAccount = ko.observable(self.payload().commissionAccount());
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
      self.redirectionUrl = ko.observable(self.payload().redirectionUrl());
    }

    if (self.checksumType() !== "none") {
        self.checksumType(self.payload().checksumType());
    }

    if(!self.approvalMode())
       {rootParams.dashboard.headerName(self.resource.merchant.header);}

    rootParams.baseModel.registerElement([
      "confirm-screen",
      "action-header",
      "modal-window"
    ]);

    rootParams.baseModel.registerComponent("view-merchant", "merchant");
    rootParams.baseModel.registerElement("internal-account-input");

    self.goToDashoard = function () {
      rootParams.dashboard.switchModule();
    };

    self.showInwardRemittance = function(event){
      self.merchantPayload(getNewKoModel().merchantModel);
      self.remittanceType(event.detail.value);
      self.commissionAccountFlag(false);
      self.userAccountFlag(false);
      self.commissionAccount(null);
      self.redirectionUrl(null);
      self.commissionAccountType(null);

      if(self.remittanceType() ==="INWARD"){
        self.show(true);

      }else{
        self.show(false);

       }
     };

    self.commissionAccountFlagChangeHandler = function (event) {
      self.commissionAccountFlagArray(event.detail.value);

      if(self.commissionAccountFlagArray().length > 0 && self.commissionAccountFlagArray()[0] === "commissionAccountFlag"){
          self.commissionAccountFlag(true);
      }else if(self.commissionAccountFlagArray().length === 0){
          self.commissionAccountFlag(false);
      }
    };

    self.userAccountFlagChangeHandler = function (event) {
      self.userAccountFlagArray(event.detail.value);

      if(self.userAccountFlagArray.length > 0 && self.userAccountFlagArray()[0] === "userAccountFlag"){
         self.userAccountFlag(true);
      }else{
        self.userAccountFlag(false);
      }
    };

    self.confirmEditMerchant = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("merchantTracker"))) {
        return;
      }

      self.merchantPayload().code(self.code());
      self.merchantPayload().description(self.description());
      self.merchantPayload().merchantAccount(self.merchantAccount());
      self.merchantPayload().accountType(self.accountType());
      self.merchantPayload().remittanceType(self.remittanceType());

      if (self.commissionAccountFlag()) {
        self.merchantPayload().commissionAccountFlag("ENABLED");
        self.merchantPayload().commissionAccount(self.commissionAccount());
        self.merchantPayload().commissionAccountType(self.commissionAccountType().length > 1 ? self.commissionAccountType() : self.commissionAccountType());
      } else {
        self.merchantPayload().commissionAccountFlag("DISABLED");
        self.merchantPayload().commissionAccount(null);
        self.merchantPayload().commissionAccountType(null);
      }

      if (self.checksumType() !== "none") {
        self.merchantPayload().checksumType(self.checksumType());
      }

      if(self.show()){
        self.merchantPayload().redirectionUrl(self.redirectionUrl());
      }

      self.merchantPayload().successUrl(self.successUrl());
      self.merchantPayload().failureUrl(self.failureUrl());
      self.merchantPayload().userAccountFlag(self.userAccountFlag());
      self.merchantPayload().checksumAlgorithm(self.checksumAlgorithm() === "none" ? null : self.checksumAlgorithm());

      if (self.merchantPayload().checksumAlgorithm()) { self.merchantPayload().securityKey(self.securityKey()); }
      else { self.merchantPayload().securityKey(""); }

      const payload = {
        merchantDetailsDTO: ko.toJS(self.merchantPayload())
      };

      merchantModel.updateMerchant(ko.toJSON(payload), self.code()).done(function (data, status, jqXHR) {
        self.stageOne(false);
        self.stageReview(false);

        let transactionName = self.resource.merchant.header;

        if(self.show()){
          transactionName = self.resource.merchant.inwardHeader;
        }else{
          transactionName = self.resource.merchant.outwardHeader;
        }

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionName: transactionName
        });
      });
    };

    self.createMerchant = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      self.merchantPayload().code(self.code());
      self.merchantPayload().description(self.description());
      self.merchantPayload().merchantAccount(self.merchantAccount());
      self.merchantPayload().userAccountFlag(!!self.userAccountFlag());
      self.merchantPayload().accountType(self.accountType());
      self.merchantPayload().remittanceType(self.remittanceType());

      if (self.commissionAccountFlag()) {
        self.merchantPayload().commissionAccountFlag("ENABLED");
        self.merchantPayload().commissionAccount(self.commissionAccount());
        self.merchantPayload().commissionAccountType(self.commissionAccountType());
      } else {
        self.merchantPayload().commissionAccountFlag("DISABLED");
        self.merchantPayload().commissionAccount(self.commissionAccount());
        self.merchantPayload().commissionAccountType(self.commissionAccountType());
      }

      self.merchantPayload().successUrl(self.successUrl());
      self.merchantPayload().failureUrl(self.failureUrl());

      if(self.show()){
        self.merchantPayload().redirectionUrl(self.redirectionUrl());
      }

      if (self.checksumType() !== "none") {
        self.merchantPayload().checksumType(self.checksumType());
      }

      if (self.checksumAlgorithm() !== "none") {
        self.merchantPayload().checksumAlgorithm(self.checksumAlgorithm());
        self.merchantPayload().securityKey(self.securityKey());
      }

      const payload = {
        merchantDetailsDTO: ko.toJS(self.merchantPayload())
      };

      merchantModel.createMerchant(ko.toJSON(payload)).done(function (data, status, jqXHR) {
        self.stageReview(false);

        let transactionName = self.resource.merchant.header;

        if(self.show()){
          transactionName = self.resource.merchant.inwardHeader;
        }else{
          transactionName = self.resource.merchant.outwardHeader;
        }

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionName: transactionName
        });
      });
    };

    self.cancelEditMerchant = function () {
      location.replace("dashboard.html");
    };

    self.confirmFlag = ko.observable(false);

    self.reviewMerchant = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("merchantTracker"))) {
        return;
      }

      self.stageOne(false);
      self.stageReview(true);
      self.confirmFlag(true);
    };

    self.reviewBack = function () {
      self.stageReview(false);
      self.stageOne(true);
    };

    self.back = function () {
      history.back();
    };

    self.checksumAlgorithmList.push({
      text: self.resource.merchant.none,
      value: "none"
    }, {
        text: "CRC32",
        value: "CRC32"
      });

    self.checksumTypeList.push({
      text: self.resource.merchant.none,
      value: "none"
    });

    self.checksumTypeChanged = function () {
      if (self.checksumType() !== "none") {
        self.checksumType(self.checksumType());
      } else {
        self.checksumType("none");
      }
    };

    self.algoChanged = function (event) {
      if (event.detail.value !== "none") {
        self.isChecksumAlgo(true);
      } else {
        self.securityKey(null);
        self.isChecksumAlgo(false);
      }
    };

    if (self.confirmScreenExtensions) {
      ko.utils.extend(self.confirmScreenExtensions, {
        transactionName: self.resource.merchant.header,
        template: "merchant/confirm-screen-templates/create-merchant"
      });
    }
  };
});