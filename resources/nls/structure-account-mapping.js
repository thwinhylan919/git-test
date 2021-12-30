  define([
      "ojL10n!resources/nls/generic"
  ], function(Generic) {
      "use strict";

      const structureAccountMapping = function() {
          return {
              root: {
                  labels: {
                      header: "Create Account Structure",
                      infoMessage: "Only chosen accounts will be available for creating structure.",
                      addAccount: "Add Accounts",
                      partyName: "Party Name",
                      accountNumber: "Account Number",
                      accountType: "Account Type",
                      branch: "Branch",
                      currentBalance: "Current Balance",
                      availableBalance: "Available Balance",
                      actions: "Action",
                      remove: "Remove",
                      selectColumns: "Select Columns",
                      balanceCompensation: "Balance Compensation",
                      add: "Add",
                      priority: "Priority",
                      priorityAria: "Please mention priority of the account pair",
                      tableheader: "Table for accounts added for a structure",
                      removeTitle: "Click here to remove",
                      removeAlt: "Click here to remove",
                      info: "Please add two or more accounts to proceed",
                      warning: "Warning",
                      existingAccountWarningMessage: "Account number {accountNo} is part of existing structure. Removing this account will reset your existing structure account. Do you wish to proceed?",
                      accountCheck: {
                          true: "External",
                          false: "Internal"
                      }
                  },
                  generic: Generic
              },
              ar: true,
              fr: true,
              cs: true,
              sv: true,
              en: false,
es :true,
              "en-us": false,
              el: true
          };
      };

      return new structureAccountMapping();
  });