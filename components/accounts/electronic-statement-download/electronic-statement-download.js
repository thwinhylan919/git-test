define([
  "ojs/ojcore",
  "knockout",
    "./model",
  "ojL10n!resources/nls/electronic-statement",
  "ojs/ojknockout",
  "ojs/ojarraytabledatasource",
  "ojs/ojlistview",
  "ojs/ojmodel",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojbutton",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation"
], function(oj, ko, eStatementModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    ko.utils.extend(this, rootParams.rootModel);

    const self = this;

    self.validationTracker = ko.observable();
    self.resource = ResourceBundle;
    self.accountID = self.params.id.value || self.selectedAccountNo;

    const module = self.params.module;

    self.statementYears = ko.observableArray();
    self.statementMonths = ko.observableArray();
    self.isYearLimitFetched = ko.observable(false);
    self.yearLimitCount = ko.observable();
    self.datasource = ko.observable();

    const currentYear = rootParams.baseModel.getDate().getFullYear();
    let a;

    for (a = 0; a < 5; a++) {
      self.statementYears.push({
        text: (currentYear - a).toString(),
        value: currentYear - a
      });
    }

    self.statementMonths.push({
      text: self.resource.eStatement.allMonths,
      value: "all"
    });

    for (a = 0; a < 12; a++) {
      self.statementMonths.push({
        text: oj.LocaleData.getMonthNames("abbreviated")[a],
        value: a
      });
    }

    rootParams.baseModel.registerElement("confirm-screen");

    self.listEstatements = function() {
      self.statementsFetched(false);

      eStatementModel.getEstatementsList(self.type, self.accountID, self.selectedStatementYear(), self.selectedStatementMonth(), module).done(function(data) {
        self.statements = ko.utils.unwrapObservable(data.statementDetails);

        if (data.statementDetails === undefined) {
          self.statements = ko.utils.unwrapObservable(data.loanStatementDetails);
        }

        self.datasource(new oj.ArrayTableDataSource(self.statements, {
          idAttribute: "statementNo"
        } || []));

        self.statementsFetched(true);
      });
    };

    self.downLoadStatement = function(data) {
      eStatementModel.downLoadStatement(self.type, self.accountID, data.statementNo, module);
    };
  };
});