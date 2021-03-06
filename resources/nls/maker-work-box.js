define([], function() {
  "use strict";

  const MakerWorkBoxLocale = function() {
    return {
      root: {
        title: "Work Snapshot",
        heading: "Work Snapshot for today",
        activityHeader: "Activity Log",
        approved: "Approved",
        initiated: "Initiated",
        rejected: "Rejected",
        expired: "Expired",
        activityHeaderTitle: "Click here to view details",
        ACCOUNT_FINANCIAL: "Accounts",
        AMOUNT_FINANCIAL: "Non Accounts",
        ACCOUNT_NON_FINANCIAL: "Accounts",
        ADMIN_MAINTENANCE: "Administrative Maintenance",
        BULK_FILE: "Bulk File",
        CREDIT_FACILITY: "Credit Facility",
        BULK_RECORD: "Bulk Record",
        AMT_FINANCIAL_BULK_RECORD: "Non Account Bulk Record",
        NON_FINANCIAL_BULK_FILE: "Bulk File",
        NON_FINANCIAL_BULK_RECORD: "Bulk Record",
        PAYEE_BILLER: "Payee and Biller",
        PAYMENTS: "Payments",
        ELECTRONIC_BILL_PAYMENTS: "Bill Payments",
        TRADE_FINANCE: "Trade Finance",
        OTHER_TRANSACTION: "Others",
        ACCOUNT_FINANCIAL_COUNT: "Accounts ({count})",
        AMOUNT_FINANCIAL_COUNT: "Non Accounts ({count})",
        ACCOUNT_NON_FINANCIAL_COUNT: "Accounts ({count})",
        BULK_FILE_COUNT: "Bulk File ({count})",
        BULK_RECORD_COUNT: "Bulk Record ({count})",
        AMT_FINANCIAL_BULK_RECORD_COUNT: "Non Account Bulk Record ({count})",
        ACCOUNT_BULK_RECORD_COUNT:"Account Bulk Record ({count})",
        ACCOUNT_BULK_FILE_COUNT:"Account Bulk File ({count})",
        NON_FINANCIAL_BULK_FILE_COUNT: "Bulk File ({count})",
        NON_FINANCIAL_BULK_RECORD_COUNT: "Bulk Record ({count})",
        PARTY_MAINTENANCE: "Party Maintenance",
        FOREX_DEAL: "Forex Deal",
        FOREX_DEAL_COUNT: "Forex Deal ({count})",
        PAYEE_BILLER_COUNT: "Payee and Biller ({count})",
        PAYMENTS_COUNT: "Payments ({count})",
        ELECTRONIC_BILL_PAYMENTS_COUNT: "Electronic Bill Payments ({count})",
        TRADE_FINANCE_COUNT: "Trade Finance ({count})",
        OTHER_TRANSACTION_COUNT: "Others ({count})",
        BILLER_MAINTENANCE: "Biller Maintenance",
        BILLER_MAINTENANCE_COUNT: "Biller Maintenance ({count})",
        LIQUIDITY_MANAGEMENT: "Liquidity Management",
        LIQUIDITY_MANAGEMENT_COUNT: "Liquidity Management ({count})",
        CREDIT_FACILITY_COUNT: "Credit Facility ({count})",
        chooseTxnType: "Choose Transaction Type",
        financialTxn: "Financial",
        nonFinancialTxn: "Non Financial",
        processed: "Processed",
        progress: "In Progress",
        period: "As on {date}",
        filter: "Filter",
        filterText: "Click here to search based on date",
        count: "({totalCount})",
        approvedHeader: "My Approved List",
        navBarDescription: "My Approved List",
        mobileClick: "Click here to enter {module}",
        mobileClickAlt: "View {module}",
        dateFrom: "From Date",
        dateTo: "To Date",
        search: "Search",
        dropDown: "Select Account Type",
        noData: "Transactions Not Initiated",
        subData: "Your daily transaction summary will be updated here"
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

  return new MakerWorkBoxLocale();
});
