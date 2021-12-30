define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const LoanAccountSummary = function() {
    return {
      root: {
        pageTitle: {
          title: "Loans",
          loanSummaryTitle: "Loan Accounts Summary"
        },
        accountSummary: {
          loanAccountDetails: "Loan Account Details",
          accountNo: "Account Number",
          accountName: "Account Name",
          maturityDate: "Maturity Date",
          interestRate: "Interest Rate",
          profitRate: "Profit Rate",
          currency: "Currency",
          partyName: "Party Name",
          outstandingBalance: "Outstanding",
          interestRateIcon: "@ {interestRate}",
          accountSummaryLabel: "Showing {showedAccounts} of {totalAccounts}",
          accountSummary: "Loan Accounts Summary",
          depositRateAndMaturityDate: "@ {interestRate} | Maturing on {maturityDate}",
          linkDetails: "Click to see details of {accountNo}",
          linkDetailsText: "{accountNo} Details",
          displayContent: "{nickname}",
          download: "Download",
          downloadText: "Click to download Account Summary",
          myAccountType: "Type Of Account Held",
          conventionalAccount: "Conventional",
          islamicAccount: "Islamic",
          noAccounts: "No Accounts Available",
          status: "Account Status",
          amountFinanced: "Amount Financed",
          yes: "Yes",
          no: "No",
          statusType:{
            ACTIVE:"Active",
            CLOSED:"Closed"
          },
          search: "Loan Account,Party Name,Account status",
          autoPayment: "Auto Payment",
          autoPaymentHeaders: {
            A: "Yes",
            L:"No"
          }

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
      el: true
    };
  };

  return new LoanAccountSummary();
});
