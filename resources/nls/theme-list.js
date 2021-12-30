define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const ThemeListLocale = function() {
    return {
      root: {
        generic: Generic,
        header: "Manage Brand",
        modules: {
          retail: "Retail",
          corporate: "Corporate"
        },
        alts: {
          viewTheme: "View Brand",
          applyTheme: "Apply Brand",
          themeTable: "Brand Table",
          themeList: "Brand List",
          deleteMapping: "Delete Mapping",
          brandMapping:"Brand Mapping Table"
        },
        menu: {
          brand: "Brand",
          mapping: "Mapping"
        },
        tableHeaders: {
          themeId: "Brand Id",
          themeName: "Brand Name",
          themeDesc: "Brand Description",
          dateCreated: "Date Created",
          actions: "Actions",
          mappedValue: "Mapped Value",
          mappingType: "Mapping Type",
          dashboardId: "Dashboard Id"
        },
        titles: {
          viewTheme: "View Brand",
          applyTheme: "Apply Brand",
          currentTheme: "Current Brand"
        },
        btns: {
          view: "View",
          apply: "Apply"
        },
        entities: {
          USER: "User",
          PARTY: "Party",
          ROLE: "User Type",
          SEGMENT: "Segment",
          BANK: "Entity"
        },
        navBarDescription: "User Interface Modules",
        brandDeploy: "Brand {brandId} Deployed",
        mappingType: "Mapping Type",
        selectMapping: "Select Mapping Type",
        createMapping: "Create Mapping",
        deleteMsg: "Are you sure you want to delete?",
        deleteSuccess: "Mapping Deleted Successfully"
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

  return new ThemeListLocale();
});