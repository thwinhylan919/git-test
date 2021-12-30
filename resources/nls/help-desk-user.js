define([
  "ojL10n!resources/nls/generic"
], function(Generic, HelpDeskUser) {
  "use strict";

  const HelpDeskUserLocale = function() {
    return {
      root: {
        helpDeskUser: {
          headerName: "User Helpdesk",
          userName: "User Name",
          partyId: "Party ID",
          fullName: "Full Name",
          userSegment: "User Segment",
          searchError: "Search Error",
          searchErrorMessage: "Please enter either user name or party id.",
          searchResults: "Search Results",
          helpDeskUserSearch: "Help Desk User Search",
          userTypeMandatory: "Please select a User Type",
          invalidInfo: "Please provide the correct details",
          dataRequired: "Please provide at least one search input.",
          noUserType: "Please provide User Type",
          recordNotFound: "No such record found."
        },
        generic: Generic,
        helpdeskuser: HelpDeskUser
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

  return new HelpDeskUserLocale();
});