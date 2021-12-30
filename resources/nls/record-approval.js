define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const RecordApprovalLocale = function() {
    return {
      root: {
        recordApproval: {
          bulkRecordApproval: "Bulk Record Approval"
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

  return new RecordApprovalLocale();
});