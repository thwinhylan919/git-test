define([], function() {
  "use strict";

  const currencyAssetLocale = function() {
    return {
      root: {
        header:{
          assetWidgetHeader:"Assets & Liabilities with Net Position"
        },
        labels:{
          assets: "Assets",
          liabilities: "Liabilities",
          assetWidget: "Assets & Liabilities with Net Position",
          netPositions: "Net Positions :",
          placeholder:"Select"
        },
        messages : {
          noexchange : "Exchange rate not found",
          nodata : "No data to display"
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

  return new currencyAssetLocale();
});
