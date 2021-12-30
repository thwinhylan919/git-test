define([
  "ojs/ojcore",
  "knockout",
  "ojL10n!resources/nls/investment-details-dashboard",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojgauge",
  "ojs/ojselectcombobox",
  "ojs/ojarraytreedataprovider",
  "ojs/ojlegend"
], function(oj, ko, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.accountNumber = ko.observableArray();
    self.accountsLoaded = ko.observable(false);
    self.profitLegendDataSource = ko.observable();
    self.accountsOverview = ko.observable(self.accountSummary().investmentSummaryDTO);

    if (self.accountsOverview().profLossChange.amount > 0) {
      self.legendSectionsProfitLoss = ko.observableArray([{
        items: [{
          text: self.accountsOverview().profLossChange.amount,
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

    if (self.accountsOverview().profLossChange.amount < 0) {
      self.legendSectionsProfitLoss = ko.observableArray([{
        items: [{
          text: self.accountsOverview().profLossChange.amount,
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

    if (self.accountsOverview().irrChange > 0) {
      self.legendSectionsIRR = ko.observableArray([{
        items: [{
          text: self.accountsOverview().irrChange + "% *",
          color: "#328c4c",
          markerShape: "triangleUp"
        }]
      }]);

      self.textStyleIRR = ko.observable({
        fontSize: "0.8rem",
        color: "#328c4c"
      });
    }

    if (self.accountsOverview().irrChange < 0) {
      self.legendSectionsIRR = ko.observableArray([{
        items: [{
          text: self.accountsOverview().irrChange + "% *",
          color: "#ED6647",
          markerShape: "triangleDown"
        }]
      }]);

      self.textStyleIRR = ko.observable({
        fontSize: "0.8rem",
        color: "#ED6647"
      });
    }

    self.capitalGainReport = function() {
      params.baseModel.registerComponent("capital-gain-reports", "mutual-funds");

      params.dashboard.loadComponent("capital-gain-reports", {
        viewReport: true,
        investmentAccount: self.investmentAccount()
      });
    };

    self.dividendHistoryReport = function() {
      params.baseModel.registerComponent("dividend-reports", "mutual-funds");

      params.dashboard.loadComponent("dividend-reports", {
        viewReport: true,
        investmentAccount: self.investmentAccount()
      });
    };
  };
});
