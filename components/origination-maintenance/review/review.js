/**
 * New Products  Maintenance.
 *
 * @module origination-maintenance
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} originationMaintenanceModel
 */
define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/maintenance-base",
  "ojL10n!resources/nls/review-accessibility",
  "ojs/ojknockout",
  "ojs/ojcheckboxset",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojarraydataprovider"
], function(oj, ko, originationMaintenanceModel, resourceBundle, accessibilityResource) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    rootParams.dashboard.headerName(self.resource.header);
    self.accessibilityResource = accessibilityResource;
    self.reviewDataLoaded = ko.observable(false);
    self.showFailureReason = ko.observable(false);
    self.isBackFromReview(false);
    rootParams.baseModel.registerComponent("maintenance-base", "origination-maintenance");
    rootParams.baseModel.registerElement("confirm-screen");
    self.selectedValuesTable = ko.observableArray();
    self.selectedValuesItem = ko.observableArray();
    self.dataprovider = ko.observableArray([]);

    self.columnArray = ko.observableArray([{
      headerText: self.resource.order,
      field: "code"
    }, {
      headerText: self.resource.values,
      field: "type"
    }]);

    const batchRequest = {
      batchDetailRequestList: []
    };

    self.reviewTransactionName = {
      header: self.resource.review,
      reviewHeader: self.resource.beforesubmit
    };

    for (let i = 0; i < self.listItems().length; i++) {
      self.selectedValuesTable.push({
        id: self.listItems()[i].id,
        label: self.listItems()[i].label,
        masterArray: self.tabledata()[i].masterArray(),
        selectedArray: self.tabledata()[i].selectedArray()
      });
    }

    /**
     * Self - description.
     *
     * @param  {type} id - Description.
     * @return {type}    Description.
     */
    self.getdataProvider = function(id) {
      self.selectedValuesItem = [];

      for (let i = 0; i < self.tabledata()[id].selectedArray().length; i++) {
        self.selectedValuesItem.push({
          code: i + 1,
          type: self.tabledata()[id].selectedArray()[i].type
        });
      }

      return new oj.ArrayDataProvider(self.selectedValuesItem, {
        keyAttributes: "type"
      });
    };

    self.backFromReview = function() {
      const context = {};

      context.mode = "EDIT";
      self.selectedStep("financial-type-maintenance");
      self.selectedComponent("financial-type-maintenance");
      self.isBackFromReview(true);
      rootParams.dashboard.loadComponent("maintenance-base", self);
    };

    self.editMaintenanceDetails = function(id) {
      const context = {};

      context.mode = "EDIT";
      self.selectedStep(id);
      self.selectedComponent(id);
      self.isBackFromReview(true);
      rootParams.dashboard.loadComponent("maintenance-base", self);
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.confirmMaintenanceDetails = function() {
      let i, j, value, count = 0;

      batchRequest.batchDetailRequestList = [];

      if (self.tabledata()[0].initialSelectedArray().length || self.tabledata()[1].initialSelectedArray().length || self.tabledata()[2].initialSelectedArray().length || self.tabledata()[3].initialSelectedArray().length || self.tabledata()[4].initialSelectedArray().length) {
        for (j = 0; j < self.tabledata().length; j++) {
          switch (j) {
            case 0:
              value = "/financialIncomeTypes/{code}";
              break;
            case 1:
              value = "/financialLiabilityTypes/{code}";
              break;
            case 2:
              value = "/financialAssetTypes/{code}";
              break;
            case 3:
              value = "/financialExpenseTypes/{code}";
              break;
            case 4:
              value = "/accommodationTypes/{code}";
              break;
          }

          for (i = 0; i < self.tabledata()[j].initialSelectedArray().length; i++) {
            batchRequest.batchDetailRequestList.push({
              methodType: "DELETE",
              uri: {
                value: value,
                params: {
                  code: self.tabledata()[j].initialSelectedArray()[i].code
                }
              },
              headers: {
                "Content-Id": count++,
                "Content-Type": "application/json"
              }
            });
          }
        }

        originationMaintenanceModel.cleanExistingData(batchRequest);
      }

      batchRequest.batchDetailRequestList = [];

      for (j = 0; j < self.tabledata().length; j++) {
        switch (j) {
          case 0:
            value = "/financialIncomeTypes";
            break;
          case 1:
            value = "/financialLiabilityTypes";
            break;
          case 2:
            value = "/financialAssetTypes";
            break;
          case 3:
            value = "/financialExpenseTypes";
            break;
          case 4:
            value = "/accommodationTypes";
            break;
        }

        for (i = 0; i < self.tabledata()[j].selectedArray().length; i++) {
          batchRequest.batchDetailRequestList.push({
            methodType: "POST",
            uri: {
              value: value
            },
            payload: JSON.stringify({
              code: self.tabledata()[j].selectedArray()[i].code,
              description: self.tabledata()[j].selectedArray()[i].type,
              ordinal: i + 1
            }),
            headers: {
              "Content-Id": count++,
              "Content-Type": "application/json"
            }
          });
        }
      }

      for (i = 0; i < self.products().length; i++) {
        batchRequest.batchDetailRequestList.push({
          methodType: "PUT",
          uri: {
            value: "/productTypes/{code}",
            params: {
              code: self.products()[i].id
            }
          },
          payload: JSON.stringify({
            id: self.products()[i].id,
            collateralRequired: self.products()[i].collateralRequired,
            status: self.products()[i].value ? "ACTIVE" : "INACTIVE",
            productClass: self.products()[i].productClass,
            productType: self.products()[i].productType,
            inPrincipleApproval: self.products()[i].inPrincipleApproval,
            sequence: self.products()[i].sequence
          }),
          headers: {
            "Content-Id": count++,
            "Content-Type": "application/json"
          }
        });
      }

      if (self.dealerData && self.dealerData.dealerId()) {
        batchRequest.batchDetailRequestList.push({
          methodType: "PUT",
          uri: {
            value: "/dealers/{dealerId}",
            params: {
              dealerId: self.dealerData.dealerId()
            }
          },
          payload: JSON.stringify({
            dealerId: self.dealerData.dealerId(),
            name: self.dealerData.dealerName(),
            url: self.dealerData.dealerUrl(),
            dealerType: "ABC"
          }),
          headers: {
            "Content-Id": count++,
            "Content-Type": "application/json"
          }
        });
      } else {
        batchRequest.batchDetailRequestList.push({
          methodType: "DELETE",
          uri: {
            value: "/dealers/{dealerId}",
            params: {
              dealerId: self.dealerData.dealerId()
            }
          },
          headers: {
            "Content-Id": count++,
            "Content-Type": "application/json"
          }
        });
      }

      originationMaintenanceModel.saveData(batchRequest).done(function(data, status, jqXHR) {
        let failedTxnSeqId, confirmMessage;

        if (data && data.batchDetailResponseDTOList.length) {
          for (let i = 0; i < data.batchDetailResponseDTOList.length; i++) {
            if (!(JSON.parse(data.batchDetailResponseDTOList[i].status) !== 201 || JSON.parse(data.batchDetailResponseDTOList[i].status) !== 200)) {
              self.showFailureReason(true);
              failedTxnSeqId = data.batchDetailResponseDTOList[i].sequenceId;
            }
          }
        }

        if (failedTxnSeqId) {
          confirmMessage = self.resource.message.failureMessage;
        } else {
          confirmMessage = self.resource.message.successMessage;
        }

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionName: self.transactionName(),
          confirmScreenExtensions: {
            confirmScreenMsgEval: function(data) {
              if (failedTxnSeqId && Number(data.sequenceId) === Number(failedTxnSeqId)) {
                return confirmMessage;
              } else if (!failedTxnSeqId) {
                return data.sequenceId === "1" ? confirmMessage : null;
              }
            },
            showFailureReason: self.showFailureReason,
            isSet: true,
            taskCode: self.taskCode(),
            template: "confirm-screen/origination-maintenance"
          }
        });
      });
    };

    self.reviewDataLoaded(true);
  };
});
