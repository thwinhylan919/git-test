define([
  "knockout",

  "ojL10n!resources/nls/goals"
], function(ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    rootParams.baseModel.registerComponent("goal-category-select", "goals");
    rootParams.baseModel.registerComponent("product-header-text", "widgets/pre-login");

    self.openGoalCalculator = function() {
      rootParams.dashboard.loadComponent("goal-category-select", {
        calculateGoal: true,
        loginRequired: true
      }, self);
    };
  };
});