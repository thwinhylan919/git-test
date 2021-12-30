define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/investment-details-dashboard",
  "./model",
  "ojs/ojbutton",
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
], function(oj, ko, $, resourceBundle, DividendsSummaryModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;

    let data;

    self.holdingsData = ko.observableArray();
    self.dataSource = ko.observable();
    self.maxRating = ko.observable(5);
    self.dividendsSummaryData = ko.observable();
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
    self.redeemedRefresh = ko.observable(false);
    self.holdingsArray = ko.observableArray();

    DividendsSummaryModel.fetchHoldings(self.investmentAccount().value()).done(function(redeemedData) {
      self.dividendsSummaryData(redeemedData);
      self.redeemedRefresh(false);
      data = self.dividendsSummaryData();
      self.createTableHoldings();
      ko.tasks.runEarly();
      self.redeemedRefresh(true);
    });

    self.includeRedeemed = function(event) {
      if (event.detail.value[0] === "REDEEMED") {
        DividendsSummaryModel.fetchHoldings(self.investmentAccount().value(), true).done(function(redeemedData) {
          self.dividendsSummaryData(redeemedData);
          self.redeemedRefresh(false);
          data = self.dividendsSummaryData();
          self.createTableHoldings();
          ko.tasks.runEarly();
          self.redeemedRefresh(true);
        });
      } else {
        DividendsSummaryModel.fetchHoldings(self.investmentAccount().value()).done(function(redeemedData) {
          self.dividendsSummaryData(redeemedData);
          self.redeemedRefresh(false);
          data = self.dividendsSummaryData();
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
        newObj.amountInvested = v.investmentSummary.amountInvested.amount;
        newObj.currency = v.investmentSummary.amountInvested.currency;
        self.holdingId = v.accountHoldingId;
        newObj.recommendation = ko.observable("");

        DividendsSummaryModel.fetchRecommendation(newObj.schemeCode).done(function(data) {
          newObj.recommendation(data.schemeDTO.recommendation.recommendCode);
        });

        newObj.folioNumber = v.folioNumber;
        newObj.fundHouseCode = v.fundHouseCode;
        newObj.currentPrice = v.scheme.nav.amount;
        newObj.dividendsPaid = v.investmentSummary.dividendsPaid.amount;
        newObj.dividendsReinvested = v.investmentSummary.dividendsReInvested.amount;
        newObj.marketValue = v.investmentSummary.marketValue.amount;
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
          newObj.amountInvested = v.investmentSummary.amountInvested.amount;
          newObj.currency = v.investmentSummary.amountInvested.currency;

          if (newObj.schemeCode === "SUBTOTAL" || newObj.schemeCode === "TOTAL") {
            newObj.recommendation = "";
            newObj.folioNumber = "";
            newObj.fundHouseCode = "";
          } else {
            newObj.recommendation = ko.observable("");

            DividendsSummaryModel.fetchRecommendation(newObj.schemeCode).done(function(data) {
              newObj.recommendation(data.schemeDTO.recommendation.recommendCode);
            });

            newObj.folioNumber = v.folioNumber;
            newObj.fundHouseCode = v.fundHouseCode;
            newObj.holdingId = v.accountHoldingId;
          }

          newObj.currentPrice = v.scheme.nav.amount;
          newObj.dividendsPaid = v.investmentSummary.dividendsPaid.amount;
          newObj.dividendsReinvested = v.investmentSummary.dividendsReInvested.amount;
          newObj.marketValue = v.investmentSummary.marketValue.amount;
          newObj.instructionTypeCode = v.instructionTypeCode;
          newObj.rating = parseInt(v.scheme.fundRating);
        } else {
          newObj.id = id;
          newObj.schemeName = v.heading;
          newObj.schemeCode = v.headingText;
          newObj.recommendation = "";
          newObj.fundHouseCode = "";
          newObj.amountInvested = "";
          newObj.currentPrice = "";
          newObj.folioNumber = "";
          newObj.marketValue = "";
          newObj.rating = "";
          newObj.dividendsPaid = "";
          newObj.dividendsReinvested = "";
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
        headerText: self.resource.dividendsTab.recommendation,
        field: "recommendation"
      },
      {
        headerText: self.resource.dividendsTab.currentPrice,
        field: "currentPrice",
        headerClassName: "right"
      },
      {
        headerText: self.resource.dividendsTab.amountInvested,
        field: "amountInvested",
        headerClassName: "right"
      },
      {
        headerText: self.resource.dividendsTab.dividendsPaid,
        field: "dividendsPaid",
        headerClassName: "right"
      },
      {
        headerText: self.resource.dividendsTab.dividendsReinvested,
        field: "dividendsReinvested",
        headerClassName: "right"
      },
      {
        headerText: self.resource.dividendsTab.marketValue,
        field: "marketValue",
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
        amountInvested = 0,
        dividendsReinvested = 0,
        marketValue = 0,
        dividendsPaid = 0,
        totalDividendsPaid = 0,
        totalAmountInvested = 0,
        totalDividends = 0,
        totalCurrentMarketValue = 0;

      Object.keys(o).forEach(function(key) {
        typeChange = true;
        amountInvested = 0;
        dividendsPaid = 0;
        dividendsReinvested = 0;
        marketValue = 0;

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
            amountInvested += data.accountHoldings[j].investmentSummary.amountInvested.amount;
            dividendsReinvested += data.accountHoldings[j].investmentSummary.dividendsReInvested.amount;
            marketValue += data.accountHoldings[j].investmentSummary.marketValue.amount;
            dividendsPaid += data.accountHoldings[j].investmentSummary.dividendsPaid.amount;
          }
        }

        self.holdingsData.push({
          scheme: {
            schemeCode: "SUBTOTAL",
            schemeName: self.resource.holdingsTab.subTotal,
            nav: {
              amount: ""
            }
          },
          investmentSummary: {
            amountInvested: {
              amount: amountInvested,
              currency: data.accountHoldings[0].investmentSummary.amountInvested.currency
            },
            dividendsReInvested: {
              amount: dividendsReinvested
            },
            dividendsPaid: {
              amount: dividendsPaid
            },
            marketValue: {
              amount: marketValue
            }
          }
        });

        totalAmountInvested += amountInvested;
        totalDividends += dividendsReinvested;
        totalCurrentMarketValue += marketValue;
        totalDividendsPaid += dividendsPaid;
      });

      self.holdingsData.push({
        scheme: {
          schemeCode: "TOTAL",
          schemeName: self.resource.total,
          nav: {
            amount: ""
          }
        },
        investmentSummary: {
          amountInvested: {
            amount: totalAmountInvested,
            currency: data.accountHoldings[0].investmentSummary.amountInvested.currency
          },
          dividendsReInvested: {
            amount: totalDividends
          },
          dividendsPaid: {
            amount: totalDividendsPaid
          },
          marketValue: {
            amount: totalCurrentMarketValue
          }
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

        for (i = 0; i < self.dividendsSummaryData().accountHoldings.length; i++) {
          if (self.dividendsSummaryData().accountHoldings[i].scheme.schemeCode === self.schemeToSearch()) {
            filteredData.push(self.dividendsSummaryData().accountHoldings[i]);
          }
        }

        self.tableFill(filteredData);
      }
    };
  };
});
