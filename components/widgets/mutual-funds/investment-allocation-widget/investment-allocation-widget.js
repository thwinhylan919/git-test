define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/investment-allocation-widget",
  "ojs/ojchart",
  "ojs/ojlegend"
], function (ko, Model, resourceBundle) {
  "use strict";

  return function () {
    const self = this;

    self.nls = resourceBundle;

    self.pieSeriesValue = ko.observableArray();

    const categoriesColorArray = [{
        color: "#FAC85A"
      },
      {
        color: "#F16B40"
      },
      {
        color: "#FF669E"
      },
      {
        color: "#53D3BA"
      },
      {
        color: "#006bad"
      },
      {
        color: "#E76363"
      },
      {
        color: "#3949AB"
      },
      {
        color: "#21a0a0"
      },
      {
        color: "#fdc42b"
      },
      {
        color: "#14BA92"
      },
      {
        color: "#EF7598"
      }
    ];

    self.legendArray = ko.observableArray([{
      items: []
    }]);

    const categoryColorMap = {};

    let categoryName = "";

    const pieGroups = [""];

    self.distributionLoaded = ko.observable(false);
    self.innerRadius = ko.observable(0.5);
    self.pieGroupsValue = ko.observableArray(pieGroups);

    Model.fetchInvestmentSummary().done(function (data) {
      let i = 0,
        j = 0;
      const summaryData = data.investmentSummaryDTO;

      for (i = 0; i < summaryData.schemeCategories.length; i++) {
        if (summaryData.schemeCategories[i].subCategories) {
          for (j = 0; j < summaryData.schemeCategories[i].subCategories.length; j++) {
            self.pieSeriesValue().push({
              name: summaryData.schemeCategories[i].subCategories[j].subCategoryDesc,
              items: [summaryData.schemeCategories[i].subCategories[j].percentAllocation]
            });
          }
        } else {
          self.pieSeriesValue().push({
            name: summaryData.schemeCategories[i].fundCategoryDesc,
            items: [summaryData.schemeCategories[i].percentAllocation]
          });
        }
      }

      for (let k = 0; k < self.pieSeriesValue().length; k++) {
        self.pieSeriesValue()[k].color = categoriesColorArray[k].color;
        categoryName = self.pieSeriesValue()[k].name;
        categoryColorMap[categoryName] = categoriesColorArray[k].color;

        self.legendArray()[0].items.push({
          text: categoryName,
          markerShape: "circle",
          color: categoryColorMap[categoryName]
        });
      }

      self.distributionLoaded(true);
    });
  };
});