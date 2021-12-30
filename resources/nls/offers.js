define([], function() {
  "use strict";

  const offers = function() {
    return {
      root: {
        header: "Offers",
        viewAll: "View All",
        title: "Click here to view all offers",
        imgName: "Offer on {imageName}",
        bankPromotionalOffers: "View Bank Promotional Offers",
        altofferTickImageAlt: "Offer Selection Success"
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

  return new offers();
});