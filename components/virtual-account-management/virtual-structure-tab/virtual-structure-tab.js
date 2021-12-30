/**
 * View tabular Scructure component helps to fetch details in tree format in a table for specific structure Id
 *
 * @module vitual-account-management
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} viewTabularStructureModel
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "ojL10n!resources/nls/virtual-structure-tab",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojrowexpander",
  "ojs/ojflattenedtreetabledatasource",
  "ojs/ojjsontreedatasource"
], function (oj, ko, resourceBundle) {
  "use strict";

  /** View tabular structure.
   * It allows user to view structure details in a tree format inside table.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   * @return {Object} GetNewKoModel.
   *
   */
  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.viewStructureDetailsDataSource = ko.observable();
    self.linkedAccNo = ko.observable();
    self.linkedAccountNoMap = {};
    self.mode = ko.observable();
    self.tabularData = ko.observable();
    self.realCustomerNo = rootParams.dashboard.userData.userProfile.partyId.value;

    let currency;

    if (rootParams.rootModel.structureCode) {
      self.structureCode = rootParams.rootModel.structureCode();
    }

    rootParams.baseModel.registerComponent("view-balance-details", "virtual-account-management");

    /**
     * This function is used to enhance the response json. It replaces all occourance of account with attr to get desired result.
     *
     * @memberOf virtual-structure-tab
     * @function  renameProperty
     * @param {Object} response - Account list.
     * @returns {void}
     */
    function renameProperty(response) {
      const test1 = JSON.stringify(response);

      return JSON.parse(test1.replace(/\"account\"/g, "\"attr\""));
    }

    /**
     * Calculate linked account to an account and creates a map of the same.
     *
     * @memberOf virtual-structure-tab
     * @function  createLinkedAccountNoMap
     * @param {Object} element - Account list element.
     * @returns {void}
     */
    function createLinkedAccountNoMap(element) {
      if (element.children && !Array.isArray(element.children)) {
        self.linkedAccountNoMap[element.account.childAccountId.value] = 1;
        createLinkedAccountNoMap(element.children);
      }
      else if (element.children && element.children.length > 0) {
        self.linkedAccountNoMap[element.account.childAccountId.value] = element.children.length;

        for (let i = 0; i < element.children.length; i++) {
          createLinkedAccountNoMap(element.children[i]);
        }
      }
      else if (element.children && Array.isArray(element.children) && element.children.length === 0) {
        self.linkedAccountNoMap[element.account.childAccountId.value] = element.children.length;
      }
      else if (element.children) {
        self.linkedAccountNoMap[element.account.childAccountId.value] = 0;
      }

    }

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

    self.onSelectedInTable = function (data) {
      self.nodeCurrency(data.value, self.structureDetails());

      rootParams.dashboard.openRightPanel("view-balance-details", {
        structureDetailsDTO: self.structureDetails(),
        clickedNode: data.value,
        currency: currency
      }, self.resource.accountBalanceDetails);
    };

  /**
   * This function is used handle response.
   *
   * @memberOf virtual-structure-tab
   * @function  responseHandler
   * @param {Object} tabularData - Structure details.
   * @returns {void}
   */
  function responseHandler(tabularData) {
    self.tabularData(ko.mapping.toJS(tabularData));
    createLinkedAccountNoMap(tabularData);

    self.viewStructureDetailsDataSource(new oj.FlattenedTreeTableDataSource(
      new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource([renameProperty(self.tabularData())]), [])));
  }

  if (rootParams.structureDetails && rootParams.tabularData && rootParams.rootModel.methodType !== "UPDATE") {
    self.mode("create");
    responseHandler(rootParams.structureDetails(), rootParams.tabularData());
  }
  else if (rootParams.rootModel.methodType === "UPDATE" && rootParams.rootModel.params.methodType !== "VIEW") {
    self.mode("UPDATE");
    responseHandler(rootParams.structureDetails(), rootParams.tabularData());
  }
  else {
      self.mode("view");
      responseHandler(rootParams.structureDetails());
  }
};
});
