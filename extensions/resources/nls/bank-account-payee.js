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
          managerecipients_header: "Manage Payees",
          addrecipient_header: "Add Payee",
          editrecipient_header: "Edit Payee Details",
          cancelConfirm: "Are you sure you want to cancel the operation?",
          confirmRecipient: "Transaction",
          coolingPeriod: "Cooling Period Details",
          duration: "Duration",
          cumulativeAmount: "Cumulative Amount",
          coolingPeriodmsz: "For security purposes, the initial period amount limits for transfers towards this payee will be as follows:",
          coolingPeriodMsgForEditPayee: "For security purposes, once the payee is modified, the initial period amount limits for transfers towards this payee will be as follows:",
          coolingPeriodMsgForEditPayeeNote: "Note :Cooling period limits will be applicable only if critical data of the payee is modified.",
          payee: {
            paymenttype: "Payment Type",
            typeOfAccount: "{payeeAccountType} - {accountType}",
            limitsuccessmsg: "Your Limit has been updated.",
            isShared: {
              true: "Public",
              false: "Private"
            },
            pendingApproval: "Pending Approval",
            bankaccount: "Bank Account",
            recipientname: "Payee Name",
            accounttype: "Account Type",
            accinternal: "Internal",
            accdomestic: "Domestic",
            accinternational: "International",
            accountnickname: "Nickname",
            payeeaccesstype: "Access Type",
            add: "Add",
            save: "Save",
            success: "Successful!",
            addedtolist: "Payee {name} added to your Payees.",
            review: "Review",
            accountname: "Account Name",
            accountnumber: "Account Number",
            confirmAccountNumber: "Confirm Account Number",
            branch: "Branch",
            view: "View / Edit Payee",
            image: "Payee Photo",
            uploadImage: "Upload",
            transactionMessage: {
              internal: "Add Internal Payee",
              domestic: "Add Domestic Payee",
              international: "Add International Payee"
            },
            confirmScreen: {
              successMessage: "Payee added successfully.",
              updateSuccessMessage: "Payee Updated Successfully",
              corpMaker: "Your request has been initiated successfully."
            },
            type: {
              INTERNAL: "Internal",
              INTERNATIONAL: "International",
              DOMESTIC: "Domestic",
              PEERTOPEER: "Peer To Peer",
              MOBILE: "Mobile",
              EMAIL: "Email"
            },
            network: {
              NEFT: "NEFT",
              RTGS: "RTGS",
              IMPS: "IMPS",
              SWI: "SWIFT",
              SRT: "Sort",
              SORT: "Sort",
              SWIFT: "SWIFT",
              NAC: "NCC",
              SPE: "Specific Bank",
              CAT: "Card Transfer",
              CRT: "Credit Transfer"
            },
            message: {
              limitset: "Limit set successfully",
              limitSetTom: "Limit set successfully and will be effective from tomorrow.",
              efffromtom: "{amount}, effective from tomorrow",
              accountNoValidation: "Account Numbers do not match.",
              validationMessage: "Input account number field first"
            },
            labels: {
              deliveryLocation: "Delivery Location",
              pay: "Pay",
              viewedit: "View/Edit",
              delete: "Delete",
              accountName: "Account Name",
              nickname: "Nickname",
              acctype: "Account Type",
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
              amount: "Amount"
            },
            coolingPeriod: {
              days: "Up to {days} day(s)",
              hours: "Up to {hours} hour(s)",
              minutes: "Up to {minutes} minute(s)",
              daysHours: "Up to {days} day(s) {hours} hour(s)",
              daysMinutes: "Up to {days} day(s) {minutes} minute(s)",
              hoursMinutes: "Up to {hours} hour(s) {minutes} minute(s)",
              daysHoursMinutes: "Up to {days} day(s) {hours} hour(s) {minutes} minute(s)"
            },
            fullAccName: "{firstName}"
          },
          common: Common.payments.common,
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