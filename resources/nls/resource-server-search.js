define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const ResourceServerSearchLocale = function() {
    return {
      root: {
        resourceServerSearch: {
          resoureServerMt: "Resource Server Maintenance",
          name: "Resource Server Name",
          domainName: "Identity Domain",
          select: "Select",
          selectIdentityDomain: "Please select a Identity Domain",
          search: "Search",
          create: "Create",
          back: "Back",
          cancel: "Cancel",
          clear: "Clear",
          note: "Note",
          description1: "Resource server is the server that contains the user's information that is being accessed by the third-party application and handles authenticated requests after the application has obtained an access token.",
          description: "Description",
          invalidResourceServerName: "Please enter a valid Resource Server name",
          noDescription: "Please provide at least one parameter to search",
          searchResults: "Search Results",
          details: "Resource Server details",
          noData: "No Resource Server to display."
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

  return new ResourceServerSearchLocale();
});