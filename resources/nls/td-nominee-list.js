define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const TdNomineeList = function() {
    return {
      root: {
        tdNominee: {
          header: "Nominations",
          accountListTable: "Term Deposit Nominee Account List Table",
          accountNumber: "Account Number",
          primaryHolderName: "Primary Holder Name",
          holdingPattern: "Holding Pattern",
          nominee: "Nominee",
          action: "Action",
          holdingPatternType: {
            SINGLE: "Single",
            JOINT: "Joint"
          },
          isNomineeRegistered: {
            true: "Registered",
            false: "Not Registered"
          },
          actionLabels: {
            "SINGLE-R": "View/Edit",
            "SINGLE-NR": "Add",
            "JOINT-R": "View",
            "JOINT-NR": "Know More"
          },
          viewEditAlt: "Click here to View/Edit",
          viewEditTitle: "Click here to View/Edit",
          addAlt: "Click here to Add",
          addTitle: "Click here to Add",
          viewAlt: "Click here to View",
          viewTitle: "Click here to View",
          knowMoreAlt: "Click here to Know More",
          knowMoreTitle: "Click here to Know More",
          closePopup: "Close Pop-Up",
          tooltipMsg1: "Please note the facility of register nomination online is available for singly operated account only.",
          tooltipMsg2: "In case of accounts with multiple holders, you may download and print the Nomination Form. Get it signed by all the holders and submit it at the nearest Branch."
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

  return new TdNomineeList();
});