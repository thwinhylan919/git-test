define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/upi-request-money",
  "ojs/ojinputtext",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojknockout",
  "ojs/ojvalidationgroup",
  "ojs/ojdatetimepicker",
  "ojs/ojcheckboxset",
  "ojs/ojavatar",
  "ojs/ojtimezonedata"
], function(oj, ko, upiRequestMoneyModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.nls = ResourceBundle;

    const getNewKoModel = function() {
        const KoModel = upiRequestMoneyModel.getNewModel();

        return ko.mapping.fromJS(KoModel);
      },
      batchRequest = {
        batchDetailRequestList: []
      };

    self.modelInstance = rootParams.rootModel.previousState ? rootParams.rootModel.previousState.modelInstance : getNewKoModel();

    self.debitVPAPayeeArray = ko.observableArray();
    self.creditVPAArray = ko.observableArray();
    self.groupValid = ko.observable();
    self.vpaDetailsLoaded = ko.observable(false);
    self.debitVPAIdEnabled = ko.observable(false);
    self.creditVPAArrayMap = {};
    self.payeeMapData = {};
    self.debitVPAIdHandlerEnabled = ko.observable([]);
    self.currentDate = ko.observable();
    self.validityInDays = ko.observable();
    self.maxDate = ko.observable();
    self.accountNumber = ko.observable();

    self.payeeListExpandAll = ko.observableArray([]);
    self.contentIdMap = ko.observable({});
    self.dropdownLevelOne = ko.observable();
    self.groupIndex = ko.observable();
    self.dropDownActive = ko.observable();
    self.selectedPayee = ko.observable();
    self.imageUploadFlag = ko.observable();
    self.payeeIndex = ko.observable();
    self.isPayeeVPA = ko.observable(true);
    ko.utils.extend(self, rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState) : ko.mapping.fromJS(rootParams.rootModel));

    const confirmScreenExtensions = self.modelInstance.upiRequestMoneyDetails;

    rootParams.baseModel.registerComponent("review-upi-request-money", "upi");
    rootParams.dashboard.headerName(self.nls.headers.requestMoney);
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerElement("confirm-screen");

    self.loadBatchImages = function() {
      upiRequestMoneyModel.fireBatch(batchRequest).then(function(batchData) {
        for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
          const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

          self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
        }
      });
    };

    self.loadBatchRequest = function(id) {
      batchRequest.batchDetailRequestList.push({
        methodType: "GET",
        uri: {
          value: "/contents/{id}",
          params: {
            id: id
          }
        },
        headers: {
          "Content-Id": batchRequest.batchDetailRequestList.length + 1,
          "Content-Type": "application/json"
        }
      });
    };

    self.setSourceAccount = function(event) {

      self.accountNumber(self.creditVPAArrayMap[event.target.value].displayValue);

    };

    self.subPayees = function(payeeGroupData, groupIndex) {
      const payeeList = payeeGroupData.listPayees;

      for (let i = 0; i < payeeList.length; i++) {
        self.payeeListExpandAll()[groupIndex].listPayees[i] = payeeList[i];
        self.payeeListExpandAll()[groupIndex].listPayees[i].initials = oj.IntlConverterUtils.getInitials(payeeList[i].nickName.split(/\s+/)[0], payeeList[i].nickName.split(/\s+/)[1]);

        if (self.payeeListExpandAll()[groupIndex].listPayees[i].contentId) {
          if (!self.contentIdMap()[self.payeeListExpandAll()[groupIndex].listPayees[i].contentId.value]) {
            self.contentIdMap()[self.payeeListExpandAll()[groupIndex].listPayees[i].contentId.value] = ko.observable();
            self.loadBatchRequest(self.payeeListExpandAll()[groupIndex].listPayees[i].contentId.value);
          }
        }

        self.payeeListExpandAll()[groupIndex].listPayees[i].preview = self.payeeListExpandAll()[groupIndex].listPayees[i].contentId ? self.contentIdMap()[self.payeeListExpandAll()[groupIndex].listPayees[i].contentId.value] : payeeGroupData.contentId ? self.contentIdMap()[payeeGroupData.contentId.value] : null;
      }
    };

    self.payeeChanged = function(event) {
      self.isPayeeVPA(false);

      if (event.detail) {
        self.groupIndex(event.detail.value.groupIndex);
      } else {
        self.groupIndex(event);
      }

      ko.tasks.runEarly();
      self.dropDownActive(true);
    };

    self.setPayee = function(payeeData) {
      self.payeeIndex(payeeData.payeeIndex);
      self.dropDownActive(false);
      self.dropdownLevelOne(false);
    };

    self.reset = function(payeeType) {
      if (payeeType === "VPA") {
        self.modelInstance.upiRequestMoneyDetails.debitVPAId(null);
      }
    };

    self.refreshDropDown = function(payeeType) {
      self.selectedPayee(null);
      self.isPayeeVPA(true);
      self.reset(payeeType);
      self.dropdownLevelOne(true);
    };

    const configurationDetails = {};

    upiRequestMoneyModel.getPayeeMaintenance().then(function(data) {
      for (let k = 0; k < data.configurationDetails.length; k++) {
        configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
      }

      self.validityInDays(configurationDetails.UPI_FUND_REQUEST_MAX_VALIDITY_DAYS);
      self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
    });

    self.debitVPAIdHandler = function() {
      if (self.debitVPAIdEnabled()) {
        self.debitVPAIdEnabled(false);
      } else {
        self.debitVPAIdEnabled(true);
      }

      self.modelInstance.upiRequestMoneyDetails.debitVPAId(null);
      self.modelInstance.upiRequestMoneyDetails.payeeDetails.id(null);
      self.modelInstance.upiRequestMoneyDetails.payeeDetails.nickName(null);
    };

    self.reviewRequest = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("transferPayeeUpiTracker"))) {
        return;
      }

      upiRequestMoneyModel.validateUpiRequestMoney(ko.toJSON(self.modelInstance.upiRequestMoneyDetails)).then(function(data) {

        rootParams.dashboard.loadComponent("review-upi-request-money", ko.mapping.toJS({
          mode: "review",
          modelInstance: self.modelInstance,
          accountNumber: self.accountNumber(),
          receiverName: data.upiDetails.receiverName,
          confirmScreenExtensions: confirmScreenExtensions
        }));
      });
    };

    self.prepopulateDate = function() {
      if (rootParams.rootModel.previousState && rootParams.rootModel.previousState.mode === "review") {
        const data = self.payeeMapData[self.modelInstance.upiRequestMoneyDetails.debitVPAId()];

        if (data) {
          self.payeeChanged(data.groupIndex);
          self.setPayee(data.payeeData);
        } else {
          self.isPayeeVPA(true);
          self.debitVPAIdEnabled(true);
          self.debitVPAIdHandlerEnabled(["check"]);
        }

        self.accountNumber(rootParams.rootModel.previousState.accountNumber);
      }
    };

    Promise.all([upiRequestMoneyModel.fetchCreditVPAList(), upiRequestMoneyModel.fetchPayeeList(), upiRequestMoneyModel.fetchBankConfig(), upiRequestMoneyModel.getHostDate()]).then(function(response) {
      const vpaCreditData = response[0],
        vpaDebitData = response[1],

        today = new Date(response[3].currentDate.valueDate);

      self.currentDate(today.setHours(0, 0, 0, 0));

      const formattedDate = new Date(response[3].currentDate.valueDate);

      formattedDate.setDate((today.getDate() + parseInt(self.validityInDays())) - 1);
      self.maxDate(formattedDate.setHours(0, 0, 0, 0));

      self.modelInstance.upiRequestMoneyDetails.amount.currency(response[2].bankConfigurationDTO.localCurrency);

      self.creditVPAArray.removeAll();
      self.debitVPAPayeeArray.removeAll();
      self.vpaDetailsLoaded(false);

      for (let i = 0; i < vpaCreditData.virtualPaymentAddressDTOs.length; i++) {
        self.creditVPAArray.push(vpaCreditData.virtualPaymentAddressDTOs[i]);

        self.creditVPAArrayMap[vpaCreditData.virtualPaymentAddressDTOs[i].id] = {
          displayValue: vpaCreditData.virtualPaymentAddressDTOs[i].accountId.displayValue,
          value: vpaCreditData.virtualPaymentAddressDTOs[i].accountId.value
        };
      }

      self.modelInstance.upiRequestMoneyDetails.creditVPAId(self.creditVPAArray()[0].id);

      self.accountNumber(self.creditVPAArrayMap[self.creditVPAArray()[0].id].displayValue);

      for (let i = 0; i < vpaDebitData.payeeGroups.length; i++) {
        for (let j = 0; j < vpaDebitData.payeeGroups[i].listPayees.length; j++) {
          self.debitVPAPayeeArray.push(vpaDebitData.payeeGroups[i].listPayees[j]);

          self.payeeMapData[vpaDebitData.payeeGroups[i].listPayees[j].vpaId] = {
            groupIndex: i,
            payeeData: {
              payeeIndex: j
            }
          };
        }
      }

      self.payeeListExpandAll(response[1].payeeGroups);

      for (let i = 0; i < self.payeeListExpandAll().length; i++) {
        self.payeeListExpandAll()[i].initials = oj.IntlConverterUtils.getInitials(self.payeeListExpandAll()[i].name.split(/\s+/)[0], self.payeeListExpandAll()[i].name.split(/\s+/)[1]);

        if (self.payeeListExpandAll()[i].contentId) {
          self.contentIdMap()[self.payeeListExpandAll()[i].contentId.value] = ko.observable();
          self.loadBatchRequest(self.payeeListExpandAll()[i].contentId.value);
        }

        self.payeeListExpandAll()[i].preview = self.payeeListExpandAll()[i].contentId ? self.contentIdMap()[self.payeeListExpandAll()[i].contentId.value] : null;

        self.subPayees(self.payeeListExpandAll()[i], i);
      }

      self.dropdownLevelOne(true);
      self.prepopulateDate();

      self.vpaDetailsLoaded(true);

      if (batchRequest.batchDetailRequestList.length) {
        self.loadBatchImages();
      }

    });

  };
});
