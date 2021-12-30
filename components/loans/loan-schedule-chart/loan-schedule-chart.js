define([
  "knockout",
  "ojL10n!resources/nls/loan-schedule",
  "ojs/ojchart"
], function (ko, locale) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.locale = locale;
    self.scheduleChartData = rootParams.loanScheduleData;
    self.viewportStartGroup = ko.observable();
    self.viewportEndGroup = ko.observable();
    self.installmentcount = ko.observable();
    self.installmentcount = self.scheduleChartData.length;
    self.loanViewDetails = rootParams.data.loanViewDetails();
    self.viewportStartGroup = new Date(self.scheduleChartData[0].installmentDueDate).getTime();
    self.viewportEndGroup = new Date(self.scheduleChartData[self.installmentcount - 1].installmentDueDate).getTime();

    const interestText = self.loanViewDetails && self.loanViewDetails.module === "ISL" ? self.locale.schedule.islamicloansChartInterest : self.locale.schedule.loansChartInterest,
      principalText = self.locale.schedule.loansChartPrincipal,
      outstandingText = self.locale.schedule.loansChartOutstanding,
      itemsA = [],
      generatePortfolioData = function (scheduleChartData) {
        const data = {
          groups: [],
          series: [{
              name: outstandingText,
              items: []
            },
            {
              name: principalText,
              items: [],
              color: "#d37da4"
            },
            {
              name: interestText,
              items: []
            }
          ]
        };

        function formatDate(date) {
          const d = new Date(date);
          let month = "" + (d.getMonth() + 1),
            day = "" + d.getDate();
          const year = d.getFullYear();

          if (month.length < 2) {
            month = "0" + month;
          }

          if (day.length < 2) {
            day = "0" + day;
          }

          return [
            year,
            month,
            day
          ].join("-");
        }

        for (let g = 0; g < scheduleChartData.length; g++) {
          data.series[1].items.push(scheduleChartData[g].principal.amount);
          itemsA[g] = scheduleChartData[g].balance.amount;
          data.series[2].items.push(scheduleChartData[g].interest.amount);
          data.groups.push(formatDate(scheduleChartData[g].installmentDueDate));
        }

        return data;
      },
      variedLineY = {
        referenceObjects: [{
          text: outstandingText,
          type: "line",
          items: itemsA,
          color: "#A0CEEC",
          displayInLegend: "on",
          lineWidth: 2,
          location: "front",
          shortDesc: outstandingText
        }],
        tickLabel: {
          style: ko.toJS("font-size: 11px")
        }
      };

    self.yAxisData = ko.observable(variedLineY);

    const portfolioData = generatePortfolioData(self.scheduleChartData);

    self.lineSeriesValue = ko.observableArray(portfolioData.series);
    self.lineGroupsValue = ko.observableArray(portfolioData.groups);
    self.zoomAndScrollValue = ko.observable("live");
    self.overviewValue = ko.observable("on");
    self.scrollbarValue = ko.observable("on");
    self.zoomValue = ko.observable("live");
  };
});