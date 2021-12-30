/**
 * Create sweep in instruction lists all the accounts that have been linked to a particular account.
 * Also it gives option to link additional accounts to the beneficiary account.
 *
 * @module sweep-in-instruction
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} sweepInInstructionListModel
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/sweep-in-instruction",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview",
  "ojs/ojpopup",
  "ojs/ojlabel",
  "promise",
  "ojs/ojradioset",
  "ojs/ojcheckboxset"
], function (oj, ko, $, sweepInInstructionModel, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.dataSourceLoaded = ko.observable(false);
    self.accountsdataSource = ko.observable();
    self.validationTracker = ko.observable();
    self.detailDataFetched = ko.observable(false);
    self.currentTask = ko.observable();
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerComponent("account-nickname", "accounts");
    rootParams.baseModel.registerComponent("review-sweep-in-instruction", "demand-deposits");
    rootParams.baseModel.registerComponent("multiple-sweep-in-instruction-status", "demand-deposits");
    rootParams.dashboard.headerName(self.resource.title);
    self.detailViewResponse = ko.observable();
    self.module = ko.observable(rootParams.module);
    self.partyName = ko.observable();
    self.showNicknameInput = ko.observable(false);
    self.hasAccountNickname = ko.observable(false);
    self.selectedAccount = ko.observable(self.params.id ? self.params.id.value : null);
    self.depositTenureCheck = ko.observable();
    self.accountDetails = ko.observableArray([]);
    self.sweepInInstructionsAccountslist = ko.observableArray();
    self.sweepInInstructionsAccountslist = rootParams.rootModel.previousState && rootParams.rootModel.previousState.sweepInInstructionsAccountslist ? rootParams.rootModel.previousState.sweepInInstructionsAccountslist : ko.observableArray([]);
    self.accounts = ko.observableArray([]);
    self.sweepInInstructionslist = rootParams.rootModel.previousState && rootParams.rootModel.previousState.sweepInInstructionslist ? rootParams.rootModel.previousState.sweepInInstructionslist : ko.observableArray([]);
    self.providerAccountslist = rootParams.rootModel.previousState && rootParams.rootModel.previousState.providerAccountslist ? rootParams.rootModel.previousState.providerAccountslist : ko.observableArray([]);
    self.accountsAddedSweepInlist = ko.observableArray([]);
    self.providerAccountsDataSourceLoaded = rootParams.rootModel.previousState && rootParams.rootModel.previousState.providerAccountsDataSourceLoaded ? rootParams.rootModel.previousState.providerAccountsDataSourceLoaded : ko.observable(false);
    self.linkedaccountsDataproviderLoaded = ko.observable(false);
    self.linkedaccountsDataprovider = ko.observable();
    self.providerAccountsDataSource = rootParams.rootModel.previousState && rootParams.rootModel.previousState.providerAccountsDataSource ? rootParams.rootModel.previousState.providerAccountsDataSource : ko.observable();
    self.addAccountDataLoaded = rootParams.rootModel.previousState && rootParams.rootModel.previousState.addAccountDataLoaded ? rootParams.rootModel.previousState.addAccountDataLoaded : ko.observable(false);
    self.showConfirmScreenButton = ko.observable(false);
    self.showConfirmScreen = ko.observable(false);
    self.showButton = rootParams.rootModel.previousState && rootParams.rootModel.previousState.showButton ? rootParams.rootModel.previousState.showButton : ko.observable(true);
    self.accountType = rootParams.rootModel.previousState && rootParams.rootModel.previousState.accountType ? rootParams.rootModel.previousState.accountType : ko.observable("casa");
    self.deleteIndex = ko.observable();
    self.accountsToAdd = rootParams.rootModel.previousState && rootParams.rootModel.previousState.accountsToAdd ? rootParams.rootModel.previousState.accountsToAdd : ko.observable([]);
    self.linkedAccountscolumnData = ko.observableArray([]);
    self.providerAccountscolumnData = ko.observableArray([]);
    self.transactionStatus = ko.observable();
    self.transactionName = ko.observable(self.resource.title);
    self.radioSetDisabled = ko.observable(false);
    self.errorMessage = ko.observable();
    self.noAccountsMessage = ko.observable(self.resource.noAccountsMessage.noCasaAccountAvailable);
    self.linkedaccountsPagingDataprovider = ko.observable();
    self.providerAccountsPagingDataSource = rootParams.rootModel.previousState && rootParams.rootModel.previousState.providerAccountsPagingDataSource ? rootParams.rootModel.previousState.providerAccountsPagingDataSource : ko.observable();
    self.linkedaccountsPagingDataprovider = rootParams.rootModel.previousState && rootParams.rootModel.previousState.linkedaccountsPagingDataprovider ? rootParams.rootModel.previousState.linkedaccountsPagingDataprovider : ko.observable();
    self.multipleSweepInInstructionStatusData = ko.observableArray([]);
    self.showFailureReason = ko.observable(false);

    const confirmScreenExtensions = {};

    rootParams.dashboard.helpComponent.componentName("sweep-in-instruction");

    rootParams.dashboard.helpComponent.params({
      accountType: self.accountType
    });

    /**
     * Self - selects column data for table.
     *
     * @return {type}  Description.
     */
    self.selectColumnData = function () {
      if (self.accountType() === "casa") {
        self.providerAccountscolumnData(self.casaProviderAccountscolumnData());
        self.linkedAccountscolumnData(self.casaLinkedAccountscolumnData());
      } else {
        self.providerAccountscolumnData(self.tdProviderAccountscolumnData());
        self.linkedAccountscolumnData(self.tdLinkedAccountscolumnData());
      }
    };

    self.casaProviderAccountscolumnData = ko.observableArray([{
        headerText: self.resource.labels.accountNo,
        field: "accountId"
      }, {
        headerText: self.resource.labels.partyName,
        field: "partyName"
      },
      {
        headerText: self.resource.labels.balance,
        renderer: oj.KnockoutTemplateUtils.getRenderer("showBalance", true),
        style: "width:3%; text-align:right"
      },
      {
        headerText: self.resource.labels.action,
        renderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_select", true),
        style: "width:1%"
      }
    ]);

    self.msgNoData = ko.observable({
      msgNoData: self.noAccountsMessage()
    });

    self.tdProviderAccountscolumnData = ko.observableArray([{
        headerText: self.resource.labels.accountNo,
        field: "accountId"
      }, {
        headerText: self.resource.labels.partyName,
        field: "partyName"
      },
      {
        headerText: self.resource.labels.action,
        renderer: oj.KnockoutTemplateUtils.getRenderer("checkbox_select", true),
        style: "width:1%"
      }
    ]);

    self.casaLinkedAccountscolumnData = ko.observableArray([{
        headerText: self.resource.labels.accountNo,
        field: "accountId"
      }, {
        headerText: self.resource.labels.partyName,
        field: "partyName"
      },
      {
        headerText: self.resource.labels.balance,
        renderer: oj.KnockoutTemplateUtils.getRenderer("showBalance", true),
        style: "width:3%; text-align:right"
      },
      {
        headerText: self.resource.labels.action,
        renderer: oj.KnockoutTemplateUtils.getRenderer("delete_template", true),
        style: "width:1%; text-align:center"
      }
    ]);

    self.tdLinkedAccountscolumnData = ko.observableArray([{
        headerText: self.resource.labels.accountNo,
        field: "accountId"
      }, {
        headerText: self.resource.labels.partyName,
        field: "partyName"
      },
      {
        headerText: self.resource.labels.action,
        renderer: oj.KnockoutTemplateUtils.getRenderer("delete_template", true),
        style: "width:1%; text-align:center"
      }
    ]);

    /**
     * Self - provides data to be displays on tables.
     *
     * @param  {type} data - Description.
     * @return {type}      Description.
     */
    self.showDetails = function (data) {
      self.accountDetails = [];

      const accountNumber = self.selectedAccount();

      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (accountNumber !== data[i].id.value) {
            self.accountDetails.push({
              accountId: data[i].id.displayValue,
              partyName: data[i].partyName,
              balance: data[i].availableBalance,
              maturityDate: data[i].maturityDate,
              flag: data[i].isAccountNewflag,
              isSelected: data[i].isSelected
            });
          }
        }
      }

      return self.accountDetails;
    };

    /**
     * Self - dispalys the account data.
     *
     * @param  {type} accountNumber - Description.
     * @return {type}               Description.
     */
    self.fetchDetails = function (accountNumber) {
      /**
       * accountNumber - provides data about specified account
       *
       * @param  {type} function(data description
       * @return {type}               description
       */
      sweepInInstructionModel.fetchDDA().then(function (data) {
        for (let i = 0; i < data.accounts.length; i++) {
          if (data.accounts[i].id.value === accountNumber) {
            self.detailViewResponse(data.accounts[i]);
            break;
          }
        }
      });

      if (self.accountType() === "casa") {
        self.displayDDASweepinInstructionslist(accountNumber);
      } else {
        self.displayTDASweepinInstructionslist(accountNumber);
      }
    };

    /**
     * Self - provides account data to be display.
     *
     * @param  {type} accountNumber - Description.
     * @return {type}               Description.
     */
    self.displayDDASweepinInstructionslist = function (accountNumber) {
      sweepInInstructionModel.fetchSweepInInstructionslist(accountNumber).then(function (data) {
        sweepInInstructionModel.fetchDDA().then(function (accountData) {
          self.noAccountsMessage(self.resource.noAccountsMessage.noCasaAccountAvailable);

          self.msgNoData({
            msgNoData: self.noAccountsMessage()
          });

          self.accounts = [];
          self.sweepInInstructionsAccountslist([]);
          self.sweepInInstructionslist(data.sweepInInstructions);

          if (accountData.accounts && accountData.accounts.length > 1) {
            for (let i = 0; i < accountData.accounts.length; i++) {
              if (data.sweepInInstructions && data.sweepInInstructions.length > 0) {
                for (let j = 0; j < data.sweepInInstructions.length; j++) {
                  if (accountData.accounts[i].id.value === data.sweepInInstructions[j].providerAccountId.value) {
                    self.accounts.push(accountData.accounts[i]);
                    break;
                  }
                }
              }
            }
          } else {
            rootParams.baseModel.showMessages(null, [self.resource.errorMessage.noCasaAccountAvailable], "ERROR");
          }

          self.sweepInInstructionsAccountslist(self.accounts);
          self.selectColumnData();

          self.linkedaccountsDataprovider = new oj.ArrayTableDataSource(self.showDetails(self.sweepInInstructionsAccountslist()), {
            idAttribute: ["accountId"] || []
          });

          self.linkedaccountsPagingDataprovider(new oj.PagingTableDataSource(self.linkedaccountsDataprovider));
          self.linkedaccountsDataproviderLoaded(true);
        });
      });
    };

    /**
     * Self - provides account data to be display.
     *
     * @param  {type} accountNumber - Description.
     * @return {type}               Description.
     */
    self.displayTDASweepinInstructionslist = function (accountNumber) {
      sweepInInstructionModel.fetchSweepInInstructionslist(accountNumber).then(function (data) {
        sweepInInstructionModel.fetchTDA().then(function (accountData) {
          self.noAccountsMessage(self.resource.noAccountsMessage.noTdAccountAvailable);

          self.msgNoData({
            msgNoData: self.noAccountsMessage()
          });

          self.accounts = [];
          self.sweepInInstructionsAccountslist([]);
          self.sweepInInstructionslist(data.sweepInInstructions);

          if (accountData.accounts && accountData.accounts.length > 0) {
            for (let i = 0; i < accountData.accounts.length; i++) {
              if (data.sweepInInstructions && data.sweepInInstructions.length > 0) {
                for (let j = 0; j < data.sweepInInstructions.length; j++) {
                  if (accountData.accounts[i].id.value === data.sweepInInstructions[j].providerAccountId.value) {
                    self.accounts.push(accountData.accounts[i]);
                    break;
                  }
                }
              }
            }
          } else {
            rootParams.baseModel.showMessages(null, [self.resource.errorMessage.noTdAccountAvailable], "ERROR");
          }

          self.sweepInInstructionsAccountslist(self.accounts);
          self.selectColumnData();

          self.linkedaccountsDataprovider = new oj.ArrayTableDataSource(self.showDetails(self.sweepInInstructionsAccountslist()), {
            idAttribute: ["accountId"] || []
          });

          self.linkedaccountsPagingDataprovider(new oj.PagingTableDataSource(self.linkedaccountsDataprovider));
          self.linkedaccountsDataproviderLoaded(true);
        });
      });
    };

    /**
     * Self - description.
     *
     * @param  {type} accountNumber - Description.
     * @return {type}               Description.
     */
    self.displayTDAProviderAccountlist = function (accountNumber) {
      sweepInInstructionModel.fetchSweepInInstructionslist(accountNumber).then(function (data) {
        sweepInInstructionModel.fetchTDA().then(function (accountData) {
          self.accounts = [];
          self.sweepInInstructionslist(data.sweepInInstructions);

          if (accountData.accounts && accountData.accounts.length > 0) {
            for (let i = 0; i < accountData.accounts.length; i++) {
              let flag = true;

              if (data.sweepInInstructions && data.sweepInInstructions.length > 0) {
                for (let j = 0; j < data.sweepInInstructions.length; j++) {
                  if (accountData.accounts[i].id.value === data.sweepInInstructions[j].providerAccountId.value) {
                    flag = false;
                    break;
                  }
                }
              }

              if (accountData.accounts[i].id.value === self.selectedAccount()) {
                flag = false;
              }

              if (flag) {
                self.accounts.push(accountData.accounts[i]);
              }
            }
          }

          self.providerAccountslist(self.accounts);

          if (self.providerAccountslist().length > 0) {
            for (let i = 0; i < self.providerAccountslist().length; i++) {
              self.providerAccountslist()[i].isSelected = ko.observableArray();
            }

            self.selectColumnData();

            self.providerAccountsDataSource = new oj.ArrayTableDataSource(self.showDetails(self.providerAccountslist()), {
              idAttribute: ["accountId"] || []
            });

            self.providerAccountsPagingDataSource(new oj.PagingTableDataSource(self.providerAccountsDataSource));
            self.providerAccountsDataSourceLoaded(true);
            self.addAccountDataLoaded(true);
            self.showButton(false);
          } else {
            rootParams.baseModel.showMessages(null, [self.resource.errorMessage.AllAccountsLinked], "ERROR");
          }
        });
      });
    };

    /**
     * Self - provides account data to be display.
     *
     * @param  {type} accountNumber - Description.
     * @return {type}               Description.
     */
    self.displayDDAProviderAccountlist = function (accountNumber) {
      sweepInInstructionModel.fetchSweepInInstructionslist(accountNumber).then(function (data) {
        sweepInInstructionModel.fetchDDA().then(function (accountData) {
          self.accounts = [];
          self.sweepInInstructionslist(data.sweepInInstructions);

          if (accountData.accounts && accountData.accounts.length > 0) {
            for (let i = 0; i < accountData.accounts.length; i++) {
              let flag = true;

              if (data.sweepInInstructions && data.sweepInInstructions.length > 0) {
                for (let j = 0; j < data.sweepInInstructions.length; j++) {
                  if (accountData.accounts[i].id.value === data.sweepInInstructions[j].providerAccountId.value) {
                    flag = false;
                    break;
                  }
                }
              }

              if (accountData.accounts[i].id.value === self.selectedAccount()) {
                flag = false;
              }

              if (flag) {
                self.accounts.push(accountData.accounts[i]);
              }
            }
          }

          self.providerAccountslist(self.accounts);

          if (self.providerAccountslist().length > 0) {
            for (let i = 0; i < self.providerAccountslist().length; i++) {
              self.providerAccountslist()[i].isSelected = ko.observableArray();
            }

            self.selectColumnData();

            self.providerAccountsDataSource = new oj.ArrayTableDataSource(self.showDetails(self.providerAccountslist()), {
              idAttribute: ["accountId"] || []
            });

            self.providerAccountsPagingDataSource(new oj.PagingTableDataSource(self.providerAccountsDataSource));
            self.providerAccountsDataSourceLoaded(true);
            self.addAccountDataLoaded(true);
            self.showButton(false);
          } else {
            rootParams.baseModel.showMessages(null, [self.resource.errorMessage.AllAccountsLinked], "ERROR");
          }
        });
      });
    };

    /**
     *if account is selected then it fetches detail data and dispalys it.
     */
    if (self.selectedAccount()) {
      self.detailDataFetched(true);
      self.fetchDetails(self.selectedAccount());
    }

    /**
     * Self - shows modal window for confirmation for accounts to delink.
     *
     * @param  {type} data - Description.
     * @return {type}      Description.
     */
    self.reviewDeleteAccount = function (data) {
      $("#deleteConfirmation").trigger("openModal");
      self.deleteIndex(data);
    };

    /**
     * Self - description.
     *
     * @param  {type} data - Description.
     * @return {type}      Description.
     */
    self.closeDeleteAccountModalWindow = function () {
      $("#deleteConfirmation").trigger("closeModal");
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.deleteAccount = function () {
      self.currentTask("CH_N_SWIN_D");
      $("#deleteConfirmation").trigger("closeModal");

      const id = self.sweepInInstructionsAccountslist()[self.deleteIndex()].id.value;

      if (self.sweepInInstructionslist && self.sweepInInstructionslist().length > 0) {
        for (let i = 0; i < self.sweepInInstructionslist().length; i++) {
          if (self.sweepInInstructionslist()[i].providerAccountId.value === id) {
            sweepInInstructionModel.deleteSweepInInstructions(self.selectedAccount(), self.sweepInInstructionslist()[i].instructionNumber).then(function (data) {

              rootParams.dashboard.loadComponent("confirm-screen", {
                transactionResponse: data,
                transactionName: self.transactionName(),
                confirmScreenExtensions: {
                  isSet: true,
                  taskCode: self.currentTask(),
                  template: "confirm-screen/sweep-in",
                  hostReferenceNumber: data.externalReferenceId
                }
              }, self);
            });

            break;
          }
        }
      }
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.accountTypeChangeHandler = function () {
      self.linkedaccountsDataprovider = [];

      const accountNumber = self.selectedAccount();

      if (self.accountType() === "casa") {
        self.providerAccountsDataSourceLoaded(false);
        self.linkedaccountsDataproviderLoaded(false);
        self.selectColumnData();
        self.displayDDASweepinInstructionslist(accountNumber);
        self.addAccountDataLoaded(false);
        self.showButton(true);
      } else {
        self.providerAccountsDataSourceLoaded(false);
        self.linkedaccountsDataproviderLoaded(false);
        self.addAccountDataLoaded(false);
        self.showButton(true);
        self.selectColumnData();
        self.displayTDASweepinInstructionslist(accountNumber);
      }
    };

    /**
     * Self - provides accounts details which needs to be add in sweep in instruction list.
     *
     * @return {type}  Description.
     */
    self.addAccount = function () {
      const accountNumber = self.selectedAccount();

      if (self.accountType() === "casa") {
        self.displayDDAProviderAccountlist(accountNumber);
      } else {
        self.displayTDAProviderAccountlist(accountNumber);
      }
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.hideAccount = function () {
      self.addAccountDataLoaded(false);
      self.showButton(true);
    };

    /**
     * Self - description.
     *
     * @param  {type} event - Description.
     * @return {type}       Description.
     */
    self.selectListener = function (event) {
      if (event.detail) {
        if (event.detail.value.length > 0) {
          const index = event.detail.value[0];

          self.accountsToAdd().push(self.providerAccountslist()[index]);
        } else if (event.detail.previousValue) {
          const previousIndex = event.detail.previousValue[0];

          self.accountsToAdd().pop(self.providerAccountslist()[previousIndex]);
        }
      }
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.saveInstructions = function () {
      self.accountsAddedSweepInlist = [];

      let isNewAccountAdded = false;

      if (self.providerAccountslist && self.providerAccountslist().length > 0) {
        for (let i = 0; i < self.providerAccountslist().length; i++) {
          if (self.providerAccountslist()[i].isSelected().length > 0) {
            self.providerAccountslist()[i].isAccountNewflag = self.resource.labels.new;
            self.accountsAddedSweepInlist.push(self.providerAccountslist()[i]);
            isNewAccountAdded = true;
          }
        }
      }

      if (!isNewAccountAdded) {
        rootParams.baseModel.showMessages(null, [self.resource.errorMessage.selectAtLeastOneAccount], "ERROR");

        return;
      }

      if (self.sweepInInstructionsAccountslist && self.sweepInInstructionsAccountslist().length > 0) {
        for (let j = 0; j < self.sweepInInstructionsAccountslist().length; j++) {
          self.accountsAddedSweepInlist.push(self.sweepInInstructionsAccountslist()[j]);
        }
      }

      self.radioSetDisabled(true);
      self.showConfirmScreenButton(true);
      self.showConfirmScreen(true);

      rootParams.dashboard.loadComponent("review-sweep-in-instruction", {
        mode: "review",
        selectedAccount :self.selectedAccount,
        confirmScreenExtensions: confirmScreenExtensions,
        accountType: self.accountType,
        providerAccountsDataSource: self.providerAccountsDataSource,
        providerAccountsDataSourceLoaded: self.providerAccountsDataSourceLoaded,
        addAccountDataLoaded: self.addAccountDataLoaded,
        providerAccountslist: self.providerAccountslist,
        showConfirmScreenButton: self.showConfirmScreenButton,
        showButton: self.showButton,
        providerAccountsPagingDataSource: self.providerAccountsPagingDataSource,
        linkedaccountsPagingDataprovider: self.linkedaccountsPagingDataprovider,
        sweepInInstructionslist: self.sweepInInstructionslist,
        accountsAddedSweepInlist: self.accountsAddedSweepInlist,
        viewSweepInInstructionStatus :self.viewSweepInInstructionStatus
      });
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.viewSweepInInstructionStatus = function (data) {
      rootParams.dashboard.loadComponent("multiple-sweep-in-instruction-status", {
        selectedAccount: self.selectedAccount,
        accountsToAdd: self.accountsToAdd,
        multipleSweepInInstructionStatusData: data.confirmScreenExtensions.multipleSweepInInstructionStatusData,
        showFailureReason: self.showFailureReason
      }, self);
    };
  };
});