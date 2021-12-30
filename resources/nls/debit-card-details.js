define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const DebitcardLimit = function() {
    return {
      root: {
        header: {
          debitCardDetails: "Debit Card Details"
        },
        debitCards: {
          cardDetails: "Card Details",
          customerName: "Customer Name",
          CardType: "Card Type",
          accountNo: "Account Number",
          CardNumber: "Card Number",
          CardHolder: "Card Holder Name",
          expDate: "Expiry Date",
          nameOnCard: "Name on Card",
          fullName: "{firstName} {middleName} {lastName}",
          vaidThorugh: "Valid Through",
          update: "Update",
          internationalTransactions: "International Usage",
          internationalTransactionsActive: "Enabled",
          internationalTransactionsDisabled: "Disabled",
          internationalFlagMsgD: "You are about to deactivate international transactions for this account. You want be able to use this card in any international locations until you activate this feature.",
          internationalFlagMsgA: "You are about to Activate international transactions for this account. You will be able to use this card in any international locations after you activate this feature.",
          internationalFlagMsgHeaderD: "Deactivate International Transactions",
          internationalFlagMsgHeaderA: "Activate International Transactions",
          limitsView: "View Daily Limits",
          dailyLimits: "Daily Limits",
          reviewHead: "You initiated a request to modify Debit Card limits. Please review details before you confirm!",
          reviewHead1: "Review",
          activate: "Activate",
          deactivate: "Deactivate",
          internationalLimits: "International Usage Limits",
          limits: {
            domesticLimit: "Daily Domestic Limits",
            internationalLimit: "Daily International Limits",
            combinedLimit: "Combined Limits on Card",
            facility: "Facility",
            NoOfTran: "No. Of Transactions",
            currentLimit: "Current Limit",
            maxLimit: "Max. Limit - {maxAmount}",
            newLimit:"New Limit",
            Unit: "Unit",
            Count: "Count",
            Amount: "Amount",
            notValue:"Max. Limit - N.A",
            transactionName: "Debit Card Limits Update",
            debitLimitConfirm: "Request initiated successfully!",
            serviceRequestNumber: "Service Request Number is {refNo}",
            limitsTable: "Limits Table",
            ownAtmLimits: "Own ATM Limits",
            remoteAtmLimits: "Remote ATM Limits",
            ownPointSaleLimits: "Own Point of Sale Limits",
            RemotePointSaleLimits: "Remote Point of Sale Limits",
            eCommerce: "e-Commerce Limits",
            NoOfTxn: "No. Of Transactions",
            internationalLimitsTable: "International Limits Table",
            updateLimits: "Update Limits",
            confirmUpdate: "Are you sure you want to update the No. of transactions and amount?",
            requestSubmitted: "Request for updating Debit Card limit initiated under SR {srNo}."
          }
        },
        common: {
          status: "Status"
        },
        buttons: {
          debitCards: "Debit Cards",
          pinRequest: "Request Pin",
          limits: "View Limits",
          blockCards: "Block Card",
          yesD: "Yes, Disable",
          yesA: "Yes, Active",
          editDailyLimits: "Edit Daily Limits",
          resetPin: "Reset Pin",
          upgradeCard: "Upgrade Card",
          reissueCard: "Reissue Card",
          debitCardDetails: "Debit Card Details"
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
      el: false
    };
  };

  return new DebitcardLimit();
});
