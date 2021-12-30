define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const cardAddonLocale = function() {
    return {
      root: {
        heading: "Authorized Users",
        heading2: "You may add up to {noOfAddOns} additional card holders.",
        heading3: "The primary card holder will be responsible for all transactions including interest and fees changes.",
        choice: "Add an authorized user",
        isAddressSameAsPrimary: "Address is same as primary applicant's",
        primaryAddOn: "Primary Authorized User",
        addOn: "Authorized User {index}",
        additionalAddOn: "Additional Authorized User",
        addAnotherCard: "Add another authorized user",
        removeCardClick: "Click For Card remove",
        addCardClick: "Click For Card Add",
        addCardClickInfo: "Click For Add card Info",
        removeCardClickInfo: "Click For Card removal Info",
        editCardClick: "Click For Edit card",
        editCardClickInfo: "Click For Edit card Info",
        additionalCardClick: "Click For Additional card",
        additionalCardClickInfo: "Click For Additional card Info",
        compName: "card-add-on",
        reviewAddress: "{line1}, {line2}, {city} {state} {zip}",
        reviewAddress2: "{line1}, {city} {state} {zip}",
        salutation: "Salutation",
        name: "Name",
        optional: "(optional)",
        salFirstLast: "{salutation} {firstName} {lastName}",
        salFirstMiddleLast: "{salutation} {firstName} {middleName} {lastName}",
        salFirstMiddleLastSuffix: "{salutation} {firstName} {middleName} {lastName} {suffix}",
        salFirstLastSuffix: "{salutation} {firstName} {lastName} {suffix}",
        firstName: "First Name",
        middleName: "Middle Name",
        middleNameOptional: "Middle Name <br>(optional)",
        suffixOptional: "Suffix <br>(optional)",
        lastName: "Last Name",
        dateOfBirth: "Date of Birth",
        accomodationType: "Accommodation Type",
        email: "Email",
        stayingSince: "Staying Since",
        address: "Address",
        resAddr: "Residential Address",
        previousAddress: "Previous Address",
        suffix: "Suffix",
        citizenship: "Us",
        countryOfCitizenship: "Citizenship",
        citizenshipRequirement: "We need your citizenship information to determine eligibility for our products and also to comply with the USA PATRIOT Act.",
        countryClick: "Click For Country",
        countryForClick: "Click For Country",
        isPermanentResident: "Permanent Resident",
        permanentRes: "Permanent Resident",
        countryOfResidence: "Country of Residence",
        countryOfCitizenshipClick: "Click For Citizenship",
        ssn: "Social Security Number",
        poBoxes: "(P.O. Boxes are not allowed)",
        prevResAddr: "Previous Residential Address",
        SSNClick: "Click For Social Security Number",
        SSNtext: "We need your Social Security Number to verify your identity and to acquire credit history to process your application.",
        generic: Generic,
        messages: {
          salutation: "Please select a salutation",
          firstName: "Please enter a valid first name",
          lastName: "Please enter a valid last name",
          dob: "Please enter a valid date of birth",
          name: "Please enter a valid name",
          accomodationType: "Please select an accommodation type",
          stayingSince: "Please enter a valid date",
          citizenship: "Please select your country of citizenship",
          residentCountry: "Please select your country of residence",
          ssn: "Please enter a valid social security number"
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };

  return new cardAddonLocale();
});
