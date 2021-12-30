define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/mutual-funds-reports",

  "./model",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview",
  "ojs/ojcollectiontabledatasource",
  "ojs/ojdatetimepicker",
  "ojs/ojtoolbar",
  "ojs/ojswitch"
], function(oj, ko, $, ResourceBundle, CapitalGainReport) {
  "use strict";

  return function(Params) {
    const self = this;

    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.capitalGainHeader);
    self.refreshData = ko.observable(true);
    self.dataSource = ko.observable();
    self.schemeCode = ko.observable();
    self.capitalGainLossType = ko.observable();
    self.investmentAccount = ko.observable();
    self.investmentAccountData = ko.observableArray();
    self.fundHouseData = ko.observableArray();
    self.fundHouseCode = ko.observable();
    self.financialYears = ko.observableArray([]);
    self.accountNumber = ko.observableArray();
    self.schemesData = ko.observableArray();
    self.financialYear = ko.observable();
    self.minFromDate = ko.observable();
    self.maxFromDate = ko.observable();
    self.minToDate = ko.observable();
    self.maxToDate = ko.observable();
    self.duration = ko.observable("financialYear");
    self.year = ko.observable(false);
    self.years = ko.observable("");
    self.noYears = 3;
    self.yearsLoaded = ko.observable(false);
    self.capitalGainTypesData = ko.observableArray();
    self.investmentAccountsLoaded = ko.observable(false);
    self.fundHouseDetailsLoaded = ko.observable(false);
    self.schemesDataLoaded = ko.observable(true);
    self.capitalGainLossTypesLoaded = ko.observable(false);
    self.searchResults = ko.observable(false);
    self.refresh = ko.observable(true);
    self.showDownload = ko.observable(true);
    self.fundHouseDTOData = ko.observableArray();
    self.fundHouseDTODetailsLoaded = ko.observable(false);

    let i;

    self.investmentAccountYes = ko.observable(false);

    CapitalGainReport.fetchInvestmentAccounts().done(function(data) {
      if (data.investmentAccounts.length) {
        self.investmentAccountYes(true);

        self.headerText = ko.observableArray([{
            headerText: self.resource.schemeName,
            field: "schemeName"
          },
          {
            headerText: self.resource.totalUnitsST,
            field: "totalUnitsST"
          },
          {
            headerText: self.resource.purchasePrice,
            field: "purchasePriceST",
            headerClassName: "right"
          },
          {
            headerText: self.resource.redemptionPrice,
            field: "redemptionPriceST",
            headerClassName: "right"
          },
          {
            headerText: self.resource.shortTermGainLoss,
            field: "shortTermGainLoss",
            headerClassName: "right"
          },
          {
            headerText: self.resource.totalUnitsLT,
            field: "totalUnitsLT"
          },
          {
            headerText: self.resource.purchasePrice,
            field: "purchasePriceLT",
            headerClassName: "right"
          },
          {
            headerText: self.resource.redemptionPrice,
            field: "redemptionPriceLT",
            headerClassName: "right"
          },
          {
            headerText: self.resource.longTermGainLoss,
            field: "longTermGainLoss",
            headerClassName: "right"
          }
        ]);

        const currentDate = Params.baseModel.getDate();

        if ((currentDate.getMonth() + 1) <= 3) {
          self.financialYear(currentDate.getFullYear());
          self.minFromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(currentDate.getFullYear() - 3, "03", "01")));

          for (let i = self.noYears; i > 0; i--) {
            self.financialYears.push({
              value: (currentDate.getFullYear() - i) + "-" + (currentDate.getFullYear() - i + 1),
              text: Params.baseModel.format(self.resource.year, {
                fromYear: currentDate.getFullYear() - i,
                toYear: currentDate.getFullYear() - i + 1
              })
            });
          }
        } else {
          self.financialYear(+currentDate.getFullYear() + 1);
          self.minFromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(currentDate.getFullYear() - 2, "03", "01")));

          for (let i = self.noYears; i > 0; i--) {
            self.financialYears.push({
              value: (currentDate.getFullYear() - i + 1) + "-" + (currentDate.getFullYear() - i + 2),
              text: Params.baseModel.format(self.resource.year, {
                fromYear: currentDate.getFullYear() - i + 1,
                toYear: currentDate.getFullYear() - i + 2
              })
            });
          }
        }

        self.maxToDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));
        self.maxFromDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));
        self.minToDate(self.minFromDate());
        self.yearsLoaded(true);

        self.investmentAccount = ko.observable({
          value: ko.observable(),
          displayValue: ko.observable()
        });

        self.valueChange = function() {
          let j;

          for (j = 0; j < self.accountNumber().length; j++) {
            if (self.accountNumber()[j].value === self.investmentAccount().value()) {
              self.investmentAccount().displayValue = self.accountNumber()[j].text;
              break;
            }
          }

          if (Params.rootModel.params.viewReport) {
            self.investmentAccount().displayValue = Params.rootModel.params.investmentAccount.displayValue;
            self.investmentAccount().value = Params.rootModel.params.investmentAccount.value;
          }

          CapitalGainReport.fetchFundHouse(self.investmentAccount().value()).done(function(data) {
            self.schemesDataLoaded(false);
            self.fundHouseData().splice(0, self.fundHouseData().length);

            for (i = 0; i < data.accountHoldings.length; i++) {
              self.fundHouseData().push({
                code: data.accountHoldings[i].fundHouseCode,
                label: null
              });

              self.schemesData().push({
                label: data.accountHoldings[i].scheme.schemeName,
                code: data.accountHoldings[i].scheme.schemeCode
              });
            }

            CapitalGainReport.fetchAllFundHouse().done(function(data) {
              self.fundHouseDTOData().splice(0, self.fundHouseDTOData().length);

              for (i = 0; i < data.fundhousedtos.length; i++) {

                self.fundHouseDTOData().push({
                  label: data.fundhousedtos[i].fundHouseName,
                  code: data.fundhousedtos[i].fundHouseCode
                });
              }

              for (i = 0; i < self.fundHouseDTOData().length; i++) {
                for (j = 0; j < self.fundHouseData().length; j++) {
                  if (self.fundHouseDTOData()[i].code === self.fundHouseData()[j].code) {
                    self.fundHouseData()[j].label = self.fundHouseDTOData()[i].label;
                  }
                }
              }

              ko.tasks.runEarly();
              self.fundHouseDTODetailsLoaded(true);
              self.schemesDataLoaded(true);
              self.fundHouseDetailsLoaded(true);

              if (Params.rootModel.params.viewReport) {
                self.searchReports();
              }
            });
          });
        };

        /**
         * Option change handler for Financial Year/ Duration.
         *
         * @return {type} Description.
         */
        self.yearChange = function() {
          self.years("");

          if (self.duration() === "duration") {
            self.year(true);
          } else {
            self.year(false);
          }
        };

        self.fundHouseChange = function(event) {
          self.schemesData().splice(0, self.schemesData().length);

          CapitalGainReport.fetchSchemeName(self.investmentAccount().value(), event.detail.value).done(function(data) {
            self.schemesDataLoaded(false);

            for (i = 0; i < data.accountHoldings.length; i++) {
              self.schemesData().push({
                label: data.accountHoldings[i].scheme.schemeName,
                code: data.accountHoldings[i].scheme.schemeCode
              });

            }

            ko.tasks.runEarly();
            self.schemesDataLoaded(true);

          });

          for (i = 0; i < self.fundHouseData().length; i++) {
            if (event.detail.value === self.fundHouseData()[i].code) {
              self.fundHouseCode(self.fundHouseData()[i].code);
              break;
            }
          }
        };

        for (let i = 0; i < data.investmentAccounts.length; i++) {
          self.investmentAccountData.push({
            text: data.investmentAccounts[i].accountId.displayValue,
            value: data.investmentAccounts[i].accountId.value,
            primaryHolderName: data.investmentAccounts[i].primaryHolderName,
            holdingPattern: data.investmentAccounts[i].holdingPattern
          });
        }

        self.investmentAccountsLoaded(true);

        self.capitalGainTypesData().push({
          label: self.resource.shortTermGainLoss,
          code: "shortTermGainLoss"
        });

        self.capitalGainTypesData().push({
          label: self.resource.longTermGainLoss,
          code: "longTermGainLoss"
        });

        self.clearResults = function() {
          self.refresh(false);
          self.fundHouseCode("");
          self.schemeCode("");
          self.capitalGainLossType("");
          self.financialYear("");
          self.dataSource();
          self.searchResults(false);
          ko.tasks.runEarly();
          self.refresh(true);
        };

        self.searchReports = function() {
          self.searchResults(false);

          if (self.investmentAccountData() || self.capitalGainTypesData() || self.fundHouseData() || self.schemesData()) {
            CapitalGainReport.fetchCapitalGainReports(self.investmentAccount().value(), self.fundHouseCode(), self.schemeCode(), self.financialYear(), self.capitalGainLossType()).done(function(data) {
              let tempData = null;

              tempData = $.map(data.capitalGainReportsDTO.reportHoldings, function(v) {
                const newObj = {};

                newObj.schemeName = v.schemeName;
                newObj.financialYear = v.financialYear;
                newObj.redeemDate = v.redeemDate;
                newObj.fundHouse = v.fundHouseCode;
                newObj.totalUnitsST = v.totalUnitsST;
                newObj.totalUnitsLT = v.totalUnitsLT;
                newObj.redemptionPriceLT = v.redemtionValueLT.amount;
                newObj.redemptionPriceST = v.redemtionValueST.amount;
                newObj.purchasePriceLT = v.purchaseValueLT.amount;
                newObj.purchasePriceST = v.purchaseValueST.amount;
                newObj.currencypvst = v.purchaseValueST.currency;
                newObj.currencypvlt = v.purchaseValueLT.currency;
                newObj.currencyrvst = v.redemtionValueST.currency;
                newObj.currencyrvlt = v.redemtionValueLT.currency;
                newObj.purchaseDate = v.purchaseDate;
                newObj.longTermGainLoss = v.longTermGainLoss.amount;
                newObj.shortTermGainLoss = v.shortTermGainLoss.amount;
                newObj.currencyltgl = v.longTermGainLoss.currency;
                newObj.currencystgl = v.shortTermGainLoss.currency;
                newObj.startSeqNumber = data.capitalGainReportsDTO.startSeqNumber;
                newObj.moreIndicator = data.capitalGainReportsDTO.moreIndicator;
                newObj.recordNumber = v.recordNumber;

                return newObj;
              });

              self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
                idAttribute: "recordNumber"
              })));

              self.searchResults(true);
            });
          }
        };

        self.download = function() {
          $("#passwordDialog").trigger("openModal");

          if (self.investmentAccountData() || self.fromDate() || self.toDate() || self.fundHouseData() || self.schemesData()) {
            CapitalGainReport.fetchPDF(self.investmentAccount().value(), self.fundHouseCode(), self.schemeCode(), self.financialYear(), self.capitalGainLossType());
          }
        };

        self.ok = function() {
          $("#passwordDialog").trigger("closeModal");
        };

      } else {
        Params.baseModel.registerComponent("open-investment-account-landing", "mutual-funds");
        Params.dashboard.loadComponent("open-investment-account-landing", {});
      }
    });
  };
});
