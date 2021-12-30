define([

  "knockout",

  "ojL10n!lzn/alpha/resources/nls/application-offer"
], function(ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.headingText(self.resource.additionalInfo);
    self.showComponents = ko.observable(false);

    self.switchPageOnClick = function() {
      rootParams.baseModel.switchPage({
        homeComponent: {
          module: "application-tracking",
          component: "application-tracking-base",
          query: {
            context: "index"
          }
        }
      }, true);
    };

    self.uplTrackingDetails = ko.observable({
      additionalInfo: {}
    });

    self.uplTrackingDetails().additionalInfo.sections = [];
    rootParams.baseModel.registerComponent("application-offer", "application-tracking");
  };
});