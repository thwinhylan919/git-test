define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/obdx-module-list"], function (Generic, ModuleList) {
  "use strict";

  const SelectPersonaLocale = function () {
    return {
      root: {
        generic: Generic,
        selectModule: "Select Module",
        navBarDescription: "Dashboard Creation",
        invalidTemplateName: "Enter valid name for template",
        invalidDashboardType: "Please select a dashboard type to continue",
        labels:{
          templateName:"Template Name",
          description:"Template Description",
          large:"Desktop",
          medium:"Tab",
          small:"Mobile",
          design:"Design"
        },
        segments: {
          retail: "Retail",
          corporate: "Corporate",
          admin: "Administrator"
        },
        personas: ModuleList,
        dashboard: "Dashboard",
        dashboardClass: {
          SEGMENT: "Segment Dashboard",
          APPLICATION_ROLE: "Application Role Dashboard",
          MODULE: "Module Dashboard",
          USER_TYPE: "User Type Dashboard"
        },
        modules:{
          "demand-deposits":"Demand Deposits",
          "term-deposits": "Term Deposits",
          loans: "Loans",
          home: "Home",
          trends:"Trends",
          "link-account-dashboard": "Link Account Dashboard",
          "liquidity-management": "Liquidity Management",
          "virtual-account-management": "Virtual Account Management"
        },
        pageHeader: "Dashboard Builder",
        segmentHeader: "Segment Based Modules",
        appRoleHeader: "Application Role Based Modules",
        userHeader: "User Type Based Modules",
        noData: "No Modules Available",
        dashboardType: "Dashboard Type",
        userType: "User Type"
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

  return new SelectPersonaLocale();
});
