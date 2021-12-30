define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const cardMembershipLocale = function() {
    return {
      root: {
        membershipNumber: "Membership Number : {membershipNumber}",
        membershipName: "Membership Name : {membershipName}",
        memberName: "Membership Name",
        memberNumber: "Membership Number",
        continue: "Continue",
        yes: "Yes",
        no: "No",
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

  return new cardMembershipLocale();
});