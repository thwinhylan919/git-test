define([
  "knockout",
  "ojL10n!resources/nls/dashboard-quick-links",
  "load!./quick-access.json",
  "load!./payments-quick-links.json",
  "load!./mutual-funds-quick-links.json",
  "load!./lm-quick-links.json",
  "load!./scf-quick-links.json",
  "load!./credit-facility-quick-links.json",
  "load!./term-deposits-quick-links.json"
], function (ko, ResourceBundle, quickLinks, paymentsQuickLinks, mutualFundsQuickLinks, lmQuickLinks,scfQuickLinks, cfQuickLinks,tdQuickLinks) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.resource = ResourceBundle;

    const linksJSONS = {
      "quick-access": quickLinks,
      "payments-quick-links": paymentsQuickLinks,
      "mutual-funds": mutualFundsQuickLinks,
      "liquidity-management": lmQuickLinks,
      "supply-chain-finance" : scfQuickLinks,
      "credit-facility": cfQuickLinks,
      "term-deposits" : tdQuickLinks
    };

    self.type = rootParams.data ? rootParams.data.data.type : rootParams.rootModel.params.type;
    self.subheading = self.resource[self.type];
    self.quicklinksArray = ko.observableArray();

    self.iconClick = function (context) {
      rootParams.baseModel.registerComponent(context.module, context.parentModule);

      if (context.applicationType) {
        rootParams.dashboard.loadComponent("manage-accounts", {
          applicationType: context.applicationType,
          defaultTab: context.module,
          moduleURL: context.moduleURL,
          data: context.data
        });
      } else {
        rootParams.dashboard.loadComponent(context.module);
      }
    };

    self.quicklinksArray(rootParams.baseModel.isDashboardBuilderContext() ? linksJSONS[self.type].data : rootParams.baseModel.filterAuthorisedComponents(linksJSONS[self.type].data, "module"));
  };
});
