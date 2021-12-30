define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const ReviewInternationalPayee = function() {
    return {
      root: {
        internationalPayee: {
          header: "International Payee Details",
          recipientname: "Payee Name",
          accountnumber: "Account Number",
          accountName: "Account Name",
          accounttype: "Account Type",
          accinternational: "International",
          accountnickname: "Nickname",
          swiftcode: "SWIFT Code",
          nationalclearingcode: "National Clearing Code (NCC)",
          bankdetails: "Bank Details",
          payeeshared: "Payee Shared",
          payeeaccesstype: "Access Type",
          payvia: "Pay Via",
          ncc: "NCC (National Clearing Code)"
        },
        generic: Generic
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

  return new ReviewInternationalPayee();
});