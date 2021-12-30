define([
  "knockout"
], function(ko) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.heading = rootParams.heading;
    self.headerTemplate = rootParams.headerTemplate;
    // eslint-disable-next-line no-empty-function
    self.dispose = function() {};
  };
});