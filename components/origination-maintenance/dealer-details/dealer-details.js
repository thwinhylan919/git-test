/**
 * New Dealer Details  Maintenance.
 *
 * @module origination-maintenance
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} dealerDetailsModel
 * @requires {object} ResourceBundle
 */
define([

  "knockout",
  "./model",
  "ojL10n!resources/nls/maintenance-base",
  "ojs/ojknockout-validation",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup",
  "ojs/ojlistviewdnd",
  "ojs/ojknockout",
  "ojs/ojtable",
  "ojs/ojswitch",
  "ojs/ojinputtext",
  "ojs/ojlabel",
  "promise"
], function(ko, dealerDetailsModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable(true);

    if (!(self.isBackFromReview() || self.isBack())) {
      dealerDetailsModel.fetchDealerDetails().then(function(response) {
        self.dealerData.dealerId(response.listDealers[0].dealerId);
        self.dealerData.dealerName(response.listDealers[0].name);
        self.dealerData.dealerUrl(response.listDealers[0].url);
      });
    }
  };
});
