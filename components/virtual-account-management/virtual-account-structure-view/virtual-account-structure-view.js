define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-account-dashboard"
], function (ko, VirtualStructureModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.resource = resourceBundle;
    params.baseModel.registerComponent("tree-view", "liquidity-management");
    self.structureCode = ko.observable(params.rootModel.structureDetails);
    self.structureDetails = ko.observable();
    self.structureDetailsLoaded = ko.observable(false);
    self.mode = ko.observable("tree");

    self.createArrayForChildren = function (element) {
      if (element.children && !Array.isArray(element.children)) {
        element.children = [element.children];
      }

      if (element.children !== undefined && element.children.length > 0) {
        for (let i = 0; i < element.children.length; i++) {
          element.children[i] = self.createArrayForChildren(element.children[i]);
        }
      }

      return element;
    };

    VirtualStructureModel.viewStructure(self.structureCode()).then(function (data) {
      if (data && data.virtualAccountStructure && data.virtualAccountStructure.structureDetails.accountMapDetails) {
        if (data.virtualAccountStructure.structureDetails.accountMapDetails !== undefined) {
          self.structureDetails(data.virtualAccountStructure.structureDetails.accountMapDetails);
        }
        else {
          data.virtualAccountStructure.structureDetails.accountMapDetails.children = [];
          self.structureDetails(data.virtualAccountStructure.structureDetails.accountMapDetails);
        }

        self.structureDetails(self.createArrayForChildren(self.structureDetails()));
        self.structureDetailsLoaded(true);
      }
    });
  };
});
