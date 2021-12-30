define([
    "knockout",
    "ojL10n!resources/nls/user-limit",
    "ojs/ojchart",
    "ojs/ojknockout-validation"
  ], function (ko, resourceBundle) {
    "use strict";

    return function (rootParams) {
      const self = this;

      self.nls = resourceBundle;
      self.data = ko.observable(rootParams.data);
      self.accessPointValue = ko.observable(rootParams.accessPointValue);
      self.flagCorp = rootParams.flag ? ko.observable(rootParams.flag) : ko.observable(false);
      self.innerRadius = ko.observable(0.95);
      self.previousLabel = ko.observable();

      self.changeCenterLabel = function (number, index, data) {
        if (index === 0) {
          if (number === "1") {
            self.previousLabel(self.centerLabel1());

            self.centerLabel1({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.utilizedPieChart, {
                utilized: rootParams.baseModel.formatCurrency(self.data().periodicLimitDaily.utilizedDailyAmount, data.currency),
                total: rootParams.baseModel.formatCurrency(self.data().periodicLimitDaily.maxAmount, data.currency)
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "2") {
            self.previousLabel(self.centerLabel2());

            self.centerLabel2({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.utilizedPieChart, {
                utilized: self.data().periodicLimitDaily.utilizedDailyCount,
                total: self.data().periodicLimitDaily.maxCount
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "3") {
            self.previousLabel(self.centerLabel3());

            self.centerLabel3({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.utilizedPieChart, {
                utilized: rootParams.baseModel.formatCurrency(self.data().periodicLimitMonthly.utilizedMonthlyAmount, data.currency),
                total: rootParams.baseModel.formatCurrency(self.data().periodicLimitMonthly.maxAmount, data.currency)
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "4") {
            self.previousLabel(self.centerLabel4());

            self.centerLabel4({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.utilizedPieChart, {
                utilized: self.data().periodicLimitMonthly.utilizedMonthlyCount,
                total: self.data().periodicLimitMonthly.maxCount
              }),
              style: self.labelStyleOnHover()
            });
          }
        } else if (index === 1) {
          if (number === "1") {
            self.previousLabel(self.centerLabel1());

            self.centerLabel1({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.availablePieChart, {
                available: rootParams.baseModel.formatCurrency((self.data().periodicLimitDaily.maxAmount - self.data().periodicLimitDaily.utilizedDailyAmount).toString(), data.currency),
                total: rootParams.baseModel.formatCurrency(self.data().periodicLimitDaily.maxAmount, data.currency)
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "2") {
            self.previousLabel(self.centerLabel2());

            self.centerLabel2({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.availablePieChart, {
                available: (self.data().periodicLimitDaily.maxCount - self.data().periodicLimitDaily.utilizedDailyCount).toString(),
                total: self.data().periodicLimitDaily.maxCount
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "3") {
            self.previousLabel(self.centerLabel3());

            self.centerLabel3({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.availablePieChart, {
                available: rootParams.baseModel.formatCurrency((self.data().periodicLimitMonthly.maxAmount - self.data().periodicLimitMonthly.utilizedMonthlyAmount).toString(), data.currency),
                total: rootParams.baseModel.formatCurrency(self.data().periodicLimitMonthly.maxAmount, data.currency)
              }),
              style: self.labelStyleOnHover()
            });
          } else if (number === "4") {
            self.previousLabel(self.centerLabel4());

            self.centerLabel4({
              text: rootParams.baseModel.format(self.nls.limitsInquiry.messages.availablePieChart, {
                available: (self.data().periodicLimitMonthly.maxCount - self.data().periodicLimitMonthly.utilizedMonthlyCount).toString(),
                total: self.data().periodicLimitMonthly.maxCount
              }),
              style: self.labelStyleOnHover()
            });
          }
        }

        ko.tasks.runEarly();
      };

      self.changeCenterLabelOut = function (number) {
        if (number === "1") {
          self.centerLabel1(self.previousLabel());
        } else if (number === "2") {
          self.centerLabel2(self.previousLabel());
        } else if (number === "3") {
          self.centerLabel3(self.previousLabel());
        } else if (number === "4") {
          self.centerLabel4(self.previousLabel());
        }

        ko.tasks.runEarly();
      };

      self.labelStyleOnHover = ko.observable({
        color: "#2c3251"
      });

      self.labelStyle = ko.observable({
        color: "#2c3251"
      });

      if (self.data() && self.data().periodicLimitDaily) {
        const dailyCountPercent = (self.data().periodicLimitDaily.utilizedDailyCount / self.data().periodicLimitDaily.maxCount * 100) > 100 ? 100 : self.data().periodicLimitDaily.utilizedDailyCount / self.data().periodicLimitDaily.maxCount * 100,
          dailyAmountPercent = (self.data().periodicLimitDaily.utilizedDailyAmount / self.data().periodicLimitDaily.maxAmount * 100) > 100 ? 100 : self.data().periodicLimitDaily.utilizedDailyAmount / self.data().periodicLimitDaily.maxAmount * 100;

        self.centerLabel1 = ko.observable({
          text: dailyAmountPercent.toFixed(0).toString() + self.nls.limitsInquiry.messages.labelGraph,
          style: self.labelStyle()
        });

        self.centerLabel2 = ko.observable({
          text: dailyCountPercent.toFixed(0).toString() + (self.data().periodicLimitDaily.utilizedDailyCount ? self.nls.limitsInquiry.messages.labelGraph : "%"),
          style: self.labelStyle()
        });

        const pieDailyAmountAvailable = self.data().periodicLimitDaily.maxAmount - self.data().periodicLimitDaily.utilizedDailyAmount < 0 ? 0 : self.data().periodicLimitDaily.maxAmount - self.data().periodicLimitDaily.utilizedDailyAmount,
          pieSeriesDailyAmount = [{
              name: self.nls.limitsInquiry.messages.utilized,
              items: [self.data().periodicLimitDaily.utilizedDailyAmount],
              color: "#961c74",
              currency: self.data().periodicLimitDaily.bankAllocatedCurrency
            },
            {
              name: self.nls.limitsInquiry.messages.available,
              items: [pieDailyAmountAvailable],
              color: "#29c3c3",
              currency: self.data().periodicLimitDaily.bankAllocatedCurrency
            }
          ],
          pieDailyCountAvailable = self.data().periodicLimitDaily.maxCount - self.data().periodicLimitDaily.utilizedDailyCount < 0 ? 0 : self.data().periodicLimitDaily.maxCount - self.data().periodicLimitDaily.utilizedDailyCount,
          pieSeriesDailyCount = [{
              name: self.nls.limitsInquiry.messages.utilized,
              items: [self.data().periodicLimitDaily.utilizedDailyCount],
              color: "#961c74",
              currency: self.data().periodicLimitDaily.bankAllocatedCurrency
            },
            {
              name: self.nls.limitsInquiry.messages.available,
              items: [pieDailyCountAvailable],
              color: "#29c3c3",
              currency: self.data().periodicLimitDaily.bankAllocatedCurrency
            }
          ];

        self.pieSeriesDailyAmount = ko.observableArray(pieSeriesDailyAmount);
        self.pieSeriesDailyCount = ko.observableArray(pieSeriesDailyCount);
      }

      if (self.data() && self.data().periodicLimitMonthly) {
        const monthlyAmountPercent = (self.data().periodicLimitMonthly.utilizedMonthlyAmount / self.data().periodicLimitMonthly.maxAmount * 100) > 100 ? 100 : self.data().periodicLimitMonthly.utilizedMonthlyAmount / self.data().periodicLimitMonthly.maxAmount * 100;

        self.centerLabel3 = ko.observable({
          text: monthlyAmountPercent.toFixed(0).toString() + (self.data().periodicLimitMonthly.utilizedMonthlyAmount ? self.nls.limitsInquiry.messages.labelGraph : "%"),
          style: self.labelStyle()
        });

        const monthlyCountPercent = (self.data().periodicLimitMonthly.utilizedMonthlyCount / self.data().periodicLimitMonthly.maxCount * 100) > 100 ? 100 : self.data().periodicLimitMonthly.utilizedMonthlyCount / self.data().periodicLimitMonthly.maxCount * 100;

        self.centerLabel4 = ko.observable({
          text: monthlyCountPercent.toFixed(0).toString() + (self.data().periodicLimitMonthly.utilizedMonthlyCount ? self.nls.limitsInquiry.messages.labelGraph : "%"),
          style: self.labelStyle()
        });

        const pieMonthlyAmountAvailable = self.data().periodicLimitMonthly.maxAmount - self.data().periodicLimitMonthly.utilizedMonthlyAmount < 0 ? 0 : self.data().periodicLimitMonthly.maxAmount - self.data().periodicLimitMonthly.utilizedMonthlyAmount,
          pieSeriesMonthlyAmount = [{
              name: self.nls.limitsInquiry.messages.utilized,
              items: [self.data().periodicLimitMonthly.utilizedMonthlyAmount],
              color: "#961c74",
              currency: self.data().periodicLimitMonthly.bankAllocatedCurrency
            },
            {
              name: self.nls.limitsInquiry.messages.available,
              items: [pieMonthlyAmountAvailable],
              color: "#29c3c3",
              currency: self.data().periodicLimitMonthly.bankAllocatedCurrency
            }
          ],
          pieMonthlyCountAvailable = self.data().periodicLimitMonthly.maxCount - self.data().periodicLimitMonthly.utilizedMonthlyCount < 0 ? 0 : self.data().periodicLimitMonthly.maxCount - self.data().periodicLimitMonthly.utilizedMonthlyCount,
          pieSeriesMonthlyCount = [{
              name: self.nls.limitsInquiry.messages.utilized,
              items: [self.data().periodicLimitMonthly.utilizedMonthlyCount],
              color: "#961c74",
              currency: self.data().periodicLimitMonthly.bankAllocatedCurrency
            },
            {
              name: self.nls.limitsInquiry.messages.available,
              items: [pieMonthlyCountAvailable],
              color: "#29c3c3",
              currency: self.data().periodicLimitMonthly.bankAllocatedCurrency
            }
          ];

        self.pieSeriesMonthlyAmount = ko.observableArray(pieSeriesMonthlyAmount);
        self.pieSeriesMonthlyCount = ko.observableArray(pieSeriesMonthlyCount);
      }

      const pieGroups = ["GROUP"];

      self.pieGroupsValue = ko.observableArray(pieGroups);
    };
  });