define([], function() {
  "use strict";

  const BannerResources = function() {
    return {
      root: {
      showAll : "View More"
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

  return new BannerResources();
});
