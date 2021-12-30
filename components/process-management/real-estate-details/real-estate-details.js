define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/real-estate-details",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojbutton",
  "ojs/ojradioset"
], function (ko, RealEstateDetailsModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this,
      getNewModel = function () {
        const KoModel = ko.mapping.fromJS(RealEstateDetailsModel.getNewModel());

        return KoModel;
      };

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.addressLineArray = ko.observableArray();
    self.review = params.review;
    self.lineNumber = ko.observable(1);
    self.propertyType = ko.observable();
    self.constructionStatus = ko.observable();
    self.constructionCompleted = ko.observable();
    self.registrationNumber = ko.observable();
    self.city = ko.observable();
    self.country = ko.observable();
    self.propertyArea = ko.observable();
    self.marketValue = ko.observable();
    self.builderName = ko.observable();
    self.ownershipStatus = ko.observable();
    self.zone = ko.observable();
    self.propertyStatus = ko.observable();
    self.constructionCompletion = ko.observable();
    self.propertyPurchase = ko.observable();
    self.propertyLocation = ko.observable();
    self.addressLine1 = ko.observable();
    self.addressLine2 = ko.observable();
    self.addressLine3 = ko.observable();
    self.state = ko.observable();
    self.zipCode = ko.observable();
    self.unit = ko.observable();
    self.eligibleValue = ko.observable();
    self.builderClassification = ko.observable();
    self.pendingCharges = ko.observable();
    self.addLineNumber = ko.observable(1);
    self.specialZone = ko.observable();
    self.isPendingCharges = ko.observable();
    self.loanCurrencyCode = ko.observableArray();
    self.isCurrencyLoaded = ko.observable(false);
    self.selectedPropertyDesc = ko.observable("-");
    self.statusLabel = ko.observable("-");
    self.propertyStatusLabel = ko.observable("-");
    self.unitLabel = ko.observable("-");
    self.ownershipStatusLabel = ko.observable("-");
    params.baseModel.registerElement("amount-input");

    RealEstateDetailsModel.allCurrencyType().then(function (data) {
      for (let i = 0; i < data.currencyList.length; i++) {
        self.loanCurrencyCode.push({
          code: data.currencyList[i].code
        });
      }

      self.isCurrencyLoaded(true);
    });

    self.currencyParser = function (data) {
      const output = {};

      output.currencies = [];

      output.currencies.push({
        code: "",
        description: ""
      });

      for (let i = 0; i < data.currencyList.length; i++) {
        output.currencies.push({
          code: data.currencyList[i].code,
          description: data.currencyList[i].code
        });
      }

      return output;
    };

    self.constructionStatusOptions = ko.observable([{
      value: "C",
      label: self.nls.realEstateDetails.completed
    }, {
      value: "U",
      label: self.nls.realEstateDetails.underConstruction
    }]);

    self.propertyStatusOptions = ko.observable([{
      value: "N",
      label: self.nls.realEstateDetails.new
    }, {
      value: "E",
      label: self.nls.realEstateDetails.existing
    }]);

    self.ownershipStatusOptions = ko.observable([{
      value: "F",
      label: self.nls.realEstateDetails.freeHold
    }, {
      value: "L",
      label: self.nls.realEstateDetails.leaseHold
    }]);

    self.unitList = ko.observable([{
        code: "CENT",
        description: "CENT"
      },
      {
        code: "HECT",
        description: "Hectare"
      },
      {
        code: "ACRE",
        description: "ACRE"
      },
      {
        code: "SQMT",
        description: "Square Metre"
      },
      {
        code: "SQFT",
        description: "Square Feet"
      }
    ]);

    self.propertyType = ko.observable([{
        code: "G",
        description: "Gas Stations"
      },
      {
        code: "B",
        description: "Banks"
      },
      {
        code: "S",
        description: "Shopping Center"
      },
      {
        code: "R",
        description: "Retail"
      },
      {
        code: "O",
        description: "Office"
      },
      {
        code: "I/W",
        description: "Industrial/Warehouse"
      },
      {
        code: "A",
        description: "Apartment"
      },
      {
        code: "M/H",
        description: "Medical/Healthcare"
      },
      {
        code: "PPTY",
        description: "Residential Building"
      },
      {
        code: "PPTY1",
        description: "Commercial Building"
      },
      {
        code: "PPTY2",
        description: "Private Land"
      },
      {
        code: "PPTY3",
        description: "Commercial Land"
      }
    ]);

    self.addAddressLine = function () {

      if (self.addLineNumber() < 4) {
        self.addLineNumber(self.addLineNumber() + 1);
      }

      ko.tasks.runEarly();
    };

    self.removeAddressLine = function () {
      if (self.addLineNumber() > 1) {
        self.addLineNumber(self.addLineNumber() - 1);
      }

      ko.tasks.runEarly();
    };

    if (params.rootModel.productData().payload.realEstateDetails === undefined) {
      self.realEstateDetails = getNewModel().realEstateDetails;
      params.rootModel.productData().payload.realEstateDetails = self.realEstateDetails;
      self.path = params.rootModel.productData;
    } else {
      self.path = params.rootModel.productData;
    }

    if (self.review) {
      for (let i = 0; i < self.propertyType().length; i++) {
        if (self.path().payload.realEstateDetails.propertyType() === self.propertyType()[i].code) {
          self.selectedPropertyDesc = self.propertyType()[i].description;
        }
      }

      for (let i = 0; i < self.constructionStatusOptions().length; i++) {
        if (self.path().payload.realEstateDetails.constructionStatus() === self.constructionStatusOptions()[i].value) {
          self.statusLabel(self.constructionStatusOptions()[i].label);
        }
      }

      for (let i = 0; i < self.propertyStatusOptions().length; i++) {
        if (self.path().payload.realEstateDetails.propertyStatus() === self.propertyStatusOptions()[i].value) {
          self.propertyStatusLabel(self.propertyStatusOptions()[i].label);
        }
      }

      for (let i = 0; i < self.unitList().length; i++) {
        if (self.path().payload.realEstateDetails.unit() === self.unitList()[i].code) {
          self.unitLabel(self.unitList()[i].description);
        }
      }

      for (let i = 0; i < self.ownershipStatusOptions().length; i++) {
        if (self.path().payload.realEstateDetails.ownershipStatus() === self.ownershipStatusOptions()[i].value) {
          self.ownershipStatusLabel(self.ownershipStatusOptions()[i].label);
        }
      }

    }

    params.rootModel.successHandler = function () {
      if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      return new Promise(function (resolve) {
        resolve();
      });
    };

  };
});