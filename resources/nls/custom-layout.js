define([], function() {
    "use strict";

    const CasaAccountOverviewLocale = function() {
      return {
        root: {
            pageHeader:"Custom Layout",
            pageHeaderDescription:"Define your own grid up to 12 columns across the page. All the widgets fall within and around this grid.",
            gridStructure:{
              "3by9":"3 by 9 columns",
              "9by3":"9 by 3 columns",
              "4by8":"4 by 8 columns",
              "8by4":"8 by 4 columns"
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

    return new CasaAccountOverviewLocale();
  });