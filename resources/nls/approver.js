define([], function() {
  "use strict";

  const ApproverLocale = function() {
    return {
      root: {
        pageTitle: {
          approver: "Approver"
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

  return new ApproverLocale();
});