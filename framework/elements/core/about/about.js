define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/about",
  "load!framework/json/about.json"
], function (ko, $, resourceBundle, AboutJSON) {
  "use strict";

  return function (params) {
    const self = this;

    params.baseModel.registerElement("modal-window");
    self.obdx = ko.observable();
    self.nls = resourceBundle;

    function loadComplete(buildnum) {
      Object.assign(AboutJSON, {
        buildnum: !buildnum.message ? buildnum.trim() : null
      });

      self.obdx(AboutJSON);
      $("#aboutBox").trigger("openModal");
    }

    self.renderAboutBox = function () {
      require(["load!buildnum"], loadComplete, loadComplete);
    };
  };
});