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
  "ojs/ojvalidation-datetime",
  "ojs/ojswitch"
], function(oj, ko, $, ResourceBundle, DetailedTxnReport) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.transactionHeader);
    Params.baseModel.registerElement("date-box");
    self.refreshData = ko.observable(true);
    self.dataSource = ko.observable();
    self.fromDate = ko.observable();
    self.toDate = ko.observable();
    self.minFromDate = ko.observable();
    self.currentDate = ko.observable();
    self.maxFromDate = ko.observable();
    self.minToDate = ko.observable();
    self.maxToDate = ko.observable();
    self.transactionTypeCode = ko.observable();
    self.schemeCode = ko.observable();
    self.investmentAccount = ko.observable();
    self.investmentAccountData = ko.observableArray();
    self.fundHouseData = ko.observableArray();
    self.fundHouseDTOData = ko.observableArray();
    self.fundHouseCode = ko.observable();
    self.accountNumber = ko.observableArray();
    self.schemesData = ko.observableArray();
    self.transactionTypesData = ko.observableArray();
    self.investmentAccountsLoaded = ko.observable(false);
    self.fundHouseDetailsLoaded = ko.observable(false);
    self.schemesDataLoaded = ko.observable(true);
    self.transactionTypesLoaded = ko.observable(false);
    self.searchResults = ko.observable(false);
    self.refresh = ko.observable(true);
    self.showDownload = ko.observable(true);
    self.fundHouseDTODetailsLoaded = ko.observable(false);

    let i,

      sortAscending = true;

    /**
     *
     * @param {Object} a - First object.
     * @param {Object} b - Second object.
     * @returns {void}
     */
    function sortTxnByDate(a, b) {
      if (a.date < b.date) {
        return sortAscending ? -1 : 1;
      } else if (a.date > b.date) {
        return sortAscending ? 1 : -1;
      }

      return 0;
    }

    self.investmentAccountYes = ko.observable(false);

    DetailedTxnReport.fetchInvestmentAccounts().done(function(data) {
      if (data.investmentAccounts.length) {
        self.investmentAccountYes(true);

        self.headerText = ko.observableArray([{
            headerText: self.resource.datePlaceHolder,
            field: "txnDate",
            sortProperty: "date"
          },
          {
            headerText: self.resource.schemeName,
            field: "name"
          },
          {
            headerText: self.resource.transactionType,
            field: "txnAction"
          },
          {
            headerText: self.resource.units,
            field: "txnUnits"
          },
          {
            headerText: self.resource.unitPrice,
            field: "schemeNav",
            headerClassName: "right"
          },
          {
            headerText: self.resource.transactionAmount,
            field: "txnAmount",
            headerClassName: "right"
          }
        ]);

        const currentDate = Params.baseModel.getDate();

        self.currentDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));
        self.fromDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));
        self.toDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));
        self.maxToDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));

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

          DetailedTxnReport.fetchFundHouse(self.investmentAccount().value()).done(function(data) {
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

            DetailedTxnReport.fetchAllFundHouse().done(function(data) {
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
            });

          });

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

        self.fundHouseChange = function(event) {
          self.schemesData().splice(0, self.schemesData().length);

          DetailedTxnReport.fetchSchemeName(self.investmentAccount().value(), event.detail.value).done(function(data) {
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

        DetailedTxnReport.fetchMFTransactionTypes().done(function(data) {
          for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.transactionTypesData().push({
              label: data.enumRepresentations[0].data[i].description,
              code: data.enumRepresentations[0].data[i].code
            });
          }

          ko.tasks.runEarly();
          self.transactionTypesLoaded(true);
        });

        self.clearResults = function() {
          self.refresh(false);
          self.fundHouseCode("");
          self.schemeCode("");
          self.transactionTypeCode("");
          self.fromDate(self.currentDate());
          self.toDate(self.currentDate());
          self.dataSource();
          self.searchResults(false);
          ko.tasks.runEarly();
          self.refresh(true);
        };

        let tempData = null;

        self.sortcallback = function(event, ui) {
          sortAscending = ui.direction === "ascending";

          if (ui.header === "date") {
            tempData.sort(sortTxnByDate);

            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
              idAttribute: "recordNumber"
            })));
          }
        };

        self.searchReports = function() {
          if (self.investmentAccountData() || self.fromDate() || self.toDate() || self.transactionTypesData() || self.fundHouseData() || self.schemesData()) {
            DetailedTxnReport.fetchTxnReports(self.investmentAccount().value(), self.fundHouseCode(), self.schemeCode(), self.transactionTypeCode(), self.fromDate(), self.toDate()).done(function(data) {
              tempData = null;

              tempData = $.map(data.transactionReportsDTO.transactions, function(v) {
                const newObj = {};

                newObj.date = v.txnDate;
                newObj.schemeName = v.schemeName;
                newObj.fundHouse = v.fundHouseCode;
                newObj.txnType = v.txnAction;
                newObj.txnUnits = v.txnUnits;
                newObj.schemeNav = v.schemeNav.amount;
                newObj.currency = v.txnAmount.currency;
                newObj.txnAmount = v.txnAmount.amount;
                newObj.startSeqNumber = data.transactionReportsDTO.transactionReportId;
                newObj.moreIndicator = data.transactionReportsDTO.moreIndicator;
                newObj.recordNumber = v.recordNumber;

                return newObj;
              });

              sortAscending = false;
              tempData.sort(sortTxnByDate);

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
            DetailedTxnReport.fetchPDF(self.investmentAccount().value(), self.fundHouseCode(), self.schemeCode(), self.transactionTypeCode(), self.fromDate(), self.toDate());
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
