define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/purchase-mutual-fund",
  "ojL10n!resources/nls/multiple-orders-placed",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojswitch",
  "ojs/ojradioset",
  "ojs/ojdatetimepicker"
], function(ko, PurchaseMutualFund, resourceBundle, multiplePurchasenls) {
  "use strict";

  return function(params) {
    const self = this;

    self.payLoadArray = params.rootModel.params.payLoadArray;
    ko.utils.extend(self, params.rootModel);
    self.batchArray = JSON.parse(JSON.stringify(self.payLoadArray));
    self.batchList = ko.observableArray();
    self.multiplePurchase = ko.observableArray();
    self.resource = resourceBundle;
    self.multiplePurchasenls = multiplePurchasenls;
    params.dashboard.headerName(self.resource.purchaseOrder);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("scheme-details-bar", "mutual-funds");
    params.baseModel.registerComponent("multiple-purchase-status", "mutual-funds");
    self.updateMessage = ko.observable(self.resource.purchaseOrder);
    self.disabled = ko.observable(false);

    let i;

    for (i = 0; i < self.batchArray.length; i++) {
      self.payLoadArray[i].totalAmount = self.resource;

      self.batchList().push({
        methodType: "POST",
        uri: {
          value: "/accounts/investmentAccounts/{investmentAccountId}/holdings",
          params: {
            investmentAccountId: self.batchArray[i].purchaseFund.investmentAccountNumber.value
          }
        },
        headers: {
          "Content-Id": i,
          "Content-Type": "application/json"
        },
        payload: ko.toJSON(self.batchArray[i].purchaseFund)
      });
    }

    const batchPayLoad = {
      batchDetailRequestList: []
    };

    batchPayLoad.batchDetailRequestList = self.batchList();

    self.viewPurchaseConfirm = function() {
      params.dashboard.openRightPanel("multiple-purchase-status", {
        self: self
      }, self.multiplePurchasenls.confirmScreen.confirmPurchasePageHeader);
    };

    const confirmScreenDetailsArray = [];

    self.purchase = function() {
      self.disabled(true);

      if (params.rootModel.params.orderStatusFlag) {
        const payload = {
          subCategory: "PURCHASE",
          accountHoldingPurchaseDTO: {
            accountHoldingDTO: self.batchArray[0].purchaseFund
          }
        };

        PurchaseMutualFund.updateOrder(self.batchArray[0].purchaseFund.investmentAccountNumber.value, self.instructionId(), ko.toJSON(payload)).done(function(data, status, jqXhr) {
          let confirmScreenObj = null;
          const confirmMessage = self.resource.confirmMessage,
            respStatus = self.multiplePurchasenls.confirmScreen.success,
            failedmsg = "--";

          confirmScreenObj = {
            header: self.batchArray[0].purchaseFund.scheme.schemeName,
            referenceNumber: data.hostRefId,
            statusMsg: respStatus,
            failureReason: failedmsg
          };

          confirmScreenDetailsArray.push(confirmScreenObj);

          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.updateMessage(),
            viewPurchaseConfirm:self.viewPurchaseConfirm,
            confirmScreenExtensions: {
              confirmScreenMsgEval: function(data) {
                return confirmMessage;
              },
              isSet: true,
              confirmScreenDetails: confirmScreenDetailsArray,
              template: "confirm-screen/purchase-mutual-funds",
              resourceBundle: self.resource,
              confirmScreenres: self.multiplePurchasenls.confirmScreen.confirmPurchasePageHeader
            },
            template: "confirm-screen/purchase-mutual-funds-cards"
          }, self);
        });
      } else {
        PurchaseMutualFund.fireBatch(batchPayLoad, "MULMFPUR").done(function(data, status, jqXhr) {
          let confirmScreenObj = null,
            respStatus = "",
            failedmsg,
            headerName = "",
            failedTxn,
            confirmMessage,
            referenceno;

          for (let j = 0; j < data.batchDetailResponseDTOList.length; j++) {
            if (data.batchDetailResponseDTOList[j].status !== 200 && data.batchDetailResponseDTOList[j].status !== 201 && data.batchDetailResponseDTOList[j].status !== 202) {
              failedTxn = data.batchDetailResponseDTOList[j].sequenceId;
              respStatus = self.multiplePurchasenls.confirmScreen.fail;
              referenceno = "--";
              failedmsg = "";

              for (let p = 0; p < batchPayLoad.batchDetailRequestList.length; p++) {
                if (batchPayLoad.batchDetailRequestList[p].headers["Content-Id"] === Number(data.batchDetailResponseDTOList[j].sequenceId)) {
                  headerName = self.batchArray[p].purchaseFund.scheme.schemeName;
                }
              }

              if (data.batchDetailResponseDTOList[j].responseObj.message.validationError) {
                for (let k = 0; k < data.batchDetailResponseDTOList[j].responseObj.message.validationError.length; k++) {
                  failedmsg = failedmsg.concat(data.batchDetailResponseDTOList[j].responseObj.message.validationError[k].errorMessage);
                }
              } else {
                failedmsg = data.batchDetailResponseDTOList[j].responseObj.message.detail;
              }
            } else {
              headerName = data.batchDetailResponseDTOList[j].responseObj.accountHoldingDTO.scheme.schemeName;
              respStatus = self.multiplePurchasenls.confirmScreen.success;
              failedmsg = "--";
              referenceno = data.batchDetailResponseDTOList[j].responseObj.accountHoldingDTO.referenceNumber;
            }

            confirmScreenObj = {
              header: headerName,
              referenceNumber: referenceno,
              statusMsg: respStatus,
              failureReason: failedmsg
            };

            confirmScreenDetailsArray.push(confirmScreenObj);
          }

          if (failedTxn) {
            confirmMessage = self.resource.failedMessage;
          } else {
            confirmMessage = self.resource.confirmMessage;
          }

          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.updateMessage(),
            viewPurchaseConfirm:self.viewPurchaseConfirm,
            confirmScreenExtensions: {
              confirmScreenMsgEval: function(data) {
                if (failedTxn) {
                  return Number(data.sequenceId) === Number(failedTxn) ? confirmMessage : null;
                }

                return data.sequenceId === "0" ? confirmMessage : null;

              },
              isSet: true,
              confirmScreenDetails: true,
              template: "confirm-screen/purchase-mutual-funds",
              resourceBundle: self.resource,
              confirmScreenres: self.multiplePurchasenls.confirmScreen.confirmPurchasePageHeader
            },
            template: "confirm-screen/purchase-mutual-funds-cards"
          }, self);
        });
      }
    };

    self.multiplePurchase(confirmScreenDetailsArray);

    self.details = function() {
      params.dashboard.loadComponent("purchase-mutual-fund-train", {
        newFund: false,
        payLoadArray: self.payLoadArray,
        totalAmount: params.rootModel.params.totalAmount,
        fundHouseData: params.rootModel.params.fundHouseData,
        schemeDetailsDTO: params.rootModel.params.schemeDetailsDTO
      });
    };
  };
});
