define([], function() {
  "use strict";

  const FooterLocale = function() {
    return {
      root: {
        //copyright: "Copyright © 2006, 2017, Oracle and/or its affiliates. All rights reserved.",
	copyright: " Copyright	© 2021 Myanma Tourism Bank . All Rights Reserved.",
        //securityInfo: "Security Information",
        //security: "Security",
        //info: "Information",
        //tnc: "Terms and Conditions"
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

  return new FooterLocale();
});