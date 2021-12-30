define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/virtual-account-balance",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $, AccountBalanceModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.resource = resourceBundle;
    self.viewTable = ko.observable(false);
    self.dataSource = ko.observableArray([]);
    self.dataSourceCreated = ko.observable(false);
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    params.baseModel.registerComponent("virtual-structure-search", "virtual-account-management");
    params.baseModel.registerComponent("virtual-account-search", "virtual-account-management");
    self.limit = "0";
    self.offset = "0";
    self.status = "O";
    self.selectedAccountFilter = ko.observable("RealAccountSingleCurrency");
    self.allAccountDetails = ko.observable();
    self.realAccountSingleCurrencyDetails = ko.observable();
    self.virtualMultiCurrencyAccountDetails = ko.observable();
    self.realAccountDetailsLoaded = ko.observable(false);
    self.tableData = ko.observableArray([]);
    self.vmcaAccountBalance = ko.observableArray([]);
    self.virtualMCA = ko.observable();
    self.viewBalanceTable = ko.observable(false);

    const query = {
      criteria: [{
        operand: "status",
        operator: "EQUALS",
        value: ["O"]
      }]
    };

    self.realAccountOptions = ko.observableArray([
      {
        value: "RealAccountSingleCurrency",
        label: self.resource.dropDownOptions.realAccountSingleCurrency
      },
      {
        value: "VirtualMultiCurrencyAccount",
        label: self.resource.dropDownOptions.virtualMultiCurrencyAccount
      }

    ]);

    const fetchVAEnabled = AccountBalanceModel.fetchVAEnabledRealAccount(self.realCustomerNo);

    self.getBalance = function (realAccountNo) {
      const tempArray = self.realAccountSingleCurrencyDetails().filter(function (accountNo) {
        return accountNo.realAccountNo.value === realAccountNo;
      });

      return tempArray[0].availableBalance;
    };

    fetchVAEnabled.then(function (data) {
      if (data && data.vamaccountdtos && data.vamaccountdtos.length > 0) {
        self.realAccountSingleCurrencyDetails(data.vamaccountdtos);
        self.populateSingleCurrencyTable();
      }
    });

    self.populateSingleCurrencyTable = function () {
      self.tableData([]);
      self.viewTable(false);
      self.dataSourceCreated(false);

      let counter = 0;

      self.realAccountSingleCurrencyDetails().forEach(function (item) {
        const structureQuery = {
          criteria: [{
            operand: "realAccountNo.value",
            operator: "EQUALS",
            value: [item.realAccountNo.value]
          }, {
            operand: "status",
            operator: "EQUALS",
            value: [self.status]
          }]
        },
        virtualAccountQuery = {
          criteria: [{
            operand: "realAccountNo.value",
            operator: "EQUALS",
            value: [item.realAccountNo.value]
          }, {
            operand: "vstatus",
            operator: "EQUALS",
            value: [self.status]
          }]
        },
         fetchStructureDetails = AccountBalanceModel.fetchVirtualStructureList(JSON.stringify(structureQuery)),
          fetchVirtualAccountDetails = AccountBalanceModel.fetchVirtualAccountListSummary(JSON.stringify(virtualAccountQuery));

        Promise.all([fetchStructureDetails, fetchVirtualAccountDetails]).then(function (data) {
          if (data && data.length === 2) {
            const structureData = data[0],
              accountData = data[1];

            self.tableData.push({
              realAccountNo: item.realAccountNo.value,
              realAcoountNoDisplayValue: item.realAccountNo.displayValue,
              balance: item.availableBalance.amount,
              currency: item.availableBalance.currency,
              mappedStructures: 0,
              mappedAccounts: 0,
              structureCodes: [],
              virtualAccountData: []
            });

            if (accountData.accounts && accountData.accounts.length > 0) {
              self.tableData()[counter].mappedAccounts = self.tableData()[counter].mappedAccounts + accountData.accounts.length;
              self.tableData()[counter].virtualAccountData = accountData.accounts;
            }

            if (structureData.virtualAccountStructures && structureData.virtualAccountStructures.length > 0) {
              self.tableData()[counter].mappedStructures = self.tableData()[counter].mappedStructures + structureData.virtualAccountStructures.length;

              structureData.virtualAccountStructures.forEach(function (item) {
                self.tableData()[counter].mappedAccounts = self.tableData()[counter].mappedAccounts + item.childAccountCount;
                self.tableData()[counter].structureCodes.push(item.code);
              });
            }

            self.viewTable(false);
            self.dataSourceCreated(false);

            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.tableData(), {
              idAttribute: "realAccountNo"
            })));

            self.viewTable(true);
            self.dataSourceCreated(true);

            counter++;
          }
        }).catch(function () {
          self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
          self.viewTable(true);
          self.dataSourceCreated(true);
        });
      });
    };

    self.populateVirtualMultiCurrencyTable = function () {
      self.tableData([]);

      self.virtualMultiCurrencyAccountDetails().forEach(function (item) {
        const structureQuery = {
          criteria: [{
            operand: "groupId",
            operator: "EQUALS",
            value: [item.groupId]
          }, {
            operand: "status",
            operator: "EQUALS",
            value: [self.status]
          }]
        };

        AccountBalanceModel.fetchVirtualStructureList(JSON.stringify(structureQuery)).then(function (data) {
          if (data && data.virtualAccountStructures && data.virtualAccountStructures.length > 0) {
            self.tableData.push({
              realAccountNo: item.groupId,
              realAcoountNoDisplayValue: item.groupId,
              mappedStructures: data.virtualAccountStructures.length,
              mappedAccounts: 0,
              structureCodes: [],
              virtualAccountData: []
            });

            data.virtualAccountStructures.forEach(function (structure) {
              const temp = self.tableData().filter(function (virtualMCAItem) {
                return virtualMCAItem.realAccountNo === structure.groupId;
              });

              if (temp.length > 0) {
                temp[0].mappedAccounts = temp[0].mappedAccounts + structure.childAccountCount;
                temp[0].structureCodes.push(structure.code);
              }
            });

            self.viewTable(false);
            self.dataSourceCreated(false);

            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.tableData(), {
              idAttribute: "realAccountNo"
            })));

            self.viewTable(true);
            self.dataSourceCreated(true);
          } else {
            self.tableData.push({
              realAccountNo: item.groupId,
              realAcoountNoDisplayValue: item.groupId,
              mappedStructures: 0,
              mappedAccounts: 0,
              structureCodes: [],
              virtualAccountData: []
            });

            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.tableData(), {
              idAttribute: "realAccountNo"
            })));
          }

        });
      });

      self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.tableData(), {
        idAttribute: "realAccountNo"
      })));

      self.viewTable(true);
      self.dataSourceCreated(true);
    };

    self.selectedVirtualMultiCurrencyOption = function () {
      self.viewTable(false);
      self.dataSourceCreated(false);

      if (self.virtualMultiCurrencyAccountDetails() === undefined) {
        AccountBalanceModel.fetchVirtualMultiCurrencyAccounts(JSON.stringify(query)).then(function (data) {
          if (data && data.items && data.items.length > 0) {
            self.virtualMultiCurrencyAccountDetails(data.items);
            self.populateVirtualMultiCurrencyTable();

          } else {
            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
            self.viewTable(true);
            self.dataSourceCreated(true);
          }
        });
      } else {
        self.populateVirtualMultiCurrencyTable();
      }

    };

    self.changeAccountSelection = function (event) {
      self.selectedAccountFilter(event.detail.value);

      if (self.selectedAccountFilter() === "RealAccountSingleCurrency") {
        self.populateSingleCurrencyTable();
      } else if (self.selectedAccountFilter() === "VirtualMultiCurrencyAccount") {
        self.selectedVirtualMultiCurrencyOption();
      }
    };

    self.onSelectedViewBalanceLink = function (selectedRow) {
      self.viewBalanceTable(false);
      $("#multi-currency-account-balance-details").trigger("openModal");

      const selectedVMCA = self.virtualMultiCurrencyAccountDetails().filter(function (item) {
        return item.groupId === selectedRow.realAccountNo;
      }),
        temp = [];

      self.virtualMCA(selectedVMCA[0].groupId);

      selectedVMCA[0].accounts.forEach(function (item) {
        temp.push({
          realAccountName: self.realCustomerName,
          realAccountNo: item.id.displayValue,
          currency: item.currencyCode,
          amount: self.getBalance(item.id.value).amount
        });
      });

      self.vmcaAccountBalance(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(temp, {
        idAttribute: "realAccountNo"
      })));

      self.viewBalanceTable(true);

    };

    self.onSelectedMappedAccount = function (selectedRow) {
      params.dashboard.loadComponent("virtual-account-search", {
        virtualAccountListDTO: JSON.stringify(selectedRow.virtualAccountData),
        fromAccountsAndBalances: true,
        structureCodes: JSON.stringify(selectedRow.structureCodes)
      });
    };

    self.onSelectedMappedStructure = function (selectedRow) {
      params.dashboard.loadComponent("virtual-structure-search", {
        realAccountNumberValue: selectedRow.realAccountNo,
        selectedAccountFilter: JSON.stringify(ko.mapping.toJS(self.selectedAccountFilter()))
      });
    };

  };
});
