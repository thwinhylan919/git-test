define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-multi-currency-account-search",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"

], function (oj, ko, VirtualMultiCurrencyAccountModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    params.baseModel.registerElement("search-box");
    params.baseModel.registerComponent("virtual-multi-currency-account-view", "virtual-account-management");

    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.realCustomerNoDisplay = params.dashboard.userData.userProfile.partyId.displayValue;
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    self.viewTable = ko.observable(false);
    self.dataSource = ko.observableArray([]);
    self.dataSourceCreated = ko.observable(false);
    self.virtualMcaDto = ko.observable();
    self.limit = "0";
    self.offset = "0";

    self.headerText = ko.observableArray([{
      headerText: self.resource.virtualMultiCurrencyNoAndName,
      field: "virtualMCA",
      renderer: oj.KnockoutTemplateUtils.getRenderer("virtualMcaIdentifier", true),
      headerClassName: "break-word",
      className: "break-word"
    }, {
      headerText: self.resource.defaultCurrency,
      field: "defaultCurrency"
    }, {
      headerText: self.resource.status,
      field: "recordStatus"
    }]);

    self.getDefaultCurrency = function (accounts) {
      let defaultCurrency = "";

      accounts.find(function (currAccount) {
        return currAccount.defaultAccount === true ? defaultCurrency = currAccount.currencyCode : "";
      });

      return defaultCurrency;
    };

    self.tableFieldsDTO = function (data) {

      return data.map(function (r) {
        const tempDTO = {};

        tempDTO.virtualMCA = r.groupId;
        tempDTO.virtualMCADesc = r.name;
        tempDTO.makerDateStamp = r.creationDate;
        tempDTO.recordStatus = r.status === "O" ? self.resource.active : self.resource.closed;
        tempDTO.defaultCurrency = self.getDefaultCurrency(r.accounts);

        return tempDTO;
      });
    };

    VirtualMultiCurrencyAccountModel.fetchVirtualMultiCurrencyAccounts().then(function (data) {
      if (data && data.items && data.items.length > 0) {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.tableFieldsDTO(data.items), {
          idAttribute: "virtualMCA"
        })));

        self.virtualMcaDto(data.items);
        self.viewTable(true);
        self.dataSourceCreated(true);
      } else {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
        self.viewTable(true);
        self.dataSourceCreated(true);
      }

    }).catch(function () {
      self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
      self.viewTable(true);
      self.dataSourceCreated(true);
    });

    self.onSelectedInTable = function (selectedRow) {
      params.dashboard.loadComponent("virtual-multi-currency-account-view", {
        virtualMCA: selectedRow.virtualMCA
      });
    };
  };
});