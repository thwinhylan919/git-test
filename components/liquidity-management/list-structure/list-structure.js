 /**
  * list structure.
  *
  * @module liquidity-management
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} * @requires {object} recurringDepositModel
  * @requires {object} ResourceBundle
  */
 define([

     "knockout",
     "./model",
     "ojL10n!resources/nls/list-structure",
     "ojs/ojbutton",
     "ojs/ojpopup",
     "ojs/ojselectcombobox",
     "ojs/ojcheckboxset",
     "ojs/ojknockout",
     "ojs/ojarraytabledatasource",
     "ojs/ojtable"
 ], function(ko, listStructureModel, ResourceBundle) {
     "use strict";

     /** List structure.
      *
      *IT allows user to view list of structure and it's details.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
      * @return {Function} Function.
      * @return {Object} GetNewKoModel.
      *
      */
     return function(rootParams) {
         const self = this,
             queryParams = {};

         ko.utils.extend(self, rootParams.rootModel);
         self.resource = ResourceBundle;
         self.partyName = ko.observable();
         self.cardDataLoaded = ko.observable(false);
         self.loadTabularFormat = ko.observable(false);
         self.loadCardFormat = ko.observable(true);
         self.showadditionalData = ko.observable(false);
         self.structureType = ko.observable();
         self.structureStatusArray = ko.observableArray();
         self.cardDetails = ko.observableArray();
         self.structureDetailsDataSource = ko.observable();
         self.structureStatusList = ko.observable();
         self.structureTypeList = ko.observable();
         self.disableFilter = ko.observable(false);
         self.refreshSearchBox = ko.observable(false);
         self.showSearchBar = ko.observable(false);

         self.statusWiseCountMap = {
             Expired: 0,
             Paused: 0,
             Resumed: 0
         };

         rootParams.dashboard.headerName(self.resource.header.accountStructure);
         rootParams.baseModel.registerComponent("action-card-list", "liquidity-management");
         rootParams.baseModel.registerComponent("list-structure-table", "liquidity-management");
         rootParams.baseModel.registerComponent("create-structure", "liquidity-management");
         rootParams.baseModel.registerComponent("view-structure", "liquidity-management");
         rootParams.baseModel.registerElement(["page-section", "row", "search-box"]);

         const interestMethodMap = {};
         let cardDetails = [], countSet = false;

         /**
          * This function is used get list of structure and it's details. Based on that it will sort the list of structures as per the executed date.
          *
          * @param {Array} statusArray - Array of all the structure types to be filtered.
          * @param {string} structureType - Structure type on the basis of which structures are to be filtered.
          * @param {boolean} retainData - Boolean to specify whether the card list data is to be retaied or cleared.
          * @memberOf list-structure
          * @function getStructureList
          * @returns {void}
          */
         self.getStructureList = function(statusArray, structureType, retainData) {
             queryParams.structureType = structureType;

             if (statusArray && statusArray.length) {
                 queryParams.structureStatus = statusArray[0];
             } else {
                 queryParams.structureStatus = null;
             }

             listStructureModel.getStructureDetails(queryParams).then(function(data) {
                 if (!retainData) {
                     cardDetails = [];
                 }

                 if (data.jsonNode.structureList && data.jsonNode.structureList.constructor !== Array) {
                     data.jsonNode.structureList = [data.jsonNode.structureList];
                 }

                 if(data.jsonNode.structureList && data.jsonNode.structureList.length){
                    data.jsonNode.structureList = data.jsonNode.structureList.sort(function(left, right){

                    return new Date(left.audit.makerDateStamp) === new Date(right.audit.makerDateStamp) ? 0 : new Date(left.audit.makerDateStamp) < new Date(right.audit.makerDateStamp) ? 1 : -1;
                   });
                 }

                 self.showSearchBar((data.jsonNode.structureList && data.jsonNode.structureList.length) || (((statusArray && statusArray.length) || structureType) && !(data.jsonNode.structureList && data.jsonNode.structureList.length)));

                 ko.utils.arrayForEach(data.jsonNode.structureList || [], function(a) {
                     if (!statusArray && !structureType && !retainData && !countSet) {
                         self.statusWiseCountMap[a.structureStatus]++;
                         self.statusWiseCountMap[a.structureStatus + a.structureType]++;
                     }

                     cardDetails.push({
                         header: a.desc.toString(),
                         structureId: a.structureKey.structureId,
                         keyId: a.keyId,
                         version: a.structureKey.versionNo,
                         structureType: a.structureType,
                         structureStatus: a.structureStatus,
                         startDate: a.effDate,
                         endDate:a.endDate,
                         structurePriority: a.priority,
                         additionalData: [{
                                 label: self.resource.structureDetails.startDate,
                                 value: a.effDate,
                                 isDate: true
                             },
                             {
                                 label: self.resource.structureDetails.endDate,
                                 value: a.endDate,
                                 isDate: true
                             },
                             {
                                 label: self.resource.structureDetails.interestMethod,
                                 value: interestMethodMap[a.interestMethod]
                             },
                             {
                                 label: self.resource.structureDetails.structurePriority,
                                 value: a.priority
                             }
                         ]
                     });
                 });

                 if (statusArray && statusArray.length > 1) {
                     self.getStructureList(statusArray.slice(1), structureType, true);
                 } else {
                     self.cardDetails(cardDetails);
                     self.cardDataLoaded(false);
                     self.refreshSearchBox(false);
                     ko.tasks.runEarly();
                     countSet = true;
                     self.refreshSearchBox(true);
                     self.cardDataLoaded(true);
                     self.disableFilter(false);
                 }
             });
         };

         Promise.all([listStructureModel.getStructureStatus(), listStructureModel.getStructureType(), listStructureModel.getPartyDetails(), listStructureModel.getInterestMethods()]).then(function(response) {
             self.structureStatusList(response[0].enumRepresentations[0].data);
             self.structureTypeList(response[1].enumRepresentations[0].data);
             self.partyName(response[2].party.personalDetails.fullName);

             ko.utils.arrayForEach(self.structureStatusList(), function(status) {
                 ko.utils.arrayForEach(self.structureTypeList(), function(type) {
                     self.statusWiseCountMap[status.code + type.code] = 0;
                 });
             });

             ko.utils.arrayForEach(response[3].enumRepresentations[0].data, function(element) {
                 interestMethodMap[element.code] = element.description;
             });

             self.getStructureList();
         });

         /**
          * Click handler of structure card.
          *
          * @memberOf list-structure
          * @param {Object} data - Card data.
          * @function onCardClick
          * @returns {void}
          */
         self.onCardClick = function(data) {
             rootParams.dashboard.loadComponent("view-structure", {
                 structureId: data.structureId,
                 keyId:data.keyId,
                 mode:"view",
                 structureDetails: ko.utils.arrayFirst(self.cardDetails(), function(element) {
                     return element.keyId === data.keyId;
                 })
             });
         };

         const structureStatusFilterSubscribe = self.structureStatusArray.subscribe(function(newValue) {
             self.disableFilter(true);
             ko.tasks.runEarly();
             self.getStructureList(newValue, self.structureType());
         });

         /**
          * This function is to reset the field used for filtering the structure list.
          *
          * @memberOf list-structure
          * @function reset
          * @returns {void}
          */
         self.reset = function() {
             self.structureStatusArray.removeAll();
             self.structureType("");
             queryParams.structureType = event.detail.value;
             self.getStructureList();
         };

         /**
          * This function is used to expand card and show the additional details.
          *
          * @memberOf list-structure
          * @function expand
          * @returns {void}
          */
         self.expand = function() {
             self.loadTabularFormat(false);
             self.cardDataLoaded(false);
             ko.tasks.runEarly();
             self.showadditionalData(true);
             self.cardDataLoaded(true);
             self.loadCardFormat(true);
         };

         /**
          * This function is used to expand card and show the manadatory details.
          *
          * @memberOf list-structure
          * @function collapse
          * @returns {void}
          */
         self.collapse = function() {
             self.loadTabularFormat(false);
             self.cardDataLoaded(false);
             ko.tasks.runEarly();
             self.showadditionalData(false);
             self.cardDataLoaded(true);
             self.loadCardFormat(true);
         };

         /**
          * Structure type change handler for filtering structures on the basis of structure status.
          *
          * @memberOf list-structure
          * @param {Object} event - Event details structure type filter.
          * @function structureTypeChangeHandler
          * @returns {void}
          */
         self.structureTypeChangeHandler = function(event) {
             self.disableFilter(true);
             ko.tasks.runEarly();
             self.getStructureList(self.structureStatusArray(), event.detail.value);
         };

         /**
          * This function is used show the structure listing in tabular form.
          *
          * @memberOf list-structure
          * @function openTabularFormat
          * @returns {void}
          */
         self.openTabularFormat = function() {
             self.loadCardFormat(false);
             self.cardDataLoaded(false);
             ko.tasks.runEarly();
             self.cardDataLoaded(true);
             self.loadTabularFormat(true);
         };

         /**
          * This function is used to open popup which will allow user to filter the structure list.
          *
          * @memberOf list-structure
          * @function openMenu
          * @returns {void}
          */
         self.openMenu = function() {
             const popup = document.querySelector("#popup");

             if (popup.isOpen()) {
                 popup.close();
             } else {
                 popup.open("#filter");
             }
         };

         self.dispose = function() {
             structureStatusFilterSubscribe.dispose();
         };
     };
 });