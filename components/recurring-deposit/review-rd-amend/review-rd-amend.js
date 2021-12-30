/**
 * Review Recurring Deposit Edit maturity Instruction.
 *
 * @module recurring-deposit
 * @requires {ojcore} oj instance of ojet
 * @requires {knockout} ko knockout instance
 * @requires {jquery} $ jquery instance
 * @requires {object} reviewRedeemModel model instance
 * @requires {object} ResourceBundle resource bundle instance
 */
define([

  "knockout",
  "./model",
  "ojL10n!resources/nls/review-rd-amend",
  "ojs/ojbutton"
], function(ko, reviewRedeemModel, ResourceBundle) {
  "use strict";

  /** Review Recurring Deposit Amend.
   *
   *IT allows user review all the details entered to amend Recurring Deposit.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   *
   */
  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.amendModel = self.params.amendModel;
    self.selectedAccountValue = self.params.selectedAccountValue;
    self.selectedAccountDisplayValue = self.params.selectedAccountDisplayValue;
    self.resource = ResourceBundle;
    rootParams.baseModel.registerElement(["page-section", "row", "confirm-screen","internal-account-input"]);
    rootParams.baseModel.registerComponent("create-rd", "recurring-deposit");
    rootParams.dashboard.headerName(self.resource.header.amend);

    const confirmScreenDetailsArray = [
      [{
          label: self.resource.confirmScreenLabels.recurringDepositNumber,
          value: self.selectedAccountDisplayValue
        },
        {
          label: self.resource.payTo,
          value: self.resource.payoutType[self.amendModel.payoutInstructions[0].type]
        }
      ],
      [{
          label: self.resource.creditAccountNum,
          value: [self.amendModel.payoutInstructions[0].accountId.displayValue, self.amendModel.payoutInstructions[0].account, self.amendModel.payoutInstructions[0].beneficiaryName, self.amendModel.payoutInstructions[0].bankName, self.amendModel.payoutInstructions[0].address.line1, self.amendModel.payoutInstructions[0].address.line2, self.amendModel.payoutInstructions[0].address.city, self.amendModel.payoutInstructions[0].address.country],
          isInternalAccNo: self.amendModel.payoutInstructions[0].type==="I"
        },
        {
          label: self.resource.maturityInstruction,
          value: self.resource.rollOverType[self.amendModel.rollOverType]
        }
      ]
    ];

    self.confirmAmendRD = function() {
      const ignoreList = [];

       if (self.amendModel.payoutInstructions[0].type === "I")
         {

        ignoreList.push("address");
        }

      reviewRedeemModel.amendRD(self.selectedAccountValue, ko.mapping.toJSON(self.amendModel, {
           ignore: ignoreList
         })).then(function(data) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.resource.header.amend,
          confirmScreenExtensions: {
            isSet: true,
            taskCode: "TD_N_AMD_RD",
            successMessage: self.resource.confirmScreenLabels.createSuccessMessage,
            confirmScreenDetails: confirmScreenDetailsArray,
            template: "confirm-screen/rd-template"
          }
        }, self);
      });
    };
  };
});