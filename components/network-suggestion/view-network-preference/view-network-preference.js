 /**
  * view-network-preference.
  *
  * @module network-suggestion
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} networkPreferenceModel
  * @requires {object} ResourceBundle
  */
 define([
     "ojs/ojcore",
     "knockout",
     "./model",
     "ojL10n!resources/nls/view-network-preference",
     "ojs/ojknockout-validation",
     "ojs/ojbutton",
     "ojs/ojarraytabledatasource",
     "ojs/ojtable"
 ], function(oj, ko, networkPreferenceModel, ResourceBundle) {
     "use strict";

     /** View-network-preference.
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
         self.dataLoaded = ko.observable(false);
         self.preferenceDataSource = ko.observable();
         self.networkPriorityArray = ko.observableArray([]);
         self.reviewMode = ko.observable(false);
         self.networkTypeMap = ko.observable({});
         self.resource = ResourceBundle;
         self.approvalMode =ko.observable(false);
         rootParams.dashboard.headerName(self.resource.networkPreference.header);
         rootParams.baseModel.registerComponent("edit-network-preference", "network-suggestion");

         if (self.params && self.params.reviewMode && self.params.reviewMode() && !rootParams.rootModel.previousState) {
             self.reviewMode(true);
             self.networkTypeMap = self.params.networkTypeMap;
             self.dataLoaded = self.params.dataLoaded;
             self.networkPriorityArray = self.params.networkPriorityArray;
             self.preferenceDataSource(new oj.ArrayTableDataSource(self.networkPriorityArray));
         }
         else if(self.params && self.params.mode && self.params.mode==="approval"){
          if (self.params.data && self.params.data.networkpreferencedtos && self.params.data.networkpreferencedtos().length>0) {
             networkPreferenceModel.fetchBankConfiguration().then(function(bankData) {
                if(bankData.bankConfigurationDTO.region==="INDIA"){
            Promise.all([networkPreferenceModel.readNetworkType(bankData.bankConfigurationDTO.region)]).then(function(response) {
                         for (let i = 0; i < self.params.data.networkpreferencedtos().length; i++) {
                             self.networkPriorityArray.push({
                                 networkType: self.params.data.networkpreferencedtos()[i].networkType(),
                                 priority: self.params.data.networkpreferencedtos()[i].priority ? self.params.data.networkpreferencedtos()[i].priority() : "-"
                             });

                             self.networkTypeMap()[self.params.data.networkpreferencedtos()[i].networkType()] = ko.observable();

                             self.networkTypeMap()[self.params.data.networkpreferencedtos()[i].networkType()](ko.utils.arrayFirst(response[0].enumRepresentations[0].data, function(element) {
                                 return element.code === self.params.data.networkpreferencedtos()[i].networkType();
                             }).description);
                         }

                         self.preferenceDataSource(new oj.ArrayTableDataSource(self.networkPriorityArray));
                         self.approvalMode(true);
                         self.dataLoaded(true);
                       });
                       }else{
                        rootParams.baseModel.showMessages(null, [self.resource.networkPreference.errorMessage], "ERROR");
                    }
            });
                     }
         }
         else {
             networkPreferenceModel.fetchBankConfiguration().then(function(data) {
                if(data.bankConfigurationDTO.region==="INDIA"){
                 Promise.all([networkPreferenceModel.readNetworkType(data.bankConfigurationDTO.region), networkPreferenceModel.fetchPriority()]).then(function(response) {
                     if (response[1].networkpreferencedtos && response[1].networkpreferencedtos.length>0) {
                         for (let i = 0; i < response[1].networkpreferencedtos.length; i++) {
                             self.networkPriorityArray.push({
                                 networkType: response[1].networkpreferencedtos[i].networkType,
                                 priority: response[1].networkpreferencedtos[i].priority ? response[1].networkpreferencedtos[i].priority : "-"
                             });

                             self.networkTypeMap()[response[1].networkpreferencedtos[i].networkType] = ko.observable();

                             self.networkTypeMap()[response[1].networkpreferencedtos[i].networkType](ko.utils.arrayFirst(response[0].enumRepresentations[0].data, function(element) {
                                 return element.code === response[1].networkpreferencedtos[i].networkType;
                             }).description);
                         }
                     } else {
                         for (let i = 0; i < response[0].enumRepresentations[0].data.length; i++) {
                             self.networkPriorityArray.push({
                                 networkType: response[0].enumRepresentations[0].data[i].code,
                                 priority: "-"
                             });

                             self.networkTypeMap()[response[0].enumRepresentations[0].data[i].code] = ko.observable(response[0].enumRepresentations[0].data[i].description);
                         }
                     }

                     ko.tasks.runEarly();
                     self.preferenceDataSource(new oj.ArrayTableDataSource(self.networkPriorityArray));
                     self.dataLoaded(true);
                 });
                    }
                    else{
                        rootParams.baseModel.showMessages(null, [self.resource.networkPreference.errorMessage], "ERROR");
                    }
             });
         }

         self.editNetworkPreference = function() {
             rootParams.dashboard.loadComponent("edit-network-preference", {});
         };

         self.confirm = function() {
            const payload = {
        networkpreferencedtos:self.networkPriorityArray()
      };

       networkPreferenceModel.setPriority(ko.mapping.toJSON(payload)).done(function(data, status, jqXHR) {
       rootParams.dashboard.loadComponent("confirm-screen", {
             jqXHR: jqXHR,
             transactionName: self.resource.networkPreference.header
           }, self);
         });
         };

     };
 });