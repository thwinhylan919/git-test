define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/virtual-structure-view-balance",
  "ojs/ojknockout",
  "ojs/ojmenu",
  "ojs/ojoption",
  "ojs/ojaccordion"
], function (ko, VirtualStructureModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.instructionDetails = ko.observable();
    self.resource = ResourceBundle;
    self.viewBalDetails = ko.observable();
    self.viewbalanceLoaded = ko.observable(false);
    rootParams.baseModel.registerElement(["page-section"]);
    self.virtualAccountNo = ko.observable();
    self.virtualAccountCcy = ko.observable();
    self.structureDetails = ko.observable(self.structureDetailsDTO);

    self.balance = ko.observable({});

    self.setBalances = function () {
      self.viewBalDetails().balance.forEach(function (item) {
        if (item.type === "contributionDtoList") {
          self.balance()[item.type] = item;
        } else {
          self.balance()[item.type] = item.amount[0];
        }

        self.viewbalanceLoaded(true);
      });
    };

    self.fetchBalance = function () {
      VirtualStructureModel.viewBalanceDetails(self.virtualAccountNo(), self.virtualAccountCcy()).then(function (data) {
        if (data && data.virtualAccountDTO && data.virtualAccountDTO.balance && data.virtualAccountDTO.balance.length > 0) {
          self.viewBalDetails(data.virtualAccountDTO);
          self.setBalances();
        }
      });
    };

    if (rootParams.rootModel.fromVirtualAccountViewScreen) {
      self.viewBalDetails(rootParams.rootModel.balanceDetails);
      self.setBalances();
    } else {
      self.virtualAccountNo(rootParams.rootModel.clickedNode);
      self.virtualAccountCcy(rootParams.rootModel.currency);
      self.fetchBalance();
    }

    self.closeRightPanel = function () {
      rootParams.closeHandler();
    };
  };
});
