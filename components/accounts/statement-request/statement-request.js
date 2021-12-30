define([
  "ojs/ojcore",
  "knockout",
    "./model",
  "ojL10n!resources/nls/statement-request",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation"
], function(oj, ko, StatementRequestModel, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.dateLoaded = ko.observable(false);
    self.validationTracker = ko.observable();

    StatementRequestModel.fetchCurrentDate().done(function(data){
      self.maxDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(data.currentDate.valueDate)));
      self.dateLoaded(true);
    });

    self.taskCode = null;
    ko.utils.extend(self, rootParams.rootModel);

    const confirmScreenExtensions = {};

    self.accountPassed = !!(self.params && self.params.id);
    self.selectedAccount = ko.observable();
    self.additionalDetails = ko.observable();

    const module = self.accountPassed ? self.params.module : null;

    self.accountURL = null;

    if (self.accountPassed) {
      self.selectedAccount(self.params.id.value);

      self.additionalDetails({
        account: self.params
      });
    }

    self.rootModelInstance = self.rootModelInstance || ko.mapping.fromJS(StatementRequestModel.getNewModel());

    if (self.previousState && self.previousState.data && self.previousState.data.payLoadData)
      {self.rootModelInstance.payLoadData = self.previousState.data.payLoadData;}

    self.locale = locale;
    self.dateValid = ko.observable();
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("account-input");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerComponent("review-statement-request", "accounts");
    rootParams.baseModel.registerComponent("create-rd", "recurring-deposit");
    rootParams.dashboard.headerName(self.locale.statementRequest.title);
    self.customURL = null;

    if (self.params) {
      switch (self.params.jsonData ? self.params.jsonData.type : self.params.type) {
        case "CSA":
        case "demandDeposit":
          self.customURL = "demandDeposit";
          self.taskCode = "CH_N_RAS";
          break;
        case "TRD":
        case "deposit":
          if (module && module === "RD") {
            self.customURL = "deposit";
            self.taskCode = "TD_N_RAS_RD";
            self.accountURL = "deposit?module=RD";
          } else {
            self.customURL = "deposit";
            self.taskCode = "TD_N_RAS";
            self.accountURL = "deposit?module=CON&module=ISL";
          }

          break;
        case "RD":
          self.customURL = "deposit";
          self.taskCode = "TD_N_RAS_RD";
          self.accountURL = "deposit?module=RD";
          break;
        case "LON":
        case "loan":
          self.customURL = "loan";
          break;
        default:
          self.customURL = null;
      }
    }

    self.submit = function() {
      const dateTracker = document.getElementById("dateTracker");

      if (dateTracker && dateTracker.valid !== "valid") {
        dateTracker.showMessages();
        dateTracker.focusOn("@firstInvalidShown");

        return;
      }

      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      if (!self.selectedAccount()) {
        rootParams.baseModel.showMessages(null, [self.locale.accountInput.noAccounts], "ERROR");
      } else {
        self.rootModelInstance.payLoadData.selectedAccount(self.additionalDetails().account.id.displayValue);

        rootParams.dashboard.loadComponent("review-statement-request", {
          mode: "review",
          data: self.rootModelInstance,
          taskCode: self.taskCode,
          confirmScreenExtensions: confirmScreenExtensions,
          confirm:self.confirm
        }, self);
      }
    };

    self.confirm = function() {
      StatementRequestModel.requestPhysicalStatement(self.selectedAccount(), ko.mapping.toJSON(self.rootModelInstance.payLoadData, {
        ignore: ["selectedAccount"]
      }), self.customURL, module).done(function(data, status, jqXHR) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionName: self.locale.statementRequest.title,
          hostReferenceNumber: data.adhocStatementReferenceNo,
          template: "confirm-screen/" + (self.customURL === "demandDeposit" ? "casa-template" : self.customURL === "deposit" ? module === "RD" ? "rd-template" : "td-template" : "loan-template"),
          confirmScreenExtensions: confirmScreenExtensions
        }, self);
      });
    };
  };
});