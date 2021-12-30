define([
  "knockout",
  "jquery"
], function(ko, $) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.cardData = ko.observable(Params.data);
    Params.baseModel.registerComponent("percentage-graph", "personal-finance-management");

    const barTooltip = document.createElement("div");

    self.budgetTooltipCallback = function(dataContext) {
      const consumed = {amount : Number(dataContext.label.replace(/[,]/g, "")),
currency : self.baseCurrency};

      if (consumed && consumed.amount !== "") {
        require(["text!../partials/pfm/budget/budget-progress-tool-tip.html"], function(barTooltipLocal) {
          const tooltip = {
            title: self.resource.budget.consumedtitletooltip,
            consumedTitle: self.resource.budget.consumedtitletooltip,
            consumedAmount: consumed
          };

          $(barTooltip).html(barTooltipLocal);
          ko.cleanNode(barTooltip);
          ko.applyBindings(tooltip, barTooltip);
        });

        return barTooltip;
      }
    };

    self.openMenu = function(launcherId) {
      document.getElementById(launcherId + "-container").open();
    };
  };
});