define([

  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/reissue-card",
  "ojs/ojinputtext",
  "ojs/ojradioset"
], function(ko, $, ReIssueCardModel, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this,
      /**
       * Let getNewKoModel - description.
       *
       * @return {type}  Description.
       */
      getNewKoModel = function() {
        const KoModel = ReIssueCardModel.getNewModel();

        return KoModel;
      };

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable(false);
    self.accountId = self.accountId ? ko.observable(self.accountId) : ko.observable(self.params.accountId.value);
    self.currentCardNo = self.currentCardNo ? ko.observable(self.currentCardNo) : ko.observable(self.params.cardNo.value);
    self.reviewEnable = ko.observable(false);
    self.srNo = ko.observable();
    self.replaceCardPayload = getNewKoModel().replaceModel;
    self.addressDetails = self.previousState && self.previousState.addressDetails ? self.previousState.addressDetails : ko.mapping.fromJS(getNewKoModel().addressDetails);
    self.debitCardDetailsObject = self.debitCardDetailsObject ? self.debitCardDetailsObject : ko.observable(self.params);
    Params.baseModel.registerElement("address");
    Params.baseModel.registerComponent("review-reissue-card", "demand-deposits");
    Params.dashboard.headerName(self.resource.reissueDebitCard);
    self.dataLoaded(true);

    self.review = function() {
      self.common = self.resource;

      const context = {};

      context.mode = "REVIEW";
      context.addressDetails = self.addressDetails;
      context.accountId = self.accountId();
      context.cardNo = self.currentCardNo();
      context.debitCardDetailsObject = self.debitCardDetailsObject();
      Params.dashboard.loadComponent("review-reissue-card", context);
    };

    self.showFloatingPanel = function() {
      $("#panelDebitCard")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
    };
  };
});
