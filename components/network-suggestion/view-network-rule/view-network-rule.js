 /**
  * view-network-rule.
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
     "ojL10n!resources/nls/view-network-rule",
     "ojs/ojknockout-validation",
     "ojs/ojbutton",
     "ojs/ojarraytabledatasource",
     "ojs/ojtable",
     "ojs/ojselectcombobox",
     "ojs/ojcheckboxset",
     "ojs/ojpopup"
 ], function(ko, networkRuleModel, ResourceBundle) {
     "use strict";

     /** View-network-rule.
      *
      *IT allows user to view network and priority mapping.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
      * @return {Function} Function.
      *
      */
     return function(rootParams) {
         const self = this;

         ko.utils.extend(self, rootParams.rootModel);

         const batchRequest = {
        batchDetailRequestList: []
        };

         self.resource = ResourceBundle;
         self.reviewMode = ko.observable(false);
         self.listLoaded = ko.observable(false);
         self.allPropertyList = ko.observableArray();
         self.selectedProperties = ko.observableArray();
         rootParams.dashboard.headerName(self.resource.networkRule.header);
         rootParams.baseModel.registerComponent("edit-network-rule", "network-suggestion");
         rootParams.baseModel.registerElement(["page-section","confirm-screen"]);

         self.editNetworkRule = function() {
             rootParams.dashboard.loadComponent("edit-network-rule", {});
         };

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

         self.allPropertyList.push(
                            {
                                propertyId: responseDTO.propertyId,
                                propertyValue: responseDTO.propertyValue,
                                environmentId : responseDTO.environmentId,
                                propertyComments : responseDTO.propertyComments,
                                determinantValue : responseDTO.determinantValue
                        });

                        if(responseDTO.propertyValue==="Y"){
                            self.selectedProperties.push(responseDTO.propertyId);
                        }
        }

        self.listLoaded(true);

      });
    }

         if(self.params && self.params.reviewMode && self.params.reviewMode() && !rootParams.rootModel.previousState){
            self.reviewMode(true);
            self.allPropertyList = self.params.allPropertyList;
            self.selectedProperties = self.params.selectedProperties;
            self.listLoaded(true);
         } else {
              networkRuleModel.fetchPropertyList().then(function(data) {
                for(let i = 0; i < data.configResponseList.length; i++){
                    loadBatchRequest(data.configResponseList[i].categoryId, data.configResponseList[i].propertyId);
                }

                if(batchRequest.batchDetailRequestList.length){
                    loadBatchProperty();
                }

             });

         }

        self.confirm = function() {
      const payload = {
        categoryId : "NetworkType",
        configRequestList: []
      };

      for (let i = 0; i < self.allPropertyList().length; i++)
        {
          let found = false;

          for(let j =0; j < self.selectedProperties().length; j++){
            if(self.allPropertyList()[i].propertyId===self.selectedProperties()[j]){
                self.allPropertyList()[i].propertyValue = "Y";
                found = true;
                break;
            }
          }

        if(!found){
                self.allPropertyList()[i].propertyValue = "N";
            }

        payload.configRequestList.push(self.allPropertyList()[i]);
        }

      networkRuleModel.updateNetworkRule(ko.toJSON(payload)).done(function(data, status, jqXHR) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionName: self.resource.networkRule.header
        }, self);
      });
    };

     };
 });