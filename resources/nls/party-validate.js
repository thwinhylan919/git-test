define([], function() {
  "use strict";

  const PartyValidateLocale = function() {
    return {
      root: {
        validateParty: "Validate Party",
        corporateid: "Party ID",
        corporatename: "Party Name",
        fetch: "Fetch",
        user: "User",
        userGroup: "User Group",
        details: "Show Party Details List",
        cancel: "Cancel",
        clear: "Clear",
        noDescription: "Please enter Party ID or Party Name.",
        search: "Search",
        validatePartyId: "Enter only alphanumeric values.",
        validatePartyName: "Enter valid party name."
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new PartyValidateLocale();
});