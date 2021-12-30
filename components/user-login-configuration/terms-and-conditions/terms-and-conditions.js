define([
  "ojs/ojcore",
  "knockout",
  "ojL10n!resources/nls/user-login-configuration",
  "ojs/ojknockout",
  "ojs/ojcheckboxset",
  "ojs/ojbutton"
], function (oj,ko, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    params.baseModel.registerComponent("user-login-configuration-header", "user-login-configuration");
    ko.utils.extend(self, params.rootModel.params);
    self.nls = resourceBundle;
    self.transactionName = ko.observable("help/terms-and-conditions");

    const langPrefix = oj.Config.getLocale() === "en" ? "" : oj.Config.getLocale() + "/";

    if(langPrefix !== ""){
      self.transactionName("help/"+langPrefix+"terms-and-conditions");
    }
  };
});