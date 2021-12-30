define([
  "ojL10n!resources/nls/theme-properties",
  "ojs/ojinputnumber"
], function(locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.parameters = rootParams.rootModel;
    self.bindvariable = rootParams.obdxVariables;
    self.readOnly = rootParams.readOnly || false;
    self.resourceBundle = locale;
    self.sizeUnit = "rem";

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

    let bindDispose;

    if (!self.readOnly) {
      bindDispose = self.bindvariable[rootParams.rootModel.size].subscribe(function(newValue) {
        setCSSProps(rootParams.rootModel.size, newValue);
      });
    }

    self.dispose = function() {
      if (!self.readOnly) {
        bindDispose.dispose();
      }
    };
  };
});