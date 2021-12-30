define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/investment-details-dashboard",
  "./model",
  "ojs/ojbutton",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojgauge",
  "ojs/ojselectcombobox",
  "ojs/ojnavigationlist",
  "ojs/ojarraytabledatasource",
  "ojs/ojgauge",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojmenu",
  "ojs/ojoption",
  "ojs/ojtable",
  "ojs/ojcheckboxset"
], function(oj, ko, $, resourceBundle, HoldingsSummaryModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;

    let data;

    self.holdingsData = ko.observableArray();
    self.dataSource = ko.observable();
    self.holdingsSummaryData = ko.observable();
    self.maxRating = ko.observable(5);
    self.holdingsMobileView = ko.observableArray();
    self.mobileDataSource = ko.observable();
    params.baseModel.registerComponent("fund-information", "mutual-funds");
    params.baseModel.registerComponent("fund-info-bar", "mutual-funds");
    self.holdingsCategory = ko.observableArray();

    self.showInfoPanel = function(event) {
      params.dashboard.openRightPanel("fund-information", {
        schemeCode: event.schemeCode
      }, event.schemeName);
    };

    self.holdingsCategory().push({
      code: "ALL",
      value: self.resource.selectCategory
    });

    self.mobileViewTable = ko.observable(false);
    self.redeemCheckBox = ko.observableArray();
    self.redeemedRefresh = ko.observable(true);
    self.holdingsArray = ko.observableArray();

    HoldingsSummaryModel.fetchHoldings(self.investmentAccount().value()).done(function(redeemedData) {
      self.holdingsSummaryData(redeemedData);
      self.redeemedRefresh(false);
      data = self.holdingsSummaryData();
      self.createTableHoldings();
      ko.tasks.runEarly();
      self.redeemedRefresh(true);
    });

    self.includeRedeemed = function(event) {
      if (event.detail.value[0] === "REDEEMED") {
        HoldingsSummaryModel.fetchHoldings(self.investmentAccount().value(), true).done(function(redeemedData) {
          self.holdingsSummaryData(redeemedData);
          self.redeemedRefresh(false);
          data = self.holdingsSummaryData();
          self.createTableHoldings();
          ko.tasks.runEarly();
          self.redeemedRefresh(true);
        });
      } else {
        HoldingsSummaryModel.fetchHoldings(self.investmentAccount().value()).done(function(redeemedData) {
          self.holdingsSummaryData(redeemedData);
          self.redeemedRefresh(false);
          data = self.holdingsSummaryData();
          self.createTableHoldings();
          ko.tasks.runEarly();
          self.redeemedRefresh(true);
        });
      }
    };

    let i = 0,
      filteredData = [];

    self.listViewFill = function(data) {
      let tempDataMobile = null;

      tempDataMobile = $.map(data, function(v) {
        const newObj = {};

        newObj.schemeName = v.scheme.schemeName;
        newObj.schemeCode = v.scheme.schemeCode;
        newObj.amount = v.txnAmount.amount;
        newObj.currency = v.txnAmount.currency;
        newObj.holdingId = v.accountHoldingId;
        newObj.recommendation = ko.observable("");

        HoldingsSummaryModel.fetchRecommendation(newObj.schemeCode).done(function(data) {
          newObj.recommendation(data.schemeDTO.recommendation.recommendCode);
        });

        newObj.folioNumber = v.folioNumber;
        newObj.fundHouseCode = v.fundHouseCode;
        newObj.dividendsReinvested = v.investmentSummary.dividend.amount;
        newObj.units = v.investmentSummary.currentUnits;
        newObj.marketValue = v.averagePurchaseNav.amount;
        newObj.gainLoss = v.investmentSummary.realizedGainLoss.amount + v.investmentSummary.unrealizedGainLoss.amount;
        newObj.instructionTypeCode = v.instructionTypeCode;
        newObj.rating = parseInt(v.scheme.fundRating);

        return newObj;
      });

      self.mobileDataSource(new oj.ArrayDataProvider(tempDataMobile, {
        keyAttributes: "schemeCode"
      }));

      ko.tasks.runEarly();
      self.mobileViewTable(true);
    };

    self.tableFill = function(data) {
      let tempData = null,
        id = 1;

      tempData = $.map(data, function(v) {
        const newObj = {};

        if (v.scheme) {
          newObj.id = id;
          newObj.schemeName = v.scheme.schemeName;
          newObj.schemeCode = v.scheme.schemeCode;
          newObj.amount = v.txnAmount.amount;
          newObj.currency = v.txnAmount.currency;

          if (newObj.schemeCode === "SUBTOTAL" || newObj.schemeCode === "TOTAL") {
            newObj.recommendation = "";
            newObj.folioNumber = "";
            newObj.fundHouseCode = "";
          } else {
            newObj.recommendation = ko.observable("");

            HoldingsSummaryModel.fetchRecommendation(newObj.schemeCode).done(function(data) {
              newObj.recommendation(data.schemeDTO.recommendation.recommendCode);
            });

            newObj.folioNumber = v.folioNumber;
            newObj.fundHouseCode = v.fundHouseCode;
            newObj.holdingId = v.accountHoldingId;
          }

          newObj.dividendsReinvested = v.investmentSummary.dividend.amount;
          newObj.units = v.investmentSummary.currentUnits;

          if (v.averagePurchaseNav) {
            newObj.marketValue = v.averagePurchaseNav.amount;
          }

          newObj.gainLoss = v.investmentSummary.realizedGainLoss.amount + v.investmentSummary.unrealizedGainLoss.amount;

          newObj.instructionTypeCode = v.instructionTypeCode;
          newObj.rating = parseInt(v.scheme.fundRating);
        } else {
          newObj.id = id;
          newObj.schemeName = v.heading;
          newObj.schemeCode = v.headingText;
          newObj.recommendation = "";
          newObj.amount = "";
          newObj.folioNumber = "";
          newObj.marketValue = "";
          newObj.fundHouseCode = "";
          newObj.rating = "";
          newObj.dividendsReinvested = "";
          newObj.gainLoss = "";
          newObj.units = "";
        }

        id = id + 1;

        return newObj;
      });

      self.dataSource(new oj.ArrayDataProvider(tempData, {
        keyAttributes: "id"
      }));

      ko.tasks.runEarly();
    };

    self.menuSelectOptions = ko.observableArray();

    self.menuSelectOptions.push({
      code: "PUR",
      value: self.resource.purchaseMenu,
      module: "purchase-mutual-fund-train",
      instructionTypeCode: "ONE_TIME"
    });

    self.menuSelectOptions.push({
      code: "SIP",
      value: self.resource.sip,
      module: "purchase-mutual-fund-train",
      instructionTypeCode: "SIP"
    });

    self.menuSelectOptions.push({
      code: "SWP",
      value: self.resource.redeemSwp,
      module: "redeem-funds-global",
      instructionTypeCode: "SWP"
    });

    self.menuSelectOptions.push({
      code: "RDM",
      value: self.resource.redeemMenu,
      module: "redeem-funds-global",
      instructionTypeCode: "ONE_TIME"
    });

    self.menuSelectOptions.push({
      code: "SWT",
      value: self.resource.switchMenu,
      module: "switch-funds-global",
      instructionTypeCode: "ONE_TIME"
    });

    self.headerText = ko.observableArray([{
        headerText: self.resource.holdingsSummary.scheme,
        field: "schemeName"
      },
      {
        headerText: self.resource.holdingsTab.recommendation,
        field: "recommendation"
      },
      {
        headerText: self.resource.holdingsTab.currentPrice,
        field: "marketValue",
        headerClassName: "right"
      },
      {
        headerText: self.resource.holdingsTab.purchaseAmount,
        field: "amount",
        headerClassName: "right"
      },
      {
        headerText: self.resource.holdingsTab.dividendsReinvested,
        field: "dividendsReinvested",
        headerClassName: "right"
      },
      {
        headerText: self.resource.holdingsTab.units,
        field: "units",
        headerClassName: "right"
      },
      {
        headerText: self.resource.holdingsTab.gainLoss,
        field: "gainLoss",
        headerClassName: "right"
      }
    ]);

    self.createTableHoldings = function() {
      self.holdingsData().splice(0, self.holdingsData().length);

      const o = [];
      let j = 0;

      for (i = 0; i < data.accountHoldings.length; i++) {
        o[data.accountHoldings[i].scheme.fundCategory.fundCategoryCode] = data.accountHoldings[i].scheme.fundCategory.fundCategoryCode;
      }

      let typeChange = true,
        purchaseAmount = 0,
        dividendsReinvested = 0,
        realizedGainLoss = 0,
        unrealizedGainLoss = 0,
        totalAmountInvested = 0,
        totalDividends = 0,
        totalReliazedGainLoss = 0,
        totalUnrealizedGainLoss = 0;

      Object.keys(o).forEach(function(key) {
        typeChange = true;
        purchaseAmount = 0;
        dividendsReinvested = 0;
        realizedGainLoss = 0;
        unrealizedGainLoss = 0;

        for (j = 0; j < data.accountHoldings.length; j++) {
          if (data.accountHoldings[j].scheme.fundCategory.fundCategoryCode === key) {
            if (typeChange === true) {
              if (data.accountHoldings[j].scheme.fundCategory.subCategories) {
                self.holdingsData.push({
                  heading: data.accountHoldings[j].scheme.fundCategory.subCategories[0].subCategoryDesc,
                  headingText: "HEADINGTEXT"
                });

                self.holdingsCategory().push({
                  code: data.accountHoldings[j].scheme.fundCategory.subCategories[0].subCategoryCode,
                  value: data.accountHoldings[j].scheme.fundCategory.subCategories[0].subCategoryDesc
                });
              } else {
                self.holdingsData.push({
                  heading: data.accountHoldings[j].scheme.fundCategory.fundCategoryDesc,
                  headingText: "HEADINGTEXT"
                });

                self.holdingsCategory().push({
                  code: data.accountHoldings[j].scheme.fundCategory.fundCategoryCode,
                  value: data.accountHoldings[j].scheme.fundCategory.fundCategoryDesc
                });
              }

              typeChange = false;
            }

            self.holdingsData.push(data.accountHoldings[j]);
            purchaseAmount += data.accountHoldings[j].txnAmount.amount;
            dividendsReinvested += data.accountHoldings[j].investmentSummary.dividend.amount;
            realizedGainLoss += data.accountHoldings[j].investmentSummary.realizedGainLoss.amount;
            unrealizedGainLoss += data.accountHoldings[j].investmentSummary.unrealizedGainLoss.amount;
          }
        }

        self.holdingsData.push({
          scheme: {
            schemeCode: "SUBTOTAL",
            schemeName: self.resource.holdingsTab.subTotal
          },
          txnAmount: {
            amount: purchaseAmount,
            currency: data.accountHoldings[0].txnAmount.currency
          },
          investmentSummary: {
            dividend: {
              amount: dividendsReinvested
            },
            realizedGainLoss: {
              amount: realizedGainLoss
            },
            unrealizedGainLoss: {
              amount: unrealizedGainLoss
            },
            currentUnits: ""
          },
          averagePurchaseNav: {
            amount: ""
          }
        });

        totalAmountInvested += purchaseAmount;
        totalDividends += dividendsReinvested;
        totalReliazedGainLoss += realizedGainLoss;
        totalUnrealizedGainLoss += unrealizedGainLoss;
      });

      self.holdingsData.push({
        scheme: {
          schemeCode: "TOTAL",
          schemeName: self.resource.total
        },
        txnAmount: {
          amount: totalAmountInvested,
          currency: data.accountHoldings[0].txnAmount.currency
        },
        investmentSummary: {
          dividend: {
            amount: totalDividends
          },
          realizedGainLoss: {
            amount: totalReliazedGainLoss
          },
          unrealizedGainLoss: {
            amount: totalUnrealizedGainLoss
          },
          currentUnits: ""
        },
        averagePurchaseNav: {
          amount: ""
        }
      });

      self.length = self.holdingsData().length;
      self.tableFill(self.holdingsData());
    };

    self.categorySelect = function(event) {
      self.holdingsMobileView().splice(0, self.holdingsMobileView().length);

      if (event.detail.value === "ALL") {
        for (i = 0; i < data.accountHoldings.length; i++) {
          self.holdingsMobileView.push(data.accountHoldings[i]);
        }
      } else {
        for (i = 0; i < data.accountHoldings.length; i++) {
          if (data.accountHoldings[i].scheme.fundCategory.subCategories && data.accountHoldings[i].scheme.fundCategory.subCategories[0].subCategoryCode === event.detail.value) {
            self.holdingsMobileView.push(data.accountHoldings[i]);
          } else if (data.accountHoldings[i].scheme.fundCategory.fundCategoryCode === event.detail.value) {
            self.holdingsMobileView.push(data.accountHoldings[i]);
          }
        }
      }

      self.mobileViewTable(false);
      self.listViewFill(self.holdingsMobileView());
    };

    self.openMenu = function(model, event) {
      self.modelUsage = ko.observable(model);

      const launcherId = event.currentTarget.attributes.id.nodeValue;

      self.launcherId = launcherId;
      document.getElementById(self.launcherId + "container").open();
    };

    self.menuItemSelect = function(event, data) {
      const code = event.target.id.split("_");

      for (i = 0; i < self.menuSelectOptions().length; i++) {
        if (code[0] === self.menuSelectOptions()[i].code) {
          data.instructionTypeCode = self.menuSelectOptions()[i].instructionTypeCode;
        }
      }

      data.investmentAccount = self.investmentAccount();
      params.baseModel.registerComponent(event.target.value, "mutual-funds");
      params.dashboard.loadComponent(event.target.value, data);
    };

    self.searchScheme = function(event) {
      filteredData = [];

      if (event.detail.value === "ALL") {
        self.schemeToSearch("ALL");
        self.showSummary(false);
        ko.tasks.runEarly();
        self.showSummary(true);
      } else {
        self.schemeToSearch(event.detail.value);

        for (i = 0; i < self.holdingsSummaryData().accountHoldings.length; i++) {
          if (self.holdingsSummaryData().accountHoldings[i].scheme.schemeCode === self.schemeToSearch()) {
            filteredData.push(self.holdingsSummaryData().accountHoldings[i]);
          }
        }

        self.tableFill(filteredData);
      }
    };
  };
});
