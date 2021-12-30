define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const DashboardMappingList = function() {
    return {
      root: {
        generic: Generic,
        alts: {
          viewDashboard: "View Dashboard",
          applyDashboard: "Apply Dashboard",
          dashboardTable: "Dashboard List Table",
          dashboardList: "Dashboard List",
          deleteMapping: "Delete Mapping",
          dashboardMapping: "Dashboard Mapping",
          dashboardMappingList: "Dashboard Mapping List"
        },
        entities: {
          USER: "User",
          PARTY: "Party",
          SEGMENT: "Segment",
          ROLE: "User Type",
          BANK: "Entity"
        },
        selectMapping: "Select Mapping",
        labels: {
          mappingType: "Mapping Type",
          mappingValue: "Mapping Value",
          module: "Module",
          dashboard: "Dashboards"
        },
        dashboardClass: {
          SEGMENT: "Segment Dashboard",
          APPLICATION_ROLE: "Application Role Dashboard",
          MODULE: "Module Dashboard",
          USER_TYPE: "User Type Dashboard"
        },
        selectDashboard: "Select dashboard",
        tableHeaders: {
          dashboardName: "Dashboard Name",
          dashboardClass: "Dashboard Type",
          dashboardDesc: "Dashboard Description",
          dateCreated: "Date Created",
          actions: "Actions",
          role: "Role",
          module: "Module",
          mappedValue: "Mapped Value",
          mappingType: "Mapping Type",
          dashboardId: "Dashboard ID",
          templateId: "Template ID"
        },
        mappingType: "Mapping Type",
        header: "Mapping your templates",
        createDescription: "One dashboard template can be linked to multiple User, Party, Role or Entity. Click  below to start mapping your templates.",
        createMapping: "Create Mapping",
        pageHeader: "Dashboard Builder",
        ques1: "Are you sure you want to Delete?"
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

  return new DashboardMappingList();
});