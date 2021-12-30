define([
    "knockout"
], function(ko) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.cardData = ko.observable(Params.data);
  };
});