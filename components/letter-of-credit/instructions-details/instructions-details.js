define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/instruction-details",
  "ojL10n!resources/nls/trade-finance-errors",
  "ojL10n!resources/nls/trade-finance-common"
], function (ko, InstuctionsModel, resourceBundle, resourceBundleError, tradeFinanceCommon) {
  "use strict";

  return function (params) {
    const self = this;
    let chargesAccountLabel;

    ko.utils.extend(self, params.rootModel);
    self.chargesAccountValue = ko.observable();
    self.chargesBorneBy = ko.observable();
    self.stageIndex = params.index;
    self.showChargesAccount = ko.observable(false);
    self.availableBalance = ko.observable();
    self.nls = resourceBundle;
    self.errorNls = resourceBundleError;
    self.tradeFinanceCommonNls = tradeFinanceCommon;

    if (self.transactionType !== "SHIPPING_GUARANTEE" && self.letterOfCreditDetails.chargingAccountId.value() !== null) {
      self.showChargesAccount(true);
    }

    if (self.mode() === "EDIT") {
      if (self.letterOfCreditDetails.chargesBorneBy && self.letterOfCreditDetails.chargesBorneBy() !== null) {
        self.chargesBorneBy(self.letterOfCreditDetails.chargesBorneBy());
      } else {
        self.chargesBorneBy([]);
      }

      if (self.letterOfCreditDetails.chargingAccountId.value && self.letterOfCreditDetails.chargingAccountId.value() !== null) {
        self.chargesAccountValue(self.letterOfCreditDetails.chargingAccountId.value());

        chargesAccountLabel = self.chargesAccountList.filter(function (data) {
          return data.value === self.letterOfCreditDetails.chargingAccountId.value();
        });

        if (chargesAccountLabel && chargesAccountLabel.length > 0) {
          self.letterOfCreditDetails.chargingAccountId.displayValue(chargesAccountLabel[0].label);
          self.availableBalance(params.baseModel.formatCurrency(chargesAccountLabel[0].availableBalance.amount, chargesAccountLabel[0].availableBalance.currency));
        }
      } else {
        self.chargesAccountValue(null);
      }
    }

    self.chargesBorneByTypeOptions = ko.observableArray([{
      value: "BYAPPLICANT",
      label: self.nls.labels.BYAPPLICANT
    },
    {
      value: "BYCOUNTERPARTY",
      label: self.nls.labels.BYCOUNTERPARTY
    }
    ]);

    self.chargesBorneByChangeHandler = function (event) {
      if (event.detail.value) {
        self.letterOfCreditDetails.chargesBorneBy(event.detail.value);

        if (self.letterOfCreditDetails.chargesBorneBy() === self.chargesBorneByTypeOptions()[0].value) {
          self.showChargesAccount(true);
        }
        else {
          self.chargesAccountValue(null);
          self.availableBalance(null);
          self.letterOfCreditDetails.chargingAccountId.value("");
          self.letterOfCreditDetails.chargingAccountId.displayValue("");
          self.showChargesAccount(false);
        }

      }
    };

    self.chargesAccountChangeHandler = function (event) {
      if (event.detail.value) {
        self.letterOfCreditDetails.chargingAccountId.value(event.detail.value);

        const chargesAccount = event.detail.value;

        chargesAccountLabel = self.chargesAccountList.filter(function (data) {
          return data.value === chargesAccount;
        });

        if (chargesAccountLabel && chargesAccountLabel.length > 0) {
          self.letterOfCreditDetails.chargingAccountId.displayValue(chargesAccountLabel[0].label);
          self.availableBalance(params.baseModel.formatCurrency(chargesAccountLabel[0].availableBalance.amount, chargesAccountLabel[0].availableBalance.currency));
        }
      }
    };

    self.verifyCode = function () {

      const trackerSwift = document.getElementById("advBankSwiftCode");

      if (trackerSwift.valid === "valid" && self.letterOfCreditDetails.swiftId() !== null) {
        if (!self.bicCodeError()) {
          InstuctionsModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId()).done(function (data) {
            self.additionalBankDetails(data);
          }).fail(function () {
            self.letterOfCreditDetails.swiftId(null);
          });
        }
      } else {
        trackerSwift.showMessages();
        trackerSwift.focusOn("@firstInvalidShown");
      }
    };

    self.resetCode = function () {
      self.additionalBankDetails(null);
      self.letterOfCreditDetails.swiftId(null);
    };

    self.continueFunc = function () {
      const tracker = document.getElementById("insturctionsValidationTracker");

      if (tracker.valid === "valid") {
        self.stages[self.stageIndex()].expanded(false);
        self.stages[self.stageIndex()].validated(true);
        self.stages[self.stageIndex() + 1].expanded(true);
      } else {
        self.stages[self.stageIndex()].validated(false);
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
