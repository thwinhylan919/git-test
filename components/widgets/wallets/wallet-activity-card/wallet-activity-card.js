define([
], function() {
  "use strict";

  return function viewModel(rootParams) {
    rootParams.baseModel.registerElement("object-card");
    rootParams.baseModel.registerComponent("wallet-activity", "wallet");
  };
});
