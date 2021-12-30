define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";

  const DashboardMappingLocale = function () {
    return {
      root: {
        generic: Generic,
        labels: {
          mappingType: "Mapping Type",
          selectRole: "Select Role",
          mappingValue: "Mapping Value",
          module: "Module",
          dashboard: "Dashboards",
          template: "Template",
          selectedParty: "{name} ({partyid})"
        },
        heading: {
          create: "Create Mapping"
        },
        header2: "Mapping your templates",
        mapingDesc: "One dashboard template can be linked to multiple User, Party, Role or Entity.",
        entities: {
          USER: "User",
          PARTY: "Party",
          SEGMENT: "Segment",
          ROLE: "User Type"
        },
        partySearch: "Party Search",
        selectMapping: "Select Mapping",
        selectValidParameters: "Please select valid parameters to continue",
        selectDashboardType: "Select Dashboard Type",
        selectUserType: "Select User Type",
        selectRole: "Select Role",
        selectSegment: "Select Segment",
        dashboardList: "{dashboardId} {dashboardName}",
        noTemplate: "No dashboard templates available currently. Do you want to design new template?",
        userWarning: "Invalid User",
        mappingValueWarning: "Enter Mapping Value",
        dashboardClass: {
          SEGMENT: "Segment Dashboard",
          APPLICATION_ROLE: "Application Role Dashboard",
          MODULE: "Module Dashboard",
          USER_TYPE: "User Type Dashboard"
        },
        dashboardClassName: "Dashboard Type",
        userType: "User Type"
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

  return new DashboardMappingLocale();
});