 /**
  * position-wise-currency component helps to fetch details of the postion of currency based on accounts
  * and cumilitive balance of a specific currency
  *
  * @module liquidity-management
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} currencyPositionModel
  * @requires {object} ResourceBundle
  */
 define([
     "ojs/ojcore",
     "knockout",
     "jquery",
     "./model",
     "ojL10n!resources/nls/position-by-region",
     "load!./world.json",
     "ojs/ojthematicmap",
     "ojs/ojselectcombobox",
     "ojs/ojpagingtabledatasource",
     "ojs/ojarraytabledatasource",
     "ojs/ojarraydataprovider",
     "ojs/ojpagingcontrol",
     "ojs/ojtable"
 ], function (oj, ko, $, Model, ResourceBundle, JSONData) {
     "use strict";

     /**
      * Position by region details.
      * It allows user to view position of the organization by region.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
      * @return {Function} Function.
      */
     return function (rootParams) {
         const self = this;

         self.resource = ResourceBundle;
         self.areaData = ko.observableArray();
         self.mapProvider = ko.observable();
         self.selectedCountry = ko.observable();
         self.markers = ko.observableArray();
         self.currencyList = ko.observableArray();
         self.showMap = ko.observable(false);
         self.currenciesLoaded = ko.observable();
         self.positionByRegionDataProvider = ko.observable();
         self.selectedRegionAccountsDataProvider = ko.observable();
         self.exchangeRateNotMaintained = ko.observable(false);
         self.selectedCountryBusinessData = ko.observable();
         self.selectedEquivalentCurrency = ko.observable("");
         self.selectedRegionAccountCurrencies = ko.observableArray();
         self.selectedRegionAccountCurrency = ko.observable();
         rootParams.baseModel.registerElement(["modal-window"]);

         let loadAmountTemplate = false,
             accountList,
             strigifiedWorld,
             selectedRegionPosition,
             countryBalanceMap = {};
         const geo = {
                 type: "FeatureCollection",
                 crs: {
                     type: "name",
                     properties: {
                         name: "urn:ogc:def:crs:EPSG::3395"
                     }
                 }
             },
             uniqueBarnchCurrencies = [],
             batchRequest = {
                 batchDetailRequestList: []
             };

         function fetchWorldJSON() {
             return new Promise(function (resolve) {
                 resolve(JSONData);
             });
         }

         /**
          * This function will populate area data.
          *
          * @memberOf position-by-region
          * @function  populateAreaData
          * @returns {void}
          */
         function populateAreaData() {
             fetchWorldJSON().then(function (world) {
                 for (let i = 0; i < world.features.length; i++) {
                     world.features[i].properties.name_long = self.resource.worldCountries[world.features[i].properties.iso_a3];
                 }

                 strigifiedWorld = JSON.stringify(world);

                 const handler = new oj.ColorAttributeGroupHandler();

                 for (let i = 0; i < world.features.length; i++) {

                     const id = world.features[i].properties.iso_a3;

                     self.areaData.push({
                         id: id,
                         color: handler.getValue(id),
                         location: id
                     });
                 }

                 self.mapProvider({
                     geo: world,
                     propertiesKeys: {
                         id: "iso_a3",
                         shortLabel: "iso_a3",
                         longLabel: "name_long"
                     }
                 });
             });
         }

         /**
          * This function is used to compute account balances.
          *
          * @memberOf position-by-region
          * @function  computeAccountBalances
          * @param {string} selectedCurrency - Selected currency.
          * @param {Object} exchangeRates - Exchange rates.
          * @returns {void}
          */
         function computeAccountBalances(selectedCurrency, exchangeRates) {
             const positionByRegionData = [];
             let businessCountryCodes = [];

             countryBalanceMap = {};

             for (let i = 0; i < accountList.length; i++) {
                 const accountDetails = accountList[i];

                 if (!exchangeRates[accountDetails.accountKey.branchCodeId + "-" + accountDetails.accountKey.ccyId] && accountDetails.accountKey.ccyId !== selectedCurrency) {
                     countryBalanceMap = {};
                     self.exchangeRateNotMaintained(true);
                     break;
                 }

                 if (!countryBalanceMap[accountDetails.country]) {
                     countryBalanceMap[accountDetails.country] = {
                         amount: (accountDetails.isExtAccChk ? accountDetails.currentBalance : accountList[i].currentBalance || 0) * (exchangeRates[accountDetails.accountKey.branchCodeId + "-" + accountDetails.accountKey.ccyId] || 1),
                         currency: selectedCurrency
                     };
                 } else {
                     countryBalanceMap[accountDetails.country].amount += (accountDetails.isExtAccChk ? accountDetails.currentBalance : accountList[i].currentBalance || 0) * (exchangeRates[accountDetails.accountKey.branchCodeId + "-" + accountDetails.accountKey.ccyId] || 1);
                 }

                 if (uniqueBarnchCurrencies.indexOf(accountDetails.accountKey.branchCodeId + "-" + accountDetails.accountKey.ccyId) < 0) {
                     uniqueBarnchCurrencies.push(accountDetails.accountKey.branchCodeId + "-" + accountDetails.accountKey.ccyId);
                 }
             }

             if (!self.areaData().length) {
                 populateAreaData();
             }

             businessCountryCodes = Object.keys(countryBalanceMap);

             for (let i = 0; i < businessCountryCodes.length; i++) {
                 positionByRegionData.push({
                     amount: countryBalanceMap[businessCountryCodes[i]],
                     country: self.resource.worldCountries[businessCountryCodes[i]]
                 });

                 self.markers.push({
                     id: businessCountryCodes[i],
                     location: businessCountryCodes[i],
                     country: self.resource.worldCountries[businessCountryCodes[i]],
                     shortDesc: self.resource.worldCountries[businessCountryCodes[i]],
                     amount: countryBalanceMap[businessCountryCodes[i]]
                 });
             }

             self.positionByRegionDataProvider(new oj.ArrayDataProvider(positionByRegionData || []));
             self.showMap(true);
         }

         self.showSelectedRegionPosition = function (currency) {
             self.selectedRegionAccountCurrency(currency);
             $("#selectedRegionAccounts").trigger("openModal");
         };

         self.closeModal = function () {
             $("#selectedRegionAccounts").trigger("closeModal");
         };

         Promise.all([Model.fetchCurrencyList(), Model.fetchAccounts(), fetchWorldJSON(), Model.fetchBankConfig()]).then(function (response) {
             self.selectedEquivalentCurrency(response[3].bankConfigurationDTO.localCurrency);

             const currencyResponse = response[0],
                 data = response[1];

             currencyResponse.jsonNode.ccyListLov.forEach(function (currency) {
                 self.currencyList.push({
                     text: currency.ccyCode,
                     value: currency.ccyCode
                 });
             });

             if (data.jsonNode && data.jsonNode.accountList) {
                 accountList = data.jsonNode.accountList;

                 for (let i = 0; i < accountList.length; i++) {
                     if (uniqueBarnchCurrencies.indexOf(accountList[i].accountKey.branchCodeId + "-" + accountList[i].accountKey.ccyId) < 0) {
                         uniqueBarnchCurrencies.push(accountList[i].accountKey.branchCodeId + "-" + accountList[i].accountKey.ccyId);
                     }
                 }
             }

             self.equivalentCurrencyChangedHandler({
                 detail: {
                     value: self.selectedEquivalentCurrency()
                 }
             });

             self.currenciesLoaded(true);
         });

         self.rendererFunc = function (context) {
             return oj.KnockoutTemplateUtils.getRenderer(loadAmountTemplate ? "country_name_amount" : "country_name")(context);
         };

         self.selectedRegionEquivalentCurrencyChangedHandler = function (event) {
             if (event.detail.value) {

                 const selectedCurrencyPosition = ko.utils.arrayFirst(selectedRegionPosition, function (element) {
                     return event.detail.value === element.amount.currency;
                 });

                 self.selectedRegionAccountsDataProvider(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(selectedCurrencyPosition.accounts || [])));
             }
         };

         self.equivalentCurrencyChangedHandler = function (event) {
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
                     Model.fireBatch(batchRequest).done(function (data) {
                         const exchangeRates = {};

                         for (let i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                             const details = data.batchDetailResponseDTOList[i].responseObj;

                             if (details.exchangeRateDetails) {
                                 exchangeRates[details.exchangeRateKey.branchCode + "-" + details.exchangeRateKey.ccy1Code] = details.exchangeRateDetails[0].midRate;
                             }

                         }

                         computeAccountBalances(event.detail.value, exchangeRates);
                     });

                 } else {
                     computeAccountBalances(event.detail.value, {});
                 }
             }
         };

         /**
          * This function is used to compute account balances.
          *
          * @memberOf position-by-region
          * @function  populateSelectedCountryBusinessData
          * @param {string} countryCode - Selected country code.
          * @returns {void}
          */
         function populateSelectedCountryBusinessData(countryCode) {
             selectedRegionPosition = [];

             const currencies = {};

             self.selectedRegionAccountCurrencies([]);

             for (let i = 0; i < accountList.length; i++) {
                 if (accountList[i].country === countryCode) {
                     if (currencies[accountList[i].accountKey.ccyId] === undefined) {
                         currencies[accountList[i].accountKey.ccyId] = selectedRegionPosition.length;

                         self.selectedRegionAccountCurrencies.push({
                             label: accountList[i].accountKey.ccyId,
                             value: accountList[i].accountKey.ccyId
                         });

                         selectedRegionPosition.push({
                             count: 1,
                             amount: {
                                 amount: accountList[i].isExtAccChk ? accountList[i].currentBalance : accountList[i].currentBalance || 0,
                                 currency: accountList[i].accountKey.ccyId
                             },
                             accounts: [{
                                 partyName: accountList[i].customerDesc,
                                 accountNo: accountList[i].accountKey.accountNo.displayValue,
                                 branchId: accountList[i].accountKey.branchCodeId,
                                 currency: accountList[i].accountKey.ccyId,
                                 isExtAccChk: accountList[i].isExtAccChk,
                                 balance: {
                                     amount: accountList[i].isExtAccChk ? accountList[i].currentBalance : accountList[i].currentBalance || 0,
                                     currency: accountList[i].accountKey.ccyId
                                 }
                             }]
                         });
                     } else {
                         const index = currencies[accountList[i].accountKey.ccyId];

                         selectedRegionPosition[index].count++;
                         selectedRegionPosition[index].amount.amount += accountList[i].isExtAccChk ? accountList[i].currentBalance : accountList[i].currentBalance || 0;

                         selectedRegionPosition[index].accounts.push({
                             partyName: accountList[i].customerDesc,
                             accountNo: accountList[i].accountKey.accountNo.displayValue,
                             branchId: accountList[i].accountKey.branchCodeId,
                             currency: accountList[i].accountKey.ccyId,
                             isExtAccChk: accountList[i].isExtAccChk,
                             balance: {
                                 amount: accountList[i].isExtAccChk ? accountList[i].currentBalance : accountList[i].currentBalance || 0,
                                 currency: accountList[i].accountKey.ccyId
                             }
                         });
                     }
                 }
             }

             self.selectedCountryBusinessData({
                 country: self.resource.worldCountries[countryCode],
                 dataProvider: new oj.ArrayDataProvider(selectedRegionPosition || [])
             });
         }

         self.selectedCountry.subscribe(function (newValue) {
             if (newValue.length && newValue.length === 1) {
                 if (countryBalanceMap[newValue[0]]) {
                     loadAmountTemplate = true;
                     self.selectedRegionAccountCurrency(null);
                     populateSelectedCountryBusinessData(newValue[0]);

                     geo.features = [ko.utils.arrayFirst(JSON.parse(strigifiedWorld).features, function (country) {
                         return country.properties.iso_a3 === newValue[0];
                     })];

                     self.mapProvider({
                         geo: geo,
                         propertiesKeys: {
                             id: "iso_a3",
                             shortLabel: "iso_a3",
                             longLabel: "name_long"
                         }
                     });
                 }
             } else {
                 loadAmountTemplate = false;
                 self.selectedCountryBusinessData(null);
                 ko.tasks.runEarly();

                 self.mapProvider({
                     geo: JSON.parse(strigifiedWorld),
                     propertiesKeys: {
                         id: "iso_a3",
                         shortLabel: "iso_a3",
                         longLabel: "name_long"
                     }
                 });

             }
         });

     };
 });