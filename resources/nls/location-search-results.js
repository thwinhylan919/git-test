define([], function() {
  "use strict";

  const LocationSearchResultsLocale = function() {
    return {
      root: {
        header: {
          id: "ATM/Branch ID",
          address: "Address",
          details: "Details",
          detailstable: "Show ATM/Branch Details List",
          table: "Search Table"
        }
      },
      ar: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new LocationSearchResultsLocale();
});