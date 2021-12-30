define([], function() {
  "use strict";

  const createsegmentsLocale = function() {
    return {
      root: {
        SegmentDefinition: {
          header: "User Segment Maintenance",
          placeholder: "Please select",
          SegmentCode: "Segment Code",
          SegmentCodeError: "Please enter valid segment code.",
          SegmentName: "Segment Name",
          SegmentNameError: "Please enter valid segment name.",
          UserType: "User Type",
          SegmentStatus: "Status",
          AllowedApplicationRoles: "Allowed Application Roles",
          Save: "Save",
          cancel: "Cancel",
          back: "Back",
          limitHeader: "Limits",
          limitsEntityLevelConf: "Limits - Entity Level Configuration"
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

  return new createsegmentsLocale();
});
