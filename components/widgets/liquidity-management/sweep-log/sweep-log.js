 /**
  * Sweep Log component helps to fetch details based on log type selection
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
     "ojs/ojarraytabledatasource",
     "ojs/ojtable",
     "ojs/ojmenu",
     "ojs/ojoption"
 ], function(oj, ko, $, viewSweepLogModel, ResourceBundle) {
     "use strict";

     /** Sweep Log details.
      * It allows user to view sweep log details in a tabular format. Sweep Types can be  of executed, exception and upcoming.
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
      * @return {Function} Function.
      * @return {Object} GetNewKoModel.
      */
     return function(rootParams) {
         const self = this;

         self.resource = ResourceBundle;
         self.fetchedSweepLogList = ko.observableArray();
         self.sweepLogDetailsDataSource = ko.observable();
         self.sweepType = ko.observable("P");
         self.toDate = ko.observable();
         self.fromDate = ko.observable();
         self.currentDate = ko.observable();
         self.sweepLogLoaded = ko.observable(false);

         let sweepLogDetailsArray = [], sweepDetailsArray = [];

         self.menuItems = ko.observableArray();
         rootParams.baseModel.registerComponent("view-sweep-log", "liquidity-management");
         rootParams.baseModel.registerElement("date-time");

         self.selectedSweepStatus = ko.observable("Upcoming");

         const today = rootParams.baseModel.getDate(),
             todayToLocalIso = oj.IntlConverterUtils.dateToLocalIso(today),
             upcomingToDateToLocalIso = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate().setMonth(today.getMonth() + 1)),
             executeExceptionFromDateToLocalIso = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate().setMonth(today.getMonth() - 5));

         viewSweepLogModel.getUpcomingSweepLogDetails({
             fromDate: todayToLocalIso,
             toDate: upcomingToDateToLocalIso
         }).then(function(data) {

              sweepDetailsArray = data.jsonNode.scheduledSweepsDTO;

              sweepDetailsArray.sort(function(left, right) {
              return left.nextRunDate === right.nextRunDate ? 0 : left.nextRunDate < right.nextRunDate ? -1 : 1;
              });

             if (sweepDetailsArray.length) {
                 if (sweepDetailsArray.length > 5) {
                     for (let i = 0; i <= 4; i++) {
                         self.fetchedSweepLogList.push(sweepDetailsArray[i]);
                     }
                 } else {
                     for (let i = 0; i < sweepDetailsArray.length; i++) {
                         self.fetchedSweepLogList.push(sweepDetailsArray[i]);
                     }
                 }

                 sweepLogDetailsArray = $.map(self.fetchedSweepLogList(), function(response) {
                     return {
                         datetime: response.nextRunDate,
                         instructionDesc: response.instructionDesc,
                         structureId: response.accStrId,
                         structureDesc: response.accStrDesc,
                         sourceAccount: response.accNo.displayValue,
                         destinationAccount: response.parentAccNo.displayValue,
                         sortDate:new Date(response.nextRunDate)
                     };
                 });

                 self.sweepLogDetailsDataSource(new oj.ArrayTableDataSource(sweepLogDetailsArray || []));

             }

                 self.sweepLogLoaded(data.jsonNode.scheduledSweepsDTO.length);
         });

         /**
          * This function is used to fetch details on the dashboard for sweeplog of executed and exception type.
          *
          * @memberOf sweep-log
          * @function  fetchExecutedAndExceptionSweepData
          * @returns {void}
          */
         function fetchExecutedAndExceptionSweepData(sweepType) {
             self.fetchedSweepLogList.removeAll();
             sweepLogDetailsArray = [];
             sweepDetailsArray =[];

             viewSweepLogModel.getSweepLogDetails({
                     fromDate: executeExceptionFromDateToLocalIso,
                     toDate: todayToLocalIso,
                     filter : sweepType
                 }).then(function(data) {

                  sweepDetailsArray = data.jsonNode.sweepLogList;

                  sweepDetailsArray.sort(function(left, right) {
                  return left.valueDate === right.valueDate ? 0 : left.valueDate < right.valueDate ? 1 : -1;
                  });

                 if (sweepDetailsArray.length) {
                     if (data.jsonNode.sweepLogList.length > 5) {
                         for (let j = sweepDetailsArray.length - 1; j >= sweepDetailsArray.length - 5; j--) {
                             self.fetchedSweepLogList.push(sweepDetailsArray[j]);
                         }
                     } else {
                         for (let j = sweepDetailsArray.length -1; j >=0; --j) {
                             self.fetchedSweepLogList.push(sweepDetailsArray[j]);
                         }
                     }

                     sweepLogDetailsArray = $.map(self.fetchedSweepLogList(), function(response) {
                         if (sweepLogDetailsArray) {
                             return {
                                 date: response.valueDate,
                                 datetime: response.timeStamp,
                                 instructionDesc: response.instructionDetailsId,
                                 structureId: response.accStrId,
                                 structureDesc: response.structureDescription,
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
                                 sortDate:new Date(response.timeStamp)
                             };
                         }
                     });

                     self.sweepLogDetailsDataSource(new oj.ArrayTableDataSource(sweepLogDetailsArray) || []);
                 }

                  self.sweepLogLoaded(data.jsonNode.sweepLogList.length);
             });

              self.sweepType(sweepType);
         }

         /**
          * This function is used to fetch details on the dashboard for sweeplog of upcoming type.
          *
          * @memberOf sweep-log
          * @function  fetchUpcomingSweepData
          * @returns {void}
          */
         function fetchUpcomingSweepData() {
             self.fetchedSweepLogList.removeAll();
             sweepLogDetailsArray = [];
             sweepDetailsArray=[];

             viewSweepLogModel.getUpcomingSweepLogDetails({
                 fromDate: todayToLocalIso,
                 toDate: upcomingToDateToLocalIso
             }).then(function(data) {

                sweepDetailsArray = data.jsonNode.scheduledSweepsDTO;

                sweepDetailsArray.sort(function(left, right) {
                return left.nextRunDate === right.nextRunDate ? 0 : left.nextRunDate < right.nextRunDate ? -1 : 1;
                });

                 if (sweepDetailsArray.length) {
                     if (sweepDetailsArray.length > 5) {
                         for (let i = 0; i <= 4; i++) {
                             self.fetchedSweepLogList.push(sweepDetailsArray[i]);
                         }
                     } else {
                         for (let i = 0; i < data.jsonNode.scheduledSweepsDTO.length; i++) {
                             self.fetchedSweepLogList.push(sweepDetailsArray[i]);
                         }
                     }

                     sweepLogDetailsArray = $.map(self.fetchedSweepLogList(), function(response) {
                         return {
                             instructionDesc: response.instructionDesc,
                             datetime: response.nextRunDate,
                             structureId: response.accStrId,
                             structureDesc: response.accStrDesc,
                             sourceAccount: response.accNo.displayValue,
                             destinationAccount: response.parentAccNo.displayValue,
                             sortDate:new Date(response.nextRunDate)
                         };
                     });

                     self.sweepLogDetailsDataSource(new oj.ArrayTableDataSource(sweepLogDetailsArray) || []);

                 }

                 self.sweepLogLoaded(data.jsonNode.scheduledSweepsDTO.length);
             });

             self.sweepType("P");
         }

         self.menuItems = [{
             id: "pdf",
             value: self.resource.download.pdf
         }, {
             id: "csv",
             value: self.resource.download.csv
         }];

         /**
          * This function will be used to open the menu option from the download option.
          *
          * @memberOf sweep-log
          * @function openDownloadMenu
          * @param {Object} event - To be used to capture the event.
          * @returns {void}
          */
         self.openDownloadMenu = function(event) {
             $("#menuLauncher-downloadMenu-contents").ojMenu("open", event);
         };

         /**
          * This function is used to fetch details on the dashboard for sweeplog based on sweep type.
          *
          * @memberOf sweep-log
          * @function  sweepStatusChanged
          * @param {Object} data - Holding the value of the selected element.
          * @returns {void}
          */
         self.sweepStatusChanged = function(data) {
             if (data.detail.value === "Executed" || data.detail.value === "Exception") {
                 fetchExecutedAndExceptionSweepData(data.detail.value === "Executed" ? "S" : "E");
             } else if (data.detail.value === "Upcoming") {
                 fetchUpcomingSweepData();
             }
         };

         /**
          * This function is used to refresh sweep details in dashboard to fetch latest details.
          *
          * @memberOf sweep-log
          * @function  refreshTable
          * @returns {void}
          */
         self.refreshTable = function() {
             if (self.sweepType() === "E" || self.sweepType() === "S") {
                 fetchExecutedAndExceptionSweepData(self.sweepType());
             } else if (self.sweepType() === "P") {
                 fetchUpcomingSweepData();
             }
         };

         /**
          * This function is used to navigate to sweep log details screen.
          *
          * @memberOf sweep-log
          * @function  viewAll
          * @returns {void}
          */
         self.viewAll = function() {
             rootParams.dashboard.loadComponent("view-sweep-log");
         };

         /**
          * This function is used to download sweep log details in pdf format based on sweep status type.
          *
          * @memberOf sweep-log
          * @function  downloadStatement
          * @param {Object} event - Selected type of download.
          * @returns {void}
          */
         self.downloadStatement = function(event) {
             if (self.sweepType() === "P" && event.target.value === "pdf") {
                 $("#passwordDialog").trigger("openModal");

                 viewSweepLogModel.fetchUpcomingPDF({
                     fromDate: todayToLocalIso,
                     toDate: upcomingToDateToLocalIso
                 });
             } else if (self.sweepType() === "P" && event.target.value === "csv") {
                 viewSweepLogModel.fetchUpcomingCSV({
                     fromDate: todayToLocalIso,
                     toDate: upcomingToDateToLocalIso
                 });
             } else if ((self.sweepType() === "E" || self.sweepType() === "S") && event.target.value === "pdf") {
                 $("#passwordDialog").trigger("openModal");

                 viewSweepLogModel.fetchPDF({
                     fromDate: executeExceptionFromDateToLocalIso,
                     toDate: todayToLocalIso,
                     filter : self.sweepType()
                 });
             } else if ((self.sweepType() === "E" || self.sweepType() === "S") && event.target.value === "csv") {
                 viewSweepLogModel.fetchCSV({
                     fromDate: executeExceptionFromDateToLocalIso,
                     toDate: todayToLocalIso,
                     filter : self.sweepType()
                 });
             }
         };

         /**
          * This function is used to close the modal window info for password notification.
          *
          * @memberOf sweep-log
          * @function  closeModal
          * @returns {void}
          */
         self.closeModal = function() {
             $("#passwordDialog").trigger("closeModal");
         };
     };
 });