define([
    "knockout",
    "ojL10n!resources/nls/pattern-visibility",
  "baseLogger",
  "ojs/ojbutton"
], function(ko, ResourceBundle, BaseLogger) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.header);
    self.patternVisible = ko.observable();
    self.showPatternVisiblitySwitch = ko.observable(false);

    /**
     * DummyFunction function - It does absolutely nothing.
     *
     * @return {void}
     */
    const dummyFunction = function() {
      BaseLogger.info("this is a dummy function");
    };

    /**
     * SuccessHandler - It is a success handler for app prefernce fetching alternate login preference.
     *
     * @param  {string} type - It describes type of alternate login set.
     * @return {void}
     */
    function successHandler(type) {
      if (type.indexOf("pattern") === 0) {
        self.showPatternVisiblitySwitch(true);

        if (type.split("-")[1] === "visible") {
          self.patternVisible(true);
        }
      }
    }

    self.patternVisible.subscribe(function(newValue) {
      window.plugins.appPreferences.store(dummyFunction, dummyFunction, "alternate_preference", newValue ? "pattern-visible" : "pattern-invisible");
    });

    if (rootParams.baseModel.cordovaDevice()) {
      window.plugins.appPreferences.fetch(successHandler, dummyFunction, "alternate_preference");
    }
  };
});