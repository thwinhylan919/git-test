/**
 * Create sweep in instruction lists all the accounts that have been linked to a particular account.
 * Also it gives option to link additional accounts to the beneficiary account.
 *
 * @module sweep-in-instruction
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/sweep-in-instruction",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview"
  ],
  function (oj, ko, sweepInInstructionModel, ResourceBundle) {
    "use strict";

    return function (rootParams) {
      const self = this;

      self.resource = ResourceBundle;
      ko.utils.extend(self, rootParams.rootModel);
      rootParams.dashboard.headerName(ResourceBundle.title);
      self.reviewTransactionName = [];
      self.reviewTransactionName.header = self.resource.labels.review;
      self.reviewTransactionName.reviewHeader = self.resource.labels.reviewHeader;
      self.linkedaccountsDataproviderLoaded = ko.observable(false);
      self.showMultipleStatusLink = ko.observable(false);
      self.accountsToAdd = ko.observable([]);
      self.currentTask = ko.observable();
      self.multipleSweepInInstructionStatusData = ko.observableArray([]);
      self.showFailureReason = ko.observable(false);
      self.transactionName = ko.observable(self.resource.title);

      const batchRequest = {
        batchDetailRequestList: []
      };

      self.selectColumnData = function () {
        if (self.params.accountType() === "casa") {
          self.linkedAccountscolumnData = self.casaConfirmScreenAccountscolumnData();
        } else {
          self.linkedAccountscolumnData = self.tdConfirmScreenAccountscolumnData();
        }
      };

      self.casaConfirmScreenAccountscolumnData = ko.observableArray([{
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
        }, {
          renderer: oj.KnockoutTemplateUtils.getRenderer("new_account", true)
        }
      ]);

      self.tdConfirmScreenAccountscolumnData = ko.observableArray([{
        headerText: self.resource.labels.accountNo,
        field: "accountId"
      }, {
        headerText: self.resource.labels.partyName,
        field: "partyName",
        style: "width:30%"
      }, {
        renderer: oj.KnockoutTemplateUtils.getRenderer("new_account", true),
        style: "width:1%"
      }]);

      self.selectColumnData();

      /**
       * Self - provides data to be displays on tables.
       *
       * @param  {type} data - Description.
       * @return {type}      Description.
       */
      self.showDetails = function (data) {
        self.accountDetails = [];

        const accountNumber = self.selectedAccount;

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

      self.linkedaccountsDataprovider = new oj.ArrayTableDataSource(self.showDetails(self.params.accountsAddedSweepInlist), {
        idAttribute: ["accountId"] || []
      });

      self.linkedaccountsPagingDataprovider = ko.observableArray([]);
      self.linkedaccountsPagingDataprovider(new oj.PagingTableDataSource(self.linkedaccountsDataprovider));
      self.linkedaccountsDataproviderLoaded(true);

      /**
       * Self - description.
       *
       * @return {type}  Description.
       */
      self.confirmInstructions = function () {
        self.payload = [];
        self.showMultipleStatusLink(true);

        if (self.params.providerAccountslist && self.params.providerAccountslist().length > 0) {
          self.accountsToAdd([]);
          batchRequest.batchDetailRequestList = [];

          for (let j = 0; j < self.params.providerAccountslist().length; j++) {
            if (self.params.providerAccountslist()[j].isSelected().length > 0) {
              self.accountsToAdd().push(self.params.providerAccountslist()[j]);

              batchRequest.batchDetailRequestList.push({
                methodType: "POST",
                uri: {
                  value: "/accounts/demandDeposit/{accountNumber}/sweepInInstructions",
                  params: {
                    accountNumber: rootParams.rootModel.params.selectedAccount()
                  }
                },
                payload: JSON.stringify({
                  providerAccountId: {
                    value: self.params.providerAccountslist()[j].id.value
                  },
                  providerAccountType: self.params.providerAccountslist()[j].type
                }),
                headers: {
                  "Content-Id": j + 1,
                  "Content-Type": "application/json"
                }
              });
            }
          }

          sweepInInstructionModel.confirmSweepInInstructions(batchRequest, "MSI").then(function (data) {
            self.currentTask("CH_N_SWIN_C");

            let failedTxnSeqId;

            if (data && data.batchDetailResponseDTOList.length > 0) {
              for (let i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                const result = JSON.parse(data.batchDetailResponseDTOList[i].responseText);

                if (result) {
                  const instructionDetails = {
                    accountId: self.accountsToAdd()[i].id.displayValue,
                    partyName: self.accountsToAdd()[i].partyName,
                    status: result.externalReferenceId ? self.resource.labels.completed : self.resource.labels.failed,
                    hostRefNo: result.externalReferenceId
                  };

                  if (JSON.parse(data.batchDetailResponseDTOList[i].status) !== 201) {
                    self.showFailureReason(true);
                    instructionDetails.failureReason = result.message.detail;
                    failedTxnSeqId = data.batchDetailResponseDTOList[i].sequenceId;
                  }

                  self.multipleSweepInInstructionStatusData.push(instructionDetails);
                }
              }
            }

            let confirmMessage;

            if (failedTxnSeqId) {
              confirmMessage = self.resource.message.failureMessage;
            } else {
              confirmMessage = self.resource.message.successMessage;
            }

            rootParams.dashboard.loadComponent("confirm-screen", {
              transactionResponse: data,
              transactionName: self.transactionName(),
              showMultipleStatusLink:self.showMultipleStatusLink(),
              viewSweepInInstructionStatus : rootParams.rootModel.params.viewSweepInInstructionStatus,
              confirmScreenExtensions: {
                confirmScreenMsgEval: function (data) {
                  if (failedTxnSeqId && Number(data.sequenceId) === Number(failedTxnSeqId)) {
                    return confirmMessage;
                  } else if (!failedTxnSeqId) {
                    return data.sequenceId === "1" ? confirmMessage : null;
                  }
                },
                showFailureReason: self.showFailureReason,
                multipleSweepInInstructionStatusData: self.multipleSweepInInstructionStatusData,
                isSet: true,
                taskCode: self.currentTask(),
                template: "confirm-screen/sweep-in"
              }
            });
          });
        }
      };
    };
  });