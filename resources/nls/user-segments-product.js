define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const UserSegmentsLocale = function() {
    return {
      root: {
        header: {
          productMapping: "Product Mapping"
        },
        tableHeader: {
          userType: "User Type",
          userSegments: "User Segments",
          products: "Products Mapped",
          productName: "Product Name",
          expiryDate: "Expiry Date",
          currency: "Currency",
          minAmount: "Minimum Amount",
          maxAmount: "Maximum Amount",
          status: "Status"
        },
        productMapping: {
          productModuleLabel: "Product Module",
          productType: "Product Type",
          userType: "User Type",
          userSegment: "User Segment",
          segmentTable: "Segment Table",
          productTable: "Product Table",
          selectedProducts: "Selected Products {count}",
          productModule: {
            TD: "Term Deposits",
            RD: "Recurring Deposits"
          },
          noOfMapped: "{count}",
          administrator: "Administrator",
          retailuser: "Retail User",
          corporateuser: "Corporate User",
          zeroMapped: "0",
          notAvailable: "NA",
          message: {
            noPrductMessage: "Please select product module",
            mapProductMapped: "Please map product"
          },
          selectProduct: "Select Product"
        },
        validationErrors: {
          validateAmount: "Amount should be a numeric value"
        },
        common: {
          select: "Please Select",
          review: "Review",
          view: "View",
          search: "Search",
          initiateHeader: "You initiated Product Mapping Maintenance. Please review details before you confirm!"
        },
        button: {
          mapProducts: "Map Products"
        },
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

  return new UserSegmentsLocale();
});
