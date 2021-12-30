define([], function() {
  "use strict";

  const Menu = function() {
    return {
      root: {
        title: "TDS",
        requiredFor: "Required for Financial Year",
        pleaseSelect: "Please Select",
        labels: {
          selectFinancialYear: "Select Financial Year"
        },
        fromDate: "From Date",
        toDate: "To Date",
        view: "View",
        back: "Back",
        download: "Download",
        interestCertificateTable: "Interest Certificate Table",
        financialYear: "Financial Year",
        year: "{fromYear}-{toYear}",
        duration: "Duration",
        tableHeading: {
          accountNo: "Deposit Account Number",
          interestEarned: "Interest Earned",
          taxDeducted: "Tax Deducted"
        },
        ok: "Ok",
        passwordNotification: "Password Combination",
        tdsHeading: "TDS For Financial Year {year} was {amount}",
        tableCaption: "Interest Certificate",
        backToDashboard: "Back to Dashboard",
        patternVisiblity: "Pattern Visibility",
        alt: "Image for Note"
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

  return new Menu();
});
