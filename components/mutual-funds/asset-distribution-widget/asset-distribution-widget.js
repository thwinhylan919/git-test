define([
  "knockout",
  "ojL10n!resources/nls/investment-details-dashboard",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojchart",
  "ojs/ojlegend"
], function (ko, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.innerRadius = ko.observable(0.5);
    self.schemeCategories = self.accountSummary().investmentSummaryDTO.schemeCategories;
    self.distributionLoaded = ko.observable(false);

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
    let i, j;

    self.pieSeriesValue = ko.observableArray();
    self.pieGroupsValue = ko.observableArray(pieGroups);

    for (i = 0; i < self.schemeCategories.length; i++) {
      if (self.schemeCategories[i].subCategories) {
        for (j = 0; j < self.schemeCategories[i].subCategories.length; j++) {
          self.pieSeriesValue().push({
            name: self.schemeCategories[i].subCategories[j].subCategoryDesc,
            items: [self.schemeCategories[i].subCategories[j].percentAllocation]
          });
        }
      } else {
        self.pieSeriesValue().push({
          name: self.schemeCategories[i].fundCategoryDesc,
          items: [self.schemeCategories[i].percentAllocation]
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
  };
});