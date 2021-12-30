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
  "ojs/ojlistview",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojtable",
  "ojs/ojcheckboxset"
], function(oj, ko, $, resourceBundle, RecurringSummaryModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);

    let data;

    self.resource = resourceBundle;
    self.holdingsData = ko.observableArray();
    self.dataSource = ko.observable();
    self.recurringSummaryData = ko.observable();
    self.mobileDataSource = ko.observable();
    self.maxRating = ko.observable(5);
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

    self.holdingsMobileView = ko.observableArray();
    self.redeemCheckBox = ko.observableArray();
    self.mobileViewTable = ko.observable(false);
    self.redeemedRefresh = ko.observable(false);
    self.holdingsArray = ko.observableArray();

    RecurringSummaryModel.fetchHoldings(self.investmentAccount().value()).done(function(redeemedData) {
      self.recurringSummaryData(redeemedData);
      self.redeemedRefresh(false);
      data = self.recurringSummaryData();
      self.createTableHoldings();
      ko.tasks.runEarly();
      self.redeemedRefresh(true);
    });

    self.includeRedeemed = function(event) {
      if (event.detail.value[0] === "REDEEMED") {
        RecurringSummaryModel.fetchHoldings(self.investmentAccount().value(), true).done(function(redeemedData) {
          self.recurringSummaryData(redeemedData);
          self.redeemedRefresh(false);
          data = self.recurringSummaryData();
          self.createTableHoldings();
          ko.tasks.runEarly();
          self.redeemedRefresh(true);
        });
      } else {
        RecurringSummaryModel.fetchHoldings(self.investmentAccount().value()).done(function(redeemedData) {
          self.recurringSummaryData(redeemedData);
          self.redeemedRefresh(false);
          data = self.recurringSummaryData();
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
        newObj.startDate = v.startDate;
        newObj.endDate = v.endDate;
        newObj.amount = v.txnAmount.amount;
        newObj.currency = v.txnAmount.currency;
        newObj.frequency = v.frequency;
        newObj.installmentsRemaining = v.installments;
        newObj.marketValue = v.investmentSummary.marketValue.amount;
        newObj.xirr = v.cagrXIRR;
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
          newObj.startDate = v.startDate;
          newObj.endDate = v.endDate;
          newObj.amount = v.txnAmount.amount;
          newObj.currency = v.txnAmount.currency;
          newObj.frequency = v.frequency;
          newObj.installmentsRemaining = v.installments;
          newObj.marketValue = v.investmentSummary.marketValue.amount;
          newObj.xirr = v.cagrXIRR;
          newObj.instructionTypeCode = v.instructionTypeCode;
          newObj.rating = parseInt(v.scheme.fundRating);
        } else {
          newObj.id = id;
          newObj.schemeName = v.heading;
          newObj.schemeCode = v.headingText;
          newObj.startDate = "";
          newObj.endDate = "";
          newObj.amount = "";
          newObj.frequency = "";
          newObj.installmentsRemaining = "";
          newObj.marketValue = "";
          newObj.xirr = "";
          newObj.instructionTypeCode = "";
          newObj.rating = "";
        }

        id = id + 1;

        return newObj;
      });

      self.dataSource(new oj.ArrayDataProvider(tempData, {
        keyAttributes: "id"
      }));

      ko.tasks.runEarly();
      self.redeemedRefresh(true);
    };

    self.headerText = ko.observableArray([{
        headerText: self.resource.holdingsSummary.scheme,
        field: "schemeName"
      },
      {
        headerText: self.resource.holdingsSummary.amount,
        field: "amount",
        headerClassName: "right"
      },
      {
        headerText: self.resource.holdingsSummary.startDate,
        field: "startDate"
      },
      {
        headerText: self.resource.holdingsSummary.endDate,
        field: "endDate"
      },
      {
        headerText: self.resource.holdingsSummary.frequency,
        field: "frequency"
      },
      {
        headerText: self.resource.holdingsSummary.installmentsRemaining,
        field: "installments"
      },
      {
        headerText: self.resource.holdingsSummary.marketValue,
        field: "marketValue"
      },
      {
        headerText: self.resource.holdingsSummary.xirr,
        field: "xirr",
        headerClassName: "right"
      }
    ]);

    self.createTableHoldings = function() {
      self.holdingsData().splice(0, self.holdingsData().length);

      const o = [];
      let j = 0;

      for (i = 0; i < data.accountHoldings.length; i++) {
        o[data.accountHoldings[i].instructionTypeCode] = data.accountHoldings[i].instructionTypeCode;
      }

      let typeChange = true;

      Object.keys(o).forEach(function(key) {
        typeChange = true;

        for (j = 0; j < data.accountHoldings.length; j++) {
          if (data.accountHoldings[j].instructionTypeCode === key) {
            if (typeChange === true) {
              self.holdingsData.push({
                heading: data.accountHoldings[j].instructionTypeCode,
                headingText: "HEADINGTEXT"
              });

              self.holdingsCategory().push({
                code: data.accountHoldings[j].instructionTypeCode,
                value: data.accountHoldings[j].instructionTypeCode
              });

              typeChange = false;
            }

            self.holdingsData.push(data.accountHoldings[j]);
          }
        }
      });

      self.categorySelect = function(event) {
        self.holdingsMobileView().splice(0, self.holdingsMobileView().length);

        if (event.detail.value === "ALL") {
          for (i = 0; i < data.accountHoldings.length; i++) {
            self.holdingsMobileView.push(data.accountHoldings[i]);
          }
        } else {
          for (i = 0; i < data.accountHoldings.length; i++) {
            if (event.detail.value === data.accountHoldings[i].instructionTypeCode) {
              self.holdingsMobileView.push(data.accountHoldings[i]);
            }
          }
        }

        self.mobileViewTable(false);
        self.listViewFill(self.holdingsMobileView());
      };

      self.tableFill(self.holdingsData());
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

        for (i = 0; i < self.recurringSummaryData().accountHoldings.length; i++) {
          if (self.recurringSummaryData().accountHoldings[i].scheme.schemeCode === self.schemeToSearch()) {
            filteredData.push(self.recurringSummaryData().accountHoldings[i]);
          }
        }

        self.tableFill(filteredData);
      }
    };
  };
});
