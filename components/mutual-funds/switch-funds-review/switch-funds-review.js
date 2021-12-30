define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/switch-funds-global",
  "ojL10n!resources/nls/multiple-orders-placed",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpopup"
], function (ko, SwitchFundsReviewModel, resourceBundle, multipleSwitchnls) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.resource = resourceBundle;
    self.multiplePurchasenls = multipleSwitchnls;
    self.batchList = ko.observableArray();
    self.multiplePurchase = ko.observableArray();
    self.updateMessage = ko.observable(self.resource.reviewScreen.pageHeader);
    self.disabled = ko.observable(false);
    self.isSwitch = ko.observable(false);
    self.payLoadArray = rootParams.rootModel.params.payLoadArray;
    self.batchArray = JSON.parse(JSON.stringify(self.payLoadArray));
    rootParams.baseModel.registerComponent("multiple-purchase-status", "mutual-funds");

    let i;

    rootParams.dashboard.headerName(self.resource.reviewScreen.pageHeader);

    for (i = 0; i < self.batchArray.length; i++) {
      self.batchList().push({
        methodType: "POST",
        uri: {
          value: "/accounts/investmentAccounts/{investmentAccountId}/holdings/{accountHoldingId}/switch",
          params: {
            investmentAccountId: self.batchArray[i].switchFund.switchInDetails.investmentAccountNumber.value,
            accountHoldingId: self.batchArray[i].holdingId
          }
        },
        headers: {
          "Content-Id": i,
          "Content-Type": "application/json"
        },
        payload: self.batchArray[i].switchFund
      });
    }

    const batchPayLoad = {
      batchDetailRequestList: []
    };

    batchPayLoad.batchDetailRequestList = self.batchList();

    self.viewPurchaseConfirm = function () {
      self.isSwitch(true);

      rootParams.dashboard.openRightPanel("multiple-purchase-status", {
        self: self
      }, self.multiplePurchasenls.confirmScreen.confirmSwitchPageHeader);
    };

    const confirmScreenDetailsArray = [];

    self.processSwitch = function () {
      self.disabled(true);

      if (rootParams.rootModel.params.orderStatusFlag) {

        if (self.batchArray[0].switchFund.switchInDetails.txnUnits) {
          delete self.batchArray[0].switchFund.switchInDetails.txnAmount;
        } else {
          delete self.batchArray[0].switchFund.switchInDetails.txnUnits;
        }

        if (self.batchArray[0].switchFund.switchOutDetails.txnAmount.amount === "") {
          delete self.batchArray[0].switchFund.switchOutDetails.txnAmount;
        }

        if (self.batchArray[0].switchType !== "PSTP") {
          delete self.batchArray[0].switchFund.switchOutDetails.dividendActionCode;
        }

        const payload = {
          subCategory: "SWITCH",
          switchResponseDTO: self.batchArray[0].switchFund
        };

        SwitchFundsReviewModel.updateOrder(self.batchArray[0].switchFund.switchInDetails.investmentAccountNumber.value, self.instructionId(), ko.toJSON(payload)).done(function (data, status, jqXhr) {
          let confirmScreenObj = null;

          const confirmMessage = self.resource.confirmMessage,
            respStatus = self.multiplePurchasenls.confirmScreen.success,
            failedmsg = "--";

          confirmScreenObj = {
            header: self.batchArray[0].switchFund.switchInDetails.scheme.schemeName.concat(",").concat(self.batchArray[0].switchFund.switchOutDetails.scheme.schemeName),
            referenceNumber: data.hostRefId,
            statusMsg: respStatus,
            failureReason: failedmsg
          };

          confirmScreenDetailsArray.push(confirmScreenObj);

          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.updateMessage(),
            viewPurchaseConfirm:self.viewPurchaseConfirm,
            confirmScreenExtensions: {
              confirmScreenMsgEval: function (data) {
                return confirmMessage;
              },
              isSet: true,
              confirmScreenDetails: confirmScreenDetailsArray,
              template: "confirm-screen/purchase-mutual-funds",
              resourceBundle: self.resource,
              confirmScreenres: self.multiplePurchasenls.confirmScreen.confirmSwitchPageHeader
            },
            template: "confirm-screen/purchase-mutual-funds-cards"
          }, self);
        });
      } else {
        for (i = 0; i < batchPayLoad.batchDetailRequestList.length; i++) {
          if (batchPayLoad.batchDetailRequestList[i].payload.switchInDetails.txnUnits) {
            delete batchPayLoad.batchDetailRequestList[i].payload.switchInDetails.txnAmount;
          } else {
            delete batchPayLoad.batchDetailRequestList[i].payload.switchInDetails.txnUnits;
          }

          if (batchPayLoad.batchDetailRequestList[i].payload.switchOutDetails.txnAmount.amount === "") {
            delete batchPayLoad.batchDetailRequestList[i].payload.switchOutDetails.txnAmount;
          }

          if (self.batchArray[i].switchType !== "PSTP") {
            delete batchPayLoad.batchDetailRequestList[i].payload.switchOutDetails.dividendActionCode;
          }

          batchPayLoad.batchDetailRequestList[i].payload = ko.toJSON(batchPayLoad.batchDetailRequestList[i].payload);
        }

        SwitchFundsReviewModel.fireBatch(batchPayLoad, "MULMFSWT").done(function (data, status, jqXhr) {
          let confirmScreenObj = null,
            respStatus = "",
            failedmsg,
            headerName = "",
            failedTxn,
            confirmMessage = "",
            referenceno;

          for (let j = 0; j < data.batchDetailResponseDTOList.length; j++) {
            if (data.batchDetailResponseDTOList[j].status !== 200 && data.batchDetailResponseDTOList[j].status !== 201 && data.batchDetailResponseDTOList[j].status !== 202) {
              failedTxn = data.batchDetailResponseDTOList[j].sequenceId;
              respStatus = self.multiplePurchasenls.confirmScreen.fail;
              referenceno = "--";
              failedmsg = "";

              for (let p = 0; p < batchPayLoad.batchDetailRequestList.length; p++) {
                if (batchPayLoad.batchDetailRequestList[p].headers["Content-Id"] === Number(data.batchDetailResponseDTOList[j].sequenceId)) {
                  headerName = self.batchArray[p].switchFund.switchInDetails.scheme.schemeName.concat(",").concat(self.batchArray[p].switchFund.switchOutDetails.scheme.schemeName);
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
              headerName = data.batchDetailResponseDTOList[j].responseObj.switchInDetails.scheme.schemeName.concat(",").concat(data.batchDetailResponseDTOList[j].responseObj.switchOutDetails.scheme.schemeName);
              respStatus = self.multiplePurchasenls.confirmScreen.success;
              failedmsg = "--";
              referenceno = data.batchDetailResponseDTOList[j].responseObj.switchInDetails.referenceNumber;
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

          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.updateMessage(),
            viewPurchaseConfirm:self.viewPurchaseConfirm,
            confirmScreenExtensions: {
              confirmScreenMsgEval: function (data) {
                if (failedTxn) {
                  return Number(data.sequenceId) === Number(failedTxn) ? confirmMessage : null;
                }

                return data.sequenceId === "0" ? confirmMessage : null;

              },
              isSet: true,
              confirmScreenDetails: confirmScreenDetailsArray,
              template: "confirm-screen/purchase-mutual-funds",
              resourceBundle: self.resource,
              confirmScreenres: self.multiplePurchasenls.confirmScreen.confirmSwitchPageHeader
            },
            template : "confirm-screen/purchase-mutual-funds-cards"
          }, self);
        });
      }
    };

    self.multiplePurchase(confirmScreenDetailsArray);

    self.details = function () {
      rootParams.dashboard.loadComponent("switch-funds-global", {
        newFund: true,
        id: rootParams.rootModel.params.id,
        payLoadArray: self.payLoadArray,
        totalAmount: rootParams.rootModel.params.totalAmount
      });
    };
  };
});