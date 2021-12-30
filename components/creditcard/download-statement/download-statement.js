define([
  "ojs/ojcore",
  "knockout",
    "./model",
  "ojL10n!resources/nls/electronic-statement",
  "ojs/ojknockout",
  "ojs/ojlistview",
  "ojs/ojmodel",
  "ojs/ojselectcombobox",
  "ojs/ojbutton",
  "ojs/ojpagingcontrol",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource"
], function(oj, ko, downloadStatementModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    ko.utils.extend(this, rootParams.rootModel);

    const self = this;

    self.validationTracker = ko.observable();
    self.resource = ResourceBundle;
    self.statementYears = ko.observableArray();
    self.selectedStatementYear = ko.observable();
    self.statementMonths = ko.observableArray();
    self.selectedStatementMonth = ko.observable();
    self.statementsFetched = ko.observable(false);
    self.datasource = ko.observable([]);

    const currentYear = rootParams.baseModel.getDate().getFullYear();

    self.statementYears.push({
      text: currentYear.toString(),
      value: currentYear
    }, {
      text: (currentYear - 1).toString(),
      value: currentYear - 1
    });

    self.statementMonths.push({
      text: self.resource.eStatement.allMonths,
      value: "all"
    });

    for (let a = 0; a < 12; a++) {
      self.statementMonths.push({
        text: oj.LocaleData.getMonthNames("abbreviated")[a],
        value: a
      });
    }

    self.fetchEstatement = function() {
      downloadStatementModel.getEstatementsList(self.cardObject().creditCard.value, self.selectedStatementMonth(), self.selectedStatementYear()).done(function(data) {
        self.statements = ko.utils.unwrapObservable(data.statementDetails);
        self.datasource(new oj.ArrayTableDataSource(self.statements, {}));
        self.statementsFetched(true);
      });
    };

    self.getpdf = function() {
      downloadStatementModel.getpdf(self.cardObject().creditCard.value, self.selectedStatementMonth(), self.selectedStatementYear());
    };
  };
});
