define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const UserCreationReportLocale = function() {
    return {
      root: {
        userSegment: {

          userType: "User Type",
          select: "Select",
          userSegments: "User Segments",
          duration: "Duration",
          reportType: "Report Type",
          summary: "Summary",
          detailed: "Detailed"
        },
        generic: Generic
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

  return new UserCreationReportLocale();
});