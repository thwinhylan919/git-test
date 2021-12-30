define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const SecurityMenu = function() {
    return {
      root: {
        generic: Generic,
        title: "Interest Certificates",
        labels: {
          "interest-certificate-casa": "Current and Savings",
          "interest-certificate-td": "Deposits",
          "interest-certificate-loans": "Loans",
          balanceCertificate : "Balance Certificate",
          selectFinancialYear: "Select Financial Year",
          depositLabel: "Deposit"
        },
        currentAccounts :"Current and Savings Accounts",
        tdAccounts:"Term Deposits",
        selectBalOutstanding:"Select month for outstanding balance",
        balanceAsOn : "Balance Certificate as on {period}",
        specificDeposit: "Specific Account",
        allDeposits: "All Accounts",
        interestHeading: "Interest for your Account/Deposit with us for selected period is as following",
        tableCaption: "Interest Certificate",
        customerId: "Customer ID",
        pleaseSelect: "Please Select",
        fromDate: "From Date",
        toDate: "To Date",
        view: "View",
        year: "{fromYear}-{toYear}",
        back: "Back",
        download: "Download",
        interestCertificateTable: "Interest Certificate Table",
        financialYear: "Financial Year",
        duration: "Duration",
        termDeposits: "Term Deposits",
        selectFor: "Select Interest Certificate for",
        tableHeading: {
          accountNo: "Account Number",
          productType: "Product Type",
          interestCredited: "Interest Credited",
          interestPaid: "Interest Paid",
          date: "Date",
          currency :"Currency",
          balance: "Balance",
          depositNo: "Deposit No",
          interestAccrued: "Interest Accrued"
        },
        balanceCertificate: {
          currentMonth:"Current Month",
          previousMonth:"Previous Month",
          previousQuarter:"Previous Quarter",
          selectDateRange:"Select Date Range"
        },
        ok: "Ok",
        passwordNotification: "Password Combination",
        recurringDeposits: "Recurring Deposits",
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

  return new SecurityMenu();
});
