define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  return new function() {
    return {
      root: {
        header: {
          accountBalance: "Accounts & Balances",
          balanceDetails: "Balance Details"
        },
        labels: {
          title: "Virtual Account",
          accountNumber: "Account Number",
          mappedVirtualAccounts: "Virtual Accounts",
          mappedStructures: "Linked Structures",
          viewBalance: "View Balance"
        },
        dropDownOptions: {
          realAccountSingleCurrency: "Real Account - Single Currency",
          virtualMultiCurrencyAccount: "Virtual Multi-Currency Account"
        },
        virtualMultiCurrencyAccount: "Virtual Multi-Currency Account",
        realAccountName: "Real Account Name",
        realAccountNumber: "Real Account Number",
        currency: "Currency",
        amount: "Amount",
        vmcaBalanceDetails: "Virtual Multi-Currency Balance Details",
        caption: "Real and Virtual Multi-Currency Account Details",
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
});
