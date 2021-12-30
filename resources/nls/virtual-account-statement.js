define([], function () {
    "use strict";

    return new function () {
      return {
        root: {
          title: "Virtual Account Statement",
          referenceNumber : "Reference Number",
          selectAccount: "Select Virtual Account",
          selectVAccountPlaceHolder : "Select",
          transactionType : "Transaction Type",
          fromDate : "From Date",
          toDate : "To Date",
          back: "Back",
          selectAccountPlaceHolder : "Select Account",
          referenceNumberPlaceHolder : "Reference Number",
          search: "Search",
          reset: "Reset",
          date : "Date",
          description : "Description",
          requiredMessage : "Please select Virtual Account",
          amount : "Amount",
          all : "All",
          debit : "Debit",
          credit : "Credit",
          downLoad : "Download",
          pdf : "PDF",
          csv : "CSV",
          transactionTypes : {
            D : "Dr",
            C : "Cr"
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
  });