define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/switch-funds-global",
  "ojL10n!resources/nls/wealth-management-miscellaneous",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, resourceBundle, deleteWMOrders, SwitchFundsGlobal) {
  "use strict";

  return function (params) {
    const self = this;

    self.resource = resourceBundle;
    self.deleteSwitchOrders = deleteWMOrders;

    self.investmentAccountYes = ko.observable(false);
    self.orderStatusFlag = ko.observable(false);
    self.switchOutInfoScheme = ko.observable();
    self.switchInInfoScheme = ko.observable();
    self.orderStatusLoaded = ko.observable(false);
    self.orderStatusData = ko.observable();
    self.globalLoaded = ko.observable(true);
    self.id = ko.observable(1);
    self.switchOutSchemeShow = ko.observable(false);
    self.switchInSchemeShow = ko.observable(false);
    self.fundCount = ko.observable(3);
    self.switchTypeData = ko.observableArray();
    self.switchType = ko.observable("ONE_TIME");
    self.onetimeSwitchType = ko.observable("AMT");
    self.buttonDisabled = ko.observable(true);
    self.selectedAccount = ko.observable();
    self.additionalDetails = ko.observable();
    self.payLoadArray = ko.observableArray();
    self.newFund = ko.observable(false);
    self.orderWidget = ko.observable(true);
    self.actionUpdate = ko.observable(false);
    self.showFloatingButton = ko.observable(false);
    params.baseModel.registerElement("amount-input");
    params.baseModel.registerElement("account-input");
    self.selectedStepValue = ko.observable("switch-fund-details");
    params.baseModel.registerComponent("switch-fund-details", "mutual-funds");
    params.baseModel.registerComponent("switch-order-details", "mutual-funds");
    params.baseModel.registerComponent("redeem-funds-global", "mutual-funds");
    params.baseModel.registerComponent("purchase-mutual-fund-train", "mutual-funds");
    self.fundHousesLoaded = ko.observable(false);
    self.fundCategoryData = ko.observableArray();
    self.fundCategoryLoaded = ko.observable(false);
    self.investmentAccountLoaded = ko.observable(false);
    self.schemesLoaded = ko.observable(false);
    self.switchInSchemesLoaded = ko.observable(false);
    self.fundHouseData = ko.observableArray();
    self.fundHouseDisabled = ko.observable(false);
    self.fundHouseDTOData = ko.observableArray();
    self.customEndDate = ko.observable();
    self.investmentAccountData = ko.observableArray();
    self.allSchemesLoaded = ko.observable(false);
    self.schemeData = ko.observableArray();
    self.allSchemesData = ko.observableArray();
    self.folioLoaded = ko.observable(false);
    self.switchInFolioLoaded = ko.observable(false);
    self.folioData = ko.observableArray();
    self.accountHoldingId = ko.observable();
    self.schemeCode = ko.observable();
    self.isSuitableSwitchIn = ko.observable(false);
    self.isSuitableSwitchOut = ko.observable(false);
    self.suitabilityLoaded = ko.observable(false);
    self.switchInLoaded = ko.observable(false);
    self.redeemTypeLoaded = ko.observable(false);
    self.submitDisabled = ko.observable(true);
    self.frequencyList = ko.observableArray();
    self.installmentList = ko.observableArray();
    self.startDate = ko.observable();
    self.amount = ko.observable();
    self.purchaseAmount = ko.observable();
    self.totalAmount = ko.observable(0);
    self.accountId = ko.observable();
    self.holdingData = ko.observableArray();
    self.riskProfile = ko.observable("");
    self.riskProfileLoaded = ko.observable(false);
    self.fundHouseDisabled = ko.observable(true);
    self.estimatedDate = ko.observable();
    self.viewEstimatedDate = ko.observable(false);
    self.switchInSchemes = ko.observableArray();
    self.switchInFolios = ko.observableArray();

    let i, j;

    if (params.rootModel.action) {
      self.orderStatusFlag(true);
      self.orderStatusData(params.rootModel.editOrderArray());
    }

    SwitchFundsGlobal.fetchInvestmentAccounts().done(function (data) {
      if (data.investmentAccounts.length) {
        self.investmentAccountYes(true);

        self.getNewKoModel = function () {
          const SwitchFundsModel = SwitchFundsGlobal.getData();

          return SwitchFundsModel;
        };

        self.modelData = self.getNewKoModel();
        self.modelData.reviewScreen.when = self.resource.orderDetails.now;

        if(params.rootModel.params.payLoadArray) {
          self.payLoadArray(params.rootModel.params.payLoadArray);
        }

        if(params.rootModel.params.totalAmount) {
          self.totalAmount(params.rootModel.params.totalAmount);
        }

        if (params.rootModel.params.newFund) {
          self.newFund(params.rootModel.params.newFund);
          self.id(params.rootModel.params.id);

          if (self.payLoadArray().length > 0) {
            self.showFloatingButton(true);
          }
        }

        self.stepArray =
          ko.observableArray(
            [{
                label: self.resource.fundDetailsStep,
                id: "switch-fund-details",
                visited: true,
                disabled: false
              },
              {
                label: self.resource.orderDetailsStep,
                id: "switch-order-details",
                visited: true,
                disabled: true
              }
            ]);

        self.nextStep = function () {
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

        if (!self.orderStatusFlag()) {
          SwitchFundsGlobal.fetchMaintenanceValues().done(function (data) {
            for (let i = 0; i < data.configurationDetails.length; i++) {
              if (data.configurationDetails[i].propertyId === "WM_MF_NUMBER_OF_ORDER_IN_MULTIPLEORDER") {
                self.fundCount(parseInt(data.configurationDetails[i].propertyValue));
              }

              if (data.configurationDetails[i].propertyId === "WM_MF_DAYS_FORWARD_FOR_ORDER_LATER") {
                self.customEndDate(parseInt(data.configurationDetails[i].propertyValue));
              }

              if (data.configurationDetails[i].propertyId === "WM_MF_SWITCH_FUND_SAME_FUND_HOUSE_ALLOWED") {
                self.fundHouseDisabled(JSON.parse(data.configurationDetails[i].propertyValue.toLowerCase()));
              }
            }

          });
        }

        for (i = 0; i < data.investmentAccounts.length; i++) {
          self.investmentAccountData().push({
            code: data.investmentAccounts[i].accountId,
            label: data.investmentAccounts[i].accountId.displayValue,
            primaryHolderName: data.investmentAccounts[i].primaryHolderName,
            holdingPattern: data.investmentAccounts[i].holdingPattern
          });
        }

        self.investmentAccountLoaded(true);

        SwitchFundsGlobal.fetchFundHouse().done(function (data) {
          self.fundHouseDTOData().splice(0, self.fundHouseDTOData().length);

          for (i = 0; i < data.fundhousedtos.length; i++) {
            self.fundHouseDTOData().push({
              label: data.fundhousedtos[i].fundHouseName,
              code: data.fundhousedtos[i].fundHouseCode
            });
          }
        });

        SwitchFundsGlobal.fetchSchemes().done(function (data) {
          self.allSchemesData().splice(0, self.allSchemesData().length);

          for (i = 0; i < data.schemedtos.length; i++) {
            self.allSchemesData().push({
              label: data.schemedtos[i].schemeName,
              code: data.schemedtos[i].schemeCode
            });
          }
        });

        self.switchTypeListener = function () {
          self.fundHousesLoaded(false);
          self.schemesLoaded(false);
          self.folioLoaded(false);
          self.suitabilityLoaded(false);
          self.switchOutSchemeShow(false);
          self.isSuitableSwitchOut(false);
          self.modelData.switchFund.switchOutDetails.scheme.schemeCode = null;
          self.modelData.switchFund.switchOutDetails.scheme.schemeName = null;
          self.modelData.switchFund.switchOutDetails.folioNumber = null;
          self.modelData.switchFund.switchOutDetails.fundHouseCode = null;
          self.modelData.switchFund.switchOutDetails.scheme.fundCategory.fundCategoryCode = null;
          self.modelData.switchFund.switchOutDetails.scheme.fundCategory.fundCategoryDesc = null;
          self.purchaseAmount("");
          ko.tasks.runEarly();
          self.fundHousesLoaded(true);
          self.schemesLoaded(true);
        };

        self.schemeOutListener = function (event) {
          let newSchemeCode;

          if (event.detail) {
            newSchemeCode = event.detail.value;
          } else {
            newSchemeCode = event;
          }

          SwitchFundsGlobal.fetchSchemeDetails(newSchemeCode).done(function (data) {
            self.suitabilityLoaded(false);
            self.switchOutInfoScheme(data.schemeDTO.schemeName);
            self.isSuitableSwitchOut(data.schemeDTO.suitable);
            self.modelData.navigationData.switchOut.cutOffDate = data.schemeDTO.cutOff;

            if (self.switchType() === "PSTP") {
              self.modelData.navigationData.switchOut.minimumAmount.currency = self.additionalDetails().account.currencyCode;
              self.modelData.navigationData.switchOut.minimumAmount.amount = data.schemeDTO.minimumAmount.amount;
              self.modelData.navigationData.switchOut.currency = self.additionalDetails().account.currencyCode;
            }

            self.modelData.navigationData.switchOut.nav.currency = data.schemeDTO.nav.currency;
            self.modelData.navigationData.switchOut.nav.amount = data.schemeDTO.nav.amount;
            self.suitabilityLoaded(true);

            if (self.switchType() === "PSTP" && self.modelData.navigationData.newExisting === "existing") {
              self.modelData.switchFund.switchOutDetails.scheme.fundCategory.fundCategoryCode = data.schemeDTO.fundCategory.fundCategoryCode;
              self.modelData.switchFund.switchOutDetails.scheme.fundCategory.fundCategoryDesc = data.schemeDTO.fundCategory.fundCategoryDesc;
            } else if (self.switchType() !== "PSTP") {
              self.modelData.switchFund.switchOutDetails.scheme.fundCategory.fundCategoryCode = data.schemeDTO.fundCategory.fundCategoryCode;
              self.modelData.switchFund.switchOutDetails.scheme.fundCategory.fundCategoryDesc = data.schemeDTO.fundCategory.fundCategoryDesc;
            }

            ko.tasks.runEarly();
            self.switchOutSchemeShow(true);
          });

          for (i = 0; i < self.schemeData().length; i++) {
            if (self.schemeData()[i].code === newSchemeCode) {
              self.modelData.reviewScreen.switchOutScheme = self.schemeData()[i].label;
              self.modelData.switchFund.switchOutDetails.scheme.schemeName = self.schemeData()[i].label;
            }
          }
        };

        self.schemeInListener = function (event) {
          SwitchFundsGlobal.fetchSchemeDetails(event.detail.value).done(function (data) {
            self.switchInLoaded(false);
            self.frequencyList().splice(0, self.frequencyList().length);
            self.installmentList().splice(0, self.installmentList().length);
            self.isSuitableSwitchIn(data.schemeDTO.suitable);
            self.modelData.navigationData.cutOffDate = data.schemeDTO.cutOff;
            self.switchInInfoScheme(data.schemeDTO.schemeName);
            self.switchInSchemeShow(true);
            self.modelData.navigationData.schemeName = data.schemeDTO.schemeName;

            if (self.switchType() === "PSTP") {
              self.modelData.navigationData.minimumAmount.currency = self.modelData.navigationData.switchOut.currency;
            } else {
              self.modelData.navigationData.minimumAmount.currency = data.schemeDTO.minimumAmount.currency;
            }

            self.modelData.navigationData.minimumAmount.amount = data.schemeDTO.minimumAmount.amount;
            self.modelData.navigationData.minimumUnits = data.schemeDTO.minimumUnits;
            self.modelData.navigationData.nav.currency = data.schemeDTO.nav.currency;
            self.modelData.navigationData.nav.amount = data.schemeDTO.nav.amount;

            if (self.switchType() !== "ONE_TIME") {
              self.modelData.switchFund.switchInDetails.scheme.fundCategory.fundCategoryCode = data.schemeDTO.fundCategory.fundCategoryCode;
              self.modelData.switchFund.switchInDetails.scheme.fundCategory.fundCategoryDesc = data.schemeDTO.fundCategory.fundCategoryDesc;
            }

            for (i = 0; i < data.schemeDTO.frequencyList.length; i++) {
              self.frequencyList().push({
                code: data.schemeDTO.frequencyList[i].code,
                label: data.schemeDTO.frequencyList[i].description
              });
            }

            for (i = 0; i < data.schemeDTO.installmentList.length; i++) {
              self.installmentList().push({
                code: data.schemeDTO.installmentList[i],
                label: data.schemeDTO.installmentList[i]
              });
            }

            self.switchInLoaded(true);
          });

          for (i = 0; i < self.switchInSchemes().length; i++) {
            if (self.switchInSchemes()[i].code === event.detail.value) {
              self.modelData.reviewScreen.switchInScheme = self.switchInSchemes()[i].label;
              self.modelData.switchFund.switchInDetails.scheme.schemeName = self.switchInSchemes()[i].label;
            }
          }
        };

        SwitchFundsGlobal.fetchFundCategory().done(function (data) {
          for (i = 0; i < data.schemecategorydtos.length; i++) {
            self.fundCategoryData.push({
              label: data.schemecategorydtos[i].fundCategoryDesc,
              code: data.schemecategorydtos[i].fundCategoryCode
            });
          }

          self.fundCategoryLoaded(true);
        });

        self.investmentAccountChange = function (event) {
          let accountNumber;

          if (event.detail) {
            self.modelData.switchFund.switchInDetails.investmentAccountNumber = event.detail.value;
            accountNumber = event.detail.value;
          } else {
            accountNumber = event;
          }

          const promises = [];

          promises.push(SwitchFundsGlobal.fetchData(accountNumber.value));
          promises.push(SwitchFundsGlobal.fetchAccountDetails(accountNumber.value));

          Promise.all(promises).then(function (array) {
            self.fundHousesLoaded(false);
            self.schemesLoaded(false);
            self.riskProfileLoaded(false);
            self.fundHouseData().splice(0, self.fundHouseData().length);
            self.schemeData().splice(0, self.schemeData().length);
            self.holdingData().splice(0, self.holdingData().length);

            for (i = 0; i < array[0].accountHoldings.length; i++) {
              self.fundHouseData().push({
                label: null,
                code: array[0].accountHoldings[i].fundHouseCode
              });

              self.holdingData().push({
                holdingId: array[0].accountHoldings[i].accountHoldingId,
                fundHouseCode: array[0].accountHoldings[i].fundHouseCode,
                schemeCode: array[0].accountHoldings[i].scheme.schemeCode,
                folio: array[0].accountHoldings[i].folioNumber
              });
            }

            for (i = 0; i < array[0].accountHoldings.length; i++) {
              self.schemeData().push({
                label: array[0].accountHoldings[i].scheme.schemeName,
                code: array[0].accountHoldings[i].scheme.schemeCode
              });
            }

            for (i = 0; i < self.fundHouseDTOData().length; i++) {
              for (j = 0; j < self.fundHouseData().length; j++) {
                if (self.fundHouseDTOData()[i].code === self.fundHouseData()[j].code) {
                  self.fundHouseData()[j].label = self.fundHouseDTOData()[i].label;
                }
              }
            }

            self.riskProfile(array[1].investmentAccountDTO.riskProfile.riskProfileCode);

            ko.tasks.runEarly();
            self.riskProfileLoaded(true);
            self.fundHousesLoaded(true);
            self.schemesLoaded(true);

            if (self.orderStatusFlag() && self.orderStatusLoaded()) {
              if (self.switchType() === "PSTP") {
                self.fundHouseListener(self.modelData.switchFund.switchOutDetails.fundHouseCode);
              } else {
                self.fundHouseChange(self.modelData.switchFund.switchOutDetails.fundHouseCode);
              }

              self.schemeOutListener(self.modelData.switchFund.switchOutDetails.scheme.schemeCode);
              self.orderStatusLoaded(false);
            }
          });

          for (i = 0; i < self.investmentAccountData().length; i++) {
            if (accountNumber.displayValue === self.investmentAccountData()[i].label) {
              self.modelData.navigationData.investmentAccountInfo = self.investmentAccountData()[i].primaryHolderName + "-" + accountNumber.displayValue + "-" + self.investmentAccountData()[i].holdingPattern;
            }
          }
        };

        self.fundHouseChange = function (event) {
          let fundCode;

          if (event.detail) {
            fundCode = event.detail.value;
          } else {
            fundCode = event;
          }

          if (self.fundHouseDisabled()) {
            self.modelData.switchFund.switchInDetails.fundHouseCode = fundCode;
          }

          SwitchFundsGlobal.fetchSchemeName(self.modelData.switchFund.switchOutDetails.investmentAccountNumber.value, fundCode).done(function (data) {
            self.schemesLoaded(false);
            self.schemeData().splice(0, self.schemeData().length);

            for (i = 0; i < data.accountHoldings.length; i++) {
              self.schemeData().push({
                label: data.accountHoldings[i].scheme.schemeName,
                code: data.accountHoldings[i].scheme.schemeCode
              });
            }

            if (event.detail) {
              self.suitabilityLoaded(false);
              self.switchOutSchemeShow(false);
              self.isSuitableSwitchOut(false);
              self.modelData.switchFund.switchOutDetails.scheme.schemeCode = null;
              self.modelData.switchFund.switchOutDetails.scheme.schemeName = null;

              if (self.switchType() === "PSTP") {
                self.purchaseAmount("");
              }
            }

            ko.tasks.runEarly();
            self.schemesLoaded(true);
          });

          for (i = 0; i < self.fundHouseDTOData().length; i++) {
            if (self.fundHouseDTOData()[i].code === fundCode) {
              self.modelData.reviewScreen.switchOutFundHouse = self.fundHouseDTOData()[i].label;
            }
          }

          SwitchFundsGlobal.fetchFolio(self.modelData.switchFund.switchInDetails.investmentAccountNumber.value, fundCode).done(function (data) {
            self.folioLoaded(false);
            self.folioData().splice(0, self.folioData().length);

            for (i = 0; i < data.foliodtos.length; i++) {
              self.folioData.push({
                label: data.foliodtos[i].folioNumber,
                code: data.foliodtos[i].folioNumber
              });
            }

            self.folioLoaded(true);
          });
        };

        self.fundHouseListener = function (event) {
          let newFundHouseCode;

          if (event.detail) {
            self.modelData.switchFund.switchInDetails.fundHouseCode = event.detail.value;
            newFundHouseCode = event.detail.value;
          } else {
            newFundHouseCode = event;
          }

          SwitchFundsGlobal.fetchSchemesFiltered(newFundHouseCode, self.modelData.switchFund.switchOutDetails.scheme.fundCategory.fundCategoryCode).done(function (data) {
            self.schemesLoaded(false);
            self.allSchemesData().splice(0, self.allSchemesData().length);

            for (i = 0; i < data.schemedtos.length; i++) {
              self.allSchemesData().push({
                label: data.schemedtos[i].schemeName,
                code: data.schemedtos[i].schemeCode
              });
            }

            if (event.detail) {
              self.suitabilityLoaded(false);
              self.switchOutSchemeShow(false);
              self.isSuitableSwitchOut(false);
              self.modelData.switchFund.switchOutDetails.scheme.schemeCode = null;
              self.modelData.switchFund.switchOutDetails.scheme.schemeName = null;

              if (self.switchType() === "PSTP") {
                self.purchaseAmount("");
              }
            }

            ko.tasks.runEarly();
            self.schemesLoaded(true);
          });

          for (i = 0; i < self.fundHouseDTOData().length; i++) {
            if (self.fundHouseDTOData()[i].code === newFundHouseCode) {
              self.modelData.reviewScreen.switchOutFundHouse = self.fundHouseDTOData()[i].label;
            }
          }

          SwitchFundsGlobal.fetchFolio(self.modelData.switchFund.switchInDetails.investmentAccountNumber.value, self.modelData.switchFund.switchInDetails.fundHouseCode).done(function (data) {
            self.folioLoaded(false);
            self.folioData().splice(0, self.folioData().length);

            for (i = 0; i < data.foliodtos.length; i++) {
              self.folioData.push({
                label: data.foliodtos[i].folioNumber,
                code: data.foliodtos[i].folioNumber
              });
            }

            self.folioLoaded(true);
          });
        };

        if (params.rootModel.params.schemeCode) {
          self.modelData.switchFund.switchOutDetails.scheme.schemeCode = params.rootModel.params.schemeCode;
          self.modelData.switchFund.switchOutDetails.scheme.schemeName = params.rootModel.params.schemeName;
          self.modelData.switchFund.switchOutDetails.folioNumber = parseInt(params.rootModel.params.folioNumber);
          self.modelData.switchFund.switchOutDetails.fundHouseCode = params.rootModel.params.fundHouseCode;

          self.modelData.switchFund.switchOutDetails.investmentAccountNumber = {
            value: params.rootModel.params.investmentAccount.value(),
            displayValue: params.rootModel.params.investmentAccount.displayValue()
          };

          self.modelData.switchFund.switchInDetails.investmentAccountNumber = {
            value: params.rootModel.params.investmentAccount.value(),
            displayValue: params.rootModel.params.investmentAccount.displayValue()
          };

          SwitchFundsGlobal.fetchFundHouse().done(function (data) {
            self.fundHouseDTOData().splice(0, self.fundHouseDTOData().length);

            for (i = 0; i < data.fundhousedtos.length; i++) {
              self.fundHouseDTOData().push({
                label: data.fundhousedtos[i].fundHouseName,
                code: data.fundhousedtos[i].fundHouseCode
              });
            }

            self.investmentAccountChange(self.modelData.switchFund.switchOutDetails.investmentAccountNumber);
            self.fundHouseChange(self.modelData.switchFund.switchOutDetails.fundHouseCode);
            self.schemeOutListener(self.modelData.switchFund.switchOutDetails.scheme.schemeCode);
          });
        }

        self.switchInFundCategoryChange = function (event) {
          for (i = 0; i < self.fundCategoryData().length; i++) {
            if (event.detail.value === self.fundCategoryData()[i].code) {
              self.modelData.switchFund.switchInDetails.scheme.fundCategory.fundCategoryDesc = self.fundCategoryData()[i].label;
              break;
            }
          }

          SwitchFundsGlobal.fetchSchemesFiltered(self.modelData.switchFund.switchInDetails.fundHouseCode, event.detail.value).done(function (data) {
            self.switchInSchemesLoaded(false);
            self.switchInSchemes().splice(0, self.switchInSchemes().length);

            for (i = 0; i < data.schemedtos.length; i++) {
              self.switchInSchemes().push({
                label: data.schemedtos[i].schemeName,
                code: data.schemedtos[i].schemeCode
              });
            }

            for (i = 0; i < self.switchInSchemes().length; i++) {
              if (self.modelData.switchFund.switchOutDetails.scheme.schemeCode === self.switchInSchemes()[i].code) {
                self.switchInSchemes().splice(i, 1);
              }
            }

            self.suitabilityLoaded(false);
            self.switchInSchemeShow(false);
            self.isSuitableSwitchIn(false);
            self.switchInLoaded(false);
            self.modelData.switchFund.switchInDetails.scheme.schemeCode = null;
            self.modelData.switchFund.switchInDetails.scheme.schemeName = null;
            self.modelData.switchFund.switchInDetails.txnUnits = null;
            self.modelData.switchFund.switchInDetails.scheduledDate = null;
            self.amount("");

            if (self.switchType() !== "ONE_TIME") {
              self.modelData.switchFund.switchInDetails.frequency = null;
              self.modelData.switchFund.switchInDetails.installments = null;
              self.modelData.switchFund.switchInDetails.startDate = null;
              self.viewEstimatedDate(false);
              self.estimatedDate("");
            }

            ko.tasks.runEarly();
            self.switchInSchemesLoaded(true);
          });
        };

        self.switchOutFundCategoryChange = function (event) {
          for (i = 0; i < self.fundCategoryData().length; i++) {
            if (event.detail.value === self.fundCategoryData()[i].code) {
              self.modelData.switchFund.switchOutDetails.scheme.fundCategory.fundCategoryDesc = self.fundCategoryData()[i].label;
              break;
            }
          }

          SwitchFundsGlobal.fetchSchemesFiltered(self.modelData.switchFund.switchOutDetails.fundHouseCode, event.detail.value).done(function (data) {
            self.schemesLoaded(false);
            self.allSchemesData().splice(0, self.allSchemesData().length);

            for (i = 0; i < data.schemedtos.length; i++) {
              self.allSchemesData().push({
                label: data.schemedtos[i].schemeName,
                code: data.schemedtos[i].schemeCode
              });
            }

            self.suitabilityLoaded(false);
            self.switchOutSchemeShow(false);
            self.isSuitableSwitchOut(false);
            self.modelData.switchFund.switchOutDetails.scheme.schemeCode = null;
            self.modelData.switchFund.switchOutDetails.scheme.schemeName = null;

            if (self.switchType() === "PSTP") {
              self.purchaseAmount("");
            }

            ko.tasks.runEarly();
            self.schemesLoaded(true);
          });
        };

        self.validateUnits = {
          validate: function (value) {
            if ((self.switchType() !== "PSTP") && (value < self.modelData.navigationData.minimumUnits)) {
              throw new oj.ValidatorError("", self.resource.orderDetails.minimumValidation);
            }

            if ((self.switchType() !== "PSTP") && (value > self.modelData.navigationData.availableUnits)) {
              throw new oj.ValidatorError("", params.baseModel.format(self.resource.orderDetails.maximumValidation, {
                availableUnits: self.modelData.navigationData.availableUnits
              }));
            }

            if (parseInt(value) === 0) {
              throw new oj.ValidatorError("", self.resource.orderDetails.requiredUnits);
            }

            return true;
          }
        };

        self.switchInFundHouseListener = function (event) {
          let newFundHouseCode;

          if (event.detail) {
            newFundHouseCode = event.detail.value;
          } else {
            newFundHouseCode = event;
          }

          SwitchFundsGlobal.fetchSchemesFiltered(newFundHouseCode, self.modelData.switchFund.switchInDetails.scheme.fundCategory.fundCategoryCode).done(function (data) {
            self.switchInSchemesLoaded(false);
            self.switchInSchemes().splice(0, self.switchInSchemes().length);

            for (i = 0; i < data.schemedtos.length; i++) {
              self.switchInSchemes().push({
                label: data.schemedtos[i].schemeName,
                code: data.schemedtos[i].schemeCode
              });
            }

            for (i = 0; i < self.switchInSchemes().length; i++) {
              if (self.modelData.switchFund.switchOutDetails.scheme.schemeCode === self.switchInSchemes()[i].code) {
                self.switchInSchemes().splice(i, 1);
              }
            }

            if (event.detail) {
              self.suitabilityLoaded(false);
              self.switchInSchemeShow(false);
              self.isSuitableSwitchIn(false);
              self.switchInLoaded(false);
              self.modelData.switchFund.switchInDetails.scheme.schemeCode = null;
              self.modelData.switchFund.switchInDetails.scheme.schemeName = null;
              self.modelData.switchFund.switchInDetails.txnUnits = null;
              self.modelData.switchFund.switchInDetails.scheduledDate = null;
              self.amount("");

              if (self.switchType() !== "ONE_TIME") {
                self.modelData.switchFund.switchInDetails.frequency = null;
                self.modelData.switchFund.switchInDetails.installments = null;
                self.modelData.switchFund.switchInDetails.startDate = null;
                self.viewEstimatedDate(false);
                self.estimatedDate("");
              }
            }

            ko.tasks.runEarly();
            self.switchInSchemesLoaded(true);
          });

          for (i = 0; i < self.fundHouseDTOData().length; i++) {
            if (self.fundHouseDTOData()[i].code === newFundHouseCode) {
              self.modelData.reviewScreen.fundHouse = self.fundHouseDTOData()[i].label;
            }
          }

          SwitchFundsGlobal.fetchFolio(self.modelData.switchFund.switchInDetails.investmentAccountNumber.value, newFundHouseCode).done(function (data) {
            self.switchInFolioLoaded(false);
            self.switchInFolios().splice(0, self.switchInFolios().length);

            for (i = 0; i < data.foliodtos.length; i++) {
              self.switchInFolios.push({
                label: data.foliodtos[i].folioNumber,
                code: data.foliodtos[i].folioNumber
              });
            }

            self.switchInFolioLoaded(true);
          });
        };

        let deleteIndex,
          deleteData = {};

        self.deleteOrderConfirmModal = function (index, data) {
          deleteIndex = index;
          deleteData = data;

          if (!params.baseModel.small()) {
            $("#delete-order-confirm").trigger("openModal");
          } else if (params.baseModel.small()) {
            $("#switch-fund-cart").trigger("closeModal");
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
            $("#switch-fund-cart").trigger("openModal");
          }
        };

        self.deleteOrder = function (index, data) {
          self.payLoadArray.splice(index, 1);
          self.totalAmount(self.totalAmount() - data.switchFund.switchInDetails.txnAmount.amount);

          if (self.payLoadArray().length === 0) {
            self.submitDisabled(true);
            self.showFloatingButton(false);
          }

          if (self.payLoadArray().length >= self.fundCount()) {
            self.buttonDisabled(true);
          } else {
            self.buttonDisabled(false);
          }

          self.actionUpdate(false);
          ko.tasks.runEarly();
          self.newFund(true);
          self.id(self.payLoadArray()[self.payLoadArray().length - 1].id + 1);

          params.dashboard.loadComponent("switch-funds-global", {
            newFund: self.newFund(),
            payLoadArray: self.payLoadArray(),
            totalAmount: self.totalAmount(),
            id: self.id()
          });
        };

        self.openpartials = function () {
          $("#switch-fund-cart").trigger("openModal");
        };

        if (self.orderStatusFlag() && self.payLoadArray().length === 0) {
          self.modelData.switchFund = self.orderStatusData();
          self.orderStatusLoaded(true);

          if (self.modelData.switchFund.switchOutDetails.transactionTypeCode === "PURCHASE") {
            self.switchType("PSTP");
            self.purchaseAmount(self.modelData.switchFund.switchOutDetails.txnAmount.amount);
            self.modelData.navigationData.whenChanged = false;
          } else if (self.modelData.switchFund.switchOutDetails.transactionTypeCode === "SWITCH" && self.modelData.switchFund.switchOutDetails.instructionTypeCode === "STP") {
            self.modelData.navigationData.whenChanged = false;
            self.switchType("STP");
          } else if (self.modelData.switchFund.switchOutDetails.transactionTypeCode === "SWITCH" && self.modelData.switchFund.switchOutDetails.instructionTypeCode === "ONE_TIME") {
            self.modelData.navigationData.when = "NOW";
            self.modelData.navigationData.whenChanged = true;
            self.switchType("ONE_TIME");
          } else if (self.modelData.switchFund.switchOutDetails.transactionTypeCode === "SWITCH" && self.modelData.switchFund.switchOutDetails.instructionTypeCode === "LATER") {
            self.modelData.navigationData.when = "LATER";
            self.modelData.navigationData.whenChanged = true;
            self.switchType("ONE_TIME");
          }

          if (self.modelData.switchFund.switchInDetails.txnUnits) {
            self.onetimeSwitchType("UN");
          } else {
            self.amount(self.modelData.switchFund.switchInDetails.txnAmount.amount);
            self.onetimeSwitchType("AMT");
          }

          SwitchFundsGlobal.fetchMaintenanceValues().done(function (data) {
            for (let i = 0; i < data.configurationDetails.length; i++) {
              if (data.configurationDetails[i].propertyId === "WM_MF_NUMBER_OF_ORDER_IN_MULTIPLEORDER") {
                self.fundCount(parseInt(data.configurationDetails[i].propertyValue));
              }

              if (data.configurationDetails[i].propertyId === "WM_MF_DAYS_FORWARD_FOR_ORDER_LATER") {
                self.customEndDate(parseInt(data.configurationDetails[i].propertyValue));
              }

              if (data.configurationDetails[i].propertyId === "WM_MF_SWITCH_FUND_SAME_FUND_HOUSE_ALLOWED") {
                self.fundHouseDisabled(JSON.parse(data.configurationDetails[i].propertyValue.toLowerCase()));
              }
            }

            self.investmentAccountChange(self.modelData.switchFund.switchInDetails.investmentAccountNumber);

            self.stepArray(
              [{
                  label: self.resource.fundDetailsStep,
                  id: "switch-fund-details",
                  visited: true,
                  disabled: false
                },
                {
                  label: self.resource.orderDetailsStep,
                  id: "switch-order-details",
                  visited: true,
                  disabled: false
                }
              ]);

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
