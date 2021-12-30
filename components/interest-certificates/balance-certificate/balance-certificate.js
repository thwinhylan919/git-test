define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/interest-certificates",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojpopup",
  "ojs/ojradioset",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojlabel",
  "ojs/ojlistview",
  "ojs/ojvalidationgroup",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function(oj, ko, DDAModel, resourceBundle) {
  "use strict";

  /**
   * Return function - description.
   *
   * @param  {type} rootParams - Description.
   * @return {type}            Description.
   */
  return function(rootParams) {
    const self = this;

    self.rootParams = rootParams;
    self.resourceBundle = resourceBundle;
    self.viewBalanceCertificate = ko.observable(false);
    self.period = ko.observable();
    self.menuItems = ko.observableArray();
    self.mediatypeLoaded = ko.observable(false);
    self.optionsLoaded = ko.observable(false);
    rootParams.dashboard.headerName(self.resourceBundle.labels.balanceCertificate);
    self.balanceOn = ko.observable();

    self.payload = {
      month : ko.observable(null),
      year : ko.observable(null)
    };

    self.casaAccountData = ko.observableArray([]);
    self.tdAccountData = ko.observableArray([]);

    self.dataSource = ko.observable(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {
      idAttribute: ["accountNo"]
    })));

    self.tddataSource = ko.observable(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {
      idAttribute: ["accountNo"]
    })));

    const months = ["January", "February", "March","April", "May", "June", "July", "August", "September","October", "November", "December"];

    self.optionValues = ko.observableArray([]);

    self.setOptionData = function(){
      DDAModel.fetchCurrentDate().done(function(data) {
          self.todayDate = new Date(data.currentDate.valueDate);

          const today = self.todayDate,
          date = new Date(today);
          let optionLength = 0;

          date.setFullYear(date.getFullYear() - 1);

          while ((today.getTime() >= date.getTime()) && optionLength < 6) {
            self.optionValues.push({
              key: today.getMonth(),
              value: months[today.getMonth()] + "-" + today.getFullYear(),
              month:today.getMonth(),
              year:today.getFullYear()
            });

            today.setMonth(today.getMonth() - 1);
            optionLength = optionLength + 1;
          }

          self.payload.month(self.optionValues()[0].month+1);
          self.payload.year(self.optionValues()[0].year);
          self.balanceOn(self.optionValues()[0].value);
          self.optionsLoaded(true);
      });
    };

    self.setOptionData();

    self.onPeriodSelected = function(event) {
        const period = event.detail.value, data = self.optionValues().filter(function(data) {
          return data.key === period;
        });

        if (data && data.length > 0) {
          self.payload.month(data[0].month+1);
          self.payload.year(data[0].year);
          self.balanceOn(data[0].value);
        }

        self.viewBalanceCertificate(false);
    };

    DDAModel.fetchMediaType().done(function(data) {
      self.mediatypeLoaded(false);

      for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.menuItems.push({
          text: data.enumRepresentations[0].data[i].code,
          value: data.enumRepresentations[0].data[i].value,
          description: data.enumRepresentations[0].data[i].description
        });
      }

      self.mediatypeLoaded(true);
    });

    self.download = function() {
      DDAModel.fetchPDF(ko.mapping.toJS(self.payload));
    };

    self.viewCertificate = function() {
      self.viewBalanceCertificate(false);
      self.casaAccountData.removeAll();

      DDAModel.getBalanceCertificateData(ko.mapping.toJS(self.payload)).done(function(data) {

        for(let i=0; i < data.demandDeposits.length; i++){
            self.casaAccountData.push({
              accountNo:data.demandDeposits[i].account.displayValue,
              currency:data.demandDeposits[i].balance.currency,
              balance:rootParams.baseModel.formatCurrency(data.demandDeposits[i].balance.amount,data.demandDeposits[i].balance.currency)
            });
        }

        self.dataSource(new oj.ArrayTableDataSource(self.casaAccountData(), {
          idAttribute: ["accountNo"]
        }));

        self.tdAccountData.removeAll();

        for(let i=0; i < data.termDeposits.length; i++){

             self.tdAccountData.push({
               accountNo: data.termDeposits[i].account.displayValue,
               depositNo:  data.termDeposits[i].depostiNumber ? data.termDeposits[i].depostiNumber : 1,
               currency: data.termDeposits[i].balance.currency,
               balance: rootParams.baseModel.formatCurrency(data.termDeposits[i].balance.amount,data.termDeposits[i].balance.currency)
             });

          }

        self.tddataSource(new oj.ArrayTableDataSource(self.tdAccountData(), {
          idAttribute: ["accountNo"]
        }));

        self.viewBalanceCertificate(true);
      });
    };
  };
});
