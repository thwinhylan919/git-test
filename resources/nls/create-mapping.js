define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const CreateMappingLocale = function() {
    return {
      root: {
        generic: Generic,
        heading: {
          create: "Create Mapping",
          colors: "Colors"
        },
        noBrandCreated: "No brand exists for mapping. Please create a brand and then try again.",
        update: "Update",
        labels: {
          mappingType: "Mapping Type",
          mappingValue: "Mapping Value",
          segments: "Segment",
          brand: "Brand",
          selectedParty: "{name} ({partyid})"
        },
        entities: {
          USER: "User",
          PARTY: "Party",
          SEGMENT: "Segment",
          ROLE: "User Type",
          BANK: "Entity"
        },
        navBarDescription: "Color Selection Method",
        brandList: "{brandName} - {brandId}",
        mappingTransaction: "Brand Mapping",
        updateTransaction: "Brand Update",
        selectMapping: "Select Mapping Type",
        selectSegment: "Select Segment",
        selectBrand: "Select Brand",
        partySearch: "Party Search",
        userWarning: "Invalid User"
      },
      ar: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new CreateMappingLocale();
});