define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/portfolio-summary-widget",
  "ojs/ojgauge",
  "ojs/ojpopup",
  "ojs/ojarraytreedataprovider",
  "ojs/ojlegend"

], function(oj, ko, Model, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.resource = resourceBundle;
    self.summaryData = ko.observable();
    self.summaryDataLoaded = ko.observable(false);
    self.currentLegendDataSource = ko.observable();
    self.profitLegendDataSource = ko.observable();

    Model.fetchInvestmentSummary().done(function(data) {

      self.summaryData(data.investmentSummaryDTO);

      if (self.summaryData().profLossChange.amount > 0) {
        self.legendSectionsProfitLoss = ko.observableArray([{
          items: [{
            text: self.summaryData().profLossChange.amount,
            color: "#328c4c",
            markerShape: "triangleUp"
          }]
        }]);

        self.profitLegendDataSource(new oj.ArrayTreeDataProvider(self.legendSectionsProfitLoss(), {childrenAttribute: "items"}));

        self.textStyleProfitLoss = ko.observable({
          fontSize: "0.8rem",
          color: "#328c4c"
        });
      }

      if (self.summaryData().profLossChange.amount < 0) {
        self.legendSectionsProfitLoss = ko.observableArray([{
          items: [{
            text: self.summaryData().profLossChange.amount,
            color: "#ED6647",
            markerShape: "triangleDown"
          }]
        }]);

        self.profitLegendDataSource(new oj.ArrayTreeDataProvider(self.legendSectionsProfitLoss(), {childrenAttribute: "items"}));

        self.textStyleProfitLoss = ko.observable({
          fontSize: "0.8rem",
          color: "#ED6647"
        });
      }

      if (self.summaryData().currentValueChange.amount > 0) {
        self.legendSectionsCurrentValue = ko.observableArray([{
          items: [{
            text: self.summaryData().currentValueChange.amount,
            color: "#328c4c",
            markerShape: "triangleUp"
          }]
        }]);

        self.currentLegendDataSource(new oj.ArrayTreeDataProvider(self.legendSectionsCurrentValue(), {childrenAttribute: "items"}));

        self.textStyleCurrentValue = ko.observable({
          fontSize: "0.8rem",
          color: "#328c4c"
        });

      }

      if (self.summaryData().currentValueChange.amount < 0) {
        self.legendSectionsCurrentValue = ko.observableArray([{
          items: [{
            text: self.summaryData().currentValueChange.amount,
            color: "#ED6647",
            markerShape: "triangleDown"
          }]
        }]);

        self.currentLegendDataSource(new oj.ArrayTreeDataProvider(self.legendSectionsCurrentValue(), {childrenAttribute: "items"}));

        self.textStyleCurrentValue = ko.observable({
          fontSize: "0.8rem",
          color: "#ED6647"
        });
      }

      if (self.summaryData().irrChange > 0) {
        self.legendSectionsIRR = ko.observableArray([{
          items: [{
            text: self.summaryData().irrChange + "%*",
            color: "#328c4c",
            markerShape: "triangleUp"
          }]
        }]);

        self.textStyleIRR = ko.observable({
          fontSize: "0.8rem",
          color: "#328c4c"
        });
      }

      if (self.summaryData().irrChange < 0) {
        self.legendSectionsIRR = ko.observableArray([{
          items: [{
            text: self.summaryData().irrChange + "%*",
            color: "#ED6647",
            markerShape: "triangleDown"
          }]
        }]);

        self.textStyleIRR = ko.observable({
          fontSize: "0.8rem",
          color: "#ED6647"
        });
      }

      self.summaryDataLoaded(true);
    });

    self.openPopup = function(open) {
      const popup = document.querySelector("#show-more-info");

      if (open) {
        const listener = popup.open("#estimated-date-info");

        popup.addEventListener("ojOpen", listener);
      } else {
        popup.close();
      }
    };

    self.investmentDetails = function() {
      params.baseModel.registerComponent("investment-details-dashboard", "mutual-funds");
      params.dashboard.loadComponent("investment-details-dashboard");
    };

    self.capitalGainReport = function() {
      params.baseModel.registerComponent("capital-gain-reports", "mutual-funds");
      params.dashboard.loadComponent("capital-gain-reports");
    };

    self.dividendHistoryReport = function() {
      params.baseModel.registerComponent("dividend-reports", "mutual-funds");
      params.dashboard.loadComponent("dividend-reports");
    };

    self.openInvestmentAccount = function() {
      params.baseModel.registerComponent("open-investment-account-landing", "mutual-funds");
      params.dashboard.loadComponent("open-investment-account-landing");
    };
  };
});
