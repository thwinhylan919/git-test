define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/theme-properties",
  "ojs/ojselectcombobox",
  "ojs/ojradioset",
  "ojs/ojcolor",
  "ojs/ojcolorspectrum"
], function (oj, ko, $, locale) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.parameters = rootParams.rootModel;
    self.bindvariable = rootParams.obdxVariables;
    self.selectedColors = rootParams.selectedColors;

    self.readOnly = rootParams.readOnly || false;
    self.modalWindowId = ko.observable("backgroundColorPaletteModal" + rootParams.baseModel.incrementIdCount());
    self.resourceBundle = locale;
    self.sizeUnit = "rem";
    self.colorType = ko.observable("flat");

    if (rootParams.obdxVariables[rootParams.rootModel["gradient-start-color"]]() === "transparent") {
      self.colorType("transparent");
    } else if (rootParams.obdxVariables[rootParams.rootModel["gradient-start-color"]]() !== rootParams.obdxVariables[rootParams.rootModel["gradient-end-color"]]()) {
      self.colorType("gradient");
    }

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

    let setVariable;

    self.removeColor = function () {
      const index = rootParams.selectedColors().findIndex(function (element) {
        if (self.colorValue() !== null && element.color === self.colorValue().toString() && element.count) {
          element.count--;

          if (!element.count) {
            return true;
          }
        }

        return false;
      });

      if (index > -1) {
        rootParams.selectedColors.splice(index, 1);
      }
    };

    self.addColor = function (color) {
      const index = rootParams.selectedColors().findIndex(function (element) {
        if (element.color === color) {
          element.count++;

          return true;
        }

        return false;
      });

      if (index === -1) {
        rootParams.selectedColors.push({color:color,
          count: 1
        });
      }
    };

    self.showPaleteBox = function (colorToSet) {
      if (!self.readOnly) {
        setVariable = colorToSet;

        const previousColorValue = self.bindvariable[rootParams.rootModel[setVariable]]();

        if (previousColorValue) {
          self.colorValue(new oj.Color(previousColorValue));
        }

        $("#" + self.modalWindowId()).trigger("openModal");
      }
    };

    self.updateColorBox = function (color) {
      const index = rootParams.selectedColors().findIndex(function (element) {
        if (element.color === color) {
          return true;
        }

        return false;
      });

      if (index === -1) {
        self.selectedColors.splice(4, 1);

        self.selectedColors().splice(0,0,{color:color,
          count: 1
        });
      }
    };

    self.hideColorPalete = function () {
      $("#" + self.modalWindowId()).hide();
    };

    self.saveSelectedColor = function () {
      self.bindvariable[rootParams.rootModel[setVariable]](self.colorValue().toString());
      setCSSProps(rootParams.rootModel[setVariable], self.colorValue().toString());

      if (setVariable === "gradient-start-color" && self.colorType() === "flat") {
        self.bindvariable[rootParams.rootModel["gradient-end-color"]](self.colorValue().toString());
        setCSSProps(rootParams.rootModel["gradient-end-color"], self.colorValue().toString());
        self.bindvariable[rootParams.rootModel["gradient-direction"]]("right");
        setCSSProps(rootParams.rootModel["gradient-direction"], "right");
      }

      self.updateColorBox(self.colorValue().toString());
      $("#" + self.modalWindowId()).hide();
    };

    let transparentSubscribe, bindDispose;

    if (!self.readOnly) {
      transparentSubscribe = self.colorType.subscribe(function(newValue) {
        if (newValue === "transparent") {
          self.bindvariable[rootParams.rootModel["gradient-end-color"]]("transparent");
          setCSSProps(rootParams.rootModel["gradient-end-color"], "transparent");
          self.bindvariable[rootParams.rootModel["gradient-start-color"]]("transparent");
          setCSSProps(rootParams.rootModel["gradient-start-color"], "transparent");
          self.bindvariable[rootParams.rootModel["gradient-direction"]]("right");
        }
      });

      bindDispose = self.bindvariable[rootParams.rootModel["gradient-direction"]].subscribe(function(newValue) {
        setCSSProps(rootParams.rootModel["gradient-direction"], newValue);
      });
    }

    self.dispose = function() {
      if (!self.readOnly) {
        bindDispose.dispose();
        transparentSubscribe.dispose();
      }
    };
  };
});