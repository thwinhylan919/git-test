 /**
  * View Sweep Log component helps to fetch details based on structure, status and date
  *
  * @module liquidity-management
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} viewSweepLogModel
  * @requires {object} ResourceBundle
  */
 define([
   "ojs/ojcore",
   "knockout",
   "jquery",
   "./model",
   "ojL10n!resources/nls/view-sweep-log",
   "ojs/ojknockout-validation",
   "ojs/ojbutton",
   "ojs/ojselectcombobox",
   "ojs/ojvalidationgroup",
   "ojs/ojarraytabledatasource",
   "ojs/ojtable",
   "ojs/ojdatetimepicker",
   "ojs/ojpagingtabledatasource",
   "ojs/ojmenu",
   "ojs/ojoption"
 ], function(oj, ko, $, viewSweepLogModel, ResourceBundle) {
   "use strict";

   /** View Sweep Log.
    *
    *IT allows user to view sweep log details in a tabular format.
    *
    * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
    * @return {Function} Function.
    * @return {Object} GetNewKoModel.
    *
    */
   return function(rootParams) {
     const self = this,
     sweepQueryParams = {},
     upcomingSweepQueryParams = {};

     ko.utils.extend(self, rootParams.rootModel);
     self.dateListLoaded = ko.observable(false);
     self.sweepLogLoaded = ko.observable(false);
     self.sweepLogDetailsDataSource = ko.observable();
     self.structureList = ko.observableArray();
     self.accountPairList = ko.observable();
     self.dateList = ko.observable();
     self.isDataloaded = ko.observable(false);
     self.resource = ResourceBundle;

     const structureMap = {};

     self.currentDate = ko.observable();
     self.selectedStatus = ko.observable();

     let structureDetailArray = ko.observable();

     self.filtertype = ko.observable();
     self.statusCodes = ko.observableArray();
     self.fetchedSweepLogList = ko.observable();
     self.structureId = ko.observable();
     self.toDate = ko.observable();
     self.fromDate = ko.observable();
     self.renderSearchFields = ko.observable();
     self.menuItems = ko.observableArray();

     rootParams.baseModel.registerElement("date-time");
     rootParams.dashboard.headerName(self.resource.header.sweepLog);

     Promise.all([viewSweepLogModel.fetchSweepStatus(), viewSweepLogModel.getStructureListDetails()]).then(function(response) {
       if (response[0].enumRepresentations) {
         for (let j = 0; j < response[0].enumRepresentations[0].data.length; j++) {
           self.statusCodes.push({
             value: response[0].enumRepresentations[0].data[j].code,
             label: response[0].enumRepresentations[0].data[j].description
           });
         }
       }

       self.currentDate(rootParams.baseModel.getDate());

       structureDetailArray = $.map(response[1].jsonNode.structureList, function(listData) {
         structureMap[listData.structureKey.structureId] = listData.desc;

         return {
           value: listData.structureKey.structureId,
           label: listData.desc
         };
       });

       self.structureList(structureDetailArray);
       self.renderSearchFields(true);
     });

     self.menuItems = [{
       id: "pdf",
       value: self.resource.download.pdf
     }, {
       id: "csv",
       value: self.resource.download.csv
     }];

     /**
      * This function is used to download sweep log details in pdf format based on status type.
      *
      * @memberOf view-sweep-log
      * @function  download
      * @param {Object} event - Selected type of download.
      * @returns {void}
      */
     self.download = function(event) {
       if (self.selectedStatus() === "P" && event.target.value === "pdf") {
         $("#passwordDialog").trigger("openModal");
         viewSweepLogModel.fetchUpcomingPDF(upcomingSweepQueryParams);
       } else if (self.selectedStatus() === "P" && event.target.value === "csv") {
         viewSweepLogModel.fetchUpcomingCSV(upcomingSweepQueryParams);
       } else if ((self.selectedStatus() === "E" || self.selectedStatus() === "S") && event.target.value === "pdf") {
         $("#passwordDialog").trigger("openModal");
         viewSweepLogModel.fetchPDF(sweepQueryParams);
       } else if ((self.selectedStatus() === "E" || self.selectedStatus() === "S") && event.target.value === "csv") {
         viewSweepLogModel.fetchCSV(sweepQueryParams);
       }
     };

     /**
      * This function is used to close the modal window info for password notification.
      *
      * @memberOf view-sweep-log
      * @function  closeModal
      * @returns {void}
      */
     self.closeModal = function() {
       $("#passwordDialog").trigger("closeModal");
     };

     /**
      * This function is used to fetch sweep details based on user specific inputs in a tabular format.
      *
      * @memberOf view-sweep-log
      * @function  submitDetails
      * @returns {void}
      */
     self.submitDetails = function() {
       if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("SweepLogValidationTracker"))) {
         return;
       }

       let sweepLogDetailsArray = [];

       sweepQueryParams.filter = self.selectedStatus();
       self.filtertype(self.selectedStatus());

       if (self.selectedStatus() !== "P") {
         if (self.fromDate()) {
           sweepQueryParams.fromDate =self.fromDate();
         } else {
           sweepQueryParams.fromDate = null;
         }

         if (self.toDate()) {
           sweepQueryParams.toDate = self.toDate();
         } else {
           sweepQueryParams.toDate = null;
         }

         sweepQueryParams.structureId = self.structureId();

         viewSweepLogModel.getSweepLogDetails(sweepQueryParams).then(function(data) {
           self.sweepLogLoaded(false);
           self.fetchedSweepLogList(data.jsonNode.sweepLogList);

           sweepLogDetailsArray = $.map(data.jsonNode.sweepLogList, function(response) {
             return {
               date: response.valueDate,
               datetime: response.timeStamp,
               instructionDesc: response.instructionDetailsId,
               structureId: response.accStrId,
               structureDesc: structureMap[response.accStrId],
               type: response.twoWay,
               sweepOutAccount: response.childAccount.displayValue,
               sweepOutAmount: response.sweepAmount,
               sweepOutCurrency: response.childAccountCcy,
               exchangeRate: response.fxRate,
               sweepInAccount: response.parentAccount.displayValue,
               sweepInAmount: response.sweepAmount,
               sweepInCurrency: response.parentAccountCcy,
               sourceAccount: response.childAccount.displayValue,
               destinationAccount: response.parentAccount.displayValue,
               exception: response.statusMsg,
               sortDate: new Date(response.timeStamp)
             };
           });

            sweepLogDetailsArray.sort(function(left, right) {
              return left.date === right.date ? 0 : left.date < right.date ? -1 : 1;
            });

           self.sweepLogDetailsDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(sweepLogDetailsArray) || []));
           ko.tasks.runEarly();
           self.sweepLogLoaded(true);
         });
       } else {
         upcomingSweepQueryParams.structID = self.structureId();

         if (self.fromDate()) {
           upcomingSweepQueryParams.fromDate = self.fromDate();
         } else {
           upcomingSweepQueryParams.fromDate = null;
         }

         if (self.toDate()) {
           upcomingSweepQueryParams.toDate = self.toDate();
         } else {
           upcomingSweepQueryParams.toDate = null;
         }

         viewSweepLogModel.getUpcomingSweepLogDetails(upcomingSweepQueryParams).then(function(data) {
           self.sweepLogLoaded(false);
           self.fetchedSweepLogList(data.jsonNode.scheduledSweepsDTO);

           sweepLogDetailsArray = $.map(data.jsonNode.scheduledSweepsDTO, function(response) {
             return {
               datetime: response.nextRunDate.replace(/\./g, ":"),
               instructionDesc: response.instructionDesc,
               structureId: response.accStrDesc,
               structureDesc: structureMap[response.accStrDesc],
               sourceAccount: response.parentAccNo.displayValue,
               destinationAccount: response.accNo.displayValue,
               sortDate:new Date(response.nextRunDate)
             };
           });

            sweepLogDetailsArray.sort(function(left, right) {
              return left.datetime === right.datetime ? 0 : left.datetime < right.datetime ? 1 : -1;
            });

           self.sweepLogDetailsDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(sweepLogDetailsArray) || []));
           ko.tasks.runEarly();
           self.sweepLogLoaded(true);
         });
       }

      self.isDataloaded(true);
     };
   };
 });
