define([], function() {
  "use strict";

  const ColorPickerLocale = function() {
    return {
      root: {
        colorCode: "Color Code",
        colorBoxAlt:"Click here to select color {color}",
        colorBoxTitle:"Click here to select this color"
      },
      ar: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new ColorPickerLocale();
});