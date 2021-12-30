define([], function() {
  "use strict";

  const ConfirmDialog = function() {
    return {
      root: {
        yes: "Yes",
        no: "No",
        dialogMsg: "Are you sure you want to cancel the operation?",
        dialogHeader: "Warning"
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

  return new ConfirmDialog();
});