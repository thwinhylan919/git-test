define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/debit-card-apply",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojswitch",
  "ojs/ojdatetimepicker"
], function(ko, $, ApplyCardModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;
    let selectedReasonArray;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    $("#statusSection").addClass("blank");
    self.reasonEnumLoaded = ko.observable(false);
    self.enableReview = ko.observable(false);
    self.loadConfirm = ko.observable(false);
    self.validationTracker = ko.observable();
    self.serviceId = ko.observable();
    self.reasonEnumList = ko.observableArray();
    rootParams.dashboard.headerName(resourceBundle.compName.newDebitCard);
    self.common = resourceBundle.common;
    self.accountInputDetails = ko.observable();
    self.accountNumber = ko.observable();
    self.srNo = ko.observable();
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.nls.review.reviewHeading;
    self.reviewTransactionName.reviewHeader = self.nls.common.reviewHeading;

    const getNewKoModel = function() {
        const KoModel = ApplyCardModel.getNewModel();

        return ko.mapping.fromJS(KoModel);
      },
      getNewAddressKoModel = function() {
        const KoModel = ApplyCardModel.getNewModelAddress();

        return ko.mapping.fromJS(KoModel);
      };

    if (self.params.id) {
      self.accountNumber(self.params.id.value);
    }

    self.applyCardModel = getNewKoModel();
    self.addressDetails = getNewAddressKoModel().addressDetails;
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("address");
    rootParams.baseModel.registerComponent("account-nickname", "accounts");

    ApplyCardModel.getReasons().done(function(data) {
      self.reasonEnumList(data.enumRepresentations[0].data);
      self.reasonEnumLoaded(true);
    });

    self.review = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      selectedReasonArray = self.applyCardModel.reason().split("-");
      self.applyCardModel.reason(selectedReasonArray[1]);
      self.enableReview(true);
      self.loadConfirm(false);
    };

    self.submitDetails = function() {
      self.applyCardModel.name(self.applyCardModel.name());
      self.applyCardModel.address.city(self.addressDetails.address.city());
      self.applyCardModel.address.state(self.addressDetails.address.state());
      self.applyCardModel.address.country(self.addressDetails.address.country());
      self.applyCardModel.address.zipCode(self.addressDetails.address.zipCode());
      self.applyCardModel.address.line1(self.addressDetails.address.line1());
      self.applyCardModel.address.line2(self.addressDetails.address.line2());
      self.applyCardModel.address.line3(self.addressDetails.address.line3());
      self.applyCardModel.address.line4(self.addressDetails.address.line4());
      self.applyCardModel.reason(selectedReasonArray[0]);

      if (self.addressDetails.deliveryOption() === "ACC") {
        self.applyCardModel.deliveryOption("COR");
      } else {
        self.applyCardModel.deliveryOption = self.addressDetails.deliveryOption();
      }

      ApplyCardModel.submitCardDetails(self.accountNumber(), ko.mapping.toJSON(self.applyCardModel)).then(function(data) {
        if (data.serviceId) {
          self.srNo(data.serviceId);
          self.applyCardModel.reason(selectedReasonArray[1]);
          self.applyCardModel.deliveryOption = self.addressDetails.deliveryOption();
          self.loadConfirm(true);

          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            sr: true,
            transactionName: self.nls.apply.transactionName,
            serviceNo: data.serviceId,
            srNo: self.srNo(),
            confirmScreenExtensions: {
              isSet: true,
              taskCode: "CH_N_ADC",
              template: "confirm-screen/casa-template"
            },
            resourceBundle: self.nls,
            flagApplyPin: true,
            applyCardModel : self.applyCardModel,
            addressDetails :self.applyCardModel.address

          }, self);

          self.enableReview(false);
        }
      });
    };

    self.cancel = function() {
      self.applyCardModel.reason(selectedReasonArray[0] + "-" + selectedReasonArray[1]);
      self.enableReview(false);
    };

    self.redirect = function() {
      window.location.href = "demand-deposits.html";
    };
  };
});
