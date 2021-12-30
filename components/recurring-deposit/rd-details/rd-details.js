 /**
  * View Recurring Deposit Details.
  *
  * @module recurring-deposit
  * @requires {ojcore} oj instance of ojet
  * @requires {knockout} ko knockout instance
  * @requires {jquery} $ jquery instance
  * @requires {object} rdDetailsModel model instance
  * @requires {object} ResourceBundle resource bundle instance
  */
 define([

   "knockout",
   "./model",
   "ojL10n!resources/nls/rd-details",
   "ojs/ojbutton"
 ], function(ko, rdDetailsModel, ResourceBundle) {
   "use strict";

   /**
    * View Recurring Deposit Details.
    * It allows user to view the details of recurring deposit.
    * User can view account details such as customer id,holding pattern,branch address,account status and nomination status i.e if nominee is registered or not.
    * User can view deposit details such as start date,rate of interest,term,value date,charges,installment amount,total no of installment and next installment date.
    * User can view maturity details such as maturity date, amount and instruction. We can edit maturity instruction.
    *
    * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
    * @return {Function} Function.
    *
    */
   return function(rootParams) {
     const self = this;

     ko.utils.extend(self, rootParams.rootModel);
     self.resource = ResourceBundle;
     rootParams.dashboard.headerName(self.resource.rdDepositDetails.header.depositDetails);
     rootParams.baseModel.registerComponent("account-nickname", "accounts");
     rootParams.baseModel.registerElement(["page-section", "row","internal-account-input"]);
     self.detailsLoaded = ko.observable(false);
     self.selectedAccount = ko.observable(self.params.id ? self.params.id.value : null);
     self.rdViewDetails = ko.observable();
     self.payoutInstructions = ko.observableArray([]);
     self.viewDetails = ko.observable(false);
     rootParams.baseModel.registerComponent("rd-amend", "recurring-deposit");

     /**
      * This function is used display the tenure to user in proper format i.e n years ,n months .
      *
      * @memberOf rd-details
      * @function formatTenure
      * @returns {void}
      */
     self.formatTenure = function() {
       let year, month;

       if (self.rdViewDetails().tenure.years <= 1)
         {year = rootParams.baseModel.format(self.resource.rdDepositDetails.depositDetails.tenure.singular.year, {
           n: self.rdViewDetails().tenure.years
         });}
       else
         {year = rootParams.baseModel.format(self.resource.rdDepositDetails.depositDetails.tenure.plural.year, {
           n: self.rdViewDetails().tenure.years
         });}

       if (self.rdViewDetails().tenure.months <= 1)
         {month = rootParams.baseModel.format(self.resource.rdDepositDetails.depositDetails.tenure.singular.month, {
           n: self.rdViewDetails().tenure.months
         });}
       else
         {month = rootParams.baseModel.format(self.resource.rdDepositDetails.depositDetails.tenure.plural.month, {
           n: self.rdViewDetails().tenure.months
         });}

       return rootParams.baseModel.format(self.resource.rdDepositDetails.depositDetails.tenureDetail, {
         years: year,
         months: month
       });
     };

     /**
      * The rest will be called once the component is loaded and html will be loaded only after
      * receiving the rest response.
      * Rest response can be either successful or rejected
      *
      * @instance {object} rdDetailsModel
      * @param {string} selectedAccount  An string represent account id of selected account.
      * @returns {object} data  It represent details of RD account.
      */
     rdDetailsModel.fetchRdDetails(self.selectedAccount()).then(function(data) {
       self.rdViewDetails(data.termDepositDetails);

       rdDetailsModel.fetchpayoutInstructions(self.selectedAccount()).then(function(data) {
         self.payoutInstructions(data.payOutInstructions);

         let count = 0,
           bankURL;
         const totalPayout = data.payOutInstructions.length;

         for (let i = 0; i < data.payOutInstructions.length; i++) {
           if (data.payOutInstructions[i].type !== "E") {
             bankURL = "locations/branches?branchCode=" + data.payOutInstructions[i].branchId;

             rdDetailsModel.fetchBankDetails(bankURL).then(function(bankDetails) {
               self.payoutInstructions()[count].branchAddress = bankDetails.addressDTO[0].branchAddress.postalAddress;
               self.payoutInstructions()[count].branchName = bankDetails.addressDTO[0].branchName;
               count++;

               if (count === totalPayout) {
                 self.viewDetails(true);
               }
             });
           } else {
             bankURL = "financialInstitution/domesticClearingDetails/" + data.payOutInstructions[i].networkType + "/" + data.payOutInstructions[i].clearingCode;

             rdDetailsModel.fetchBankDetails(bankURL).then(function(domesticBankDetails) {
               self.payoutInstructions()[count].branchAddress = domesticBankDetails.branchAddress;
               self.payoutInstructions()[count].branchName = domesticBankDetails.name;
               count++;

               if (count === totalPayout) {
                 self.viewDetails(true);
               }
             });
           }
         }
       });

       self.detailsLoaded(true);
     });
   };
 });