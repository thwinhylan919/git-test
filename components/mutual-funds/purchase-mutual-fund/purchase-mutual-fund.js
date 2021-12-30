define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/purchase-mutual-fund",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojswitch",
  "ojs/ojtable",
  "ojs/ojgauge",
  "ojs/ojradioset"
], function(ko, PurchaseMutualFund, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.selectFund);
    self.purchaseTypeData = ko.observableArray();
    self.newOldSwitch = ko.observable(true);
    self.fundCategoryLoaded = ko.observable(false);
    self.fundCategoryData = ko.observableArray();
    params.baseModel.registerComponent("fund-information", "mutual-funds");
    params.baseModel.registerComponent("fund-info-bar", "mutual-funds");
    self.purchaseTypeLoaded(true);

    let i;

    self.newOldChange = function() {
      self.newOldSwitch(false);
      ko.tasks.runEarly();
      self.newOldSwitch(true);
    };

    self.fundCategoryChange = function(event) {
      for (i = 0; i < self.fundCategoryData().length; i++) {
        if (event.detail.value === self.fundCategoryData()[i].code) {
          self.valueData.fundCategory = self.fundCategoryData()[i].label;
          self.purchaseFund.scheme.fundCategory.fundCategoryDesc = self.fundCategoryData()[i].label;
          break;
        }
      }

      self.schemeData().splice(0, self.schemeData().length);

      PurchaseMutualFund.fetchSchemeName(self.purchaseFund.fundHouseCode, event.detail.value).done(function(data) {
        self.schemeNameLoaded(false);

        for (i = 0; i < data.schemedtos.length; i++) {
          self.schemeData().push({
            label: data.schemedtos[i].schemeName,
            code: data.schemedtos[i].schemeCode
          });
        }

        ko.tasks.runEarly();
        self.schemeNameLoaded(true);
      });
    };

    self.investmentAccountChange = function(event) {
      self.schemeData().splice(0, self.schemeData().length);

      PurchaseMutualFund.fetchExistingSchemes(event.detail.value.value).done(function(data) {
        self.schemeNameLoaded(false);

        for (i = 0; i < data.accountHoldings.length; i++) {
          self.schemeData().push({
            label: data.accountHoldings[i].scheme.schemeName,
            code: data.accountHoldings[i].scheme.schemeCode,
            fundHouseCode: data.accountHoldings[i].fundHouseCode,
            fundCategoryCode: data.accountHoldings[i].fundCategoryCode
          });
        }

        ko.tasks.runEarly();
        self.schemeNameLoaded(true);
      });

      for (i = 0; i < self.investmentAccountData().length; i++) {
        if (event.detail.value.displayValue === self.investmentAccountData()[i].label) {
          self.extraData.investmentAccountInfo = self.investmentAccountData()[i].primaryHolderName + "-" + event.detail.value.displayValue + "-" + self.investmentAccountData()[i].holdingPattern;
        }

        if (event.detail.value.value === self.investmentAccountData()[i].value) {
          self.valueData.investmentAccountNumberValue = self.investmentAccountData()[i].label;
          self.riskProfile(self.investmentAccountData()[i].riskProfile);
          self.extraData.riskProfile = self.investmentAccountData()[i].riskProfile;
          break;
        }
      }
    };

    self.fundHouseChange = function(event) {
      self.schemeData().splice(0, self.schemeData().length);

      PurchaseMutualFund.fetchSchemeName(event.detail.value, self.purchaseFund.scheme.fundCategory.fundCategoryCode).done(function(data) {
        self.schemeNameLoaded(false);

        for (i = 0; i < data.schemedtos.length; i++) {
          self.schemeData().push({
            label: data.schemedtos[i].schemeName,
            code: data.schemedtos[i].schemeCode
          });
        }

        ko.tasks.runEarly();
        self.schemeNameLoaded(true);
      });

      for (i = 0; i < self.fundHouseData().length; i++) {
        if (event.detail.value === self.fundHouseData()[i].code) {
          self.valueData.fundHouse = self.fundHouseData()[i].label;
          break;
        }
      }
    };

    self.schemeChange = function(event) {
      PurchaseMutualFund.fetchSchemeDetails(event.detail.value).done(function(data) {
        self.schemeDetailsDTO(data);
        self.purchaseFund.scheme.schemeName = data.schemeDTO.schemeName;
        self.fundInformationPanel(true);
      });
    };

    self.showInfoPanel = function() {
      params.dashboard.openRightPanel("fund-information", {
        schemeCode: self.purchaseFund.scheme.schemeCode
      }, self.purchaseFund.scheme.schemeName);
    };

    PurchaseMutualFund.fetchFundCategory().done(function(data) {
      for (i = 0; i < data.schemecategorydtos.length; i++) {
        self.fundCategoryData.push({
          label: data.schemecategorydtos[i].fundCategoryDesc,
          code: data.schemecategorydtos[i].fundCategoryCode
        });
      }

      self.fundCategoryLoaded(true);
    });

    self.purchaseTypeData.push({
      label: self.resource.oneTime,
      code: "ONE_TIME"
    });

    self.purchaseTypeData.push({
      label: self.resource.systematicInvestment,
      code: "SIP"
    });

    self.purchaseTypeData.push({
      label: self.resource.standingInstruction,
      code: "SI"
    });

    if (self.dashboardRedirect() === true) {
      self.schemeData().splice(0, self.schemeData().length);

      PurchaseMutualFund.fetchExistingSchemes(self.purchaseFund.investmentAccountNumber.value).done(function(data) {
        self.schemeNameLoaded(false);

        for (i = 0; i < data.accountHoldings.length; i++) {
          self.schemeData().push({
            label: data.accountHoldings[i].scheme.schemeName,
            code: data.accountHoldings[i].scheme.schemeCode,
            fundHouseCode: data.accountHoldings[i].fundHouseCode,
            fundCategoryCode: data.accountHoldings[i].fundCategoryCode
          });
        }

        ko.tasks.runEarly();
        self.schemeNameLoaded(true);
      });

      for (i = 0; i < self.investmentAccountData().length; i++) {
        if (self.purchaseFund.investmentAccountNumber.displayValue === self.investmentAccountData()[i].label) {
          self.extraData.investmentAccountInfo = self.investmentAccountData()[i].primaryHolderName + "-" + self.purchaseFund.investmentAccountNumber.displayValue + "-" + self.investmentAccountData()[i].holdingPattern;
        }

        if (self.purchaseFund.investmentAccountNumber.value === self.investmentAccountData()[i].value) {
          self.valueData.investmentAccountNumberValue = self.investmentAccountData()[i].label;
          self.riskProfile(self.investmentAccountData()[i].riskProfile);
          self.extraData.riskProfile = self.investmentAccountData()[i].riskProfile;
          break;
        }
      }

      PurchaseMutualFund.fetchSchemeDetails(self.purchaseFund.scheme.schemeCode).done(function(data) {
        self.schemeDetailsDTO(data);
        self.purchaseFund.scheme.schemeName = data.schemeDTO.schemeName;
        self.fundInformationPanel(true);
      });
    }

    if (self.oldData()) {
      PurchaseMutualFund.fetchSchemeName(self.purchaseFund.fundHouseCode, self.purchaseFund.scheme.fundCategory.fundCategoryCode).done(function(data) {
        self.schemeNameLoaded(false);

        for (i = 0; i < data.schemedtos.length; i++) {
          self.schemeData().push({
            label: data.schemedtos[i].schemeName,
            code: data.schemedtos[i].schemeCode
          });
        }

        ko.tasks.runEarly();
        self.schemeNameLoaded(true);
      });

      PurchaseMutualFund.fetchSchemeDetails(self.purchaseFund.scheme.schemeCode).done(function(data) {
        self.schemeDetailsDTO(data);
        self.purchaseFund.scheme.schemeName = data.schemeDTO.schemeName;
        self.fundInformationPanel(true);
      });
    }

    if (self.orderStatusFlag() === true) {
      PurchaseMutualFund.fetchSchemeDetails(self.purchaseFund.scheme.schemeCode).done(function(data) {
        self.schemeDetailsDTO(data);
        self.purchaseFund.scheme.schemeName = data.schemeDTO.schemeName;
        self.fundInformationPanel(true);
      });

      self.schemeData().splice(0, self.schemeData().length);

      PurchaseMutualFund.fetchSchemeName(self.purchaseFund.fundHouseCode, self.purchaseFund.scheme.fundCategory.fundCategoryCode).done(function(data) {
        self.schemeNameLoaded(false);

        for (i = 0; i < data.schemedtos.length; i++) {
          self.schemeData().push({
            label: data.schemedtos[i].schemeName,
            code: data.schemedtos[i].schemeCode
          });
        }

        ko.tasks.runEarly();
        self.schemeNameLoaded(true);
      });
    }
  };
});
