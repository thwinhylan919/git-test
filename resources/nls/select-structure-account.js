  define([
      "ojL10n!resources/nls/generic",
      "ojL10n!resources/nls/structure-account-mapping"
  ], function(Generic, Structure) {
      "use strict";

      const addAccount = function() {
          return {
              root: {
                  labels: {
                      selectColumns: "Select Columns",
                      branch: "Branch",
                      balanceCompensation: "Balance Compensation",
                      add: "Add",
                      replace : "Replace",
                      overlaytableheader: "Table for accounts added for a structure",
                      searchBy: "Party Name, Account Number, Branch",
                      radioLabel: "Radio Selection",
                      checkboxLabel: "Select check box",
                      allCheckboxLabel: "Select all check box",
                      link: "Link",
                      cashCCMethod: "Cash Concentration Method",
                      pleaseSelect: "Please Select"
                  },
                  generic: Generic,
                  structure: Structure
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

      return new addAccount();
  });