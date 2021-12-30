define([
    "knockout",
    "ojL10n!resources/nls/user-spend-category-card",
  "promise",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojbutton"
], function(ko, Resource) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.cardData = ko.observable(Params.data);
    self.resource = Resource;
  };
});