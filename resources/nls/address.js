define([], function() {
  "use strict";

  const addressLocale = function() {
    return {
      root: {
        deliveryLocation: "Delivery Location",
        country: "Country",
        state: "State",
        city: "City",
        zipCode: "Zip Code",
        address1: "Address Line 1",
        address2: "Address Line 2 <br>(optional)",
        address: {
          branch: "Branch Near Me",
          address: "My Address",
          addressType: "Address Type"
        },
        messages: {
          country: "Please select a country",
          state: "Please select a state",
          city: "Please enter a valid city",
          zipcode: "Please enter a valid zip code",
          address: "Please enter valid address details",
          selectAddress: "Please Select Address",
          addressType: "Address Type",
          select: "Please Select",
          selectCity: "Please Select City",
          selectBranch: "Please Select Branch",
          branch: "Please select a valid branch"
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

  return new addressLocale();
});