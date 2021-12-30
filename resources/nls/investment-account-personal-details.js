define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const PersonalDetailsLocale = function() {
    return {
      root: {
        fullName : "Full Name",
        openAccountHeader: "Open Investment Account",
        dateOfBirth : "Date of Birth",
        gender : "Gender",
        taxId : "Tax Id",
        personalId : "Personal Id",
        personalIdNo : "Personal Id Number",
        fatherName : "Spouse/Father's Name",
        motherName : "Mother's Name",
        select : "Select",
        nameError : "Please enter a valid name",
        spouseNameError : "Please enter a valid spouse/father name",
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

  return new PersonalDetailsLocale();
});
