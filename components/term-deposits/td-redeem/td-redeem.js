define([
  "knockout",
    "./model",
    "ojL10n!resources/nls/td-redeem",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function(ko, RedeemModel, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.additionalDetails = ko.observable();
    self.validationTracker = ko.observable();
    self.chargesLoaded = ko.observable();
    self.module = ko.observable();
    self.isPartialRedeemAllowed = ko.observable(true);
    ko.utils.extend(self, rootParams.rootModel);
    self.locale = locale;

    const confirmScreenExtensions = {};

    rootParams.dashboard.headerName(self.locale.redeem.header);
    rootParams.baseModel.registerComponent("account-nickname", "accounts");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("account-input");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerComponent("td-payout", "term-deposits");
    rootParams.baseModel.registerComponent("review-td-redeem", "term-deposits");

    self.demandDepositMapping = {
      CON:"demandDeposit?productType=CON",
      RFC:"demandDeposit?productType=RFC&excludeBaseCurrency=true",
      FCNR:"demandDeposit?productType=NRE",
      NRE:"demandDeposit?productType=NRE",
      NRO:"demandDeposit?productType=NRO"
    };

    if(self.params.productDTO && self.params.productDTO.depositProductType){
      self.productType = ko.observable(self.params.productDTO.depositProductType);
    }
    else{
      self.productType = ko.observable("CON");
    }

    self.customURL=ko.observable(self.demandDepositMapping[self.productType()]);

    const getNewKoModel = function() {
      const KoModel = RedeemModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.rootModelInstance = self.previousState ? ko.mapping.fromJS(self.previousState.data) : getNewKoModel();

    if (self.params.id) {
      self.rootModelInstance.accountId.value(self.params.id.value);
      self.rootModelInstance.redemptionAmount.currency(self.params.currencyCode);
    }

    function fetchPenalities() {
      self.chargesLoaded(false);

      RedeemModel.redeemDetails(self.rootModelInstance.accountId.value(), ko.mapping.toJSON(self.rootModelInstance)).then(function(data) {
        delete data.redemptionDetailDTO.payoutInstructions;
        delete data.redemptionDetailDTO.redemptionAmount;
        ko.mapping.fromJS(data.redemptionDetailDTO, {}, self.rootModelInstance);
        self.chargesLoaded(true);
      });
    }

    const subscription1 = self.rootModelInstance.accountId.value.subscribe(function() {
        fetchPenalities();
      }),
      subscription2 = self.additionalDetails.subscribe(function(value) {
        self.rootModelInstance.accountId.displayValue(value.account.id.displayValue);
        self.rootModelInstance.redemptionAmount.currency(value.account.currencyCode);
        self.isPartialRedeemAllowed(value.account.productDTO.facilityParameter.partialRedeemAllowed);
        self.module(value.account.module);
        self.rootModelInstance.module(self.module());
        fetchPenalities();
      }),
      subscription3 = self.rootModelInstance.typeRedemption.subscribe(function(value) {
        if (value === "P") {
          self.chargesLoaded(false);
          self.rootModelInstance.redemptionAmount.amount("");
        } else if (value === "F") {
          self.rootModelInstance.redemptionAmount.amount("");
          fetchPenalities();
        }
      }),
      subscription4 = self.rootModelInstance.redemptionAmount.amount.subscribe(function(newValue) {
        if (newValue && self.rootModelInstance.typeRedemption() === "P") {
          fetchPenalities();
        }
      });

    self.redeemVerify = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("redeemtd"))) {
        return;
      }

      RedeemModel.redeemDetails(self.rootModelInstance.accountId.value(), ko.mapping.toJSON(self.rootModelInstance)).then(function(data) {
        delete data.redemptionDetailDTO.payoutInstructions;
        delete data.redemptionDetailDTO.redemptionAmount;
        ko.mapping.fromJS(data.redemptionDetailDTO, {}, self.rootModelInstance);

        rootParams.dashboard.loadComponent("review-td-redeem", {
          mode: "review",
          data: ko.mapping.toJS(self.rootModelInstance),
          holdAmount: self.additionalDetails().account.holdAmount,
          confirmScreenExtensions: confirmScreenExtensions,
          redeemTransactionConfirm: ko.mapping.toJS(self.redeemTransactionConfirm)
        });
      });
    };

    self.redeemTransactionConfirm = function() {
      if (self.rootModelInstance.typeRedemption() === "F") {
        self.rootModelInstance.redemptionAmount.amount(self.additionalDetails().account.currentPrincipalAmount.amount);
        self.rootModelInstance.redemptionAmount.currency(self.additionalDetails().account.currentPrincipalAmount.currency);
      }

      RedeemModel.redeem(ko.mapping.toJSON(self.rootModelInstance), self.rootModelInstance.accountId.value()).then(function(data) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.locale.redeem.header,
          eReceiptRequired: true,
          hostReferenceNumber: data.redemptionDetail ? data.redemptionDetail[0].redeemReferenceNo : null,
          template: "confirm-screen/td-template",
          isRedeem: true,
          confirmScreenExtensions: confirmScreenExtensions
        });
      });
    };

    self.dispose = function() {
      subscription1.dispose();
      subscription2.dispose();
      subscription3.dispose();
      subscription4.dispose();
    };
  };
});
