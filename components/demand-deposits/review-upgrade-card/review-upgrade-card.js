define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/upgrade-card",
  "load!./card-type-benefits.json",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojcheckboxset"
], function(ko, UpgradeCardModel, ResourceBundle, cardTypeBenefits) {
  "use strict";

  return function(Params) {
    const self = this,
      /**
       * Let getNewKoModel - description.
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
    self.reviewEnable = ko.observable(false);
    self.cardTypes = ko.observableArray();

    self.cardHolderDetails = {
      cardHolderName: self.params.debitCardDetailsObject.cardHolderName,
      cardHolderEmailId: Params.dashboard.userData.userProfile.emailId.displayValue,
      cardHolderPhoneNo: Params.dashboard.userData.userProfile.phoneNumber.displayValue
    };

    self.termsAndConditions = ko.observableArray([]);
    Params.baseModel.registerElement("address");
    Params.dashboard.headerName(self.resource.upgradeDebitCard);
    self.reviewEnable(true);
    self.addressDetails = self.params.addressDetails;
    self.accountId = self.params.accountId;
    self.currentCardNo = self.params.cardNo;

    self.reviewTransactionName = {
      header: self.resource.review,
      reviewHeader: self.resource.reviewHeader
    };

    /**
     * Let generateBenefitsArray - description.
     *
     * @param  {type} arr - Description.
     * @return {type}     Description.
     */
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

    UpgradeCardModel.fetchCardTypes(self.currentCardNo).done(function(data) {
      self.cardTypes(data.debitCardTypeList);
      generateBenefitsArray(self.cardTypes());

      const cardTypes = cardTypeBenefits;

        for (let i = 0; i < self.cardTypes().length; i++) {
          self.cardTypes()[i].offers = cardTypes.cardTypes[0].offers;
          self.cardTypes()[i].rewards = cardTypes.cardTypes[0].rewards;
        }

        self.dataLoaded(true);

    });

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.submit = function() {
      const requestdata = {
          elements: []
        },
        elementsData = [];

      elementsData[0] = getNewKoModel().requestData;
      elementsData[0].label = "cardType";
      elementsData[0].values = [];
      elementsData[0].values[0] = self.params.upcardCardModel.cardType;
      elementsData[1] = getNewKoModel().requestData;
      elementsData[1].label = "city";
      elementsData[1].values = [];
      elementsData[1].values[0] = self.addressDetails.address.city;
      elementsData[2] = getNewKoModel().requestData;
      elementsData[2].label = "state";
      elementsData[2].values = [];
      elementsData[2].values[0] = self.addressDetails.address.state;
      elementsData[3] = getNewKoModel().requestData;
      elementsData[3].label = "country";
      elementsData[3].values = [];
      elementsData[3].values[0] = self.addressDetails.address.country;
      elementsData[4] = getNewKoModel().requestData;
      elementsData[4].label = "line";
      elementsData[4].values = [];
      elementsData[4].values[0] = self.addressDetails.address.line1;
      elementsData[4].values[1] = self.addressDetails.address.line2;
      elementsData[4].values[2] = self.addressDetails.address.line3;
      elementsData[4].values[3] = self.addressDetails.address.line4;
      elementsData[5] = getNewKoModel().requestData;
      elementsData[5].label = "zipcode";
      elementsData[5].values = [];
      elementsData[5].values[0] = self.addressDetails.address.zipCode;
      elementsData[6] = getNewKoModel().requestData;
      elementsData[6].label = "deliveryOption";
      elementsData[6].values = [];

      if (self.addressDetails.deliveryOption() === "ACC") {
        elementsData[6].values[0] = "COR";
      } else {
        elementsData[6].values[0] = self.addressDetails.deliveryOption();
      }

      requestdata.elements = elementsData;
      self.upcardCardPayload = getNewKoModel().upcardCardPayload;
      self.upcardCardPayload.requestType = "CHANGE_DEBIT_CARD";
      self.upcardCardPayload.requestData = JSON.stringify(requestdata);
      self.upcardCardPayload.entityTypeIdentifier = self.currentCardNo;
      self.upcardCardPayload.status = "PE";
      self.upcardCardPayload.entityTypeIdentifierKey = "DE";
      self.upcardCardPayload.priorityType = "H";
      self.upcardCardPayload.entityType = "DE";
      self.upcardCardPayload.definition.id = "SRX000000022";

      UpgradeCardModel.createUpgradeCardSR(ko.toJSON(self.upcardCardPayload)).then(function(data) {
        if (data.referenceNumber) {
          Params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            sr: true,
            flagUpgradeCard: true,
            cardType: self.params.upcardCardModel.cardType,
            addressDetails: self.addressDetails,
            transactionName: self.resource.transactionName,
            confirmScreenExtensions: {
              isSet: true,
              template: "confirm-screen/casa-template",
              taskCode: "SR_N_CRT",
              resourceBundle: self.resource
            }
          }, self);
        }
      });
    };
  };
});
