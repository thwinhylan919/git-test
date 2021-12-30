define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/financial-limits-common"
], function (Messages, Generic, Limits_common) {
  "use strict";

  const OriginationLocale = function () {
    return {
      root: {
        limit: {
          Amount: "Amount",
          maxAmount: "Maximum Amount",
          minAmount: "Minimum Amount",
          maxTransactions: "Maximum Transactions",
          limitSearch: "Search Result of limit",
          count: "Count",
          updationDate: "Updated Date",
          transactionTable: "Limits Availability",
          msg: "{minAmount} to {maxAmount}",
          limitsAvailabilityTitle: "Available Limits",
          Spent: "Spent",
          knowMoreInfoCorporate: "Note - Above limits is your  per transaction initiation limit  for the current channel. The transaction will get processed only if the sufficient cumulative limits are available for approving this transaction with respective approver and limits are available for your party. You may have limits available for initiating this transaction from other channel, to know more details access - View Limits",
          knowMoreInfoRetail: "Note - Above limits are derived based on your  per transaction initiation limits, total available cumulative limit for the current channel, payee cooling period and payee limits set up by you if any for initiating current transaction.  You may have limits available for initiating this transaction from other channel, to know more details access - View Limits",
          nolimits: "Currently no limits are assigned to this transaction.Please contact administrator for further details."
        },
        common: Limits_common,
        messages: Messages,
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

  return new OriginationLocale();
});