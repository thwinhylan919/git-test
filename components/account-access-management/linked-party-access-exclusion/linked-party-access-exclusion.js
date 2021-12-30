define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/access-management",
  "ojs/ojinputtext",
  "ojs/ojpopup",
  "ojs/ojradioset",
  "ojs/ojselectcombobox"
], function (ko, $, ExclusionModel, resourceBundle) {
  "use strict";

  return function viewModel(rootParams) {
    const self = this,
      inputParams = rootParams.rootModel.params;

    inputParams.createObservables(inputParams,
      ["accountAccessSummaryObject", "transactionNames",
        "casaRequestPayload", "tdRequestPayload",
        "loanRequestPayload", "ExclusionModelInstance"
      ]);

    inputParams.ExclusionModelInstance = ko.mapping.fromJS(inputParams.ExclusionModelInstance);
    ko.utils.extend(self, inputParams);
    self.nls = resourceBundle;
    self.party = self.ExclusionModelInstance.partyDetails.party;

    if (self.isTDAllowed() === undefined) {
      self.isTDAllowed(false);
    } else {
      self.isTDAllowed(self.isTDAllowed());
    }

    if (self.isCasaAllowed() === undefined) {
      self.isCasaAllowed(false);
    } else {
      self.isCasaAllowed(self.isCasaAllowed());
    }

    if (self.isLoanAllowed() === undefined) {
      self.isLoanAllowed(false);
    } else {
      self.isLoanAllowed(self.isLoanAllowed());
    }

    self.refreshed = ko.observable(false);
    self.showConfirmation = ko.observable(false);
    self.showConfirmationForCreate = ko.observable(false);
    self.httpStatus = ko.observable();
    self.transactionStatus = ko.observable();
    self.finalPayLoadArray = ko.observableArray();

    self.finalPayload = {
      linkedPartyAccountAccessDTOs: ""
    };

    self.transactionName(self.nls.headers.partyAcctSetupTransactionName);

    const getNewKoModel = function () {
      const KoModel = ExclusionModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.rootModelInstance = getNewKoModel();
    self.partyID = ko.observable(self.partyID());
    self.relatedPartyId = ko.observable(self.linkedPartyId());
    self.relatedPartyName = ko.observable(self.linkedpartyName());
    self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
    self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
    self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
    self.casaPayloadExclusionList = ko.observable([]);

    self.getCasaPayload = function () {
      self.casaPayloadExclusionList([]);
      self.casaExclusionAccountNumberList([]);
      self.casaRequestPayload.accountExclusionDTOs = [];

      self.casaRequestPayload.partyId = {
        value: self.party.value(),
        displayValue: self.party.displayValue()
      };

      self.casaRequestPayload.linkedPartyId = {
        value: self.relatedPartyId().value,
        displayValue: self.relatedPartyId().displayValue
      };

      self.casaRequestPayload.accountType = "CSA";
      self.casaRequestPayload.accessLevel = self.accessLevel();
      self.casaRequestPayload.accessStatus = self.isCasaAllowed();
      self.casaRequestPayload.userId = self.selectedUserId();

      if (self.isAccessCreated()) {
        self.casaRequestPayload.accountAccessId = self.casaAccountAccessId();
      } else {
        delete self.casaRequestPayload.accountAccessId;
      }

      let exclusionObject;

      for (let y = 0; y < self.selectedAccountsResources().length; y++) {
        exclusionObject = self.selectedAccountsResources()[y];

        if (exclusionObject.accountType === "CSA") {
          if (self.isCasaAllowed() === true) {
            if (exclusionObject.nonSelectedTask && exclusionObject.nonSelectedTask.length > 0) {
              self.casaExclusionAccountNumberList().push(exclusionObject);
            }
          } else {
            self.casaExclusionAccountNumberList().push(exclusionObject);
          }
        }
      }

      self.nonSelectedCasaAccounts = ko.observable([]);

      if (self.isCasaAllowed() === true) {
        ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
          if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
            self.nonSelectedCasaAccounts().push(item.accountNumber.value);
          }
        });

        ko.utils.arrayForEach(self.casaExclusionAccountNumberList(), function (item) {
          self.newExclusionArray = {
            accountNumber: {
              displayValue: "",
              value: ""
            },
            taskIds: []
          };

          self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
          self.newExclusionArray.accountNumber.value = item.accountNumber.value;
          self.newExclusionArray.taskIds = item.nonSelectedTask;

          if (!(self.casaPayloadExclusionList().filter(function (e) {
              return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
            }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
            self.casaPayloadExclusionList().push(self.newExclusionArray);
          }
        });

        ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
          if (self.nonSelectedCasaAccounts().length > 0 && self.nonSelectedCasaAccounts().indexOf(item.accountNumber.value) !== -1) {
            for (let a = 0; a < self.nonSelectedCasaAccounts().length; a++) {
              self.newExclusionArray = {
                accountNumber: {
                  displayValue: "",
                  value: ""
                },
                taskIds: []
              };

              self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
              self.newExclusionArray.accountNumber.value = item.accountNumber.value;
              self.newExclusionArray.taskIds = item.fullResourceTaskList;

              if (!(self.casaPayloadExclusionList().filter(function (e) {
                  return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                self.casaPayloadExclusionList().push(self.newExclusionArray);
              }
            }
          }
        });
      } else {
        ko.utils.arrayForEach(self.casaExclusionAccountNumberList(), function (item) {
          self.newExclusionArray = {
            accountNumber: {
              displayValue: "",
              value: ""
            },
            taskIds: []
          };

          if (self.selectedCasaAccounts().length > 0 && self.selectedCasaAccounts().indexOf(item.accountNumber.value) !== -1) {
            self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
            self.newExclusionArray.accountNumber.value = item.accountNumber.value;
            self.newExclusionArray.taskIds = item.selectedTask;

            if (!(self.casaPayloadExclusionList().filter(function (e) {
                return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
              }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.taskIds && self.newExclusionArray.taskIds.length > 0 && self.newExclusionArray.accountNumber.value.length > 0) {
              self.casaPayloadExclusionList().push(self.newExclusionArray);
            }
          }
        });
      }

      if (self.updatedCASAExclusionNumberList().length > 0) {
        ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function (item) {
          for (let i = 0; i < self.casaPayloadExclusionList().length; i++) {
            if (self.casaPayloadExclusionList()[i].accountNumber.value === item.accountNumber.value) {
              self.casaPayloadExclusionList()[i].accountExclusionId = item.accountExclusionId;
            }
          }
        });
      }

      for (let j = 0; j < self.casaPayloadExclusionList().length; j++) {
        self.casaRequestPayload.accountExclusionDTOs.push({
          accountNumber: self.casaPayloadExclusionList()[j].accountNumber,
          accountExclusionId: self.casaPayloadExclusionList()[j].accountExclusionId,
          taskIds: self.casaPayloadExclusionList()[j].taskIds
        });
      }

      if (self.isBatchEnable()) {
        const payload = ko.mapping.toJSON(self.casaRequestPayload);

        return payload;
      }

      return self.casaRequestPayload;
    };

    self.tdPayloadExclusionList = ko.observable([]);

    self.getTDPayload = function () {
      self.tdExclusionAccountNumberList([]);
      self.tdPayloadExclusionList([]);
      self.tdRequestPayload.accountExclusionDTOs = [];

      self.tdRequestPayload.partyId = {
        value: self.party.value(),
        displayValue: self.party.displayValue()
      };

      self.tdRequestPayload.linkedPartyId = {
        value: self.relatedPartyId().value,
        displayValue: self.relatedPartyId().displayValue
      };

      self.tdRequestPayload.accountType = "TRD";
      self.tdRequestPayload.accessLevel = self.accessLevel();
      self.tdRequestPayload.accessStatus = self.isTDAllowed();
      self.tdRequestPayload.userId = self.selectedUserId();

      if (self.isAccessCreated()) {
        self.tdRequestPayload.accountAccessId = self.tdAccountAccessId();
      } else {
        delete self.tdRequestPayload.accountAccessId;
      }

      let exclusionObject;

      for (let y = 0; y < self.selectedAccountsResources().length; y++) {
        exclusionObject = self.selectedAccountsResources()[y];

        if (exclusionObject.accountType === "TRD") {
          if (self.isTDAllowed() === true) {
            if (exclusionObject.nonSelectedTask && exclusionObject.nonSelectedTask.length > 0) {
              self.tdExclusionAccountNumberList().push(exclusionObject);
            }
          } else {
            self.tdExclusionAccountNumberList().push(exclusionObject);
          }
        }
      }

      self.nonSelectedTdAccounts = ko.observable([]);

      if (self.isTDAllowed() === true) {
        ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
          if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
            self.nonSelectedTdAccounts().push(item.accountNumber.value);
          }
        });

        ko.utils.arrayForEach(self.tdExclusionAccountNumberList(), function (item) {
          self.newExclusionArray = {
            accountNumber: {
              displayValue: "",
              value: ""
            },
            taskIds: []
          };

          self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
          self.newExclusionArray.accountNumber.value = item.accountNumber.value;
          self.newExclusionArray.taskIds = item.nonSelectedTask;

          if (!(self.tdPayloadExclusionList().filter(function (e) {
              return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
            }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
            self.tdPayloadExclusionList().push(self.newExclusionArray);
          }
        });

        ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
          if (self.nonSelectedTdAccounts().length > 0 && self.nonSelectedTdAccounts().indexOf(item.accountNumber.value) !== -1) {
            for (let a = 0; a < self.nonSelectedTdAccounts().length; a++) {
              self.newExclusionArray = {
                accountNumber: {
                  displayValue: "",
                  value: ""
                },
                taskIds: []
              };

              self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
              self.newExclusionArray.accountNumber.value = item.accountNumber.value;
              self.newExclusionArray.taskIds = item.fullResourceTaskList;

              if (!(self.tdPayloadExclusionList().filter(function (e) {
                  return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.taskIds && self.newExclusionArray.taskIds.length > 0 && self.newExclusionArray.accountNumber.value.length > 0) {
                self.tdPayloadExclusionList().push(self.newExclusionArray);
              }
            }
          }
        });
      } else {
        ko.utils.arrayForEach(self.tdExclusionAccountNumberList(), function (item) {
          self.newExclusionArray = {
            accountNumber: {
              displayValue: "",
              value: ""
            },
            taskIds: []
          };

          if (self.selectedTdAccounts().length > 0) {
            if (self.selectedTdAccounts().indexOf(item.accountNumber.value) !== -1) {
              self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
              self.newExclusionArray.accountNumber.value = item.accountNumber.value;
              self.newExclusionArray.taskIds = item.selectedTask;
            }

            if (!(self.tdPayloadExclusionList().filter(function (e) {
                return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
              }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.taskIds && self.newExclusionArray.taskIds.length > 0 && self.newExclusionArray.accountNumber.value.length > 0) {
              self.tdPayloadExclusionList().push(self.newExclusionArray);
            }
          }
        });
      }

      if (self.updatedTDExclusionNumberList().length > 0) {
        ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function (item) {
          for (let i = 0; i < self.tdPayloadExclusionList().length; i++) {
            if (self.tdPayloadExclusionList()[i].accountNumber.value === item.accountNumber.value) {
              self.tdPayloadExclusionList()[i].accountExclusionId = item.accountExclusionId;
            }
          }
        });
      }

      for (let j = 0; j < self.tdPayloadExclusionList().length; j++) {
        self.tdRequestPayload.accountExclusionDTOs.push({
          accountNumber: self.tdPayloadExclusionList()[j].accountNumber,
          accountExclusionId: self.tdPayloadExclusionList()[j].accountExclusionId,
          taskIds: self.tdPayloadExclusionList()[j].taskIds
        });
      }

      if (self.isBatchEnable()) {
        const payload = ko.mapping.toJSON(self.tdRequestPayload);

        return payload;
      }

      return self.tdRequestPayload;
    };

    self.loanPayloadExclusionList = ko.observable([]);

    self.getLoanPayload = function () {
      self.loanPayloadExclusionList([]);
      self.loanExclusionAccountNumberList([]);
      self.loanRequestPayload.accountExclusionDTOs = [];

      self.loanRequestPayload.partyId = {
        value: self.party.value(),
        displayValue: self.party.displayValue()
      };

      self.loanRequestPayload.linkedPartyId = {
        value: self.relatedPartyId().value,
        displayValue: self.relatedPartyId().displayValue
      };

      self.loanRequestPayload.accountType = "LON";
      self.loanRequestPayload.accessLevel = self.accessLevel();
      self.loanRequestPayload.accessStatus = self.isLoanAllowed();
      self.loanRequestPayload.userId = self.selectedUserId();

      if (self.isAccessCreated()) {
        self.loanRequestPayload.accountAccessId = self.loanAccountAccessId();
      } else {
        delete self.loanRequestPayload.accountAccessId;
      }

      let exclusionObject;

      for (let y = 0; y < self.selectedAccountsResources().length; y++) {
        exclusionObject = self.selectedAccountsResources()[y];

        if (exclusionObject.accountType === "LON") {
          if (self.isLoanAllowed() === true) {
            if (exclusionObject.nonSelectedTask && exclusionObject.nonSelectedTask.length > 0) {
              self.loanExclusionAccountNumberList().push(exclusionObject);
            }
          } else {
            self.loanExclusionAccountNumberList().push(exclusionObject);
          }
        }
      }

      self.nonSelectedLoanAccounts = ko.observable([]);

      if (self.isLoanAllowed() === true) {
        ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
          if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
            self.nonSelectedLoanAccounts().push(item.accountNumber.value);
          }
        });

        ko.utils.arrayForEach(self.loanExclusionAccountNumberList(), function (item) {
          self.newExclusionArray = {
            accountNumber: {
              displayValue: "",
              value: ""
            },
            taskIds: []
          };

          self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
          self.newExclusionArray.accountNumber.value = item.accountNumber.value;
          self.newExclusionArray.taskIds = item.nonSelectedTask;

          if (!(self.loanPayloadExclusionList().filter(function (e) {
              return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
            }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
            self.loanPayloadExclusionList().push(self.newExclusionArray);
          }
        });

        ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
          if (self.nonSelectedLoanAccounts().length > 0 && self.nonSelectedLoanAccounts().indexOf(item.accountNumber.value) !== -1) {
            for (let a = 0; a < self.nonSelectedLoanAccounts().length; a++) {
              self.newExclusionArray = {
                accountNumber: {
                  displayValue: "",
                  value: ""
                },
                taskIds: []
              };

              self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
              self.newExclusionArray.accountNumber.value = item.accountNumber.value;
              self.newExclusionArray.taskIds = item.fullResourceTaskList;

              if (!(self.loanPayloadExclusionList().filter(function (e) {
                  return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                self.loanPayloadExclusionList().push(self.newExclusionArray);
              }
            }
          }
        });
      } else {
        ko.utils.arrayForEach(self.loanExclusionAccountNumberList(), function (item) {
          self.newExclusionArray = {
            accountNumber: {
              displayValue: "",
              value: ""
            },
            taskIds: []
          };

          if (self.selectedLoanAccounts().length > 0) {
            if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) !== -1) {
              self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
              self.newExclusionArray.accountNumber.value = item.accountNumber.value;
              self.newExclusionArray.taskIds = item.selectedTask;
            }

            if (!(self.loanPayloadExclusionList().filter(function (e) {
                return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
              }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.taskIds && self.newExclusionArray.taskIds.length > 0 && self.newExclusionArray.accountNumber.value.length > 0) {
              self.loanPayloadExclusionList().push(self.newExclusionArray);
            }
          }
        });
      }

      if (self.updatedLOANExclusionNumberList().length > 0) {
        ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function (item) {
          for (let i = 0; i < self.loanPayloadExclusionList().length; i++) {
            if (self.loanPayloadExclusionList()[i].accountNumber.value === item.accountNumber.value) {
              self.loanPayloadExclusionList()[i].accountExclusionId = item.accountExclusionId;
            }
          }
        });
      }

      for (let j = 0; j < self.loanPayloadExclusionList().length; j++) {
        self.loanRequestPayload.accountExclusionDTOs.push({
          accountNumber: self.loanPayloadExclusionList()[j].accountNumber,
          accountExclusionId: self.loanPayloadExclusionList()[j].accountExclusionId,
          taskIds: self.loanPayloadExclusionList()[j].taskIds
        });
      }

      if (self.isBatchEnable()) {
        const payload = ko.mapping.toJSON(self.loanRequestPayload);

        return payload;
      }

      return self.loanRequestPayload;
    };

    self.createAccess = function (selectedAccountsResources) {
      self.selectedAccountsResources(selectedAccountsResources);

      self.casaExclusionAccountNumberList([]);
      self.tdExclusionAccountNumberList([]);
      self.loanExclusionAccountNumberList([]);
      self.updatedCASAExclusionNumberList([]);
      self.updatedTDExclusionNumberList([]);
      self.updatedLOANExclusionNumberList([]);
      self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
      self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
      self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
      self.finalPayLoadArray.push(self.getCasaPayload());
      self.finalPayLoadArray.push(self.getLoanPayload());
      self.finalPayLoadArray.push(self.getTDPayload());
      self.finalPayload.linkedPartyAccountAccessDTOs = self.finalPayLoadArray();

      ExclusionModel.createAccessClone(ko.toJSON(self.finalPayload), self.party.value(), self.relatedPartyId().value).then(function (data) {
        self.showDeleteButton(true);
        self.isAccessCreated(true);
        self.showEditableForm(true);
        self.transactionStatus(data.status);
        self.showConfirmationForCreate(true);

        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.transactionName()
        });
      });
    };

    self.enableFormToUpdate = function () {
      self.showEditableForm(false);
      self.isAccessCreated(true);
      self.isAccessUpdated(false);
      self.editButtonPressed(true);
    };

    self.updateAccess = function (selectedAccountsResources) {
      self.selectedAccountsResources(selectedAccountsResources);

      self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
      self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
      self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
      self.finalPayLoadArray.push(self.getCasaPayload());
      self.finalPayLoadArray.push(self.getLoanPayload());
      self.finalPayLoadArray.push(self.getTDPayload());
      self.finalPayload.linkedPartyAccountAccessDTOs = self.finalPayLoadArray();

      ExclusionModel.updateAccessClone(ko.toJSON(self.finalPayload), self.party.value(), self.relatedPartyId().value).then(function (data) {
        self.isAccessUpdated(true);
        self.transactionStatus(data);
        self.showConfirmation(true);
        self.readAccess();

        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.transactionName()
        });
      });
    };

    self.LoadTransactionMappingComponent = function () {
      self.disableAccountSelection(true);

      let params = {
        isCorpAdmin: self.isCorpAdmin,
        createObservables: self.createObservables,
        disableAccountSelection: self.disableAccountSelection,
        highlightedTabTrans: self.highlightedTabTrans,
        accessLevel: self.accessLevel,
        selectedCasaAccounts: self.selectedCasaAccounts,
        selectedTdAccounts: self.selectedTdAccounts,
        selectedLoanAccounts: self.selectedLoanAccounts,
        casaTransactionTabVisited: self.casaTransactionTabVisited,
        loanTransactionTabVisited: self.loanTransactionTabVisited,
        tdTransactionTabVisited: self.tdTransactionTabVisited,
        fullCasaAccountList: self.fullCasaAccountList,
        fulltdAccountList: self.fulltdAccountList,
        fullloanAccountList: self.fullloanAccountList,
        showEditableForm: self.showEditableForm,
        isAccessUpdated: self.isAccessUpdated,
        isAccessCreated: self.isAccessCreated,
        partyID: self.partyID,
        partyName: self.partyName,
        selectedUserId: self.selectedUserId,
        selectedUserName: self.selectedUserName,
        enableFormToUpdate: self.enableFormToUpdate,
        editButtonPressed: self.editButtonPressed,
        resourceListCasa: self.resourceListCasa,
        resourceListTD: self.resourceListTD,
        resourceListLON: self.resourceListLON,
        selectedAccountsResources: self.selectedAccountsResources,
        showConfirmationForCreate: self.showConfirmationForCreate,
        parentAccessLevel: self.parentAccessLevel,
        updateAccess: self.updateAccess,
        createAccess: self.createAccess,
        getCasaPayload: self.getCasaPayload,
        getTDPayload: self.getTDPayload,
        getLoanPayload: self.getLoanPayload,
        casaRequestPayload: self.casaRequestPayload,
        tdRequestPayload: self.tdRequestPayload,
        loanRequestPayload: self.loanRequestPayload,
        isBatchEnable: self.isBatchEnable,
        transactionNames: self.transactionNames,
        party: self.party,
        editBackFromReview: self.editBackFromReview,
        selectedCasaPolicy: self.selectedCasaPolicy,
        selectedTdPolicy: self.selectedTdPolicy,
        selectedLoanPolicy: self.selectedLoanPolicy
      };

      params = ko.mapping.toJS(Object.assign(params, {
        relatedPartyId: self.relatedPartyId,
        relatedPartyName: self.relatedPartyName,
        linkedPartyId: self.linkedPartyId,
        linkedpartyName: self.linkedpartyName
      }));

      rootParams.dashboard.loadComponent("account-transactions-mapping", params);
    };

    self.readAccess = function () {
      self.casaExclusionAccountNumberList([]);
      self.tdExclusionAccountNumberList([]);
      self.loanExclusionAccountNumberList([]);
      self.updatedCASAExclusionNumberList([]);
      self.updatedTDExclusionNumberList([]);
      self.updatedLOANExclusionNumberList([]);

      ExclusionModel.readAccess(self.party.value(), self.relatedPartyId().value).done(function (data) {
        self.showModuleToMap(true);

        if (data.linkedPartyAccountAccessDTOs !== undefined) {
          for (let i = 0; i < data.linkedPartyAccountAccessDTOs.length; i++) {
            if (data.linkedPartyAccountAccessDTOs[i].accountType === "CSA") {
              self.isCasaAllowed(data.linkedPartyAccountAccessDTOs[i].accessStatus);
              self.casaAccountAccessId(data.linkedPartyAccountAccessDTOs[i].accountAccessId);
              self.updatedCASAExclusionNumberList(data.linkedPartyAccountAccessDTOs[i].accountExclusionDTOs);

              ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function (item) {
                self.casaAccountNumbersArray().push(item.accountNumber.value);
              });

              if (self.isCasaAllowed()) {
                ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                  if (self.casaAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < self.updatedCASAExclusionNumberList().length; i++) {
                      if (self.updatedCASAExclusionNumberList()[i].accountNumber.value === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedCASAExclusionNumberList()[i].taskIds.length) {
                        self.selectedCasaAccounts.push(item.accountNumber.value);
                      }
                    }
                  } else {
                    self.selectedCasaAccounts.push(item.accountNumber.value);
                  }
                });
              } else {
                ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function (item) {
                  self.selectedCasaAccounts.push(item.accountNumber.value);
                });
              }
            } else if (data.linkedPartyAccountAccessDTOs[i].accountType === "TRD") {
              self.isTDAllowed(data.linkedPartyAccountAccessDTOs[i].accessStatus);
              self.tdAccountAccessId(data.linkedPartyAccountAccessDTOs[i].accountAccessId);
              self.updatedTDExclusionNumberList(data.linkedPartyAccountAccessDTOs[i].accountExclusionDTOs);

              ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function (item) {
                self.tdAccountNumbersArray().push(item.accountNumber.value);
              });

              if (self.isTDAllowed()) {
                ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                  if (self.tdAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < self.updatedTDExclusionNumberList().length; i++) {
                      if (self.updatedTDExclusionNumberList()[i].accountNumber.value === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedTDExclusionNumberList()[i].taskIds.length) {
                        self.selectedTdAccounts.push(item.accountNumber.value);
                      }
                    }
                  } else {
                    self.selectedTdAccounts.push(item.accountNumber.value);
                  }
                });
              } else {
                ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function (item) {
                  self.selectedTdAccounts.push(item.accountNumber.value);
                });
              }
            } else if (data.linkedPartyAccountAccessDTOs[i].accountType === "LON") {
              self.isLoanAllowed(data.linkedPartyAccountAccessDTOs[i].accessStatus);
              self.loanAccountAccessId(data.linkedPartyAccountAccessDTOs[i].accountAccessId);
              self.updatedLOANExclusionNumberList(data.linkedPartyAccountAccessDTOs[i].accountExclusionDTOs);

              ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function (item) {
                self.loanAccountNumbersArray().push(item.accountNumber.value);
              });

              if (self.isLoanAllowed()) {
                ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                  if (self.loanAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < self.updatedLOANExclusionNumberList().length; i++) {
                      if (self.updatedLOANExclusionNumberList()[i].accountNumber.value === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedLOANExclusionNumberList()[i].taskIds.length) {
                        self.selectedLoanAccounts.push(item.accountNumber.value);
                      }
                    }
                  } else {
                    self.selectedLoanAccounts.push(item.accountNumber.value);
                  }
                });
              } else {
                ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function (item) {
                  self.selectedLoanAccounts.push(item.accountNumber.value);
                });
              }
            }
          }

          self.showDeleteButton(true);
          self.isAccessCreated(true);
        } else {
          self.showDeleteButton(false);
          self.isAccessCreated(false);
        }

        self.refreshed(false);
        self.refreshed(true);
      });
    };

    self.deleteAccess = function () {
      self.casaExclusionAccountNumberList([]);
      self.tdExclusionAccountNumberList([]);
      self.loanExclusionAccountNumberList([]);
      self.updatedCASAExclusionNumberList([]);
      self.updatedTDExclusionNumberList([]);
      self.updatedLOANExclusionNumberList([]);
      $("#deleteConfirmationModal").hide();
      self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
      self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
      self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
      self.finalPayLoadArray.push(self.getCasaPayload());
      self.finalPayLoadArray.push(self.getLoanPayload());
      self.finalPayLoadArray.push(self.getTDPayload());
      self.finalPayload.linkedPartyAccountAccessDTOs = self.finalPayLoadArray();

      ExclusionModel.deleteAccess(ko.toJSON(self.finalPayload), self.party.value(), self.relatedPartyId().value).then(function (data) {
        self.showDeleteButton(true);
        self.transactionStatus(data);
        self.showConfirmationForCreate(true);

        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.transactionName()
        });
      });
    };

    self.showSavedData = function () {
      self.selectedCasaAccounts(self.selectedCasaAccounts());
      self.selectedTdAccounts(self.selectedTdAccounts());
      self.selectedLoanAccounts(self.selectedLoanAccounts());
      self.isAccessCreated(true);
      self.refreshed(false);
      self.refreshed(true);
    };

    if (self.isAccessCreated() === true) {
      if (self.editBackFromReview()) {
        self.showSavedData();
      } else {
        self.readAccess();
      }
    }

    const isCasaAllowedSubscription = self.isCasaAllowed.subscribe(function (newValue) {
      if (newValue === true) {
        self.selectedCasaPolicy("casaAuto");
        self.selectedCasaPolicyChecked(["casaAuto"]);
      } else {
        self.selectedCasaPolicy("casaManual");
        self.selectedCasaPolicyChecked(["casaManual"]);
      }
    });

    self.isTDAllowed.subscribe(function (newValue) {
      if (newValue === true) {
        self.selectedTdPolicy("tdAuto");
        self.selectedTdPolicyChecked(["tdAuto"]);
      } else {
        self.selectedTdPolicy("tdManual");
        self.selectedTdPolicyChecked(["tdManual"]);
      }
    });

    self.isLoanAllowed.subscribe(function (newValue) {
      if (newValue === true) {
        self.selectedLoanPolicy("loanAuto");
        self.selectedLoanPolicyChecked(["loanAuto"]);
      } else {
        self.selectedLoanPolicy("loanManual");
        self.selectedLoanPolicyChecked(["loanManual"]);
      }
    });

    self.backOnEdit = function () {
      self.selectedCasaAccounts([]);
      self.selectedTdAccounts([]);
      self.selectedLoanAccounts([]);
      self.readAccess();
      self.showEditableForm(true);
      self.editButtonPressed(false);
    };

    self.dispose = function () {
      isCasaAllowedSubscription.dispose();
    };
  };
});