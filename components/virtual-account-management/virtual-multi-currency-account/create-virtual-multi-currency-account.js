define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-multi-currency-account",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojarraydataprovider",
  "ojs/ojradioset",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource",
  "ojs/ojvalidationgroup"
], function (oj, ko, MultiCurrencyModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerTransaction("virtual-multi-currency-account", "virtual-account-management");
    self.mode = ko.observable(params.rootModel.params.mode !== undefined ? params.rootModel.params.mode : "create");
    self.taxonomyDefinition = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.vam.dto.multicurrencyaccount.MultiCurrencyAccountDTO");
    self.virtualMultiCurrencyAccountId = ko.observable(params.rootModel.previousState !== undefined ? params.rootModel.previousState.multiccyaccountgroups.accGroupId() : "");
    self.virtualMultiCurrencyAccountName = ko.observable(params.rootModel.previousState !== undefined ? params.rootModel.previousState.multiccyaccountgroups.accGroupDesc() : "");
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.selectedItem = ko.observable();
    self.currencyList = ko.observable([]);
    self.currencyData = ko.observable([]);
    self.selectedRealAccount = ko.observable();
    self.selectedListItems = ko.observable([]);
    self.realAccountsByCurrency = ko.observableArray([]);
    self.multiCurrencyList = ko.observableArray(params.rootModel.previousState !== undefined ? ko.mapping.toJS(params.rootModel.previousState.multiccyaccountgroups.VacTmCcyAccGroupDetailDTO()) : []);
    self.dataProvider = ko.observable();
    self.multiCurrencyAccountGroup = ko.observable(new oj.ArrayDataProvider([], {}));
    self.currencyDetailsLoaded = ko.observable(false);
    self.multiCurrencyAccountListLoaded = ko.observable(false);
    self.VAEnabledRealAccounts = ko.observable(params.rootModel.previousState !== undefined ? params.rootModel.previousState.multiccyaccountgroups.VAEnabledRealAccounts() : []);
    self.realAccountsListAvailable = ko.observable(true);
    self.taskCode = self.mode() === "edit" ? "VAMMC_M_UMCA" : "VAMMC_M_CMCA";

    const getNewModel = function () {
      const KoModel = MultiCurrencyModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    if (self.mode() === "edit" && params.rootModel.previousState) {
      self.virtualMultiCurrencyViewDTO = JSON.parse(params.rootModel.previousState.multiCurrencyViewDTO);
    } else if (self.mode() === "edit") {
      self.virtualMultiCurrencyViewDTO = JSON.parse(params.rootModel.params.virtualMultiCurrencyListDTO);
      self.virtualMultiCurrencyAccountId(self.virtualMultiCurrencyViewDTO.groupId);
      self.virtualMultiCurrencyAccountName(self.virtualMultiCurrencyViewDTO.name);

      for (let i = 0; i < self.virtualMultiCurrencyViewDTO.accounts.length; i++) {
        self.multiCurrencyList.push({
          realAccountNo: self.virtualMultiCurrencyViewDTO.accounts[i].id,
          realCustomerName: self.realCustomerName,
          realAccountCurrency: self.virtualMultiCurrencyViewDTO.accounts[i].currencyCode,
          realAccountBranch: self.virtualMultiCurrencyViewDTO.accounts[i].realAccountBrn,
          balance: self.virtualMultiCurrencyViewDTO.accounts[i].balance,
          defaultAccount: self.virtualMultiCurrencyViewDTO.accounts[i].defaultAccount
        });
      }

    }

    self.modelInstance = getNewModel();

    self.createRadioList = function () {
      const tempArray = self.VAEnabledRealAccounts().filter(function (currency) {
        return currency.availableBalance.currency === self.selectedItem();
      });

      self.realAccountsByCurrency().length = 0;
      self.dataProvider("");

      for (let i = 0; i < tempArray.length; i++) {
        self.realAccountsByCurrency.push({
          realAccountNo: tempArray[i].realAccountNo,
          realCustomerName: self.realCustomerName,
          realAccountBranch: tempArray[i].branchCode,
          realAccountCurrency: self.selectedItem(),
          balance: tempArray[i].availableBalance.amount
        });
      }

      self.realAccountsByCurrency(self.realAccountsByCurrency().sort(function (a, b) {
        return b.balance - a.balance;
      }));

      self.dataProvider(new oj.ArrayDataProvider(self.realAccountsByCurrency(), { idAttribute: "realAccountNo" }));

      if (self.mode() === "edit" || params.rootModel.previousState !== undefined) {

        if (self.multiCurrencyList() !== undefined) {
          const tempArray = self.multiCurrencyList().filter(function (currency) {
            return currency.realAccountCurrency === self.selectedItem();
          });

          if (tempArray.length !== 0) {
            self.selectedRealAccount(tempArray[0].realAccountNo.value);
            self.selectedListItems().length = 0;
            self.selectedListItems().push(tempArray[0].realAccountNo.value);
          }
        }

        self.multiCurrencyAccountGroup(new oj.ArrayDataProvider(self.multiCurrencyList(), { idAttribute: "realAccountNo" }));
        self.multiCurrencyAccountListLoaded(true);
      }
    };

    self.createCurrencyList = function () {
      const currency = self.VAEnabledRealAccounts().map(function (item) {
        return item.availableBalance.currency;
      }),
        demo = currency.filter(function (currentItem, currentIndex, array) {
          return array.indexOf(currentItem) === currentIndex;
        });

      for (let i = 0; i < demo.length; i++) {
        self.currencyData().push({
          currency: demo[i],
          count: self.VAEnabledRealAccounts().filter(function (item) {
            return item.availableBalance.currency === demo[i];
          }).length
        });
      }

      self.currencyData(self.currencyData().sort(function (a, b) {
        return b.count - a.count;
      }));

      for (let i = 0; i < self.currencyData().length; i++) {
        self.currencyList().push(
          {
            id: self.currencyData()[i].currency,
            label: self.currencyData()[i].currency,
            disabled: false
          });

        if (i === 0) {
          self.selectedItem(self.currencyList()[0].id);
          self.createRadioList();
        }
      }

      self.currencyDetailsLoaded(true);
      self.multiCurrencyAccountListLoaded(true);
    };

    if (params.rootModel.previousState === undefined) {

      MultiCurrencyModel.fetchVAEnabledRealAccount(self.taskCode).then(function result(VAEnabledData) {
        if (VAEnabledData && VAEnabledData.vamaccountdtos && VAEnabledData.vamaccountdtos.length > 0) {
          self.VAEnabledRealAccounts(VAEnabledData.vamaccountdtos);

          self.createCurrencyList();
        } else {
          self.realAccountsListAvailable(false);
        }
      });
    } else {
      self.createCurrencyList();
    }

    self.selectDifferentCurrency = function (event) {
      self.currencyDetailsLoaded(false);
      self.selectedItem(event.detail.value);
      self.createRadioList();

      if (self.multiCurrencyList() !== undefined) {
        const tempArray = self.multiCurrencyList().filter(function (currency) {
          return currency.realAccountCurrency === self.selectedItem();
        });

        if (tempArray.length !== 0) {
          self.selectedRealAccount(tempArray[0].realAccountNo.value);
        }
      }

      self.currencyDetailsLoaded(true);

    };

    self.createMultiCurrencyCardList = function (event) {
      if (event.detail.value) {
        self.multiCurrencyAccountListLoaded(false);
        self.selectedListItems().length = 0;
        self.selectedListItems().push(event.detail.value);
        self.selectedRealAccount(event.detail.value);
        self.multiCurrencyAccountGroup(new oj.ArrayDataProvider([], {}));

        if (self.multiCurrencyList() !== undefined) {
          for (let i = 0; i < self.multiCurrencyList().length; i++) {
            if (self.multiCurrencyList()[i].realAccountCurrency === self.selectedItem()) {
              self.multiCurrencyList().splice(i, 1);
            }
          }
        }

        const tempArray = self.realAccountsByCurrency().filter(function (temp) {
          return temp.realAccountNo.value === event.detail.value;
        });

        self.multiCurrencyList.push({
          realAccountNo: tempArray[0].realAccountNo,
          realCustomerName: self.realCustomerName,
          realAccountCurrency: self.selectedItem(),
          realAccountBranch: tempArray[0].realAccountBranch,
          balance: tempArray[0].balance,
          defaultAccount: false
        });

        self.multiCurrencyAccountGroup(new oj.ArrayDataProvider(self.multiCurrencyList(), { idAttribute: "realAccountNo" }));
        self.multiCurrencyAccountListLoaded(true);
      }

    };

    self.removeFromMultiCurrencyList = function (data) {
      self.multiCurrencyAccountListLoaded(false);

      const realAccountNo = data.currentTarget.id.slice(6);
      let currentCurrency;

      self.multiCurrencyAccountGroup(new oj.ArrayDataProvider([], {}));

      for (let i = 0; i < self.multiCurrencyList().length; i++) {
        if (self.multiCurrencyList()[i].realAccountNo.value === realAccountNo) {
          currentCurrency = self.multiCurrencyList()[i].realAccountCurrency;
          self.multiCurrencyList().splice(i, 1);
          break;
        }
      }

      if (currentCurrency === self.selectedItem()) {
        self.currencyDetailsLoaded(false);
        self.selectedListItems().length = 0;
        self.selectedRealAccount("");
        self.currencyDetailsLoaded(true);
      }

      self.multiCurrencyAccountGroup(new oj.ArrayDataProvider(self.multiCurrencyList(), { idAttribute: "realAccountNo" }));

      self.multiCurrencyAccountListLoaded(true);

    };

    self.setDefault = function (data) {
      self.multiCurrencyAccountListLoaded(false);
      self.multiCurrencyAccountGroup(new oj.ArrayDataProvider([], {}));

      const realAccountNo = data.currentTarget.id.slice(7);

      for (let i = 0; i < self.multiCurrencyList().length; i++) {
        if (self.multiCurrencyList()[i].realAccountNo.value !== realAccountNo && self.multiCurrencyList()[i].defaultAccount) {
          self.multiCurrencyList()[i].defaultAccount = false;
        }

        if (self.multiCurrencyList()[i].realAccountNo.value === realAccountNo) {

          if (self.multiCurrencyList()[i].defaultAccount) {
            self.multiCurrencyList()[i].defaultAccount = false;
          } else {
            self.multiCurrencyList()[i].defaultAccount = true;
          }
        }
      }

      self.multiCurrencyAccountGroup(new oj.ArrayDataProvider(self.multiCurrencyList(), { idAttribute: "realAccountNo" }));
      self.multiCurrencyAccountListLoaded(true);
    };

    self.createPayload = function () {
      self.modelInstance.multiccyaccountgroups.accGroupDesc(self.virtualMultiCurrencyAccountName());
      self.modelInstance.multiccyaccountgroups.accGroupId(self.virtualMultiCurrencyAccountId());
      self.modelInstance.multiccyaccountgroups.realCustomerNo(self.realCustomerNo);
      self.modelInstance.multiccyaccountgroups.VAEnabledRealAccounts(self.VAEnabledRealAccounts());
      self.modelInstance.multiccyaccountgroups.VacTmCcyAccGroupDetailDTO(self.multiCurrencyList());
    };

    self.loadReview = function () {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {

        if (self.multiCurrencyList().length >= 1) {
          self.createPayload();

          if (self.mode() === "edit") {
            params.dashboard.loadComponent("review-virtual-multi-currency-account", {
              multiccyaccountgroups: self.modelInstance.multiccyaccountgroups,
              mode: ko.mapping.toJS(self.mode()),
              fromView: params.rootModel.params.fromView,
              multiCurrencyViewDTO: JSON.stringify(self.virtualMultiCurrencyViewDTO)
            });
          } else {
            MultiCurrencyModel.validateMultiCurrencyAccountId(self.virtualMultiCurrencyAccountId()).then(function (data) {
              if(data && data.multiCurrencyAccount && data.multiCurrencyAccount.groupId){
                params.baseModel.showMessages(null, [self.resource.duplicateMultiCurrencyAccount], "error");
              } else {
              params.dashboard.loadComponent("review-virtual-multi-currency-account", {
                multiccyaccountgroups: self.modelInstance.multiccyaccountgroups,
                mode: ko.mapping.toJS(self.mode())
              });
            }
            }).catch(function(){
              params.baseModel.showMessages(null, [self.resource.duplicateMultiCurrencyAccount], "error");
            });
          }
        } else {
          params.baseModel.showMessages(null, [self.resource.validityMessage], "error");
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.backToView = function () {
      params.dashboard.loadComponent("virtual-multi-currency-account-view", {
        virtualMCA: self.virtualMultiCurrencyViewDTO.groupId
      });
    };

  };
});