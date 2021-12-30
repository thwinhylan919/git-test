define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const applicationStatusHistoryLocale = function() {
    return {
      root: {
        state: "State",
        remarks: "Remarks",
        action: "Action",
        actedBy: "Acted By",
        date: "Date",
        statusHistory: "Status History",
        updatedOn: "Updated On",
        processing: "Processing",
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

  return new applicationStatusHistoryLocale();
});