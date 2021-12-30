define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";

  const orientationLocale = function() {
    return {
      root: {
        title: "Administrative Maintenance Rules",
        generic: Generic,
        header: "Administrative Maintenance Rules",
        order: "Order",
        values: "Values",
        dealer: "Dealer Details",
        enumeration: "Enumeration",
        products: "Product",
        income: "Income",
        liability: "Liability",
        asset: "Asset",
        expense: "Expense",
        accommodation: "Accommodation",
        masterSet: "Master Set",
        review: "Review",
        count: "({selected}/{total} Selected)",
        selectedValuesTable: "Selected Values",
        beforesubmit: "You initiated a request for updating administrative maintenance rules. Please review details before you confirm.",
        dealerDetails: {
          dealerId: "Dealer ID",
          dealerName: "Dealer Name",
          dealerUrl: "URL",
          typedealerId: "Type Dealer ID",
          typedealerName: "Type Dealer Name",
          typedealerUrl: "Type URL"
        },
        message: {
          successMessage: "Administrative Maintenance Submitted successfully.",
          failureMessage: "Administrative Maintenance initiated successfully. Some Request seem to have failed."
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

  return new orientationLocale();
});
