define([
    "knockout",
    "./model",
  "ojL10n!resources/nls/wallet-api-test",
  "ojs/ojknockout",
  "ojs/ojdatetimepicker"
], function(ko, APIModel, ResourceBundle) {
  "use strict";

  return function viewModel(Params) {
    const self = this,
      getNewKoModel = function() {
        const KoModel = ko.mapping.fromJS(APIModel.getNewModel());

        KoModel.creditAPIModel.comments = self.walletnls.bbdpb;
        KoModel.debitAPIModel.comments = self.walletnls.iphone;

        return KoModel;
      };

    ko.utils.extend(self, Params.rootModel);
    self.walletnls = ResourceBundle;
    self.creditAPIModel = getNewKoModel().creditAPIModel;
    self.debitAPIModel = getNewKoModel().debitAPIModel;
    self.kycUpdateModel = getNewKoModel().kycUpdateModel;
    self.stageOne = ko.observable(true);
    self.stageTwo = ko.observable(false);
    self.stageThree = ko.observable(false);
    self.customComponent = ko.observable();
    self.hostRefNumber = ko.observable();
    Params.baseModel.registerElement("comment-box");
    Params.baseModel.registerElement("amount-input");

    self.show = function(data) {
      self.customComponent(data);
      self.stageTwo(true);
      self.stageThree(false);
    };

    self.credit = function() {
      self.creditAPIModel.walletId(self.creditAPIModel.walletDetail);

      const payload = ko.toJSON(self.creditAPIModel);

      APIModel.creditAPI(payload).done(function(data) {
        self.hostRefNumber(data.referenceNo);
        self.stageTwo(false);
        self.stageThree(true);
      });
    };

    self.debit = function() {
      const payload = ko.toJSON(self.debitAPIModel);

      APIModel.debitAPI(payload).done(function(data) {
        self.hostRefNumber(data.referenceNo);
        self.stageTwo(false);
        self.stageThree(true);
      });
    };

    self.kycUpdate = function() {
      const payload = ko.toJSON(self.kycUpdateModel);

      APIModel.kycUpdate(payload).done(function(data) {
        self.hostRefNumber(data.referenceNo);
        self.stageTwo(false);
        self.stageThree(true);
      });
    };
  };
});