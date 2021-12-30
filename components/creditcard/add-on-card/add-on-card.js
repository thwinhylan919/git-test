define([
    "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/add-on-card",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation"
], function(ko, $, AddOndModel, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.isDataLoaded = ko.observable(false);
    Params.baseModel.registerElement("amount-input");
    self.reasonsArray = self.reasonsArray || ko.observableArray();
    self.name = ko.observable();
    self.selectedRelationship = self.selectedRelationship || ko.observableArray([]);
    self.initiateAddOn = ko.observable(true);
    self.verifyAddOn = ko.observable(false);
    self.validationTracker = ko.observable();
    self.currentValueCredit = ko.observable();
    self.isNameLoaded = ko.observable(false);
    self.creditLimitCurrency = ko.observable();
    self.updatecreditLimit = ko.observable();
    self.availableCreditLimit = ko.observable();
    self.currentValueCashLimit = ko.observable();
    self.cashLimitCurrency = ko.observable();
    self.updatecashLimit = ko.observable();
    self.availableCashLimit = ko.observable();
    ko.utils.extend(self, Params.rootModel);
    self.cardObject = self.params;
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.addonCard.cardHeading);
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerComponent("review-add-on-card", "creditcard");
    Params.baseModel.registerComponent("creditcard-reset-pin", "creditcard");
    Params.baseModel.registerComponent("auto-pay", "creditcard");
    Params.baseModel.registerComponent("add-on-card", "creditcard");
    Params.baseModel.registerComponent("card-pay", "creditcard");
    Params.baseModel.registerComponent("card-statement", "creditcard");
    Params.baseModel.registerComponent("block-card", "creditcard");
    Params.baseModel.registerComponent("request-pin", "creditcard");
    Params.baseModel.registerElement("address");
    self.common = self.resource.common;
    self.supplementaryCardHolderRelationship = ko.observable();
    self.additionalCardDetails = ko.observable();
    self.creditCardId = ko.observable();
    self.moduleURL = ko.observable();
    self.partyId = ko.observable();
    self.primaryCardId = ko.observable();
    self.limitLoaded = ko.observable(false);
    self.creditCardIdDisplay = ko.observable();
    self.mode = ko.observable("VIEW");
    self.srNo = ko.observable();

    let valueToSend;
    const context = {};

    self.addressDetails = self.addressDetails || {
      address: {
        line1: ko.observable(""),
        line2: ko.observable(""),
        line3: ko.observable(""),
        line4: ko.observable(""),
        line5: ko.observable(""),
        line6: ko.observable(""),
        line7: ko.observable(""),
        line8: ko.observable(""),
        line9: ko.observable(""),
        line10: ko.observable(""),
        line11: ko.observable(""),
        line12: ko.observable(""),
        city: ko.observable(""),
        state: ko.observable(""),
        country: ko.observable(""),
        zipCode: ko.observable(""),
        addressTypeDescription: ko.observable("")
      },
      deliveryOption: ko.observable(null),
      addressType: ko.observable(null),
      branchCode: ko.observable(null)
    };

    self.reviewTransactionName = {
      header: self.resource.addonCard.review,
      reviewHeader: self.resource.addonCard.reviewHeading
    };

    self.creditCardId.subscribe(function() {
      self.isDataLoaded(false);

      if (Params.baseModel.small()) {
        self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.cardObject;

        if (self.mode() === "VIEW") {
          self.primaryCardId(self.cardObject.primaryCardId.value);
          self.partyId(self.cardObject.associatedParty.value);
        }
      } else {
        if (self.params.associatedParty)
          {self.partyId(self.params.associatedParty.value);}

        self.primaryCardId(self.params.primaryCardId.value);
      }

      ko.tasks.runEarly();
      self.creditCardIdDisplay(self.cardObject.creditCard.displayValue);
      self.fetchCardLimit();
      self.isDataLoaded(true);
    });

    if (self.params.id) {
      self.creditCardId(self.params.id.value);
      self.creditCardIdDisplay(self.params.id.displayValue);
    }

    if (self.params.jsonData) {
      self.moduleURL(self.params.jsonData.moduleURL);
    }

    if (self.mode() === "VIEW") {
      self.fetchCardLimit = function() {
        AddOndModel.fetchLimit(self.primaryCardId()).done(function(data) {
          for (let i = 0; i < data.limitDTO.length; i++) {
            if (data.limitDTO[i].type === "CA") {
              self.currentValueCashLimit(data.limitDTO[i].total.amount);
              self.availableCashLimit(data.limitDTO[i].available.amount);
            } else if (data.limitDTO[i].type === "CR") {
              self.currentValueCredit(data.limitDTO[i].total.amount);
              self.availableCreditLimit(data.limitDTO[i].available.amount);
            }
          }

          self.isDataLoaded(true);
        });

        if (self.mode() === "VIEW") {
          self.cashLimitCurrency(self.cardObject.cardCurrency);
          self.creditLimitCurrency(self.cardObject.cardCurrency);
        }
      };
    }

    if (!self.verifyAddOn() && self.selectedRelationship().length === 0) {
      self.isNameLoaded(false);

      AddOndModel.getRelationshipList().done(function(data) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.reasonsArray.push({
            code: data.enumRepresentations[0].data[i].code,
            description: self.resource.addonCard[data.enumRepresentations[0].data[i].code]
          });
        }

        ko.tasks.runEarly();
        self.isNameLoaded(true);
      });
    }

    self.addOnVerify = function() {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      valueToSend = {
        supplementaryCardHolderRelationship: self.selectedRelationship()[0],
        partyId: self.partyId(),
        primaryCardNo: self.primaryCardId(),
        creditLimit: self.updatecreditLimit(),
        cashLimit: self.updatecashLimit(),
        suplemtryCdHolderDetails: {
          addressType: self.addressDetails.addressType(),
          embossingName: self.name(),
          email: "",
          name: "",
          mothersMaidenName: "Name"
        },
        deliveryDetails: {
          modeOfDelivery: self.addressDetails.deliveryOption() === "ACC" ? "COR" : self.addressDetails.deliveryOption(),
          branches: {
            namBranch: self.addressDetails.branchCode,
            city: self.addressDetails.address.city,
            bankCode: self.addressDetails.branchCode
          },
          addressDetails: {
            line1: self.addressDetails.address.line1,
            line2: self.addressDetails.address.line2,
            line3: self.addressDetails.address.line3,
            line4: self.addressDetails.address.line4,
            line5: self.addressDetails.address.line5,
            line6: self.addressDetails.address.line6,
            line7: self.addressDetails.address.line7,
            line8: self.addressDetails.address.line8,
            line9: self.addressDetails.address.line9,
            line10: self.addressDetails.address.line10,
            line11: self.addressDetails.address.line11,
            line12: self.addressDetails.address.line12,
            city: self.addressDetails.address.city,
            state: self.addressDetails.address.state,
            country: self.addressDetails.address.country,
            postalCode: self.addressDetails.address.zipCode,
            addressTypeDescription: self.addressDetails.address.addressTypeDescription
          }
        }
      };

      self.initiateAddOn(false);
      self.isNameLoaded(false);
      self.verifyAddOn(true);
      self.isDataLoaded(true);
      self.isNameLoaded(true);
      self.mode("REVIEW");
      context.valueToSend = valueToSend;
      context.supplementaryCardHolderRelationship = self.selectedRelationship()[0];
      context.name = self.name();
      context.headerName = Params.dashboard.headerName();
      context.creditCardId = self.creditCardId();
      context.primaryCardId = self.primaryCardId();
      context.updatecreditLimit = self.updatecreditLimit();
      context.updatecashLimit = self.updatecashLimit();
      context.cashLimitCurrency = self.cashLimitCurrency();
      context.creditLimitCurrency = self.creditLimitCurrency();
      context.initiateAddOn = self.initiateAddOn();
      context.verifyAddOn = self.verifyAddOn();
      context.creditCardIdDisplay = self.creditCardIdDisplay();
      context.mode = self.mode();
      context.isDataLoaded = self.isDataLoaded();
      context.isNameLoaded = self.isNameLoaded();
      context.addressDetails = ko.mapping.fromJS(self.addressDetails);
      context.cardHeading = self.resource.addonCard.cardHeading;
      context.selectedRelationship = self.selectedRelationship();
      context.reviewTransactionName = self.reviewTransactionName;
      context.addOnConfirm = self.addOnConfirm;
      Params.dashboard.loadComponent("review-add-on-card", context);
    };

    self.addOnConfirm = function() {
      AddOndModel.addCard(ko.toJSON(valueToSend), self.creditCardId()).then(function(data) {
        self.initiateAddOn(false);
        self.verifyAddOn(false);
        self.srNo(data.serviceID);

        Params.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          sr: true,
          transactionName: self.resource.addonCard.addOnConfirm,
          serviceNo: data.serviceID,
          srNo: self.srNo(),
          resourceBundle: self.resource,
          confirmScreenExtensions: {
            isSet: true,
            template: "confirm-screen/cc-template",
            taskCode: "CC_N_SCR",
            flagAddOnCard: true,
            creditCardIdDisplay: self.creditCardIdDisplay
          }
        }, self);
      });
    };

    self.creditCardParser = function(data) {
      data.accounts = data.creditcards;

      data.accounts.map(function(creditCard) {
        creditCard.id = creditCard.creditCard;
        creditCard.partyId = data.associatedParty;
        creditCard.accountNickname = creditCard.cardNickname;
        creditCard.associatedParty = data.associatedParty;

        return creditCard;
      });

      return data;
    };

    self.showFloatingPanel = function() {
      $("#panelCreditCard8")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
    };

    self.loadFloatingPanel = function(componentName){
      Params.dashboard.loadComponent(componentName, ko.mapping.toJS(self.params));
    };
  };
});
