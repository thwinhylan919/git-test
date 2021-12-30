define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const ReviewDashboardMappingLocale = function() {
    return {
      root: {
        generic: Generic,
        pageHeader: "Review Dashboard Mapping",
        header: "Dashboard Mapping",
        labels: {
          mappingType: "Mapping Type",
          mappingValue: "Mapping Value",
          template: "Template"
        },
        mappingType: {
          USER: "User",
          PARTY: "Party",
          SEGMENT: "Segment",
          ROLE: "User Type"
        },
        reviewMapping: "Review dashboard mapping before you confirm!"
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

  return new ReviewDashboardMappingLocale();
});