 /**
  * cross-border-sweeps component helps to list out top five cross border currency for executed sweeps in LM dashboard.
  * @module liquidity-management
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} crossBorderSweepCurrencyMappingModel
  * @requires {object} ResourceBundle
  */
 define([
     "ojs/ojcore",
     "knockout",
     "./model",
     "ojL10n!resources/nls/cross-border-sweeps",
     "ojs/ojknockout-validation",
     "ojs/ojbutton",
     "ojs/ojarraytabledatasource",
     "ojs/ojtable"
 ], function(oj, ko, crossBorderSweepCurrencyMappingModel, ResourceBundle) {
     "use strict";

     /**
      * Cross-border-sweeps details.
      * It allows user to view top five sweep positions in a tabular format.
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
         self.crossBorderCurrencyDetailsDataSource = ko.observable();
         self.iscurrencyLoaded = ko.observable(false);
         self.isDataloaded = ko.observable(false);
         self.fromDate = ko.observable();
         self.toDate = ko.observable();
         self.selectedEquivalentCurrency = ko.observable();
         self.crossBorderCurrencyDetailsArray = ko.observableArray();

         self.fromDate(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));

         const toDate = rootParams.baseModel.getDate(),
             toDateForExceptionAndExecuted = rootParams.baseModel.getDate(),
             fromDateMonthExecuted = toDateForExceptionAndExecuted.getMonth() - 5;

         queryParams.toDate = self.fromDate();
         queryParams.fromDate = oj.IntlConverterUtils.dateToLocalIso(toDate.setMonth(fromDateMonthExecuted));

         /**
          * This function is used to fetch details of latest cross sweep details based on currency selection.
          *
          * @memberOf cross-border-sweeps
          * @function  fetchCrossCurrencyDetails
          * @returns {void}
          */
         function fetchCrossCurrencyDetails() {
             self.isDataloaded(false);

             const crossBorderCurrencyDetailsArray = [];

             self.crossBorderCurrencyDetailsArray([]);

             crossBorderSweepCurrencyMappingModel.fetchCrossBorderCurrency(queryParams).then(function(data) {
                 data.jsonNode.sweepLogList.forEach(function(element) {
                     crossBorderCurrencyDetailsArray.push({
                         structure: element.structureDescription,
                         sweepOutAmount: element.sweepAmount,
                         sweepOutCurrency: element.childAccountCcy,
                         sweepInAmount: element.sweepAmount,
                         sweepInCurrency: element.parentAccountCcy,
                         exchangeRate: element.fxRate
                     });
                 });

                if(crossBorderCurrencyDetailsArray.length){

                  crossBorderCurrencyDetailsArray.sort(function(left, right) {
                  return left.sweepInAmount === right.sweepInAmount ? 0 : left.sweepInAmount < right.sweepInAmount ? 1 : -1;
                  });

                }

                if (crossBorderCurrencyDetailsArray.length > 5) {
                     for (let i = 0; i <= 4; i++) {
                         self.crossBorderCurrencyDetailsArray.push(crossBorderCurrencyDetailsArray[i]);
                     }
                 } else {
                     for (let i = 0; i < crossBorderCurrencyDetailsArray.length; i++) {
                         self.crossBorderCurrencyDetailsArray.push(crossBorderCurrencyDetailsArray[i]);
                     }
                 }

                 self.crossBorderCurrencyDetailsDataSource(new oj.ArrayTableDataSource(self.crossBorderCurrencyDetailsArray() || []));
                 self.isDataloaded(true);
             });
         }

         Promise.all([crossBorderSweepCurrencyMappingModel.fetchCurrencyList(), crossBorderSweepCurrencyMappingModel.fetchBankConfig()]).then(function(response) {
             self.selectedEquivalentCurrency(response[1].bankConfigurationDTO.localCurrency);

             response[0].jsonNode.ccyListLov.forEach(function(currency) {
                 self.currencyList.push({
                     text: currency.ccyCode,
                     value: currency.ccyCode
                 });
             });

             queryParams.toAccCcy = self.selectedEquivalentCurrency();
             self.iscurrencyLoaded(true);
             fetchCrossCurrencyDetails();
         });

         /**
          * This function is used to fetch details of latest cross sweep details based on currency selection.
          *
          * @memberOf cross-border-sweeps
          * @function  currencyChangedHandler
          * @param {Object} event - Selected currency to fetch sweep details.
          * @returns {void}
          */
         self.currencyChangedHandler = function(event) {
             if (event.target.value) {
                 queryParams.toAccCcy = event.target.value ? event.target.value : self.currencyList()[0].value;
                 fetchCrossCurrencyDetails();
             }
         };
     };
 });