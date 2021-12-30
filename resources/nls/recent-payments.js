define([], function() {
  "use strict";

  const RecentPaymentLocale = function() {
    return {
      root: {
        labels: {
          paymentHeader: "Last 5 Payments",
          status: "Status",
          createdBy: "{FName} {LName}",
          noData: "Payments Not Initiated Recently",
          subData: "Check this section once you make a payment"
        },
        status: {
          PENDING_APPROVAL: "In Progress",
          REJECTED: "Rejected",
          APPROVED: "Processed",
          INITIATED: "Initiated",
          COMPLETED: "Processed",
          EXPIRED: "Expired",
          MODIFICATION_REQUESTED: "Modification Requested"
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

  return new RecentPaymentLocale();
});