define([], function() {
  "use strict";

  const searchsegmentsLocale = function() {
    return {
      root: {
        SegmentDefinition: {
          header: "User Segment Maintenance",
          SegmentCode: "Segment Code",
          SegmentCodeError: "Please enter valid segment code.",
          SegmentName: "Segment Name",
          SegmentNameError: "Please enter valid segment name.",
          UserType: "User Type",
          Status: "Status",
          AllowedApplicationRoles: "Allowed Application Roles",
          Save: "Save",
          cancel: "Cancel",
          clear: "Clear",
          placeholder: "Please select",
          Search: "Search",
          searchResults: "Search Results",
          enabled: "Enabled",
          disabled: "Disabled"
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

  return new searchsegmentsLocale();
});
