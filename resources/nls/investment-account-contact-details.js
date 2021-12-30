define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";

  const ContactDetailsLocale = function() {
    return {
      root: {
        country: "Country",
        state: "State",
        city: "City",
        zipCode: "Post Code",
        address1: "Address Line 1",
        address2: "Address Line 2",
        contactNo : "Contact Number",
        emailId : "Email Id",
        addAnotherNumber : "Add alternate number",
        addAnotherEmailId : "Add alternate email id",
        openAccountHeader: "Open Investment Account",
        alternateContactNumber : "Alternate Contact Number",
        alternateEmailId: "Alternate Email Id",
        duplicateContactNoError : "Contact Number already exist",
        duplicateEmailError : "Email already exist",
        clickToAddContactNo : "Click To Add Alternate Contact Number",
        clickToAddEmail: "Click To Add Alternate Email",
        clickToDelete : "Click to delete entry",
        deleteContact : "Delete Contact",
        deleteEmail : "Delete Email",
        titleContactNo : "Add Alternate Contact Number",
        titleEmail : "Add Alternate Email",
        contactHint: "Enter appropriate digits, up to a maximum of 12",
        emailHint: "Enter appropriate characters, up to a maximum of 50",
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

  return new ContactDetailsLocale();
});
