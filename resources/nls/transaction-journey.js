define([], function() {
  "use strict";

  const TransactionJourneyLocale = function() {
    return {
      root: {
        transactionJourney: {
          status: {
            initiate: "Initiation",
            approve: "Approval",
            process: "Completion"
          },
          customMsg: {
            processed: "Processed",
            failedAtHost: "Failed At Host",
            executionPending: "Execution Pending"
          },
          fullName: "{firstName} {middleName} {lastName}",
          pageHeader: "Transaction Journey",
          transactionReference: "Reference No : {ref}",
          toggleTransactionDetails: "Click to toggle Transaction Details",
          toggleTransactionDetailsAlt: "Toggle Transaction Details"
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

  return new TransactionJourneyLocale();
});