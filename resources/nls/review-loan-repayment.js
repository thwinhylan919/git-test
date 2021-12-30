define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const ReviewChequeBookRequest = function() {
    return {
      root: {
        common: {
          review: "Review",
          reviewHeader: "You initiated a request for Loan Repayment. Please review details before you confirm!"
        },
        loanRepayment: {
          transferFrom: "Transfer From",
          amount: "Repayment Amount",
          principalBalance: "Outstanding Principal",
          installmentArrears: "Pending Arrears",
          loanAccountNumber: "Loan Account Number"
        },
        confirmationMsg: {
          approvalMessages: {
            APPROVED: {
              successmsg: "Loan Repayment request submitted successfully.",
              statusmsg: "Completed"
            },
            PENDING_APPROVAL: {
              successmsg: "Loan Repayment request has been approved. It is pending for further approval.",
              statusmsg: "Pending Approval"
            },
            REJECTED: {
              successmsg: "Loan Repayment request has been rejected.",
              statusmsg: "Rejected"
            },
            FAILED: {
              successmsg: "Rejected by host.",
              statusmsg: "Failed"
            }
          },
          FINAL_LEVEL_APPROVED: "Loan Repayment request submitted successfully.",
          MID_LEVEL_APPROVED: "You have successfully approved the request. It is pending for further approval.",
          REJECT_BY_HOST: "Your request has been rejected.",
          REJECT: "Loan Repayment request has been rejected.",
          INITIATED: "Loan Repayment request has been initiated successfully.",
          AUTO_AUTH: "Loan Repayment request submitted successfully."
        },
        generic: Generic,
        header: "Loan Repayment"
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

  return new ReviewChequeBookRequest();
});
