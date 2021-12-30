define([
  "ojL10n!resources/nls/generic"
], function( Generic) {
  "use strict";

  const DashboardLocale = function() {
    return {
      root: {
        "goal-category_title": "Goal Category",
        "goal-category_description": "Goal Category",
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

  return new DashboardLocale();
});
