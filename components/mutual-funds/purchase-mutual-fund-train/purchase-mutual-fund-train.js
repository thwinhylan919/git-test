define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/purchase-mutual-fund",
  "ojL10n!resources/nls/wealth-management-miscellaneous",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojnavigationlist",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojselectcombobox",
  "ojs/ojpopup"
], function (oj, ko, $, resourceBundle, deleteWMOrders, ServiceRequestGlobal) {
  "use strict";

  return function (params) {
    const self = this;

    self.investmentAccountYes = ko.observable(false);

    ServiceRequestGlobal.fetchInvestmentAccounts().done(function (data) {
      if (data.investmentAccounts.length) {
        self.investmentAccountYes(true);
        self.outerArray = ko.observableArray();
        params.baseModel.registerElement("nav-bar");
        params.baseModel.registerElement("modal-window");

        if (params.rootModel.instructionId) {
          self.instructionId = ko.observable(params.rootModel.instructionId());
        }

        self.menuSelection = ko.observable("recommended");
        self.resource = resourceBundle;
        self.deletePurchaseOrders = deleteWMOrders;
        self.oldData = ko.observable(false);
        self.fundInformationPanel = ko.observable(false);
        self.maximumNumberOfPurchases = ko.observable();
        self.orderStatusFlag = ko.observable(false);
        self.showFloatingButton = ko.observable(false);
        self.orderStatusData = ko.observable();
        self.estimatedDate = ko.observable();
        self.additionalDetails = ko.observable();
        self.viewEstimatedDate = ko.observable(false);
        self.payLoadArray = ko.observableArray();
        self.globalLoaded = ko.observable(true);
        self.selectedStepValue = ko.observable("purchase-mutual-fund");

        if (params.rootModel.action) {
          self.orderStatusFlag(true);
          self.orderStatusData(params.rootModel.editOrderArray());
        }

        self.uiOptions = {
          menuFloat: "left",
          fullWidth: false,
          defaultOption: self.menuSelection
        };

        self.menuOptions = ko.observableArray([{
            id: "recommended",
            label: self.resource.recommendedFundsTab
          },
          {
            id: "toppurchased",
            label: self.resource.topfunds
          }
        ]);

        self.menuSelection.subscribe(function () {
          self.showSearchResults(false);

          if (self.menuSelection() === "recommended") {
            self.tableFill(self.recommendedSchemes);
          } else if (self.menuSelection() === "toppurchased") {
            self.tableFill(self.topSchemes);
          }
        });

        self.dashboardRedirect = ko.observable(false);
        self.totalAmount = ko.observable(0);
        self.orderWidget = ko.observable(true);
        self.singlePurchase = ko.observable(true);
        self.recommendedSchemes = ko.observable();
        self.topSchemes = ko.observable();
        self.maxRating = ko.observable(5);
        self.dataSource = ko.observable();
        self.id = ko.observable(1);
        self.customEndDate = ko.observable(20);
        self.showSearchResults = ko.observable(false);
        self.actionUpdate = ko.observable(false);
        self.addNewButton = ko.observable(true);
        self.disabledButtons = ko.observable(true);

        self.getNewKoModel = function () {
          const SRDefinitionModel = ServiceRequestGlobal.getData();

          return SRDefinitionModel;
        };

        self.count = ko.observable(0);
        self.newFund = ko.observable(true);

        self.tableFill = function (data) {
          let tempData = null;

          tempData = $.map(data.schemedtos, function (v) {
            const newObj = {};

            newObj.schemeName = v.schemeName;
            newObj.schemeCode = v.schemeCode;
            newObj.ratingValue = parseInt(v.fundRating);
            newObj.date = v.startDate;
            newObj.fundHouseCode = v.fundHouseCode;
            newObj.categoryCode = v.fundCategory.fundCategoryCode;
            newObj.latestPrice = v.nav.amount;
            newObj.currency = v.nav.currency;

            if (v.schemeReturns.oneMonth) {
              newObj.oneMonth = v.schemeReturns.oneMonth;
            } else {
              newObj.oneMonth = "--";
            }

            if (v.schemeReturns.threeMonth) {
              newObj.threeMonths = v.schemeReturns.threeMonth;
            } else {
              newObj.threeMonths = "--";
            }

            if (v.schemeReturns.oneYear) {
              newObj.oneYear = v.schemeReturns.oneYear;
            } else {
              newObj.oneYear = "--";
            }

            if (v.schemeReturns.threeYear) {
              newObj.threeYears = v.schemeReturns.threeYear;
            } else {
              newObj.threeYears = "--";
            }

            if (v.schemeReturns.fiveyear) {
              newObj.fiveYears = v.schemeReturns.fiveyear;
            } else {
              newObj.fiveYears = "--";
            }

            return newObj;
          });

          self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
            idAttribute: "schemeCode"
          })));

          ko.tasks.runEarly();
          self.showSearchResults(true);
        };

        self.menuSelectOptions = ko.observableArray();

        self.menuSelectOptions.push({
          code: "ONE_TIME",
          value: self.resource.buy,
          module: "purchase-mutual-fund-train"
        });

        self.menuSelectOptions.push({
          code: "SIP",
          value: self.resource.systematicInvestment,
          module: "purchase-mutual-fund-train"
        });

        self.menuSelectOptions.push({
          code: "SI",
          value: self.resource.standingInstruction,
          module: "redeem-funds-global"
        });

        self.headerText = ko.observableArray([{
            headerText: self.resource.schemeName,
            field: "schemeName"
          },
          {
            headerText: self.resource.latestPrice,
            field: "latestPrice",
            headerClassName: "right"
          },
          {
            headerText: self.resource.tableDate,
            field: "date"
          },
          {
            headerText: self.resource.oneMonth,
            field: "oneMonth"
          },
          {
            headerText: self.resource.threeMonths,
            field: "threeMonths"
          },
          {
            headerText: self.resource.oneYear,
            field: "oneYear"
          },
          {
            headerText: self.resource.threeYears,
            field: "threeYears"
          },
          {
            headerText: self.resource.fiveYears,
            field: "fiveYears"
          },
          {
            headerText: self.resource.actions
          }
        ]);

        if (params.rootModel.params.totalAmount) {
          self.totalAmount(params.rootModel.params.totalAmount);
        }

        if (params.rootModel.params.payLoadArray) {
          self.payLoadArray(params.rootModel.params.payLoadArray);
        }

        if (params.rootModel.params.newFund) {
          self.newFund(params.rootModel.params.newFund);
          self.id(params.rootModel.params.id);

          if (self.payLoadArray().length > 0) {
            self.showFloatingButton(true);
          }
        }

        if (params.rootModel.params.count) {
          self.count(params.rootModel.params.count);
          self.newFund(params.rootModel.params.newFund);
          self.outerArray(params.rootModel.params.outerArray);
        }

        if (self.newFund()) {
          self.modelData = self.getNewKoModel();
        } else {
          self.modelData = params.rootModel.modelData;
          self.oldData(true);
        }

        self.purchaseFund = self.modelData.purchaseFund;
        self.extraData = self.modelData.extraData;
        self.valueData = self.modelData.valueData;

        if (params.rootModel.params.schemeCode) {
          self.purchaseFund.scheme.schemeCode = params.rootModel.params.schemeCode;
          self.purchaseFund.scheme.schemeName = params.rootModel.params.schemeName;
          self.purchaseFund.folioNumber = params.rootModel.params.folioNumber;
          self.valueData.folioNumber = params.rootModel.params.folioNumber;
          self.purchaseFund.fundHouseCode = params.rootModel.params.fundHouseCode;
          self.valueData.fundHouse = params.rootModel.params.fundHouseCode;
          self.purchaseFund.instructionTypeCode = params.rootModel.params.instructionTypeCode;

          self.purchaseFund.investmentAccountNumber = {
            value: params.rootModel.params.investmentAccount.value(),
            displayValue: params.rootModel.params.investmentAccount.displayValue()
          };

          self.dashboardRedirect(true);
          self.extraData.newOld = "EXISTING";
        }

        self.mockAmount = ko.observable(self.purchaseFund.txnAmount.amount);
        self.selectedAccount = ko.observable(self.purchaseFund.casaAccountNumber);

        params.baseModel.registerComponent("purchase-mutual-fund", "mutual-funds");
        params.baseModel.registerComponent("purchase-order-details", "mutual-funds");
        params.baseModel.registerComponent("redeem-funds-global", "mutual-funds");
        params.baseModel.registerComponent("switch-funds-global", "mutual-funds");
        self.investmentAccountData = ko.observableArray();
        self.accountData = ko.observableArray();
        self.folioData = ko.observableArray();
        self.investmentAccountLoaded = ko.observable(false);
        self.folioLoaded = ko.observable(false);
        self.riskProfile = ko.observable(self.extraData.riskProfile);
        self.availableBalance = ko.observable();
        self.minAmount = ko.observable();
        self.recommended = ko.observable(false);
        self.stepTwoEnable = ko.observable(false);
        self.accountsLoaded = ko.observable(false);
        self.fundHousesLoaded = ko.observable(false);
        self.schemeNameLoaded = ko.observable(false);
        self.purchaseTypeLoaded = ko.observable(false);
        self.fundHouseData = ko.observableArray();
        self.schemeData = ko.observableArray();
        self.schemeDetailsDTO = ko.observable();

        let tracker, i, j;

        ServiceRequestGlobal.fetchFundHouse().done(function (data) {
          self.fundHouseData().splice(0, self.fundHouseData().length);

          for (i = 0; i < data.fundhousedtos.length; i++) {
            self.fundHouseData().push({
              label: data.fundhousedtos[i].fundHouseName,
              code: data.fundhousedtos[i].fundHouseCode
            });
          }

          self.fundHousesLoaded(true);
        });

        ServiceRequestGlobal.getAccountNumberData().done(function (data) {
          const len = data.accounts.length;
          let i;

          for (i = 0; i < len; i++) {
            self.accountData().push({
              label: data.accounts[i].id.displayValue,
              code: data.accounts[i].id.value,
              currency: data.accounts[i].availableBalance.currency,
              amount: data.accounts[i].availableBalance.amount
            });
          }

          self.valueData.casaAccountNumberValue = self.accountData()[0].label;
          self.purchaseFund.txnAmount.currency = self.accountData()[0].currency;
          self.availableBalance(self.accountData()[0].amount);
          ko.tasks.runEarly();
          self.accountsLoaded(true);
        });

        ServiceRequestGlobal.fetchMaintenanceValues().done(function (data) {
          for (let i = 0; i < data.configurationDetails.length; i++) {
            if (data.configurationDetails[i].propertyId === "WM_MF_NUMBER_OF_ORDER_IN_MULTIPLEORDER") {
              self.maximumNumberOfPurchases(parseInt(data.configurationDetails[i].propertyValue));
            }

            if (data.configurationDetails[i].propertyId === "WM_MF_DAYS_FORWARD_FOR_ORDER_LATER") {
              self.customEndDate(parseInt(data.configurationDetails[i].propertyValue));
            }
          }
        });

        let deleteIndex,
          deleteData = {};

        self.deleteOrderConfirmModal = function (index, data) {
          deleteIndex = index;
          deleteData = data;

          if (!params.baseModel.small()) {
            $("#delete-order-confirm").trigger("openModal");
          } else if (params.baseModel.small()) {
            $("#purchase-fund-cart").trigger("closeModal");
            $("#delete-order-confirm").trigger("openModal");
          }
        };

        self.yesDeleteOrder = function () {
          $("#delete-order-confirm").trigger("closeModal");
          self.deleteOrder(deleteIndex, deleteData);
        };

        self.noDeleteOrder = function () {
          if (!params.baseModel.small()) {
            $("#delete-order-confirm").trigger("closeModal");
          } else if (params.baseModel.small()) {
            $("#delete-order-confirm").trigger("closeModal");
            $("#purchase-fund-cart").trigger("openModal");
          }
        };

        self.deleteOrder = function (index, data) {
          if (self.payLoadArray()[index].id === self.id()) {
            self.actionUpdate(false);
          }

          self.payLoadArray.splice(index, 1);
          self.totalAmount(self.totalAmount() - data.purchaseFund.txnAmount.amount);
          self.count(self.count() - 1);
          self.addNewButton(true);
          self.disabledButtons(false);

          if (self.payLoadArray().length === 0) {
            self.singlePurchase(true);
            self.actionUpdate(false);
            self.showFloatingButton(false);
          }

          ko.tasks.runEarly();
          self.newFund(true);
          self.id(self.id() + 1);

          params.dashboard.loadComponent("purchase-mutual-fund-train", {
            newFund: self.newFund(),
            payLoadArray: self.payLoadArray(),
            totalAmount: self.totalAmount(),
            id: self.id(),
            count: self.count(),
            outerArray: self.outerArray()
          });
        };

        for (i = 0; i < data.investmentAccounts.length; i++) {
          self.investmentAccountData().push({
            code: data.investmentAccounts[i].accountId,
            value: data.investmentAccounts[i].accountId.value,
            label: data.investmentAccounts[i].accountId.displayValue,
            primaryHolderName: data.investmentAccounts[i].primaryHolderName,
            holdingPattern: data.investmentAccounts[i].holdingPattern,
            riskProfile: data.investmentAccounts[i].riskProfile.riskProfileCode
          });
        }

        self.investmentAccountLoaded(true);

        if (!params.rootModel.params.newFund && self.payLoadArray().length > 0) {
          self.purchaseFund = self.payLoadArray()[0].purchaseFund;
          self.extraData = self.payLoadArray()[0].extraData;
          self.valueData = self.payLoadArray()[0].valueData;
          self.fundHouseData(params.rootModel.params.fundHouseData);
          self.schemeDetailsDTO(params.rootModel.params.schemeDetailsDTO);
          self.id(self.payLoadArray()[0].id);
          self.selectedAccount(self.purchaseFund.casaAccountNumber.value);
          self.riskProfile(self.payLoadArray()[0].extraData.riskProfile);
          self.mockAmount(self.payLoadArray()[0].purchaseFund.txnAmount.amount);

          self.stepArray =
            ko.observableArray(
              [{
                  label: self.resource.fundDetails,
                  id: "purchase-mutual-fund",
                  visited: true,
                  disabled: false
                },
                {
                  label: self.resource.orderDetails,
                  id: "purchase-order-details",
                  visited: true,
                  disabled: true
                }
              ]);

          self.selectedStepValue("purchase-mutual-fund");
        } else {
          self.stepArray =
            ko.observableArray(
              [{
                  label: self.resource.fundDetails,
                  id: "purchase-mutual-fund",
                  visited: false,
                  disabled: false
                },
                {
                  label: self.resource.orderDetails,
                  id: "purchase-order-details",
                  visited: false,
                  disabled: true
                }
              ]);
        }

        self.nextStep = function () {
          if (self.recommended() === false) {
            tracker = document.getElementById("fbtracker");

            if (!params.baseModel.showComponentValidationErrors(tracker)) {
              return;
            }
          }

          const itrain = document.getElementById("train");

          if (itrain.selectedStep === "purchase-order-details") {
            self.stepTwoEnable(true);
          }

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

        self.previousStep = function () {
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
        };

        self.buy = function (event, instruction) {
          self.recommended(true);

          for (let i = 0; i < self.fundHouseData().length; i++) {
            if (self.fundHouseData()[i].code === event.fundHouseCode) {
              self.valueData.fundHouse = self.fundHouseData()[i].label;
            }
          }

          self.purchaseFund.fundHouseCode = event.fundHouseCode;
          self.purchaseFund.instructionTypeCode = instruction;

          ServiceRequestGlobal.fetchSchemeDetails(event.schemeCode).done(function (data) {
            self.schemeDetailsDTO(data);
            self.nextStep();
          });
        };

        self.tabChange = function (event) {
          self.showSearchResults(false);

          if (event.detail.toKey[0] === "toppurchased") {
            self.tableFill(self.topSchemes);
          } else if (event.detail.toKey[0] === "recommended") {
            self.tableFill(self.recommendedSchemes);
          }
        };

        if (self.orderStatusFlag() === false) {
          ServiceRequestGlobal.fetchRecommendedSchemes().done(function (data) {
            self.recommendedSchemes = data;
            self.tableFill(data);
          });

          ServiceRequestGlobal.fetchTopSchemes().done(function (data) {
            self.topSchemes = data;
          });
        }

        if (self.orderStatusFlag()) {
          const orderStatusTemp = self.orderStatusData().accountHoldingDTO;

          self.purchaseFund.investmentAccountNumber = orderStatusTemp.investmentAccountNumber;
          self.purchaseFund.fundHouseCode = orderStatusTemp.fundHouseCode;
          self.purchaseFund.recurring = orderStatusTemp.recurring;
          self.purchaseFund.instructionTypeCode = orderStatusTemp.instructionTypeCode;
          self.purchaseFund.folioNumber = orderStatusTemp.folioNumber;
          self.purchaseFund.dividendActionCode = orderStatusTemp.dividendActionCode;
          self.purchaseFund.frequency = orderStatusTemp.frequency;
          self.purchaseFund.installments = orderStatusTemp.installments;
          self.purchaseFund.endDate = orderStatusTemp.endDate;
          self.purchaseFund.startDate = orderStatusTemp.startDate;

          if (orderStatusTemp.instructionTypeCode === "ONE_TIME") {
            if (orderStatusTemp.scheduledDate) {
              self.purchaseFund.scheduledDate = orderStatusTemp.scheduledDate;
              self.extraData.nowLater = "LATER";
            }
          }

          self.purchaseFund.txnAmount.amount = orderStatusTemp.txnAmount.amount;
          self.purchaseFund.txnAmount.currency = orderStatusTemp.txnAmount.currency;
          self.purchaseFund.scheme.schemeCode = orderStatusTemp.scheme.schemeCode;
          self.purchaseFund.scheme.schemeName = orderStatusTemp.scheme.schemeName;
          self.purchaseFund.scheme.fundCategory.fundCategoryCode = orderStatusTemp.scheme.fundCategory.fundCategoryCode;
          self.purchaseFund.scheme.fundCategory.fundCategoryDesc = orderStatusTemp.scheme.fundCategory.fundCategoryDesc;
          self.mockAmount(self.purchaseFund.txnAmount.amount);
          self.orderWidget(false);
          self.showFloatingButton(false);
        }

        self.openMenu = function (model, event) {
          self.modelUsage = ko.observable(model);

          const launcherId = event.currentTarget.attributes.id.nodeValue;

          self.launcherId = launcherId;
          document.getElementById(self.launcherId + "container").open();
        };

        self.menuItemSelect = function (event, data) {
          self.buy(data, event.target.id);
        };

        self.openpartials = function () {
          $("#purchase-fund-cart").trigger("openModal");
        };
      } else {
        params.baseModel.registerComponent("open-investment-account-landing", "mutual-funds");
        params.dashboard.loadComponent("open-investment-account-landing");
      }
    });
  };
});