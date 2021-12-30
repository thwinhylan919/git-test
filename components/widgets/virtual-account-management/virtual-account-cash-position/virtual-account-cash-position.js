define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/virtual-account-cash-position",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojchart",
  "ojs/ojanimation",
  "ojs/ojnavigationlist",
  "ojs/ojarraytabledatasource",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"

], function (oj, ko, $, CashPositionModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.resource = resourceBundle;
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    params.baseModel.registerComponent("virtual-account-transaction-details", "virtual-account-management");
    params.baseModel.registerComponent("virtual-account-search", "virtual-account-management");
    self.virtualAccountData = ko.observable([]);
    self.virtualAccountLoaded = ko.observable(false);
    self.selectedComponent = ko.observable();
    self.selectedItem = ko.observable();
    self.loadAccountPanel = ko.observable(false);
    self.accountNumbers = ko.observableArray();
    self.totalAccounts = ko.observable();
    self.totalBalance = ko.observable();
    self.virtualAccountTotal = ko.observable();
    self.currency = ko.observable();
    self.menuOptions = ko.observableArray([]);
    self.orientationValue = ko.observable("horizontal");
    self.selectionValue = ko.observable("single");
    self.barSeriesValue = ko.observable([]);
    self.groups = ko.observable([]);
    self.viewChart = ko.observable(false);
    self.yMajorTickWidth = ko.observable(1);
    self.yTickLabelPosition = ko.observable("vertical");
    self.yMajorTickStyle = ko.observable("solid");
    self.stackLabelValue = ko.observable("on");
    self.stackValue = ko.observable("on");
    self.xTitle = ko.observable(self.resource.labels.xAxisTitle);
    self.xAxisLineColor = ko.observable("#9E9E9E");
    self.xAxisLineWidth = ko.observable(1);
    self.currencyDetails = ko.observableArray([]);
    self.selectedCurrency = ko.observable();
    self.currencyDetailsLoaded = ko.observable(false);
    self.entityDetails = ko.observable([]);
    self.selectedEntity = ko.observable();
    self.entityDetailsLoaded = ko.observable(false);
    self.showVirtualEntityInfo = ko.observable(false);
    self.virtualEnitiyName = ko.observable();
    self.limit = 0;
    self.offset = 0;
    self.axisLabelFontSize = "0.9rem";
    self.rangeData = ko.observable([]);

    let currencyRange = [];
    const rangeData = [],
      createBalanceRange = function (rangeString) {

        const rangeList = rangeString.propertyValue.split("~");

        for (let index = 0; index <= rangeList.length; index++) {
          rangeData.push([]);
        }

        let i;
        const tempArray = [];

        for (i = 0; i < rangeList.length - 1; i++) {
          tempArray.push([parseInt(rangeList[i]), parseInt(rangeList[i + 1])]);
        }

        return tempArray;
      };

    CashPositionModel.maintenances().then(function (data) {
      if (data && data.configurationDetails) {
        currencyRange = createBalanceRange(data.configurationDetails.find(function (e) {
          return e.propertyId === "VAM_CASH_POS_BAL_RANGE";
        }));
      }
    });

    const getQueryAsString = function (method) {
      const qQuery = {
        criteria: []
      };

      if (method === "getEntityListSummary") {
        qQuery.criteria.push({
          operand: "status",
          operator: "EQUALS",
          value: ["O"]
        });
      } else if (method === "fetchVirtualAccountListSummary") {
        qQuery.criteria.push({
          operand: "virtualEntityId",
          operator: "CONTAINS",
          value: [self.selectedEntity()]
        });

        qQuery.criteria.push({
          operand: "vStatus",
          operator: "EQUALS",
          value: ["O"]
        });

        qQuery.criteria.push({
          operand: "availableBalance.currency",
          operator: "CONTAINS",
          value: [self.selectedCurrency()]
        });
      }

      return qQuery.criteria.length !== 0 ? JSON.stringify(qQuery) : undefined;
    };

    self.fetchGraphData = function () {
      self.viewChart(false);
      ko.tasks.runEarly();
      self.barSeriesValue([]);
      self.groups([]);
      self.menuOptions([]);

      if (self.selectedCurrency() && self.selectedEntity() && currencyRange.length) {

        CashPositionModel.fetchVirtualAccountListSummary(getQueryAsString("fetchVirtualAccountListSummary"), 0).then(function (data) {
          let totalBalance = 0;

          if (data && data.accounts && data.accounts.length > 0) {
            self.totalAccounts(data.accounts.length);
            self.currency(data.accounts[0].availableBalance.currency);

            const converterFactory = oj.Validation.converterFactory("number");

            for (let i = 0; i < data.accounts.length; i++) {
              self.virtualAccountData(data.accounts);
              self.virtualAccountLoaded(true);
              totalBalance += data.accounts[i].availableBalance.amount;

              if (data.accounts[i].availableBalance.amount < currencyRange[0][0]) {
                rangeData[0].push(data.accounts[i]);
              }

              for (let index = 0; index < currencyRange.length; index++) {
                if (data.accounts[i].availableBalance.amount >= currencyRange[index][0] && data.accounts[i].availableBalance.amount < currencyRange[index][1]) {
                  rangeData[index + 1].push(data.accounts[i]);
                }
              }

              if (data.accounts[i].availableBalance.amount >= currencyRange[currencyRange.length - 1][1]) {
                rangeData[rangeData.length - 1].push(data.accounts[i]);
              }
            }

            self.rangeData(JSON.parse(JSON.stringify(rangeData)));

            self.groups().push(params.baseModel.format(self.resource.labels.aboveRange, {
              value: currencyRange[currencyRange.length - 1][1] / 1000
            }));

            self.menuOptions().push(currencyRange[currencyRange.length - 1][1] / 1000);

            for (let index = currencyRange.length - 1; index >= 0; index--) {
              self.groups().push(params.baseModel.format(self.resource.labels.amountRange, {
                from: currencyRange[index][0] / 1000,
                to: currencyRange[index][1] / 1000
              }));

              self.menuOptions().push([currencyRange[index][0] / 1000, currencyRange[index][1] / 1000]);
            }

            self.groups().push(params.baseModel.format(self.resource.labels.belowRange, {
              value: currencyRange[0][0] / 1000
            }));

            self.menuOptions().push(currencyRange[0][0] / 1000);

            self.numberConverter = converterFactory.createConverter({
              style: "decimal",
              decimalFormat: "short"
            });

            self.totalBalance(totalBalance);

            const colorArray = ["#33C5CF", "#14BA92", "#FAC85A", "#256c9a", "#A65496"],
              items = [];

            for (let index = rangeData.length - 1; index >= 0; index--) {
              items.push({
                value: rangeData[index].length,
                label: rangeData[index].length,
                color: colorArray[index % colorArray.length]
              });

              rangeData[index] = [];
            }

            self.barSeriesValue().push({
              items: items
            });

            self.viewChart(true);
          } else {
            self.viewChart(false);
            $("#cashPositionErrorPopUp").trigger("openModal");
          }
        });
      }

    };

    CashPositionModel.getEntityListSummary(getQueryAsString("getEntityListSummary"), null, 0).then(function (data) {
      let virtualEntityList = [];

      if (data && data.virtualEntities && data.virtualEntities.length > 0) {
        virtualEntityList = data.virtualEntities;

        virtualEntityList.sort(function (a, b) {
          return a.virtualEntityId.localeCompare(b.virtualEntityId);
        });

        self.entityDetails(virtualEntityList);
      }

      self.entityDetailsLoaded(true);
    }).catch(function () {
      self.entityDetailsLoaded(true);
    });

    CashPositionModel.fetchCurrency(self.limit, self.offset).then(function (data) {
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

    self.selectDifferentCurrency = function (event) {
      self.selectedCurrency(event.detail.value);
      self.fetchGraphData();
    };

    self.selectDifferentEntity = function (event) {
      self.selectedEntity(event.detail.value);

      const currentEntity = self.entityDetails().find(function (item) {
        return item.virtualEntityId === self.selectedEntity();
      });

      if (currentEntity) {
        self.virtualEnitiyName(currentEntity.virtualEntityName);
        self.showVirtualEntityInfo(true);
      }

      self.fetchGraphData();
    };

    self.selectedItem = ko.observable("0");
    self.selectedComponent("0");

    self.yAxis = ko.pureComputed(function () {

      return {
        title: self.resource.labels.axisTitle,
        titleStyle: {
          fontSize: self.axisLabelFontSize
        },
        majorTick: {
          lineWidth: self.yMajorTickWidth()
        },
        tickLabel: {
          position: self.yTickLabelPosition()
        }
      };
    });

    self.xAxis = ko.pureComputed(function () {
      return {
        title: self.xTitle(),
        titleStyle: {
          fontSize: self.axisLabelFontSize
        },
        dataMin: 0,
        minStep: 1,
        axisLine: {
          lineColor: self.xAxisLineColor(),
          lineWidth: self.xAxisLineWidth()
        }
      };
    });

    self.selectionListener = function (event) {
      if (event.detail.selectionData.length > 0) {
        params.dashboard.openRightPanel("virtual-account-transaction-details", {
          selectedTab: event.detail.selectionData[0].groupData,
          selectedEntity: self.selectedEntity(),
          selectedCurrency: self.selectedCurrency(),
          rangeData: self.rangeData(),
          groups: self.groups(),
          currencyRange: currencyRange,
          menuOptions: self.menuOptions()
        }, self.resource.header.headerValue);
      }

    };

    self.viewAll = function () {
      params.dashboard.loadComponent("virtual-account-search");
    };

    self.closePopUp = function () {
      $("#cashPositionErrorPopUp").trigger("closeModal");
    };
  };
});