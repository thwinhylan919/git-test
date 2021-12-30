define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const collateralInfoLocale = function() {
    return {
      root: {
        compName: "collateral-info",
        category: "Category",
        ownerEstimatedValue: "Estimated Value",
        vehicleModel: "Vehicle Model",
        registrationNumber: "Registration Number",
        vehicleMake: "Vehicle Make Type",
        vehicleYear: "Vehicle Year",
        vehicleIdentificationNumber: "Vehicle Identification Number",
        vehicleMakeType: "Vehicle Make Type",
        vehicleIdentification: "Vehicle Identification Number",
        collateralCategoryType: {
          GOODS_VEHICLE: "Goods Vehicle",
          PASSENGER_VEHICLE: "Passenger Vehicle"
        },
        generic: Generic
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

  return new collateralInfoLocale();
});
