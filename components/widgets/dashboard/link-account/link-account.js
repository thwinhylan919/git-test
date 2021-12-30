define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/link-account"
], function(ko, LinkAccountModel, resourceBundle) {
  "use strict";

  /**
   * Return function - description.
   *
   * @param  {type} params - Description.
   * @return {type}            Description.
   */
  return function(params) {
    const self = this;

    self.resource = resourceBundle;
    self.enableLink = ko.observable(false);
    params.baseModel.registerComponent("link-account-dashboard", "account-aggregation");
    params.baseModel.registerComponent("account-aggregator", "widgets/dashboard");

    self.linkAccount = function () {
       params.dashboard.switchModule("link-account-dashboard");
    };

    self.openLinkAccountDashboard = function () {
       params.dashboard.loadComponent("account-aggregator", {}, self);
    };

    LinkAccountModel.fetchAccesstoken().then(function(data){
      if(data.accessTokenDTOs && data.accessTokenDTOs.length > 0){
        self.enableLink(false);
      }else{
        self.enableLink(true);
      }
    });

    };
});
