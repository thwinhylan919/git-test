define([

  "knockout",

  "ojL10n!resources/nls/investment-account-relatives",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojradioset",
  "ojs/ojgauge"
], function(ko, resourceBundle, RelativesModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;

    self.relationship = ko.observable([]);
    self.relationshipListLoaded = ko.observable(false);
    self.showRelatives = ko.observable(true);

    if (self.openInvestmentAccountData().additionalDetails.relatives[0]) {
      self.dummyModal.additionalDetails.relatives = self.openInvestmentAccountData().additionalDetails.relatives;
    } else {
      self.dummyModal.additionalDetails.relatives = [];

      self.dummyModal.additionalDetails.relatives.push({
        name: null,
        age: null,
        dependent: "Yes",
        relationship: null,
        relativeRequired: ko.observable(false),
        temp_invRelationship: null
      });
    }

    RelativesModel.fetchRelationshipTypes().done(function(data) {
      self.relationship(data.enumRepresentations[0].data);
      self.relationshipListLoaded(true);
    });

    self.addRelative = function() {
      self.showRelatives(false);
      ko.tasks.runEarly();

      let pushObj = {};

      pushObj = {
        name: null,
        age: null,
        dependent: "Yes",
        relationship: null,
        relativeRequired: ko.observable(false),
        temp_invRelationship: null
      };

      self.dummyModal.additionalDetails.relatives.push(pushObj);
      self.showRelatives(true);
    };

    self.deleteRelative = function(index) {
      self.showRelatives(false);
      ko.tasks.runEarly();
      self.dummyModal.additionalDetails.relatives.splice(index, 1);
      self.showRelatives(true);
    };

    self.relativesSelectedHandler = function(index, event) {
      if (event.detail.value) {
        self.dummyModal.additionalDetails.relatives[index].relativeRequired(true);

        self.relationship().forEach(function(relationship) {
          if (relationship.code === event.detail.value) {
            self.dummyModal.additionalDetails.relatives[index].temp_invRelationship = relationship.description;
          }
        });
      }
    };

    self.onClickSave = function() {
      const tracker = document.getElementById("tracker");

      if (tracker && tracker.valid === "valid") {
        self.globalLoaded(false);
        ko.tasks.runEarly();

        self.dummyModal.additionalDetails.relatives.forEach(function(relative) {
          if (relative.relationship) {
            self.openInvestmentAccountData().additionalDetails.relatives.push(relative);
          }
        });

        params.dashboard.loadComponent("investment-account-review", {
          openInvestmentAccountData: self.openInvestmentAccountData(),
          showAdditionalDetailsSection: self.showAdditionalDetailsSection(),
          stepArray: self.stepArray()
        });

        self.globalLoaded(true);
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
