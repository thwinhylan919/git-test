define([], function() {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        wallet: {
          configaration: {
            header: "Configuration",
            createoffer: "Create New",
            offername: "Offer Name",
            offercode: "Offer Code"
          },
          ledgerDescription: {
            accountgl: "Wallets Account General Ledger",
            profitlossgl: "Wallets Profit & Loss General Ledger",
            intermediarygl: "Wallets Intermediary General Ledger",
            liabilityreportinggl: "Wallets Liability Reporting General Ledger",
            assetreportinggl: "Wallets Asset Reporting General Ledger"
          }
        }
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

  return new TransactionLocale();
});
