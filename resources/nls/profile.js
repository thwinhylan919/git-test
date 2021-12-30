define([], function() {
  "use strict";

  const CorpProfileLocale = function() {
    return {
      root: {
        lastLoginTime: "Last Login Time",
        email: "Email",
        phone: "Phone Number",
        dob: "Date of Birth",
        address: "Communication Address",
        city:"City",
        country:"Country",
        pincode:"Zip Code",
        ok: "Ok",
        panCard: "Pan Card",
        aadharCard: "Aadhar Card",
        heading: "My Profile",
        profile: "Profile Image",
        personalInformation: "Personal Information",
        contactInformation: "Contact Information",
        addressDetails: "Address Details",
        name: "{firstName} {lastName}",
        download: "Download",
        downloadFile: "Download Profile",
        next : "Next",
        fax: "Fax",
        save: "Save",
        cancel: "Cancel",
        update: "Update Field",
        verification : "Verification",
        successMessage : "Your details have been updated successfully!!",
        close: "Close",
        confirm: "Confirmation",
        line1: "Line 1",
        line2: "Line 2",
        line3: "Line 3",
        line4: "Line 4",
        skip : "Skip"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: true
    };
  };

  return new CorpProfileLocale();
});
