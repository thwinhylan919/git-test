define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/investment-details-dashboard",
  "ojs/ojbutton",
  "ojs/ojchart",
  "ojs/ojlegend"
], function (ko, RecommendedAllocation, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.riskProfile = ko.observable(self.investmentDetails().investmentAccountDTO.riskProfile.riskProfileCode);
    self.orientationValue = ko.observable("horizontal");
    self.labelPosition = ko.observable("auto");
    self.stackValue = ko.observable("on");
    self.stackLabelValue = ko.observable("off");
    self.barSeriesValue = ko.observableArray();
    self.legendView = ko.observable(false);

    let i, j;

    self.viewAllocation = ko.observable(false);

    const categoriesColorArray = [{
        color: "#006bad"
      },
      {
        color: "#53D3BA"
      },
      {
        color: "#FF669E"
      },
      {
        color: "#F16B40"
      },
      {
        color: "#FAC85A"
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

    RecommendedAllocation.getRiskProfileTypes().done(function (data) {
      for (i = 0; i < data.riskProfileCategories.length; i++) {
        if (data.riskProfileCategories[i].riskProfileCategory === self.riskProfile()) {
          for (j = 0; j < data.riskProfileCategories[i].riskProfileAllocations.length; j++) {
            self.barSeriesValue.push({
              name: data.riskProfileCategories[i].riskProfileAllocations[j].subCategory,
              items: [{
                y: data.riskProfileCategories[i].riskProfileAllocations[j].allocationPercentage
              }]
            });
          }
        }
      }

      for (let k = 0; k < self.barSeriesValue().length; k++) {
        self.barSeriesValue()[k].color = categoriesColorArray[k].color;
        categoryName = self.barSeriesValue()[k].name;
        categoryColorMap[categoryName] = categoriesColorArray[k].color;

        self.legendArray()[0].items.push({
          text: categoryName,
          markerShape: "circle",
          color: categoryColorMap[categoryName]
        });
      }

      self.legendView(true);
    });

    const barGroups = [""];

    self.barGroupsValue = ko.observableArray(barGroups);

    self.getTooltip = function (data) {
      const tooltip = data.series + "-" + data.data.y + self.resource.recommendedAllocation.percent;

      return {
        insert: tooltip
      };
    };

    self.viewAllocation(true);
  };
});