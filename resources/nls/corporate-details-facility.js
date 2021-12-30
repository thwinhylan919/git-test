define([], function () {
  "use strict";

  const CorporateDetailsLocale = function () {
    return {
      root: {
        corporateDetails: {
          initiationFor:"Facility initiation for",
          corporateDetailsHeader: "Corporate Details",
          corporateDetailsDiscription: "Here are your corporate details, please verify. For query call us on +91 98207070707",
          partyId: "Party Id",
          partyName: "Party Name",
          addressDetails: "Address Details",
          contactDetails: "Contact Details",
          incorporationDate: "Date of Incorporation",
          incorporationCountry: "Country of Incorporation",
          legalStatus: "Legal Status",
          address: "{addressLine1}, {addressLine2}, {addressLine3}, {city}, {country}, {postalCode}",
          save: "Save",
          cancel: "Cancel",
          back: "Back",
          cancelMessage: "Are you sure you want to cancel the operation?",
          yes: "Yes",
          no: "No",
          reviewwarning: "Warning",
          legalStatusValue: "LC"
        }
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

  return new CorporateDetailsLocale();
});