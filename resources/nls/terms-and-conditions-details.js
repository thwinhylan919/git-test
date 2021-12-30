define([], function() {
  "use strict";

  const TermsAndConditionsDetailsLocale = function() {
    return {
      root: {
        labels: {
          tncTable: "Terms and Conditions",
          srNo: "Sr No",
          tncWithSrNo: "Sr No {srNo}",
          typeGuarantee: "Type Guarantee",
          type: "Type",
          description: "Description",
          guarantee: "Guarantee",
          localGuarantee: "Local Guarantee",
          addTermsAndConditions: "Add Terms And Conditions"
        },
        errors: {
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

  return new TermsAndConditionsDetailsLocale();
});
