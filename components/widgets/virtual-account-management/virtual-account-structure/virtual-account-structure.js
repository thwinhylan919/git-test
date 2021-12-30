define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-account-dashboard",
  "load!./virtual-account-structure.json",
  "ojs/ojinputtext",
  "ojs/ojbutton"
], function (ko, VirtualAccountStructureModel, resourceBundle, AuthorizedComponents) {
  "use strict";

  return function (params) {
    const self = this,
      newArr = [];

    self.resource = resourceBundle;
    params.baseModel.registerComponent("tree-view", "liquidity-management");
    params.baseModel.registerComponent("virtual-account-structure-view", "virtual-account-management");
    self.virtualStructureData = ko.observable([]);
    self.virtualStructureDataLoaded = ko.observable(false);
    self.selectedVirtualStructure = ko.observable();
    self.structureDetails = ko.observable();
    self.structureDetailsLoaded = ko.observable();
    self.structureCode = ko.observable();
    self.structureName = ko.observable();
    self.realAccountNo = ko.observable();
    self.mode = ko.observable();
    self.limit = "0";
    self.offset = "0";
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.id = ko.observable();
    self.authorizedLinks = ko.observableArray();

    const authorizedComponents = params.baseModel.filterAuthorisedComponents(AuthorizedComponents["virtual-account-management"], "name"),

     query = {
      criteria: [{
        operand: "status",
        operator: "EQUALS",
        value: ["O"]
      }]
    };

    authorizedComponents.forEach(function(item){
      if(item.name === "virtual-account-structure-create") {
        params.baseModel.registerComponent(item.name, item.module);

        self.authorizedLinks.push({
          id: "createStructure",
          label: self.resource.createStructure,
          name: item.name,
          module: item.module,
          cssClass: authorizedComponents.length === 2 ? "oj-sm-6" : "oj-sm-12"
        });
      } else if (item.name === "virtual-structure-search"){
        params.baseModel.registerTransaction(item.name, item.module);

        self.authorizedLinks.push({
          id: "viewAll",
          label: self.resource.viewAll,
          name: item.name,
          module: item.module,
          cssClass: authorizedComponents.length === 2 ? "oj-sm-6" : "oj-sm-12"
        });
      }
    });

    VirtualAccountStructureModel.fetchVirtualStructureList(JSON.stringify(query), 0).then(function (data) {
      if (data && data.virtualAccountStructures && data.virtualAccountStructures.length > 0) {
        for (let i = 0; i < data.virtualAccountStructures.length; i++) {
          if (data.virtualAccountStructures) {
            self.virtualStructureData(data.virtualAccountStructures);
            self.virtualStructureDataLoaded(true);
          }

          newArr.push(data.virtualAccountStructures[i]);
        }
      }
    });

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

    self.selectedVirtualStructureChangeHandler = function (event) {
      self.structureDetailsLoaded(false);
      self.selectedVirtualStructure(event.detail.value);

      VirtualAccountStructureModel.viewStructure(self.selectedVirtualStructure()).then(function (data) {
        if (data && data.virtualAccountStructure && data.virtualAccountStructure.structureDetails.accountMapDetails) {

          if (data.virtualAccountStructure.structureDetails.accountMapDetails !== undefined) {
            self.structureDetails(data.virtualAccountStructure.structureDetails.accountMapDetails);
          } else {
            data.virtualAccountStructure.structureDetails.accountMapDetails.children = [];
            self.structureDetails(data.virtualAccountStructure.structureDetails.accountMapDetails);
          }

          self.structureDetails(self.createArrayForChildren(self.structureDetails()));
          self.realAccountNo(data.virtualAccountStructure.structureDetails.realAccountNo);
          self.structureName(data.virtualAccountStructure.structureDetails.name);
          self.structureCode(data.virtualAccountStructure.structureDetails.code);
        }

        self.structureDetailsLoaded(true);
        self.mode("tree");
      });
    };

    self.onClickLink = function(id) {
      params.dashboard.loadComponent(id);
    };

    self.openStructure = function () {
      params.dashboard.openRightPanel("virtual-account-structure-view", {
        structureDetails: self.selectedVirtualStructure()
      }, self.resource.structureView);
    };

  };
});