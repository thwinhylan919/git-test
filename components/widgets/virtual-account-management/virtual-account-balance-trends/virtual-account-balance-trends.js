define(["ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/virtual-account-balance-trends",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojchart"
], function (oj, ko, $, VirtualAccountBalanceTrendsModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;
    let valueDatedBalance = {};

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.viewLineChart = ko.observable(false);
    self.lineSeries = ko.observable([]);
    self.lineGroups = ko.observable([]);
    self.orientationValue = ko.observable("vertical");
    self.xTitle = self.resource.widgetTitle.xAxisTitle;
    self.xAxisLineColor = ko.observable("#9E9E9E");
    self.xAxisLineWidth = ko.observable(1);
    self.yTitle = self.resource.yAxisTitle;
    self.yMajorTickColor = ko.observable("#C4CED7");
    self.yMajorTickWidth = ko.observable(1);
    self.yMajorTickStyle = ko.observable("solid");
    self.yTickLabelPosition = ko.observable("outside");
    self.currencyDetails = ko.observableArray([]);
    self.selectedCurrency = ko.observable();
    self.currencyDetailsLoaded = ko.observable(false);
    self.entityDetails = ko.observable([]);
    self.selectedEntity = ko.observable();
    self.entityDetailsLoaded = ko.observable(false);
    self.showVirtualEntityInfo = ko.observable(false);
    self.virtualEntityName = ko.observable();
    self.axisLabelFontSize = "0.9rem";

    const lineChartColor = ["#33C5CF", "#14BA92", "#FAC85A", "#256c9a", "#A65496"],
      limit = "0",
      offset = "0";

    self.xAxis = ko.pureComputed(function () {
      return {
        title: self.xTitle,
        titleStyle: {
          fontSize: self.axisLabelFontSize
        },
        axisLine: {
          lineColor: self.xAxisLineColor(),
          lineWidth: self.xAxisLineWidth()
        }
      };
    });

    self.yAxis = ko.pureComputed(function () {
      return {
        title: self.yTitle,
        titleStyle: {
          fontSize: self.axisLabelFontSize
        },
        majorTick: {
          lineColor: self.yMajorTickColor(),
          lineWidth: self.yMajorTickWidth(),
          lineStyle: self.yMajorTickStyle()
        },
        tickLabel: {
          position: self.yTickLabelPosition()
        }
      };
    });

    const converter = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({
        pattern: "dd MMM"
      }),
      linechartData = function () {
        self.lineSeries().length = 0;
        self.lineGroups().length = 0;

        for (let i = 0; i < valueDatedBalance.aggregatedData.groups[0].intervals.length; i++) {
          self.lineGroups().push(converter.format(valueDatedBalance.aggregatedData.groups[0].intervals[i].date));
        }

        for (let i = 0; i < valueDatedBalance.aggregatedData.groups.length; i++) {
          self.lineSeries().push({
            name: valueDatedBalance.aggregatedData.groups[i].id.displayValue,
            items: [],
            color: lineChartColor[i],
            markerDisplayed: "on",
            markerShape: "diamond",
            lineWidth: 4
          });

          for (let j = 0; j < valueDatedBalance.aggregatedData.groups[i].intervals.length; j++) {
            self.lineSeries()[i].items.push(valueDatedBalance.aggregatedData.groups[i].intervals[j].amount.amount);
          }
        }

        self.viewLineChart(true);

      },
      getQueryAsString = function () {
        const qQuery = {
          criteria: [{
            operand: "status",
            operator: "EQUALS",
            value: ["O"]
          }]
        };

        return JSON.stringify(qQuery);
      };

    VirtualAccountBalanceTrendsModel.fetchVirtualEntities(getQueryAsString(), null, 0).then(function (data) {
      if (data && data.virtualEntities && data.virtualEntities.length > 0) {
        data.virtualEntities.sort(function (a, b) {
          return a.virtualEntityId.localeCompare(b.virtualEntityId);
        });

        self.entityDetails(data.virtualEntities);
      }

      self.entityDetailsLoaded(true);
    }).catch(function () {
      self.entityDetailsLoaded(true);
    });

    VirtualAccountBalanceTrendsModel.fetchCurrency(limit, offset).then(function (data) {
      if (data && data.jsonNode && data.jsonNode.data && data.jsonNode.data.length > 0) {
        data.jsonNode.data.sort(function (a, b) {
          return a.currencyCode.localeCompare(b.currencyCode);
        });

        for (let i = 0; i < data.jsonNode.data.length; i++) {
          self.currencyDetails().push({
            value: data.jsonNode.data[i].currencyCode,
            label: data.jsonNode.data[i].currencyCode
          });
        }
      }

      self.currencyDetailsLoaded(true);
    }).catch(function () {
      self.currencyDetailsLoaded(true);
    });

    const fetchValueDatedBalances = function () {
      if (self.selectedEntity() && self.selectedCurrency()) {

        const q = {
          criteria: []
        };

        q.criteria.push({
          operand: "virtualEntityId",
          operator: "CONTAINS",
          value: [self.selectedEntity()]
        });

        q.criteria.push({
          operand: "vStatus",
          operator: "EQUALS",
          value: ["O"]
        });

        q.criteria.push({
          operand: "availableBalance.currency",
          operator: "CONTAINS",
          value: [self.selectedCurrency()]
        });

        const getSortParams = function getSortParams() {
          return JSON.stringify([{
            sortBy: "availableBalance.amount",
            sortOrder: "DESC"
          }]);
        };

        VirtualAccountBalanceTrendsModel.fetchValueDatedBalances(JSON.stringify(q), getSortParams(), 5, "valueDated").then(function success(response) {
          if (response && response.aggregatedData && response.aggregatedData.groups && response.aggregatedData.groups.length !== 0) {
            valueDatedBalance = response;
            linechartData();
          } else {
            $("#balanceTrendsErrorPopUp").trigger("openModal");
          }
        }).catch(function () {
          $("#balanceTrendsErrorPopUp").trigger("openModal");
        });
      }

    };

    self.selectDifferentCurrency = function (event) {
      self.viewLineChart(false);
      self.selectedCurrency(event.detail.value);
      fetchValueDatedBalances();
    };

    self.selectDifferentEntity = function (event) {
      self.viewLineChart(false);
      self.selectedEntity(event.detail.value);

      const tempArray = self.entityDetails().filter(function (item) {
        return item.virtualEntityId === self.selectedEntity();
      });

      if (tempArray.length > 0) {
        self.virtualEntityName(tempArray[0].virtualEntityName);
        self.showVirtualEntityInfo(true);
      }

      fetchValueDatedBalances();
    };

    self.closePopUp = function () {
      $("#balanceTrendsErrorPopUp").trigger("closeModal");
    };
  };
});