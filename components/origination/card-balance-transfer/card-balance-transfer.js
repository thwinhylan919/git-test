define([

  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/card-balance-transfer",
  "ojs/ojselectcombobox",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojcheckboxset",
  "ojs/ojswitch"
], function(ko, $, CardBalanceTransferModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    let i = 0;
    const self = this,
      CardBalanceTransferModelObject = new CardBalanceTransferModel(),
      getNewKoModel = function(modelData) {
        const KoModel = CardBalanceTransferModelObject.getNewModel(modelData);

        KoModel.transferCard.cardIssuerName = ko.observable(KoModel.transferCard.cardIssuerName);
        KoModel.transferCard.balanceTransferAmount = ko.observable(KoModel.transferCard.balanceTransferAmount);
        KoModel.transferCard.temp_maskedCardNumber = ko.observable(KoModel.transferCard.temp_maskedCardNumber);
        KoModel.transferCard.temp_isActive = ko.observable(KoModel.transferCard.temp_isActive);
        KoModel.transferCard.payeeName = ko.observable(KoModel.transferCard.payeeName);
        KoModel.transferCard.cardId = ko.observable(KoModel.transferCard.cardId);

        return KoModel;
      };

    self.validationTracker = ko.observable();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.isAddon = ko.observable(false);
    self.redrawAddonCards = ko.observable(false);
    self.addonCards = ko.observable(false);
    self.showAddonAdd = ko.observable(false);
    self.isBalanceTransfer = ko.observable(false);
    self.cardMaxLength = ko.observable(19);

    self.saveBalanceTranser = function(event) {
      if (event.detail.value === "OPTION_NO" && event.detail.previousValue === "OPTION_YES") {
        self.transferCards([]);
        self.productDetails().balanceTransferDetails = {};
        self.usedBalanceTransferCards(0);
        self.submitCards();
        self.showContinue(true);
        self.isBalanceTransfer(false);
        self.redrawCards(false);
      }

      if (event.detail.value === "OPTION_YES" && event.detail.previousValue === "OPTION_NO") {
        self.isBalanceTransfer(true);
        self.getBalanceTranferDetails();
      }
    };

    self.dataLoaded = ko.observable(false);
    self.cardIssuerNames = ko.observableArray();
    self.currency = self.productDetails().currency;
    self.transferCards = ko.observableArray();
    self.maxBalanceTransferCardsAllowed = ko.observable();
    self.usedBalanceTransferCards = ko.observable(0);
    self.maxBalanceTransferAmountAllowed = ko.observable();
    self.minBalanceTransferAmountAllowed = ko.observable();
    self.maxCreditLimit = ko.observable();
    self.redrawCards = ko.observable(false);
    self.existingBalanceTransferLoaded = ko.observable(false);
    self.addAnotherBalanceTransfer = ko.observable(true);

    self.balanceTrnf = function() {
      $("#balanceTransferInfoText").trigger("openModal");
    };

    self.cardIssuerNameLoaded = ko.observable(false);
    self.cardIssuerNames = ko.observableArray();
    self.showAdd = ko.observable(false);
    rootParams.baseModel.registerComponent("card-balance-transfer-input", "application-tracking");
    rootParams.baseModel.registerElement("amount-input");

    self.getBalanceTranferDetails = function() {
      CardBalanceTransferModelObject.fetchBalanceTransferDetails(self.productDetails().submissionId.value, self.productDetails().facilityId, self.productDetails().simulationId(), self.productDetails().offers.offerId).done(function(data) {
        if (data.balanceTransferDetails && data.balanceTransferDetails.transferCards) {
          self.productDetails().balanceTransferDetails = data.balanceTransferDetails;
          self.transferCards([]);

          for (i = 0; i < self.productDetails().balanceTransferDetails.transferCards.length; i++) {
            const card = getNewKoModel(self.productDetails().balanceTransferDetails.transferCards[i]).transferCard;

            self.transferCards().push(card);

            if (self.transferCards()[i].cardId()) {
              self.transferCards()[i].temp_maskedCardNumber(self.transferCards()[i].cardId());
            } else {
              self.transferCards()[i].temp_maskedCardNumber("");
            }

            const cardVal = self.transferCards()[i].cardId(),
              cardLen = 12;

            self.productDetails().balanceTransferDetails.transferCards[i].temp_maskedNumber = self.applyPattern(self.maskValue(cardVal, cardLen), [
              4,
              4,
              4,
              4
            ], 0);

            self.transferCards()[i].temp_maskedNumber = self.productDetails().balanceTransferDetails.transferCards[i].temp_maskedNumber;

            self.transferCards()[i].temp_maskedCardNumber(self.applyPattern(self.transferCards()[i].temp_maskedCardNumber(), [
              4,
              4,
              4,
              4
            ], 0));

            self.transferCards()[i].temp_maskedCardNumber(self.transferCards()[i].temp_maskedCardNumber().replace(/[^\-]/g, "x"));
            self.productDetails().balanceTransferDetails.transferCards[i].temp_maskedCardNumber = self.transferCards()[i].temp_maskedCardNumber();

          }

        self.applicantDetails()[0].creditCardInfo.customizeCard.balanceTransfer(self.transferCards());
          self.isBalanceTransfer(true);
        } else {
          self.productDetails().balanceTransferDetails = {};
        }

        self.showContinue(true);

        if (self.isBalanceTransfer()) {
          self.optedForBalanceTranser("OPTION_YES");
          self.initializeModel();
        } else {
          self.productDetails().balanceTransferDetails = {};
          self.isBalanceTransfer(false);
          self.optedForBalanceTranser("OPTION_NO");
        }

        self.existingBalanceTransferLoaded(true);
      });
    };

    CardBalanceTransferModelObject.fetchCardIssuerNames().done(function(data) {
      if (data.enumRepresentations) {
        for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.cardIssuerNames.push({
            code: data.enumRepresentations[0].data[i].code,
            description: data.enumRepresentations[0].data[i].description
          });
        }
      }

      self.cardIssuerNameLoaded(true);

    });

    self.getBalanceTranferDetails();

    self.initializeForm = function() {
      if (self.productDetails().balanceTransferDetails && self.productDetails().balanceTransferDetails.transferCards) {
        if (self.productDetails().balanceTransferDetails.transferCards[0].balanceTransferAmount > 0) {
          self.isBalanceTransfer(true);

          for (i = 0; i < self.usedBalanceTransferCards(); i++) {
            self.transferCards()[i].currencyCode = self.productDetails().balanceTransferDetails.transferCards[i].currencyCode;
            self.transferCards()[i].cardIssuerName(self.productDetails().balanceTransferDetails.transferCards[i].cardIssuerName);
            self.transferCards()[i].cardId(self.productDetails().balanceTransferDetails.transferCards[i].cardId);
            self.transferCards()[i].payeeName(self.productDetails().balanceTransferDetails.transferCards[i].payeeName);
            self.transferCards()[i].balanceTransferAmount(self.productDetails().balanceTransferDetails.transferCards[i].balanceTransferAmount);
          }
        } else {
          self.isBalanceTransfer(false);
          self.optedForBalanceTranser("OPTION_NO");
        }
      } else {
        self.isBalanceTransfer(true);
        self.optedForBalanceTranser("OPTION_YES");
      }
    };

    self.submitCards = function() {
      const balanceTransferTracker = document.getElementById("balanceTransferTracker");

      if (balanceTransferTracker === null || balanceTransferTracker.valid === "valid") {
      if (self.transferCards() && self.transferCards().length > 0 && !rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      const transferCards = [];

      if (self.isBalanceTransfer() && self.transferCards()) {
        for (i = 0; i < self.transferCards().length; i++) {
          if (self.transferCards()[i].balanceTransferAmount() !== "") {
            const transferCard = {};

            transferCard.currencyCode = self.productDetails().currency;
            transferCard.cardIssuerName = ko.mapping.toJS(ko.mapping.fromJS(self.transferCards()[i].cardIssuerName()));
            transferCard.balanceTransferAmount = ko.mapping.toJS(ko.mapping.fromJS(self.transferCards()[i].balanceTransferAmount()));

            transferCards.push(transferCard);
          }
        }
      }

      let promoCode = self.productDetails().offers.balanceTransferAttributeDTOList[0].balanceTransferPromoCode;

      if (transferCards.length === 0) {
        promoCode = "";
      }

      let payload = {
        promoCode: promoCode,
        transferCards: transferCards,
        simulationId: self.productDetails().simulationId(),
        offerId: self.productDetails().offers.offerId,
        facilityId: self.productDetails().facilityId
      };

      payload = ko.mapping.toJSON(payload, {
        ignore: ["temp_isActive", "temp_maskedCardNumber", "temp_maskedNumber"]
      });

      CardBalanceTransferModelObject.updateBalanceTransferDetails(self.productDetails().submissionId.value, payload).done(function() {
        if (self.transferCards() && self.transferCards().length > 0) {
          for (i = 0; i < self.transferCards().length; i++) {
            if (self.transferCards()[i].balanceTransferAmount() !== "") {
              self.transferCards()[i].temp_isActive(false);

              const cardVal = self.transferCards()[i].cardId(),
                cardLen = 12;

              self.transferCards()[i].temp_maskedNumber = self.applyPattern(self.maskValue(cardVal, cardLen), [
                4,
                4,
                4,
                4
              ], 0);
            }
          }

          if (self.usedBalanceTransferCards() < self.maxBalanceTransferCardsAllowed()) {
            self.showAdd(true);
          }else{
            self.showAdd(false);
          }

          self.productDetails().balanceTransferDetails.transferCards = ko.mapping.toJS(ko.mapping.fromJS(self.transferCards()));
          self.applicantDetails()[0].creditCardInfo.customizeCard.balanceTransfer(self.transferCards());
        } else {
          self.productDetails().balanceTransferDetails = {};
        }

        self.applicantDetails()[0].creditCardInfo.customizeCard.balanceTransfer(self.transferCards());
        self.showContinue(true);
      });
    }else{
      balanceTransferTracker.showMessages();
      balanceTransferTracker.focusOn("@firstInvalidShown");
    }
    };

    self.initializeModel = function() {
      self.maxCreditLimit(self.productDetails().offers.creditCardLimitDetailDTOList[0].maximumCreditLimit);
      self.maxBalanceTransferAmountAllowed(self.productDetails().offers.balanceTransferAttributeDTOList[0].maximumPercentCreditLimit / 100 * self.maxCreditLimit());
      self.minBalanceTransferAmountAllowed(self.productDetails().offers.balanceTransferAttributeDTOList[0].minimumBalanceTransferAmount);
      self.maxBalanceTransferCardsAllowed(self.productDetails().offers.balanceTransferAttributeDTOList[0].maximumNumberBalanceTransfer);

      if (self.productDetails().balanceTransferDetails) {
        if (self.productDetails().balanceTransferDetails.transferCards) {
          self.usedBalanceTransferCards(self.productDetails().balanceTransferDetails.transferCards.length);
        }
      } else {
        self.usedBalanceTransferCards(0);
      }

      if (self.usedBalanceTransferCards() === 0) {
        const card = getNewKoModel().transferCard;

        card.temp_isActive(true);
        self.showAdd(false);
        self.showContinue(false);
        self.usedBalanceTransferCards(1);
        self.transferCards().push(card);
      }else if (self.usedBalanceTransferCards() < self.maxBalanceTransferCardsAllowed()) {
          self.showAdd(true);
        } else {
          self.showAdd(false);
        }

      self.initializeForm();
      self.redrawCards(true);
      self.dataLoaded(true);

    };

    self.addCard = function() {
      self.redrawCards(false);
      self.usedBalanceTransferCards(self.usedBalanceTransferCards() + 1);

      const card = getNewKoModel().transferCard;

      self.transferCards().push(card);
      card.temp_isActive(true);
      self.showAdd(false);
      self.showContinue(false);

      ko.tasks.runEarly();
      self.redrawCards(true);
    };

    self.editCard = function(index) {
      self.redrawCards(false);
      self.transferCards()[index].temp_isActive(true);
      self.showAdd(false);
      self.showContinue(false);
      ko.tasks.runEarly();
      self.redrawCards(true);
    };

    self.removeCard = function(index) {
      self.redrawCards(false);
      self.usedBalanceTransferCards(self.usedBalanceTransferCards() - 1);
      self.transferCards().splice(index, 1);

      if (self.usedBalanceTransferCards() < self.maxBalanceTransferCardsAllowed()) {
        self.showAdd(true);
      } else {
        self.showAdd(false);
      }

      self.submitCards();
      ko.tasks.runEarly();
      self.redrawCards(true);
    };

    self.showTermsAndConditions = function() {
      $("#termsAndConditions").show().trigger("openModal");
    };

    self.cardNumberFocusIn = function(event) {
      const id = event.currentTarget.id.replace(/\D/g, "");

      self.transferCards()[id].temp_maskedCardNumber(self.transferCards()[id].cardId());

      self.transferCards()[id].temp_maskedCardNumber(self.applyPattern(self.transferCards()[id].temp_maskedCardNumber(), [
        4,
        4,
        4,
        4
      ], 0));
    };

    self.cardNumberFocusOut = function(event) {
      const id = event.currentTarget.id.replace(/\D/g, ""),
        val = event.target.value.replace(/\-|\d/g, "");

      if (val.length > 0) {
        event.target.value = null;
        self.transferCards()[id].cardId("");
        self.transferCards()[id].temp_maskedCardNumber("");
      } else {
        self.transferCards()[id].cardId(event.target.value.replace(/\-/g, ""));
        self.transferCards()[id].temp_maskedCardNumber(event.target.value.replace(/[^\-]/g, "x"));
        event.target.value = event.target.value.replace(/[^\-]/g, "x");
      }
    };

    self.cardNumberKeyup = function(event) {
      const id = event.currentTarget.id.replace(/\D/g, "");

      self.transferCards()[id].temp_maskedCardNumber(event.target.value);
      self.transferCards()[id].temp_maskedCardNumber(self.transferCards()[id].temp_maskedCardNumber().replace(/\-/g, ""));

      self.transferCards()[id].temp_maskedCardNumber(self.applyPattern(self.transferCards()[id].temp_maskedCardNumber(), [
        4,
        4,
        4,
        4
      ], 0));
    };
  };
});