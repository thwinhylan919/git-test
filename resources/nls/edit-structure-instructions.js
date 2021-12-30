  define([
      "ojL10n!resources/nls/generic",
      "ojL10n!resources/nls/view-structure-details"
  ], function(Generic, StructureDetail) {
      "use strict";

      const viewstructure = function() {
          return {
              root: {
                  structure: {
                      instructionDetails: "Instructions Details",
                      reallocationMethod: "Reallocation Method",
                      moreOptions: "Click here for more options",
                      options: "More options",
                      instructionInfo:"Instruction Information",
                      treeView: "Tree View",
                      tabularView: "Tabular View",
                      treeViewTitlemsg: "Click for Tree view",
                      tableViewTitlemsg: "Click for Tabular View",
                      closePopupAlt:"Close instruction information Pop-Up",
                      closePopupTitle:"Click here to close instruction information Pop-Up",
                      instructionInfoTitlemsg:"Click here for Instruction Information",
                      currency: "Currency : {currencyCode}",
                      branch: "Branch : {branchCode}",
                      priority : "Priority {number}",
                      instructionInfoMessage: "Click on the connector line to set up the instructions between an account pair."
                  },
                  browserMessages: {
                      browserNotSupported: "Browser Not Supported",
                      browserMessageDetail: "To view this feature, we recommend to use one of the following browsers",
                      chrome: "Google Chrome",
                      chromeTitle: "Google Chrome",
                      edge: "Microsoft Edge",
                      edgeTitle: "Microsoft Edge",
                      firefox: "Mozilla Firefox",
                      firefoxTitle: "Mozilla Firefox",
                      safari: "Safari",
                      safariTitle: "Safari",
                      switchTabularView: "Switch to Tabular View"
                  },
                  structureType: {
                      Sweep: "Sweep",
                      Pool: "Pool",
                      Hybrid: "Hybrid"
                  },
                  generic: Generic,
                  structureDetail:StructureDetail
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

      return new viewstructure();
  });