define([

  "knockout",

  "ojL10n!lzn/beta/resources/nls/application-offer"
], function(ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.headingText(self.resource.additionalInfo);
    self.showComponents = ko.observable(false);

    self.uplTrackingDetails = ko.observable({
      additionalInfo: {}
    });

    self.uplTrackingDetails().additionalInfo.sections = [];
    rootParams.baseModel.registerComponent("application-offer", "application-tracking");
  };
});