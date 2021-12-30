 /**
  * notification-details component helps to fetch details of notifications in dashboard
  * @module liquidity-management
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} notificationDetailsModel
  * @requires {object} ResourceBundle
  */
 define([
     "ojs/ojcore",
     "knockout",
     "./model",
     "ojL10n!resources/nls/notification-details",
     "ojs/ojknockout-validation",
     "ojs/ojbutton",
     "ojs/ojarraytabledatasource",
     "ojs/ojtable"
 ], function(oj, ko, notificationDetailsModel, ResourceBundle) {
     "use strict";

     /**
      * Notification-details
      * It allows user to view notifications in a tabular format.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values
      * @return {Function} function
      * @return {Object} getNewKoModel
      */
     return function(rootParams) {
         const self = this;

         self.resource = ResourceBundle;
         self.notificationDetailsDataSource = ko.observable();
         self.isnoticationListLoaded = ko.observable(false);

         const notificationDetailsArray = [];

         rootParams.baseModel.registerElement("date-box");
         rootParams.baseModel.registerComponent("view-notification-details", "liquidity-management");

         /**
          * This function is used to fetch all notification details from LM dashboard view all option.
          *
          * @memberOf notification-details
          * @function fetchNotications
          * @returns {void}
          */
         self.fetchNotications = function() {
             notificationDetailsModel.fetchNotications().then(function(response) {
                 if (response.jsonNode.dashboardlist.length) {

                     response.jsonNode.dashboardlist.sort(function(a, b) {
                         const a_date = new Date(a.timeStamp),
                             b_date = new Date(b.timeStamp);

                         if (a_date > b_date) {
                             return -1;
                         } else if (a_date < b_date) {
                             return 1;
                         }

                         return 0;

                     });

                     for (let index = 0; index < 3 && index < response.jsonNode.dashboardlist.length; index++) {
                         notificationDetailsArray.push({
                             date: response.jsonNode.dashboardlist[index].timeStamp,
                             message: response.jsonNode.dashboardlist[index].alertMessage
                         });
                     }

                     self.notificationDetailsDataSource(new oj.ArrayTableDataSource(notificationDetailsArray || []));
                     self.isnoticationListLoaded(true);
                 }
             });
         };

         self.fetchNotications();

         /**
          * This function is used to fetch all notification details from LM dashboard view all option.
          *
          * @memberOf notification-details
          * @function ViewAllNotifications
          * @returns {void}
          */
         self.ViewAllNotifications = function() {
             rootParams.dashboard.loadComponent("view-notification-details");
         };
     };
 });