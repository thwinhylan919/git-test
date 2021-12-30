define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-account-position-by-currency",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, VirtualCashPositionByCurrency, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.resource = resourceBundle;
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.entityDetails = ko.observable([]);
    self.selectedEntity = ko.observable();
    self.entityDetailsLoaded = ko.observable(false);
    self.showVirtualEntityInfo = ko.observable(false);
    self.virtualEnitiyName = ko.observable();
    self.selectedProduct = ko.observable();
    self.productDetails = ko.observableArray([]);
    self.productDetailsLoaded = ko.observable(false);
    self.dataSource = ko.observableArray([]);
    self.viewTable = ko.observable(false);
    self.limit = "0";
    self.offset = "0";
    self.recordStatus = "O";

    self.headerText = ko.observableArray([{
        headerText: self.resource.currency,
        field: "currency",
        sortable: "none",
        headerClassName: "table-header-style"
      },
      {
        headerText: self.resource.numberOfVirtualAccounts,
        field: "mappedVirtualAccounts",
        sortable: "none",
        headerClassName: "table-header-style"
      },
      {
        headerText: self.resource.balance,
        renderer: oj.KnockoutTemplateUtils.getRenderer("currencyRowTemplate", true),
        sortable: "none",
        headerClassName: "table-header-style"
      }
    ]);

    const getQueryAsString = function (method) {
        const qQuery = {
          criteria: []
        };

        if (method === "fetchVirtualEntities") {
          qQuery.criteria.push({
            operand: "status",
            operator: "EQUALS",
            value: ["O"]
          });
        } else if (method === "fetchCurrencySummary") {
          if (self.selectedEntity()) {
            qQuery.criteria.push({
              operand: "virtualEntityId",
              operator: "CONTAINS",
              value: [self.selectedEntity()]
            });
          }

          qQuery.criteria.push({
            operand: "vStatus",
            operator: "EQUALS",
            value: ["O"]
          });
        }

        return qQuery.criteria.length !== 0 ? JSON.stringify(qQuery) : undefined;
      },
      showBlankTable = function () {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
        self.viewTable(true);
      },
      convertToTableData = function (groups) {
        return groups.map(function (e) {
          return {
            currency: e.id,
            mappedVirtualAccounts: e.intervals[0].count,
            totalAvailableBalance: e.intervals[0].amount.amount
          };
        });
      };

    self.fetchCurrencyPosition = function () {
      self.viewTable(false);

      const aggregationCriteria = "availableBalance";

      VirtualCashPositionByCurrency.fetchCurrencySummary(getQueryAsString("fetchCurrencySummary"), aggregationCriteria).then(function (data) {
        if (data && data.aggregatedData && data.aggregatedData.groups && data.aggregatedData.groups.length > 0) {

          const tableData = convertToTableData(data.aggregatedData.groups);

          self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tableData, {
            idAttribute: "currency"
          })));

          self.viewTable(true);
        } else {
          showBlankTable();
        }
      }).catch(function () {
        showBlankTable();
      });

    };

    VirtualCashPositionByCurrency.fetchVirtualEntities(getQueryAsString("fetchVirtualEntities"), null, 0).then(function (data) {
      let virtualEntityList = [];

      if (data && data.virtualEntities && data.virtualEntities.length > 0) {
        virtualEntityList = data.virtualEntities;

        virtualEntityList.sort(function (a, b) {
          return a.virtualEntityId.localeCompare(b.virtualEntityId);
        });

        self.entityDetails(virtualEntityList);
        self.selectedEntity(self.entityDetails()[0].virtualEntityId);
        self.virtualEnitiyName(self.entityDetails()[0].virtualEntityName);
        self.fetchCurrencyPosition();
        self.showVirtualEntityInfo(true);
      }

    }).finally(function () {
      self.entityDetailsLoaded(true);
    });

    self.selectDifferentEntity = function (event) {
      self.selectedEntity(event.detail.value);

      const tempArray = self.entityDetails().filter(function (item) {
        return item.virtualEntityId === self.selectedEntity();
      });

      if (tempArray.length > 0) {
        self.virtualEnitiyName(tempArray[0].virtualEntityName);
        self.showVirtualEntityInfo(true);
      }

      self.fetchCurrencyPosition();
    };

    self.tableFieldsDTO = function (data) {

      return data.map(function (summary) {
        const newDTO = {};

        newDTO.currency = summary.currency;
        newDTO.mappedVirtualAccounts = summary.mappedVirtualAccounts;
        newDTO.totalAvailableBalance = summary.totalAvailableBalance;

        return newDTO;
      });
    };
  };
});