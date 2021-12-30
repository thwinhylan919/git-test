define([], function() {
  "use strict";

  const PaymentsLanding = function() {
    return {
      root: {
        header: "Payments",
        label: {
          "pay-bills": "Pay Bill",
          "transfer-money": "Transfer Money",
          "multiple-transfers": "Multiple Transfers",
          "multiple-bill-payments": "Multiple Bill Payments",
          "issue-dd": "Issue Demand Draft",
          favorite: "Favorite",
          "upcoming-payments": "Upcoming Payments",
          "manage-payees-billers": "Manage Payees",
          "setup-si": "Setup Repeat Transfer",
          "si-list": "View Repeat Transfer",
          "request-money": "Request Money",
          "manage-debtors": "Manage Debtors",
          scanToPay: "Scan To Pay",
          payToContacts: "Pay to Contacts",
          "adhoc-payment": "Fast Payment"
        },
        alt: {
          "pay-bills": "Pay Bill",
          "transfer-money": "Transfer Money",
          "multiple-transfers": "Multiple Transfers",
          "multiple-bill-payments": "Multiple Bill Payments",
          "issue-dd": "Issue Demand Draft",
          favorite: "Favorite",
          "upcoming-payments": "Upcoming Payments",
          "manage-payees-billers": "Manage Payees",
          "setup-si": "Setup Standing Instruction",
          "si-list": "View Standing Instructions",
          "request-money": "Request Money",
          "manage-debtors": "Manage Debtors",
          scanToPay: "Click here to Scan To Pay",
          payToContacts: "Click here to Pay to Contacts",
          "adhoc-payment": "Click here to make fast Payment"
        },
        title: {
          "pay-bills": "Pay Bill",
          "transfer-money": "Transfer Money",
          "multiple-transfers": "Multiple Transfers",
          "multiple-bill-payments": "Multiple Bill Payments",
          "issue-dd": "Issue Demand Draft",
          favorite: "Favorite",
          "upcoming-payments": "Upcoming Payments",
          "manage-payees-billers": "Manage Payees",
          "setup-si": "Setup Standing Instruction",
          "si-list": "View Standing Instructions",
          "request-money": "Request Money",
          "manage-debtors": "Manage Debtors",
          scanToPay: "Click here to Scan To Pay",
          payToContacts: "Click here to Pay to Contacts",
          "adhoc-payment": "Click here to make fast Payment"
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };

  return new PaymentsLanding();
});