define([
    "ojL10n!resources/nls/generic"
  ], function(Generic) { "use strict";

    const ConventionalMaturityInstructions = function() {
      return {
        root: {
            conventionalMaturityInstructions: {
                A: "Close on Maturity",
                I: "Renew Principal and Interest",
                P: "Renew Principal and Pay Out the Interest",
                S: "Renew Special Amount and Pay Out the Remaining Amount",
                T: "Renew Interest and Pay Out the Principal"
              },
          generic: Generic

        },
        ar:true,
        fr:true,
        cs:true,
        sv:true,
        en:false,
es :true,
        "en-us":false,
        el:false};
    };

    return new ConventionalMaturityInstructions();
  });
