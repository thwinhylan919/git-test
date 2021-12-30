define([], function() {
  "use strict";

  const ContractDetailsLocale = function() {
    return {
      root: {
        labels: {
          condition: "Condition",
          description: "Description",
          contractsRequired: "Contracts Required",
          tableHeader: "Guarantee Advices Table"
        },
        errors: {
          invalidContractDesc: "Enter valid contract description",
          selectAdvicesError: "Select at least one guarantee advice to proceed"
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

  return new ContractDetailsLocale();
});
