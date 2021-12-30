define([], function() {
  "use strict";

  const ModuleListLocale = function() {
    return {
      root: {
        CORPORATE: {
          approver: "Corporate Approver",
          "demand-deposits": "Demand Deposits",
          maker: "Corporate Maker",
          loans: "Loans",
          "term-deposits": "Term Deposits",
          viewer: "Corporate Viewer",
          "account-snapshot": "Account Snapshot",
          corporateadminchecker: "Corporate Administrative Maker",
          corporateadminmaker: "Corporate Administrative Checker",
          checker: "Corporate Checker"
        },
        ADMIN: {
          dashboard: "Dashboard",
          authadmin: "System Administrator",
          adminmaker: "Administrative Maker",
          adminchecker: "Administrative Checker"
        },
        RETAIL: {
          customer: "Customer",
          loans: "Loans",
          "term-deposits": "Term Deposits",
          "demand-deposits": "Demand Deposits",
          payments: "Payments",
          trends: "Trends",
          cards: "Cards",
          origination: "Origination",
          "application-tracking": "Application Tracking",
          "account-snapshot": "Account Snapshot",
          home: "Home",
          "scan-to-pay": "Scan To Pay",
          payday: "Payday"
        }
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new ModuleListLocale();
});
