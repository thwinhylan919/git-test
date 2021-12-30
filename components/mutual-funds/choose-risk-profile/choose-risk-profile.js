define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/mutual-funds",
  "ojs/ojbutton",
  "ojs/ojpictochart",
  "ojs/ojchart",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup"
], function (ko, MutualFundsModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.resource = resourceBundle;
    self.riskProfile = ko.observable();
    self.loadPie = ko.observable(false);
    self.investorDescription = ko.observableArray([]);
    params.baseModel.registerElement("confirm-screen");
    params.dashboard.headerName(self.resource.editRiskProfile);
    self.pieSeriesValue = ko.observableArray([]);
    self.pieGroupsValue = ko.observableArray([]);
    self.innerRadius = ko.observable(0.5);
    self.riskProfileCount = ko.observable("5");
    self.investmentAccount = ko.observable(params.rootModel.params.investmentAccount);
    self.showSection = ko.observable(false);
    self.riskProfiles = ko.observableArray();
    self.selectedRiskProfile = ko.observable();
    self.riskProfilesLoaded = ko.observable(false);

    MutualFundsModel.getRiskProfileTypes().done(function (data) {
      self.riskProfiles(data.riskProfileCategories);
      self.riskProfilesLoaded(true);
    });

    self.riskValue = ko.observable(50);

    self.loadDetailedView = function (data) {
      self.loadPie(false);
      self.pieSeries = [];

      for (let i = 0; i < data.riskProfileAllocations.length; i++) {
        self.pieSeries.push({
          name: data.riskProfileAllocations[i].subCategory,
          items: [data.riskProfileAllocations[i].allocationPercentage]
        });
      }

      self.pieSeriesValue(self.pieSeries);
      self.loadPie(true);
      self.investorDescription([]);

      for (let j = 0; j < data.investorDescription.length; j++) {
        self.investorDescription.push(data.investorDescription[j]);
      }

      self.showSection(true);
    };

    self.riskProfileValueChangedHandler = function () {
      if (event.detail.value) {
        self.showSection(false);

        let profileData = null;

        self.riskProfiles().forEach(function (profile) {
          if (profile.riskProfileCategory === event.detail.value) {
            profileData = profile;
          }
        });

        self.loadDetailedView(profileData);
      }
    };

    self.save = function () {
      const tracker = document.getElementById("fbtracker");

      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        return;
      }

      MutualFundsModel.confirmRiskProfile(self.investmentAccount().value(), ko.toJSON({
        riskProfileCode: self.selectedRiskProfile()
      })).done(function (data, status, jqXhr) {

        self.riskProfile(data.riskProfileDTO.riskProfileCode);

        const confirmScreenDetailsArray = [];
        let confirmScreenObj = null;

        confirmScreenObj = {
          header: self.resource.riskProfileSelcted,
          referenceNumber: data.riskProfileDTO.referenceNumber
        };

        confirmScreenDetailsArray.push(confirmScreenObj);

        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.resource.riskProfileSelcted,
          referenceNumber: data.riskProfileDTO.referenceNumber,
          confirmScreenExtensions: {
            confirmScreenMsgEval: function () {
              const message = params.baseModel.format(self.resource.reviewText, {
                riskprofile: self.riskProfile()
              });

              return message;
            },
            isSet: true,
            confirmScreenDetails: confirmScreenDetailsArray,
            template: "confirm-screen/risk-profile",
            resourceBundle: self.resource
          },
          template: "confirm-screen/risk-profile-cards"
        });

      });
    };

    self.back = function () {
      params.dashboard.loadComponent("risk-profile-review", {
        investmentAccount: self.investmentAccount()
      }, self);
    };
  };
});