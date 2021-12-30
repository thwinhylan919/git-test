define([], function() {
  "use strict";

  const LocationSearchLocale = function() {
    return {
      root: {
        pageTitle: {
          header: "ATM/Branch Maintenance"
        },
        fieldname: {
          country: "Country",
          city: "City",
          select: "Select",
          id: "ATM/Branch ID",
          atm: "ATM",
          branch: "Branch"
        },
        buttons: {
          cancel: "Cancel",
          clear: "Clear",
          search: "Search"
        },
        message: {
          noRecordFound: "No record found matching the criteria"
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