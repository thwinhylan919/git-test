define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/theme-properties",
  "ojs/ojcolor",
  "ojs/ojinputnumber",
  "ojs/ojcolorspectrum"
], function(oj, ko, $, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.parameters = rootParams.rootModel;
    self.bindvariable = rootParams.obdxVariables;
    self.modalWindowId = ko.observable("typographyColorPaletteModal" + rootParams.baseModel.incrementIdCount());
    self.resourceBundle = locale;
    self.sizeUnit = "rem";
    self.readOnly = rootParams.readOnly || false;
    self.colorValue = ko.observable(new oj.Color("rgba(255,255,255,0.8)"));
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("color-picker");
    self.selectedColors=rootParams.selectedColors||ko.observableArray();

    /**
     * The function called to set CSS properties.
     *
     * @param  {Object} propertyName - The property to set.
     * @param  {Object} value - The value for the property to set.
     * @function setCSSProps
     * @returns {void}
     */
    function setCSSProps(propertyName, value) {
      if (typeof value === "number") {value += self.sizeUnit;}

      document.querySelector(".preview-theme-container").style.setProperty(propertyName, value);
    }

    self.updateColorBox=function(color){
      const index=rootParams.selectedColors().findIndex(function(element){
        if(element.color===color){
          return true;
        }

        return false;
      });

      if(index===-1){
        self.selectedColors.splice(4,1);

        self.selectedColors().splice(0,0,{color:color,
          count:1
        });
      }
    };

    self.showPaleteBox = function() {
      if (!self.readOnly) {
        if (self.bindvariable[rootParams.rootModel.color]()) {
          self.colorValue(new oj.Color(self.bindvariable[rootParams.rootModel.color]()));
        }

        $("#" + self.modalWindowId()).trigger("openModal");
      }
    };

    self.hideColorPalete = function() {
      $("#" + self.modalWindowId()).hide();
    };

    self.saveSelectedColor = function() {
      self.bindvariable[rootParams.rootModel.color](self.colorValue().toString());
      setCSSProps(rootParams.rootModel.color, self.colorValue().toString());
      self.updateColorBox(self.colorValue().toString());
      $("#" + self.modalWindowId()).hide();
    };

    let bindDispose,bindDispose2;

    if (!self.readOnly) {
      bindDispose = self.bindvariable[rootParams.rootModel.size].subscribe(function(newValue) {
          setCSSProps(rootParams.rootModel.size, newValue);
        });

        bindDispose2 = self.bindvariable[rootParams.rootModel.weight].subscribe(function(newValue) {
          setCSSProps(rootParams.rootModel.weight, newValue);
        });
    }

    self.dispose = function() {
      if (!self.readOnly) {
        bindDispose.dispose();
        bindDispose2.dispose();
      }
    };
  };
});