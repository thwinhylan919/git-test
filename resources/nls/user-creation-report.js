define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const UserCreationReportLocale = function() {
    return {
      root: {
        userCreation: {
          dateFrom: "From",
          dateTo: "To",
          userType: "User Type",
          select: "Select",
          partyId: "Party ID",
          duration: "Duration"
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