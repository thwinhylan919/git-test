define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/redeem-funds-global",
  "ojL10n!resources/nls/multiple-orders-placed",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojswitch",
  "ojs/ojradioset",
  "ojs/ojdatetimepicker"
], function(ko, RedeemFundsReviewModel, resourceBundle, multipleRedeemenls) {
  "use strict";

  return function(params) {
    const self = this;

    self.resource = resourceBundle;
    self.multiplePurchasenls = multipleRedeemenls;
    params.baseModel.registerElement("confirm-screen");
    params.dashboard.headerName(self.resource.orderDetails.pageHeader);
    params.baseModel.registerComponent("multiple-purchase-status", "mutual-funds");
    self.updateMessage = ko.observable(self.resource.orderDetails.pageHeader);
    self.batchList = ko.observableArray();
    self.multiplePurchase = ko.observableArray();
    self.disabled = ko.observable(false);
    self.isRedeem = ko.observable(false);
    self.payLoadArray = params.rootModel.params.payLoadArray;
    self.batchArray = JSON.parse(JSON.stringify(self.payLoadArray));

    let i;

    for (i = 0; i < self.batchArray.length; i++) {
      self.batchList().push({
        methodType: "POST",
        uri: {
          value: "/accounts/investmentAccounts/{investmentAccountId}/holdings/{accountHoldingId}/redemptions",
          params: {
            investmentAccountId: self.batchArray[i].redeemFund.investmentAccountNumber.value,
            accountHoldingId: self.batchArray[i].accountHoldingId
          }
        },
        headers: {
          "Content-Id": i,
          "Content-Type": "application/json"
        },
        payload: self.batchArray[i].redeemFund
      });
    }

    const batchPayLoad = {
      batchDetailRequestList: []
    };

    batchPayLoad.batchDetailRequestList = self.batchList();

    self.viewPurchaseConfirm = function() {
      self.isRedeem(true);

      params.dashboard.openRightPanel("multiple-purchase-status", {
        self: self
      }, self.multiplePurchasenls.confirmScreen.confirmRedeemPageHeader);
    };

    const confirmScreenDetailsArray = [];

    self.redeem = function() {
      self.disabled(true);

      if (params.rootModel.params.orderStatusFlag) {
        if (self.batchArray[0].redeemFund.txnUnits) {
          delete self.batchArray[0].redeemFund.txnAmount;
        } else {
          delete self.batchArray[0].redeemFund.txnUnits;
        }

        const payload = {
          subCategory: "REDEEM",
          accountHoldingRedeemDTO: {
            accountHoldingDTO: self.batchArray[0].redeemFund
          }
        };

        RedeemFundsReviewModel.updateOrder(self.batchArray[0].redeemFund.investmentAccountNumber.value, self.instructionId(), ko.toJSON(payload)).done(function(data, status, jqXhr) {
          let confirmScreenObj = null;
          const confirmMessage = self.resource.confirmMessage,
            respStatus = self.multiplePurchasenls.confirmScreen.success,
            failedmsg = "--";

          confirmScreenObj = {
            header: self.payLoadArray[0].redeemFund.scheme.schemeName,
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
              confirmScreenres: self.multiplePurchasenls.confirmScreen.confirmRedeemPageHeader
            },
            template: "confirm-screen/purchase-mutual-funds-cards"
          }, self);
        });
      } else {
        for (i = 0; i < batchPayLoad.batchDetailRequestList.length; i++) {
          if (batchPayLoad.batchDetailRequestList[i].payload.txnUnits) {
            delete batchPayLoad.batchDetailRequestList[i].payload.txnAmount;
          } else {
            delete batchPayLoad.batchDetailRequestList[i].payload.txnUnits;
          }

          batchPayLoad.batchDetailRequestList[i].payload = ko.toJSON(batchPayLoad.batchDetailRequestList[i].payload);
        }

        RedeemFundsReviewModel.fireBatch(batchPayLoad, "MULMFRED").done(function(data, status, jqXhr) {
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
                  headerName = self.payLoadArray[p].redeemFund.scheme.schemeName;
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
              confirmScreenDetails: confirmScreenDetailsArray,
              template: "confirm-screen/purchase-mutual-funds",
              resourceBundle: self.resource,
              confirmScreenres: self.multiplePurchasenls.confirmScreen.confirmRedeemPageHeader
            },
            template: "confirm-screen/purchase-mutual-funds-cards"
          }, self);
        });
      }
    };

    self.multiplePurchase(confirmScreenDetailsArray);

    self.details = function() {
      params.dashboard.loadComponent("redeem-funds-global", {
        newFund: false,
        payLoadArray: self.payLoadArray,
        totalAmount: params.rootModel.params.totalAmount
      });
    };
  };
});
