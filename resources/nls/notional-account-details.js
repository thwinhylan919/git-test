  define(function() {
      "use strict";

      const notionalAccountDetails = function() {
          return {
              root: {
                  branchCode: "Branch",
                  currency: "Currency",
                  notionalAccount : "Notional Account",
                  add: "Add"
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

      return new notionalAccountDetails();
  });