define([
  "ojs/ojcore",
  "knockout",
  "ojL10n!resources/nls/color-picker",
  "ojs/ojcolor",
  "ojs/ojcolorspectrum"
], function(oj, ko,locale) {
  "use strict";

  return function(params) {
    const self = this;

    self.resourceBundle = locale;
    self.colorValue = params.color;
    self.selectedColors=params.selectedColors||ko.observableArray();
    self.hexValue = ko.observable();

    function hex2rgb(temp) {
      const hex = temp.replace("#", ""),
       r = parseInt(hex.substring(0, 2), 16),
       g = parseInt(hex.substring(2, 4), 16),
       b = parseInt(hex.substring(4, 6), 16);

      return "rgba(" + r + "," + g + "," + b + "," + 1 + ")";
    }

    function rgb2hex(rgb) {
      rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

      return rgb && rgb.length === 4 ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : "";
    }

    self.hexValue.subscribe(function(newValue) {
      let temp = newValue;

      if (temp.length === 4) {
        temp = "#" + newValue[1] + newValue[1] + newValue[2] + newValue[2] + newValue[3] + newValue[3];
        self.hexValue(temp);
      }

      if (temp.length === 7) {
        self.colorValue(new oj.Color(hex2rgb(temp)));
      }
    });

    self.setPrevColor=function(color){
      self.colorValue(new oj.Color(color));
    };

    self.colorValue.subscribe(function(newValue) {
      if(newValue!==null){
        self.hexValue(rgb2hex(newValue.toString()));
      }
    });
  };
});
