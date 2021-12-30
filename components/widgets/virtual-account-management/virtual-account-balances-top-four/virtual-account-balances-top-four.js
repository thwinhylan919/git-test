define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/virtual-account-balances-top-four",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojchart",
  "ojs/ojselectcombobox"
], function (oj, ko, $, VirtualAccountBalancesModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.viewChart = ko.observable(false);
    self.virtualAccountData = ko.observableArray([]);
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.limit = "0";
    self.offset = "0";
    self.barSeries = ko.observable([]);
    self.barGroups = ko.observable([]);
    self.orientationValue = ko.observable("vertical");
    self.barChartColor = ko.observableArray(["#33C5CF", "#14BA92", "#FAC85A", "#256c9a", "#A65496"]);
    self.xTitle = ko.observable(self.resource.xAxisTitle);
    self.xAxisLineColor = ko.observable("#9E9E9E");
    self.xAxisLineWidth = ko.observable(1);
    self.yTitle = ko.observable(self.resource.yAxisTitle);
    self.yMajorTickColor = ko.observable("#C4CED7");
    self.yMajorTickWidth = ko.observable(1);
    self.yMajorTickStyle = ko.observable("solid");
    self.yTickLabelPosition = ko.observable("outside");
    self.currencyDetails = ko.observableArray([]);
    self.currenciesLoaded = ko.observable(false);
    self.virtualEntities = ko.observableArray([]);
    self.entitiesLoaded = ko.observable(false);
    self.entityDetails = ko.observable([]);
    self.selectedEntity = ko.observable();
    self.virtualEntityName = ko.observable();
    self.showVirtualEntityInfo = ko.observable(false);
    self.currentCurrency = ko.observable();
    self.noVirtualAccounts = ko.observable(false);
    self.topN = 5;
    self.status = "O";
    self.axisLabelFontSize = "0.9rem";

    self.validData = function (data) {
      return data && data.jsonNode && data.jsonNode.data && data.jsonNode.data.length > 0;
    };

    const getQueryAsString = function (method) {
      const qQuery = {
        criteria: []
      };

      if (method === "fetchVirtualAccountSummaryList") {
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
          value: [self.currentCurrency()]
        });
      } else if (method === "fetchEntityListSummary") {
        qQuery.criteria.push({
          operand: "status",
          operator: "EQUALS",
          value: ["O"]
        });
      }

      return JSON.stringify(qQuery);
    };

    VirtualAccountBalancesModel.fetchEntityListSummary(getQueryAsString("fetchEntityListSummary"), null, 0).then(function (data) {
      if (data && data.virtualEntities && data.virtualEntities.length > 0) {
        data.virtualEntities.sort(function (a, b) {
          return a.virtualEntityId.localeCompare(b.virtualEntityId);
        });

        self.virtualEntities(data.virtualEntities);

        for (let i = 0; i < data.virtualEntities.length; i++) {
          self.entityDetails().push({
            virtualEntityId: data.virtualEntities[i].virtualEntityId,
            virtualEntityName: data.virtualEntities[i].virtualEntityName
          });
        }
      }

      self.entitiesLoaded(true);
    }).catch(function () {
      self.entitiesLoaded(true);
    });

    VirtualAccountBalancesModel.fetchCurrencies(self.limit, self.offset).then(function (data) {
      if (self.validData(data)) {
        for (let i = 0; i < data.jsonNode.data.length; i++) {
          if (data.jsonNode.data[i].currencyName && data.jsonNode.data[i].currencyName) {
            data.jsonNode.data.sort(function (a, b) {
              return a.currencyCode.localeCompare(b.currencyCode);
            });

            self.currencyDetails().push({
              ccyCode: data.jsonNode.data[i].currencyCode,
              ccyName: data.jsonNode.data[i].currencyName
            });
          }
        }
      }

      self.currenciesLoaded(true);
    }).catch(function () {
      self.currenciesLoaded(true);
    });

    const getSortParams = function getSortParams() {
        return JSON.stringify([{
          sortBy: "availableBalance.amount",
          sortOrder: "DESC"
        }]);
      },
      getAccountsBy = function () {
        if (self.selectedEntity() && self.currentCurrency()) {
          VirtualAccountBalancesModel.fetchVirtualAccountSummaryList(getQueryAsString("fetchVirtualAccountSummaryList"), getSortParams(), self.topN).then(function (data) {
            self.barGroups().length = 0;
            self.barSeries().length = 0;

            if (data && data.accounts && data.accounts.length > 0) {
              self.barSeries().push({
                items: []
              });

              for (let i = 0; i < self.topN; i++) {
                if (data.accounts[i] !== undefined) {
                  self.barGroups().push(data.accounts[i].virtualAccountName);

                  self.barSeries()[0].items.push({
                    value: data.accounts[i].availableBalance.amount,
                    color: self.barChartColor()[i % self.topN]
                  });

                  const converterFactory = oj.Validation.converterFactory("number");

                  self.currencyConverter = converterFactory.createConverter({
                    style: "currency",
                    currency: self.currentCurrency()
                  });
                }
              }

              self.noVirtualAccounts(false);
              self.viewChart(true);
            } else {
              self.viewChart(false);
              self.noVirtualAccounts(true);
              $("#Top5VirtualAccountBalancesErrorPopUp").trigger("openModal");
            }
          });
        }
      };

    self.selectedCurrencyChangeHandler = function (event) {
      self.viewChart(false);
      self.noVirtualAccounts(false);
      self.currentCurrency(event.detail.value);
      getAccountsBy();
    };

    self.selectedEntityChangeHandler = function (event) {
      self.selectedEntity(event.detail.value);
      self.viewChart(false);
      self.noVirtualAccounts(false);

      const tempArray = self.entityDetails().filter(function (item) {
        return item.virtualEntityId === self.selectedEntity();
      });

      if (tempArray.length > 0) {
        self.virtualEntityName(tempArray[0].virtualEntityName);
        self.showVirtualEntityInfo(true);
      }

      getAccountsBy();

    };

    self.xAxis = ko.pureComputed(function () {
      return {
        title: self.xTitle(),
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
        title: self.yTitle(),
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

    self.closePopUp = function () {
      $("#Top5VirtualAccountBalancesErrorPopUp").trigger("closeModal");
    };
  };
});