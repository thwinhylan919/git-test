define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/purchase-mutual-fund",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojswitch",
  "ojs/ojcheckboxset",
  "ojs/ojradioset",
  "ojs/ojdatetimepicker",
  "ojs/ojpopup"
], function(oj, ko, $, PurchaseMutualFund, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.startDate = ko.observable();
    self.endDate = ko.observable();
    self.refresh = ko.observable(true);
    self.instructionTypeCode = ko.observable(true);
    params.baseModel.registerComponent("purchase-order-review", "mutual-funds");
    params.baseModel.registerComponent("scheme-details-bar", "mutual-funds");
    self.schemeBar = ko.observable("scheme-details-bar");
    params.baseModel.registerComponent("fund-information", "mutual-funds");
    params.baseModel.registerComponent("fund-info-bar", "mutual-funds");
    params.baseModel.registerElement("amount-input");
    params.baseModel.registerElement("account-input");
    params.baseModel.registerElement("modal-window");
    params.dashboard.headerName(self.resource.purchaseOrder);
    self.frequencyList = ko.observableArray();
    self.totalAmount = ko.observable(0);

    if (params.rootModel.totalAmount) {
      self.totalAmount = params.rootModel.totalAmount;
    }

    if (self.payLoadArray().length > 0) {
      self.singlePurchase(false);
    }

    if (self.payLoadArray().length >= self.maximumNumberOfPurchases()) {
      self.addNewButton(false);
    }

    self.patternSelected = ko.observable("dd MMM yyyy");
    self.installmentList = ko.observableArray();

    const currentDate = params.baseModel.getDate();

    currentDate.setDate(currentDate.getDate() + 1);
    self.startDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));

    const dateEnd = currentDate;

    dateEnd.setDate(dateEnd.getDate() + self.customEndDate() - 1);
    self.endDate(oj.IntlConverterUtils.dateToLocalIso(dateEnd));

    const responseDTO = self.schemeDetailsDTO().schemeDTO;

    let i;

    self.investmentAccountShow = ko.observable(true);

    if (self.orderStatusFlag()) {
      for (i = 0; i < self.fundHouseData().length; i++) {
        if (self.fundHouseData()[i].code === self.purchaseFund.fundHouseCode) {
          self.valueData.fundHouse = self.fundHouseData()[i].label;
          break;
        }
      }
    }

    if (self.extraData.newOld === "EXISTING") {
      self.investmentAccountShow(false);
      self.purchaseFund.scheme.fundCategory.fundCategoryCode = responseDTO.fundCategory.fundCategoryCode;
      self.purchaseFund.scheme.fundCategory.fundCategoryDesc = responseDTO.fundCategory.fundCategoryDesc;
      self.valueData.fundCategory = responseDTO.fundCategory.fundCategoryDesc;

      for (i = 0; i < self.schemeData().length; i++) {
        if (self.schemeData()[i].code === self.purchaseFund.scheme.schemeCode) {
          self.purchaseFund.fundHouseCode = self.schemeData()[i].fundHouseCode;
          self.valueData.fundHouse = self.schemeData()[i].fundHouseCode;
          break;
        }
      }

      for (i = 0; i < self.fundHouseData().length; i++) {
        if (self.fundHouseData()[i].code === self.purchaseFund.fundHouseCode) {
          self.valueData.fundHouse = self.fundHouseData()[i].label;
          break;
        }
      }
    }

    if (self.recommended() === true) {
      self.investmentAccountShow(true);

      self.purchaseFund.scheme.fundCategory.fundCategoryCode = responseDTO.fundCategory.fundCategoryCode;
      self.purchaseFund.scheme.fundCategory.fundCategoryDesc = responseDTO.fundCategory.fundCategoryDesc;
      self.valueData.fundCategory = responseDTO.fundCategory.fundCategoryDesc;
      self.purchaseFund.scheme.schemeCode = responseDTO.schemeCode;
      self.purchaseFund.scheme.schemeName = responseDTO.schemeName;
    }

    self.dividendEligible = ko.observable(responseDTO.dividendEligible);
    self.extraData.minAmount = responseDTO.minimumAmount.amount;
    self.extraData.minInstallments = responseDTO.minimumInstallments;
    self.extraData.endDate = responseDTO.endDate;
    self.extraData.cutOffDate = responseDTO.cutOff;

    self.dateConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      pattern: self.patternSelected()
    }));

    for (i = 0; i < responseDTO.frequencyList.length; i++) {
      self.frequencyList().push({
        code: responseDTO.frequencyList[i].code,
        label: responseDTO.frequencyList[i].description
      });
    }

    for (i = 0; i < responseDTO.installmentList.length; i++) {
      self.installmentList().push({
        code: responseDTO.installmentList[i],
        label: responseDTO.installmentList[i]
      });
    }

    self.folioDataDisplay = function(accountId, fundHouseCode) {
      PurchaseMutualFund.fetchMockData(accountId, fundHouseCode).done(function(data) {
        self.folioData().splice(0, self.folioData().length);

        for (i = 0; i < data.foliodtos.length; i++) {
          self.folioData.push({
            label: data.foliodtos[i].folioNumber,
            code: data.foliodtos[i].folioNumber
          });
        }

        self.folioLoaded(true);
      });
    };

    if (self.purchaseFund.investmentAccountNumber) {
      for (i = 0; i < self.investmentAccountData().length; i++) {
        if (self.purchaseFund.investmentAccountNumber.displayValue === self.investmentAccountData()[i].label) {
          self.extraData.investmentAccountInfo = self.investmentAccountData()[i].primaryHolderName + "-" + self.purchaseFund.investmentAccountNumber.displayValue + "-" + self.investmentAccountData()[i].holdingPattern;
        }

        if (self.purchaseFund.investmentAccountNumber.value === self.investmentAccountData()[i].value) {
          self.valueData.investmentAccountNumberValue = self.investmentAccountData()[i].label;
          self.riskProfile(self.investmentAccountData()[i].riskProfile);
          self.extraData.riskProfile = self.investmentAccountData()[i].riskProfile;
          break;
        }
      }

      self.folioDataDisplay(self.purchaseFund.investmentAccountNumber.value, self.purchaseFund.fundHouseCode);
    }

    self.termsAndCondtions = function() {
      $("#terms-n-conditions").trigger("openModal");
    };

    self.calculateDate = function() {
      self.viewEstimatedDate(false);

      let startDate;
      const frequency = $("#frequency").val();

      if (self.orderStatusFlag()) {
        startDate = $("#start-date-update").val();
      } else if (self.purchaseFund.instructionTypeCode === "SIP") {
        startDate = $("#start-date-sip").val();
      } else if (self.purchaseFund.instructionTypeCode === "SI") {
        startDate = $("#start-date-si").val();
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

    self.openPopup = function(open) {
      const popup = document.querySelector("#show-more-info");

      if (open) {
        const listener = popup.open("#estimated-date-info");

        popup.addEventListener("ojOpen", listener);
      } else {
        popup.close();
      }
    };

    self.investmentAccountChange = function(event) {
      for (i = 0; i < self.investmentAccountData().length; i++) {
        if (event.detail.value.displayValue === self.investmentAccountData()[i].label) {
          self.extraData.investmentAccountInfo = self.investmentAccountData()[i].primaryHolderName + "-" + event.detail.value.displayValue + "-" + self.investmentAccountData()[i].holdingPattern;
        }

        if (event.detail.value.value === self.investmentAccountData()[i].value) {
          self.valueData.investmentAccountNumberValue = self.investmentAccountData()[i].label;
          self.riskProfile(self.investmentAccountData()[i].riskProfile);
          self.extraData.riskProfile = self.investmentAccountData()[i].riskProfile;
          break;
        }
      }

      self.folioDataDisplay(event.detail.value.value, self.purchaseFund.fundHouseCode);
    };

    self.folioChange = function(event) {
      for (i = 0; i < self.folioData().length; i++) {
        if (event.detail.value === self.folioData()[i].code) {
          self.valueData.folioValue = self.folioData()[i].label;
          break;
        }
      }
    };

    const applicableDates = responseDTO.applicableDates.split(",");

    self.dayFormatter = function(dateInfo) {
      let applicable = false;

      for (i = 0; i < applicableDates.length; i++) {
        if (dateInfo.date === parseInt(applicableDates[i])) {
          applicable = true;
        }
      }

      if (applicable === false) {
        return {
          disabled: true
        };
      }

    };

    self.frequencyChange = function(event) {
      self.valueData.frequencyValue = event.detail.value;
      self.calculateDate();
    };

    self.installmentsChange = function(event) {
      self.valueData.installmentsValue = event.detail.value;
      self.calculateDate();
    };

    self.instructionChange = function() {
      self.instructionTypeCode(false);
      ko.tasks.runEarly();
      self.instructionTypeCode(true);
    };

    self.installmentsValidator = {
      validate: function(value) {
        if (value < self.extraData.minInstallments) {
          throw new oj.ValidatorError("", self.resource.minimumInstallments);
        }

        return true;
      }
    };

    self.save = function() {
      const tracker = document.getElementById("fbtracker");

      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }

      self.showFloatingButton(false);

      for (i = 0; i < self.payLoadArray().length; i++) {
        if (self.payLoadArray()[i].id === self.id()) {
          self.actionUpdate(true);

          if (self.purchaseFund.folioNumber === "" || self.purchaseFund.folioNumber === null) {
            self.valueData.folioValue = self.resource.newFolio;
          }

          self.totalAmount(self.totalAmount() - self.payLoadArray()[i].purchaseFund.txnAmount.amount);
          self.purchaseFund.txnAmount.amount = self.mockAmount();

          self.purchaseFund.casaAccountNumber = {
            displayValue: self.additionalDetails().account.id.displayValue,
            value: self.selectedAccount()
          };

          self.valueData.casaAccountNumberValue = self.additionalDetails().account.id.displayValue;

          if (self.purchaseFund.instructionTypeCode !== "ONE_TIME") {
            self.purchaseFund.recurring = true;
          }

          if (self.extraData.nowLater === "LATER") {
            self.purchaseFund.instructionTypeCode = self.extraData.nowLater;
            self.purchaseFund.recurring = false;
          }

          self.totalAmount(self.totalAmount() + self.purchaseFund.txnAmount.amount);
          self.payLoadArray()[i].purchaseFund = self.purchaseFund;
          self.payLoadArray()[i].extraData = self.extraData;
          self.payLoadArray()[i].valueData = self.valueData;
          self.payLoadArray()[i].totalAmount = self.totalAmount();
          self.payLoadArray()[i].estimatedDate = self.estimatedDate();
          self.payLoadArray()[i].id = self.id();
          self.count(self.count() + 1);
          self.orderWidget(false);

          if (self.payLoadArray().length < self.maximumNumberOfPurchases()) {
            self.disabledButtons(false);
          }

          if (self.payLoadArray().length >= self.maximumNumberOfPurchases()) {
            self.addNewButton(false);
            self.disabledButtons(true);
          }

          self.singlePurchase(false);
          self.refresh(false);
          ko.tasks.runEarly();

          if (self.orderStatusFlag() === false) {
            self.newFund(false);
            self.refresh(true);
            self.orderWidget(true);
            self.showFloatingButton(true);
          }
        }
      }

      if (!self.actionUpdate()) {
        if (self.purchaseFund.folioNumber === "" || self.purchaseFund.folioNumber === null) {
          self.valueData.folioValue = self.resource.newFolio;
        }

        self.purchaseFund.txnAmount.amount = self.mockAmount();

        self.purchaseFund.casaAccountNumber = {
          displayValue: self.additionalDetails().account.id.displayValue,
          value: self.selectedAccount()
        };

        self.valueData.casaAccountNumberValue = self.additionalDetails().account.id.displayValue;

        if (self.purchaseFund.instructionTypeCode !== "ONE_TIME") {
          self.purchaseFund.recurring = true;
        }

        if (self.extraData.nowLater === "LATER") {
          self.purchaseFund.instructionTypeCode = self.extraData.nowLater;
          self.purchaseFund.recurring = false;
        }

        self.totalAmount(self.totalAmount() + self.purchaseFund.txnAmount.amount);

        self.payLoadArray().push({
          purchaseFund: self.purchaseFund,
          extraData: self.extraData,
          valueData: self.valueData,
          totalAmount: self.totalAmount(),
          estimatedDate: self.estimatedDate(),
          id: self.id()
        });

        self.count(self.count() + 1);
        self.orderWidget(false);

        if (self.payLoadArray().length < self.maximumNumberOfPurchases()) {
          self.disabledButtons(false);
        }

        if (self.payLoadArray().length >= self.maximumNumberOfPurchases()) {
          self.addNewButton(false);
          self.disabledButtons(true);
        }

        self.singlePurchase(false);
        self.refresh(false);
        ko.tasks.runEarly();

        if (self.orderStatusFlag() === false) {
          self.newFund(false);
          self.refresh(true);
          self.orderWidget(true);
          self.showFloatingButton(true);
        }
      }

      ko.tasks.runEarly();

      if (params.baseModel.small()) {
        self.openpartials();
      }
    };

    self.buyNewFund = function() {
      self.newFund(true);
      self.id(self.id() + 1);

      params.dashboard.loadComponent("purchase-mutual-fund-train", {
        newFund: self.newFund(),
        payLoadArray: self.payLoadArray(),
        totalAmount: self.totalAmount(),
        id: self.id(),
        count: self.count(),
        outerArray: self.outerArray()
      });
    };

    self.showDetails = function() {
      params.dashboard.openRightPanel("fund-information", {
        schemeCode: self.purchaseFund.scheme.schemeCode
      }, self.purchaseFund.scheme.schemeName);
    };

    self.submit = function() {
      const trackernew = document.getElementById("termstracker");

      if (!params.baseModel.showComponentValidationErrors(trackernew)) {
        return;
      }

      if (!self.orderStatusFlag()) {
        self.id(self.id() + 1);
      }

      params.dashboard.loadComponent("purchase-order-review", {
        payLoadArray: self.payLoadArray(),
        totalAmount: self.totalAmount(),
        fundHouseData: self.fundHouseData(),
        schemeDetailsDTO: self.schemeDetailsDTO()
      });
    };
  };
});
