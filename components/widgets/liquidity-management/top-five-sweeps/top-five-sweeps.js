 /**
  * top-five-sweeps component helps to list out top five cross border currency for executed sweeps in LM dashboard.
  * @module liquidity-management
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} topFiveSweepsModel
  * @requires {object} ResourceBundle
  */
 define([
     "ojs/ojcore",
     "knockout",
     "./model",
     "ojL10n!resources/nls/top-five-sweeps",
     "ojs/ojknockout-validation",
     "ojs/ojbutton",
     "ojs/ojarraytabledatasource",
     "ojs/ojoption",
     "ojs/ojtable",
     "ojs/ojchart"
 ], function(oj, ko, topFiveSweepsModel, ResourceBundle) {
     "use strict";

     /**
      * Top-five-sweeps details.
      * It allows user to view top five sweep positions in a bar format.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
      * @return {Function} Function.
      * @return {Object} GetNewKoModel.
      *
      */
     return function(rootParams) {
         const self = this,
             queryParams = {};

         self.currencyList = ko.observableArray();
         self.resource = ResourceBundle;
         self.barChartDataSource = ko.observableArray();
         self.iscurrencyLoaded = ko.observable(false);
         self.fromDate = ko.observable();
         self.toDate = ko.observable();
         self.selectedEquivalentCurrency = ko.observable();

         self.fromDate(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));

         const toDate = rootParams.baseModel.getDate(),
             toDateForExceptionAndExecuted = rootParams.baseModel.getDate(),
             fromDateMonthExecuted = toDateForExceptionAndExecuted.getMonth() - 5;

         queryParams.toDate = self.fromDate();
         queryParams.fromDate = oj.IntlConverterUtils.dateToLocalIso(toDate.setMonth(fromDateMonthExecuted));

         const barColor = "#006ab5";

         self.barGroupsValue = ko.observableArray();
         self.topfiveArray = ko.observableArray();

         /**
          * This function is used to fetch details of latest cross sweep details based on currency selection.
          *
          * @memberOf top-five-sweeps
          * @function  fetchCurrencyDetails
          * @returns {void}
          */
         function fetchCurrencyDetails() {

             const topFiveSweepDetailsArray = [];

             topFiveSweepsModel.fetchCurrency(queryParams).then(function(data) {
                 data.jsonNode.sweepLogList.forEach(function(element) {
                     topFiveSweepDetailsArray.push({
                         structure: element.paymentInititatedTimestamp,
                         sweepOutAmount: element.sweepAmount,
                         sweepOutCurrency: element.childAccountCcy,
                         sweepInAmount: element.sweepAmount,
                         sweepInCurrency: element.parentAccountCcy,
                         exchangeRate: element.fxRate,
                         amount: element.sweepAmount,
                         structureDescription: element.structureDescription
                     });
                 });

                 let barSeries = [];
                 const items = [],
                     barGroups = [];

                self.topfiveArray(topFiveSweepDetailsArray);

                 for (let i = 0; i < topFiveSweepDetailsArray.length; i++) {
                     items.push({
                         y: topFiveSweepDetailsArray[i].amount,
                         color: barColor
                     });

                     barGroups.push(topFiveSweepDetailsArray[i].structureDescription);
                 }

                 barSeries = [{
                     name: "Sweeps",
                     items: items
                 }];

                 self.barChartDataSource(barSeries);
                 self.barGroupsValue(barGroups);
             });
         }

         Promise.all([topFiveSweepsModel.fetchCurrencyList(), topFiveSweepsModel.fetchBankConfig()]).then(function(response) {
             self.selectedEquivalentCurrency(response[1].bankConfigurationDTO.localCurrency);

             response[0].jsonNode.ccyListLov.forEach(function(currency) {
                 self.currencyList.push({
                     text: currency.ccyCode,
                     value: currency.ccyCode
                 });
             });

             queryParams.toAccCcy = self.selectedEquivalentCurrency();
             self.iscurrencyLoaded(true);
             fetchCurrencyDetails();
         });

         /**
          * This function is used to fetch details of latest cross sweep details based on currency selection.
          *
          * @memberOf top-five-sweeps
          * @function  currencyChangedHandler
          * @param {Object} event - Selected currency to fetch sweep details.
          * @returns {void}
          */
         self.currencyChangedHandler = function(event) {
             if (event.target.value) {
                 queryParams.toAccCcy = event.target.value ? event.target.value : self.currencyList()[0].value;
                 fetchCurrencyDetails();
             }
         };
     };
 });