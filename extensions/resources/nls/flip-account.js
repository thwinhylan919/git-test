define([], function() {
  "use strict";

  const paymentsQuickLinks = function() {
    return {
      root: {
        accountTypeLabel: "Account Type",
        tdSubText: "Maturing {maturityDate} | {accountType}",
        rdSubText: "Maturing {maturityDate}",
        ddSubText: "{product} | {accountType}",
        activeAccounts: "Active",
        inactiveAccounts: "Inactive / Closed",
        turnCard: "Click here to close and go to Accounts",
        myAccount: "My Accounts. Flip To View Account Details",
        openMenu: "Click for More Actions",
        heading: {
          TRD: "Term Deposits",
          CSA: "Current & Savings",
          LON: "Loans and Finances",
          CCA: "Credit Cards",
          RD: "Recurring Deposits"
        },
        accountType: {
          CON: "Conventional",
          ISL: "Islamic"
        },
        status: {
          ACTIVE: "Active",
          DORMANT: "Dormant",
          CLOSED: "Inactive",
          ACT: "Active",
          IAT: "Inactive",
          HTL: "Hotlisted",
          CLD: "Cancelled"
        },
        accountNumber: "{accountNumber} | {status}",
        accountNumberWithNickName: "{accountNumber} - {nickName} | {status}",
        subHeading: "{count} Accounts",
        transactions: {
          "demand-deposit-details": "Account Details",
          "cheque-book-request": "Cheque Book Request",
          "cheque-status-inquiry": "Cheque Status Inquiry",
          "cheque-stop-unblock": "Stop/Unblock Cheque",
          "debit-card-list": "Debit Cards",
          "td-details": "Deposit Details",
          "td-topup": "Top Up",
          "td-redeem": "Redemption",
          "rd-details": "Deposit Details",
          "rd-redeem": "Redemption",
          "demand-deposit-transactions": "View Statement",
          "demand-deposit-statement-request": "Request Statement",
          "term-deposit-transactions": "View Statement",
          "term-deposit-statement-request": "Request Statement",
          "recurring-deposit-statement-request": "Request Statement",
          "recurring-deposit-transactions": "View Statement",
          "loan-transactions": "View Statement",
          "loan-details": "Loan and Finance Details",
          "loan-repayment": "Repayment",
          "loan-disbursement": "Disbursement Inquiry",
          "loan-schedule": "Schedule Inquiry",
          "card-details": "Credit Card Details",
          "card-statement": "View Statement",
          "card-pay": "Card Payment",
          "request-pin": "Request PIN",
          "block-card": "Block/Cancel Card",
          "auto-pay": "Auto Pay",
          "creditcard-reset-pin": "Reset PIN",
          "add-on-card": "Add-On Card",
          "td-amend": "Edit Maturity Instruction",
          "rd-amend": "Edit Maturity Instruction",
          "sweep-in-instruction": "Sweep-in"
        },
        linksLabel: {
          "forex-calculator": "Forex Calculator",
          "td-open": "New  Deposit",
          "savings-calculator": "Deposit Calculator",
          "td-calculator": "Deposit Calculator",
          "loan-eligibility-calculator": "Eligibility Calculator",
          "loan-calculator": "Installment Calculator",
          "card-pay": "Make Payments",
          "create-rd": "New Recurring Deposit",
          "block-card": "Block Card"
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

  return new paymentsQuickLinks();
});
