define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/switch-funds-global",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojdatetimepicker",
  "ojs/ojswitch",
  "ojs/ojpopup"
], function (oj, ko, $, Model, ResourceBundle) {
  "use strict";

  return function (Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable(true);
    Params.baseModel.registerElement("modal-window");
    Params.baseModel.registerComponent("switch-funds-review", "mutual-funds");
    Params.baseModel.registerComponent("fund-information", "mutual-funds");
    Params.baseModel.registerComponent("fund-info-bar", "mutual-funds");
    self.accountHoldingId = ko.observable();
    self.switchInLoaded(false);
    self.holdingDataLoaded = ko.observable(false);

    let i;

    for (i = 0; i < self.holdingData().length; i++) {
      if ((self.holdingData()[i].folio === JSON.stringify(self.modelData.switchFund.switchOutDetails.folioNumber)) && (self.holdingData()[i].schemeCode === self.modelData.switchFund.switchOutDetails.scheme.schemeCode) && (self.holdingData()[i].fundHouseCode === self.modelData.switchFund.switchOutDetails.fundHouseCode)) {
        self.accountHoldingId(self.holdingData()[i].holdingId);
      }
    }

    if (self.switchType() !== "PSTP") {
      Model.fetchHoldingDetails(self.modelData.switchFund.switchInDetails.investmentAccountNumber.value, self.accountHoldingId()).done(function (data) {
        self.holdingDataLoaded(false);
        self.modelData.navigationData.maximumAmount.currency = data.accountHoldingDTO.investmentSummary.amountInvested.currency;
        self.modelData.navigationData.maximumAmount.amount = data.accountHoldingDTO.investmentSummary.amountInvested.amount;
        self.modelData.navigationData.availableUnits = data.accountHoldingDTO.investmentSummary.availableUnits;
        ko.tasks.runEarly();
        self.holdingDataLoaded(true);
      });
    } else {
      self.holdingDataLoaded(false);
      self.modelData.navigationData.maximumAmount.currency = self.modelData.navigationData.switchOut.currency;
      self.modelData.navigationData.maximumAmount.amount = self.purchaseAmount();
      ko.tasks.runEarly();
      self.holdingDataLoaded(true);
    }

    if (self.switchType() === "ONE_TIME") {
      self.modelData.navigationData.whenChanged = true;
      self.modelData.navigationData.when = "NOW";
    }

    if (self.modelData.switchFund.switchOutDetails.instructionTypeCode === "LATER") {
      self.modelData.navigationData.when = "LATER";
    }

    if (self.modelData.switchFund.switchInDetails.fundHouseCode !== null) {
      self.switchInFundHouseListener(self.modelData.switchFund.switchInDetails.fundHouseCode);
    }

    if (self.modelData.switchFund.switchInDetails.scheme.schemeCode !== null) {
      const scheme = {
        detail: {
          value: self.modelData.switchFund.switchInDetails.scheme.schemeCode
        }
      };

      self.schemeInListener(scheme);
    }

    for (i = 0; i < self.switchTypeData().length; i++) {
      if (self.switchType() === self.switchTypeData()[i].code) {
        Params.dashboard.headerName(self.resource.orderDetails.pageHeader + self.switchTypeData()[i].label);
      }
    }

    self.patternSelected = ko.observable("dd MMM yyyy");

    self.dateConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      pattern: self.patternSelected()
    }));

    if (self.payLoadArray().length > 0) {
      self.submitDisabled(false);
    }

    const currentDate = Params.baseModel.getDate();

    self.switchInInfoFunction = function () {
      Params.dashboard.openRightPanel("fund-information", {
        schemeCode: self.modelData.switchFund.switchInDetails.scheme.schemeCode
      }, self.switchInInfoScheme());
    };

    currentDate.setDate(currentDate.getDate() + 1);
    self.startDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));

    const dateEnd = currentDate;

    dateEnd.setDate(dateEnd.getDate() + self.customEndDate() - 1);
    self.modelData.navigationData.endDate = oj.IntlConverterUtils.dateToLocalIso(dateEnd);

    self.whenListener = function () {
      self.dataLoaded(false);
      self.modelData.navigationData.whenChanged = true;

      if (self.modelData.navigationData.when === "LATER") {
        self.modelData.switchFund.switchInDetails.instructionTypeCode = self.modelData.navigationData.when;
        self.modelData.reviewScreen.when = self.resource.orderDetails.later;
      } else {
        self.modelData.reviewScreen.when = self.resource.orderDetails.now;
      }

      ko.tasks.runEarly();
      self.dataLoaded(true);
    };

    self.switchAnotherFund = function () {
      self.id(self.id() + 1);

      Params.dashboard.loadComponent("switch-funds-global", {
        newFund: self.newFund(),
        payLoadArray: self.payLoadArray(),
        totalAmount: self.totalAmount(),
        id: self.id()
      });
    };

    self.showTermsAndConditions = function () {
      $("#terms-n-conditions").trigger("openModal");
    };

    self.calculateDate = function () {
      self.viewEstimatedDate(false);

      let startDate;
      const frequency = $("#frequency").val();

      if (self.orderStatusFlag()) {
        startDate = $("#start-date-update").val();
      } else {
        startDate = $("#start-date").val();
      }

      const installments = $("#installments").val();

      if (startDate !== "" && frequency !== "" && installments !== "") {
        const date = new Date(startDate);

        switch (frequency) {
          case "DAILY":
            date.setDate(date.getDate() + (1 * parseInt(installments)) - 1);
            self.estimatedDate(oj.IntlConverterUtils.dateToLocalIso(date));
            self.viewEstimatedDate(true);
            break;
          case "WEEKLY":
            date.setDate(date.getDate() + (7 * parseInt(installments)) - 1);
            self.estimatedDate(oj.IntlConverterUtils.dateToLocalIso(date));
            self.viewEstimatedDate(true);
            break;
          case "MONTHLY":
            date.setDate(date.getDate() + (30 * parseInt(installments)) - 1);
            self.estimatedDate(oj.IntlConverterUtils.dateToLocalIso(date));
            self.viewEstimatedDate(true);
            break;
          default:
            self.viewEstimatedDate(false);
        }
      }
    };

    self.openPopup = function (open) {
      const popup = document.querySelector("#show-more-info");

      if (open) {
        const listener = popup.open("#estimated-date-info");

        popup.addEventListener("ojOpen", listener);
      } else {
        popup.close();
      }
    };

    self.save = function () {
      const trackernew = document.getElementById("order-details");

      if (!Params.baseModel.showComponentValidationErrors(trackernew)) {
        return;
      }

      self.showFloatingButton(false);

      if (self.switchType() === "ONE_TIME" && self.modelData.navigationData.when === "LATER") {
        self.modelData.switchFund.switchOutDetails.instructionTypeCode = self.modelData.navigationData.when;
        self.modelData.switchFund.switchOutDetails.transactionTypeCode = "SWITCH";
        self.modelData.switchFund.switchInDetails.instructionTypeCode = self.modelData.navigationData.when;
        self.modelData.switchFund.switchInDetails.transactionTypeCode = "SWITCH";
      } else if (self.switchType() === "ONE_TIME" && self.modelData.navigationData.when === "NOW") {
        self.modelData.switchFund.switchOutDetails.instructionTypeCode = self.switchType();
        self.modelData.switchFund.switchOutDetails.transactionTypeCode = "SWITCH";
        self.modelData.switchFund.switchInDetails.instructionTypeCode = self.switchType();
        self.modelData.switchFund.switchInDetails.transactionTypeCode = "SWITCH";
      } else if (self.switchType() === "STP") {
        self.modelData.switchFund.switchOutDetails.instructionTypeCode = self.switchType();
        self.modelData.switchFund.switchOutDetails.transactionTypeCode = "SWITCH";
        self.modelData.switchFund.switchInDetails.instructionTypeCode = self.switchType();
        self.modelData.switchFund.switchInDetails.transactionTypeCode = "SWITCH";
      } else if (self.switchType() === "PSTP") {
        self.modelData.switchFund.switchOutDetails.instructionTypeCode = null;
        self.modelData.switchFund.switchOutDetails.transactionTypeCode = "PURCHASE";
        self.modelData.switchFund.switchInDetails.instructionTypeCode = "STP";
        self.modelData.switchFund.switchInDetails.transactionTypeCode = "SWITCH";
      }

      for (i = 0; i < self.payLoadArray().length; i++) {
        if (self.payLoadArray()[i].id === self.id()) {
          self.actionUpdate(true);
          self.modelData.switchFund.switchInDetails.txnAmount.currency = self.modelData.navigationData.minimumAmount.currency;

          if (self.onetimeSwitchType() === "UN") {
            if (self.switchType() === "PSTP") {
              self.modelData.navigationData.currency = self.modelData.navigationData.switchOut.currency;
            } else {
              self.modelData.navigationData.currency = self.modelData.navigationData.minimumAmount.currency;
            }

            self.modelData.reviewScreen.switchBy = self.resource.orderDetails.units;
            self.totalAmount(self.totalAmount() - self.payLoadArray()[i].switchFund.switchInDetails.txnAmount.amount);
            self.modelData.switchFund.switchInDetails.txnAmount.amount = self.modelData.switchFund.switchInDetails.txnUnits * self.modelData.navigationData.nav.amount;
            self.totalAmount(self.totalAmount() + self.modelData.switchFund.switchInDetails.txnAmount.amount);
          }

          if (self.onetimeSwitchType() === "AUN") {
            self.modelData.navigationData.currency = self.modelData.navigationData.minimumAmount.currency;

            self.modelData.switchFund.switchInDetails.txnUnits = self.modelData.navigationData.availableUnits;
            self.modelData.reviewScreen.switchBy = self.resource.orderDetails.allUnits;
            self.totalAmount(self.totalAmount() - self.payLoadArray()[i].switchFund.switchInDetails.txnAmount.amount);
            self.modelData.switchFund.switchInDetails.txnAmount.amount = self.modelData.switchFund.switchInDetails.txnUnits * self.modelData.navigationData.nav.amount;
            self.totalAmount(self.totalAmount() + self.modelData.switchFund.switchInDetails.txnAmount.amount);
          }

          if (self.onetimeSwitchType() === "AMT") {
            self.totalAmount(self.totalAmount() - self.payLoadArray()[i].switchFund.switchInDetails.txnAmount.amount);
            self.modelData.switchFund.switchInDetails.txnAmount.amount = self.amount();
            self.totalAmount(self.totalAmount() + self.modelData.switchFund.switchInDetails.txnAmount.amount);
            self.modelData.reviewScreen.switchBy = self.resource.orderDetails.amount;
          }

          if (self.switchType() === "STP" || self.switchType() === "PSTP") {
            self.modelData.switchFund.switchInDetails.recurring = true;
            self.modelData.switchFund.switchOutDetails.recurring = true;
          }

          if (self.switchType() === "PSTP") {
            self.accountHoldingId("NEW");

            self.modelData.switchFund.switchOutDetails.casaAccountNumber = {
              displayValue: self.additionalDetails().account.id.displayValue,
              value: self.selectedAccount()
            };

            self.modelData.switchFund.switchOutDetails.txnAmount.amount = self.purchaseAmount();
            self.modelData.switchFund.switchOutDetails.txnAmount.currency = self.modelData.navigationData.switchOut.currency;
            self.modelData.switchFund.switchInDetails.txnAmount.currency = self.modelData.navigationData.switchOut.currency;
          }

          self.payLoadArray()[i].switchFund = self.modelData.switchFund;
          self.payLoadArray()[i].navigationData = self.modelData.navigationData;
          self.payLoadArray()[i].reviewScreen = self.modelData.reviewScreen;
          self.payLoadArray()[i].totalAmount = self.totalAmount();
          self.payLoadArray()[i].switchType = self.switchType();
          self.payLoadArray()[i].isSuitableSwitchIn = self.isSuitableSwitchIn();
          self.payLoadArray()[i].isSuitableSwitchOut = self.isSuitableSwitchOut();
          self.payLoadArray()[i].onetimeSwitchType = self.onetimeSwitchType();
          self.payLoadArray()[i].holdingId = self.accountHoldingId();
          self.payLoadArray()[i].estimatedDate = self.estimatedDate();
          self.orderWidget(false);
          self.submitDisabled(false);
          ko.tasks.runEarly();

          if (self.orderStatusFlag() === false) {
            self.orderWidget(true);
            self.showFloatingButton(true);
          }
        }
      }

      if (!self.actionUpdate()) {
        self.modelData.switchFund.switchInDetails.txnAmount.currency = self.modelData.navigationData.minimumAmount.currency;

        if (self.onetimeSwitchType() === "UN") {
          if (self.switchType() === "PSTP") {
            self.modelData.navigationData.currency = self.modelData.navigationData.switchOut.currency;
          } else {
            self.modelData.navigationData.currency = self.modelData.navigationData.minimumAmount.currency;
          }

          self.modelData.reviewScreen.switchBy = self.resource.orderDetails.units;
          self.modelData.switchFund.switchInDetails.txnAmount.amount = self.modelData.switchFund.switchInDetails.txnUnits * self.modelData.navigationData.nav.amount;
          self.totalAmount(self.totalAmount() + self.modelData.switchFund.switchInDetails.txnAmount.amount);
        }

        if (self.onetimeSwitchType() === "AUN") {
          if (self.switchType() === "PSTP") {
            self.modelData.navigationData.currency = self.modelData.navigationData.switchOut.currency;
          } else {
            self.modelData.navigationData.currency = self.modelData.navigationData.minimumAmount.currency;
          }

          self.modelData.switchFund.switchInDetails.txnUnits = self.modelData.navigationData.availableUnits;
          self.modelData.reviewScreen.switchBy = self.resource.orderDetails.allUnits;
          self.modelData.switchFund.switchInDetails.txnAmount.amount = self.modelData.switchFund.switchInDetails.txnUnits * self.modelData.navigationData.nav.amount;
          self.totalAmount(self.totalAmount() + self.modelData.switchFund.switchInDetails.txnAmount.amount);
        }

        if (self.onetimeSwitchType() === "AMT") {
          self.modelData.switchFund.switchInDetails.txnAmount.amount = self.amount();
          self.totalAmount(self.totalAmount() + self.modelData.switchFund.switchInDetails.txnAmount.amount);
          self.modelData.reviewScreen.switchBy = self.resource.orderDetails.amount;
        }

        if (self.switchType() === "STP" || self.switchType() === "PSTP") {
          self.modelData.switchFund.switchInDetails.recurring = true;
          self.modelData.switchFund.switchOutDetails.recurring = true;
        }

        if (self.switchType() === "PSTP") {
          self.accountHoldingId("NEW");

          self.modelData.switchFund.switchOutDetails.casaAccountNumber = {
            displayValue: self.additionalDetails().account.id.displayValue,
            value: self.selectedAccount()
          };

          self.modelData.switchFund.switchOutDetails.txnAmount.amount = self.purchaseAmount();
          self.modelData.switchFund.switchOutDetails.txnAmount.currency = self.modelData.navigationData.switchOut.currency;
          self.modelData.switchFund.switchInDetails.txnAmount.currency = self.modelData.navigationData.switchOut.currency;
        }

        self.payLoadArray().push({
          switchFund: self.modelData.switchFund,
          navigationData: self.modelData.navigationData,
          reviewScreen: self.modelData.reviewScreen,
          totalAmount: self.totalAmount(),
          switchType: self.switchType(),
          isSuitableSwitchIn: self.isSuitableSwitchIn(),
          isSuitableSwitchOut: self.isSuitableSwitchOut(),
          onetimeSwitchType: self.onetimeSwitchType(),
          id: self.id(),
          holdingId: self.accountHoldingId(),
          estimatedDate: self.estimatedDate()
        });

        self.modelData.reviewScreen.riskProfile = self.riskProfile();

        self.newFund(true);
        self.orderWidget(false);
        self.buttonDisabled(false);
        self.submitDisabled(false);
        ko.tasks.runEarly();

        if (self.orderStatusFlag() === false) {
          self.orderWidget(true);
          self.showFloatingButton(true);
        }

      }

      if (self.payLoadArray().length >= self.fundCount()) {
        self.buttonDisabled(true);
      } else {
        self.buttonDisabled(false);
      }

      if (self.orderStatusFlag() === true) {
        self.buttonDisabled(true);
      }

      ko.tasks.runEarly();
      self.openpartials();
    };

    self.submit = function () {
      const trackernew = document.getElementById("termstracker");

      if (!Params.baseModel.showComponentValidationErrors(trackernew)) {
        return;
      }

      if (!self.orderStatusFlag()) {
        self.id(self.id() + 1);
      }

      Params.dashboard.loadComponent("switch-funds-review", {
        payLoadArray: self.payLoadArray(),
        totalAmount: self.totalAmount(),
        id: self.id()
      });
    };
  };
});