define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const dashboardLocale = function() {
    return {
      root: {
        messages: {
          premiumPayment: "Please select payment option",
          coverType: "Please select cover type"
        },
        premiumPaymentOption: "Premium Payment Option",
        coverType: "Cover Type",
        selectCover: "Select Cover Type",
        policyDetails: "Insurance Policy Details",
        policyName: "Policy Name",
        name: "Bank-name Insurance Policy",
        insuranceProvider: "Insurance Provider",
        periodicity: "Periodicity",
        times: "One Time",
        required: "* Required",
        premiumAmount: "Premium Amount",
        done: "Done",
        generic: Generic
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

  return new dashboardLocale();
});