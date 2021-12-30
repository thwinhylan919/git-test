define([
    "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/td-payout",
  "ojs/ojinputtext",
  "ojs/ojknockout",
  "ojs/ojknockout-validation"
], function(ko, $, payoutInstructionsModel, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;
    let transferOptions;

    ko.utils.extend(self, rootParams.rootModel);
    self.locale = locale;
    self.transferOptionsList = ko.observableArray();
    self.transferOptionsLoaded = ko.observable();
    self.additionalDetailsTransfer = ko.observable();
    self.branchList = ko.observableArray([]);
    self.additionalBankDetails = ko.observable();
    self.correspondenceCharges = ko.observableArray();
    self.isChargesLoaded = ko.observable(false);
    self.displayAddress = ko.observable(false);
    self.payoutInstructions = rootParams.payoutInstructions;
    self.depositTypeChanged = ko.observable(true);
    self.customURL = ko.observable();
    self.payToComponent = rootParams.payToComponent?rootParams.payToComponent:self.locale.payoutInstructions.payTo;
    self.index = rootParams.index;
    rootParams.baseModel.registerElement("account-input");
    rootParams.baseModel.registerElement("bank-look-up");
    rootParams.baseModel.registerElement("internal-account-input");
    rootParams.baseModel.registerComponent("account", "term-deposits");

    self.additionalDetailsTransfer.subscribe(function(newValue) {
      if (newValue) {
        self.payoutInstructions.accountId.displayValue(self.additionalDetailsTransfer().account.id.displayValue);
        self.payoutInstructions.beneficiaryName(self.additionalDetailsTransfer().account.partyName);
        self.payoutInstructions.branchId(self.additionalDetailsTransfer().account.branchCode);
        self.payoutInstructions.bankName(self.additionalDetailsTransfer().address.branchName);
        self.payoutInstructions.address.line1(self.additionalDetailsTransfer().address.branchAddress.postalAddress.line1);
        self.payoutInstructions.address.line2(self.additionalDetailsTransfer().address.branchAddress.postalAddress.line2);
        self.payoutInstructions.address.city(self.additionalDetailsTransfer().address.branchAddress.postalAddress.city);
        self.payoutInstructions.address.country(self.additionalDetailsTransfer().address.branchAddress.postalAddress.country);
      }
    });

    function filterTrasferOption() {
      self.transferOptionsLoaded(false);
      self.transferOptionsList.removeAll();

      const options = transferOptions.filter(function(option) {
        if (rootParams.module() === "ISL") {
          return option.code === "I" || option.code === "O";
        }

        return true;
      });

      ko.utils.arrayPushAll(self.transferOptionsList, options);
      ko.tasks.runEarly();
      self.transferOptionsLoaded(true);
    }

    payoutInstructionsModel.fetchTransferOption().then(function(data) {
      transferOptions = data.enumRepresentations[0].data;
      ko.utils.arrayPushAll(self.transferOptionsList, data.enumRepresentations[0].data);

      if (rootParams.module) {
        if (!self.params.id) {
          self.module.subscribe(function() {
            filterTrasferOption();
          });
        }

        filterTrasferOption();
      } else {
        self.transferOptionsLoaded(true);
      }
    });

    self.payoutInstructions.type.subscribe(function() {
      self.payoutInstructions.account("");
      self.payoutInstructions.accountId.value(null);
      self.payoutInstructions.accountId.displayValue(null);
      self.payoutInstructions.beneficiaryName(null);
      self.payoutInstructions.branchId(null);
      self.payoutInstructions.bankName(null);
      self.payoutInstructions.address.line1("");
      self.payoutInstructions.address.line2("");
      self.payoutInstructions.address.city("");
      self.payoutInstructions.address.country("");
      self.payoutInstructions.clearingCode("");
      self.resetCode();

      if(self.payoutInstructions.type!=="INT"){
        delete self.payoutInstructions.correspondenceChargeType;
        delete self.payoutInstructions.internationalTransaction;
        delete self.payoutInstructions.country;
      }
    });

    self.payoutInstructions.branchId.subscribe(function(value) {
      self.setBankCode(value);
    });

    self.bankDetails = function() {
      if (self.payoutInstructions.clearingCode) {
        payoutInstructionsModel.fetchBranch(self.payoutInstructions.networkType(), self.payoutInstructions.clearingCode()).then(function(data) {
          self.additionalBankDetails(data);
        });
      }
    };

    self.setBankCode = function(bankCode) {
      if (bankCode) {
        self.displayAddress(false);
        self.payoutInstructions.branchId(bankCode);

        if (self.payoutInstructions.branchId()) {
          payoutInstructionsModel.fetchBankAddress(bankCode).then(function(data) {
            ko.utils.extend(self.payoutInstructions.address, ko.mapping.fromJS(data.addressDTO[0].branchAddress.postalAddress));

            for (let i = 0; i < self.branchList.length; i++) {
              if (self.branchList[i].id === self.payoutInstructions.branchId()) {
                self.payoutInstructions.bankName(self.branchList[i].branchName);
                break;
              }
            }

            self.displayAddress(true);
          });
        }
      }
    };

    self.additionalBankDetails.subscribe(function(newValue) {
      if (newValue) {
        ko.utils.extend(self.payoutInstructions.address, ko.mapping.fromJS(self.additionalBankDetails().branchAddress));
        self.payoutInstructions.bankName(self.additionalBankDetails().name);
      }
    });

    self.bankLookupHandler = function() {
      self.payoutInstructions.networkType("NEFT");
      $("#menuButtonDialog").trigger("openModal");
    };

    self.openLookup = function() {
      self.payoutInstructions.networkType("SWI");
      $("#menuButtonDialog").trigger("openModal");
    };

    self.resetCode = function() {
      ko.tasks.runEarly();
      self.additionalBankDetails(null);
    };

    payoutInstructionsModel.getCorrespondenceCharges().then(function(data) {
        self.isChargesLoaded(false);

        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.correspondenceCharges.push({
                text: self.locale.payoutInstructions.remittanceChargesOption[data.enumRepresentations[0].data[i].code],
                value: data.enumRepresentations[0].data[i].code
            });
        }

        ko.tasks.runEarly();
        self.isChargesLoaded(true);
    });

    let maturityInstructionSubscribe;

    if (self.rollOverType) {
      maturityInstructionSubscribe = self.rollOverType.subscribe(function() {
        self.payoutInstructions.type("");
      });
    } else if (self.rootModelInstance.createTDData && self.rootModelInstance.createTDData.rollOverType) {
      maturityInstructionSubscribe = self.rootModelInstance.createTDData.rollOverType.subscribe(function() {
        self.payoutInstructions.type("");
      });
    }

    self.dispose = function() {
      if (maturityInstructionSubscribe) {
        maturityInstructionSubscribe.dispose();
      }
    };

    self.verifyCode = function() {
      payoutInstructionsModel.getBankDetailsBIC(self.payoutInstructions.clearingCode()).then(function(data) {
        self.additionalBankDetails(data);
      });
    };
  };
});
