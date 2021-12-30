define(["ojs/ojcore", "ojL10n!resources/nls/preview-brand", "base-models/css"], function (oj, locale, CSS) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.nls = locale;
    self.brandData = rootParams.brandData;

    function setStyleAttributes(parentNode, selectorValueObject) {
      Object.keys(selectorValueObject).forEach(function (selectorString) {
        parentNode.querySelector(selectorString).setAttribute("style", rootParams.baseModel.format(selectorValueObject[selectorString], self.brandData.styleAsset));
      });
    }

    Promise.all([
      CSS.getCurrentTokens(),
      oj.Context.getPageContext().getBusyContext().whenReady()
    ]).then(function (values) {
      self.brandData.styleAsset = Object.assign(values[0], self.brandData.styleAsset);

      setStyleAttributes(document.getElementById("brand" + self.brandData.brandId), {
        "[brand='header']": "color: {--header-foreground-color}; background: linear-gradient(to {--header-gradient-direction}, {--header-gradient-start-color}, {--header-gradient-end-color}); border-bottom: 1px solid {--header-border-bottom-color};",
        "[brand='menu']": "background: linear-gradient(to {--menu-gradient-direction}, {--menu-gradient-start-color}, {--menu-gradient-end-color});",
        "[brand='form-foreground']": "background: linear-gradient(to {--form-gradient-direction}, {--form-gradient-start-color}, {--form-gradient-end-color});",
        "[brand='form-background']": "background: linear-gradient(to {--app-background-gradient-direction}, {--app-background-gradient-start-color}, {--app-background-gradient-end-color});",
        "[brand='primary-button'] > button": "background: linear-gradient(to {--button-primary-gradient-direction}, {--button-primary-gradient-start-color}, {--button-primary-gradient-end-color});",
        "[brand='secondary-button'] > button": "background: linear-gradient(to {--button-secondary-gradient-direction}, {--button-secondary-gradient-start-color}, {--button-secondary-gradient-end-color});",
        "[brand='tertiary-button'] > button": "background: linear-gradient(to {--button-tertiary-gradient-direction}, {--button-tertiary-gradient-start-color}, {--button-tertiary-gradient-end-color});"
      });
    });
  };
});