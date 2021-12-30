define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const investmentaccountprimaryassetLocale = function() {
    return {
      root: {
        heading: {
          PrimaryAsset: "Primary Asset",
          pageSectionHeading : "Asset {asset}"
        },
        PrimaryAsset: {
          Assets: "Assets",
          Asset: "Asset",
          value: "Value",
          add : "Add Asset",
          select : "Select",
          clickToDelete : "Click to Delete",
          save : "Save"
        },
        messages: Messages,
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

  return new investmentaccountprimaryassetLocale();
});
