define([
    "knockout",
    "ojL10n!resources/nls/wallet-created",
  "ojs/ojknockout",
  "ojs/ojbutton",
  "ojs/ojinputtext"
], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;

    self.save = function() {
      window.location.assign("../pages/wallet.html");
    };
  };
});