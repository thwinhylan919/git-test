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
    self.modalWindowId = ko.observable("borderColorPaletteModal" + rootParams.baseModel.incrementIdCount());
    self.resourceBundle = locale;
    self.sizeUnit = "rem";
    self.readOnly = rootParams.readOnly || false;
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

    self.colorValue = ko.observable(new oj.Color("rgba(255,255,255,0.8)"));
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("color-picker");

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

    self.saveSelectedColor = function() {
      self.bindvariable[rootParams.rootModel.color](self.colorValue().toString());
      setCSSProps(rootParams.rootModel.color, self.colorValue().toString());
      self.updateColorBox(self.colorValue().toString());
      $("#" + self.modalWindowId()).hide();
    };

    let bindDispose,bindDispose2;

    if (!self.readOnly) {
      if(rootParams.rootModel.width){
        bindDispose = self.bindvariable[rootParams.rootModel.width].subscribe(function(newValue) {
          setCSSProps(rootParams.rootModel.width, newValue);
        });
      }

      if(rootParams.rootModel.radius){
        bindDispose2 = self.bindvariable[rootParams.rootModel.radius].subscribe(function(newValue) {
          setCSSProps(rootParams.rootModel.radius, newValue);
        });
      }
    }

    self.dispose = function() {
      if (!self.readOnly) {
        if(bindDispose){
          bindDispose.dispose();
        }

        if(bindDispose2){
          bindDispose2.dispose();
        }
      }
    };
  };
});