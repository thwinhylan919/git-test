  define([
      "ojL10n!resources/nls/generic"
  ], function(Generic) {
      "use strict";

      const assembleStructure = function() {
          return {
              root: {
                  labels: {
                      overlayHeader: "Add Header Account",
                      createHeaderAccount: "Create Header Account",
                      childAccountLinkHeader: "Link Accounts",
                      replaceOverlayHeader: "Replace Account",
                      link: "Link",
                      remove: "Remove",
                      replace: "Replace",
                      currency: "Currency : {currencyCode}",
                      branch: "Branch : {branchCode}",
                      validate: "Validate",
                      removeMessage1: "Selected account and all the child accounts beneath will be removed.",
                      removeMessage2: "Are you sure you want to remove?",
                      treeView: "Tree View",
                      tabularView: "Tabular View",
                      treeViewTitlemsg: "Click for Tree view",
                      tableViewTitlemsg: "Click for Tabular View",
                      moreOptionsAlt: "Click here for more options",
                      moreOptionsTitle: "Click here for more options",
                      priority: "Priority {number}",
                      accountCheck: {
                          true: "External",
                          false: "Internal"
                      }
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
                  message: {
                      validateSuccess: "Structure validated successfully."
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

      return new assembleStructure();
  });