define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";

  const bankCustomLimitsLocale = function () {
    return {
      root: {
        BankCustomLimits: {
          header: "User Limits",
          transactionName: "create bank custom limits",
          MONTHLY: {
            amount: "Monthly Amount",
            count: "Monthly Count"
          },
          DAILY: {
            amount: "Daily Amount",
            count: "Daily Count"
          },
          userDetails: "User Details",
          viewLimits: "View Limits",
          transactionGroup: "Transaction Group",
          userType: "User Type",
          retailUser: "Retail User",
          party: "Party ID",
          fullName: "Full Name",
          fullNameTemplate: "{firstName} {middleName} {lastName}",
          username: "User Name",
          accessPoints: "Touch Point",
          transactions: "Transactions",
          transaction: "Transaction",
          TPG: "Touch Point Group",
          CONS: "Consolidated Limits",
          TG: "Transaction Group",
          TPGTG: "Touch Point & Transaction Group",
          CONSTG: "Consolidated & Transaction Group",
          allocated: "Bank Allocated",
          custom: "User Customized",
          utilized: "Utilized",
          available: "Available",
          newValue: "Revised Limit",
          reviewwarning: "Warning!",
          cancelMessage: "Are you sure do you want to cancel the operation ?",
          effectiveDate: "Effective Date",
          endDate: "End Date",
          limitsChanged: "Limits Changed",
          noChangeError: "No Changes have been made in the limits.",
          confirmScreenheader: "You initiated a request to revise user limits. Please review details before you confirm.",
          notChanged: "Not Changed",
          invalidInput: "Please enter a valid value."

        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
es :true,
      "en-us": false,
      el: true
    };
  };

  return new bankCustomLimitsLocale();
});
