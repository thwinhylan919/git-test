define([
  "ojL10n!resources/nls/invoices-timeline-widget",
  "ojs/ojcore",
  "./model",
  "knockout",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox",
  "ojs/ojlegend"
], function (resourceBundle, oj, Model, ko) {
  "use strict";

  return function (params) {
    const self = this;

    self.nls = resourceBundle;
    self.selectedTab = ko.observable("RECEIVABLES");
    self.totalReceivables = ko.observable(0);
    self.totalPayables = ko.observable(0);
    self.receivablesList = [];
    self.payablesList = [];
    self.currency = ko.observable(params.dashboard.appData.localCurrency);
    self.currencies = ko.observableArray();
    self.currencyLoaded = ko.observable(false);
    self.payablesCount = 0;
    self.receivablesCount = 0;
    self.legendSections = ko.observableArray();
    params.baseModel.registerComponent("view-invoice", "supply-chain-finance");

    self.uiOptions = {
      iconAvailable: false,
      defaultOption: self.selectedTab,
      menuFloat: "left",
      fullWidth: false,
      edge: "top"
    };

    self.showTimeline = ko.observable(false);
    self.showEmptyImage = ko.observable(false);

    self.thresholdValues = [];

    self.qQuery = {
      criteria: [{
        operand: "program.role",
        operator: "ENUM",
        value: ["S"]
      }, {
        operand: "invoiceStatus",
        operator: "IN",
        value: ["ACCEPTED", "RAISED", "FINANCED", "PARTIALLY_FINANCED"]
      }, {
        operand: "paymentStatus",
        operator: "IN",
        value: ["UNPAID", "PART_PAID", "OVERDUE"]
      }]
    };

    self.drawTimeline = function (invoiceList) {

      self.showEmptyImage(false);
      ko.tasks.runEarly();

      if (invoiceList.length > 0) {

        self.timelineData = [{
          dueDate: params.baseModel.getDate(),
          dueAmount: 0,
          invoiceCount: 0,
          invoicePercentage: 0,
          limit: 0,
          color: "#C0392B"
        }, {
          dueDate: new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 30)),
          dueAmount: 0,
          invoiceCount: 0,
          invoicePercentage: 0,
          limit: 0,
          color: "#2E7D32"
        }, {
          dueDate: new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 60)),
          dueAmount: 0,
          invoiceCount: 0,
          invoicePercentage: 0,
          limit: 0,
          color: "#FFE45C"
        }, {
          dueDate: new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 90)),
          dueAmount: 0,
          invoiceCount: 0,
          invoicePercentage: 0,
          limit: 0,
          color: "#205D86"
        }, {
          dueDate: null,
          dueAmount: 0,
          invoiceCount: 0,
          invoicePercentage: 0,
          limit: 0,
          color: "#FF9538"
        }];

        self.thresholdValues = [];

        invoiceList.forEach(function (entry) {
          const currentDate = params.baseModel.getDate(),
            dateToCompare = new Date(entry.invoiceDueDate);

          if (currentDate > dateToCompare) {
            self.timelineData[0].dueAmount = self.timelineData[0].dueAmount + parseFloat(entry.outstandingAmount.amount);
            self.timelineData[0].invoiceCount = self.timelineData[0].invoiceCount + 1;
          } else if (currentDate <= dateToCompare && dateToCompare < self.timelineData[1].dueDate) {
            self.timelineData[1].dueAmount = self.timelineData[1].dueAmount + parseFloat(entry.outstandingAmount.amount);
            self.timelineData[1].invoiceCount = self.timelineData[1].invoiceCount + 1;
          } else if (currentDate < dateToCompare && dateToCompare <= self.timelineData[2].dueDate) {
            self.timelineData[2].dueAmount = self.timelineData[2].dueAmount + parseFloat(entry.outstandingAmount.amount);
            self.timelineData[2].invoiceCount = self.timelineData[2].invoiceCount + 1;
          } else if (currentDate < dateToCompare && dateToCompare <= self.timelineData[3].dueDate) {
            self.timelineData[3].dueAmount = self.timelineData[3].dueAmount + parseFloat(entry.outstandingAmount.amount);
            self.timelineData[3].invoiceCount = self.timelineData[3].invoiceCount + 1;
          } else {
            self.timelineData[4].dueAmount = self.timelineData[4].dueAmount + parseFloat(entry.outstandingAmount.amount);
            self.timelineData[4].invoiceCount = self.timelineData[4].invoiceCount + 1;
          }
        });

        for (let i = 0; i < self.timelineData.length; i++) {
          if (self.selectedTab() === "PAYABLES") {
            self.timelineData[i].invoicePercentage = (self.timelineData[i].invoiceCount / self.payablesCount) * 100;
          } else {
            self.timelineData[i].invoicePercentage = (self.timelineData[i].invoiceCount / self.receivablesCount) * 100;
          }
        }

        self.timelineData[0].limit = self.timelineData[0].invoicePercentage;

        for (let i = 1; i < self.timelineData.length; i++) {
          self.timelineData[i].limit = self.timelineData[i].invoicePercentage + self.timelineData[i - 1].limit;
        }

        for (let i = 0; i < self.timelineData.length; i++) {
          if (self.timelineData[i].invoiceCount > 0) {
            self.thresholdValues.push({
              max: self.timelineData[i].limit,
              color: self.timelineData[i].color
            });
          }

        }

        self.legendSections([{
          items: [{
              text: self.nls.duration1 + "-" + Math.round(self.timelineData[0].invoicePercentage) + "%",
              color: self.timelineData[0].color,
              markerShape: "square"
            },
            {
              text: self.nls.duration2 + "-" + Math.round(self.timelineData[1].invoicePercentage) + "%",
              color: self.timelineData[1].color,
              markerShape: "square"
            },
            {
              text: self.nls.duration3 + "-" + Math.round(self.timelineData[2].invoicePercentage) + "%",
              color: self.timelineData[2].color,
              markerShape: "square"
            },
            {
              text: self.nls.duration4 + "-" + Math.round(self.timelineData[3].invoicePercentage) + "%",
              color: self.timelineData[3].color,
              markerShape: "square"
            },
            {
              text: self.nls.duration5 + "-" + Math.round(self.timelineData[4].invoicePercentage) + "%",
              color: self.timelineData[4].color,
              markerShape: "square"
            }
          ]
        }]);
      } else {
        self.showEmptyImage(true);
      }
    };

    Model.currenciesget().then(function (response) {
      self.currencies(response.currencyList);
      self.currencyLoaded(true);
    });

    Model.getInvoices(JSON.stringify(self.qQuery), self.currency()).then(function (response) {

      self.receivablesList = response.invoices;
      self.receivablesCount = response.invoices.length;

      self.receivablesList.forEach(function (item) {
        self.totalReceivables(self.totalReceivables() + item.outstandingAmount.amount);
      });

      self.qQuery.criteria[0].value = ["B"];

      Model.getInvoices(JSON.stringify(self.qQuery), self.currency()).then(function (response) {

        self.payablesList = response.invoices;
        self.payablesCount = response.invoices.length;

        self.payablesList.forEach(function (item) {
          self.totalPayables(self.totalPayables() + item.outstandingAmount.amount);
        });

        if (self.receivablesList.length === 0) {
          self.drawTimeline(self.payablesList);
          self.selectedTab("PAYABLES");
        } else {
          self.drawTimeline(self.receivablesList);
        }

        self.navBarTabs = [{
            id: "RECEIVABLES",
            label: params.baseModel.format(self.nls.totalReceivables, {
              amount: params.baseModel.formatCurrency(self.totalReceivables(), self.currency())
            })
          },
          {
            id: "PAYABLES",
            label: params.baseModel.format(self.nls.totalPayables, {
              amount: params.baseModel.formatCurrency(self.totalPayables(), self.currency())
            })

          }
        ];

        self.showTimeline(true);

      });
    });

    const selectedItemSubscription = self.selectedTab.subscribe(function (newValue) {

      if (newValue === "RECEIVABLES") {
        self.showTimeline(false);
        ko.tasks.runEarly();
        self.drawTimeline(self.receivablesList);
        self.showTimeline(true);

      } else if (newValue === "PAYABLES") {
        self.showTimeline(false);
        ko.tasks.runEarly();
        self.drawTimeline(self.payablesList);
        self.showTimeline(true);
      }
    });

    function CurrencySelection80ValueChangeHook(newValue) {
      self.totalReceivables(0);
      self.totalPayables(0);
      self.showTimeline(false);
      ko.tasks.runEarly();

      self.qQuery.criteria[0].value = ["S"];

      Model.getInvoices(JSON.stringify(self.qQuery), newValue).then(function (response) {

        self.receivablesList = response.invoices;
        self.receivablesCount = response.invoices.length;

        self.receivablesList.forEach(function (item) {
          self.totalReceivables(self.totalReceivables() + item.outstandingAmount.amount);
        });

        self.qQuery.criteria[0].value = ["B"];

        Model.getInvoices(JSON.stringify(self.qQuery), newValue).then(function (response) {

          self.payablesList = response.invoices;
          self.payablesCount = response.invoices.length;

          self.payablesList.forEach(function (item) {
            self.totalPayables(self.totalPayables() + item.outstandingAmount.amount);
          });

          self.navBarTabs = [{
              id: "RECEIVABLES",
              label: params.baseModel.format(self.nls.totalReceivables, {
                amount: params.baseModel.formatCurrency(self.totalReceivables(), newValue)
              })
            },
            {
              id: "PAYABLES",
              label: params.baseModel.format(self.nls.totalPayables, {
                amount: params.baseModel.formatCurrency(self.totalPayables(), newValue)
              })

            }
          ];

          if (self.receivablesList.length === 0) {
            self.drawTimeline(self.payablesList);
            self.selectedTab("PAYABLES");
          } else {
            self.drawTimeline(self.receivablesList);
            self.selectedTab("RECEIVABLES");
          }

          self.showTimeline(true);

        });

      });

    }

    const CurrencySelection80ValueSubscriber = self.currency.subscribe(CurrencySelection80ValueChangeHook);

    self.viewInvoices = function (data) {
      let role = "S",
        fromDate = "",
        toDate = "";

      if (data.color === "#C0392B") {
        fromDate = null;
        toDate = new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() - 1));
      } else if (data.color === "#2E7D32") {
        fromDate = params.baseModel.getDate();
        toDate = new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 29));
      } else if (data.color === "#FFE45C") {
        fromDate = new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 30));
        toDate = new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 60));
      } else if (data.color === "#205D86") {
        fromDate = new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 61));
        toDate = new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 90));
      } else if (data.color === "#FF9538") {
        fromDate = new Date(params.baseModel.getDate().setDate(params.baseModel.getDate().getDate() + 91));
        toDate = null;
      }

      if (self.selectedTab() === "PAYABLES") {
        role = "B";
      }

      const queryParams = {
        criteria: [{
          operand: "program.role",
          operator: "ENUM",
          value: [role]
        }, {
          operand: "invoiceStatus",
          operator: "IN",
          value: ["ACCEPTED", "RAISED", "FINANCED", "PARTIALLY_FINANCED"]
        }, {
          operand: "paymentStatus",
          operator: "IN",
          value: ["UNPAID", "PART_PAID", "OVERDUE"]
        }]
      };

      if (data.color === "#C0392B") {
        params.dashboard.loadComponent("view-invoice", {
          role: role,
          fromTimeline: true,
          fromDate: fromDate,
          toDate: oj.IntlConverterUtils.dateToLocalIso(toDate),
          currency: self.currency(),
          queryParams: queryParams
        });
      } else if (data.color === "#FF9538") {
        params.dashboard.loadComponent("view-invoice", {
          role: role,
          fromTimeline: true,
          fromDate: oj.IntlConverterUtils.dateToLocalIso(fromDate),
          toDate: toDate,
          currency: self.currency(),
          queryParams: queryParams
        });
      } else {
        params.dashboard.loadComponent("view-invoice", {
          role: role,
          fromTimeline: true,
          fromDate: oj.IntlConverterUtils.dateToLocalIso(fromDate),
          toDate: oj.IntlConverterUtils.dateToLocalIso(toDate),
          currency: self.currency(),
          queryParams: queryParams
        });
      }
    };

    self.dispose = function () {
      CurrencySelection80ValueSubscriber.dispose();
      selectedItemSubscription.dispose();
    };
  };
});