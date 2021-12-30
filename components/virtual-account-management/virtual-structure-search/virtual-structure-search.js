define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/virtual-structure-search",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojdatetimepicker",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $, VirtualStructureModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;
    let tempDTO = [];

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerComponent("virtual-structure-tree-view", "virtual-account-management");
    params.baseModel.registerComponent("virtual-structure-create", "virtual-account-management");
    params.baseModel.registerComponent("virtual-structure-tab", "virtual-account-management");
    self.structureCode = ko.observable();
    self.structureName = ko.observable();
    self.headerAccountNo = ko.observable();
    self.virtualAccountArray = ko.observableArray([]);
    self.viewTable = ko.observable(false);
    self.virtualStructureData = ko.observable([]);
    self.dataSource = ko.observableArray();
    self.partyIdParam = ko.observable();
    self.dataSourceCreated = ko.observable(false);
    self.structureCodeParam = ko.observable();
    self.limit = "0";
    self.offset = "0";
    self.criterion = ko.observableArray();

    params.baseModel.registerComponent("tooltip", "home");
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;

    if (params.rootModel.params.selectedAccountFilter) {
      if (JSON.parse(params.rootModel.params.selectedAccountFilter) === "RealAccountSingleCurrency") {
        self.realAccountNo = params.rootModel.params.realAccountNumberValue;
      } else if (JSON.parse(params.rootModel.params.selectedAccountFilter) === "VirtualMultiCurrencyAccount") {
        self.accGroupId = params.rootModel.params.realAccountNumberValue;
      }

      self.status = "O";
    }

    self.clear = function () {
      self.structureCode("");
      self.structureName("");
      self.dataSourceCreated(false);

    };

    self.openCreate = function () {
      params.dashboard.loadComponent("virtual-structure-tree-view", self);
    };

    self.headerText = ko.observableArray([{
      headerText: self.resource.structureCode,
      renderer: oj.KnockoutTemplateUtils.getRenderer("searchIdentifier", true),
      field: "structureCode"
    },
    {
      headerText: self.resource.headerAccountNo,
      field: "headerAccountNo"
    },
    {
      headerText: self.resource.realAccountNo,
      field: "realAccountNo"
    },
    {
      headerText: self.resource.avlBal,
      field: "amount",
      renderer: oj.KnockoutTemplateUtils.getRenderer("avlBalance", true)
    },
    {
      headerText: self.resource.creationDate,
      field: "accOpenDate",
      renderer: oj.KnockoutTemplateUtils.getRenderer("dateIdentifier", true)
    },
    {
      headerText: self.resource.childAccounts,
      field: "childAccounts",
      sortable: "none"
    }
    ]);

    const newArr = [];

    self.searchResult = function () {

      self.criterion([]);

      if (self.structureCode() !== undefined && self.structureCode() !== "") {
        self.criterion.push({
          operand: "virtualAccountStructureKey.code",
          operator: "CONTAINS",
          value: [self.structureCode()]
        });
      }

      if (self.structureName() !== undefined && self.structureName() !== "") {
        self.criterion.push({
          operand: "name",
          operator: "CONTAINS",
          value: [self.structureName()]
        });
      }

      if (self.realAccountNo !== undefined) {
        self.criterion.push({
          operand: "realAccountNo.value",
          operator: "EQUALS",
          value: [self.realAccountNo]
        });
      }

      if (self.accGroupId !== undefined) {
        self.criterion.push({
          operand: "groupId",
          operator: "EQUALS",
          value: [self.accGroupId]
        });
      }

      if (self.status !== undefined) {
        self.criterion.push({
          operand: "status",
          operator: "EQUALS",
          value: [self.status]
        });
      }

      const query = {
        criteria: self.criterion()
      };

      VirtualStructureModel.fetchVirtualStructureList(JSON.stringify(query), 0).then(function (data) {
        if ((data && data !== []) || (data.virtualAccountStructures && data.virtualAccountStructures.length > 0)) {
          for (let i = 0; i < data.virtualAccountStructures.length; i++) {
            if (data.virtualAccountStructures) {
              self.virtualStructureData(data.virtualAccountStructures);
            }

            newArr.push(data.virtualAccountStructures[i]);
          }

          self.tableFieldsDTO(data.virtualAccountStructures);

          if (newArr.length) {
            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
              idAttribute: "structureCode"
            })));

            self.viewTable(true);
            self.dataSourceCreated(true);

          }
        } else if (data && data.virtualAccountStructures) {
          self.virtualStructureData(data.virtualAccountStructures);
          newArr.push(data.virtualAccountStructures);
          self.tableFieldsDTO(data.virtualAccountStructures);

          if (newArr.length) {
            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
              idAttribute: "structureCode"
            })));

            self.viewTable(true);
            self.dataSourceCreated(true);

          }
        } else {
          self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
          self.viewTable(true);
          self.dataSourceCreated(true);
        }
      });
    };

    self.searchResult();

    self.tableFieldsDTO = function (data) {
      tempDTO = $.map(data, function (v) {
        const newDTO = {};

        newDTO.structureCode = v.code;
        newDTO.structureDesc = v.name;
        newDTO.headerAccountNo = v.mainAccountId.displayValue;
        newDTO.balance = v.balance;
        newDTO.amount = v.balance.amount;
        newDTO.accOpenDate = v.creationDate;
        newDTO.status = v.status;

        if (v.childAccountCount) {
          newDTO.childAccounts = v.childAccountCount - 1;
        }

        if (v.realAccountNo) {
          newDTO.realAccountNo = v.realAccountNo.displayValue;

        }

        if (v.groupId) {
          newDTO.realAccountNo = v.groupId;
        }

        return newDTO;
      });
    };

    self.onSelectedInTable = function (data) {
      self.partyIdParam(params.dashboard.userData.userProfile.partyId.value);
      self.structureCodeParam(data.structureCode);

      params.dashboard.loadComponent("virtual-structure-tree-view", {
        headerAccountNo: data.headerAccountNo,
        status: data.status,
        structureCode: data.structureCode
      });
    };

    self.filter = function () {
      self.viewTable(false);

      if (tempDTO) {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
          idAttribute: "structureCode"
        })));
      } else {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
      }

      self.viewTable(true);
    };

    self.reset = function () {
      self.viewTable(false);
      self.virtualAccountNo("");
      self.virtualAccountName("");
      self.tableFieldsDTO(self.virtualStructureData());

      if (tempDTO) {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
          idAttribute: "virtualAccountNo"
        })));
      } else {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
      }

      self.viewTable(true);
    };
  };
});
