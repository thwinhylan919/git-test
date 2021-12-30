define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const ReadNominee = function() {
    return {
      root: {
        readNominee: {
          header: "View Nominee",
          deleteAlt: "Click here to delete nominee",
          deleteTitle: "Click here to delete nominee",
          accountNumber: "Account Number",
          nomineeName: "Nominee Name",
          nomineeDOB: "Nominee Date of Birth",
          relationShip: "Relationship",
          nomineeAddress: "Nominee Address",
          isMinor: "Yes,I would like to enter Guardian Details",
          minorText: "In case Nominee is a minor below 18 years",
          isMinorValue: {
            true: "Yes",
            false: "No"
          },
          guardianName: "Guardian Name",
          guardianAddress: "Guardian Address",
          nomineeDelete: "Delete Nominee",
          deleteNominee: "Are you sure you want to delete {nomineeName} ?",
          deleteSuccessMessage: "Delete Nominee Successful."
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

  return new ReadNominee();
});