define([
    "knockout"
], function(ko) {
  "use strict";

  return function viewModel(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerComponent("locator", "atm-branch-locator");
    rootParams.baseModel.registerComponent("map", "inputs");
  };
});