define([
  "ojs/ojcore",
  "jquery",
  "knockout",
  "./model",
  "ojL10n!resources/nls/top-bottom-funds-widget",
  "ojs/ojgauge",
  "ojs/ojarraytabledatasource",
  "ojs/ojarraydataprovider"

], function(oj, $, ko, Model, resourceBundle) {
  "use strict";

  return function() {
    const self = this;

    self.resource = resourceBundle;
    self.fundData = ko.observableArray();
    self.summaryDataLoaded = ko.observable(false);
    self.asOnDate = ko.observable();
    self.dataSource = ko.observable();

    let i = 0;

    self.headerText = ko.observableArray([{
        headerText: self.resource.TopFunds.fundName,
        field: "fundName"
      },
      {
        headerText: self.resource.TopFunds.price,
        field: "price",
        headerClassName: "right"
      },
      {
        headerText: self.resource.TopFunds.change,
        field: "change"

      }
    ]);

    self.tableFill = function(data) {
      let tempData = null,
        id = 1;

      tempData = $.map(data, function(v) {
        const newObj = {};

        newObj.fundName = v.scheme.schemeName;
        newObj.price = v.scheme.nav.amount;
        newObj.currency = v.scheme.nav.currency;
        newObj.change = v.investmentSummary.irrChange;
        newObj.id = id;
        id = id + 1;

        return newObj;
      });

      self.dataSource(new oj.ArrayDataProvider(tempData, {
        keyAttributes: "id"
      }));

      self.summaryDataLoaded(true);

    };

    Model.fetchTopFunds(true).done(function(data) {
      for (i = 0; i < 2; i++) {
        self.fundData().push(data.accountHoldings[i]);
      }

      self.asOnDate(data.accountHoldings[0].investmentSummary.asOnDate);

      Model.fetchTopFunds(false).done(function(data) {
        for (i = 0; i < 2; i++) {
          self.fundData().push(data.accountHoldings[i]);
        }

        self.tableFill(self.fundData());

      });

    });

  };
});
