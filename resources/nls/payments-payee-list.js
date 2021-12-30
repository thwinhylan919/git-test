define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Messages, Generic, Common) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        payments: {
          managerecipients_header: "Payee List",
          openmenualt: "Click here for more options",
          openmenutitle: "Click here for more options",
          efflimitMsz: "The changes you made today will be effective from tomorrow.",
          common: Common.payments.common,
          payee: {
            view: "View/Edit Payee",
            addnewrecipient: "Add New Payee",
            payeename: "Payee Name",
            acctype: {
              bankpayee: "Add New Account",
              ddpayee: "Add New Demand Draft"
            },
            addressType: {
              BRN: "Branch Near Me",
              MAI: "My Address",
              OTHADD:"Other Address"
            },
            confirmScreen: {
              successMessage: "Payee has been deleted.",
              corpMaker: "Your request has been initiated successfully.",
              pendingApproval: "Pending Approval"
            },
            type: {
              INTERNAL: "Internal",
              INTERNATIONAL: "International",
              DEMANDDRAFT: "Demand Draft",
              DOMESTIC: "Domestic",
              PEERTOPEER: "Peer To Peer",
              MOBILE: "Mobile",
              EMAIL: "Email",
              DOM: "Domestic",
              INT: "International",
              VPA: "VPA"
            },
            network: {
              NEFT: "NEFT",
              RTGS: "RTGS",
              IMPS: "IMPS",
              SWI: "SWIFT Code",
              SRT: "Sort Code",
              SORT: "Sort Code",
              SWIFT: "SWIFT Code",
              NAC: "NCC",
              SPE: "Specific Bank",
              CAT: "Card Transfer",
              CRT: "Credit Transfer"
            },
            paymentTypes: {
              NOU: "Non-Urgent",
              URG: "Urgent",
              FAS: "Faster",
              CAT: "Card Transfer",
              CRT: "Credit Transfer"
            },
            labels: {
              payeeHeader: "Payee Details",
              payeeDetails:"Payee Address",
              payeeName: "Payee Name",
              deliveryLocation: "Delivery Location",
              pay: "Pay",
              removeLimits: "Remove Limits",
              viewedit: "View/Edit",
              delete: "Delete",
              accountName: "Account Name",
              nickname: "Nickname",
              acctype: "Account Type",
              typeOfAccount: "{payeeAccountType} - {accountType}",
              payvia: "Pay Via",
              bnkdetails: "Bank Details",
              dailylimit: "Daily Limit",
              monthlylimit: "Monthly Limit",
              payeename: "Payee Name : {name}",
              transferMode: "Transfer Mode",
              transferValue: "Transfer Value",
              branchCode: "Branch Code",
              accountNumber: "Account Number",
              drafttype: "Draft Type",
              payAtCity: "Pay At City",
              payAtCountry: "Pay At Country",
              notset: "Not Set",
              deletePayee: "Delete Payee",
              edit: "Edit",
              amount: "Amount",
              editPayeeGroupPhoto: "Edit Payee Group Photo",
              payeeImage: "Payee Photo",
              paymentType: "Payment Type",
              draftFavouring: "Draft Favouring",
              openChoiseBox: "Open Choice Box",
              closeChoiseBox: "Close Choice Box"
            },
            message: {
              limitset: "Limit set successfully.",
              limitSetTom: "Limit set successfully and will be effective from tomorrow.",
              limitRemove: "Limit changed successfully.",
              limitRemoveTom: "Changed limits will be effective from tomorrow.",
              efffromtom: "{amount}, effective from tomorrow",
              nopayee: "No Payees Added",
              valueRequired: "You must select a value.",
              delete: "You are about to delete a Payee- {group}: {payee} from your list. The Payee will be deleted from the application & all details will be lost! Are you sure you want to proceed?",
              payeeUploadSuccess: "Payee Photo {message} successfully",
              payeeGroupUploadSuccess: "Payee Group Photo {message} successfully",
              imageMessage: {
                EDIT: "Edited",
                UPLOAD: "Uploaded",
                REMOVE: "Removed"
              }
            }
          },
          messages: Messages,
          generic: Generic
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