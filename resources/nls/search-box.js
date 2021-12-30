define([], function() {
  "use strict";

  const SearchBoxLocale = function() {
    return {
      root: {
        searchBoxDetails: {
          labels: {
            search: "Search By {searchBy}"
          }
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

  return new SearchBoxLocale();
});