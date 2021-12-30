define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/obdx-module-list"], function (Generic, ModuleList) {
  "use strict";

  const DashboardCreateLocale = function () {
    return {
      root: {
        header: "Dashboard Builder",
        header2: "My Dashboard",
        header3: "Custom Layout",
        designSave: "New Dashboard Design",
        designDelete: "Dashboard Restore",
        ques1: "Are you sure you want to switch to default dashboard?",
        noEmptyDashboard: "You can not save empty dashboard",
        navBarDescription: "Select the Design Type",
        personalizationTxt: "To personalize your dashboard, select a widget from left panel and drag it to your dashboard on the right",
        confirmationMessageDeletePersonalization: "You have successfully switched to your default dashboard",
        labels: {
          deleteDashboardBtn: "Switch to default",
          description: "Description",
          name: "Dashboard Name",
          templateName: "Template Name",
          role: "Role",
          module: "Module",
          segment: "Segment",
          selectRole: "Select Role",
          selectModule: "Select Module",
          selectSegment: "Select Segment",
          dashboardDesc: "Dashboard Description",
          tabLayout: "Tab Layout",
          deleteMe: "Delete Me",
          gridChoice: "Select Grid Type For Row",
          indivisualGridSize: "Enter Column Size for each Grid",
          createMsg: "Customize your Dashboards for your Users.",
          dashboardType: "Dashboard Type",
          layout: {
            desktop: "Desktop",
            tab: "Tab",
            mobile: "Mobile"
          },
          segments: {
            admin: "Administrator",
            retail: "Retail",
            corporate: "Corporate"
          },
          dashboardClass: {
            SEGMENT: "Segment",
            APPLICATION_ROLE: "Application Role",
            MODULE: "Module",
            USER_TYPE: "User Type"
          },
          contextMenu: {
            oneXone: "1x1",
            oneXtwo: "1x2",
            oneXthree: "1x3",
            oneXfour: "1x4",
            oneXfive: "1x5",
            customGrid: "Custom Grid",
            removeMe: "Remove Me"
          }
        },
        errorMsg: "Invalid Grid Size",
        titleInfo: "Minimum required column size is {width}",
        componentInput: "Component Input",
        errorMsg2: "Addition of all grid columns should not go beyond 12 columns",
        errorMsg3: "Grid size can not be empty",
        addRowInfo: "To add columns, right click > select columns",
        invalidTemplateName: "Enter valid name for template",
        watchTutVid: "Watch Tutorial Video",
        TutVid: "Tutorial Video",
        compoSearch: "Search Component",
        generic: Generic,
        moduleList: ModuleList
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

  return new DashboardCreateLocale();
});