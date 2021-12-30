define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const ViewDashboardDesignLocale = function() {
    return {
      root: {
        generic: Generic,
        pageHeader: "Dashboard Builder",
        pageHeader2: "My Dashboard",
        designDelete: "Dashboard Template",
        restorePopup: "Dashboard Restore",
        ques1: "Are you sure you want to switch to default dashboard ?",
        personalisedConfirmMsg:"Dashboard has been personalized successfully!",
        labels: {
          switchToDefault: "Switch to default dashboard",
          description: "Description",
          name: "Dashboard Name",
          role: "Role",
          module: "Module",
          topPanel: "Top Panel",
          leftPanel: "Left Panel",
          middlePanel: "Middle Panel",
          rightPanel: "Right Panel",
          selectRole: "Select Role",
          selectModule: "Select Module",
          previous: "Previous",
          desktopDesign: "Desktop",
          tabDesign: "Tab",
          mobileDesign: "Mobile",
          reviewDesign: "Review Design",
          deleteMyDashboard:"Delete my dashboard",
          editMyDashboard:"Edit my dashboard"
        },
        reviewDashboard: "Review dashboard before you confirm!",
        confirmationMessageDeletePersonalization: "You have successfully switched to your default dashboard",
        switchView: "Switch View"
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

  return new ViewDashboardDesignLocale();
});