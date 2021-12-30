/**
 * Assemble structure helps to configure structure in tree or tabular format
 *
 * @module virtual-account-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} assembleStructureModel
 * @requires {object} ResourceBundle
 */

define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/assemble-account-structure",
  "ojs/ojinputtext",
  "ojs/ojswitch",
  "ojs/ojbutton",
  "ojs/ojoption",
  "ojs/ojmenu"
], function (ko, $, assembleStructureModel, resourceBundle) {
  "use strict";

  /**
   * Assemble Structure component is used to assemble the structure and opens overlay to add header account for structure.
   *
   * @param {Object} params  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   */
  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resources = resourceBundle;
    self.mode = params.rootModel.params.mode;
    params.dashboard.headerName(self.resources.title);
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    params.baseModel.registerComponent("link-structure-virtual-account", "virtual-account-management");
    params.baseModel.registerComponent("virtual-structure-tree-view", "virtual-account-management");
    params.baseModel.registerComponent("virtual-structure-tab", "virtual-account-management");
    params.baseModel.registerComponent("review-virtual-structure", "virtual-account-management");
    params.baseModel.registerComponent("tree-view", "liquidity-management");
    params.baseModel.registerComponent("virtual-structure-tab", "virtual-account-management");
    self.structureDetails = ko.observable();
    self.refreshTree = ko.observable(true);
    self.displayMode = ko.observable("tree");
    self.showDisplayGroupId = ko.observable(false);
    self.selectedAccountArray = ko.observable(params.rootModel.selectedAccountArray !== undefined ? params.rootModel.selectedAccountArray : "");
    self.updateMessage = ko.observable(self.resources.title);
    self.headerAccountDetailsLoaded = ko.observable(false);
    self.mainVirtualAccount = ko.observable(null);
    self.virtualMainAcc = ko.observable();
    self.editStructureData = params.rootModel.params.editStructureData;

    $("#treeIcon").addClass("icon-color");

    if (params.rootModel.params.additionalDetails) {
      self.additionalDetails = params.rootModel.params.additionalDetails;
    }

    self.headerVirtualAccount = params.rootModel.params.HeaderVirtualAccount;
    self.virtualStructureCreateDTO = params.rootModel.params.virtualStructureCreateDTO;
    self.accountLinkage = ko.isObservable(params.rootModel.params.virtualStructureCreateDTO.accountLinkage) ? params.rootModel.params.virtualStructureCreateDTO.accountLinkage() : self.virtualStructureCreateDTO.accountLinkage;

    if (self.mode === "CREATE") {
      if (params.rootModel.params.virtualStructureCreateDTO && params.rootModel.params.fromReview === "fromReview") {
        self.structureDetails(JSON.parse(params.rootModel.params.structureDetails));

      } else {
        self.structureDetails(params.rootModel.params.virtualStructureCreateDTO.accountMapDetails.children()[0]);
      }

      self.mainVirtualAccount(params.rootModel.params.virtualStructureCreateDTO.accountMapDetails.children()[0].account.parentAccountId());

      if (params.rootModel.params.additionalDetails) {
        self.realAccountNo = JSON.parse(params.rootModel.params.additionalDetails);

        self.displayAccountNumber = JSON.parse(params.rootModel.params.additionalDetails).displayValue;
        self.showDisplayGroupId(false);
      } else {
        self.displayGroupId = params.rootModel.params.virtualStructureCreateDTO.groupId();
        self.showDisplayGroupId(true);
      }

    } else {
      self.structureDetails(JSON.parse(params.rootModel.params.structureDetails));
      self.mainVirtualAccount(ko.observable(JSON.parse(params.rootModel.params.structureDetails).account.childAccountId));

      if (self.mode === "UPDATE" && !params.rootModel.params.fromReview) {
        self.virtualStructureCreateDTO = ko.mapping.fromJS(JSON.parse(params.rootModel.params.virtualStructureCreateDTO));

        if (params.rootModel.params.additionalDetails) {
          self.realAccountNo = JSON.parse(params.rootModel.params.additionalDetails);

          self.displayAccountNumber = JSON.parse(params.rootModel.params.additionalDetails).displayValue;
          self.showDisplayGroupId(false);
        } else {
          self.displayGroupId = self.virtualStructureCreateDTO.groupId();
          self.showDisplayGroupId(true);
        }
      } else if(self.mode === "UPDATE" && params.rootModel.params.fromReview) {
        self.virtualStructureCreateDTO = params.rootModel.params.virtualStructureCreateDTO;

        if (params.rootModel.params.additionalDetails) {
          self.realAccountNo = JSON.parse(params.rootModel.params.additionalDetails);

          self.displayAccountNumber = JSON.parse(params.rootModel.params.additionalDetails).displayValue;
          self.showDisplayGroupId(false);
        } else {
          self.displayGroupId = self.virtualStructureCreateDTO.groupId();
          self.showDisplayGroupId(true);
        }
      }

    }

    if (self.mode === "REVIEW" && params.rootModel.editStructureData) {
      self.modNo = params.rootModel.editStructureData.modNo;
    }

    self.nodeAccount = ko.observable();
    self.headerAccountDetailsLoaded(true);
    self.finalPayload = ko.observableArray();

    let accountlst = [];

    if (params.rootModel.params.virtualAccountData || params.rootModel.virtualAccountData) {
      self.virtualAccountData = ko.observable(params.rootModel.params.virtualAccountData !== undefined ? JSON.parse(params.rootModel.params.virtualAccountData) : JSON.parse(params.rootModel.virtualAccountData));
    }

    if (self.mode === "REVIEW") {
      self.interestCalcRequired = params.rootModel.params.virtualStructureCreateDTO.interestCalcReq();

      if (params.rootModel.params.additionalDetails) {
        self.realAccountNo = JSON.parse(params.rootModel.params.additionalDetails);
        self.displayAccountNumber = JSON.parse(params.rootModel.params.additionalDetails).displayValue;
        self.showDisplayGroupId(false);
        self.realAccountBrn = JSON.parse(params.rootModel.params.additionalDetails).branchCode;
      } else {
        self.displayGroupId = params.rootModel.params.virtualStructureCreateDTO.groupId();
        self.showDisplayGroupId(true);
      }

      self.realCustomerNo = params.rootModel.params.virtualStructureCreateDTO.realCustomerNo();
      self.structureCode = params.rootModel.params.virtualStructureCreateDTO.code();
      self.structureDesc = params.rootModel.params.virtualStructureCreateDTO.name();
      self.structureDetails(JSON.parse(params.rootModel.params.structureDetails));
      self.headerVirtualAccount = params.rootModel.params.headerVirtualAccount;
    }

    self.reset = function (data) {
      self.headerAccountDetailsLoaded(false);
      self.displayMode(data);
      self.headerAccountDetailsLoaded(true);
    };

    self.setTreeView = function () {
      $("#tableIcon").removeClass("icon-color");
      self.reset("tree");
    };

    self.setTabularView = function () {
      $("#treeIcon").removeClass("icon-color");
      self.reset("table");
    };

    if (params.rootModel.params.mode === "UPDATE") {
      self.setTabularView();
      self.methodType = params.rootModel.params.mode;
      self.virtualMainAcc = ko.observable(params.rootModel.params.virtualMainAcc);
      self.structureDetails(JSON.parse(params.rootModel.params.structureDetails));

    }

    self.menuItems = [{
      id: "link",
      label: self.resources.link
    }, {
      id: "delete",
      label: self.resources.remove
    }];

    /**
     * This function will be used to open the menu option from the nodes of the tree containing link and delete options.
     *
     * @memberOf assemble-structure
     * @function openMenu
     * @param {Object} data - To be passed for specific operation.
     * @param {Object} event - To be used to capture the event.
     * @returns {void}
     */
    self.openMenu = function (data, event) {
      if (self.methodType === "UPDATE") {
        $("#menuLauncher-viewStructure-contents-" + data.childAccountId.value).ojMenu("open", event);
      } else if (self.displayMode() === "tree" && self.methodType !== "UPDATE") {
        $("#menuLauncher-viewStructure-contents-" + data.nodeData.childAccountId.value).ojMenu("open", event);
      } else if (self.displayMode() === "table" && self.methodType !== "UPDATE") {
        $("#menuLauncher-viewStructure-contents-" + data.childAccountId.value).ojMenu("open", event);
      }
    };

    /**
     * This function will be used to open the menu option from the nodes of the tree containing link and delete options.
     *
     * @memberOf assemble-structure
     * @function menuItemSelect
     * @param {Object} virtualAccount - - - - - - - - - - - - - - - To be used to capture the event of the menu option.
     * @param {Object} event To be used to capture the event of the menu option.
     * @returns {void}
     */
    self.menuItemSelect = function (virtualAccount, event) {
      self.nodeAccount(virtualAccount);

      if (event.target.value === "link") {
        params.dashboard.openRightPanel("link-structure-virtual-account", {
          selectedAccountArray: self.selectedAccountArray,
          virtualAccountData: self.virtualAccountData,
          realAccountNo: self.realAccountNo
        }, self.resources.linkAccountHeader);
      } else if (event.target.value === "delete") {
        $("#removeNodeDialog").trigger("openModal");
      }
    };

    /**
     * This function will be used to link child account to form the tree structure.
     *
     * @memberOf assemble-structure
     * @function manageAccountList
     * @param {string} virtualAccountNo - Account id the account to be managed in acocunt list.
     * @param {string} action - Action to be taken on the provided account. Action could be "add"/"remove".
     * @returns {void}
     */
    function manageAccountList(virtualAccountNo, action) {
      switch (action) {
        case "add":
          {
            const account = ko.utils.arrayFirst(self.selectedAccountArray(), function (element) {
              return element.virtualAccountNo.value === virtualAccountNo;
            });

            if (account) {
              self.virtualAccountData().push(account);
            }

            break;
          }
        case "remove":
          for (let i = 0; i < self.virtualAccountData().length; i++) {

            if (self.virtualAccountData()[i].id.value === virtualAccountNo.value) {
              self.virtualAccountData().splice(i, 1);
              break;
            }
          }

          break;
      }
    }

    if (params.rootModel.params.HeaderVirtualAccount) {
      manageAccountList(params.rootModel.params.HeaderVirtualAccount, "remove");
    }

    /**
     * This function will be used to link child account to form the tree structure.
     *
     * @memberOf assemble-structure
     * @function linkChilds
     * @param {Object} data - Of the selected node on which link is to be done.
     * @param {Object} parentAccount - The root account to be mapped.
     * @param {Object} linkAccountList - An array containing the list of accounts to be linked from the overlay.
     * @returns {void}
     */
    function linkChilds(demoData, parentAccount, linkAccountList) {
      const data = ko.mapping.toJS(demoData);

      self.refreshTree(false);

      if (data.account.childAccountId.value === parentAccount) {
        const existingChildLength = data.children.length;

        for (let k = 0; k < linkAccountList.length; k++) {
          if (parentAccount !== "xxxxxxxxxxxxxxxx") {
            linkAccountList[k].mainAccountId = data.account.mainAccountId;

          }

          linkAccountList[k].parentAccountId = data.account.childAccountId;
          linkAccountList[k].childAccountId = linkAccountList[k].virtualAccountNo;
          linkAccountList[k].balance = data.account.balance;
          linkAccountList[k].currency = linkAccountList[k].accountCurrency;

          const childData = {
            account: linkAccountList[k],
            children: []
          };

          data.children[existingChildLength + k] = childData;
          manageAccountList(linkAccountList[k].childAccountId, "remove");
        }
      } else {
        for (let i = 0; i < data.children.length; i++) {

          if (data.children[i].children) {
            data.children[i] = linkChilds(data.children[i], parentAccount, linkAccountList);
          } else if (!data.children[i].children) {
            data.children[i].children = [];
            data.children[i] = linkChilds(data.children[i], parentAccount, linkAccountList);
          }
        }

        return data;
      }

      ko.tasks.runEarly();
      self.refreshTree(true);

      return data;
    }

    const selectedChildAccountList = self.selectedAccountArray.subscribe(function (linkAccountList) {
      self.structureDetails(linkChilds(self.structureDetails(), self.nodeAccount(), linkAccountList));
      self.refreshTree(true);
    });

    /**
     * Adds account back to account list.
     *
     * @memberOf assemble-structure
     * @function addAccountBackToAccountList
     * @param {Object} data - Account object that is removed from tree and is to be added back to the account list.
     * @returns {void}
     */
    function addAccountBackToAccountList(data) {
      manageAccountList(data.account.virtualAccountNo, "add");

      if (data.children) {
        for (let i = 0; i < data.children.length; i++) {
          addAccountBackToAccountList(data.children[i]);
        }
      }
    }

    /**
     * This function will be used to recursively search the tree for the specified key to delete from the tree nodes.
     *
     * @memberOf assemble-structure
     * @function removeChild
     * @param {Object} key - Account number of the node selected for removal from the tree structure.
     * @param {Object} treeData - Contains the whole tree structure payload.
     * @returns {void}
     */
    function removeChild(key, treeData) {

      if (treeData && treeData.account) {
        if (key === treeData.account.childAccountId.value) {
          return {
            matched: true,
            data: treeData
          };
        }

        if (treeData.children && treeData.children.length) {
          for (let a = 0; a < treeData.children.length; a++) {
            const removeChildData = removeChild(key, treeData.children[a]);

            treeData.children[a] = removeChildData.data;

            if (removeChildData.matched) {
              addAccountBackToAccountList(treeData.children[a]);
              treeData.children.splice(a, 1);
              break;
            }
          }
        }
      }

      return {
        matched: false,
        data: treeData
      };
    }

    /**
     * This function is used to close the modal window info for node removal from tree.
     *
     * @memberOf assemble-structure
     * @function  closeModal
     * @returns {void}
     */
    self.closeModal = function () {
      $("#removeNodeDialog").trigger("closeModal");
    };

    /**
     * This function is used to remove the account from the tree.
     *
     * @memberOf assemble-structure
     * @function remove
     * @returns {void}
     */
    self.remove = function () {
      self.refreshTree(false);

      const refreshedTreeData = removeChild(self.nodeAccount(), self.structureDetails());

      if (refreshedTreeData.matched) {
        self.headerAccountDetailsLoaded(false);
        addAccountBackToAccountList(self.structureDetails());
      }

      ko.tasks.runEarly();
      self.refreshTree(true);
      $("#removeNodeDialog").trigger("closeModal");
    };

    /**
     * This function will be used to validate structure based on input payload.
     *
     * @memberOf assemble-structure
     * @function validateStructure
     * @returns {void}
     */
    self.validateStructure = function () {
      params.dashboard.loadComponent("review-virtual-structure", {
        virtualStructureCreateDTO: self.virtualStructureCreateDTO,
        structureDetails: JSON.stringify(ko.mapping.toJS(self.structureDetails())),
        headerVirtualAccount: self.headerVirtualAccount,
        additionalDetails: self.additionalDetails,
        mode: self.mode,
        accountGroupId: self.displayGroupId,
        virtualAccountData: JSON.stringify(self.virtualAccountData()),
        editStructureData: self.mode === "UPDATE" ? self.editStructureData : null
      });
    };

    /**
     * This recursive function will be used to reshaping the tree payload for validation of the structure.
     *
     * @memberOf assemble-structure
     * @function generateStructureValidatePayload
     * @param {Object} treeData - To be passed for reshaping.
     * @returns {void}
     */
    function generateStructureValidatePayload(treeData) {

      if (treeData.account) {
        accountlst.push(treeData.account);
      }

      if (treeData.children && treeData.children.length) {
        for (let a = 0; a < treeData.children.length; a++) {
          generateStructureValidatePayload(treeData.children[a]);
        }
      }

      for (let b = 0; b < accountlst.length; b++) {
        delete accountlst[b].virtualAccountNo;
        delete accountlst[b].accOpenDate;
        delete accountlst[b].cy;
        delete accountlst[b].virtualAccountName;
        delete accountlst[b].balance;
        delete accountlst[b].headerAccountNo;
        delete accountlst[b].accMapMasterId;
        delete accountlst[b].id;
        delete accountlst[b].currency;
        delete accountlst[b].moreNodesCount;
        delete accountlst[b].selectedAccount;
        delete accountlst[b].accountCurrency;
        delete accountlst[b].virtualAccountDisplayValue;
      }

      self.finalPayload(accountlst);
    }

    /**
     * This function will be used to validate structure based on input payload.
     *
     * @memberOf structure-configuration
     * @function confirmScreenCreateMessage
     * @returns {void}
     */
    self.confirmScreenCreateMessage = function () {
      return self.resources.structureCreateMsg;
    };

    /**
     * This function will be used to validate structure based on input payload.
     *
     * @memberOf structure-configuration
     * @function structureUpdateMsg
     * @returns {void}
     */
    self.structureUpdateMsg = function () {
      return self.resources.structureUpdateMsg;
    };

    /**
     * This function will be used to validate structure based on input payload.
     *
     * @memberOf structure-configuration
     * @function confirm
     * @returns {void}
     */
    self.confirm = function () {
      accountlst = [];

      let payload = {};

      if (self.structureDetails().children && self.structureDetails().children.length) {
        for (let k = 0; k < self.structureDetails().children.length; k++) {
          generateStructureValidatePayload(self.structureDetails().children[k]);
        }
      }

      if (params.rootModel.params.virtualStructureCreateDTO.groupId() !== undefined && params.rootModel.params.virtualStructureCreateDTO.groupId() !== "") {

        if (self.realAccountNo !== undefined) {
          delete self.realAccountNo.branchCode;
          delete self.realAccountNo.realAccountCurrency;
          self.accountLinkage = "A";
        } else{
          self.accountLinkage = "G";
        }

        payload = {
          code: self.structureCode,
          name: self.structureDesc,
          mainAccountId: self.headerVirtualAccount,
          groupId: self.displayGroupId,
          interestCalcReq: self.interestCalcRequired,
          accountLinkage: self.accountLinkage,
          accountMapDetails: self.finalPayload()
        };

      } else {

        payload = {
          code: self.structureCode,
          name: self.structureDesc,
          mainAccountId: self.headerVirtualAccount,
          realAccountNo: ko.isObservable(params.rootModel.params.virtualStructureCreateDTO.realAccountNo) ? params.rootModel.params.virtualStructureCreateDTO.realAccountNo() : params.rootModel.params.virtualStructureCreateDTO.realAccountNo,
          realAccountBrn: self.realAccountBrn,
          interestCalcReq: self.interestCalcRequired,
          accountLinkage: self.accountLinkage,
          accountMapDetails: self.finalPayload()
        };

      }

      const structureCreateDto = ko.mapping.toJSON(payload);

      if (params.rootModel.params.methodType === "UPDATE") {
        assembleStructureModel.updateStructure(structureCreateDto, self.structureCode).then(function (data) {
          if ((data.messages && data.messages.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
            data.messages.codes.forEach(function(item){
              params.baseModel.showMessages(null, [item.desc], "error");
            });
          } else if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
            params.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.updateMessage(),
              confirmScreenExtensions: {
                resource: resourceBundle,
                isSet: true,
                confirmScreenDetails: [{
                  headerAccountNumber: self.headerVirtualAccount,
                  structureCode: self.structureCode,
                  structureName: self.structureDesc,
                  realAccountNumber: self.realCustomerNo
                }],
                template: "confirm-screen/structure-update-confirmation"
              }
            });
          } else {
            params.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.updateMessage(),
              confirmScreenExtensions: {
                resource: resourceBundle,
                isSet: true,
                confirmScreenMsgEval: self.structureUpdateMsg,
                confirmScreenDetails: [{
                  headerAccountNumber: self.headerVirtualAccount,
                  structureCode: self.structureCode,
                  structureName: self.structureDesc,
                  realAccountNumber: self.realCustomerNo
                }],
                template: "confirm-screen/structure-update-confirmation"
              }
            });
          }
        });
      } else {
        assembleStructureModel.saveStructure(structureCreateDto).then(function (data) {
          if ((data.messages && data.messages.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
            data.messages.codes.forEach(function(item){
              params.baseModel.showMessages(null, [item.desc], "error");
            });
          } else if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
            params.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.updateMessage(),
              confirmScreenExtensions: {
                resource: resourceBundle,
                isSet: true,
                confirmScreenDetails: [{
                  headerAccountNumber: self.headerVirtualAccount,
                  structureCode: self.structureCode,
                  structureName: self.structureDesc,
                  realAccountNumber: self.realCustomerNo
                }],
                template: "confirm-screen/structure-create-confirmation"
              }
            });
          } else {
            params.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.updateMessage(),
              confirmScreenExtensions: {
                resource: resourceBundle,
                confirmScreenMsgEval: self.confirmScreenCreateMessage,
                isSet: true,
                confirmScreenDetails: [{
                  headerAccountNumber: self.headerVirtualAccount,
                  structureCode: self.structureCode,
                  structureName: self.structureDesc,
                  realAccountNumber: self.realCustomerNo
                }],
                template: "confirm-screen/structure-create-confirmation"
              }
            });
          }
        });

      }
    };

    /**
     * This function will be triggered to cleanup the memory allocated to subscribed function variables.
     *
     * @memberOf assemble-structure
     * @function dispose
     * @returns {void}
     */
    self.dispose = function () {
      selectedChildAccountList.dispose();
    };

    self.backToCreate = function () {

      if (self.methodType === "UPDATE") {
        params.dashboard.loadComponent("virtual-account-structure-create", {
          pageReturn: "backFromConfiguration",
          structureDetails: JSON.stringify(self.structureDetails()),
          virtualStructureCreateDTO: JSON.stringify(self.editStructureData),
          headerVirtualAccount: self.structureDetails().account.headerAccountNo,
          mode: self.methodType,
          displayGroupId: self.displayGroupId,
          createData: JSON.stringify(self.virtualStructureCreateDTO)
        });
      } else {
        params.dashboard.loadComponent("virtual-account-structure-create", {
          pageReturn: "backFromConfiguration",
          structureDetails: JSON.stringify(self.structureDetails()),
          virtualStructureCreateDTO: JSON.stringify(ko.mapping.toJS(self.virtualStructureCreateDTO)),
          headerVirtualAccount: params.rootModel.params.fromReview ? ko.observable(self.structureDetails().account.headerAccountNo) : self.mainVirtualAccount,
          mode: self.methodType,
          displayGroupId: self.displayGroupId
        });

      }
    };
  };
});