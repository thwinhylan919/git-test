define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";

  const productOffersLocale = function() {
    return {
      root: {
        CASA: "Savings",
        TERM_DEPOSITS: "Term Deposits",
        LOANS: "Loans",
        CREDIT_CARD: "Credit Cards",
        viewDetails: "View Details",
        offerId: "Offer Id : {offerId}",
        offerName: "{offerName}",
        interestRate: "Interest Rate : {interestRate}",
        features: "Features",
        noOffers: "There are no eligible offers available for the input loan requirements",
        offerHeading: "Please make your selection by clicking one of the offers below.",
        selectedOffer: "Selected Offer",
        click: {
          submitProductOfferIdClick: "Apply for Offer",
          submitProductOfferIdTitle: "Click for Product Offer"
        },
        offerSelect: "Please select an Offer",
        submitOffers: "Click here to submit Offers",
        selectOffer: "Click here to select {offer} offer",
        alt: {
          selectOffer: "Click here to select {offer} offer"
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

  return new productOffersLocale();
});
