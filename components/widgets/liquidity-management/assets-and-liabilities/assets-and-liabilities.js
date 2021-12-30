 /**
  * assets-and-liabilities component helps to show asset and liablity details of a particular currency in chart form
  * @module liquidity-management
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} currencyAssetModel
  * @requires {object} ResourceBundle
  */
 define([
     "knockout",
     "./model",
     "ojL10n!resources/nls/assets-and-liabilities",
     "ojs/ojknockout-validation",
     "ojs/ojbutton",
     "ojs/ojchart"
 ], function(ko, currencyAssetModel, ResourceBundle) {
     "use strict";

     /**
      * Assets-and-liabilities
      * It allows user to view the assesta and liabilities of a currency in bar chart form.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values
      * @return {Function} function
      * @return {Object} getNewKoModel
      */
     return function(rootParams) {
         const self = this;

         ko.utils.extend(self, rootParams.rootModel);
         self.resource = ResourceBundle;
         self.currencyList = ko.observableArray();
         self.refreshChart = ko.observable();
         self.isCurrencyListLoaded = ko.observable();
         self.exchangeRateNotMaintained = ko.observable();
         self.netPositions = ko.observable();
         self.barSeriesValue = ko.observableArray();
         self.selectedEquivalentCurrency = ko.observable();

         let accountList;
         const uniqueBarnchCurrencies = [],
             batchRequest = {};

         Promise.all([currencyAssetModel.fetchAccounts(), currencyAssetModel.fetchCurrencyList(), currencyAssetModel.fetchBankConfig()]).then(function(response) {
             self.selectedEquivalentCurrency(response[2].bankConfigurationDTO.localCurrency);

             if (response[0].jsonNode && response[0].jsonNode.accountList) {
                 accountList = response[0].jsonNode.accountList;

                 for (let i = 0; i < accountList.length; i++) {
                     if (uniqueBarnchCurrencies.indexOf(accountList[i].accountKey.branchCodeId + "-" + accountList[i].accountKey.ccyId) < 0) {
                         uniqueBarnchCurrencies.push(accountList[i].accountKey.branchCodeId + "-" + accountList[i].accountKey.ccyId);
                     }
                 }
             }

             response[1].jsonNode.ccyListLov.forEach(function(currency) {
                 self.currencyList.push({
                     text: currency.ccyCode,
                     value: currency.ccyCode
                 });
             });

             self.currencyChangedHandler({
                 detail: {
                     value: self.selectedEquivalentCurrency()
                 }
             });

             self.isCurrencyListLoaded(true);
         });

         /**
          * This function is used to compute assets and liabilities.
          *
          * @memberOf assets-and-liabilities
          * @function  computeAssetsAndLiabilities
          * @param {string} selectedCurrency - Selected currency.
          * @param {Object} exchangeRates - Exchange rates.
          * @returns {void}
          */
         function computeAssetsAndLiabilities(selectedCurrency, exchangeRates) {
             self.barSeriesValue([{
                     name: self.resource.labels.assets,
                     items: [{
                         value: 0
                     }]
                 },
                 {
                     name: self.resource.labels.liabilities,
                     items: [{
                         value: 0
                     }]
                 }
             ]);

             for (let i = 0; i < accountList.length; i++) {
                 if (!exchangeRates[accountList[i].accountKey.branchCodeId + "-" + accountList[i].accountKey.ccyId] && selectedCurrency !== accountList[i].accountKey.ccyId) {
                     self.exchangeRateNotMaintained(true);
                     self.barSeriesValue([]);
                     break;
                 }

                 if ((accountList[i].currentBalance || 0) > 0) {
                     self.barSeriesValue()[0].items[0].value += (accountList[i].currentBalance || 0) * (exchangeRates[accountList[i].accountKey.branchCodeId + "-" + accountList[i].accountKey.ccyId] || 1);
                 } else {
                     self.barSeriesValue()[1].items[0].value -= (accountList[i].currentBalance || 0) * (exchangeRates[accountList[i].accountKey.branchCodeId + "-" + accountList[i].accountKey.ccyId] || 1);
                 }
             }

             if (self.barSeriesValue().length) {
                 self.netPositions({
                     amount: self.barSeriesValue()[0].items[0].value - self.barSeriesValue()[1].items[0].value,
                     currency: selectedCurrency
                 });
             } else {
                 self.netPositions(null);
             }

             self.refreshChart(true);
         }

         self.currencyChangedHandler = function(event) {
             if (event.detail.value) {
                 self.exchangeRateNotMaintained(false);
                 batchRequest.batchDetailRequestList = [];

                 for (let i = 0; i < uniqueBarnchCurrencies.length; i++) {
                     const branchCurrency = uniqueBarnchCurrencies[i].split("-");

                     if (branchCurrency[1] !== event.detail.value) {
                         batchRequest.batchDetailRequestList.push({
                             methodType: "GET",
                             uri: {
                                 value: "/forex/rates?branchCode=" + branchCurrency[0] + "&ccy1Code=" + branchCurrency[1] + "&ccy2Code=" + event.detail.value
                             },
                             headers: {
                                 "Content-Id": i,
                                 "Content-Type": "application/json"
                             }
                         });
                     }
                 }

                 if (batchRequest.batchDetailRequestList.length) {
                     currencyAssetModel.fireBatch(batchRequest).done(function(data) {
                         const exchangeRates = {};

                         for (let i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                             const details = data.batchDetailResponseDTOList[i].responseObj;

                             if (details.exchangeRateDetails) {
                                 exchangeRates[details.exchangeRateKey.branchCode + "-" + details.exchangeRateKey.ccy1Code] = details.exchangeRateDetails[0].midRate;
                             }
                         }

                         computeAssetsAndLiabilities(event.detail.value, exchangeRates);
                     });
                 } else {
                     computeAssetsAndLiabilities(event.detail.value, {});
                 }

             }
         };
     };
 });