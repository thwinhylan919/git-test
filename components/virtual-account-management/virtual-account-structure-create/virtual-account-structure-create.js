define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/virtual-structure-create",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojswitch",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup",
  "ojs/ojpopup",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $, resourceBundle, CreateStructureModel) {
  "use strict";

  return function (params) {
    const self = this;
    let tableSourceProvider = [],
      accountGroupIdSelectionFlag;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("account-input");
    params.baseModel.registerComponent("structure-configuration", "virtual-account-management");
    params.baseModel.registerComponent("virtual-structure-tree-view", "virtual-account-management");
    params.baseModel.registerComponent("file-upload", "file-upload");
    self.taxonomyDefinition = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.vam.dto.structure.VirtualAccountStructureDTO");
    self.structureCode = ko.observable();
    self.structureName = ko.observable();
    self.selectedAccount = ko.observable();
    self.selectedAccountDisplay = ko.observable();
    self.realAccountBranch = ko.observable();
    self.additionalDetails = ko.observable({});
    self.virtualMainAcc = ko.observable();
    self.virtualParentAcc = ko.observable();
    self.virtualChildAcc = ko.observable();
    self.limit = "0";
    self.offset = "0";
    self.realAccLinkage = "S";
    self.accountLinkage = "A";
    self.selectedVirtualAccount = ko.observable();
    self.virtualAccountData = ko.observable([]);
    self.intrestCalculationReq = ko.observable(false);
    self.selectedVirtualAccountName = ko.observable();
    self.virtualAccountBalance = ko.observable();
    self.virtualChildAccount = ko.observable();
    self.virtualAccountLoaded = ko.observable(false);
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.editStructureData = params.rootModel.params.createData !== undefined ? JSON.parse(params.rootModel.params.createData) : "";
    self.structureDetails = ko.observable(params.rootModel.params.structureDetails !== undefined ? JSON.parse(params.rootModel.params.structureDetails) : "");
    self.singleCurrencyAccounts = ko.observable([]);
    self.demandDeposits = ko.observable([]);
    self.availableBalanceAmount = ko.observable();
    self.availableBalanceCurrency = ko.observable();
    self.singleCurrencyBalanceDisplay = ko.observable(false);
    self.realAccountNumberDisplay = ko.observable(false);
    self.currencyAccounts = ko.observable([]);
    self.multiCurrencyAccountGroups = ko.observable([]);
    self.singleCurrencyAccountsList = ko.observable([]);
    self.multipleCurrencyAccountsList = ko.observable([]);
    self.multipleCurrencyAccountGroupList = ko.observable([]);
    self.showViewBalanceLink = ko.observable(false);
    self.selectedValue = ko.observable();
    self.viewTable = ko.observable(false);
    self.dataSource = ko.observableArray([]);
    self.vmcaAccountBalance = ko.observableArray([]);
    self.virtualMCA = ko.observable();
    self.taskCode = params.rootModel.params.mode === "UPDATE" ? "VAMS_M_UVAS" : "VAMS_M_CVAS";
    self.VMCAstatus = "O";
    self.methodType = params.rootModel.params.mode;
    self.selectedVirtualAccountDisplay = ko.observable();

    const getNewModel = function () {
      const KoModel = CreateStructureModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.modelInstance = getNewModel();

    if (params.rootModel.params.virtualMainAcc) {
      self.virtualMainAcc = ko.observable(JSON.parse(params.rootModel.params.virtualMainAcc));
    }

    const findMCA = function (selectedValue) {
      self.virtualMCA(selectedValue);

      return self.multiCurrencyAccountGroups().find(function (groupList) {
        return groupList.groupId === selectedValue;
      });
    },

      fillViewBalanceTable = function (vmcaData) {
        const finalDTO = [];

        vmcaData.accounts.forEach(function (item) {
          const selectedAccountNumber = self.singleCurrencyAccountsList().filter(function (singleList) {
            return item.id.value === singleList.realAccountNo.value;
          });

          finalDTO.push({
            realAccountName: self.realCustomerName,
            realAccountNo: selectedAccountNumber[0].realAccountNo.displayValue,
            currency: selectedAccountNumber[0].availableBalance.currency,
            amount: selectedAccountNumber[0].availableBalance.amount
          });
        });

        return finalDTO;
      },
      fetchVMCA = function () {
        if (self.methodType === "UPDATE") {
          if (self.editStructureData.accountLinkage === "A") {
            return Promise.resolve();
          } else if (self.editStructureData.accountLinkage === "G") {
            self.modelInstance.groupId(self.editStructureData.groupId);
          }
        }

        const criterion = [{
          operand: "status",
          operator: "EQUALS",
          value: [self.VMCAstatus]
        }];

        if (self.modelInstance.groupId() !== undefined && self.modelInstance.groupId() !== "") {
          criterion.push({
            operand: "multiCurrencyAccountKey.groupId",
            operator: "CONTAINS",
            value: [self.modelInstance.groupId()]
          });
        }

        const query = {
          criteria: criterion
        };

        return CreateStructureModel.fetchMultiCurrencyList(self.taskCode, JSON.stringify(query)).then(function (multiCurrencyListResponse) {
          if (multiCurrencyListResponse) {
            if (multiCurrencyListResponse.items) {
              self.multiCurrencyAccountGroups(multiCurrencyListResponse.items);

              self.multiCurrencyAccountGroups().forEach(function (accountGroup) {
                self.multipleCurrencyAccountGroupList().push(accountGroup);
              });

              if (self.modelInstance.groupId() !== "") {
                const vmcaData = findMCA(self.modelInstance.groupId());

                tableSourceProvider = fillViewBalanceTable(vmcaData);
              }
            } else {
              self.multiCurrencyAccountGroups("");
            }
          }
        });

      };

    CreateStructureModel.fetchVAMEnabledAccounts(self.taskCode).then(function (vamEnabledAccountsListResponse) {
      if (vamEnabledAccountsListResponse && vamEnabledAccountsListResponse.vamaccountdtos) {
        self.currencyAccounts(vamEnabledAccountsListResponse.vamaccountdtos);

        self.currencyAccounts().forEach(function (accounts) {
          self.singleCurrencyAccountsList().push(accounts);
        });

        fetchVMCA().finally(function () {
          self.realAccountNumberDisplay(true);

          if (params.rootModel.params.mode === "UPDATE" && !params.rootModel.params.pageReturn) {
            self.editMode();
          } else if (params.rootModel.params.pageReturn === "backFromConfiguration") {
            self.fetchVirtualAccounts();
          }
        });
      }
    });

    self.singleCurrencySelection = function (selectedValue) {

      const selectedAccountNumber = self.singleCurrencyAccountsList().find(function (item) {
        return item.realAccountNo.value === selectedValue;
      });

      self.modelInstance.groupId("");
      accountGroupIdSelectionFlag = false;
      self.showViewBalanceLink(false);
      self.modelInstance.realAccLinkage = "A";
      self.availableBalanceAmount(selectedAccountNumber.availableBalance.amount);
      self.availableBalanceCurrency(selectedAccountNumber.availableBalance.currency);

    };

    self.multipleCurrencyAccountGroupSelection = function (selectedValue) {
      const vmcaData = findMCA(selectedValue);

      accountGroupIdSelectionFlag = true;

      tableSourceProvider = fillViewBalanceTable(vmcaData);
      self.modelInstance.realAccountNo("");
      self.modelInstance.groupId(vmcaData.groupId);
      self.modelInstance.realAccLinkage = "G";
      accountGroupIdSelectionFlag = true;
    };

    self.accountNumberSelection = function (e) {
      self.singleCurrencyBalanceDisplay(false);

      const singleCurrencyCheck = self.singleCurrencyAccountsList().find(function (account) {
        return account.realAccountNo.value === e.detail.value;
      });

      self.selectedValue(e.detail.value);

      if (singleCurrencyCheck) {
        self.selectedAccount(singleCurrencyCheck.realAccountNo);
        self.singleCurrencySelection(self.selectedValue());
        self.singleCurrencyBalanceDisplay(true);
        self.modelInstance.groupId("");
        self.showViewBalanceLink(false);
      } else {
        self.multipleCurrencyAccountGroupSelection(self.selectedValue());
        self.showViewBalanceLink(true);
        self.singleCurrencyBalanceDisplay(false);
      }
    };

    self.showViewBalance = function () {
      $("#multi-currency-account-number").trigger("openModal");
      self.viewTable(false);

      self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tableSourceProvider, {
        idAttribute: "realAccountNo"
      })));

      self.vmcaAccountBalance(self.dataSource());
      self.viewTable(true);

    };

    self.closeViewBalanceModal = function () {
      $("#multi-currency-account-number").hide();
    };

    const setVirtualAccountNameBalance = function (virtualAccountNumber) {
      for (let i = 0; i < self.virtualAccountData().length; i++) {
        if (virtualAccountNumber === self.virtualAccountData()[i].id.value) {
          self.selectedVirtualAccountName(self.virtualAccountData()[i].virtualAccountName);
          self.virtualAccountBalance(self.virtualAccountData()[i].availableBalance);
          self.selectedVirtualAccount(self.virtualAccountData()[i].id);
          break;
        }
      }
    };

    self.fetchVirtualAccounts = function () {
      CreateStructureModel.fetchVirtualAccountList(self.taskCode).then(function (data) {
        if (data && data.accounts) {
          self.virtualAccountData(data.accounts);
          self.virtualAccountLoaded(true);

          if (params.rootModel.params.headerVirtualAccount !== undefined) {
            setVirtualAccountNameBalance(ko.isObservable(params.rootModel.params.headerVirtualAccount) ? params.rootModel.params.headerVirtualAccount() : params.rootModel.params.headerVirtualAccount);
          }

          if (params.rootModel.params.pageReturn === "backFromConfiguration"){
            self.backFromConfiguration();
          }
        }
      }).catch(function () {
        self.virtualAccountData([]);
        self.virtualAccountLoaded(true);

        if (params.rootModel.params.pageReturn === "backFromConfiguration"){
          self.backFromConfiguration();
        }
      });
    };

    if (params.rootModel.params.pageReturn !== "backFromConfiguration"){
      self.fetchVirtualAccounts();
    }

    self.editMode = function () {
      self.methodType = params.rootModel.params.mode;
      self.structureCode(self.editStructureData.code);
      self.structureName(self.editStructureData.name);

      if (self.editStructureData.realAccountNo) {
        self.selectedAccount(self.editStructureData.realAccountNo);
        self.selectedValue(self.editStructureData.realAccountNo.value);
        self.selectedAccountDisplay(self.editStructureData.realAccountNo.displayValue);
        self.singleCurrencySelection(self.selectedValue());
        self.singleCurrencyBalanceDisplay(true);
        self.modelInstance.groupId("");
        self.accountLinkage = "A";
        self.showViewBalanceLink(false);
      } else {
        self.selectedAccount(self.editStructureData.groupId);
        self.selectedValue(self.editStructureData.groupId);
        self.selectedAccountDisplay(findMCA(self.editStructureData.groupId).name);
        self.multipleCurrencyAccountGroupSelection(self.selectedAccount());
        self.showViewBalanceLink(true);
        self.accountLinkage = "G";
        self.singleCurrencyBalanceDisplay(false);
      }

      self.selectedVirtualAccount(self.editStructureData.mainAccountId);
      self.selectedVirtualAccountDisplay(self.editStructureData.mainAccountId.displayValue);

      if (self.editStructureData.interestCalcRequired) {
        self.intrestCalculationReq(true);
      } else {
        self.intrestCalculationReq(false);
      }
    };

    if (params.rootModel.previousState) {
      self.structureCode(params.rootModel.previousState.virtualStructureCreateDTO.structureCode);
      self.structureName(params.rootModel.previousState.virtualStructureCreateDTO.structureDesc);

      if (params.rootModel.previousState.virtualStructureCreateDTO.realAccountNo() !== "") {
        self.selectedAccount(params.rootModel.previousState.virtualStructureCreateDTO.realAccountNo());
        self.selectedValue(params.rootModel.previousState.virtualStructureCreateDTO.realAccountNo());
        self.modelInstance.realAccountNo(params.rootModel.previousState.virtualStructureCreateDTO.realAccountNo());
      } else {
        accountGroupIdSelectionFlag = true;
        self.selectedValue(params.rootModel.previousState.virtualStructureCreateDTO.accountGroupId());
        self.modelInstance.groupId(params.rootModel.previousState.virtualStructureCreateDTO.accountGroupId());
        self.showViewBalanceLink(true);
      }

      self.selectedVirtualAccount(params.rootModel.previousState.HeaderVirtualAccount().value);

      if (params.rootModel.previousState.virtualStructureCreateDTO.interestCalcRequired() === "Y") {
        self.intrestCalculationReq(true);
      } else {
        self.intrestCalculationReq(false);
      }
    }

    self.setRealAccount = function (realAccount) {
      self.selectedAccount(realAccount);
      self.selectedValue(realAccount.value);
      self.modelInstance.realAccountNo(realAccount);
      self.singleCurrencySelection(self.selectedAccount().value);
      self.singleCurrencyBalanceDisplay(true);
      self.modelInstance.groupId("");
      self.accountLinkage = "A";
      self.showViewBalanceLink(false);
    };

    self.backFromConfiguration = function () {
      self.methodType = params.rootModel.params.mode;

      const structureDTO = JSON.parse(params.rootModel.params.virtualStructureCreateDTO);

      self.structureCode(structureDTO.code);
      self.structureName(structureDTO.name);

      if (structureDTO.realAccountNo !== "") {
        self.setRealAccount(structureDTO.realAccountNo);
      } else {
        accountGroupIdSelectionFlag = true;
        self.selectedValue(params.rootModel.params.displayGroupId);
        self.selectedAccount(params.rootModel.params.displayGroupId);
        self.modelInstance.groupId(params.rootModel.params.displayGroupId);

        if (params.rootModel.params.mode === "UPDATE") {
          self.selectedAccountDisplay(findMCA(self.selectedValue()).name);
        }

        self.multipleCurrencyAccountGroupSelection(self.selectedValue());
        self.showViewBalanceLink(true);
        self.accountLinkage = "G";
        self.singleCurrencyBalanceDisplay(false);
      }

      self.selectedVirtualAccount(ko.isObservable(params.rootModel.params.headerVirtualAccount) ? params.rootModel.params.headerVirtualAccount().value : params.rootModel.params.headerVirtualAccount.value);
      self.virtualMainAcc(self.selectedVirtualAccount());

      if (params.rootModel.params.mode !== "UPDATE") {
        self.selectedVirtualAccountName(structureDTO.accountMapDetails.account.childAccountName);
      }

      if (params.rootModel.params.mode === "UPDATE") {
        self.selectedVirtualAccountDisplay(params.rootModel.params.headerVirtualAccount.displayValue);
        self.selectedVirtualAccount(ko.isObservable(params.rootModel.params.headerVirtualAccount) ? params.rootModel.params.headerVirtualAccount() : params.rootModel.params.headerVirtualAccount);
        self.structureDetails(structureDTO.accountMapDetails);
        self.editStructureData = structureDTO;
      }

      if (structureDTO.interestCalcReq) {
        self.intrestCalculationReq(true);
      } else {
        self.intrestCalculationReq(false);
      }

    };

    self.selectedVirtualAccountHandler = function (e) {
      const virtualAccountNumber = e.detail !== undefined && e.detail.value !== undefined ? e.detail.value : e;

      setVirtualAccountNameBalance(virtualAccountNumber);
    };

    self.buildStructure = function () {
      const tracker = document.getElementById("tracker");
      let addDetails = {};

      if (tracker.valid === "valid") {
        if (!accountGroupIdSelectionFlag) {

          if (self.singleCurrencyAccountsList()) {

            const tempArray = self.singleCurrencyAccountsList().filter(function (item) {
              return item.realAccountNo.value === self.selectedAccount().value;
            });

            addDetails = {

              displayValue: tempArray[0].realAccountNo.displayValue,
              value: tempArray[0].realAccountNo.value,
              realAccountCurrency: tempArray[0].availableBalance.currency,
              branchCode: tempArray[0].branchCode
            };
          } else {
            addDetails = {};
          }
        }

        if (self.methodType !== "UPDATE") {

          CreateStructureModel.structureCodeValidation(self.structureCode()).then(function (data) {
            if (data && data.virtualAccountStructure && data.virtualAccountStructure.structureDetails) {
              params.baseModel.showMessages(null, [self.resource.structureDuplicate], "error");
            } else {

              self.modelInstance.code(self.structureCode());
              self.modelInstance.name(self.structureName());

              self.modelInstance.realCustomerNo(self.realCustomerNo);

              self.modelInstance.interestCalcReq(self.intrestCalculationReq());

              self.modelInstance.realAccountNo(self.selectedAccount());

              self.modelInstance.accountLinkage(self.accountLinkage);
              self.modelInstance.accountMapDetails.account.mainAccountId(self.selectedVirtualAccount());
              self.modelInstance.accountMapDetails.account.parentAccountId(self.selectedVirtualAccount());
              self.modelInstance.accountMapDetails.account.childAccountId(self.selectedVirtualAccount());
              self.modelInstance.accountMapDetails.account.childAccountName(self.selectedVirtualAccountName());
              self.modelInstance.accountMapDetails.account.balance(self.virtualAccountBalance());

              self.modelInstance.accountMapDetails.children()[0].account.mainAccountId(self.selectedVirtualAccount());
              self.modelInstance.accountMapDetails.children()[0].account.headerAccountNo(self.selectedVirtualAccount());
              self.modelInstance.accountMapDetails.children()[0].account.childAccountId(self.selectedVirtualAccount());
              self.modelInstance.accountMapDetails.children()[0].account.parentAccountId(self.selectedVirtualAccount());
              self.modelInstance.accountMapDetails.children()[0].account.childAccountName(self.selectedVirtualAccountName());
              self.modelInstance.accountMapDetails.children()[0].account.balance(self.virtualAccountBalance());

              if (accountGroupIdSelectionFlag) {
                self.modelInstance.realAccountNo("");

                params.dashboard.loadComponent("structure-configuration", {
                  virtualStructureCreateDTO: self.modelInstance,
                  virtualAccountData: JSON.stringify(ko.mapping.toJS(self.virtualAccountData())),
                  HeaderVirtualAccount: ko.mapping.toJS(self.selectedVirtualAccount()),
                  mode: "CREATE"
                });

              } else {

                params.dashboard.loadComponent("structure-configuration", {
                  virtualStructureCreateDTO: self.modelInstance,
                  virtualAccountData: JSON.stringify(ko.mapping.toJS(self.virtualAccountData())),
                  additionalDetails: JSON.stringify(addDetails),
                  HeaderVirtualAccount: ko.mapping.toJS(self.selectedVirtualAccount()),
                  mode: "CREATE"
                });

              }
            }
          }).catch(function () {
            params.baseModel.showMessages(null, [self.resource.structureDuplicate], "error");
          });

        } else if (self.methodType === "UPDATE") {
          const virtualStructureUpdateData = {
            realCustomerNo: self.realCustomerNo,
            code: self.structureCode(),
            name: self.structureName(),
            realAccountNo: accountGroupIdSelectionFlag === true ? "" : self.selectedAccount(),
            groupId: accountGroupIdSelectionFlag === true ? self.selectedAccount() : "",
            accountLinkage: self.accountLinkage,
            virtualAccountData: self.virtualAccountData(),
            interestCalcReq: self.intrestCalculationReq()
          };

          self.structureDetails().account.headerAccountNo = self.structureDetails().account.childAccountId;
          self.structureDetails().account.mainAccountId = self.structureDetails().account.childAccountId;

          params.dashboard.loadComponent("structure-configuration", {
            virtualStructureCreateDTO: JSON.stringify(virtualStructureUpdateData),
            virtualAccountData: JSON.stringify(ko.mapping.toJS(self.virtualAccountData())),
            HeaderVirtualAccount: self.selectedVirtualAccount(),
            structureDetails: JSON.stringify(ko.mapping.toJS(self.structureDetails())),
            mode: "UPDATE",
            additionalDetails: accountGroupIdSelectionFlag === true ? undefined : JSON.stringify(addDetails),
            editStructureData: self.editStructureData
          });
        }

      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.fileUpload = function () {
      params.dashboard.loadComponent("file-upload", self);
    };

    self.backToTreeView = function () {
      params.dashboard.loadComponent("virtual-structure-tree-view", {
        methodType: "VIEW",
        structureCode: self.structureCode()
      });
    };
  };
});