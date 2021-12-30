define([
  "ojs/ojcore",

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/mutual-funds",
  "ojs/ojbutton",
  "ojs/ojpictochart",
  "ojs/ojchart",
  "ojs/ojselectcombobox",
  "ojs/ojgauge",
  "ojs/ojlegend"
], function(oj, ko, $, MutualFundsModel, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    self.temp = oj.KnockoutTemplateUtils;
    self.resource = resourceBundle;
    self.riskProfile = ko.observable();
    self.loadGauge = ko.observable(false);
    self.loadPie = ko.observable(false);
    self.loadInfo = ko.observable(false);
    self.legendRiskSectionsLoaded = ko.observable(false);
    self.investorDescription = ko.observableArray([]);
    params.baseModel.registerElement("confirm-screen");
    params.dashboard.headerName(self.resource.riskProfileTitle);
    self.riskProfileTypesArray = ko.observableArray([]);
    self.pieSeriesValue = ko.observableArray([]);
    self.pieGroupsValue = ko.observableArray([]);
    self.innerRadius = ko.observable(0.5);
    self.selectedChoicePopUp = ko.observable("choose");
    self.thresholdValues = [];
    self.reviewTitle = ko.observable(self.resource.riskProfileConfirmation);

    self.investmentAccount = ko.observable(params.rootModel.params.resultData.investmentAccount);

    let i, temp, j,
      limit = 0;

    self.riskCategories = ko.observableArray();
    self.values = [];
    self.currentValue = ko.observable(0);
    self.profileLoaded = ko.observable(false);
    self.legendSections = ko.observableArray();

    if (!self.investmentAccount() && self.params.investmentAccount) {
      self.investmentAccount(self.params.investmentAccount);
    }

    params.baseModel.registerComponent("choose-risk-profile", "mutual-funds");

    MutualFundsModel.getRiskProfileTypes().done(function(data) {
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

      for (i = 0; i < self.values.length - 1; i++) {
        if (self.riskProfile() === self.values[i].riskProfile) {
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

    self.loadStaticResponse = function() {
      const data = params.rootModel.params.resultData;

      self.loadPie(false);
      self.pieSeries = [];

      for (let i = 0; i < data.questionnaire.riskProfileAllocations.length; i++) {
        self.pieSeries.push({
          name: data.questionnaire.riskProfileAllocations[i].subCategory,
          items: [data.questionnaire.riskProfileAllocations[i].allocationPercentage]
        });
      }

      self.pieSeriesValue(self.pieSeries);
      self.loadPie(true);
      self.loadGauge(false);

      self.legendSections = [{
        items: []
      }];

      self.legendItems = self.legendSections[0].items;

      for (let categoryIndex = 0; categoryIndex < self.pieSeriesValue().length; categoryIndex++) {
        const category = self.pieSeriesValue()[categoryIndex].name;

        self.legendItems.push({
          text: category
        });
      }

      self.legendSections = ko.observableArray(self.legendSections);
      self.riskProfile(data.questionnaire.riskProfileCategory);
      self.loadGauge(true);
      self.loadInfo(false);
      self.investorDescription([]);

      for (let j = 0; j < data.questionnaire.investorDescription.length; j++) {
        self.investorDescription.push(data.questionnaire.investorDescription[j]);
      }

      self.loadInfo(true);
    };

    self.doAgree = function() {
      MutualFundsModel.confirmRiskProfile(self.investmentAccount().value(), ko.toJSON({
        riskProfileCode: self.riskProfile()
      })).done(function(data, status, jqXhr) {
        self.getMessage = ko.observable(params.baseModel.format(self.resource.reviewText, {
          riskprofile: self.riskProfile()
        }));

        const confirmScreenDetailsArray = [];
        let confirmScreenObj = null;

        confirmScreenObj = {
          header: self.resource.riskProfileSelcted,
          referenceNumber: data.riskProfileDTO.referenceNumber
        };

        confirmScreenDetailsArray.push(confirmScreenObj);

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.reviewTitle(),
          confirmScreenExtensions: {
            isSet: true,
            confirmScreenMsgEval: function() {
              const message = params.baseModel.format(self.resource.reviewText, {
                riskprofile: self.riskProfile()
              });

              return message;
            },
            confirmScreenDetails: confirmScreenDetailsArray,
            template: "confirm-screen/risk-profile",
            resourceBundle: self.resource
          },
          template: "confirm-screen/risk-profile-cards"
        });
      });
    };

    self.openDisagreeModal = function() {
      $("#disagreePopUp").trigger("openModal");
    };

    self.closeDialogBox = function() {
      $("#disagreePopUp").hide();
    };

    self.processChoice = function() {
      if (self.selectedChoicePopUp() && self.selectedChoicePopUp() === "choose") {
        params.dashboard.loadComponent("choose-risk-profile", {
          investmentAccount: self.investmentAccount()
        });
      } else if (self.selectedChoicePopUp() && self.selectedChoicePopUp() === "assessment") {
        params.dashboard.loadComponent("risk-profile-questionnaire", {
          investmentAccount: self.investmentAccount()
        });
      }
    };

    self.loadStaticResponse();
  };
});
