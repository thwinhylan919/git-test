define([
  "knockout",
  "ojL10n!resources/nls/offers",
  "text!./supply-chain-finance-banner.json"
], function(ko, ResourceBundle, dummyData) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.resource = ResourceBundle;
    self.ads = [];
    self.ads = JSON.parse(dummyData).image;
    self.imageTitle = ko.observable(rootParams.data.data.type);
    self.maxItemsPerPage = ko.observable();

    self.link = function(data) {
      window.open(data.url);
    };

    if (rootParams.baseModel.small()) {
      self.maxItemsPerPage = 1;
    } else {
      self.maxItemsPerPage = 2;
    }
  };
});
