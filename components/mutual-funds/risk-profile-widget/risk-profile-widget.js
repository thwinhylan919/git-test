define([
  "ojs/ojcore",
  "knockout",

  "./model",
  "ojL10n!resources/nls/investment-details-dashboard",
  "ojs/ojbutton",
  "ojs/ojgauge",
  "ojs/ojlegend"
], function (oj, ko, RiskProfileWidget, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.temp = oj.KnockoutTemplateUtils;
    self.resource = resourceBundle;

    let i, temp, j,
      limit = 0;

    self.riskCategories = ko.observableArray();
    self.thresholdValues = [];
    self.values = [];
    self.riskProfile = self.investmentDetails().investmentAccountDTO.riskProfile.riskProfileCode;
    self.currentValue = ko.observable(0);
    self.profileLoaded = ko.observable(false);
    self.legendSections = ko.observableArray();

    RiskProfileWidget.getRiskProfileTypes().done(function (data) {
      for (i = 0; i < data.riskProfileCategories.length; i++) {
        self.riskCategories.push({
          text: data.riskProfileCategories[i].riskProfileCategory,
          priority: data.riskProfileCategories[i].priority
        });
      }

      for (i = 0; i < self.riskCategories().length - 1; i++) {
        for (j = i + 1; j < self.riskCategories().length; j++) {
          if (self.riskCategories()[i].priority > self.riskCategories()[j].priority) {
            temp = self.riskCategories()[i];
            self.riskCategories()[i] = self.riskCategories()[j];
            self.riskCategories()[j] = temp;
          }
        }
      }

      for (i = 0; i < self.riskCategories().length; i++) {
        limit = limit + (100 / self.riskCategories().length);

        self.thresholdValues[i] = {
          max: limit,
          color: null
        };

        self.values[i] = {
          riskProfile: self.riskCategories()[i].text,
          value: limit
        };
      }

      self.thresholdValues[0].color = "#e6f2ff";
      self.thresholdValues[1].color = "#b3d9ff";
      self.thresholdValues[2].color = "#1a8cff";
      self.thresholdValues[3].color = "#0073e6";
      self.thresholdValues[4].color = "#0059b3";

      for (i = 0; i < self.values.length; i++) {
        if (self.riskProfile === self.values[i].riskProfile) {
          self.currentValue(self.values[i].value);
        }
      }

      self.legendSections([{
        items: [{
            text: self.values[0].riskProfile,
            color: self.thresholdValues[0].color,
            markerShape: "square"
          },
          {
            text: self.values[1].riskProfile,
            color: self.thresholdValues[1].color,
            markerShape: "square"
          },
          {
            text: self.values[2].riskProfile,
            color: self.thresholdValues[2].color,
            markerShape: "square"
          },
          {
            text: self.values[3].riskProfile,
            color: self.thresholdValues[3].color,
            markerShape: "square"
          },
          {
            text: self.values[4].riskProfile,
            color: self.thresholdValues[4].color,
            markerShape: "square"
          }
        ]
      }]);

      self.profileLoaded(true);
    });
  };
});