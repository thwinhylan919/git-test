define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/reissue-card",
  "ojs/ojinputtext",
  "ojs/ojradioset"
], function(ko, ReIssueCardModel, ResourceBundle) {
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
    self.reviewEnable = ko.observable(false);
    self.srNo = ko.observable();
    self.replaceCardPayload = getNewKoModel().replaceModel;
    Params.baseModel.registerElement("address");
    Params.dashboard.headerName(self.resource.reissueDebitCard);
    self.addressDetails = self.params.addressDetails;
    self.accountId = self.params.accountId;
    self.currentCardNo = self.params.cardNo;
    self.dataLoaded(true);

    self.reviewTransactionName = {
      header: self.resource.reviewHeading,
      reviewHeader: self.resource.reviewHeading1
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.submit = function() {
      self.replaceCardPayload.address.city = self.addressDetails.address.city;
      self.replaceCardPayload.address.state = self.addressDetails.address.state;
      self.replaceCardPayload.address.country = self.addressDetails.address.country;
      self.replaceCardPayload.address.zipCode = self.addressDetails.address.zipCode;
      self.replaceCardPayload.address.line1 = self.addressDetails.address.line1;
      self.replaceCardPayload.address.line2 = self.addressDetails.address.line2;
      self.replaceCardPayload.address.line3 = self.addressDetails.address.line3;
      self.replaceCardPayload.address.line4 = self.addressDetails.address.line4;
      self.replaceCardPayload.address.zipCode = self.addressDetails.address.zipCode;

      if (self.addressDetails.deliveryOption() === "ACC") {
        self.replaceCardPayload.deliveryOption = "COR";
      } else {
        self.replaceCardPayload.deliveryOption = self.addressDetails.deliveryOption();
      }

      ReIssueCardModel.createReplaceCard(ko.toJSON(self.replaceCardPayload), self.accountId, self.currentCardNo).then(function(data) {
        if (data.serviceId) {
          self.srNo(data.serviceId);

          Params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            sr: true,
            transactionName: self.resource.transactionName,
            flagReissueCard: true,
            serviceNo: data.serviceId,
            srNo: self.srNo(),
            addressDetails: self.addressDetails,
            confirmScreenExtensions: {
              isSet: true,
              template: "confirm-screen/casa-template",
              taskCode: "CH_N_RLDC",
              resourceBundle: self.resource
            }
          }, self);
        }
      });
    };
  };
});
