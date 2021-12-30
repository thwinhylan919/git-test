define([
  "knockout",
  "ojL10n!resources/nls/security-question-option"
], function (ko, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.params);
    self.nls = resourceBundle;
    self.showPoint1 = ko.observable();
    params.baseModel.registerElement("page-section");
    params.baseModel.registerComponent("create-user-security-question", "user-security-question");

    self.loadSecurtiyComponent = function () {
      params.dashboard.loadComponent("create-user-security-question", {
        loadNextComponent: self.loadNextComponent
      });
    };
  };
});