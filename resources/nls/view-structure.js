  define([
      "ojL10n!resources/nls/generic",
      "ojL10n!resources/nls/view-structure-details"
  ], function(Generic, StructureDetail) {
      "use strict";

      const viewstructure = function() {
          return {
              root: {
                  structure: {
                      header: "View Account Structure Details",
                      viewDetailsHeader : "Structure Parameters",
                      instructionDetails: "Instructions Details",
                      reallocationMethod: "Reallocation Method",
                      viewDetails: "View Details",
                      statusHistory: "Status History",
                      editStructure: "Edit Structure",
                      pauseStructure: "Pause Structure",
                      resumeStructure: "Resume Structure",
                      executeStructure: "Execute Structure",
                      moreOptions: "Click here for more options",
                      options: "More options",
                      downloadPdf: "Download",
                      priority : "Priority {number}",
                      notionalAccount: "Notional Account",
                      treeView: "Tree View",
                      tabularView: "Tabular View",
                      treeViewTitlemsg: "Click for Tree view",
                      tableViewTitlemsg: "Click for Tabular View",
                      passwordNotification : "Password Combination",
                      currency: "Currency : {currencyCode}",
                      branch: "Branch : {branchCode}",
                      passCombination: "The document is password protected, it is a combination of the first 4 letters of your name (in capital letters) followed by your date of birth (in DDMM format).",
                      passwordExample: "Example, if your name is Roopa Lal and date of birth is 23-12-1980, then your password is ROOP2312",
                      type : {
                        Sweep : "Sweep",
                        Pool : "Pool",
                        Hybrid : "Hybrid"
                      },
                      browserMessages : {
                        browserNotSupported : "Browser Not Supported",
                        browserMessageDetail : "To view this feature, we recommend to use one of the following browsers",
                        chrome : "Google Chrome",
                        chromeTitle : "Google Chrome",
                        edge : "Microsoft Edge",
                        edgeTitle : "Microsoft Edge",
                        firefox : "Mozilla Firefox",
                        firefoxTitle : "Mozilla Firefox",
                        safari : "Safari",
                        safariTitle : "Safari",
                        switchTabularView : "Switch to Tabular View"
                      }
                  },
                  generic: Generic,
                  structureDetail: StructureDetail
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