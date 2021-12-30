define([], function() {
  "use strict";

  const LocationSearchLocale = function() {
    return {
      root: {
        pageTitle: {
          locationCreate: "Adding Location"
        },
        fieldname: {
          select: "Select",
          id: "Search by ATM/Branch ID",
          atm: "ATM",
          branch: "Branch"
        },
        buttons: {
          cancel: "Cancel",
          clear: "Clear",
          search: "Search"
        }
      },
      ar: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new LocationSearchLocale();
});