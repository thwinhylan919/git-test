define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "ojL10n!resources/nls/transfer-payee-upi",
  "ojs/ojinputtext",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojknockout",
  "ojs/ojvalidationgroup",
  "ojs/ojradioset",
  "ojs/ojselectcombobox",
  "ojs/ojavatar"
], function(oj, ko, transferPayeeModel, $, ResourceBundle) {
  "use strict";

  /** Adhoc VPA Transfer.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   * @return {Object} GetNewKoModel.
   *
   */
  return function(rootParams) {
    const self = this,
      getNewKoModel = function() {
        const KoModel = ko.mapping.fromJS(transferPayeeModel.getNewModel());

        return KoModel;
      },
      batchRequest = {
        batchDetailRequestList: []
      };

    self.transferPayeeUpiModel = getNewKoModel().transferPayeeUpiModel;
    self.resource = ResourceBundle;
    self.payments = ResourceBundle.payments;
    self.vpaList = ko.observableArray([]);
    self.vpaListMap = ko.observable({});
    self.vpaListLoaded = ko.observable();
    self.groupValid = ko.observable();
    self.modeSelected = ko.observable(true);
    self.payeeName = ko.observable();
    self.taskCode = ko.observable("PC_F_UT");
    self.dropDownActive = ko.observable();
    self.dropdownLevelOne = ko.observable();
    self.customPayeeName = ko.observable();
    self.payeeListExpandAll = ko.observableArray([]);
    self.payeeList = ko.observableArray([]);
    self.isPayeeListEmpty = ko.observable();
    self.selectedPayee = ko.observable();
    self.imageUploadFlag = ko.observable();
    self.payeeDetails = ko.observable();
    self.contentIdMap = ko.observable({});
    self.imageUploadFlag = ko.observable();
    self.groupIndex = ko.observable();
    self.payeeIndex = ko.observable();
    ko.utils.extend(self, rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState) : rootParams.rootModel);

    rootParams.dashboard.headerName(self.resource.transferPayeeUpi.header);

    rootParams.baseModel.registerComponent("review-transfer-payee-upi", "upi");
    rootParams.baseModel.registerComponent("available-limits", "financial-limits");

    rootParams.baseModel.registerElement([
      "modal-window",
      "confirm-screen",
      "row",
      "amount-input",
      "bank-look-up"
    ]);

    const configurationDetails = {};

    transferPayeeModel.getPayeeMaintenance().then(function(data) {
      for (let k = 0; k < data.configurationDetails.length; k++) {
        configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
      }

      self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
    });

    /**
     * This function will help initializing the dealType and its associated fields.
     *
     * @memberOf transfer-payee-upi
     * @function loadBatchImages
     * @returns {void}
     */
    function loadBatchImages() {
      transferPayeeModel.fireBatch(batchRequest).then(function(batchData) {
        for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
          const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

          self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
        }

      });
    }

    /**
     * This function will help initializing the dealType and its associated fields.
     *
     * @memberOf transfer-payee-upi
     * @param {Object} id  - ContentId of image.
     * @function loadBatchRequest
     * @returns {void}
     */
    function loadBatchRequest(id) {
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
    }

    /**
     * This function modfies the sub Payees.
     *
     * @memberOf transfer-payee-upi
     * @param {Object} payeeGroupData - - - - - - - - - - - - - - - - Payee Group data.
     * @param {Object} groupIndex Payee Group data.
     * @function loadBatchRequest
     * @returns {void}
     */
    function subPayees(payeeGroupData, groupIndex) {
      const payeeList = payeeGroupData.listPayees,
        payeeType = {
          INDIA: "indiaDomesticPayee",
          UK: "ukDomesticPayee",
          SEPA: "sepaDomesticPayee"
        };

      for (let i = 0; i < payeeList.length; i++) {
        self.payeeListExpandAll()[groupIndex].listPayees[i] = payeeList[i].domesticPayeeType ? payeeList[i][payeeType[payeeList[i].domesticPayeeType]] : payeeList[i];
        self.payeeListExpandAll()[groupIndex].listPayees[i].initials = oj.IntlConverterUtils.getInitials(payeeList[i].nickName.split(/\s+/)[0], payeeList[i].nickName.split(/\s+/)[1]);

        if (self.payeeListExpandAll()[groupIndex].listPayees[i].contentId) {
          if (!self.contentIdMap()[self.payeeListExpandAll()[groupIndex].listPayees[i].contentId.value]) {
          self.contentIdMap()[self.payeeListExpandAll()[groupIndex].listPayees[i].contentId.value] = ko.observable();
          loadBatchRequest(self.payeeListExpandAll()[groupIndex].listPayees[i].contentId.value);
          }
        }

        self.payeeListExpandAll()[groupIndex].listPayees[i].preview = self.payeeListExpandAll()[groupIndex].listPayees[i].contentId ? self.contentIdMap()[self.payeeListExpandAll()[groupIndex].listPayees[i].contentId.value] : payeeGroupData.contentId ? self.contentIdMap()[payeeGroupData.contentId.value] : null;
      }
    }

    self.prepopulateDate = function() {
      if (rootParams.rootModel.previousState) {
        for (let i = 0; i < self.payeeListExpandAll().length; i++) {
          for (let j = 0; j < self.payeeListExpandAll()[i].listPayees.length; j++) {
            if (self.payeeListExpandAll()[i].listPayees[j].id === rootParams.rootModel.previousState.payeeData.id) {
              self.payeeChanged(i);

              self.setPayee({
              payeeIndex:j});
            }
          }
        }

      }
    };

    Promise.all([transferPayeeModel.fetchPayeeList(), transferPayeeModel.fetchBankConfig(), transferPayeeModel.fetchList()]).then(function(response) {
      self.vpaListLoaded(false);
      self.payeeListExpandAll(response[0].payeeGroups);

      for (let i = 0; i < self.payeeListExpandAll().length; i++) {
        self.payeeListExpandAll()[i].initials = oj.IntlConverterUtils.getInitials(self.payeeListExpandAll()[i].name.split(/\s+/)[0], self.payeeListExpandAll()[i].name.split(/\s+/)[1]);

        if (self.payeeListExpandAll()[i].contentId) {
          self.contentIdMap()[self.payeeListExpandAll()[i].contentId.value] = ko.observable();
          loadBatchRequest(self.payeeListExpandAll()[i].contentId.value);
        }

        self.payeeListExpandAll()[i].preview = self.payeeListExpandAll()[i].contentId ? self.contentIdMap()[self.payeeListExpandAll()[i].contentId.value] : null;

        subPayees(self.payeeListExpandAll()[i], i);
      }

      for (let i = 0; i < response[2].virtualPaymentAddressDTOs.length; i++) {
        self.vpaList.push(response[2].virtualPaymentAddressDTOs[i]);

        self.vpaListMap()[response[2].virtualPaymentAddressDTOs[i].id] = {
          displayValue: response[2].virtualPaymentAddressDTOs[i].accountId.displayValue,
          value: response[2].virtualPaymentAddressDTOs[i].accountId.value
        };
      }

      self.transferPayeeUpiModel.amount.currency(response[1].bankConfigurationDTO.localCurrency);
      self.vpaListLoaded(true);
      self.dropdownLevelOne(true);
      self.prepopulateDate();

      if (batchRequest.batchDetailRequestList.length) {
        loadBatchImages();
      }
    });

    self.payeeChanged = function(event) {
      if (event.detail) {
        self.groupIndex(event.detail.value.groupIndex);

      } else {
        self.groupIndex(event);
      }

      ko.tasks.runEarly();
      self.dropDownActive(true);
    };

    /**
     * This function will handle the operation of currency parser.
     *
     * @memberOf transfeer-payee-upi
     * @function reset
     * @param {string} payeeType - Resets all the details.
     * @returns {void}
     */
    function reset(payeeType) {
      if (payeeType === "VPA") {
        self.transferPayeeUpiModel.creditVPAId(null);
      } else {
        self.transferPayeeUpiModel.accountTransferDetails.transferMode(null);
        self.transferPayeeUpiModel.accountTransferDetails.accountNumber(null);
        self.transferPayeeUpiModel.accountTransferDetails.accountName(null);
        self.transferPayeeUpiModel.accountTransferDetails.accountType(null);
        self.transferPayeeUpiModel.accountTransferDetails.bankDetails.name(null);
        self.transferPayeeUpiModel.accountTransferDetails.bankDetails.branch(null);
        self.transferPayeeUpiModel.accountTransferDetails.bankDetails.address(null);
        self.transferPayeeUpiModel.accountTransferDetails.bankDetails.city(null);
        self.transferPayeeUpiModel.accountTransferDetails.bankDetails.country(null);
        self.transferPayeeUpiModel.accountTransferDetails.bankDetails.codeType(null);
        self.transferPayeeUpiModel.accountTransferDetails.bankDetails.code(null);
      }
    }

    self.setPayee = function(payeeData) {
      self.payeeIndex(payeeData.payeeIndex);
      self.dropDownActive(false);
      self.dropdownLevelOne(false);
    };

    self.refreshDropDown = function(payeeType) {
      self.selectedPayee(null);
      reset(payeeType);
      self.dropdownLevelOne(true);
    };

    self.reviewTransfer = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("transferPayeeUpiTracker"))) {
        return;
      }

      transferPayeeModel.validateRequest(ko.toJSON(self.transferPayeeUpiModel)).then(function() {
        const parameters = {
          payeeData: self.payeeListExpandAll()[self.groupIndex()].listPayees[self.payeeIndex()],
          imageUploadFlag: self.imageUploadFlag,
          transferPayeeUpiModel: self.transferPayeeUpiModel
        };

        rootParams.dashboard.loadComponent("review-transfer-payee-upi", ko.mapping.toJS(parameters));
      });
    };

    self.showLimits = ko.observable(false);

    self.viewLimits = function() {
      self.showLimits(true);
      ko.tasks.runEarly();
      $("#view-limits").trigger("openModal");
    };

    self.done = function() {
      $("#view-limits").hide();
      self.showLimits(false);
    };

  };
});
