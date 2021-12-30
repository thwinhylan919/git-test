define([

  "knockout",
  "jquery",

  "ojL10n!resources/nls/redeem-funds-global",
  "ojL10n!resources/nls/wealth-management-miscellaneous",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function(ko, $, resourceBundle, deleteWMOrders, RedeemFundsGlobal) {
  "use strict";

  return function(params) {
    const self = this;

    self.resource = resourceBundle;
    self.deleteRedeemOrders = deleteWMOrders;

    self.investmentAccountYes = ko.observable(false);
    self.globalLoaded = ko.observable(true);
    self.id = ko.observable(1);
    self.actionUpdate = ko.observable(false);
    self.fundCount = ko.observable(3);
    self.newFund = ko.observable(false);
    self.buttonDisabled = ko.observable(true);
    self.fundInformationPanel = ko.observable(false);
    self.orderStatusFlag = ko.observable(false);
    params.baseModel.registerComponent("fund-information", "mutual-funds");
    params.baseModel.registerComponent("fund-info-bar", "mutual-funds");
    self.selectedStepValue = ko.observable("redeem-fund-details");
    params.baseModel.registerComponent("redeem-fund-details", "mutual-funds");
    params.baseModel.registerComponent("redeem-order-details", "mutual-funds");
    params.baseModel.registerComponent("switch-funds-global", "mutual-funds");
    params.baseModel.registerComponent("purchase-mutual-fund-train", "mutual-funds");
    self.payLoadArray = ko.observableArray();
    self.showInfoPopUp = ko.observable(false);
    self.fundHousesLoaded = ko.observable(false);
    self.investmentAccountLoaded = ko.observable(false);
    self.schemesLoaded = ko.observable(false);
    self.schemeInfoName = ko.observable();
    self.fundHouseData = ko.observableArray();
    self.fundHouseDTOData = ko.observableArray();
    self.investmentAccountData = ko.observableArray();
    self.schemeData = ko.observableArray();
    self.customEndDate = ko.observable();
    self.accountHoldingId = ko.observable();
    self.schemeCode = ko.observable();
    self.redeemTypeLoaded = ko.observable(false);
    self.frequencyList = ko.observableArray();
    self.installmentList = ko.observableArray();
    self.startDate = ko.observable();
    self.amount = ko.observable();
    self.amountSwp = ko.observable();
    self.totalAmount = ko.observable(0);
    self.orderWidget = ko.observable(true);
    self.dataSource = ko.observable();
    self.showSearchResults = ko.observable(false);
    self.submitDisabled = ko.observable(true);
    self.orderStatusData = ko.observable();
    self.showFloatingButton = ko.observable(false);
    self.estimatedDate = ko.observable();
    self.viewEstimatedDate = ko.observable(false);
    self.schemeDetailsDTO = ko.observable();

    self.headerText = ko.observableArray([{
        headerText: self.resource.fundDetails.schemeName,
        field: "schemeName"
      },
      {
        headerText: self.resource.fundDetails.folio,
        field: "folio"
      },
      {
        headerText: self.resource.fundDetails.purchaseNav,
        field: "purchaseNav",
        headerClassName: "right"
      },
      {
        headerText: self.resource.fundDetails.totalUnits,
        field: "totalUnits",
        headerClassName: "right"
      },
      {
        headerText: self.resource.fundDetails.redeemableUnits,
        field: "redeemableUnits",
        headerClassName: "right"
      },
      {
        headerText: self.resource.fundDetails.marketValue,
        field: "marketValue",
        headerClassName: "right"
      },
      {
        headerText: self.resource.fundDetails.action
      }
    ]);

    let i, j;

    self.getNewKoModel = function() {
      const RedeemFundsModel = RedeemFundsGlobal.getData();

      return RedeemFundsModel;
    };

    self.modelData = self.getNewKoModel();

    if (params.rootModel.action) {
      self.orderStatusFlag(true);
      self.orderStatusData(params.rootModel.editOrderArray());
    }

    self.showInfoPanel = function() {
      params.dashboard.openRightPanel("fund-information", {
        schemeCode: self.modelData.redeemFund.scheme.schemeCode
      }, self.schemeInfoName());
    };

    if(params.rootModel.params.payLoadArray) {
      self.payLoadArray(params.rootModel.params.payLoadArray);
    }

    if(params.rootModel.params.totalAmount) {
      self.totalAmount(params.rootModel.params.totalAmount);
    }

    self.stepArray =
      ko.observableArray(
        [{
            label: self.resource.fundDetailsStep,
            id: "redeem-fund-details",
            visited: true,
            disabled: false
          },
          {
            label: self.resource.orderDetailsStep,
            id: "redeem-order-details",
            visited: true,
            disabled: true
          }
        ]);

    self.fetchHoldingsData = function(accountId) {
      RedeemFundsGlobal.fetchFundHouses(accountId).done(function(data) {
        self.fundHousesLoaded(false);
        self.schemesLoaded(false);
        self.fundHouseData().splice(0, self.fundHouseData().length);
        self.schemeData().splice(0, self.schemeData().length);

        for (i = 0; i < data.accountHoldings.length; i++) {
          self.fundHouseData().push({
            label: null,
            code: data.accountHoldings[i].fundHouseCode
          });
        }

        for (i = 0; i < data.accountHoldings.length; i++) {
          self.schemeData().push({
            label: data.accountHoldings[i].scheme.schemeName,
            code: data.accountHoldings[i].scheme.schemeCode
          });
        }

        for (i = 0; i < self.fundHouseDTOData().length; i++) {
          for (j = 0; j < self.fundHouseData().length; j++) {
            if (self.fundHouseDTOData()[i].code === self.fundHouseData()[j].code) {
              self.fundHouseData()[j].label = self.fundHouseDTOData()[i].label;
            }
          }
        }

        ko.tasks.runEarly();
        self.fundHousesLoaded(true);
        self.schemesLoaded(true);
      });
    };

    self.investmentAccountChange = function(event) {
      self.fetchHoldingsData(event.detail.value.value);
    };

    self.fundHouseChange = function(event) {
      self.schemeData().splice(0, self.schemeData().length);

      RedeemFundsGlobal.fetchSchemes(self.modelData.redeemFund.investmentAccountNumber.value, event.detail.value).done(function(data) {
        self.schemesLoaded(false);

        for (i = 0; i < data.accountHoldings.length; i++) {
          self.schemeData().push({
            label: data.accountHoldings[i].scheme.schemeName,
            code: data.accountHoldings[i].scheme.schemeCode
          });
        }

        ko.tasks.runEarly();
        self.schemesLoaded(true);
      });

      for (i = 0; i < self.fundHouseDTOData().length; i++) {
        if (self.fundHouseDTOData()[i].code === event.detail.value) {
          self.modelData.navigationData.fundHouse = self.fundHouseDTOData()[i].label;
        }
      }
    };

    self.schemePopUp = function(event) {
      for (i = 0; i < self.schemeData().length; i++) {
        if (event.detail.value === self.schemeData()[i].code) {
          self.schemeInfoName(self.schemeData()[i].label);
          break;
        }
      }

      self.showInfoPopUp(true);
    };

    self.onRedeem = function(event) {
      self.accountHoldingId(event.accountHoldingId);
      self.schemeCode(event.schemeCode);
      self.modelData.redeemFund.fundHouseCode = event.fundHouseCode;

      for (i = 0; i < self.fundHouseDTOData().length; i++) {
        if (self.fundHouseDTOData()[i].code === event.fundHouseCode) {
          self.modelData.navigationData.fundHouse = self.fundHouseDTOData()[i].label;
        }
      }

      self.modelData.navigationData.redeemType = "UN";
      self.modelData.redeemFund.instructionTypeCode = "ONE_TIME";
      self.modelData.navigationData.redeemTypeLabel = self.resource.orderDetails.units;
      self.modelData.navigationData.whenChanged = true;
      self.modelData.navigationData.showEnterUnits = true;
      self.modelData.navigationData.showSwp = false;
      self.nextStep();
    };

    self.onSwp = function(event) {
      self.accountHoldingId(event.accountHoldingId);
      self.schemeCode(event.schemeCode);
      self.modelData.redeemFund.fundHouseCode = event.fundHouseCode;

      for (i = 0; i < self.fundHouseDTOData().length; i++) {
        if (self.fundHouseDTOData()[i].code === event.fundHouseCode) {
          self.modelData.navigationData.fundHouse = self.fundHouseDTOData()[i].label;
        }
      }

      self.modelData.navigationData.redeemType = "SWP";
      self.modelData.redeemFund.instructionTypeCode = "SWP";
      self.modelData.navigationData.redeemTypeLabel = self.resource.fundDetails.actionSwp;
      self.modelData.navigationData.whenChanged = false;
      self.modelData.navigationData.showEnterUnits = false;
      self.modelData.navigationData.showSwp = true;
      self.nextStep();
    };

    self.nextStep = function() {
      const itrain = document.getElementById("train");

      self.globalLoaded(false);

      for (j = 0; j < itrain.steps.length; j++) {
        if (itrain.selectedStep === itrain.steps[j].id) {
          itrain.steps[j].visited = true;
          itrain.steps[j].disabled = false;

          if (j < 2) {
            itrain.steps[j + 1].visited = true;
            itrain.steps[j + 1].disabled = false;
          }

          break;
        }
      }

      ko.tasks.runEarly();

      let loadIndex = 0;

      for (i = 0; i < self.stepArray().length; i++) {
        if (self.stepArray()[i].id === self.selectedStepValue()) {
          loadIndex = i + 1;
          break;
        }
      }

      self.selectedStepValue(self.stepArray()[loadIndex].id);
      self.globalLoaded(true);
    };

    self.previousStep = function() {
      self.globalLoaded(false);

      const itrain = document.getElementById("train");

      for (j = 0; j < itrain.steps.length; j++) {
        if (itrain.selectedStep === itrain.steps[j].id) {
          itrain.steps[j].visited = true;
          itrain.steps[j].disabled = false;

          if (j > 0) {
            itrain.steps[j - 1].visited = true;
            itrain.steps[j - 1].disabled = false;
          }

          break;
        }
      }

      ko.tasks.runEarly();

      let loadIndex = 0;

      for (i = 0; i < self.stepArray().length; i++) {
        if (self.stepArray()[i].id === self.selectedStepValue()) {
          loadIndex = i - 1;
          break;
        }
      }

      self.selectedStepValue(self.stepArray()[loadIndex].id);
      self.globalLoaded(true);
      self.showInfoPopUp(true);
    };

    let deleteIndex,
      deleteData = {};

    self.deleteOrderConfirmModal = function(index, data) {
      deleteIndex = index;
      deleteData = data;

      if (!params.baseModel.small()) {
        $("#delete-order-confirm").trigger("openModal");
      } else if (params.baseModel.small()) {
        $("#redeem-fund-cart").trigger("closeModal");
        $("#delete-order-confirm").trigger("openModal");
      }
    };

    self.yesDeleteOrder = function() {
      $("#delete-order-confirm").trigger("closeModal");
      self.deleteOrder(deleteIndex, deleteData);
    };

    self.noDeleteOrder = function() {
      if (!params.baseModel.small()) {
        $("#delete-order-confirm").trigger("closeModal");
      } else if (params.baseModel.small()) {
        $("#delete-order-confirm").trigger("closeModal");
        $("#redeem-fund-cart").trigger("openModal");
      }
    };

    self.deleteOrder = function(index, data) {
      self.payLoadArray.splice(index, 1);
      self.totalAmount(self.totalAmount() - data.redeemFund.txnAmount.amount);

      if (self.payLoadArray().length >= self.fundCount()) {
        self.buttonDisabled(true);
      } else {
        self.buttonDisabled(false);
      }

      self.actionUpdate(false);

      if (self.payLoadArray().length === 0) {
        self.submitDisabled(true);
        self.showFloatingButton(false);
      }

      ko.tasks.runEarly();
      self.newFund(true);
      self.id(self.payLoadArray()[self.payLoadArray().length - 1].id + 1);

      params.dashboard.loadComponent("redeem-funds-global", {
        newFund: self.newFund(),
        payLoadArray: self.payLoadArray(),
        totalAmount: self.totalAmount(),
        id: self.id()
      });
    };

    self.openpartials = function() {
      $("#redeem-fund-cart").trigger("openModal");
    };

    RedeemFundsGlobal.fetchInvestmentAccounts().done(function(data) {
      if (data.investmentAccounts.length) {
        self.investmentAccountYes(true);

        RedeemFundsGlobal.fetchMaintenanceValues().done(function(data) {
          for (let i = 0; i < data.configurationDetails.length; i++) {
            if (data.configurationDetails[i].propertyId === "WM_MF_NUMBER_OF_ORDER_IN_MULTIPLEORDER") {
              self.fundCount(parseInt(data.configurationDetails[i].propertyValue));
            }

            if (data.configurationDetails[i].propertyId === "WM_MF_DAYS_FORWARD_FOR_ORDER_LATER") {
              self.customEndDate(parseInt(data.configurationDetails[i].propertyValue));
            }
          }

        });

        if (params.rootModel.params.newFund) {
          self.newFund(params.rootModel.params.newFund);
          self.id(params.rootModel.params.id);

          if (self.payLoadArray().length > 0) {
            self.showFloatingButton(true);
          }
        }

        if (params.rootModel.params.schemeCode) {
          const investmentDetailsData = params.rootModel.params;

          self.modelData.redeemFund.scheme.schemeCode = investmentDetailsData.schemeCode;
          self.modelData.redeemFund.scheme.schemeName = investmentDetailsData.schemeName;
          self.modelData.redeemFund.fundHouseCode = investmentDetailsData.fundHouseCode;
          self.accountHoldingId(investmentDetailsData.holdingId);
          self.schemeCode(investmentDetailsData.schemeCode);
          self.modelData.redeemFund.folioNumber = parseInt(investmentDetailsData.folioNumber);

          if (investmentDetailsData.instructionTypeCode === "SWP") {
            self.modelData.navigationData.redeemType = investmentDetailsData.instructionTypeCode;
            self.modelData.navigationData.showEnterUnits = false;
            self.modelData.navigationData.showAllUnits = false;
            self.modelData.navigationData.showEnterAmount = false;
            self.modelData.navigationData.whenChanged = false;
            self.modelData.navigationData.showSwp = true;
            self.modelData.navigationData.when = "NOW";
          } else {
            self.modelData.navigationData.redeemType = "UN";
            self.modelData.navigationData.showAllUnits = false;
            self.modelData.navigationData.showEnterAmount = false;
            self.modelData.navigationData.showSwp = false;
            self.modelData.navigationData.showEnterUnits = true;
            self.modelData.navigationData.whenChanged = true;
            self.modelData.navigationData.when = "NOW";
          }

          self.modelData.instructionTypeCode = investmentDetailsData.instructionTypeCode;

          self.modelData.redeemFund.investmentAccountNumber = {
            value: investmentDetailsData.investmentAccount.value(),
            displayValue: investmentDetailsData.investmentAccount.displayValue()
          };

          const promises = [];

          promises.push(RedeemFundsGlobal.fetchFundHouse());
          promises.push(RedeemFundsGlobal.fetchFundHouses(investmentDetailsData.investmentAccount.value()));
          promises.push(RedeemFundsGlobal.fetchMaintenanceValues());

          Promise.all(promises).then(function(array) {
            self.fundHouseDTOData().splice(0, self.fundHouseDTOData().length);
            self.fundHousesLoaded(false);
            self.schemesLoaded(false);
            self.fundHouseData().splice(0, self.fundHouseData().length);
            self.schemeData().splice(0, self.schemeData().length);

            for (i = 0; i < array[0].fundhousedtos.length; i++) {
              self.fundHouseDTOData().push({
                label: array[0].fundhousedtos[i].fundHouseName,
                code: array[0].fundhousedtos[i].fundHouseCode
              });
            }

            for (i = 0; i < self.fundHouseDTOData().length; i++) {
              if (self.fundHouseDTOData()[i].code === self.modelData.redeemFund.fundHouseCode) {
                self.modelData.navigationData.fundHouse = self.fundHouseDTOData()[i].label;
              }
            }

            for (i = 0; i < array[1].accountHoldings.length; i++) {
              self.fundHouseData().push({
                label: null,
                code: array[1].accountHoldings[i].fundHouseCode
              });

              self.schemeData().push({
                label: array[1].accountHoldings[i].scheme.schemeName,
                code: array[1].accountHoldings[i].scheme.schemeCode
              });
            }

            for (i = 0; i < self.fundHouseDTOData().length; i++) {
              for (j = 0; j < self.fundHouseData().length; j++) {
                if (self.fundHouseDTOData()[i].code === self.fundHouseData()[j].code) {
                  self.fundHouseData()[j].label = self.fundHouseDTOData()[i].label;
                }
              }
            }

            for (i = 0; i < array[2].configurationDetails.length; i++) {
              if (array[2].configurationDetails[i].propertyId === "WM_MF_NUMBER_OF_ORDER_IN_MULTIPLEORDER") {
                self.fundCount(parseInt(array[2].configurationDetails[i].propertyValue));
              }

              if (array[2].configurationDetails[i].propertyId === "WM_MF_DAYS_FORWARD_FOR_ORDER_LATER") {
                self.customEndDate(parseInt(array[2].configurationDetails[i].propertyValue));
              }
            }

            ko.tasks.runEarly();
            self.fundHousesLoaded(true);
            self.schemesLoaded(true);

            self.stepArray(
              [{
                  label: self.resource.fundDetailsStep,
                  id: "redeem-fund-details",
                  visited: true,
                  disabled: false
                },
                {
                  label: self.resource.orderDetailsStep,
                  id: "redeem-order-details",
                  visited: true,
                  disabled: false
                }
              ]);

            self.selectedStepValue("redeem-order-details");
            self.showFloatingButton(false);
          });
        }

        if (!params.rootModel.params.newFund && self.payLoadArray().length > 0) {
          self.modelData.redeemFund = self.payLoadArray()[0].redeemFund;
          self.modelData.navigationData = self.payLoadArray()[0].navigationData;
          self.accountHoldingId(self.payLoadArray()[0].accountHoldingId);
          self.id(self.payLoadArray()[0].id);
          self.estimatedDate(self.payLoadArray()[0].estimatedDate);
          self.amount(self.payLoadArray()[0].redeemFund.txnAmount.amount);
          self.amountSwp(self.payLoadArray()[0].redeemFund.txnAmount.amount);
          self.schemeCode(self.payLoadArray()[0].redeemFund.scheme.schemeCode);
          self.accountHoldingId(self.payLoadArray()[0].accountHoldingId);
          self.viewEstimatedDate(true);
          self.submitDisabled(false);

          const promises = [];

          promises.push(RedeemFundsGlobal.fetchFundHouse());
          promises.push(RedeemFundsGlobal.fetchFundHouses(self.modelData.redeemFund.investmentAccountNumber.value));
          promises.push(RedeemFundsGlobal.fetchMaintenanceValues());

          Promise.all(promises).then(function(array) {
            self.fundHouseDTOData().splice(0, self.fundHouseDTOData().length);
            self.fundHousesLoaded(false);
            self.schemesLoaded(false);
            self.fundHouseData().splice(0, self.fundHouseData().length);
            self.schemeData().splice(0, self.schemeData().length);

            for (i = 0; i < array[0].fundhousedtos.length; i++) {
              self.fundHouseDTOData().push({
                label: array[0].fundhousedtos[i].fundHouseName,
                code: array[0].fundhousedtos[i].fundHouseCode
              });
            }

            for (i = 0; i < self.fundHouseDTOData().length; i++) {
              if (self.fundHouseDTOData()[i].code === self.modelData.redeemFund.fundHouseCode) {
                self.modelData.navigationData.fundHouse = self.fundHouseDTOData()[i].label;
              }
            }

            for (i = 0; i < array[1].accountHoldings.length; i++) {
              self.fundHouseData().push({
                label: null,
                code: array[1].accountHoldings[i].fundHouseCode
              });

              self.schemeData().push({
                label: array[1].accountHoldings[i].scheme.schemeName,
                code: array[1].accountHoldings[i].scheme.schemeCode
              });
            }

            for (i = 0; i < self.fundHouseDTOData().length; i++) {
              for (j = 0; j < self.fundHouseData().length; j++) {
                if (self.fundHouseDTOData()[i].code === self.fundHouseData()[j].code) {
                  self.fundHouseData()[j].label = self.fundHouseDTOData()[i].label;
                }
              }
            }

            for (i = 0; i < array[2].configurationDetails.length; i++) {
              if (array[2].configurationDetails[i].propertyId === "WM_MF_NUMBER_OF_ORDER_IN_MULTIPLEORDER") {
                self.fundCount(parseInt(array[2].configurationDetails[i].propertyValue));
              }

              if (array[2].configurationDetails[i].propertyId === "WM_MF_DAYS_FORWARD_FOR_ORDER_LATER") {
                self.customEndDate(parseInt(array[2].configurationDetails[i].propertyValue));
              }
            }

            ko.tasks.runEarly();
            self.fundHousesLoaded(true);
            self.schemesLoaded(true);

            self.stepArray(
              [{
                  label: self.resource.fundDetailsStep,
                  id: "redeem-fund-details",
                  visited: true,
                  disabled: false
                },
                {
                  label: self.resource.orderDetailsStep,
                  id: "redeem-order-details",
                  visited: true,
                  disabled: false
                }
              ]);

            self.selectedStepValue("redeem-order-details");
            self.showFloatingButton(false);
          });

        }

        RedeemFundsGlobal.fetchFundHouse().done(function(data) {
          self.fundHouseDTOData().splice(0, self.fundHouseDTOData().length);

          for (i = 0; i < data.fundhousedtos.length; i++) {
            self.fundHouseDTOData().push({
              label: data.fundhousedtos[i].fundHouseName,
              code: data.fundhousedtos[i].fundHouseCode
            });
          }
        });

        for (i = 0; i < data.investmentAccounts.length; i++) {
          self.investmentAccountData().push({
            code: data.investmentAccounts[i].accountId,
            label: data.investmentAccounts[i].accountId.displayValue,
            primaryHolderName: data.investmentAccounts[i].primaryHolderName,
            holdingPattern: data.investmentAccounts[i].holdingPattern
          });
        }

        self.investmentAccountLoaded(true);
        ko.tasks.runEarly();

        if (self.orderStatusFlag() && self.payLoadArray().length === 0) {
          self.modelData.redeemFund = self.orderStatusData().accountHoldingDTO;
          self.schemeCode(self.orderStatusData().accountHoldingDTO.scheme.schemeCode);
          self.accountHoldingId(self.orderStatusData().accountHoldingDTO.accountHoldingId);

          if (self.orderStatusData().accountHoldingDTO.instructionTypeCode === "ONE_TIME") {
            self.amount(self.modelData.redeemFund.txnAmount.amount);
            self.modelData.navigationData.redeemType = "AMT";
            self.modelData.navigationData.when = "NOW";
            self.modelData.navigationData.whenChanged = true;
            self.modelData.navigationData.showEnterAmount = true;
            self.modelData.navigationData.showSwp = false;
            self.modelData.navigationData.showEnterUnits = false;
          } else if (self.orderStatusData().accountHoldingDTO.instructionTypeCode === "SWP") {
            self.amountSwp(self.modelData.redeemFund.txnAmount.amount);
            self.modelData.navigationData.redeemType = self.modelData.redeemFund.instructionTypeCode;
            self.modelData.navigationData.whenChanged = false;
            self.modelData.navigationData.showSwp = true;
            self.modelData.navigationData.showEnterAmount = false;
            self.modelData.navigationData.showEnterUnits = false;
          } else if (self.orderStatusData().accountHoldingDTO.instructionTypeCode === "LATER") {
            self.amount(self.modelData.redeemFund.txnAmount.amount);
            self.modelData.navigationData.redeemType = "AMT";
            self.modelData.navigationData.when = self.modelData.redeemFund.instructionTypeCode;
            self.modelData.navigationData.whenChanged = true;
            self.modelData.navigationData.showEnterAmount = true;
            self.modelData.navigationData.showSwp = false;
            self.modelData.navigationData.showEnterAmount = false;
          }

          if (self.modelData.redeemFund.txnUnits) {
            self.modelData.navigationData.redeemType = "UN";
            self.modelData.navigationData.showEnterUnits = true;
          }

          const promises = [];

          promises.push(RedeemFundsGlobal.fetchFundHouse());
          promises.push(RedeemFundsGlobal.fetchFundHouses(self.modelData.redeemFund.investmentAccountNumber.value));
          promises.push(RedeemFundsGlobal.fetchMaintenanceValues());

          Promise.all(promises).then(function(array) {
            self.fundHouseDTOData().splice(0, self.fundHouseDTOData().length);
            self.fundHousesLoaded(false);
            self.schemesLoaded(false);
            self.fundHouseData().splice(0, self.fundHouseData().length);
            self.schemeData().splice(0, self.schemeData().length);

            for (i = 0; i < array[0].fundhousedtos.length; i++) {
              self.fundHouseDTOData().push({
                label: array[0].fundhousedtos[i].fundHouseName,
                code: array[0].fundhousedtos[i].fundHouseCode
              });
            }

            for (i = 0; i < self.fundHouseDTOData().length; i++) {
              if (self.fundHouseDTOData()[i].code === self.modelData.redeemFund.fundHouseCode) {
                self.modelData.navigationData.fundHouse = self.fundHouseDTOData()[i].label;
              }
            }

            for (i = 0; i < array[1].accountHoldings.length; i++) {
              self.fundHouseData().push({
                label: null,
                code: array[1].accountHoldings[i].fundHouseCode
              });

              self.schemeData().push({
                label: array[1].accountHoldings[i].scheme.schemeName,
                code: array[1].accountHoldings[i].scheme.schemeCode
              });
            }

            for (i = 0; i < self.fundHouseDTOData().length; i++) {
              for (j = 0; j < self.fundHouseData().length; j++) {
                if (self.fundHouseDTOData()[i].code === self.fundHouseData()[j].code) {
                  self.fundHouseData()[j].label = self.fundHouseDTOData()[i].label;
                }
              }
            }

            for (i = 0; i < array[2].configurationDetails.length; i++) {
              if (array[2].configurationDetails[i].propertyId === "WM_MF_NUMBER_OF_ORDER_IN_MULTIPLEORDER") {
                self.fundCount(parseInt(array[2].configurationDetails[i].propertyValue));
              }

              if (array[2].configurationDetails[i].propertyId === "WM_MF_DAYS_FORWARD_FOR_ORDER_LATER") {
                self.customEndDate(parseInt(array[2].configurationDetails[i].propertyValue));
              }
            }

            ko.tasks.runEarly();
            self.fundHousesLoaded(true);
            self.schemesLoaded(true);

            self.stepArray(
              [{
                  label: self.resource.fundDetailsStep,
                  id: "redeem-fund-details",
                  visited: true,
                  disabled: false
                },
                {
                  label: self.resource.orderDetailsStep,
                  id: "redeem-order-details",
                  visited: true,
                  disabled: false
                }
              ]);

            self.selectedStepValue("redeem-order-details");
            self.orderWidget(false);
            self.showFloatingButton(false);
          });
        }

      } else {
        params.baseModel.registerComponent("open-investment-account-landing", "mutual-funds");
        params.dashboard.loadComponent("open-investment-account-landing", {});
      }
    });
  };
});
