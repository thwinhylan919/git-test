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
        "loanRequestPayload", "ExclusionModelInstance", "lmRequestPayload", "virtualRequestPayload", "vamEnabledRealAccRequestPayload"
      ]);

    inputParams.ExclusionModelInstance = ko.mapping.fromJS(inputParams.ExclusionModelInstance);

    ko.utils.extend(self, inputParams);
    self.nls = resourceBundle;
    self.party = self.ExclusionModelInstance.partyDetails.party;
    self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
    self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
    self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
    self.fullLMAccountList(self.fullPartiesLMAccountList()[self.indexSelected()]);
    self.fullVirtualAccountList(self.fullPartiesVirtualAccountList()[self.indexSelected()]);
    self.fullVAMEnabledRealAccountList(self.fullPartiesVAMRealAccountList()[self.indexSelected()]);

    if (rootParams.rootModel && rootParams.rootModel.params.editBackFromReview() !== null) {
      self.editBackFromReview(rootParams.rootModel.params.editBackFromReview());
    }

    rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, {
      user: self.nls.navLabels.UserLevel_title
    }));

    if (rootParams.rootModel.params.isTDAllowed() === undefined) { self.isTDAllowed(false); }
    else { self.isTDAllowed(rootParams.rootModel.params.isTDAllowed()); }

    if (rootParams.rootModel.params.isCasaAllowed() === undefined) { self.isCasaAllowed(false); }
    else { self.isCasaAllowed(rootParams.rootModel.params.isCasaAllowed()); }

    if (rootParams.rootModel.params.isLoanAllowed() === undefined) { self.isLoanAllowed(false); }
    else { self.isLoanAllowed(rootParams.rootModel.params.isLoanAllowed()); }

    if (rootParams.rootModel.params.isLMAllowed() === undefined) { self.isLMAllowed(false); }
    else { self.isLMAllowed(rootParams.rootModel.params.isLMAllowed()); }

    if (rootParams.rootModel.params.isVirtualAllowed() === undefined) {
      self.isVirtualAllowed(false);
    } else {
      self.isVirtualAllowed(rootParams.rootModel.params.isVirtualAllowed());
    }

    if (rootParams.rootModel.params.isVAMEnabledRealAllowed() === undefined) {
      self.isVAMEnabledRealAllowed(false);
    } else {
      self.isVAMEnabledRealAllowed(rootParams.rootModel.params.isVAMEnabledRealAllowed());
    }

    self.showConfirmation = ko.observable(false);
    self.showConfirmationForCreate = ko.observable(false);
    self.refreshed = ko.observable(false);
    self.httpStatus = ko.observable();
    self.transactionStatus = ko.observable();
    self.finalPayLoadArray = ko.observableArray();

    self.finalPayload = {
      userAccountAccessDTOs: ""
    };

    const getNewKoModel = function () {
      const KoModel = ExclusionModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.transactionName(self.nls.headers.userAcctSetupTransactionName);
    self.rootModelInstance = getNewKoModel();

    self.enableFormToUpdate = function () {
      self.showEditableForm(false);
      self.isAccessCreated(true);
      self.isAccessUpdated(false);
      self.editButtonPressed(true);
    };

    self.casaPayloadExclusionList = ko.observable([]);

    self.getCasaPayload = function () {
      self.casaPayloadExclusionList([]);
      self.casaExclusionAccountNumberList([]);
      self.casaRequestPayload.accountExclusionDTOs = [];

      self.casaRequestPayload.party = {
        value: self.party.value()
      };

      self.casaRequestPayload.userId = self.selectedUserId();
      self.casaRequestPayload.accountType = "CSA";
      self.casaRequestPayload.accessLevel = self.accessLevel();
      self.casaRequestPayload.accessStatus = self.isCasaAllowed();

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

          if (self.selectedCasaAccounts().length > 0) {
            if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) !== -1) {
              self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
              self.newExclusionArray.accountNumber.value = item.accountNumber.value;
              self.newExclusionArray.taskIds = item.selectedTask;

              if (!(self.casaPayloadExclusionList().filter(function (e) {
                return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
              }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                self.casaPayloadExclusionList().push(self.newExclusionArray);
              }
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

      self.tdRequestPayload.party = {
        value: self.party.value()
      };

      self.tdRequestPayload.userId = self.selectedUserId();
      self.tdRequestPayload.accountType = "TRD";
      self.tdRequestPayload.accessLevel = self.accessLevel();
      self.tdRequestPayload.accessStatus = self.isTDAllowed();

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
          if (self.nonSelectedTdAccounts().length > 0) {
            if (self.nonSelectedTdAccounts().indexOf(item.accountNumber.value) !== -1) {
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
                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                  self.tdPayloadExclusionList().push(self.newExclusionArray);
                }
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
            }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
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

      self.loanRequestPayload.party = {
        value: self.party.value()
      };

      self.loanRequestPayload.userId = self.selectedUserId();
      self.loanRequestPayload.accountType = "LON";
      self.loanRequestPayload.accessLevel = self.accessLevel();
      self.loanRequestPayload.accessStatus = self.isLoanAllowed();

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
          if (self.nonSelectedLoanAccounts().length > 0) {
            if (self.nonSelectedLoanAccounts().indexOf(item.accountNumber.value) !== -1) {
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
            }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
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

    self.lmPayloadExclusionList = ko.observable([]);

    self.getLMPayload = function () {
      self.lmPayloadExclusionList([]);
      self.lmExclusionAccountNumberList([]);
      self.lmRequestPayload.accountExclusionDTOs = [];

      self.lmRequestPayload.party = {
        value: self.party.value()
      };

      self.lmRequestPayload.userId = self.selectedUserId();
      self.lmRequestPayload.accountType = "LER";
      self.lmRequestPayload.accessLevel = self.accessLevel();
      self.lmRequestPayload.accessStatus = self.isLMAllowed();

      if (self.isAccessCreated()) {
        self.lmRequestPayload.accountAccessId = self.lmAccountAccessId();
      } else {
        delete self.lmRequestPayload.accountAccessId;
      }

      let exclusionObject;

      for (let y = 0; y < self.selectedAccountsResources().length; y++) {
        exclusionObject = self.selectedAccountsResources()[y];

        if (exclusionObject.accountType === "LER") {
          if (self.isLMAllowed() === true) {
            if (exclusionObject.nonSelectedTask && exclusionObject.nonSelectedTask.length > 0) {
              self.lmExclusionAccountNumberList().push(exclusionObject);
            }
          } else {
            self.lmExclusionAccountNumberList().push(exclusionObject);
          }
        }
      }

      self.nonSelectedLMAccounts = ko.observable([]);

      if (self.isLMAllowed() === true) {
        ko.utils.arrayForEach(self.fullLMAccountList(), function (item) {
          if (self.selectedLMAccounts().indexOf(item.accountNumber.value) === -1) {
            self.nonSelectedLMAccounts().push(item.accountNumber.value);
          }
        });

        ko.utils.arrayForEach(self.lmExclusionAccountNumberList(), function (item) {
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

          if (!(self.lmPayloadExclusionList().filter(function (e) {
            return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
          }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
            self.lmPayloadExclusionList().push(self.newExclusionArray);
          }
        });

        ko.utils.arrayForEach(self.fullLMAccountList(), function (item) {
          if (self.nonSelectedLMAccounts().length > 0) {
            if (self.nonSelectedLMAccounts().indexOf(item.accountNumber.value) !== -1) {
              for (let a = 0; a < self.nonSelectedLMAccounts().length; a++) {
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

                if (!(self.lmPayloadExclusionList().filter(function (e) {
                  return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                  self.lmPayloadExclusionList().push(self.newExclusionArray);
                }
              }
            }
          }
        });
      } else {
        ko.utils.arrayForEach(self.lmExclusionAccountNumberList(), function (item) {
          self.newExclusionArray = {
            accountNumber: {
              displayValue: "",
              value: ""
            },
            taskIds: []
          };

          if (self.selectedLMAccounts().length > 0) {
            if (self.selectedLMAccounts().indexOf(item.accountNumber.value) !== -1) {
              self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
              self.newExclusionArray.accountNumber.value = item.accountNumber.value;
              self.newExclusionArray.taskIds = item.selectedTask;
            }

            if (!(self.lmPayloadExclusionList().filter(function (e) {
              return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
            }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
              self.lmPayloadExclusionList().push(self.newExclusionArray);
            }
          }
        });
      }

      if (self.updatedLMExclusionNumberList().length > 0) {
        ko.utils.arrayForEach(self.updatedLMExclusionNumberList(), function (item) {
          for (let i = 0; i < self.lmPayloadExclusionList().length; i++) {
            if (self.lmPayloadExclusionList()[i].accountNumber.value === item.accountNumber.value) {
              self.lmPayloadExclusionList()[i].accountExclusionId = item.accountExclusionId;
            }
          }
        });
      }

      for (let j = 0; j < self.lmPayloadExclusionList().length; j++) {
        self.lmRequestPayload.accountExclusionDTOs.push({
          accountNumber: self.lmPayloadExclusionList()[j].accountNumber,
          accountExclusionId: self.lmPayloadExclusionList()[j].accountExclusionId,
          taskIds: self.lmPayloadExclusionList()[j].taskIds
        });
      }

      if (self.isBatchEnable()) {
        const payload = ko.mapping.toJSON(self.lmRequestPayload);

        return payload;
      }

      return self.lmRequestPayload;
    };

    self.verPayloadExclusionList = ko.observable([]);

    self.getVERPayload = function () {
      self.verPayloadExclusionList([]);
      self.vamEnabledRealExclusionAccountNumberList([]);
      self.vamEnabledRealAccRequestPayload.accountExclusionDTOs = [];

      self.vamEnabledRealAccRequestPayload.party = {
        value: self.party.value()
      };

      self.vamEnabledRealAccRequestPayload.userId = self.selectedUserId();
      self.vamEnabledRealAccRequestPayload.accountType = "VER";
      self.vamEnabledRealAccRequestPayload.accessLevel = self.accessLevel();
      self.vamEnabledRealAccRequestPayload.accessStatus = self.isVAMEnabledRealAllowed();

      if (self.isAccessCreated()) {
        self.vamEnabledRealAccRequestPayload.accountAccessId = self.vamEnabledRealAccountAccessId();
      } else {
        delete self.vamEnabledRealAccRequestPayload.accountAccessId;
      }

      let exclusionObject;

      for (let y = 0; y < self.selectedAccountsResources().length; y++) {
        exclusionObject = self.selectedAccountsResources()[y];

        if (exclusionObject.accountType === "VER") {
          if (self.isVAMEnabledRealAllowed() === true) {
            if (exclusionObject.nonSelectedTask && exclusionObject.nonSelectedTask.length > 0) {
              self.vamEnabledRealExclusionAccountNumberList().push(exclusionObject);
            }
          } else {
            self.vamEnabledRealExclusionAccountNumberList().push(exclusionObject);
          }
        }
      }

      self.nonSelectedVERAccounts = ko.observable([]);

      if (self.isVAMEnabledRealAllowed() === true) {
        ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function (item) {
          if (self.selectedVAMEnabledRealAccounts().indexOf(item.accountNumber.value) === -1) {
            self.nonSelectedVERAccounts().push(item.accountNumber.value);
          }
        });

        ko.utils.arrayForEach(self.vamEnabledRealExclusionAccountNumberList(), function (item) {
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

          if (!(self.verPayloadExclusionList().filter(function (e) {
            return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
          }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
            self.verPayloadExclusionList().push(self.newExclusionArray);
          }
        });

        ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function (item) {
          if (self.nonSelectedVERAccounts().length > 0) {
            if (self.nonSelectedVERAccounts().indexOf(item.accountNumber.value) !== -1) {
              for (let a = 0; a < self.nonSelectedVERAccounts().length; a++) {
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

                if (!(self.verPayloadExclusionList().filter(function (e) {
                  return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                  self.verPayloadExclusionList().push(self.newExclusionArray);
                }
              }
            }
          }
        });
      } else {
        ko.utils.arrayForEach(self.vamEnabledRealExclusionAccountNumberList(), function (item) {
          self.newExclusionArray = {
            accountNumber: {
              displayValue: "",
              value: ""
            },
            taskIds: []
          };

          if (self.selectedVAMEnabledRealAccounts().length > 0) {
            if (self.selectedVAMEnabledRealAccounts().indexOf(item.accountNumber.value) !== -1) {
              self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
              self.newExclusionArray.accountNumber.value = item.accountNumber.value;
              self.newExclusionArray.taskIds = item.selectedTask;
            }

            if (!(self.verPayloadExclusionList().filter(function (e) {
              return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
            }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
              self.verPayloadExclusionList().push(self.newExclusionArray);
            }
          }
        });
      }

      if (self.updatedVAMEnabledRealExclusionNumberList().length > 0) {
        ko.utils.arrayForEach(self.updatedVAMEnabledRealExclusionNumberList(), function (item) {
          for (let i = 0; i < self.verPayloadExclusionList().length; i++) {
            if (self.verPayloadExclusionList()[i].accountNumber.value === item.accountNumber.value) {
              self.verPayloadExclusionList()[i].accountExclusionId = item.accountExclusionId;
            }
          }
        });
      }

      for (let j = 0; j < self.verPayloadExclusionList().length; j++) {
        self.vamEnabledRealAccRequestPayload.accountExclusionDTOs.push({
          accountNumber: self.verPayloadExclusionList()[j].accountNumber,
          accountExclusionId: self.verPayloadExclusionList()[j].accountExclusionId,
          taskIds: self.verPayloadExclusionList()[j].taskIds
        });
      }

      if (self.isBatchEnable()) {
        const payload = ko.mapping.toJSON(self.vamEnabledRealAccRequestPayload);

        return payload;
      }

      return self.vamEnabledRealAccRequestPayload;
    };

    self.vraPayloadExclusionList = ko.observable([]);

    self.getVRAPayload = function () {
      self.vraPayloadExclusionList([]);
      self.virtualExclusionAccountNumberList([]);
      self.virtualRequestPayload.accountExclusionDTOs = [];

      self.virtualRequestPayload.party = {
        value: self.party.value()
      };

      self.virtualRequestPayload.userId = self.selectedUserId();
      self.virtualRequestPayload.accountType = "VRA";
      self.virtualRequestPayload.accessLevel = self.accessLevel();
      self.virtualRequestPayload.accessStatus = self.isVirtualAllowed();

      if (self.isAccessCreated()) {
        self.virtualRequestPayload.accountAccessId = self.virtualAccountAccessId();
      } else {
        delete self.virtualRequestPayload.accountAccessId;
      }

      let exclusionObject;

      for (let y = 0; y < self.selectedAccountsResources().length; y++) {
        exclusionObject = self.selectedAccountsResources()[y];

        if (exclusionObject.accountType === "VRA") {
          if (self.isVirtualAllowed() === true) {
            if (exclusionObject.nonSelectedTask && exclusionObject.nonSelectedTask.length > 0) {
              self.virtualExclusionAccountNumberList().push(exclusionObject);
            }
          } else {
            self.virtualExclusionAccountNumberList().push(exclusionObject);
          }
        }
      }

      self.nonSelectedVRAAccounts = ko.observable([]);

      if (self.isVirtualAllowed() === true) {
        ko.utils.arrayForEach(self.fullVirtualAccountList(), function (item) {
          if (self.selectedVirtualAccounts().indexOf(item.accountNumber.value) === -1) {
            self.nonSelectedVRAAccounts().push(item.accountNumber.value);
          }
        });

        ko.utils.arrayForEach(self.virtualExclusionAccountNumberList(), function (item) {
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

          if (!(self.vraPayloadExclusionList().filter(function (e) {
            return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
          }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
            self.vraPayloadExclusionList().push(self.newExclusionArray);
          }
        });

        ko.utils.arrayForEach(self.fullVirtualAccountList(), function (item) {
          if (self.nonSelectedVRAAccounts().length > 0) {
            if (self.nonSelectedVRAAccounts().indexOf(item.accountNumber.value) !== -1) {
              for (let a = 0; a < self.nonSelectedVRAAccounts().length; a++) {
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

                if (!(self.vraPayloadExclusionList().filter(function (e) {
                  return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
                }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
                  self.vraPayloadExclusionList().push(self.newExclusionArray);
                }
              }
            }
          }
        });
      } else {
        ko.utils.arrayForEach(self.virtualExclusionAccountNumberList(), function (item) {
          self.newExclusionArray = {
            accountNumber: {
              displayValue: "",
              value: ""
            },
            taskIds: []
          };

          if (self.selectedVirtualAccounts().length > 0) {
            if (self.selectedVirtualAccounts().indexOf(item.accountNumber.value) !== -1) {
              self.newExclusionArray.accountNumber.displayValue = item.accountNumber.displayValue;
              self.newExclusionArray.accountNumber.value = item.accountNumber.value;
              self.newExclusionArray.taskIds = item.selectedTask;
            }

            if (!(self.vraPayloadExclusionList().filter(function (e) {
              return e.accountNumber.value === self.newExclusionArray.accountNumber.value;
            }).length > 0) && self.newExclusionArray.accountNumber.value && self.newExclusionArray.accountNumber.value.length > 0) {
              self.vraPayloadExclusionList().push(self.newExclusionArray);
            }
          }
        });
      }

      if (self.updatedVirtualExclusionNumberList().length > 0) {
        ko.utils.arrayForEach(self.updatedVirtualExclusionNumberList(), function (item) {
          for (let i = 0; i < self.vraPayloadExclusionList().length; i++) {
            if (self.vraPayloadExclusionList()[i].accountNumber.value === item.accountNumber.value) {
              self.vraPayloadExclusionList()[i].accountExclusionId = item.accountExclusionId;
            }
          }
        });
      }

      for (let j = 0; j < self.vraPayloadExclusionList().length; j++) {
        self.virtualRequestPayload.accountExclusionDTOs.push({
          accountNumber: self.vraPayloadExclusionList()[j].accountNumber,
          accountExclusionId: self.vraPayloadExclusionList()[j].accountExclusionId,
          taskIds: self.vraPayloadExclusionList()[j].taskIds
        });
      }

      if (self.isBatchEnable()) {
        const payload = ko.mapping.toJSON(self.virtualRequestPayload);

        return payload;
      }

      return self.virtualRequestPayload;
    };

    self.createAccess = function (selectedAccountsResources) {
      self.selectedAccountsResources(selectedAccountsResources);
      self.casaExclusionAccountNumberList([]);
      self.tdExclusionAccountNumberList([]);
      self.loanExclusionAccountNumberList([]);
      self.lmExclusionAccountNumberList([]);
      self.vamEnabledRealExclusionAccountNumberList([]);
      self.virtualExclusionAccountNumberList([]);
      self.updatedCASAExclusionNumberList([]);
      self.updatedTDExclusionNumberList([]);
      self.updatedLOANExclusionNumberList([]);
      self.updatedLMExclusionNumberList([]);
      self.updatedVAMEnabledRealExclusionNumberList([]);
      self.updatedVirtualExclusionNumberList([]);
      self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
      self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
      self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);

      self.fullLMAccountList(self.fullPartiesLMAccountList()[self.indexSelected()]);
      self.fullVirtualAccountList(self.fullPartiesVirtualAccountList()[self.indexSelected()]);
      self.fullVAMEnabledRealAccountList(self.fullPartiesVAMRealAccountList()[self.indexSelected()]);

      if (self.selectedCasaPolicy() === null || self.selectedCasaPolicy() === undefined || self.selectedTdPolicy() === null || self.selectedTdPolicy() === undefined || self.selectedLoanPolicy() === null || self.selectedLoanPolicy() === undefined || self.selectedLMPolicy() === null || self.selectedLMPolicy() === undefined || self.selectedVirtualPolicy() === null || self.selectedVirtualPolicy() === undefined || self.selectedVamEnabledRealAccPolicy() === null || self.selectedVamEnabledRealAccPolicy() === undefined) {
        rootParams.baseModel.showMessages(null, [self.nls.info.accountTransactionSetup], "INFO");
      } else {
        self.finalPayLoadArray.push(self.getCasaPayload());
        self.finalPayLoadArray.push(self.getLoanPayload());
        self.finalPayLoadArray.push(self.getTDPayload());
        self.finalPayLoadArray.push(self.getLMPayload());
        self.finalPayLoadArray.push(self.getVERPayload());
        self.finalPayLoadArray.push(self.getVRAPayload());
        self.finalPayload.userAccountAccessDTOs = self.finalPayLoadArray();

        ExclusionModel.createAccessClone(ko.toJSON(self.finalPayload), self.selectedUserId()).done(function (data, status, jqXhr) {
          self.showDeleteButton(true);
          self.isAccessCreated(true);
          self.showEditableForm(true);
          self.httpStatus(jqXhr.status);
          self.transactionStatus(data.status);
          self.showConfirmationForCreate(true);

          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.transactionName()
          }, self);
        });
      }
    };

    self.updateAccess = function (selectedAccountsResources) {
      self.selectedAccountsResources(selectedAccountsResources);
      self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
      self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
      self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
      self.fullLMAccountList(self.fullPartiesLMAccountList()[self.indexSelected()]);
      self.fullVirtualAccountList(self.fullPartiesVirtualAccountList()[self.indexSelected()]);
      self.fullVAMEnabledRealAccountList(self.fullPartiesVAMRealAccountList()[self.indexSelected()]);

      self.finalPayLoadArray.push(self.getCasaPayload());
      self.finalPayLoadArray.push(self.getLoanPayload());
      self.finalPayLoadArray.push(self.getTDPayload());
      self.finalPayLoadArray.push(self.getLMPayload());
      self.finalPayLoadArray.push(self.getVERPayload());
      self.finalPayLoadArray.push(self.getVRAPayload());
      self.finalPayload.userAccountAccessDTOs = self.finalPayLoadArray();

      ExclusionModel.updateAccessClone(ko.toJSON(self.finalPayload), self.selectedUserId()).done(function (data, status, jqXhr) {
        self.isAccessUpdated(true);
        self.httpStatus(jqXhr.status);
        self.transactionStatus(data);
        self.showConfirmation(true);
        self.readAccess();

        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.transactionName()
        }, self);
      });
    };

    self.readAccess = function () {
      self.casaExclusionAccountNumberList([]);
      self.tdExclusionAccountNumberList([]);
      self.loanExclusionAccountNumberList([]);
      self.lmExclusionAccountNumberList([]);
      self.vamEnabledRealExclusionAccountNumberList([]);
      self.virtualExclusionAccountNumberList([]);
      self.updatedCASAExclusionNumberList([]);
      self.updatedTDExclusionNumberList([]);
      self.updatedLOANExclusionNumberList([]);
      self.updatedLMExclusionNumberList([]);
      self.updatedVAMEnabledRealExclusionNumberList([]);
      self.updatedVirtualExclusionNumberList([]);

      ExclusionModel.readAccess(self.selectedUserId()).done(function (data) {
        self.showModuleToMap(true);

        if (data.userAccountAccessDTOs) {
          for (let i = 0; i < data.userAccountAccessDTOs.length; i++) {
            if (data.userAccountAccessDTOs[i].accountType === "CSA") {
              self.isCasaAllowed(data.userAccountAccessDTOs[i].accessStatus);
              self.casaAccountAccessId(data.userAccountAccessDTOs[i].accountAccessId);
              self.updatedCASAExclusionNumberList(data.userAccountAccessDTOs[i].accountExclusionDTOs);

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
            } else if (data.userAccountAccessDTOs[i].accountType === "TRD") {
              self.isTDAllowed(data.userAccountAccessDTOs[i].accessStatus);
              self.tdAccountAccessId(data.userAccountAccessDTOs[i].accountAccessId);
              self.updatedTDExclusionNumberList(data.userAccountAccessDTOs[i].accountExclusionDTOs);

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
            } else if (data.userAccountAccessDTOs[i].accountType === "LON") {
              self.isLoanAllowed(data.userAccountAccessDTOs[i].accessStatus);
              self.loanAccountAccessId(data.userAccountAccessDTOs[i].accountAccessId);
              self.updatedLOANExclusionNumberList(data.userAccountAccessDTOs[i].accountExclusionDTOs);

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
            } else if (data.userAccountAccessDTOs[i].accountType === "LER") {
              self.isLMAllowed(data.userAccountAccessDTOs[i].accessStatus);
              self.lmAccountAccessId(data.userAccountAccessDTOs[i].accountAccessId);
              self.updatedLMExclusionNumberList(data.userAccountAccessDTOs[i].accountExclusionDTOs);

              ko.utils.arrayForEach(self.updatedLMExclusionNumberList(), function (item) {
                self.lmAccountNumbersArray().push(item.accountNumber.value);
              });

              if (self.isLMAllowed()) {
                ko.utils.arrayForEach(self.fullLMAccountList(), function (item) {
                  if (self.lmAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < self.updatedLMExclusionNumberList().length; i++) {
                      if (self.updatedLMExclusionNumberList()[i].accountNumber.value === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedLMExclusionNumberList()[i].taskIds.length) {
                        self.selectedLMAccounts.push(item.accountNumber.value);
                      }
                    }
                  } else {
                    self.selectedLMAccounts.push(item.accountNumber.value);
                  }
                });
              } else {
                ko.utils.arrayForEach(self.updatedLMExclusionNumberList(), function (item) {
                  self.selectedLMAccounts.push(item.accountNumber.value);
                });
              }
            } else if (data.userAccountAccessDTOs[i].accountType === "VER") {
              self.isVAMEnabledRealAllowed(data.userAccountAccessDTOs[i].accessStatus);
              self.vamEnabledRealAccountAccessId(data.userAccountAccessDTOs[i].accountAccessId);
              self.updatedVAMEnabledRealExclusionNumberList(data.userAccountAccessDTOs[i].accountExclusionDTOs);

              ko.utils.arrayForEach(self.updatedVAMEnabledRealExclusionNumberList(), function (item) {
                self.vamEnabledRealAccountNumbersArray().push(item.accountNumber.value);
              });

              if (self.isVAMEnabledRealAllowed()) {
                ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function (item) {
                  if (self.vamEnabledRealAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < self.updatedVAMEnabledRealExclusionNumberList().length; i++) {
                      if (self.updatedVAMEnabledRealExclusionNumberList()[i].accountNumber.value === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedVAMEnabledRealExclusionNumberList()[i].taskIds.length) {
                        self.selectedVAMEnabledRealAccounts.push(item.accountNumber.value);
                      }
                    }
                  } else {
                    self.selectedVAMEnabledRealAccounts.push(item.accountNumber.value);
                  }
                });
              } else {
                ko.utils.arrayForEach(self.updatedVAMEnabledRealExclusionNumberList(), function (item) {
                  self.selectedVAMEnabledRealAccounts.push(item.accountNumber.value);
                });
              }
            } else if (data.userAccountAccessDTOs[i].accountType === "VRA") {
              self.isVirtualAllowed(data.userAccountAccessDTOs[i].accessStatus);
              self.virtualAccountAccessId(data.userAccountAccessDTOs[i].accountAccessId);
              self.updatedVirtualExclusionNumberList(data.userAccountAccessDTOs[i].accountExclusionDTOs);

              ko.utils.arrayForEach(self.updatedVirtualExclusionNumberList(), function (item) {
                self.virtualAccountNumbersArray().push(item.accountNumber.value);
              });

              if (self.isVirtualAllowed()) {
                ko.utils.arrayForEach(self.fullVirtualAccountList(), function (item) {
                  if (self.virtualAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < self.updatedVirtualExclusionNumberList().length; i++) {
                      if (self.updatedVirtualExclusionNumberList()[i].accountNumber.value === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedVirtualExclusionNumberList()[i].taskIds.length) {
                        self.selectedVirtualAccounts.push(item.accountNumber.value);
                      }
                    }
                  } else {
                    self.selectedVirtualAccounts.push(item.accountNumber.value);
                  }
                });
              } else {
                ko.utils.arrayForEach(self.updatedVirtualExclusionNumberList(), function (item) {
                  self.selectedVirtualAccounts.push(item.accountNumber.value);
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
      self.lmExclusionAccountNumberList([]);
      self.virtualExclusionAccountNumberList([]);
      self.vamEnabledRealExclusionAccountNumberList([]);
      self.updatedCASAExclusionNumberList([]);
      self.updatedTDExclusionNumberList([]);
      self.updatedLOANExclusionNumberList([]);
      self.updatedLMExclusionNumberList([]);
      self.updatedVirtualExclusionNumberList([]);
      self.updatedVAMEnabledRealExclusionNumberList([]);
      $("#deleteConfirmationModal").hide();
      self.fullCasaAccountList(self.fullPartiesCasaAccountList()[self.indexSelected()]);
      self.fulltdAccountList(self.fullPartiesTDAccountList()[self.indexSelected()]);
      self.fullloanAccountList(self.fullPartiesLoanAccountList()[self.indexSelected()]);
      self.fullLMAccountList(self.fullPartiesLMAccountList()[self.indexSelected()]);
      self.fullVAMEnabledRealAccountList(self.fullPartiesVAMRealAccountList()[self.indexSelected()]);
      self.fullVirtualAccountList(self.fullPartiesVirtualAccountList()[self.indexSelected()]);
      self.finalPayLoadArray.push(self.getCasaPayload());
      self.finalPayLoadArray.push(self.getLoanPayload());
      self.finalPayLoadArray.push(self.getTDPayload());
      self.finalPayLoadArray.push(self.getLMPayload());
      self.finalPayLoadArray.push(self.getVERPayload());
      self.finalPayLoadArray.push(self.getVRAPayload());
      self.finalPayload.userAccountAccessDTOs = self.finalPayLoadArray();

      ExclusionModel.deleteAccess(ko.toJSON(self.finalPayload), self.selectedUserId()).done(function (data, status, jqXhr) {
        self.showDeleteButton(true);
        self.httpStatus(jqXhr.status);
        self.transactionStatus(data);
        self.showConfirmationForCreate(true);

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName()
        }, self);
      });
    };

    self.payloadChanged = function () {
      ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function (item) {
        self.casaTransactionMappedObject = {
          accountNumber: "",
          selectedTask: [],
          accountType: "CSA",
          nonSelectedTask: []
        };

        self.casaTransactionMappedObject.accountNumber = item.accountNumber.value;
        self.casaTransactionMappedObject.nonSelectedTask = item.taskIds;
        self.selectedAccountsResources().push(self.casaTransactionMappedObject);
      });

      ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function (item) {
        self.tdTransactionMappedObject = {
          accountNumber: "",
          selectedTask: [],
          accountType: "TRD",
          nonSelectedTask: []
        };

        self.tdTransactionMappedObject.accountNumber = item.accountNumber.value;
        self.tdTransactionMappedObject.nonSelectedTask = item.taskIds;
        self.selectedAccountsResources().push(self.tdTransactionMappedObject);
      });

      ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function (item) {
        self.loanTransactionMappedObject = {
          accountNumber: "",
          selectedTask: [],
          accountType: "LON",
          nonSelectedTask: []
        };

        self.loanTransactionMappedObject.accountNumber = item.accountNumber.value;
        self.loanTransactionMappedObject.nonSelectedTask = item.taskIds;
        self.selectedAccountsResources().push(self.loanTransactionMappedObject);
      });

      ko.utils.arrayForEach(self.updatedLMExclusionNumberList(), function (item) {
        self.lmTransactionMappedObject = {
          accountNumber: "",
          selectedTask: [],
          accountType: "LER",
          nonSelectedTask: []
        };

        self.lmTransactionMappedObject.accountNumber = item.accountNumber.value;
        self.lmTransactionMappedObject.nonSelectedTask = item.taskIds;
        self.selectedAccountsResources().push(self.lmTransactionMappedObject);
      });

      ko.utils.arrayForEach(self.updatedVAMEnabledRealExclusionNumberList(), function (item) {
        self.VERTransactionMappedObject = {
          accountNumber: "",
          selectedTask: [],
          accountType: "VER",
          nonSelectedTask: []
        };

        self.VERTransactionMappedObject.accountNumber = item.accountNumber.value;
        self.VERTransactionMappedObject.nonSelectedTask = item.taskIds;
        self.selectedAccountsResources().push(self.VERTransactionMappedObject);
      });

      ko.utils.arrayForEach(self.updatedVirtualExclusionNumberList(), function (item) {
        self.VRATransactionMappedObject = {
          accountNumber: "",
          selectedTask: [],
          accountType: "VRA",
          nonSelectedTask: []
        };

        self.VRATransactionMappedObject.accountNumber = item.accountNumber.value;
        self.VRATransactionMappedObject.nonSelectedTask = item.taskIds;
        self.selectedAccountsResources().push(self.VRATransactionMappedObject);
      });
    };

    self.LoadTransactionMappingComponent = function () {
      self.disableAccountSelection(true);

      const params = ko.mapping.toJS({
        disableAccountSelection: self.disableAccountSelection,
        highlightedTabTrans: self.highlightedTabTrans,
        accessLevel: self.accessLevel,
        selectedCasaAccounts: self.selectedCasaAccounts,
        selectedTdAccounts: self.selectedTdAccounts,
        selectedLoanAccounts: self.selectedLoanAccounts,
        selectedLMAccounts: self.selectedLMAccounts,
        selectedVirtualAccounts: self.selectedVirtualAccounts,
        selectedVAMEnabledRealAccounts: self.selectedVAMEnabledRealAccounts,
        casaTransactionTabVisited: self.casaTransactionTabVisited,
        loanTransactionTabVisited: self.loanTransactionTabVisited,
        tdTransactionTabVisited: self.tdTransactionTabVisited,
        lmTransactionTabVisited: self.lmTransactionTabVisited,
        virtualTransactionTabVisited: self.virtualTransactionTabVisited,
        vamEnabledRealAccTransactionTabVisited: self.vamEnabledRealAccTransactionTabVisited,
        fullCasaAccountList: self.fullCasaAccountList,
        fulltdAccountList: self.fulltdAccountList,
        fullloanAccountList: self.fullloanAccountList,
        fullLMAccountList: self.fullLMAccountList,
        fullVAMEnabledRealAccountList: self.fullVAMEnabledRealAccountList,
        fullVirtualAccountList: self.fullVirtualAccountList,
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
        resourceListLM: self.resourceListLM,
        resourceListVER: self.resourceListVER,
        resourceListVRA: self.resourceListVRA,
        selectedAccountsResources: self.selectedAccountsResources,
        showConfirmationForCreate: self.showConfirmationForCreate,
        parentAccessLevel: self.parentAccessLevel,
        updateAccess: self.updateAccess,
        getCasaPayload: self.getCasaPayload,
        getTDPayload: self.getTDPayload,
        getLoanPayload: self.getLoanPayload,
        getLMPayload: self.getLMPayload,
        getVERPayload: self.getVERPayload,
        getVRAPayload: self.getVRAPayload,
        casaRequestPayload: self.casaRequestPayload,
        tdRequestPayload: self.tdRequestPayload,
        loanRequestPayload: self.loanRequestPayload,
        lmRequestPayload: self.lmRequestPayload,
        vamEnabledRealAccRequestPayload: self.vamEnabledRealAccRequestPayload,
        virtualRequestPayload: self.virtualRequestPayload,
        isBatchEnable: self.isBatchEnable,
        selectedCasaPolicy: self.selectedCasaPolicy,
        selectedTdPolicy: self.selectedTdPolicy,
        selectedLoanPolicy: self.selectedLoanPolicy,
        selectedLMPolicy: self.selectedLMPolicy,
        selectedCasaPolicyChecked: self.selectedCasaPolicyChecked,
        selectedTdPolicyChecked: self.selectedTdPolicyChecked,
        selectedLoanPolicyChecked: self.selectedLoanPolicyChecked,
        selectedLMPolicyChecked: self.selectedLMPolicyChecked,
        selectedVirtualPolicyChecked: self.selectedVirtualPolicyChecked,
        selectedVERPolicyChecked: self.selectedVERPolicyChecked,
        selectedVirtualPolicy: self.selectedVirtualPolicy,
        selectedVamEnabledRealAccPolicy: self.selectedVamEnabledRealAccPolicy,
        createObservables: self.createObservables,
        accountAccessSummaryObject: self.accountAccessSummaryObject,
        cameBack: self.cameBack,
        party: self.party,
        createAccess: self.createAccess,
        casaAllowedButtonsPressed: self.casaAllowedButtonsPressed,
        tdAllowedButtonsPressed: self.tdAllowedButtonsPressed,
        loanAllowedButtonsPressed: self.loanAllowedButtonsPressed,
        lmAllowedButtonsPressed: self.lmAllowedButtonsPressed,
        virtualAllowedButtonsPressed: self.virtualAllowedButtonsPressed,
        vamEnabledRealAllowedButtonsPressed: self.vamEnabledRealAllowedButtonsPressed,
        editBackFromReview: self.editBackFromReview
      });

      rootParams.dashboard.loadComponent("account-transactions-mapping", params);
    };

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

    self.isLMAllowed.subscribe(function (newValue) {
      if (newValue === true) {
        self.selectedLMPolicy("lmAuto");
        self.selectedLMPolicyChecked(["lmAuto"]);
      } else {
        self.selectedLMPolicy("lmManual");
        self.selectedLMPolicyChecked(["lmManual"]);
      }
    });

    self.isVirtualAllowed.subscribe(function (newValue) {
      if (newValue === true) {
        self.selectedVirtualPolicy("vraAuto");
        self.selectedVirtualPolicyChecked(["vraAuto"]);
      } else {
        self.selectedVirtualPolicy("vraManual");
        self.selectedVirtualPolicyChecked(["vraManual"]);
      }
    });

    self.isVAMEnabledRealAllowed.subscribe(function (newValue) {
      if (newValue === true) {
        self.selectedVamEnabledRealAccPolicy("verAuto");
        self.selectedVERPolicyChecked(["verAuto"]);
      } else {
        self.selectedVamEnabledRealAccPolicy("verManual");
        self.selectedVERPolicyChecked(["verManual"]);
      }
    });

    self.showSavedData = function () {
      self.selectedCasaAccounts(self.selectedCasaAccounts());
      self.selectedTdAccounts(self.selectedTdAccounts());
      self.selectedLoanAccounts(self.selectedLoanAccounts());
      self.selectedLMAccounts(self.selectedLMAccounts());
      self.selectedVAMEnabledRealAccounts(self.selectedVAMEnabledRealAccounts());
      self.selectedVirtualAccounts(self.selectedVirtualAccounts());
      self.isAccessCreated(true);
      self.refreshed(false);
      self.refreshed(true);
    };

    if (self.isAccessCreated() === true) {
      if (self.editBackFromReview()) { self.showSavedData(); }
      else { self.readAccess(); }
    }

    self.backOnEdit = function () {
      self.selectedCasaAccounts([]);
      self.selectedTdAccounts([]);
      self.selectedLoanAccounts([]);
      self.selectedLMAccounts([]);
      self.selectedVirtualAccounts([]);
      self.selectedVAMEnabledRealAccounts([]);
      self.readAccess();
      self.showEditableForm(true);
      self.editButtonPressed(false);
    };

    self.dispose = function () {
      isCasaAllowedSubscription.dispose();
    };
  };
});