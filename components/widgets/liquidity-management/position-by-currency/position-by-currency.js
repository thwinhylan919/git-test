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
     "ojL10n!resources/nls/position-by-currency",
     "ojs/ojknockout-validation",
     "ojs/ojbutton",
     "ojs/ojpagingtabledatasource",
     "ojs/ojarraytabledatasource",
     "ojs/ojarraydataprovider",
     "ojs/ojpagingcontrol",
     "ojs/ojtable"
 ], function(oj, ko, $, currencyPositionModel, ResourceBundle) {
     "use strict";

     /**
      * Position-wise-currency details.
      * It allows user to view currency position in a tabular format.
      *
      * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
      * @return {Function} Function.
      * @return {Object} GetNewKoModel.
      *
      */
     return function(rootParams) {
         const self = this;

         self.resource = ResourceBundle;

         const currencyBalanceMap = [];

         self.currencyPositionDetailsDataSource = ko.observable();
         self.isCurrencyListLoaded = ko.observable(false);
         self.selectedCurrency = ko.observable();
         self.accountsDataProvider = ko.observable();
         self.balanceMap = {};

         rootParams.baseModel.registerComponent("list-structure", "liquidity-management");
         rootParams.baseModel.registerComponent("create-structure", "liquidity-management");
         rootParams.baseModel.registerElement(["modal-window"]);

         currencyPositionModel.fetchAccount().then(function(response) {
             const accountListresponse = response;

             if (accountListresponse.jsonNode.accountList) {

                 $.map(accountListresponse.jsonNode.accountList, function(accountDetails) {
                     if (self.balanceMap[accountDetails.accountKey.ccyId] && (accountDetails.currentBalance || accountDetails.isExtAccChk)) {
                         self.balanceMap[accountDetails.accountKey.ccyId].amount += accountDetails.isExtAccChk ? accountDetails.currentBalance : accountDetails.currentBalance || 0;

                         self.balanceMap[accountDetails.accountKey.ccyId].accounts.push({
                             partyName: accountDetails.customerDesc,
                             accountNo: accountDetails.accountKey.accountNo.displayValue,
                             isExtAccChk: accountDetails.isExtAccChk,
                             balance: {
                                 amount: accountDetails.isExtAccChk ? accountDetails.currentBalance : accountDetails.currentBalance || 0,
                                 currency: accountDetails.accountKey.ccyId
                             }
                         });
                     } else if (accountDetails.currentBalance || accountDetails.isExtAccChk) {
                         self.balanceMap[accountDetails.accountKey.ccyId] = {
                             amount: accountDetails.isExtAccChk ? accountDetails.currentBalance : accountDetails.currentBalance || 0,
                             accounts: [{
                                 partyName: accountDetails.customerDesc,
                                 accountNo: accountDetails.accountKey.accountNo.displayValue,
                                 isExtAccChk: accountDetails.isExtAccChk,
                                 balance: {
                                     amount: accountDetails.isExtAccChk ? accountDetails.currentBalance : accountDetails.currentBalance || 0,
                                     currency: accountDetails.accountKey.ccyId
                                 }
                             }]
                         };
                     }
                 });

                 const keys = Object.keys(self.balanceMap);

                 for (let i = 0; i < keys.length; i++) {
                     currencyBalanceMap.push({
                         currency: keys[i],
                         balance: self.balanceMap[keys[i]].amount,
                         accounts: self.balanceMap[keys[i]].accounts
                     });
                 }
             }

             self.currencyPositionDetailsDataSource(new oj.ArrayTableDataSource(currencyBalanceMap || []));
             self.isCurrencyListLoaded(true);

         });

         self.showAccounts = function(data) {
             self.selectedCurrency(data.currency);
             self.accountsDataProvider(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(data.accounts || [])));
             $("#currency-accounts").trigger("openModal");
         };

         self.closeModal = function() {
             $("#currency-accounts").trigger("closeModal");
             self.accountsDataProvider(null);
         };
     };
 });