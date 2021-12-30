define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const designDashboardLocale = function() {
      return {
        root: {
            widgetlist:"Widget List",
            dashboardDesign:"Dashboard Design",
            plzWait:"Please Wait...",
            componentInput:"Component Input",
            compoSearch:"Search Widgets",
            dropWidgets:"Drop Widgets here",
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

    return new designDashboardLocale();
  });