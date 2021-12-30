 /**
  * edit-network-rule.
  *
  * @module network-suggestion
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} networkRuleModel
  * @requires {object} ResourceBundle
  */
 define([
     "knockout",
     "./model",
     "ojL10n!resources/nls/edit-network-rule",
     "ojs/ojknockout-validation",
     "ojs/ojbutton",
     "ojs/ojselectcombobox",
     "ojs/ojarraytabledatasource",
     "ojs/ojtable",
     "ojs/ojselectcombobox",
     "ojs/ojcheckboxset"
 ], function(ko, networkRuleModel, ResourceBundle) {
     "use strict";

     /** Edit-network-rule.
      *
      *IT allows user to edit network and priority mapping.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
      * @return {Function} Function.
      *
      */
     return function(rootParams) {
         const self = this,
             batchRequest = {
                 batchDetailRequestList: []
             };

         self.selectedProperties = ko.observableArray();
         self.resource = ResourceBundle;
         self.reviewMode = ko.observable(false);
         self.allPropertyList = ko.observableArray();
         self.listLoaded = ko.observable(false);
         rootParams.dashboard.headerName(self.resource.networkRule.header);
         rootParams.baseModel.registerElement("page-section");

         /**
          * This function is used to create batch request for fetching rule property details.
          *
          * @memberOf view-network-rule
          * @function loadBatchRequest
          * @param {string} categoryId  - It is category id of property.
          * @param {string} propertyId - It is property id of property.
          * @returns {Object} BatchRequest An object containing list batch request.
          */
         function loadBatchRequest(categoryId, propertyId) {
             batchRequest.batchDetailRequestList.push({
                 methodType: "GET",
                 uri: {
                     value: "/configurations/variable/{categoryId}/properties/?propertyId={propertyId}",
                     params: {
                         categoryId: categoryId,
                         propertyId: propertyId
                     }
                 },
                 headers: {
                     "Content-Id": batchRequest.batchDetailRequestList.length + 1,
                     "Content-Type": "application/json"
                 }
             });
         }

         /**
          * This function is used to fire batch request for  fetching property details of all properties.
          *
          * @memberOf view-network-rule
          * @function loadBatchProperty
          * @returns {Object} BatchResponse An object containing list batch response.
          */
         function loadBatchProperty() {
             return networkRuleModel.batchRead(batchRequest).done(function(batchData) {
                 for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                     const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj.configResponseList[0];

                     self.allPropertyList.push({
                         propertyId: responseDTO.propertyId,
                         propertyValue: responseDTO.propertyValue,
                         environmentId: responseDTO.environmentId,
                         propertyComments: responseDTO.propertyComments,
                         determinantValue: responseDTO.determinantValue
                     });

                     if (responseDTO.propertyValue === "Y") {
                         self.selectedProperties.push(responseDTO.propertyId);
                     }
                 }

                 self.listLoaded(true);

             });
         }

         networkRuleModel.fetchPropertyList().then(function(data) {
             for (let i = 0; i < data.configResponseList.length; i++) {
                 loadBatchRequest(data.configResponseList[i].categoryId, data.configResponseList[i].propertyId);
             }

             if (batchRequest.batchDetailRequestList.length) {
                 loadBatchProperty();
             }
         });

         self.save = function() {
             self.reviewMode(true);

             if (self.reviewMode()) {
                 rootParams.dashboard.loadComponent("view-network-rule", {
                     reviewMode: self.reviewMode,
                     selectedProperties: self.selectedProperties,
                     allPropertyList: self.allPropertyList
                 });
             }

         };
     };

 });