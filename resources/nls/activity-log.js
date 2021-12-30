define([], function() {
  "use strict";

  const ActivityLogLocale = function() {
    return {
      root: {
        activityLogDetails: {
          labels: {
            header: "Activity Log {count}",
            PARTY_MAINTENANCE: "Customer Maintenances",
            ADMIN_MAINTENANCE: "Administrative Maintenance",
            date: "Date",
            type: "Type",
            referenceNo: "Reference No",
            partyName: "Party Name",
            description: "Description",
            status: "Status",
            title: "Activity Log Details",
            linkDetails: "Click to see details of {transactionId}"
          },
          transactionList: {
            PENDING_APPROVAL: "Pending Approval"
          },
          status: {
            PENDING_APPROVAL: "In Progress",
            REJECTED: "Rejected",
            APPROVED: "Processed",
            INITIATED: "Initiated",
            COMPLETED: "Processed",
            EXPIRED: "Expired",
            MODIFICATION_REQUESTED: "Modification Requested"
          },
          clickHere: "Click Here For {accountNo} Details"
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

  return new ActivityLogLocale();
});
