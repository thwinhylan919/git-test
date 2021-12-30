define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const NominationDetailsLocale = function() {
    return {
      root: {
        type : "Nominee Type",
        new : "New",
        existing : "Existing",
        name : "Name",
        relationship : "Relationship",
        dateOfBirth : "Date of Birth",
        taxId : "Tax Id",
        share : "Share (%)",
        select : "Select",
        openAccountHeader: "Open Investment Account",
        addNominee : "Add Nominee",
        nameError : "Please enter a valid name",
        nomineeNumber : "Nominee {nominee}",
        clickToDelete : "Click to delete",
        deleteNominee : "Delete Nominee",
        accountNumber : "Account Number",
        nominee : "Nominee",
        nomineeHint: "Enter 1 or more characters, up to a maximum of 100",
        existingNomineeMsg : "You can add up to {number} nominees for each investment account. Please select existing nominees from your Current & savings accounts shown below.",
        newNomineeMsg : "You can add up to {number} nominees for each investment account.",
        sharePercentageError : "Nominee share % should add up to 100%",
        duplicateNomineeMsg : "Nominee already exists, please choose a different nominee",
        nominationDetails : "Nomination Details",
        numberError : "Please enter a valid number",
        percentError : "% value entered can not be greater than 100%",
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

  return new NominationDetailsLocale();
});
