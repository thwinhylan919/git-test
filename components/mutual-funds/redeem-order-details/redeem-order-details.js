define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/redeem-funds-global",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup",
  "ojs/ojradioset",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojdatetimepicker",
  "ojs/ojpopup"
], function(oj, ko, $, resourceBundle, RedeemOrderDetails) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.orderDetails.pageHeader);
    params.baseModel.registerComponent("redeem-scheme-details", "mutual-funds");
    params.baseModel.registerComponent("redeem-funds-review", "mutual-funds");
    params.baseModel.registerComponent("fund-information", "mutual-funds");
    params.baseModel.registerComponent("fund-info-bar", "mutual-funds");

    self.schemeBar = ko.observable("redeem-scheme-details");
    params.baseModel.registerElement("modal-window");
    params.baseModel.registerElement("amount-input");
    self.redeemTypeData = ko.observableArray();
    self.patternSelected = ko.observable("dd MMM yyyy");

    self.dateConverter = ko.observable(oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
      pattern: self.patternSelected()
    }));

    const currentDate = params.baseModel.getDate();

    currentDate.setDate(currentDate.getDate() + 1);
    self.startDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));

    const dateEnd = currentDate;

    dateEnd.setDate(dateEnd.getDate() + self.customEndDate() - 1);
    self.modelData.navigationData.endDate = oj.IntlConverterUtils.dateToLocalIso(dateEnd);

    let i;

    if (self.payLoadArray().length > 0) {
      self.submitDisabled(false);
    }

    RedeemOrderDetails.fetchSchemeDetails(self.schemeCode()).done(function(data) {
      self.redeemTypeLoaded(false);
      self.frequencyList().splice(0, self.frequencyList().length);
      self.installmentList().splice(0, self.installmentList().length);
      self.modelData.navigationData.cutOffDate = data.schemeDTO.cutOff;
      self.modelData.redeemFund.scheme.schemeName = data.schemeDTO.schemeName;
      self.modelData.navigationData.suitable = data.schemeDTO.suitable;
      self.modelData.navigationData.minimumAmount.currency = data.schemeDTO.minimumAmount.currency;
      self.modelData.navigationData.minimumAmount.amount = data.schemeDTO.minimumAmount.amount;
      self.modelData.navigationData.minimumUnits = data.schemeDTO.minimumUnits;
      self.modelData.navigationData.nav = data.schemeDTO.nav.amount;

      for (i = 0; i < data.schemeDTO.frequencyList.length; i++) {
        self.frequencyList().push({
          code: data.schemeDTO.frequencyList[i].code,
          label: data.schemeDTO.frequencyList[i].description
        });
      }

      for (i = 0; i < data.schemeDTO.installmentList.length; i++) {
        self.installmentList().push({
          code: data.schemeDTO.installmentList[i],
          label: data.schemeDTO.installmentList[i]
        });
      }

      self.schemeDetailsDTO(data);

      ko.tasks.runEarly();
      self.redeemTypeLoaded(true);
    });

    RedeemOrderDetails.fetchHoldingDetails(self.modelData.redeemFund.investmentAccountNumber.value, self.accountHoldingId()).done(function(data) {
      self.redeemTypeLoaded(false);
      self.modelData.redeemFund.folioNumber = data.accountHoldingDTO.folioNumber;
      self.modelData.navigationData.maximumAmount.currency = data.accountHoldingDTO.investmentSummary.amountInvested.currency;
      self.modelData.navigationData.maximumAmount.amount = data.accountHoldingDTO.investmentSummary.amountInvested.amount;
      self.modelData.navigationData.unitsHeld = data.accountHoldingDTO.investmentSummary.currentUnits;
      self.modelData.navigationData.availableUnits = data.accountHoldingDTO.investmentSummary.availableUnits;
      self.modelData.navigationData.marketValue = data.accountHoldingDTO.investmentSummary.marketValue.amount;
      self.modelData.navigationData.currency = data.accountHoldingDTO.investmentSummary.marketValue.currency;
      ko.tasks.runEarly();
      self.redeemTypeLoaded(true);
    });

    self.redeemTypes = function() {
      self.redeemTypeData().splice(0, self.redeemTypeData().length);

      const redeemTypeResponse = [{
          label: self.resource.orderDetails.units,
          code: "UN"
        },
        {
          label: self.resource.orderDetails.allUnits,
          code: "AUN"
        },
        {
          label: self.resource.orderDetails.amount,
          code: "AMT"
        },
        {
          label: self.resource.fundDetails.actionSwp,
          code: "SWP"
        }
      ];

      for (i = 0; i < redeemTypeResponse.length; i++) {
        self.redeemTypeData.push({
          label: redeemTypeResponse[i].label,
          code: redeemTypeResponse[i].code
        });
      }

      if (self.modelData.navigationData.redeemType) {
        for (i = 0; i < self.redeemTypeData().length; i++) {
          if (self.modelData.navigationData.redeemType === self.redeemTypeData()[i].code) {
            self.modelData.navigationData.redeemTypeLabel = self.redeemTypeData()[i].label;
            break;
          }
        }
      }

      if (self.modelData.navigationData.redeemTypeLabel === null) {
        self.modelData.navigationData.redeemTypeLabel = self.redeemTypeData()[0].label;
      }

      self.redeemTypeLoaded(true);
    };

    self.redeemTypes();

    self.redeemTypeListener = function(event) {
      self.redeemTypeLoaded(false);
      self.modelData.redeemFund.txnUnits = null;
      self.modelData.redeemFund.frequency = null;
      self.modelData.redeemFund.installments = null;
      self.modelData.redeemFund.startDate = null;
      self.modelData.redeemFund.instructionTypeCode = "ONE_TIME";
      self.modelData.redeemFund.scheduledDate = null;
      self.amountSwp("");
      self.amount("");

      if (event.detail.value === "UN") {
        self.modelData.navigationData.showAllUnits = false;
        self.modelData.navigationData.showEnterAmount = false;
        self.modelData.navigationData.showSwp = false;
        self.modelData.navigationData.showEnterUnits = true;
        self.modelData.navigationData.whenChanged = true;
        self.modelData.navigationData.when = "NOW";
      } else if (event.detail.value === "AUN") {
        self.modelData.navigationData.showEnterUnits = false;
        self.modelData.navigationData.showEnterAmount = false;
        self.modelData.navigationData.showSwp = false;
        self.modelData.navigationData.showAllUnits = true;
        self.modelData.navigationData.whenChanged = true;
        self.modelData.navigationData.when = "NOW";
        self.modelData.redeemFund.txnUnits = self.modelData.navigationData.availableUnits;
      } else if (event.detail.value === "AMT") {
        self.modelData.navigationData.showEnterUnits = false;
        self.modelData.navigationData.showAllUnits = false;
        self.modelData.navigationData.showSwp = false;
        self.modelData.navigationData.showEnterAmount = true;
        self.modelData.navigationData.whenChanged = true;
        self.modelData.navigationData.when = "NOW";
      } else if (event.detail.value === "SWP") {
        self.modelData.navigationData.showEnterUnits = false;
        self.modelData.navigationData.showAllUnits = false;
        self.modelData.navigationData.showEnterAmount = false;
        self.modelData.navigationData.whenChanged = false;
        self.modelData.navigationData.showSwp = true;
        self.modelData.navigationData.when = "NOW";
        self.modelData.redeemFund.instructionTypeCode = "SWP";
      }

      ko.tasks.runEarly();
      self.redeemTypeLoaded(true);

      for (i = 0; i < self.redeemTypeData().length; i++) {
        if (event.detail.value === self.redeemTypeData()[i].code) {
          self.modelData.navigationData.redeemTypeLabel = self.redeemTypeData()[i].label;
          break;
        }
      }
    };

    self.whenListener = function() {
      self.redeemTypeLoaded(false);
      self.modelData.navigationData.whenChanged = true;

      if (self.modelData.navigationData.when === "LATER") {
        self.modelData.redeemFund.instructionTypeCode = self.modelData.navigationData.when;
      }

      ko.tasks.runEarly();
      self.redeemTypeLoaded(true);
    };

    self.validateUnits = {
      validate: function(value) {
        if (value < self.modelData.navigationData.minimumUnits) {
          throw new oj.ValidatorError("", self.resource.orderDetails.minimumValidation);
        }

        if (value > self.modelData.navigationData.availableUnits) {
          throw new oj.ValidatorError("", params.baseModel.format(self.resource.orderDetails.maximumValidation, {
            availableUnits: self.modelData.navigationData.availableUnits
          }));
        }

        if (parseInt(value) === 0) {
          throw new oj.ValidatorError("", self.resource.orderDetails.requiredUnits);
        }

        return true;
      }
    };

    self.calculateDate = function() {
      self.viewEstimatedDate(false);

      let startDate;
      const frequency = $("#frequency").val();

      if (self.orderStatusFlag()) {
        startDate = $("#start-date-update").val();
      } else {
        startDate = $("#start-date").val();
      }

      const installments = $("#redemptions-drop-down").val();

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

    self.save = function() {
      const trackernew = document.getElementById("orderdetails");

      if (!params.baseModel.showComponentValidationErrors(trackernew)) {
        return;
      }

      self.showFloatingButton(false);

      for (i = 0; i < self.payLoadArray().length; i++) {
        if (self.payLoadArray()[i].id === self.id()) {
          self.actionUpdate(true);
          self.modelData.redeemFund.txnAmount.currency = self.modelData.navigationData.maximumAmount.currency;

          if (self.modelData.redeemFund.instructionTypeCode === "SWP") {
            self.modelData.redeemFund.recurring = true;
            self.totalAmount(self.totalAmount() - self.payLoadArray()[i].redeemFund.txnAmount.amount);
            self.modelData.redeemFund.txnAmount.amount = self.amountSwp();
            self.totalAmount(self.totalAmount() + self.modelData.redeemFund.txnAmount.amount);
          } else if (self.modelData.navigationData.redeemType === "AMT") {
            self.totalAmount(self.totalAmount() - self.payLoadArray()[i].redeemFund.txnAmount.amount);
            self.modelData.redeemFund.txnAmount.amount = self.amount();
            self.totalAmount(self.totalAmount() + self.modelData.redeemFund.txnAmount.amount);
          } else if (self.modelData.navigationData.redeemType === "UN" || self.modelData.navigationData.redeemType === "AUN") {
            self.totalAmount(self.totalAmount() - self.payLoadArray()[i].redeemFund.txnAmount.amount);
            self.modelData.redeemFund.txnAmount.amount = self.modelData.redeemFund.txnUnits * self.modelData.navigationData.nav;
            self.totalAmount(self.totalAmount() + self.modelData.redeemFund.txnAmount.amount);
          }

          self.payLoadArray()[i].redeemFund = self.modelData.redeemFund;
          self.payLoadArray()[i].navigationData = self.modelData.navigationData;
          self.payLoadArray()[i].accountHoldingId = self.accountHoldingId();
          self.payLoadArray()[i].totalAmount = self.totalAmount();
          self.payLoadArray()[i].estimatedDate = self.estimatedDate();
          self.orderWidget(false);
          self.submitDisabled(false);
          self.newFund(false);
          ko.tasks.runEarly();

          if (self.orderStatusFlag() === false) {
            self.orderWidget(true);
            self.showFloatingButton(true);
          }
        }
      }

      if (!self.actionUpdate()) {
        self.modelData.redeemFund.txnAmount.currency = self.modelData.navigationData.maximumAmount.currency;

        if (self.modelData.redeemFund.instructionTypeCode === "SWP") {
          self.modelData.redeemFund.txnAmount.amount = self.amountSwp();
          self.modelData.redeemFund.recurring = true;
          self.totalAmount(self.totalAmount() + self.modelData.redeemFund.txnAmount.amount);
        } else if (self.modelData.navigationData.redeemType === "AMT") {
          self.modelData.redeemFund.txnAmount.amount = self.amount();
          self.totalAmount(self.totalAmount() + self.modelData.redeemFund.txnAmount.amount);
        } else if (self.modelData.navigationData.redeemType === "UN" || self.modelData.navigationData.redeemType === "AUN") {
          self.modelData.redeemFund.txnAmount.amount = self.modelData.redeemFund.txnUnits * self.modelData.navigationData.nav;
          self.totalAmount(self.totalAmount() + self.modelData.redeemFund.txnAmount.amount);
        }

        self.payLoadArray().push({
          redeemFund: self.modelData.redeemFund,
          navigationData: self.modelData.navigationData,
          totalAmount: self.totalAmount(),
          accountHoldingId: self.accountHoldingId(),
          estimatedDate: self.estimatedDate(),
          id: self.id()
        });

        self.orderWidget(false);
        self.buttonDisabled(false);
        self.submitDisabled(false);
        self.newFund(false);
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

    self.redeemAnotherFund = function() {
      self.id(self.payLoadArray()[self.payLoadArray().length - 1].id + 1);
      self.newFund(true);

      params.dashboard.loadComponent("redeem-funds-global", {
          newFund: self.newFund(),
          payLoadArray: self.payLoadArray(),
          totalAmount: self.totalAmount(),
          id: self.id()
        });
    };

    self.showTermsAndConditions = function() {
      $("#terms-n-conditions").trigger("openModal");
    };

    self.showSchemeDetails = function() {
      $("#fund-info").trigger("openModal");
    };

    self.showDetails = function() {
      params.dashboard.openRightPanel("fund-information", {
        schemeCode: self.modelData.redeemFund.scheme.schemeCode
      }, self.modelData.redeemFund.scheme.schemeName);
    };

    self.submit = function() {
      const trackernew = document.getElementById("termstracker");

      if (!params.baseModel.showComponentValidationErrors(trackernew)) {
        return;
      }

      if (!self.orderStatusFlag()) {
        self.id(self.payLoadArray()[self.payLoadArray().length - 1].id + 1);
      }

      params.dashboard.loadComponent("redeem-funds-review", {
        payLoadArray: self.payLoadArray(),
        totalAmount: self.totalAmount()
      });
    };
  };
});
