define([

  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/upgrade-card",
  "load!./card-type-benefits.json",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojcheckboxset"
], function(ko, $, UpgradeCardModel, ResourceBundle, cardTypeBenefits) {
  "use strict";

  return function(Params) {
    const self = this,
      /**
       * GetNewKoModel - to get new model.
       *
       * @return {type}  Description.
       */
      getNewKoModel = function() {
        const KoModel = UpgradeCardModel.getNewModel();

        return KoModel;
      };

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable(false);
    self.detailsDisplayed = ko.observable(false);
    self.accountId = ko.observable(self.params.accountId.value);
    self.currentCardNo = ko.observable(self.params.cardNo.value);
    self.reviewEnable = ko.observable(false);
    self.cardTypes = ko.observableArray();
    self.upcardCardModel = self.previousState && self.previousState.upcardCardModel ? self.previousState.upcardCardModel : ko.observable(getNewKoModel().upcardCardModel);
    self.addressDetails = self.previousState && self.previousState.addressDetails ? self.previousState.addressDetails : ko.mapping.fromJS(getNewKoModel().addressDetails);
    self.debitCardDetailsObject = self.previousState && self.previousState.debitCardDetailsObject ? ko.observable(self.previousState.debitCardDetailsObject) : ko.observable(self.params);

    self.cardHolderDetails = {
      cardHolderName: self.debitCardDetailsObject().cardHolderName,
      cardHolderEmailId: Params.dashboard.userData.userProfile.emailId.displayValue,
      cardHolderPhoneNo: Params.dashboard.userData.userProfile.phoneNumber.displayValue
    };

    self.termsAndConditions = ko.observableArray([]);
    Params.baseModel.registerElement("address");
    Params.baseModel.registerComponent("review-upgrade-card", "demand-deposits");
    Params.dashboard.headerName(self.resource.upgradeDebitCard);

    const generateBenefitsArray = function(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].domestic = ko.observableArray();
        arr[i].international = ko.observableArray();
        arr[i].other = ko.observableArray();

        for (let j = 0; j < arr[i].debitCardBenefits.length; j++) {
          if (arr[i].debitCardBenefits[j].domesticLimit) {
            arr[i].domestic.push(arr[i].debitCardBenefits[j]);
          }

          if (arr[i].debitCardBenefits[j].internationalLimit) {
            arr[i].international.push(arr[i].debitCardBenefits[j]);
          }

          if (!arr[i].debitCardBenefits[j].domesticLimit && !arr[i].debitCardBenefits[j].internationalLimit) {
            arr[i].other.push(arr[i].debitCardBenefits[j]);
          }
        }
      }
    };

    UpgradeCardModel.fetchCardTypes(self.currentCardNo()).done(function(data) {
      self.cardTypes(data.debitCardTypeList);
      generateBenefitsArray(self.cardTypes());

      const cardTypes = cardTypeBenefits;

        for (let i = 0; i < self.cardTypes().length; i++) {
          self.cardTypes()[i].offers = cardTypes.cardTypes[0].offers;
          self.cardTypes()[i].rewards = cardTypes.cardTypes[0].rewards;
        }

        self.dataLoaded(true);

    });

    self.viewDetailsClick = function() {
      self.detailsDisplayed(!self.detailsDisplayed());
    };

    self.getCardTypeIndex = function(cardType) {
      for (let i = 0; i < self.cardTypes().length; i++) {
        if (cardType === self.cardTypes()[i].debitCardType) {
          return i;
        }
      }
    };

    self.cardTypeChangeHandler = function() {
      if (event.detail.value && self.detailsDisplayed()) {
        self.detailsDisplayed(false);
        ko.tasks.runEarly();
        self.detailsDisplayed(true);
      }
    };

    /**
     * Function to laod review page.
     *
     * @return {void}  Description.
     */
    self.review = function() {
      self.common = self.resource;

      const context = {};

      context.addressDetails = self.addressDetails;
      context.upcardCardModel = {};
      context.upcardCardModel.cardType = self.upcardCardModel.cardType;
      context.accountId = self.accountId();
      context.cardNo = self.currentCardNo();
      context.debitCardDetailsObject = self.debitCardDetailsObject();
      Params.dashboard.loadComponent("review-upgrade-card", context);
    };

    self.showTermsAndConditions = function() {
      $("#passwordDialog").trigger("openModal");
    };

    self.ok = function() {
      $("#passwordDialog").trigger("closeModal");
    };

    self.showFloatingPanel = function() {
      $("#panelDebitCard")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
    };
  };
});
