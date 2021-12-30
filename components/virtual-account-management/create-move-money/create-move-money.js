define([
  "jquery",
  "knockout",
  "./model",
  "ojL10n!resources/nls/create-move-money",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup"
], function ($, ko, MoveMoneyModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("account-input");
    params.baseModel.registerElement("amount-input");
    params.baseModel.registerComponent("review-move-money", "virtual-account-management");
    self.selectedAccount = ko.observable();
    self.selectedVirtualAccountFrom = ko.observable();
    self.selectedVirtualAccountTo = ko.observable();
    self.selectedVirtualAccountBalanceFrom = ko.observable();
    self.selectedVirtualAccountBalanceTo = ko.observable();
    self.selectedVirtualAccountCurrencyFrom = ko.observable();
    self.selectedVirtualAccountCurrencyTo = ko.observable();
    self.virtualAccountData = ko.observableArray();
    self.virtualAccountDataTo = ko.observableArray();
    self.virtualAccountLoaded = ko.observable(false);
    self.transferFromSelected = ko.observable(false);
    self.currencyListData = ko.observableArray([]);
    self.currencyLoaded = ko.observable(false);
    self.showVirtualAccountFromInfo = ko.observable();
    self.showVirtualAccountToInfo = ko.observable();
    self.parentTaskCode = ko.observable();
    self.defaultAccCcy = ko.observable();
    self.offsetVirtualAccountCcy = ko.observable();
    self.amount = ko.observable();
    self.groupValid = ko.observable();
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.accountPassed = !!(self.params && self.params.id);
    self.valueDate = params.baseModel.getDate("ISO_DATE");
    self.realAccountLinkage = ko.observable("A");
    self.currencyCode = ko.observable();
    self.limit = "0";
    self.offset = "0";
    self.currencyParser = ko.observableArray();
    self.recordStatus = ko.observable("O");
    self.backFromReview = !!(params.rootModel.previousState || params.rootModel.params.moveMoneyPayload);
    self.realAcountDetailsLoaded = ko.observable(false);
    self.VAEnabledRealAccounts = ko.observable();
    self.selectedRealAccountBalance = ko.observable();
    self.selectedRealAccountCurrency = ko.observable();
    self.showRealAccountBalanceInfo = ko.observable(false);
    self.taskCode = "VAMIT_F_CITF";
    self.isViewlimits = ko.observable(false);
    self.selectedChannel = ko.observable(false);
    self.selectedChannelType = ko.observable();
    self.selectedChannelTypeName = ko.observable();
    self.loadAccessPointList = ko.observable(false);
    self.channelList = ko.observableArray();
    self.selectedChannelIndex = ko.observable();
    self.network = ko.observable();
    self.paymentType = ko.observable();
    self.accessPointValue = ko.observable();

    const getNewModel = function () {
      const KoModel = MoveMoneyModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.modelInstance = getNewModel();

    MoveMoneyModel.fetchAccessPoints().then(function (response) {
      if (response && response.accessPointListDTO) {
        self.channelList(response.accessPointListDTO);

        for (let i = 0; i < response.accessPointListDTO.length; i++) {
          if (response.accessPointListDTO[i].currentLoggedIn === true) {
            self.selectedChannelIndex(i);
          }
        }

        self.selectedChannel(true);
        self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
        self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
        self.loadAccessPointList(true);
      }
    });

    MoveMoneyModel.maintenance().then(function (data) {
      if (data && data.configurationDetails) {
        for (let i = 0; i < data.configurationDetails.length; i++) {
          if (data.configurationDetails[i].propertyId === "OBVAM_BRANCH_CODE") {
            self.branchCode = data.configurationDetails[i].propertyValue;
          }

          if (data.configurationDetails[i].propertyId === "OBVAM_TXN_CODE") {
            self.transactionCode = data.configurationDetails[i].propertyValue;
          }

          if (data.configurationDetails[i].propertyId === "OBVAM_OFFSET_TXN_CODE") {
            self.offsetTransactionCode = data.configurationDetails[i].propertyValue;
          }
        }
      }
    });

    self.virtualAccountCall = function (realAccount) {
      self.VAEnabledRealAccounts().forEach(function (item) {
        if (item.realAccountNo.value === realAccount) {
          self.selectedAccount(realAccount);
          self.selectedRealAccountBalance(item.availableBalance.amount);
          self.selectedRealAccountCurrency(item.availableBalance.currency);
          self.showRealAccountBalanceInfo(true);
          self.virtualAccountData().length = 0;
          self.virtualAccountLoaded(true);
          self.transferFromSelected(true);

          if (!self.backFromReview) {
            self.selectedVirtualAccountFrom("");
            self.selectedVirtualAccountTo("");
            self.showVirtualAccountFromInfo(false);
            self.showVirtualAccountToInfo(false);
          }

          self.currencyCode("");

          self.currencyParser({
            currencies: []
          });

          self.currencyLoaded(true);

          const query = {
            criteria: [
              {
                operand: "realAccountNo.value",
                operator: "EQUALS",
                value: [self.selectedAccount()]
              },
              {
                operand: "realAccountBrn",
                operator: "CONTAINS",
                value: [item.branchCode]
              }
            ]
          },

            debitVirtualAccountList = MoveMoneyModel.fetchVirtualAccountList(JSON.stringify(query), self.taskCode),
            creditVirtualAccountList = MoveMoneyModel.fetchVirtualAccountList(JSON.stringify(query), "");

          Promise.all([debitVirtualAccountList, creditVirtualAccountList]).then(function result(data) {

            if (data && data.length === 2) {
              self.virtualAccountLoaded(false);
              self.currencyLoaded(false);
              self.transferFromSelected(false);
              ko.tasks.runEarly();

              for (let i = 0; i < data[0].accounts.length; i++) {
                self.virtualAccountData().push(data[0].accounts[i]);
              }

              self.virtualAccountDataTo(data[1].accounts);

              if (self.selectedVirtualAccountFrom() !== null) {
                self.virtualAccountDataTo().forEach(function (virtualAccount) {
                  if (self.selectedVirtualAccountFrom().value === virtualAccount.id.value) {
                    const tempArray = self.virtualAccountDataTo().filter(function (item) {
                      return item.id.value !== self.selectedVirtualAccountFrom().value && item.currencyCode === virtualAccount.currencyCode;
                    });

                    self.virtualAccountDataTo(tempArray);
                  }
                });
              }

              self.virtualAccountLoaded(true);
              self.transferFromSelected(true);
              self.currencyCode(self.selectedRealAccountCurrency);

              self.currencyParser({
                currencies: [{
                  code: self.selectedRealAccountCurrency,
                  description: self.selectedRealAccountCurrency
                }]
              });

              self.currencyLoaded(true);
            } else {
              self.virtualAccountLoaded(false);
              self.transferFromSelected(false);
              self.currencyLoaded(false);
              ko.tasks.runEarly();
              self.virtualAccountLoaded(true);
              self.transferFromSelected(true);
              self.currencyCode("");

              self.currencyParser({
                currencies: []
              });

              self.currencyLoaded(true);
            }

          }, function (data) {
            self.virtualAccountLoaded(false);
            self.transferFromSelected(false);
            self.currencyLoaded(false);
            ko.tasks.runEarly();
            self.virtualAccountLoaded(true);
            self.transferFromSelected(true);
            self.currencyCode("");

            self.currencyParser({
              currencies: []
            });

            self.currencyLoaded(true);
          });
        }
      });
    };

    if (params.rootModel.previousState) {
      self.selectedAccount(params.rootModel.previousState.payload.intbks.realAccountNo.value());
      self.selectedVirtualAccountFrom(params.rootModel.previousState.payload.intbks.debitAccountId());
      self.selectedVirtualAccountCurrencyFrom(params.rootModel.previousState.payload.intbks.debitAmount.currency());
      self.selectedVirtualAccountBalanceFrom(params.rootModel.previousState.balanceFrom);
      self.selectedVirtualAccountTo(params.rootModel.previousState.payload.intbks.creditAccountId());
      self.selectedVirtualAccountCurrencyTo(params.rootModel.previousState.payload.intbks.creditAmount.currency());
      self.selectedVirtualAccountBalanceTo(params.rootModel.previousState.balanceTo);
      self.virtualAccountLoaded(true);
      self.showVirtualAccountFromInfo(true);
      self.showVirtualAccountToInfo(true);
      self.transferFromSelected(true);
      self.amount(params.rootModel.previousState.payload.intbks.debitAmount.amount());
      self.valueDate = params.rootModel.previousState.payload.intbks.valueDate();
      self.currencyParser(JSON.parse(params.rootModel.previousState.currencyParser));
      self.currencyLoaded(true);
    }

    if (params.rootModel.params.moveMoneyPayload) {
      self.selectedAccount(params.rootModel.params.moveMoneyPayload.realAccountNo.value);
      self.selectedVirtualAccountFrom(params.rootModel.params.moveMoneyPayload.debitAccountId);
      self.selectedVirtualAccountCurrencyFrom(params.rootModel.params.moveMoneyPayload.debitAmount.currency);
      self.selectedVirtualAccountBalanceFrom(params.rootModel.params.balanceFrom);
      self.virtualAccountLoaded(true);
      self.showVirtualAccountFromInfo(true);
      self.selectedVirtualAccountTo(params.rootModel.params.moveMoneyPayload.creditAccountId);
      self.selectedVirtualAccountCurrencyTo(params.rootModel.params.moveMoneyPayload.creditAmount.currency);
      self.selectedVirtualAccountBalanceTo(params.rootModel.params.balanceTo);
      self.showVirtualAccountToInfo(true);
      self.transferFromSelected(true);
      self.amount(params.rootModel.params.moveMoneyPayload.debitAmount.amount);
      self.valueDate = params.rootModel.params.moveMoneyPayload.valueDate;
      self.currencyParser(JSON.parse(params.rootModel.params.currencyParser));
      self.currencyLoaded(true);
    }

    MoveMoneyModel.fetchVAMEnabledAccounts(self.taskCode).then(function (response) {
      if (response && response.vamaccountdtos) {
        self.VAEnabledRealAccounts(response.vamaccountdtos);
        self.realAcountDetailsLoaded(true);

        if (params.rootModel.previousState || params.rootModel.params.moveMoneyPayload) {
          self.virtualAccountCall(self.selectedAccount());
        }
      }
    });

    self.setBalance = function (balance) {
      balance.forEach(function (item) {
        if (item.type === "availableBal") {
          return item;
        }
      });
    };

    self.fetchVirtualAccountBalance = function (virtualAccountId, currencyCode, targetId) {
      MoveMoneyModel.fetchVirtualAccountBalance(virtualAccountId.value, currencyCode).then(function (data) {
        if (data && data.virtualAccountDTO && data.virtualAccountDTO.balance && data.virtualAccountDTO.balance.length > 0) {
          const balance = data.virtualAccountDTO.balance.find(function (item) {
            return item.type === "availableBal";
          });

          if (targetId === "virtualAccountFrom") {
            self.selectedVirtualAccountFrom(data.virtualAccountDTO.id);
            self.selectedVirtualAccountBalanceFrom(balance.amount[0].amount);
            self.selectedVirtualAccountCurrencyFrom(balance.amount[0].currency);
            self.showVirtualAccountFromInfo(true);
          } else {
            self.selectedVirtualAccountTo(data.virtualAccountDTO.id);
            self.selectedVirtualAccountBalanceTo(balance.amount[0].amount);
            self.selectedVirtualAccountCurrencyTo(balance.amount[0].currency);
            self.showVirtualAccountToInfo(true);
          }
        }
      });
    };

    self.selectedAccountChangeHandler = function (event) {
      if (event.target.id === "virtualAccountFrom") {
        self.transferFromSelected(false);
        self.currencyLoaded(false);

        const tempArray = self.virtualAccountData().find(function (item) {
          return item.id.value === event.detail.value.value;
        });

        self.currencyParser({
          currencies: [{
            code: tempArray.currencyCode,
            description: tempArray.currencyCode
          }]
        });

        self.currencyLoaded(true);
        self.transferFromSelected(true);
        self.fetchVirtualAccountBalance(tempArray.id, tempArray.currencyCode, event.target.id);
      } else {
        self.currencyLoaded(false);

        const tempArray = self.virtualAccountDataTo().find(function (item) {
          return item.id.value === event.detail.value.value;
        });

        self.currencyParser({
          currencies: [{
            code: tempArray.currencyCode,
            description: tempArray.currencyCode
          }]
        });

        ko.tasks.runEarly();
        self.currencyLoaded(true);
        self.fetchVirtualAccountBalance(tempArray.id, tempArray.currencyCode, event.target.id);
      }
    };

    self.realAccountNumberSelection = function (event) {
      self.showRealAccountBalanceInfo(false);
      self.backFromReview = false;
      self.virtualAccountCall(event.detail.value);
    };

    self.channelTypeChangeHandler = function () {
      if (self.selectedChannelIndex() !== null && self.selectedChannelIndex() !== "") {
        self.selectedChannel(false);
        ko.tasks.runEarly();

        for (let i = 0; i < self.channelList().length; i++) {
          if (event.detail.value === self.channelList()[i].id) {
            self.selectedChannelType(self.channelList()[i].id);
            self.selectedChannelTypeName(self.channelList()[i].description);
            break;

          }
        }

        self.selectedChannel(true);
      }
    };

    self.viewLimitsModalId = Date.now().toString();
    params.baseModel.registerComponent("available-limits", "financial-limits");

    self.viewLimits = function () {
      self.isViewlimits(false);
      ko.tasks.runEarly();
      self.parentTaskCode("VAMIT_F_CITF");
      self.network("");
      self.paymentType("");
      self.accessPointValue(self.selectedChannelType());

      $("#" + self.viewLimitsModalId).trigger("openModal");
      self.isViewlimits(true);
    };

    self.done = function () {
      self.selectedChannelIndex("");
      self.selectedChannel(false);
      ko.tasks.runEarly();
      $("#" + self.viewLimitsModalId).hide();
    };

    self.channelPopup = function () {
      const popup1 = document.querySelector("#channel-popup");

      if (popup1.isOpen()) {
        popup1.close();
      } else {
        popup1.open("#channel-disclaimer");
      }
    };

    self.createPayload = function () {
      const tempArray = self.VAEnabledRealAccounts().find(function (item) {
        return item.realAccountNo.value === self.selectedAccount();
      });

      self.modelInstance.intbks.branchCode(tempArray.branchCode);
      self.modelInstance.intbks.realAccountNo.value(self.selectedAccount());
      self.modelInstance.intbks.realAccountNo.displayValue(tempArray.realAccountNo.displayValue);
      self.modelInstance.intbks.debitAccountId(self.selectedVirtualAccountFrom());
      self.modelInstance.intbks.creditAccountId(self.selectedVirtualAccountTo());
      self.modelInstance.intbks.debitAmount.currency(self.selectedVirtualAccountCurrencyFrom());
      self.modelInstance.intbks.creditAmount.currency(self.selectedVirtualAccountCurrencyTo());
      self.modelInstance.intbks.debitAmount.amount(self.amount());
      self.modelInstance.intbks.creditAmount.amount(self.amount());
      self.modelInstance.intbks.valueDate(self.valueDate);
    };

    self.goToReviewMoveMoney = function () {
      const tracker = document.getElementById("moveMoneyTracker");

      if (!params.baseModel.showComponentValidationErrors(tracker)) {
        event.preventDefault();
      }

      if (self.groupValid() !== "valid") {
        return;
      }

      if (tracker.valid === "valid") {
        if (self.selectedVirtualAccountFrom().value !== self.selectedVirtualAccountTo().value) {
          self.createPayload();

          params.dashboard.loadComponent("review-move-money", {
            payload: self.modelInstance,
            VAEnabledRealAccounts: JSON.stringify(ko.mapping.toJS(self.VAEnabledRealAccounts())),
            balanceFrom: ko.mapping.toJS(self.selectedVirtualAccountBalanceFrom()),
            balanceTo: ko.mapping.toJS(self.selectedVirtualAccountBalanceTo()),
            currencyParser: JSON.stringify(ko.mapping.toJS(self.currencyParser()))
          });
        } else {
          params.baseModel.showMessages(null, [self.resource.validityError], "error");
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

    };
  };
});
