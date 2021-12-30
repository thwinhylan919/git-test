define([
    "knockout",
    "load!./subscription-dashboard.json"
], function(ko,jsonData) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.modules = ko.observableArray();
    rootParams.baseModel.registerElement("action-card");

    self.moduleInfoHandler = function(data) {
      ko.utils.arrayPushAll(self.modules, data.modules);
    };

    self.moduleInfoHandler(jsonData);
  };
});