define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/cheque-book-request"
], function (ko, reviewChequeBookRequestModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.header);
    self.isAddressLoaded = ko.observable(false);

    self.reviewTransactionName = {
      header: self.resource.common.review,
      reviewHeader: self.resource.common.reviewHeader
    };

    if (self.params.data.chequeDeliveryDetailsDTO.address) {
      self.isAddressLoaded(true);
    } else {
      self.address = self.rootModelInstance().addressDetails;

      if (self.params.data.chequeDeliveryDetailsDTO.addressType) {
        self.addressType = self.params.data.chequeDeliveryDetailsDTO.addressType();
        self.addresstoShow(self.params.data.chequeDeliveryDetailsDTO.address);
        self.address.modeofDelivery(self.params.data.chequeDeliveryDetailsDTO.deliveryOption());
        self.address.addressType(self.addressType);
        self.address.addressTypeDescription(self.resource.chequeBookRequest.addressType[self.addressType]);
        self.address.postalAddress = self.addresstoShow();
        self.addressDetails = self.address;
        self.isAddressLoaded(true);
      } else if (!self.params.data.chequeDeliveryDetailsDTO.addressType && self.params.data.chequeDeliveryDetailsDTO.deliveryOption() === "BRN" && self.params.data.chequeDeliveryDetailsDTO.branchCode) {
        self.branchCode = self.params.data.chequeDeliveryDetailsDTO.branchCode();

        reviewChequeBookRequestModel.fetchAddress(self.branchCode).done(function (data) {
          self.addresstoShow(data.addressDTO[0].branchAddress.postalAddress);
          self.address.modeofDelivery(self.params.data.chequeDeliveryDetailsDTO.deliveryOption());
          self.address.addressType("");
          self.address.addressTypeDescription("");
          self.address.postalAddress = self.addresstoShow();
          self.address.postalAddress.branchName = data.addressDTO[0].branchName;
          self.addressDetails = self.address;
          self.isAddressLoaded(true);
        });
      } else {
        self.addresstoShow(self.params.data.chequeDeliveryDetailsDTO.address);
        self.address.modeofDelivery(self.params.data.chequeDeliveryDetailsDTO.deliveryOption());
        self.address.addressType("");
        self.address.addressTypeDescription("");
        self.address.postalAddress = self.addresstoShow();
        self.addressDetails = self.address;
        self.isAddressLoaded(true);
      }
    }

    self.chequeBookRequest = function () {
      reviewChequeBookRequestModel.requestChequeBook(self.params.data.accountId.value, ko.mapping.toJSON(self.params.data, {
        ignore: ["accountId","noOfChequeBooksEnabled"]
      })).then(function (data) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.resource.compName.compName,
          eReceiptRequired: true,
          hostReferenceNumber: data.chequeBookDTO ? data.chequeBookDTO.chequeBookRequestRefNo : null,
          confirmScreenExtensions: self.params.confirmScreenExtensions,
          template: "confirm-screen/casa-template"
        }, self);
      });
    };

    rootParams.baseModel.registerElement("address");

    (function (extensionObject) {
      extensionObject.isSet = true;
      extensionObject.data = self.params.data;
      extensionObject.template = "confirm-screen/cheque-book-request";
      extensionObject.resourceBundle = ResourceBundle;
      extensionObject.successMessage = "";
      extensionObject.statusMessages = "";
      extensionObject.taskCode = "CH_N_CBR";

      extensionObject.confirmScreenMsgEval = function (_jqXHR, txnName, status, referenceNo, hostReferenceNo) {
        return rootParams.baseModel.format(ResourceBundle.confirmationMsg[status], {
          txnName: txnName,
          referenceNo: referenceNo,
          hostReferenceNo: hostReferenceNo
        });
      };
    })(self.params.confirmScreenExtensions);
  };
});