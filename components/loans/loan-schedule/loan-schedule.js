define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/loan-schedule",
  "ojs/ojtable",
    "ojs/ojpagingcontrol",
  "ojs/ojarraytabledatasource",
  "ojs/ojdatetimepicker",
  "ojs/ojlistview",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, ScheduleModel, locale) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.locale = locale;
    rootParams.dashboard.headerName(self.locale.schedule.loanSch);

    self.accountNo = null;
    self.detailsFetched = ko.observable(false);
    rootParams.baseModel.setwebhelpID("loans-schedule");
    self.accountNumberSelected = ko.observable();
    self.additionalDetails = ko.observable();
    self.arrayValue = ko.observableArray();
    self.installmentcount = ko.observable();
    self.installmentsPaid = ko.observable();
    self.amountPaidTillDate = ko.observable();
        self.pagingDataSource = ko.observable();

            self.pagingDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.arrayValue, {
      idAttribute: "no"
            })));

    rootParams.baseModel.registerComponent("loan-schedule-chart", "loans");
    rootParams.baseModel.registerComponent("account-nickname", "accounts");
    rootParams.baseModel.registerElement("date-box");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("row");
    rootParams.baseModel.registerElement("account-input");
    self.fromDateValue = ko.observable();
    self.toDateValue = ko.observable();

    if (!self.loanViewDetails || !self.scheduleData) {
      self.loanViewDetails = ko.observable();
      self.scheduleData = ko.observable();
    }

    self.mainFunction = function () {
      self.installmentcount(self.scheduleData().loanScheduleItemDTO.length);
      self.firstinstallmentdate = self.scheduleData().loanScheduleItemDTO[0].installmentDueDate;
      self.lastinstallmentdate = self.scheduleData().loanScheduleItemDTO[self.installmentcount() - 1].installmentDueDate;
      self.installmentsPaid(self.scheduleData().installementPaidCount);
      self.approvedAmount = rootParams.baseModel.formatCurrency(self.loanViewDetails().approvedAmount.amount, self.loanViewDetails().approvedAmount.currency);
      self.amountPaidTillDate(rootParams.baseModel.formatCurrency(self.loanViewDetails().disbursedAmount.amount, self.loanViewDetails().disbursedAmount.currency));
      self.fromDateValue(self.firstinstallmentdate);
      self.toDateValue(self.lastinstallmentdate);

      self.modulorIndicium = function (start, end, clear) {
        if (clear) {
          self.arrayValue.removeAll();
        }

        self.arrayValue(self.scheduleData().loanScheduleItemDTO.filter(function (object) {
          return (new Date(object.installmentDueDate).setHours(0, 0, 0, 0) < (new Date(end)).setHours(0, 0, 0, 0) && new Date(object.installmentDueDate).setHours(0, 0, 0, 0) > (new Date(start)).setHours(0, 0, 0, 0)) ||
            (new Date(object.installmentDueDate).setHours(0, 0, 0, 0) === (new Date(start)).setHours(0, 0, 0, 0) || new Date(object.installmentDueDate).setHours(0, 0, 0, 0) === (new Date(end)).setHours(0, 0, 0, 0))
          ;
        }).map(function (object, index) {
          return {
            no: index + 1,
            date: object.installmentDueDate,
            principal: object.principal ? rootParams.baseModel.formatCurrency(object.principal.amount, object.principal.currency) : "-",
            interest: object.interest ? rootParams.baseModel.formatCurrency(object.interest.amount, object.interest.currency) : "-",
            charge: rootParams.baseModel.formatCurrency(object.chargeAmount.amount, object.chargeAmount.currency),
            installmentAmount: rootParams.baseModel.formatCurrency(object.installmentAmount.amount, object.installmentAmount.currency),
            unpaidInstallmentAmount: rootParams.baseModel.formatCurrency(object.balance.amount, object.balance.currency)
          };
        }));
      };

      self.modulorIndicium(self.fromDateValue(), self.toDateValue(), true);
      ko.tasks.runEarly();
      self.detailsFetched(true);
    };

    self.fromDateValue.subscribe(function (newValue) {
      self.modulorIndicium(newValue, self.toDateValue(), true);
    });

    self.toDateValue.subscribe(function (newValue) {
      self.modulorIndicium(self.fromDateValue(), newValue, true);
    });

    function fireRequests() {
      $.when(ScheduleModel.fetchAccountInfo(self.accountNo), ScheduleModel.fetchScheduleInfo(self.accountNo)).done(function (loanViewDetails, scheduleData) {
        self.detailsFetched(false);
        self.loanViewDetails(loanViewDetails.loanAccountDetails);
        self.scheduleData(scheduleData.loanScheduleDTO);
        self.mainFunction();
      });
    }

       self.accountNumberSelected.subscribe(function(newValue) {
         self.accountNo = newValue;
         fireRequests();
    });

    if (self.params.id) {
      self.accountNo = self.params.id.value;
      self.accountNumberSelected(self.accountNo);
    }

    self.download = function () {
      ScheduleModel.fetchPDF(self.accountNo, self.fromDateValue(), self.toDateValue());
    };
  };
});