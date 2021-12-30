define([

  "knockout",
  "jquery"
], function(ko, $) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.message = ko.observable();
    self.toolTipId = ko.observable();
    self.message(rootParams.message);
    self.toolTipId(rootParams.toolTipId);

    self.hideMobileToolTip = function() {
      $("#" + self.toolTipId()).css("display", "none");
    };
  };
});