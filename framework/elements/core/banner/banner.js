define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/banner"
], function(ko, BannerModel, Resources) {
  "use strict";

  return function(params) {
    const self = this;

    self.bannerMessages = [];
    self.visible = ko.observable(false);
    self.resource = Resources;
    params.baseModel.registerComponent("banner-list", "dashboard");

    const mapId = null;

    params.rootModel.userInfoPromise.then(function() {
      if (params.dashboard.userData.userProfile) {
        BannerModel.fetchData().then(function(data) {
          if (!params.baseModel.isEmpty(data.mailerUserMapDTOs)) {
            data.mailerUserMapDTOs.forEach(function(element) {
              self.bannerMessages.push({
                content: element.bannerBody,
                mapId: element.mapId
              });
            });

            self.visible(true);
          }
        });
      }
    });

    self.showAll = function() {
      params.dashboard.loadComponent("banner-list", self.bannerMessages);
    };

    self.close = function() {
      self.visible(false);
    };

    self.dismiss = function() {
      const payload = {
        dismissed: "true"
      };

      BannerModel.dismiss(ko.toJSON(payload), mapId).then(function() {
        self.close();
      });
    };

    self.openNewWindow = function(location) {
      window.open(location);
    };
  };
});
