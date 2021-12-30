define([
    "knockout",
  "jquery",
  "ojL10n!resources/nls/list-goal"
], function(ko, $, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.cardData = ko.observable(Params.data);
    Params.baseModel.registerComponent("percentage-graph", "personal-finance-management");

    const barTooltip = document.createElement("div");

    self.goalTooltipCallback = function(dataContext) {
      const achieved = Params.baseModel.formatCurrency(Number(dataContext.label.replace(/[,]/g, "")), self.baseCurrency());

      if (achieved && achieved !== "") {
        require(["text!../partials/pfm/goals/goal-progress-tool-tip.html"], function(barTooltipLocal) {
          const tooltip = {
            title: self.resource.goals.achievedTitle,
            achievedTitle: self.resource.goals.achievedTitle,
            achievedAmount: achieved
          };

          $(barTooltip).html(barTooltipLocal);
          ko.cleanNode(barTooltip);
          ko.applyBindings(tooltip, barTooltip);
        });

        return barTooltip;
      }
    };

    self.openMenu = function(event) {
      const launcherId = event.currentTarget.attributes.id.nodeValue;

      self.launcherId = launcherId;

      setTimeout(function() {
        $("#" + launcherId + "-container").ojMenu("open", event);
      }, 1);
    };
  };
});