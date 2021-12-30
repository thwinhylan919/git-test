define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/debit-card-pin-request",
  "ojs/ojknockout",
  "ojs/ojinputnumber",
  "ojs/ojbutton"
], function(ko, RequestPinModel, resourceBundle) {
  "use strict";

  return function(Params) {
    const self = this,
      /**
       * GetNewKoModel - description.
       *
       * @return {type}  Description.
       */
      getNewKoModel = function() {
        const KoModel = RequestPinModel.getNewModel();

        return ko.mapping.fromJS(KoModel);
      };

    ko.utils.extend(self, Params.rootModel);
    self.cardObject = self.params;
    self.data = ko.observable(Params.rootModel.viewDetailsData);
    self.locale = resourceBundle;
    self.common = self.locale.common;
    self.localModeOfdelivery = ko.observable();
    self.reviewEnable = ko.observable(false);
    self.validationTracker = ko.observable();
    self.serviceId = ko.observable();
    self.loadConfirm = ko.observable(false);
    self.rootModelInstance = getNewKoModel();
    self.addressDetails = self.previousState ? self.previousState.addressDetails : ko.mapping.fromJS(self.rootModelInstance.addressDetails);
    self.payload = self.rootModelInstance.payload;
    self.accountId = self.cardObject.accountId.value;
    self.cardNo = self.cardObject.cardNo.value;
    self.srNo = ko.observable();
    self.CardDetailsData = ko.observable();
    self.debitCardDetailsObject = ko.observable(self.params);
    Params.dashboard.headerName(self.locale.compName.debitCardPinRequest);
    self.CardDetailsData(self.cardObject);
    self.reviewEnable(true);
    self.loadConfirm(false);
    self.addressDetails = self.params.addressDetails;
    self.accountId = self.params.accountId;
    self.cardNo = self.params.cardNo;

    self.reviewTransactionName = {
      header: self.locale.review,
      reviewHeader: self.locale.reviewHeader
    };

    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerElement("address");

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.requestPin = function() {
      if (self.addressDetails.deliveryOption === "ACC") {
        self.localModeOfdelivery("COR");
      } else {
        self.localModeOfdelivery("BRN");
      }

      self.payload.address.line1(self.addressDetails.address.line1);
      self.payload.address.line2(self.addressDetails.address.line2);
      self.payload.address.line3(self.addressDetails.address.line3);
      self.payload.address.line4(self.addressDetails.address.line4);
      self.payload.address.city(self.addressDetails.address.city);
      self.payload.address.state(self.addressDetails.address.state);
      self.payload.address.country(self.addressDetails.address.country);
      self.payload.deliveryOption(self.localModeOfdelivery());

      RequestPinModel.requestPin(self.accountId, self.cardNo, ko.toJSON(self.payload)).then(function(data) {
        if (data.serviceId) {
          self.srNo(data.serviceId);
          self.reviewEnable(false);
          self.loadConfirm(true);

          Params.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            sr: true,
            transactionName: self.locale.pinRequest.transactionName,
            serviceNo: data.serviceId,
            flagPinRequest: true,
            resourceBundle: self.locale,
            srNo: self.srNo(),
            confirmScreenExtensions: {
              isSet: true,
              template: "confirm-screen/casa-template",
              taskCode: "CH_N_RDCP",
              resourceBundle: self.locale
            }
          }, self);
        }
      });
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.redirect = function() {
      window.location.href = "demand-deposits.html";
    };
  };
});
