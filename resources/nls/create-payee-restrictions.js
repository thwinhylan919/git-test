define(
  ["ojL10n!resources/nls/generic"],
  function(Generic) {
    "use strict";

    const PayeeCountLimitInquire = function() {
      return {
        root: {
            payeeCount: {
              userType:"User Type",
              userSegment:"User Segment",
              totalpayeecount: "Cumulative Payee Restriction",
              payeeRestriction: "Payee Restriction",
              INTERNAL: "Internal Payment",
              INTERNATIONAL: "International Payment",
              DOMESTIC: "Domestic Payment",
              title: "Payee Restriction Setup",
              effectiveDateWarning: "Changes done will be effective from next day",
              DOMESTICDEMANDDRAFT: "Domestic demand draft",
              INTERNATIONALDEMANDDRAFT: "International demand draft",
              UKDOMESTICFASTER: "UK domestic faster",
              UKDOMESTICNONFASTER: "UK domestic non-faster",
              SEPADOMESTICCARDTRANSFER: "SEPA card payment",
              SEPADOMESTICCREDITTRANSFER: "SEPA credit transfer",
              totalpayeepermittedperday: "Total number of Payees permitted per day",
              payeepermittedperday: "Payees per day",
              payeetype: "Payee Type",
              header: "Payee Count Limit",
              draftpayee: "Draft Payee",
              accountpayee: "Account Payee",
              info: "Information"
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

    return new PayeeCountLimitInquire();
  }
);