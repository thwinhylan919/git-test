define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/virtual-structure-tree-view",
  "ojs/ojbutton",
  "ojs/ojknockout",
  "ojs/ojmenu",
  "ojs/ojoption"
], function (ko, $, VirtualStructureModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.structureDetails = ko.observable();
    self.structureDetailsLoaded = ko.observable(false);
    self.resource = ResourceBundle;
    self.updateMessage = ko.observable(self.resource.deleteConfirm);
    self.realAccountNo = ko.observable();
    self.virtualMCA = ko.observable();
    self.structureName = ko.observable();
    self.recordStatus = ko.observable();
    self.selectedMenuItem = ko.observable();
    self.checkZeroBalance = ko.observable();
    self.createData = ko.observable();
    rootParams.dashboard.headerName(self.resource.header);
    self.mode = ko.observable("tree");
    rootParams.baseModel.registerComponent("structure-configuration", "virtual-account-management");
    rootParams.baseModel.registerComponent("tree-view", "liquidity-management");
    rootParams.baseModel.registerComponent("virtual-structure-tab", "virtual-account-management");
    rootParams.baseModel.registerComponent("view-balance-details", "virtual-account-management");
    rootParams.baseModel.registerComponent("virtual-account-structure-create", "virtual-account-management");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement(["page-section"]);
    self.realCustomerNo = rootParams.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = rootParams.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.structureCode = ko.observable(rootParams.rootModel.params.structureCode);
    self.virtualMainAcc = ko.observable();
    self.structureStatus = ko.observable(rootParams.rootModel.params.status);
    self.displayAccountNumber = ko.observable();

    let currency = "";

    $("#treeIcon").addClass("icon-color");

    self.setTreeView = function () {
      $("#tableIcon").removeClass("icon-color");
      self.reset("tree");
    };

    self.confirmScreenDeleteMessage = function () {
      return self.resource.structureDeleteMsg;
    };

    self.backToSearch = function () {
      rootParams.dashboard.loadComponent("virtual-structure-search", self);
    };

    self.setTabularView = function () {
      $("#treeIcon").removeClass("icon-color");
      self.reset("table");
    };

    self.reset = function (data) {
      self.structureDetailsLoaded(false);
      self.mode(data);
      self.structureDetailsLoaded(true);
    };

    self.createArrayForChildren = function (element) {
      if (element.children && !Array.isArray(element.children)) {
          element.children = [element.children];
      }

      if (element.children !== undefined && element.children.length > 0) {
        for(let i =0; i<element.children.length; i++) {
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
        data.virtualAccountStructure.structureDetails.accountMapDetails = self.structureDetails();
        self.createData(data.virtualAccountStructure.structureDetails);

        if (data.virtualAccountStructure.structureDetails.realAccountNo) {
          self.realAccountNo(data.virtualAccountStructure.structureDetails.realAccountNo);
        }
        else {
          self.virtualMCA(data.virtualAccountStructure.structureDetails.groupId);
        }

        self.structureName(data.virtualAccountStructure.structureDetails.name);
        self.structureCode(data.virtualAccountStructure.structureDetails.code);
        self.recordStatus(data.virtualAccountStructure.structureDetails.status);
        self.checkZeroBalance(data.virtualAccountStructure.structureDetails.balance.amount);

        self.remarks = ko.toJSON({
          remarks: "Delete"
        });

        self.structureDetailsLoaded(true);
      }
    });

    self.nodeCurrency = function (node, treeDetails) {
      let foundNode = false;

      if (treeDetails.account.childAccountId.value.toString() === node.toString()) {
        currency = treeDetails.account.balance.currency;
        foundNode = true;

        return currency;
      } else if (treeDetails.children !== undefined && !foundNode) {
        treeDetails.children.forEach(function (item) {
          return self.nodeCurrency(node, item);
        });
      }

    };

    self.nodeClicked = function (data) {
      self.nodeCurrency(data, self.structureDetails());

      rootParams.dashboard.openRightPanel("view-balance-details", {
        structureDetailsDTO: self.structureDetails(),
        clickedNode: data,
        currency: currency
      }, self.resource.balanceDetails);
    };

    self.edit = function () {
      rootParams.dashboard.loadComponent("virtual-account-structure-create", {
        createData: JSON.stringify(self.createData()),
        structureDetails: JSON.stringify(self.structureDetails()),
        mode: "UPDATE",
        virtualMainAcc: JSON.stringify(self.virtualMainAcc())
      });
    };

    self.confirmZeroBalance = function () {
      $("#virtualStructureZeroBal").trigger("openModal");
    };

    self.closeMessage = function () {
      $("#virtualStructureZeroBal").trigger("closeModal");
    };

    self.doNotDelete = function () {
      $("#virtualStructureDelete").trigger("closeModal");
    };

    self.deleteConfirm = function () {
      if (self.checkZeroBalance() !== 0) {
        self.confirmZeroBalance();
      } else {
        $("#virtualStructureDelete").trigger("openModal");
      }
    };

    self.deleteVirtualStructure = function () {
      VirtualStructureModel.deleteVirtualStructure(self.structureCode()).then(function (data) {
        if ((data.messages && data.messages.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
          data.messages.codes.forEach(function (item) {
            rootParams.baseModel.showMessages(null, [item.desc], "error");
          });

          $("#virtualStructureDelete").trigger("closeModal");
        } else if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.updateMessage(),
            confirmScreenExtensions: {
              resource: ResourceBundle,
              isSet: true,
              confirmScreenDetails: [{
                headerAccountNumber: self.structureDetails().account.childdAccountId,
                structureCode: self.structureCode(),
                structureName: self.structureName(),
                realAccountNumber: self.realCustomerNo
              }],
              template: "confirm-screen/virtual-structure-delete-confirmation"
            }
          });
        } else {
          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.updateMessage(),
            eReceiptRequired: true,
            confirmScreenExtensions: {
              resource: ResourceBundle,
              confirmScreenMsgEval: self.confirmScreenDeleteMessage,
              isSet: true,
              confirmScreenDetails: [{
                headerAccountNumber: self.structureDetails().account.childAccountId,
                structureCode: self.structureCode(),
                structureName: self.structureName(),
                realAccountNumber: self.realCustomerNo
              }],
              template: "confirm-screen/virtual-structure-delete-confirmation"
            }
          });
        }
      });
    };
  };
});
