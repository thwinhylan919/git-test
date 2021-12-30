define([
    "knockout",
      "ojL10n!lzn/alpha/resources/nls/card-fees-charges",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext"
], function(ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;

    self.closeFees = function() {
      self.components()[self.components().length - 1].isComplete(true);
      self.skipComponent(self.components().length);
    };
  };
});