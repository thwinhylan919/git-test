define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const LinkAccountLocale = function() {
    return {
      root: {
        linkAccountHeading: "FuturaMax",
        info: "With FuturaMax, you can manage your money at one place",
        title: "Link Account",
        linkAccount: "Link Account",
        linkmoreAccount: "Link/delink an account",
        goToLinkAccountDashboard: "View Dashboard",
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new LinkAccountLocale();
});
