define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/obdx-module-list"], function(Generic, ModuleList) {
  "use strict";

  const DashboardListLocale = function() {
    return {
      root: {
        generic: Generic,
        header: "Design Dashboard",
        header2: "Build your own Dashboard",
        header3: "Mapping your templates",
        createDescription: "You can create and configure dashboard templates and reuse them later.",
        createMappingDescription: "One dashboard template can be linked to multiple User, Party, Role or Entity. Click  below to start mapping your templates.",
        createMapping: "Create Mapping",
        alts: {
          viewDashboard: "View Dashboard",
          applyDashboard: "Apply Dashboard",
          dashboardTable: "Dashboard List Table",
          dashboardList: "Dashboard List",
          deleteMapping: "Delete Mapping",
          dashboardMapping: "Dashboard Mapping"
        },
        selectUser: "User Type",
        selectModule: "Select Module",
        tableHeaders: {
          dashboardName: "Template Name",
          dashboardDesc: "Description",
          dashboardClassValue: "Value",
          dashboardClass: "Type",
          dateCreated: "Date Created",
          actions: "Actions",
          role: "Role",
          module: "Module",
          mappedValue: "Mapped Value",
          mappingType: "Mapping Type",
          dashboardId: "Template ID"
        },
        segments: {
          retail: "Retail",
          corporate: "Corporate",
          admin: "Administrator"
        },
        personas: ModuleList,
        dashboard: "Dashboard",
        dashboardClass: {
          SEGMENT: "Segment",
          APPLICATION_ROLE: "Application Role",
          MODULE: "Module",
          USER_TYPE: "User Type"
        },
        entities: {
          USER: "User",
          PARTY: "Party",
          ROLE: "Role",
          BANK: "Entity"
        },
        mappingType: "Mapping Type",
        btns: {
          view: "View",
          apply: "Apply",
          setDefault: "Set Default",
          map: "Map"
        },
        navBarDescription: "Dashboard Builder and Mapping",
        pageHeader: "Dashboard Builder",
        templateName: "Template Name",
        titles: {
          design: "Design",
          mapping: "Mapping"
        },
        searchByTemplateName: "Search by Template Name"
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

  return new DashboardListLocale();
});
