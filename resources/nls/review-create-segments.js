define([], function() {
  "use strict";

  const reviewcreatesegmentsLocale = function() {
    return {
      root: {
        SegmentDefinition: {
          review: "Review",
          header: "User Segment Maintenance",
          reviewHeader: "Review Segment Definition",
          SegmentCode: "Segment Code",
          SegmentName: "Segment Name",
          UserType: "User Type",
          SegmentStatus: "Status",
          AllowedApplicationRoles: "Allowed Application Roles",
          cancel: "Cancel",
          Enabled: "Enabled",
          Disabled: "Disabled",
          reviewwarning: "Warning!",
          cancelMessage: "Are you sure do you want to cancel the operation ?",
          approle: "Allowed Application Roles",
          limitHeader: "Limits",
          yes: "Yes",
          no: "No",
          edit: "Edit",
          confirm: "Confirm",
          back: "Back",
          confirmScreenheaderCreate: "You initiated a request for creating user segment. Please review details before you confirm.",
          confirmScreenheaderEdit: "You initiated a request for updating user segment. Please review details before you confirm.",
          noLimitsAssigned: "No limit packages have been assigned.",
          limitsEntityLevelConf: "Limits - Entity Level Configuration",
          global: "Global"
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

  return new reviewcreatesegmentsLocale();
});
