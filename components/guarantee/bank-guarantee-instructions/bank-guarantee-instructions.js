define([
    "knockout",
  "ojs/ojvalidationgroup",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext"
], function(ko) {
  "use strict";

  const vm = function(params) {
    const self = this;
    let chargesAccountLabel;

    ko.utils.extend(self, params.rootModel);
    self.chargesAccountValue = ko.observable();
    self.availableBalance = ko.observable();
    self.stageIndex = params.index;

    if (self.mode() === "EDIT") {
      if (self.guaranteeDetails.chargingAccountId.value() !== null) {
        self.chargesAccountValue(self.guaranteeDetails.chargingAccountId.value());

        chargesAccountLabel = self.chargesAccountList.filter(function(data) {
          return data.value === self.guaranteeDetails.chargingAccountId.value();
        });

        if (chargesAccountLabel && chargesAccountLabel.length > 0) {
          self.guaranteeDetails.chargingAccountId.displayValue(chargesAccountLabel[0].label);
        }
      } else {
        self.chargesAccountValue([]);
      }
    }

    self.chargesAccountValueSubscribe = self.chargesAccountValue.subscribe(function(newValue) {
      const chargesAccount = newValue;

      self.guaranteeDetails.chargingAccountId.value(chargesAccount);

      const chargesAccountLabel = self.chargesAccountList.filter(function(data) {
        return data.value === chargesAccount;
      });

      if (chargesAccountLabel && chargesAccountLabel.length > 0) {
        self.guaranteeDetails.chargingAccountId.displayValue(chargesAccountLabel[0].label);
        self.availableBalance(params.baseModel.formatCurrency(chargesAccountLabel[0].availableBalance.amount, chargesAccountLabel[0].availableBalance.currency));
      }
    });

    self.continueFunc = function() {
      const instructionsTracker = document.getElementById("instructionsTracker");

      if (instructionsTracker.valid === "valid") {
        self.stages[self.stageIndex()].expanded(false);
        self.stages[self.stageIndex()].validated(true);
        self.stages[self.stageIndex() + 1].expanded(true);
      } else {
        self.stages[self.stageIndex()].validated(false);
        instructionsTracker.showMessages();
        instructionsTracker.focusOn("@firstInvalidShown");
      }
    };
  };

  vm.prototype.dispose = function() {
    this.chargesAccountValueSubscribe.dispose();
  };

  return vm;
});