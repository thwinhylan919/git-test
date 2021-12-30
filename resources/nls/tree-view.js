define([], function() {
  "use strict";

  const TreeViewLocale = function() {
    return {
      root: {
        more: "{count} More",
        zoomin : "Zoom In",
        zoomout : "Zoom Out",
        totalbalance : "Total Balance:",
        fitscreen : "Fit To Screen"
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

  return new TreeViewLocale();
});
