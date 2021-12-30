define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const TransactionLocale = function() {
    return {
      root: {
        payments: {
          managerecipients_header: "Manage Payees",
          payee: {
            accountnumber: "Account Number",
            accountname: "Account Name",
            review: "Review",
            international: {
              networkTransferViaCodes:{
               SWI: "SWIFT Code",
               NAC: "NCC",
               SPE: "Bank Details"
            },
              UetrLabel :"UETR",
              payeeDetails:"Payee Address",
              intermediatoryBankDetails:"Intermediary Bank Details",
              addPaymentDetails:"Add Payment Details",
              deletePaymentDetails:"Delete Payment Details",
              deletePaymentTitle:"Delete Payment Details",
              transferViaBank : "Transfer via Intermediary Bank",
              addressLine1:"Address Line 1",
              addressLine2:"Address Line 2",
              internationalaccount: "International Account",
              SWIFTCODE: "SWIFT Code",
              NATIONALCLEARINGCODE: "NCC",
              SPECIFICBANKDETAILS: "Bank Details",
              header: "International Payee Details",
              accinternational: "International",
              accountname: "Account Name",
              accountnumber: "Account Number",
              accounttype: "Account Type",
              payvia: "Pay Via",
              bankDetails: "Bank Details",
              lookupswiftcode: "Lookup SWIFT Code",
              lookupswiftcodeTitle: "Click to view SWIFT Codes",
              lookupswiftcodeAlt: "Lookup for SWIFT Codes",
              lookupncc: "Lookup National Clearing Code",
              lookupnccTitle: "Click to have a lookup of National Clearing Code",
              accountnickname: "Nickname",
              email: "Email",
              residentialaddress: "Residential Address",
              identificationdoc: "Identification Document",
              identificationnum: "Identification Number",
              postalcode: "Postal Code",
              recipientname: "Payee Name",
              recipientaddress: "Payee Address",
              modeofdelivery: "Mode of Delivery",
              beneficiaryaddress: "Beneficiary Address",
              receiverdetails: "Receiver Details",
              branch: "Branch Near Me",
              postorcourier: "My Address",
              payeeaccesstype: "Access Type",
              invalidError: "Invalid bank code",
              country: "Country",
              city: "City",
              ncc: "NCC",
              review: "Review",
              reviewHeader: "You have initiated a request for International Bank Account Payee. Please review details before you confirm!",
              editreviewHeader: "You have initiated a request to Edit International Bank Account Payee. Please review details before you confirm!",
              payeeshared: "Payee Shared",
              address: "Bank Address",
              bankName: "Bank Name"
            }
          },
          common: {
            pay: "Pay",
            pleaseSelect: "Please Select",
            transfer: "Transfer",
            setup: "Setup",
            today: "Today",
            issue: "Issue",
            DeliveryLocation: "Delivery Location",
            note: "Note (Optional)",
            "note-review": "Note"
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