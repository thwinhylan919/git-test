define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/virtual-account-search",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojdatetimepicker",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $, VirtualAccountModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;
    let tempDTO = [];

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerComponent("virtual-account-view", "virtual-account-management");
    params.baseModel.registerComponent("virtual-account-create", "virtual-account-management");
    params.baseModel.registerComponent("review-virtual-entity", "virtual-account-management");
    self.virtualEntityId = ko.observable();
    self.virtualEntityName = ko.observable();
    self.virtualAccountNo = ko.observable();
    self.virtualAccountName = ko.observable();
    self.virtualAccountArray = ko.observableArray([]);
    self.viewTable = ko.observable(false);
    self.fromDate = ko.observable();
    self.toDate = ko.observable();
    self.virtualAccountNo = ko.observable();
    self.virtualAccountName = ko.observable();
    self.virtualEntityId = ko.observable();
    self.virtualAccountNameTable = ko.observableArray([]);
    self.virtualAccountData = ko.observable([]);
    self.dataSource = ko.observableArray();
    self.accountLinkageValue = ko.observableArray();
    self.statusValue = ko.observableArray();
    self.selectedVALinakageValue = ko.observable();
    self.selectedStatusValue = ko.observable();
    self.dataSourceCreated = ko.observable(false);
    self.showMoreSearchTemplate = ko.observable(false);
    self.hideMoreSearchTemplate = ko.observable(true);
    self.virtaulAccountLinkageValue = ko.observable();
    self.criterion = ko.observableArray();

    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.limit = "0";
    self.offset = "0";
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;

    self.accountLinkageDTO = function () {

      const accountLinkageResponse = [{
          id: "A",
          description: self.resource.linkToRealAcc

        },
        {
          id: "S",
          description: self.resource.linkToStructure

        },
        {
          id: "U",
          description: self.resource.unmappedVirtualAcc

        }
      ];

      for (let i = 0; i < accountLinkageResponse.length; i++) {
        self.accountLinkageValue.push({
          id: accountLinkageResponse[i].id,
          description: accountLinkageResponse[i].description
        });
      }
    };

    self.accountLinkageDTO();

    self.statusDTO = function () {

      const statusResponse = [{
          id: "O",
          description: self.resource.active

        },
        {
          id: "C",
          description: self.resource.closed

        }
      ];

      for (let i = 0; i < statusResponse.length; i++) {
        self.statusValue.push({
          id: statusResponse[i].id,
          description: statusResponse[i].description
        });
      }

    };

    self.statusDTO();

    self.showMoreSearch = function () {
      self.showMoreSearchTemplate(true);
      self.hideMoreSearchTemplate(false);
    };

    self.hideMoreSearch = function () {
      self.showMoreSearchTemplate(false);
      self.virtualAccountName("");
      self.virtualEntityName("");
      self.selectedVALinakageValue("");
      self.selectedStatusValue("");
      self.hideMoreSearchTemplate(true);
    };

    self.clear = function () {
      self.virtualEntityId("");
      self.virtualEntityName("");
      self.virtualAccountNo("");
      self.virtualAccountName("");
      self.selectedVALinakageValue("");
      self.selectedStatusValue("");
    };

    self.openCreate = function () {
      params.dashboard.loadComponent("virtual-account-create", self);
    };

    self.headerText = ko.observableArray([{
        headerText: self.resource.accountNumName,
        field: "virtualAccountNo",
        renderer: oj.KnockoutTemplateUtils.getRenderer("searchIdentifier", true)
      },
      {
        headerText: self.resource.entityIdAndName,
        field: "virtualEntityId",
        renderer: oj.KnockoutTemplateUtils.getRenderer("entityIdentifier", true)
      },
      {
        headerText: self.resource.availableBalance,
        field: "avlBal",
        renderer: oj.KnockoutTemplateUtils.getRenderer("avlBalance", true),
        sortable: "none"
      },
      {
        headerText: self.resource.creationDate,
        field: "accOpenDate",
        renderer: oj.KnockoutTemplateUtils.getRenderer("dateIdentifier", true)
      },
      {
        headerText: self.resource.StructureCode,
        field: "StructureCode",
        sortable: "none"
      },
      {
        headerText: self.resource.status,
        field: "accountStatus",
        sortable: "none"
      },
      {
        headerText: self.resource.realAccNum,
        field: "realAccountNo",
        sortable: "none"
      }
    ]);

    const newArr = [];

    self.searchResult = function () {

      self.criterion([]);

      if(self.virtualEntityId() !== undefined && self.virtualEntityId() !== ""){
        self.criterion.push({
          operand: "virtualEntityId" ,
          operator: "CONTAINS",
          value: [self.virtualEntityId()]
        });
      }

      if(self.virtualEntityName() !== undefined && self.virtualEntityName() !== ""){
        self.criterion.push({
          operand: "virtualEntityName" ,
          operator: "CONTAINS",
          value: [self.virtualEntityName()]
        });
      }

      if(self.virtualAccountNo() !== undefined && self.virtualAccountNo() !== ""){
        self.criterion.push({
          operand: "virtualAccountKey.virtualAccountNo.value" ,
          operator: "CONTAINS",
          value: [self.virtualAccountNo()]
        });
      }

      if(self.virtualAccountName() !== undefined && self.virtualAccountName() !== ""){
        self.criterion.push({
          operand: "virtualAccountName" ,
          operator: "CONTAINS",
          value: [self.virtualAccountName()]
        });
      }

      if(self.selectedVALinakageValue() !== undefined && self.selectedVALinakageValue() !== ""){
        if (self.selectedVALinakageValue() === "U") {
          self.criterion.push({
            operand: "realAccLinkage" ,
            operator: "EQUALS",
            value: ["S"]
          });
        } else {
          self.criterion.push({
            operand: "realAccLinkage" ,
            operator: "EQUALS",
            value: [self.selectedVALinakageValue()]
          });
        }

      }

      if(self.selectedStatusValue() !== undefined && self.selectedStatusValue() !== ""){
        self.criterion.push({
          operand: "vStatus" ,
          operator: "EQUALS",
          value: [self.selectedStatusValue()]
        });
      }

      const query = {
        criteria: self.criterion()
      };

      VirtualAccountModel.fetchVirtualAccountListSummary(JSON.stringify(query),0).then(function (data) {
        if (data && data.accounts && data.accounts.length > 0) {
          for (let i = 0; i < data.accounts.length; i++) {
            if (data.accounts) {

              if (self.selectedVALinakageValue() === "U") {

                self.virtualAccountData(data.accounts.filter(function (item) {
                  return !item.code;
                }));

                self.tableFieldsDTO(data.accounts.filter(function (item) {
                  return !item.code;
                }));
              } else if (self.selectedVALinakageValue() === "S") {
                self.virtualAccountData(data.accounts.filter(function (item) {
                  return item.code;
                }));

                self.tableFieldsDTO(data.accounts.filter(function (item) {
                  return item.code;
                }));
              } else {
                self.virtualAccountData(data.accounts);
                self.tableFieldsDTO(data.accounts);
              }
            }

            newArr.push(data.accounts[i]);
          }

          if (newArr.length) {
            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
              idAttribute: "virtualAccountNo"
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

    self.tableFieldsDTO = function (data) {
      tempDTO = $.map(data, function (v) {
        const newDTO = {};

        newDTO.virtualAccountNo = v.id.displayValue;
        newDTO.virtualAccountName = v.virtualAccountName;
        newDTO.virtualEntityId = v.virtualEntityId;
        newDTO.virtualEntityName = v.virtualEntityName;
        newDTO.accOpenDate = v.openingDate;
        newDTO.StructureCode = v.code;
        newDTO.virtualAccountValue = v.id.value;

        if (v.availableBalance !== undefined) {
          newDTO.avlBal = v.availableBalance.amount;
          newDTO.currency = v.availableBalance.currency;
        } else if(v.odFixedAmount !== undefined) {
          newDTO.avlBal = v.odFixedAmount.amount;
          newDTO.currency = v.odFixedAmount.currency;
        }

        if (v.realAccountNo !== undefined) {
          newDTO.realAccountNo = v.realAccountNo.displayValue;
        }

        if (v.accountStatus === "O") {
          newDTO.accountStatus = self.resource.active;
        } else {
          newDTO.accountStatus = self.resource.closed;
        }

        return newDTO;
      });
    };

    if (params.rootModel.params.virtualAccountListDTO) {
      if (params.rootModel.params.fromAccountsAndBalances) {
        let virtualAccountListDTO = JSON.parse(params.rootModel.params.virtualAccountListDTO);
        const structureCodes = JSON.parse(params.rootModel.params.structureCodes);

        self.criterion([]);

        self.criterion.push({
          operand: "realAccLinkage" ,
          operator: "EQUALS",
          value: ["S"]
        });

        self.criterion.push({
          operand: "vStatus" ,
          operator: "EQUALS",
          value: ["O"]
        });

      const query = {
        criteria: self.criterion()
      };

        VirtualAccountModel.fetchVirtualAccountListSummary(JSON.stringify(query), 0).then(function (data) {
          if (data && data.accounts && data.accounts.length > 0) {
            structureCodes.forEach(function (item) {
              const temp = data.accounts.filter(function (account) {
                return account.code === item;
              });

              virtualAccountListDTO = virtualAccountListDTO.concat(temp);
            });

            self.tableFieldsDTO(virtualAccountListDTO);

            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
              idAttribute: "virtualAccountNo"
            })));

            self.viewTable(true);
            self.dataSourceCreated(true);
          }
        });
      } else {
        self.tableFieldsDTO(JSON.parse(params.rootModel.params.virtualAccountListDTO));

        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
          idAttribute: "virtualAccountNo"
        })));

        self.viewTable(true);
        self.dataSourceCreated(true);
      }
    } else {
      self.searchResult();
    }

    self.onSelectedInTable = function (selectedRow) {
      const rowSelectedDTO = [];

      VirtualAccountModel.fetchVirtualAccount(selectedRow.virtualAccountValue).then(function (data) {
        if (data && data.virtualAccountDTO && Object.keys(data.virtualAccountDTO).length > 0) {
          rowSelectedDTO.push(data.virtualAccountDTO);
        }

        params.dashboard.loadComponent("virtual-account-view", {
          virtualAccountListDTO: rowSelectedDTO[0],
          availableBalance: selectedRow.avlBal
        }, self);

      });
    };

    self.reset = function () {
      self.viewTable(false);
      self.virtualAccountNo("");
      self.virtualAccountName("");
      self.fromDate("");
      self.toDate("");
      self.tableFieldsDTO(self.virtualAccountData());

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