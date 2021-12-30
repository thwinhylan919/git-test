define([
  "jquery",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-account-create",
  "ojs/ojswitch",
  "ojs/ojcheckboxset",
  "ojs/ojvalidationgroup",
  "ojs/ojselectcombobox",
  "ojs/ojpopup"
], function ($, ko, VirtualAccountModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerTransaction("virtual-account", "virtual-account-management");
    params.baseModel.registerComponent("virtual-account-view", "virtual-account-management");
    params.baseModel.registerComponent("file-upload", "file-upload");
    params.baseModel.registerElement("account-input");
    params.baseModel.registerElement("amount-input");

    self.getModelPayload = function () {
      return ko.mapping.fromJS(VirtualAccountModel.modelPayload());
    };

    self.modelPayload = self.getModelPayload();
    self.modelPayload.partyId(params.dashboard.userData.userProfile.partyId.value);
    self.ibanRequiredValue = ko.observable();
    self.debitTxnsAllowedValue = ko.observable();
    self.currencyLoaded = ko.observable(false);
    self.ShowbalAvailabilityOptions = ko.observable(false);
    self.correspondenceAddress = ko.observableArray();
    self.VirtualAccountproducts = ko.observableArray([]);
    self.displayAddress = ko.observable(true);
    self.creditTxnsAllowedValue = ko.observable();
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.overdraftOptionValue = ko.observable();
    self.limit = "0";
    self.offset = "0";
    self.realAccLinkageValue = ko.observable();
    self.fromViewScreen = ko.observable(params.rootModel.params.fromViewScreen);
    self.showViewBalanceLink = ko.observable();
    self.singleCurrencyBalanceDisplay = ko.observable();
    self.viewTable = ko.observable();
    self.selectedValue = ko.observable();
    self.disabledState = ko.observable(false);
    self.viewVirtualProduct = ko.observable();
    self.singleCurrencyAccountsList = ko.observable([]);
    self.multipleCurrencyAccountsList = ko.observable([]);
    self.countryLoaded = ko.observable(false);
    self.countryOptions = ko.observable();
    self.virtualEntitiesLoaded = ko.observable(false);
    self.showVirtualEntityInfo = ko.observable(false);
    self.showVirtualProduct = ko.observable(false);
    self.realAccountNumberDisplay = ko.observable(false);
    self.selectedEntity = ko.observable();
    self.displayBalAvlAmount = ko.observable(false);
    self.availableBalanceAmount = ko.observable();
    self.availableBalanceCurrency = ko.observable();
    self.interestCalcReqValue = ko.observable();
    self.currencyListData = ko.observableArray([]);
    self.balChkForDebitsValue = ko.observable();
    self.virtualEntities = ko.observableArray([]);
    self.accountFrozenValue = ko.observable(false);
    self.balAvailabilityOptionsValue = ko.observableArray();
    self.viewStatus = self.resource.close;
    self.branchCodeList = ko.observable();
    self.branchCodeLoaded = ko.observable(false);
    self.checkBoxInteracted = ko.observable(false);
    self.accountStatus = "O";
    self.taxonomyDefinationCreate = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.vam.dto.virtualaccount.VirtualAccountCreateRequestDTO");
    self.taxonomyDefinationUpdate = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.vam.dto.virtualaccount.VirtualAccountUpdateRequestDTO");

    if (params.rootModel.selectedVirtualEntityName) {
      self.modelPayload.virtualEntityName(params.rootModel.selectedVirtualEntityName());
      self.showVirtualEntityInfo(true);
    }

    const qQuery = {
        criteria: [{
          operand: "status",
          operator: "EQUALS",
          value: ["O"]
        }]
    };

    if (params.rootModel.params.virtualAccountViewDTO) {
      const virtualAccountViewDTO = JSON.parse(params.rootModel.params.virtualAccountViewDTO);

      self.viewEntityId = virtualAccountViewDTO.virtualEntityId;
      self.modelPayload.branchCode(virtualAccountViewDTO.branchCode);
      self.viewEntityName = virtualAccountViewDTO.virtualEntityName;
      self.modelPayload.id = virtualAccountViewDTO.id;
      self.viewCreationDate = virtualAccountViewDTO.openingDate;
      self.viewBranchCode = virtualAccountViewDTO.branchCode;
      self.viewIbanNo = virtualAccountViewDTO.ibanAccNo;

      if (virtualAccountViewDTO.accountStatus === "O") {
        self.viewStatus = self.resource.open;
      } else if (virtualAccountViewDTO.accountStatus === "A") {
        self.viewStatus = self.resource.active;
      } else {
        self.viewStatus = self.resource.close;
      }

      const fetchProductListPromise = VirtualAccountModel.fetchProductList(self.modelPayload.partyId(), self.limit, self.offset);

      fetchProductListPromise.then(
        function (data) {
          if (data && data.jsonNode && data.jsonNode.data) {
            self.VirtualAccountproducts(data.jsonNode.data);
          }

          for (let i = 0; i < self.VirtualAccountproducts().length; i++) {
            if (self.VirtualAccountproducts()[i].accCode === virtualAccountViewDTO.virtualAccProduct) {
              self.viewVirtualProduct(self.VirtualAccountproducts()[i].codeDesc);
              break;
            }
          }
        });

    }

    self.fetchVAMAccounts = function () {

      VirtualAccountModel.fetchVAMEnabledAccounts(self.taskCode).then(
        function (response) {
          if (response && response.vamaccountdtos) {
            self.accounts = response.vamaccountdtos;
            self.singleCurrencyAccountsList().length = 0;
            self.multipleCurrencyAccountsList().length = 0;

            self.accounts.forEach(function (currentAccount) {
              self.singleCurrencyAccountsList().push(currentAccount);
            });

            self.realAccountNumberDisplay(true);

            if (params.rootModel.params.virtualAccountViewDTO) {
              self.balanceDisplay();
            }

          }
        }
      ).catch(function () {
        self.singleCurrencyAccountsList([]);
        self.multipleCurrencyAccountsList([]);
        self.realAccountNumberDisplay(true);
        self.singleCurrencyBalanceDisplay(false);
        self.showViewBalanceLink(false);
      });
    };

    self.singleCurrencySelection = function (selectedValue) {

      const selectedAccountNumber = self.accounts.find(function (item) {
        return item.realAccountNo.value === selectedValue;
      });

      self.availableBalanceAmount(selectedAccountNumber.availableBalance.amount);
      self.availableBalanceCurrency(selectedAccountNumber.availableBalance.currency);

    };

    self.balanceDisplay = function () {
      const singleCurrencyCheck = self.singleCurrencyAccountsList().find(function (account) {
        return account.realAccountNo.value === self.selectedValue();
      });

      if (singleCurrencyCheck) {
        self.singleCurrencySelection(self.selectedValue());
        self.singleCurrencyBalanceDisplay(true);
        self.showViewBalanceLink(false);
      } else {
        self.showViewBalanceLink(true);
        self.singleCurrencyBalanceDisplay(false);
      }
    };

    if (params.rootModel.previousState) {
      const virtualAccountDTO = params.rootModel.previousState.virtualAccountCreateDTO;

      self.modelPayload.virtualEntityId(virtualAccountDTO.virtualEntityId());
      self.modelPayload.branchCode(virtualAccountDTO.branchCode());
      self.modelPayload.virtualEntityName(virtualAccountDTO.virtualEntityName());
      self.modelPayload.virtualAccProduct(virtualAccountDTO.virtualAccProduct());
      self.modelPayload.currencyCode(virtualAccountDTO.currencyCode());
      self.modelPayload.defaultAccCcy(virtualAccountDTO.currencyCode());

      self.modelPayload.address.line1(virtualAccountDTO.address.line1());
      self.modelPayload.address.line2(virtualAccountDTO.address.line2());
      self.modelPayload.address.country(virtualAccountDTO.address.country());
      self.modelPayload.address.city(virtualAccountDTO.address.city());
      self.modelPayload.address.zipCode(virtualAccountDTO.address.zipCode());
      self.modelPayload.virtualAccountName(virtualAccountDTO.virtualAccountName());

      self.checkBoxInteracted(params.rootModel.previousState.entityAddressFlag);

      if(self.checkBoxInteracted()){
        self.displayAddress(false);
        self.correspondenceAddress.push("entityAddressSelected");
      }

      if (params.rootModel.disabledState) {
        self.disabledState(params.rootModel.disabledState());
      }

      self.realAccountNumberDisplay(false);

      if (virtualAccountDTO.ibanRequired() === true) {
        self.ibanRequiredValue(true);
      } else {
        self.ibanRequiredValue(false);
      }

      if (virtualAccountDTO.balChkForDebits() === true) {
        self.balChkForDebitsValue(true);
      } else {
        self.balChkForDebitsValue(false);
      }

      self.modelPayload.debitTxnsAllowed(virtualAccountDTO.debitTxnsAllowed());

      if (virtualAccountDTO.debitTxnsAllowed() === true) {
        self.debitTxnsAllowedValue(true);
      } else {
        self.debitTxnsAllowedValue(false);
      }

      if (virtualAccountDTO.creditTxnsAllowed() === true) {
        self.creditTxnsAllowedValue(true);
      } else {
        self.creditTxnsAllowedValue(false);
      }

      self.modelPayload.accountPurpose(virtualAccountDTO.accountPurpose());

      if (virtualAccountDTO.overdraftAllowed() === true) {
        self.overdraftOptionValue(true);
        self.modelPayload.odFixedAmount.amount(virtualAccountDTO.odFixedAmount.amount());
        self.modelPayload.odFixedAmount.currency(virtualAccountDTO.odFixedAmount.currency());
      } else {
        self.overdraftOptionValue(false);
      }

      if (virtualAccountDTO.realAccLinkage() === "A") {
        self.modelPayload.realAccLinkage(virtualAccountDTO.realAccLinkage());
        self.realAccLinkageValue(true);
        self.modelPayload.realAccountNo(params.rootModel.previousState.additionalDetails.id);
        self.selectedValue(self.modelPayload.realAccountNo().value);
        self.fetchVAMAccounts();
      } else {
        self.realAccLinkageValue(false);
      }

      if (virtualAccountDTO.balAvailabilityOptions() === "B") {
        self.modelPayload.balAvailabilityOptions(virtualAccountDTO.balAvailabilityOptions());
        self.modelPayload.fixedAmtFromPool.currency(virtualAccountDTO.fixedAmtFromPool.currency());
        self.modelPayload.fixedAmtFromPool.amount(virtualAccountDTO.fixedAmtFromPool.amount());
        self.displayBalAvlAmount(true);

      } else {
        self.modelPayload.balAvailabilityOptions(virtualAccountDTO.balAvailabilityOptions());
      }

      if (virtualAccountDTO.interestCalcReq() === true) {
        self.interestCalcReqValue(true);
      } else {
        self.interestCalcReqValue(false);
      }
    } else if (params.rootModel.params.virtualAccountViewDTO) {
      const virtualAccountViewDTO = JSON.parse(params.rootModel.params.virtualAccountViewDTO);

      self.modelPayload.virtualEntityId(virtualAccountViewDTO.virtualEntityId);
      self.modelPayload.virtualEntityName(virtualAccountViewDTO.virtualEntityName);
      self.modelPayload.virtualAccProduct(virtualAccountViewDTO.virtualAccProduct);
      self.modelPayload.currencyCode(virtualAccountViewDTO.currencyCode);
      self.modelPayload.defaultAccCcy(virtualAccountViewDTO.currencyCode);

      self.modelPayload.address.line1(virtualAccountViewDTO.address.line1);
      self.modelPayload.address.line2(virtualAccountViewDTO.address.line2);
      self.modelPayload.address.country(virtualAccountViewDTO.address.country);
      self.modelPayload.address.zipCode(virtualAccountViewDTO.address.zipCode);
      self.modelPayload.accountStatus(virtualAccountViewDTO.accountStatus);
      self.modelPayload.openingDate(virtualAccountViewDTO.openingDate);
      self.modelPayload.virtualAccountName(virtualAccountViewDTO.virtualAccountName);
      self.modelPayload.id = virtualAccountViewDTO.id;
      self.realAccountNumberDisplay(false);

      if (virtualAccountViewDTO.ibanRequired === true) {
        self.ibanRequiredValue(true);
        self.disabledState(true);
      } else {
        self.ibanRequiredValue(false);
      }

      self.modelPayload.ibanRequired(virtualAccountViewDTO.ibanRequired);

      if (virtualAccountViewDTO.balChkForDebits === true) {
        self.balChkForDebitsValue(true);
      } else {
        self.balChkForDebitsValue(false);
      }

      if (virtualAccountViewDTO.debitTxnsAllowed === true) {
        self.debitTxnsAllowedValue(true);
      } else {
        self.debitTxnsAllowedValue(false);
      }

      if (virtualAccountViewDTO.creditTxnsAllowed === true) {
        self.creditTxnsAllowedValue(true);
      } else {
        self.creditTxnsAllowedValue(false);
      }

      if (virtualAccountViewDTO.accountFrozen === true) {
        self.accountFrozenValue(true);
      } else {
        self.accountFrozenValue(false);
      }

      self.modelPayload.accountPurpose(virtualAccountViewDTO.accountPurpose);

      if (virtualAccountViewDTO.overdraftAllowed === true) {
        self.modelPayload.odFixedAmount.amount(virtualAccountViewDTO.odFixedAmount.amount);
        self.modelPayload.odFixedAmount.currency(virtualAccountViewDTO.odFixedAmount.currency);

        self.overdraftOptionValue(true);

      } else {
        self.overdraftOptionValue(false);
      }

      if (virtualAccountViewDTO.realAccLinkage === "A") {
        self.modelPayload.realAccLinkage(virtualAccountViewDTO.realAccLinkage);
        self.realAccLinkageValue(true);
        self.fetchVAMAccounts();
        self.modelPayload.realAccountNo(virtualAccountViewDTO.realAccountNo);
        self.selectedValue(virtualAccountViewDTO.realAccountNo.value);
      } else {
        self.realAccLinkageValue(false);
        self.modelPayload.realAccountBrn(null);
        self.modelPayload.realAccountCcy(null);
        self.modelPayload.realAccountNo(null);
      }

      if (virtualAccountViewDTO.interestCalcReq === true) {
        self.interestCalcReqValue(true);
      } else {
        self.interestCalcReqValue(false);
      }

      if (virtualAccountViewDTO.balAvailabilityOptions === "B") {
        self.modelPayload.balAvailabilityOptions(virtualAccountViewDTO.balAvailabilityOptions);
        self.modelPayload.fixedAmtFromPool.amount(virtualAccountViewDTO.fixedAmtFromPool.amount);
        self.modelPayload.fixedAmtFromPool.currency(virtualAccountViewDTO.fixedAmtFromPool.currency);

        self.displayBalAvlAmount(true);
      } else {
        self.modelPayload.balAvailabilityOptions(virtualAccountViewDTO.balAvailabilityOptions);
      }
    }

    const getEntityListPromise = VirtualAccountModel.getEntityList(JSON.stringify(qQuery)),
      getBranchCodePromise = VirtualAccountModel.getBranchCode(self.limit, self.offset),
      fetchCountryListPromise = VirtualAccountModel.fetchCountryList(self.limit, self.offset),
      fetchProductListNextPromise = VirtualAccountModel.fetchProductList(self.modelPayload.partyId(), self.limit, self.offset),
      fetchCurrencyListPromise = VirtualAccountModel.fetchCurrencyList(self.limit, self.offset);

    getEntityListPromise.then(
      function (data) {
        if (data.virtualEntities) {
          self.virtualEntities(data.virtualEntities);
          self.virtualEntitiesLoaded(true);
        }
      }).catch(function () {
        self.virtualEntities([]);
        self.virtualEntitiesLoaded(true);
      });

    getBranchCodePromise.then(
      function (data) {
        if (data.jsonNode.data) {
          self.branchCodeList(data.jsonNode.data);
          self.branchCodeLoaded(true);
        }
      }).catch(function () {
        self.branchCodeList([]);
        self.branchCodeLoaded(true);
      });

    self.selectbranchCodeHandler = function (event) {
      for (let i = 0; i < self.branchCodeList().length; i++) {
        if (event.detail.value === self.branchCodeList()[i].branchCode) {
          self.modelPayload.branchCode(self.branchCodeList()[i].branchCode);
          break;
        }
      }
    };

    self.selectedEntityChangeHandler = function (event) {
      for (let i = 0; i < self.virtualEntities().length; i++) {
        if (event.detail.value === self.virtualEntities()[i].virtualEntityId) {
          self.selectedEntity(self.virtualEntities()[i]);
          self.modelPayload.virtualEntityId(self.virtualEntities()[i].virtualEntityId);
          self.modelPayload.virtualEntityName(self.virtualEntities()[i].virtualEntityName);
          self.showVirtualEntityInfo(true);
          break;
        }
      }

      if (self.checkBoxInteracted() && self.displayAddress() === false) {
        self.correspondenceAddressChangehandler(true);
      }
    };

    self.BalAvlOptions = function () {

      const balAvailabilityResponse = [{
        id: "O",
        description: self.resource.ownBal

      },
      {
        id: "P",
        description: self.resource.poolBal

      },
      {
        id: "B",
        description: self.resource.fixedBalAvl

      }
      ];

      for (let i = 0; i < balAvailabilityResponse.length; i++) {
        self.balAvailabilityOptionsValue.push({
          id: balAvailabilityResponse[i].id,
          description: balAvailabilityResponse[i].description
        });
      }

      self.ShowbalAvailabilityOptions(true);
    };

    self.BalAvlOptions();

    self.backToSearch = function () {
      params.dashboard.loadComponent("virtual-account-search", self);
    };

    self.backToView = function () {
      params.dashboard.loadComponent("virtual-account-view", {
        virtualAccountViewDTO: params.rootModel.params.virtualAccountViewDTO
      });
    };

    self.submit = function () {

      let addDetails = {};

      if (self.accounts && self.realAccLinkageValue() === true) {
        const tempArray = self.accounts.filter(function (item) {
          return item.realAccountNo.value === self.selectedValue();
        });

        if (tempArray.length > 0) {
          addDetails = {
            id: tempArray[0].realAccountNo,
            realAccountCurrency: tempArray[0].availableBalance.currency,
            branchCode: tempArray[0].branchCode
          };

          if (self.realAccLinkageValue() === true) {
            self.modelPayload.realAccountNo(addDetails.id);
            self.modelPayload.realAccountBrn(addDetails.branchCode);
            self.modelPayload.realAccountCcy(addDetails.realAccountCurrency);
          }

          if (!params.rootModel.previousState && !params.rootModel.params.virtualAccountViewDTO) {
            if (self.realAccLinkageValue() === true) {
              self.modelPayload.realAccountNo(addDetails.id);
              self.modelPayload.realAccountBrn(addDetails.branchCode);
              self.modelPayload.realAccountCcy(addDetails.realAccountCurrency);
            } else if (self.realAccLinkageValue() === false) {
              self.modelPayload.realAccountBrn(null);
              self.modelPayload.realAccountCcy(null);
              self.modelPayload.realAccountNo(null);
            }
          }
        } else {
          addDetails = {};
        }

      } else {
        addDetails = {};
      }

      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {

        if (self.ibanRequiredValue()) {
          self.modelPayload.ibanRequired(true);
        } else {
          self.modelPayload.ibanRequired(false);

        }

        if (self.creditTxnsAllowedValue()) {
          self.modelPayload.creditTxnsAllowed(true);
        } else {
          self.modelPayload.creditTxnsAllowed(false);

        }

        if (self.balChkForDebitsValue()) {
          self.modelPayload.balChkForDebits(true);
        } else {
          self.modelPayload.balChkForDebits(false);

        }

        if (self.debitTxnsAllowedValue()) {
          self.modelPayload.debitTxnsAllowed(true);
        } else {
          self.modelPayload.debitTxnsAllowed(false);

        }

        if (self.overdraftOptionValue()) {
          self.modelPayload.overdraftAllowed(true);
          self.modelPayload.odFixedAmount.currency(self.modelPayload.currencyCode());
        } else {
          self.modelPayload.overdraftAllowed(false);
          self.modelPayload.odFixedAmount = null;

        }

        if (self.interestCalcReqValue()) {
          self.modelPayload.interestCalcReq(true);
        } else {
          self.modelPayload.interestCalcReq(false);

        }

        self.modelPayload.realAccLinkage(self.realAccLinkageValue() ? "A" : "S");

        if (params.rootModel.params.virtualAccountViewDTO) {
          if (self.accountFrozenValue()) {
            self.modelPayload.frozen(true);
          } else {
            self.modelPayload.frozen(false);

          }

          self.modelPayload.ibanAccNo(self.viewIbanNo);

          params.dashboard.loadComponent("review-virtual-account", {
            virtualAccountCreateDTO: self.modelPayload,
            mode: "review",
            flowCheck: "update",
            additionalDetails: addDetails
          });
        } else {
          self.modelPayload.frozen(false);

          params.dashboard.loadComponent("review-virtual-account", {
            virtualAccountCreateDTO: self.modelPayload,
            mode: "review",
            additionalDetails: addDetails,
            entityAddressFlag: ko.mapping.toJS(self.checkBoxInteracted())
          });
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    fetchCountryListPromise.then(
      function (data) {
        if (data.jsonNode && data.jsonNode.data.length > 0 && data.jsonNode.data) {
          self.countryOptions(data.jsonNode.data);
          self.countryLoaded(true);
        }
      });

    fetchProductListNextPromise.then(
      function (data) {
        if (data.jsonNode.data) {
          self.VirtualAccountproducts(data.jsonNode.data);
          self.showVirtualProduct(true);
        }
      }).catch(function () {
        self.VirtualAccountproducts([]);
        self.showVirtualProduct(true);
      });

    fetchCurrencyListPromise.then(
      function (data) {
        if (data.jsonNode && data.jsonNode.data && data.jsonNode.data.length > 0) {
          self.currencyListData(data.jsonNode.data);
          self.currencyLoaded(true);
        }
      }).catch(function () {
        self.currencyListData([]);
        self.currencyLoaded(true);
      });

    self.correspondenceAddressChangehandler = function (event) {

      if (event === true || event.detail.value[0] === "entityAddressSelected") {
        self.displayAddress(false);

        if (self.selectedEntity()!==undefined && self.selectedEntity().virtualEntityId) {

          const getEntityViewPromise = VirtualAccountModel.getEntityView(self.selectedEntity().virtualEntityId);

          getEntityViewPromise.then(
            function (data) {
              if (data) {
                self.modelPayload.address.line1(data.virtualEntity.address.line1);
                self.modelPayload.address.line2(data.virtualEntity.address.line2);
                self.modelPayload.address.country(data.virtualEntity.address.country);
                self.modelPayload.address.zipCode(data.virtualEntity.address.zipCode);
                self.modelPayload.address.city("city");
              }
            });

        }

        self.checkBoxInteracted(true);
      } else {
        self.displayAddress(true);
        self.checkBoxInteracted(false);
      }
    };

    self.balAvlOptChangeHandler = function (event) {
      if (event.detail.value === "B") {
        self.modelPayload.fixedAmtFromPool.currency(self.modelPayload.currencyCode());

        self.displayBalAvlAmount(true);
      } else {
        self.displayBalAvlAmount(false);
      }
    };

    self.overdraftOptionChangeHandler = function (event) {
      if (event.detail.value === true) {
        self.overdraftOptionValue(true);
      } else {
        self.overdraftOptionValue(false);
        self.modelPayload.odFixedAmount(null);
      }
    };

    self.realAccLinkageChangeHandler = function (event) {
      if (event.detail.value === true) {
        self.fetchVAMAccounts();
        self.realAccLinkageValue(true);
      } else {
        self.realAccLinkageValue(false);
        self.modelPayload.realAccountNo(null);
        self.interestCalcReqValue(false);
        self.realAccountNumberDisplay(false);
        self.singleCurrencyBalanceDisplay(false);
        self.showViewBalanceLink(false);
        self.selectedValue(null);
      }
    };

    self.showViewBalance = function () {
      $("#multi-currency-account-number").trigger("openModal");
    };

    self.accountNumberSelection = function (e) {
      self.singleCurrencyBalanceDisplay(false);
      self.selectedValue(e.detail.value);
      self.balanceDisplay();
    };

  };
});