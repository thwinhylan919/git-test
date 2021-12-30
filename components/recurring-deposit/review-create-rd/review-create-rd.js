/**
 * New Reccuring Deposit Booking.
 *
 * @module recurring-deposit
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */
define([

  "knockout",
  "./model",
  "ojL10n!resources/nls/review-create-rd",
  "ojs/ojbutton"
], function(ko, recurringDepositModel,ResourceBundle) {
  "use strict";

  /** New Reccuring Deposit Booking.
   *
   *IT allows user review all the details entered to book Recurring Deposit.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   * @return {Object} GetNewKoModel.
   *
   */
  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.createRDModel = self.params.createRDModel;
    self.primaryAccHolder = self.params.primaryAccHolder;
    self.parties = self.params.parties;
    self.resource = ResourceBundle;
    rootParams.baseModel.registerElement(["page-section", "row", "confirm-screen","internal-account-input"]);
    rootParams.baseModel.registerComponent("review-add-edit-nominee", "nominee");
    rootParams.dashboard.headerName(self.resource.header.newRecurringDeposit);
    self.component = ko.observable("review-add-edit-nominee");

     /**
      * This function will validate all the details entered by user  for booking RD if all credentials are correct then
      *user is prompted to next screen for further processing.
      *
      * @memberOf create-rd
      * @function  newRdDeposit
      * @returns {void}
      */
     self.newRdDeposit = function() {
       const ignoreProp = [];

          if(!self.createRDModel.maturityAmount.amount && !self.createRDModel.maturityAmount.currency){
            ignoreProp.push("maturityAmount");
          }

          if (self.createRDModel.payoutInstructions[0].type === "I")
         {ignoreProp.push("address");}

       recurringDepositModel.openRd(ko.mapping.toJSON(self.createRDModel, {
         ignore: ignoreProp
       }), false).then(function(data) {
           const confirmScreenDetailsArray = [
             [{
                 label: self.resource.confirmScreenLabels.recurringDepositNumber,
                 value: data.termDepositDetails.id ? data.termDepositDetails.id.displayValue : null
               },
               {
                 label: self.resource.confirmScreenLabels.holdingPattern,
                 value: self.resource.depositDetail.holdingPatternType[self.createRDModel.holdingPattern]
               }
             ],
             [{
                 label: self.resource.depositDetail.depositTenure,
                 value: self.formatTenure()
               },
               {
                 label: self.resource.depositDetail.depositAmount,
                 value: {amount : self.createRDModel.principalAmount.amount,
currency : self.createRDModel.principalAmount.currency},
                 currency: true
               }
             ],
             [{
                 label: self.resource.maturityDetail.maturityInstruction,
                 value: self.resource.maturityDetail.rollOverType[self.createRDModel.rollOverType]
               },
               {
                 label: self.resource.maturityDetail.payTo,
                 value: self.resource.maturityDetail.payoutType[self.createRDModel.payoutInstructions[0].type]
               }
             ],
             [{
                 label: self.resource.maturityDetail.creditAccountNum,
                 value: [self.createRDModel.payoutInstructions[0].accountId.displayValue, self.createRDModel.payoutInstructions[0].account, self.createRDModel.payoutInstructions[0].beneficiaryName, self.createRDModel.payoutInstructions[0].bankName, self.createRDModel.payoutInstructions[0].address.line1, self.createRDModel.payoutInstructions[0].address.line2, self.createRDModel.payoutInstructions[0].address.city, self.createRDModel.payoutInstructions[0].address.country],
                 isInternalAccNo: self.createRDModel.payoutInstructions[0].type === "I"
               },
               {
                 label: self.resource.confirmScreenLabels.nomineeName,
                 value: self.addNomineeModel ? self.addNomineeModel.name : ""
               }
             ],
             [{
               label: self.resource.confirmScreenLabels.guardianName,
               value: self.addNomineeModel && self.addNomineeModel.guardian ? self.addNomineeModel.guardian.name : ""
             }]
           ];

           rootParams.dashboard.loadComponent("confirm-screen", {
             transactionResponse: data,
             transactionName: self.resource.header.newRecurringDeposit,
             hostReferenceNumber: data.hostReference ? data.hostReference : null,
             confirmScreenExtensions: {
               isSet: true,
               taskCode: "TD_F_CRT_RD",
               successMessage: self.resource.confirmScreenLabels.createSuccessMessage,
               confirmScreenDetails: confirmScreenDetailsArray,
               template: "confirm-screen/rd-template"
             }
           }, self);
       });
     };

    /**
     * This function is used set tenure of Recurring Deposit .
     *
     * @memberOf review-create-rd
     * @function formatTenure
     * @returns {void}
     */
    self.formatTenure = function() {
      let year, month;

      if (self.createRDModel.tenure.years <= 1)
        {year = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.year, {
          n: self.createRDModel.tenure.years
        });}
      else
        {year = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.year, {
          n: self.createRDModel.tenure.years
        });}

      if (self.createRDModel.tenure.months <= 1)
        {month = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.month, {
          n: self.createRDModel.tenure.months
        });}
      else
        {month = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.month, {
          n: self.createRDModel.tenure.months
        });}

      return rootParams.baseModel.format(self.resource.depositDetail.tenureDetail, {
        years: year,
        months: month
      });
    };
  };
});