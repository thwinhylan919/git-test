define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const networkRule = function() {
    return {
      root: {
        networkRule: {
          header:"Network Suggestion Configuration",
          reviewHeader:"You initiated a request for Network Configuration Rule. Please review details before you confirm!",
          networkRuleDefinition:"Rule Parameter Definition",
          actionDescription:"Select the parameters based on which the rule should be executed.",
          ruleDescription:"More Details",
          propertyList : {
            DAILY_MONTHLY_LIMIT : "Daily / Monthly Limits",
            PAYEE_BANK_NETWORK_SUPPORT : "Payee Bank Network Support",
            NETWORK_SPECIFIC_LIMIT : "Network Specific Limits",
            WORKING_WINDOW : "Working Window"
          },
          generic: Generic
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

  return new networkRule();
});