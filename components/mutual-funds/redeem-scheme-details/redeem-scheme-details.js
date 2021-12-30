define([

  "knockout",
  "ojL10n!resources/nls/redeem-funds-global",
  "ojs/ojlabel",
  "ojs/ojgauge",
  "ojs/ojlegend"
], function (ko, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.ratingValue = ko.observable(parseInt(self.schemeDetailsDTO().schemeDTO.fundRating));
    self.diffValue = ko.observable(self.schemeDetailsDTO().schemeDTO.nav.amount);
    self.maxRating = ko.observable(5);
    self.showMore = ko.observable(true);

    if (self.orderStatusFlag()) {
      self.showMore(false);
    }

    if (self.schemeDetailsDTO().schemeDTO.latestPriceDiffPercent >= 0) {
      self.legendSections = ko.observableArray([{
        items: [{
          text: self.schemeDetailsDTO().schemeDTO.latestPriceDiff.amount + "(" + self.schemeDetailsDTO().schemeDTO.latestPriceDiffPercent + "%)",
          color: "#328c4c",
          markerShape: "triangleUp"
        }]
      }]);

      self.textStyle = ko.observable({
        fontSize: "0.8rem",
        color: "#328c4c"
      });
    }

    if (self.schemeDetailsDTO().schemeDTO.latestPriceDiffPercent < 0) {
      self.legendSections = ko.observableArray([{
        items: [{
          text: self.schemeDetailsDTO().schemeDTO.latestPriceDiff.amount + "(" + self.schemeDetailsDTO().schemeDTO.latestPriceDiffPercent + "%)",
          color: "#ED6647",
          markerShape: "triangleDown"
        }]
      }]);

      self.textStyle = ko.observable({
        fontSize: "0.8rem",
        color: "#ED6647"
      });
    }
  };
});