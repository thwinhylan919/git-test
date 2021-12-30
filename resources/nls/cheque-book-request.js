define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";

  const ReviewChequeBookRequest = function () {
    return {
      root: {
        common: {
          review: "Review",
          reviewHeader: "You initiated a request for Cheque Book. Please review details before you confirm!",
          DeliveryLocation: "Delivery Location",
          successful: "Successful!"
        },
        chequeBookRequest: {
          chequeBookType: "Type of Cheque Book",
          NumberOfCheques: "Number of Cheque Books",
          NumberOfLeaves: "Number of Leaves per Book",
          DeliveryLocation: "Delivery Location",
          accountNumber: "Account Number",
          addressType: {
            PST: "Postal",
            RES: "Residence",
            WRK: "Work"
          },
          selectAccount: "Select Account",
          select: "Please Select",
          referenceNumber: "Reference Number is {refNo}",
          chequeBookRequestConfirm: "Your cheque book will be delivered at the desired location!",
          chequeBookLeaveOption: "Cheque Book with {leavesCount} Leaves",
          transactionName: "Cheque Book Request",
          invalidInput: "Invalid Input",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected"
        },
        confirmationMsg: {
          FINAL_LEVEL_APPROVED: "You have successfully approved the request.",
          MID_LEVEL_APPROVED: "You have successfully approved the request. It is pending for further approval.",
          REJECT_BY_HOST: "Your request has been rejected.",
          REJECT: "You have rejected the request.",
          INITIATED: "Your request has been initiated successfully.",
          AUTO_AUTH: "Your request has been accepted."
        },
        header: "Cheque Book Request",
        generic: Generic,
        compName: {
          compName: "Cheque Book Request"
        }
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