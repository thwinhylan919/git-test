 /**
  * View tabular Scructure component helps to fetch details in tree format in a table for specific structure Id
  *
  * @module liquidity-management
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} viewTabularStructureModel
  * @requires {object} ResourceBundle
  */
 define([
     "ojs/ojcore",
     "knockout",
     "./model",
     "ojL10n!resources/nls/view-structure-tabular",
     "ojs/ojtable",
     "ojs/ojpagingcontrol",
     "ojs/ojpagingtabledatasource",
     "ojs/ojrowexpander",
     "ojs/ojflattenedtreetabledatasource",
     "ojs/ojjsontreedatasource",
     "ojs/ojmenu",
     "ojs/ojoption"
 ], function(oj, ko, viewTabularStructureModel, ResourceBundle) {
     "use strict";

     /** View tabular structure.
      * It allows user to view structure details in a tree format inside table.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
      * @return {Function} Function.
      * @return {Object} GetNewKoModel.
      *
      */
     return function(rootParams) {
         const self = this;

         ko.utils.extend(self, rootParams.rootModel);
         self.resource = ResourceBundle.structure.labels;
         self.generic = ResourceBundle.structure.generic;
         self.viewStructureDetailsDataSource = ko.observable();
         self.partyName = ko.observable();
         self.tabularData = ko.observable();
         self.linkedAccNo = ko.observable();
         self.nodeData = ko.observableArray();
         self.mode = self.mode || null;
         self.linkedAccountNoMap = {};
         self.structureType = ko.observable();

         /**
          * This function is used to enhance the response json. It replaces all occourance of account with attr to get desired result.
          *
          * @memberOf view-structure-tabular
          * @function  renameProperty
          * @param {Object} response - Account list.
          * @returns {void}
          */
         function renameProperty(response) {
             const test1 = JSON.stringify(ko.mapping.toJS(response));

             return JSON.parse(test1.replace(/\"account\"/g, "\"attr\""));
         }

         rootParams.baseModel.registerComponent("view-instruction-details", "liquidity-management");
         rootParams.baseModel.registerComponent("set-instruction-details", "liquidity-management");

         /**
          * A recursive function called to fetch the specified node details.
          *
          * @memberOf view-structure-tabular
          * @function getNodeLinkDetails
          * @param {Object} startId - - - - - - - - - - - - - - Contains account of specified node.
          * @param {Object} endId Contains account of specified node.
          * @param {object} accountlst Contains details of structure.
          * @returns {array} NodeData contains details of specified node.
          */
         function getNodeLinkDetails(startId, endId, accountlst) {
             if (accountlst) {
                 if (accountlst.account.accountDetails.accountKey.accountNo.value === startId) {
                     self.nodeData.push(accountlst.account);
                 } else if (accountlst.account.accountDetails.accountKey.accountNo.value === endId) {
                     const account = {
                         account: accountlst.account
                     };

                     self.nodeData.push(account);
                 }

                 if (accountlst.children && accountlst.children.length) {
                     for (let i = 0; i < accountlst.children.length; i++) {
                         getNodeLinkDetails(startId, endId, accountlst.children[i]);
                     }
                 }

                 return self.nodeData;
             }
         }

         self.instructionStatusMap = self.instructionStatusMap || {};

         self.instructionDetails = function(event, data) {
             self.nodeData.removeAll();

             const startId = data.parentAccountKey.accountNo.value,
                 endId = data.accountDetails.accountKey.accountNo.value,
                 nodeDetails = getNodeLinkDetails(startId, endId, self.tabularData());

             if (data.cashCCMethod === "Sweep") {
                 if (self.mode() === "update") {
                     rootParams.dashboard.openRightPanel("set-instruction-details", {
                         structureDetails: self.structureDetails(),
                         defaultInstructions: self.defaultInstructionDetails,
                         nodeDetails: nodeDetails,
                         instructionStatusMap: self.instructionStatusMap
                     }, self.resource.instructionDetails);
                 } else {
                     rootParams.dashboard.openRightPanel("view-instruction-details", {
                         structureDetails: self.structureDetails(),
                         nodeDetails: nodeDetails
                     }, self.resource.instructionDetails);
                 }

             } else if (data.cashCCMethod === "Pool") {
                 if (self.mode() === "update" && ((data.level > 1 && self.structureDetails().structureKey.versionNo() === 1) || self.structureDetails().structureKey.versionNo() > 1)) {
                     rootParams.dashboard.openRightPanel("set-pool-instructions", {
                         structureDetails: self.structureDetails(),
                         nodeDetails: nodeDetails,
                         instructionStatusMap: self.instructionStatusMap,
                         isEditable: true
                     }, self.resources.structure.reallocationMethod);
                 } else {
                     rootParams.dashboard.openRightPanel("set-pool-instructions", {
                         structureDetails: self.structureDetails(),
                         nodeDetails: nodeDetails,
                         instructionStatusMap: self.instructionStatusMap
                     }, self.resources.structure.reallocationMethod);
                 }
             }
         };

         /**
          * Calculate linked account to an account and creates a map of the same.
          *
          * @memberOf view-structure-tabular
          * @function  createLinkedAccountNoMap
          * @param {Object} element - Account list element.
          * @returns {void}
          */
         function createLinkedAccountNoMap(element) {
             if (element.children && element.children.length) {
                 self.linkedAccountNoMap[element.account.accountDetails.accountKey.accountNo.value] = element.children.length;

                 for (let i = 0; i < element.children.length; i++) {
                     createLinkedAccountNoMap(element.children[i]);
                 }
             }
         }

         /**
          * This function is used handle response.
          *
          * @memberOf view-structure-tabular
          * @function  responseHandler
          * @param {Object} structureDetails - Contains structure basic details.
          * @param {Object} tabularData - Contains account list.
          * @returns {void}
          */
         function responseHandler(structureDetails, tabularData) {
             self.partyName(structureDetails.customerDesc || rootParams.customerDesc);
             self.structureType(ko.utils.unwrapObservable(structureDetails.structureType));
             self.tabularData(tabularData);
             createLinkedAccountNoMap(tabularData);

             self.viewStructureDetailsDataSource(new oj.FlattenedTreeTableDataSource(
                 new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource([renameProperty(tabularData)]), [])));
         }

         if (rootParams.structureDetails) {
             responseHandler(rootParams.structureDetails(), rootParams.tabularData());
         } else {
             viewTabularStructureModel.getStructuredata(rootParams.structureId ? rootParams.structureId() : null).then(function(data) {
                 responseHandler(data.jsonNode.structureList, data.jsonNode.structureList.accountlst);
             });
         }
     };
 });