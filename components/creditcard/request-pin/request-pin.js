define([
    "knockout",
  "jquery",
  "./model",
    "ojL10n!resources/nls/request-pin",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation"
], function(ko, $, RequestPinModel, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.common = self.resource.common;
    self.isDataLoaded = ko.observable(false);
    self.name = ko.observable();
    self.person = ko.observable();
    self.initiateAddOn = ko.observable(true);
    self.verifyAddOn = ko.observable(false);
    self.confirmAddOn = ko.observable(false);
    self.confirmData = ko.observable();
    self.referenceNumber = ko.observable();
    self.validationTracker = ko.observable();
    self.srNo = ko.observable();

    self.addressDetails = {
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

    Params.dashboard.headerName(self.resource.requestPin.cardHeading);
    self.additionalCardDetails = ko.observable();
    self.creditCardId = ko.observable();
    self.moduleURL = ko.observable();
    self.creditCardIdDisplay = ko.observable();
    self.cardObject = self.params;
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerElement("address");
    Params.baseModel.registerComponent("review-request-pin", "creditcard");
    Params.baseModel.registerComponent("creditcard-reset-pin", "creditcard");
    Params.baseModel.registerComponent("auto-pay", "creditcard");
    Params.baseModel.registerComponent("add-on-card", "creditcard");
    Params.baseModel.registerComponent("card-pay", "creditcard");
    Params.baseModel.registerComponent("card-statement", "creditcard");
    Params.baseModel.registerComponent("block-card", "creditcard");

    let valueToSend;

    self.creditCardId.subscribe(function() {
      self.isDataLoaded(false);

      if (Params.baseModel.small()) {
        self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.cardObject;
      }

      self.creditCardIdDisplay(self.cardObject.creditCard.displayValue);
      ko.tasks.runEarly();
      self.isDataLoaded(true);
    });

    if (self.params.id) {
      self.creditCardId(self.params.id.value);
      self.creditCardIdDisplay(self.params.id.displayValue);
    }

    if (self.params.jsonData) {
      self.moduleURL(self.params.jsonData.moduleURL);
    }

    self.reviewTransactionName = {
      header: self.resource.requestPin.review,
      reviewHeader: self.resource.requestPin.reviewHeader
    };

    self.showFloatingPanel = function() {
      $("#panelCreditCard4")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
    };

    self.addOnVerify = function() {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      if (self.addressDetails.deliveryOption() === "ACC") {
        valueToSend = {
          address: {
            codCountry: self.addressDetails.address.country
          },
          deliveryDetails: {
            modeOfDelivery: "COR",
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
              state: self.addressDetails.address.state,
              city: self.addressDetails.address.city,
              country: self.addressDetails.address.country,
              postalCode: self.addressDetails.address.zipCode
            }
          },
          addressType: self.addressDetails.addressType(),
          modeOfDelivery: "COR"
        };
      } else {
        valueToSend = {
          address: {},
          deliveryDetails: {
            modeOfDelivery: self.addressDetails.deliveryOption(),
            branches: {
              namBranch: self.addressDetails.branchCode,
              city: self.addressDetails.address.city,
              bankCode: self.addressDetails.branchCode
            }
          },
          addressType: self.addressDetails.addressType(),
          modeOfDelivery: self.addressDetails.deliveryOption(),
          branch: {
            namBranch: self.addressDetails.branchCode,
            city: self.addressDetails.address.city,
            bankCode: self.addressDetails.branchCode
          }
        };
      }

      self.confirmData(valueToSend);
      self.initiateAddOn(false);
      self.isDataLoaded(true);
      self.verifyAddOn(true);
      self.confirmAddOn(false);

      const context = {};

      context.headerName = Params.dashboard.headerName();
      context.creditCardId = self.creditCardId();
      context.initiateAddOn = self.initiateAddOn();
      context.verifyAddOn = self.verifyAddOn();
      context.confirmAddOn = self.confirmAddOn();
      context.isDataLoaded = self.isDataLoaded();
      context.creditCardIdDisplay = self.creditCardIdDisplay();
      context.addressDetails = self.addressDetails;
      context.reviewTransactionName = self.reviewTransactionName;
      context.requestPinConfirm = self.requestPinConfirm;
      Params.dashboard.loadComponent("review-request-pin", context);
    };

    self.requestPinConfirm = function() {
      RequestPinModel.updatePIN(ko.toJSON(self.confirmData()), self.creditCardId()).then(function(data) {
        self.srNo(data.serviceID);
        self.referenceNumber(data.serviceID);
        self.initiateAddOn(false);
        self.verifyAddOn(false);

        Params.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          sr: true,
          transactionName: self.resource.requestPin.transactionName,
          serviceNo: data.serviceID,
          srNo: self.srNo(),
          resourceBundle: self.resource,
          confirmScreenExtensions: {
            isSet: true,
            template: "confirm-screen/cc-template",
            taskCode: "CC_N_CRDS",
            flagPinRequest: true,
            creditCardIdDisplay: self.creditCardIdDisplay(),
            addressDetails: self.addressDetails.address
          }
        }, self);
      });
    };

    self.loadFloatingPanel = function(componentName){
      Params.dashboard.loadComponent(componentName, ko.mapping.toJS(self.params));
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
  };
});
