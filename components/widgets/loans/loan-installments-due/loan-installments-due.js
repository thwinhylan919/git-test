define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/loan-installments-due",
  "ojs/ojcore",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojarraytabledatasource"
], function(ko, InstallmentsDueModel, resourceBundle, oj) {
  "use strict";

  return function(params) {
    const self = this,
      getNewKoModel = function() {
        const KoModel = InstallmentsDueModel.getNewModel();

        return KoModel;
      };

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.upcomingdatasource = ko.observableArray();
    self.overDuedatasource = ko.observableArray();
    self.upcomingdataSource75 = ko.observable();
    self.overDuedataSource75 = ko.observable();
    self.accountsListLoaded = ko.observable(false);
    self.upcoming = ko.observable(false);
    self.overDue = ko.observable(false);
    self.currentSummaryType = ko.observable("UPCOMING");

    params.baseModel.registerComponent("loan-details", "loans");
    params.baseModel.registerComponent("loan-repayment", "loans");

    const today = params.baseModel.getDate(),
     maxDate = new Date(params.baseModel.getDate());

    maxDate.setDate(maxDate.getDate() + 10);

    InstallmentsDueModel.getLoanAccounts().then(function(data) {

      ko.utils.arrayForEach(data.accounts, function(item) {

        let data;

        if (item.overdueInstallments) {

          ko.utils.arrayForEach(item.overdueInstallments, function(obj) {
            data = getNewKoModel().installmentSummary;
             data.productDTO = item.productDTO;
            data.dueDate = obj.nextInstallmentDate;
            data.accountNo = item.id.displayValue;
            data.partyName = item.partyName;
            data.value = item.id.value;

            if (item.accountNickname) {
              data.accountNickname = item.accountNickname;
            }

            data.amount.currency = obj.principalAmount?obj.principalAmount.currency:null;
            data.amount.amount = obj.principalAmount?obj.principalAmount.amount:0;
            self.overDuedatasource.push(data);

          });

        }

        if (item.upcomingInstallments) {
          ko.utils.arrayForEach(item.upcomingInstallments, function(obj) {
            if (today < new Date(obj.nextInstallmentDate) && new Date(obj.nextInstallmentDate) < maxDate)

            {

              data = getNewKoModel().installmentSummary;
               data.productDTO = item.productDTO;
              data.dueDate = obj.nextInstallmentDate;
              data.accountNo = item.id.displayValue;
              data.partyName = item.partyName;
              data.value = item.id.value;

              if (item.accountNickname) {
                data.accountNickname = item.accountNickname;
              }

              data.amount.currency = obj.principalAmount?obj.principalAmount.currency:null;
              data.amount.amount = obj.principalAmount?obj.principalAmount.amount:0;

              if (item.paymentType === "A") {
                data.paymentMethod = self.nls.InstallmentsDue.yes;
              } else {
                data.paymentMethod = self.nls.InstallmentsDue.no;
              }

              self.upcomingdatasource.push(data);
            }
          });
        }

      });

      self.upcomingdataSource75(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.upcomingdatasource, {
        idAttribute: "accountNo"
      })));

      self.overDuedataSource75(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.overDuedatasource, {
        idAttribute: "accountNo"
      })));

      if (self.currentSummaryType() === "UPCOMING") {
        self.upcoming(true);
        self.overDue(false);
      } else {
        self.overDue(true);
        self.upcoming(false);
      }

      self.accountsListLoaded(true);
    });

    self.showLoanDetails = function(data) {
      params.dashboard.loadComponent("loan-details", data);
    };

    self.payLoan = function(data) {
      params.dashboard.loadComponent("loan-repayment", data);
    };

    self.summaryTypeChanged = function(event) {
      if (event.detail.value === "UPCOMING") {
        self.upcoming(true);
        self.overDue(false);
      } else {
        self.overDue(true);
        self.upcoming(false);
      }
    };
  };
});
