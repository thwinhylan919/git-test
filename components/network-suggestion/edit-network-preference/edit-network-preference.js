 /**
  * edit-network-preference.
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
     "ojL10n!resources/nls/edit-network-preference",
     "ojs/ojknockout-validation",
     "ojs/ojbutton",
     "ojs/ojselectcombobox",
     "ojs/ojarraytabledatasource",
     "ojs/ojtable"
 ], function(oj, ko, networkPreferenceModel, ResourceBundle) {
     "use strict";

     /** Edit-network-preference.
      *
      *IT allows user to edit network and priority mapping.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
      * @return {Function} Function.
      * @return {Object} GetNewKoModel.
      */
     return function(rootParams) {
         const self = this,
             getNewKoModel = function() {
                 const KoModel = ko.mapping.fromJS(networkPreferenceModel.getNewModel());

                 return KoModel;
             };

         self.resource = ResourceBundle;
         self.dataLoaded = ko.observable(false);
         self.networkTypeMap = ko.observable({});
         self.preferenceDataSource = ko.observable();
         self.priorityArray = ko.observableArray();
         self.networkPriorityArray = ko.observableArray([]);
         ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);
         self.reviewMode = ko.observable(false);
         rootParams.dashboard.headerName(self.resource.networkPreference.header);
         rootParams.baseModel.registerComponent("view-network-preference", "network-suggestion");

         if (!rootParams.rootModel.previousState) {
             networkPreferenceModel.fetchBankConfiguration().then(function(data) {
                 Promise.all([networkPreferenceModel.readNetworkType(data.bankConfigurationDTO.region), networkPreferenceModel.fetchPriority()]).then(function(response) {
                     if (response[1].networkpreferencedtos && response[1].networkpreferencedtos.length>0) {
                         for (let i = 0; i < response[1].networkpreferencedtos.length; i++) {
                             self.networkPriorityModel = getNewKoModel().networkPriorityModel;
                             self.networkPriorityModel.networkType(response[1].networkpreferencedtos[i].networkType);
                             self.networkPriorityModel.priority(response[1].networkpreferencedtos[i].priority);
                             self.networkPriorityArray.push(self.networkPriorityModel);

                             self.priorityArray.push({
                                 key: response[1].networkpreferencedtos[i].priority,
                                 value: response[1].networkpreferencedtos[i].priority.toString()
                             });

                             self.networkTypeMap()[response[1].networkpreferencedtos[i].networkType] = ko.observable();

                             self.networkTypeMap()[response[1].networkpreferencedtos[i].networkType](ko.utils.arrayFirst(response[0].enumRepresentations[0].data, function(element) {
                                 return element.code === response[1].networkpreferencedtos[i].networkType;
                             }).description);
                         }
                     } else {
                         for (let i = 0; i < response[0].enumRepresentations[0].data.length; i++) {
                             self.networkPriorityModel = getNewKoModel().networkPriorityModel;
                             self.networkPriorityModel.networkType(response[0].enumRepresentations[0].data[i].code);
                             self.networkPriorityModel.priority(i + 1);
                             self.networkPriorityArray.push(self.networkPriorityModel);

                             self.priorityArray.push({
                                 key: i + 1,
                                 value: (i + 1).toString(),
                                 selected: false
                             });

                             self.networkTypeMap()[response[0].enumRepresentations[0].data[i].code] = ko.observable(response[0].enumRepresentations[0].data[i].description);
                         }
                     }

                     ko.tasks.runEarly();
                     self.preferenceDataSource(new oj.ArrayTableDataSource(self.networkPriorityArray));
                     self.dataLoaded(true);
                 });
             });

         }

         self.save = function() {
             self.reviewMode(true);

             let k;

             for (k = 0; k < (self.networkPriorityArray().length - 1); k++) {
                 if (ko.utils.arrayFirst(self.networkPriorityArray(), function(element) {
                         return (element.priority() === self.networkPriorityArray()[k].priority()) && (element.networkType() !== self.networkPriorityArray()[k].networkType());
                     })) {
                     rootParams.baseModel.showMessages(null, [self.resource.networkPreference.errorMessage], "ERROR");
                     break;
                 }

             }

             if (k === (self.networkPriorityArray().length - 1)) {
                 rootParams.dashboard.loadComponent("view-network-preference", {
                     dataLoaded: self.dataLoaded,
                     networkPriorityArray: self.networkPriorityArray,
                     reviewMode: self.reviewMode,
                     preferenceDataSource: self.preferenceDataSource,
                     priorityArray: self.priorityArray
                 });
             }

         };

     };
 });