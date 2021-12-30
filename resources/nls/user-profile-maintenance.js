define([], function () {
  "use strict";

  const UserPrintInformationLocale = function () {
    return {
      root: {
        pageTitle: {
          userProfileMaintenance: "User Profile Maintenance"
        },
        fieldname: {
          userType: "User Type",
          personalInfo: "Personal Information",
          contactInfo: "Contact Information",
          contact: "Contact",
          identification: "Identification"
        },
        messages: {
          notMaintained: "You have not yet created any Maintenance",
          reviewHeader: "You initiated a request for User Profile Maintenance. Please review details before you confirm."
        },
        buttons: {
          create: "Create",
          edit: "Edit",
          cancel: "Cancel",
          back: "Back",
          save: "Save",
          confirm: "Confirm"
        },
        header: {
          details: "Details to be displayed on User Profile",
          userProfileTable: "User Profile Table",
          userDetails: "User Details",
          modificationAllowed: "Modification Allowed",
          review: "Review"
        }
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

  return new UserPrintInformationLocale();
});
