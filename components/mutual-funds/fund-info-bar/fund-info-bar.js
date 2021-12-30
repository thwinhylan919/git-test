define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/mutual-fund-information",
  "ojs/ojlabel",
  "ojs/ojgauge",
  "ojs/ojlegend"
], function(oj,ko,FundInformationModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.investmentDetails= ko.observable();
    self.navAsOn= ko.observable();
    self.ratingAgency= ko.observable();
    self.assets= ko.observable();
    self.fundManager= ko.observable();
    self.fundRating= ko.observable();
    self.date= ko.observable();
    self.showMore = ko.observable(true);
    self.maxRating = ko.observable(5);
    self.details=ko.observable(false);
    self.schemeCode=ko.observable();
    self.assetDate = ko.observable();
    self.currentDate=ko.observable();
    self.subscriptionStatus=ko.observable();
    self.schemeCode= ko.observable(rootParams.rootModel.schemeCode());
    self.diffValue = ko.observable();
    self.schemeDetailsDTO = ko.observable();

    const currentDate = rootParams.baseModel.getDate();

    self.currentDate(oj.IntlConverterUtils.dateToLocalIso(currentDate));

    FundInformationModel.fetchSchemeDetails(self.schemeCode()).done(function(data) {
      self.details(false);
      self.schemeDetailsDTO(data);
      self.diffValue = ko.observable(self.schemeDetailsDTO().schemeDTO.nav.amount);
      self.ratingValue = ko.observable(parseInt(self.schemeDetailsDTO().schemeDTO.fundRating));

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

      FundInformationModel.readSnapshot(self.schemeCode()).done(function(data) {
        self.investmentDetails(data.schemeSnapshotDTO);
        self.navAsOn(self.investmentDetails().navAson);
        self.ratingAgency(self.investmentDetails().ratingAgencyName);
        self.assets(self.investmentDetails().asset);
        self.assetDate(self.investmentDetails().assetDate);
        self.fundManager(self.investmentDetails().fundManager);
        self.fundRating(self.investmentDetails().fundRating);
        self.date(self.investmentDetails().date);
        self.subscriptionStatus(self.investmentDetails().subscriptionStatus);
        self.details(true);
      });
    });
  };
});
