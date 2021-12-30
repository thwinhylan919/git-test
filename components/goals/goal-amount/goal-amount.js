define([
    "knockout",
      "ojL10n!resources/nls/goal-category-select",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojinputnumber"
], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.validationTracker = ko.observable();
    self.transferObject = rootParams.rootModel.params.transferDTO;
    self.isCalculationRequired = rootParams.rootModel.params.isCalculationRequired;
    self.content = rootParams.rootModel.params.transferDTO.content;
    self.goal = ResourceBundle.goal;
    rootParams.dashboard.headerName(self.goal.amount_title);

    rootParams.baseModel.registerElement([
      "page-section",
      "amount-input"
    ]);

    self.back = function() {
      history.go(-1);
    };

    self.proceed = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("goalAmountTracker"))) {
        return;
      }

      if (self.isCalculationRequired) {
        rootParams.dashboard.loadComponent("goal-calculator", JSON.parse(ko.toJSON(self.transferObject)));
      } else {
        self.transferObject.dataCalculated = self.isCalculationRequired;

        rootParams.dashboard.loadComponent("create-goal", {
          transferDTO: self.transferObject
        });
      }
    };

    self.cancel = function() {
      history.go(-2);
    };
  };
});