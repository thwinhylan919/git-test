define([], function() {
  "use strict";

  const BillsReportLocale = function() {
    return {
      root: {
        billerId: "Biller Id",
        billerAccountNo: "Biller Account Number",
        billerName: "Biller Name",
        duration: "Duration",
        messages: {
          invalidBillerId: "Please enter valid Biller Id",
          invalidBillerName: "Please enter valid Biller Name",
          invalidAccountNo: "Please enter valid Account Number"
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

  return new BillsReportLocale();
});