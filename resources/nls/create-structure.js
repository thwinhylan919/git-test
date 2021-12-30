  define([
      "ojL10n!resources/nls/generic"
  ], function(Generic) {
      "use strict";

      const createStructure = function() {
          return {
              root: {
                  editAccountStructure: "Edit Account Structure",
                  createAccountStructure: "Create Account Structure",
                  structureInitiation: "Structure Initiation",
                  structureDetails: "Structure Details",
                  chooseAccounts: "Choose Accounts",
                  accountMapping: "Account Mapping",
                  linkAccounts: "Link Accounts",
                  setInstrucions: "Set Instructions",
                  alt: "Click here to {reference}",
                  title: "Click here to {reference}",
                  jumpto: "Jump to {stage}",
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

      return new createStructure();
  });