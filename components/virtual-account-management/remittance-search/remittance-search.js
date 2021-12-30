define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/remittance-search",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojdatetimepicker",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $, RemittanceModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;
    let tempDTO = [];

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerComponent("remittance-view", "virtual-account-management");
    params.baseModel.registerComponent("remittance-create", "virtual-account-management");
    params.baseModel.registerComponent("create-remittance", "virtual-account-management");
    self.remittanceListID = ko.observable(params.rootModel.params.remittanceListID !== undefined ? params.rootModel.params.remittanceListID : "");
    self.remittanceListName = ko.observable(params.rootModel.params.remittanceListName !== undefined ? params.rootModel.params.remittanceListName : "");
    self.remittanceID = ko.observable();
    self.viewTable = ko.observable(false);
    self.remittanceData = ko.observable([]);
    self.dataSource = ko.observableArray();
    self.partyIdParam = ko.observable();
    self.remittanceCodeParam = ko.observable();
    self.dataSourceCreated = ko.observable(false);
    self.limit = "0";
    self.offset = "0";
    self.fullData = ko.observable();
    params.baseModel.registerComponent("tooltip", "home");
    self.viewSearchInfo = ko.observable(params.rootModel.params.viewSearchInfo !== undefined ? params.rootModel.params.viewSearchInfo : false);
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.fromApproval = ko.observable(false);

    self.clear = function () {
      self.remittanceListID("");
      self.remittanceListName("");
      self.realCustomerNo = "";
      self.remittanceID("");
    };

    self.openCreate = function () {
      params.dashboard.loadComponent("remittance-view", self);
      params.dashboard.loadComponent("create-remittance", self);
    };

    self.headerText = ko.observableArray([{
        headerText: self.resource.remittanceListIDName,
        renderer: oj.KnockoutTemplateUtils.getRenderer("searchIdentifier", true)
      },
      {
        headerText: self.resource.remittanceID,
        field: "remittanceID"
      },
      {
        headerText: self.resource.validFrom,
        renderer: oj.KnockoutTemplateUtils.getRenderer("dateFromIdentifier", true),
        field: "validFrom"
      },
      {
        headerText: self.resource.validTo,
        renderer: oj.KnockoutTemplateUtils.getRenderer("dateToIdentifier", true),
        field: "validTo"
      },
      {
        headerText: self.resource.status,
        field: "status",
        sortable: "none"
      }
    ]);

    const newArr = [];

    self.searchResult = function () {
      if (!self.remittanceListID() && !self.remittanceListName()) {
        $("#searchError").trigger("openModal");
      } else {
        RemittanceModel.fetchRemittanceList(self.remittanceListID(), self.remittanceListName(), self.realCustomerNo, self.limit, self.offset).done(function (data) {
          self.fullData = data;

          if (data && data.jsonNode && data.jsonNode.data.length > 0) {
            data.jsonNode.data.forEach(function (item) {
              for (let i = 0; i < item.RemitterIdDetailServiceDTO.length; i++) {
                if (item.RemitterIdDetailServiceDTO.length) {
                  self.remittanceData(item.RemitterIdDetailServiceDTO);
                }

                newArr.push(item.RemitterIdDetailServiceDTO[i]);
              }

            });

            self.tableFieldsDTO(data.jsonNode.data);

            if (newArr.length) {
              self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
                keyAttributes: "remittanceListID"
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
      }
    };

    self.tableFieldsDTO = function (data) {
      tempDTO = [];

      data.forEach(function (item) {
        item.RemitterIdDetailServiceDTO.map(function (v) {
          const newDTO = {};

          newDTO.remittanceListID = v.remitterListId;
          newDTO.remittanceListName = item.remitterDesc;
          newDTO.remittanceID = v.remitterId;
          newDTO.validFrom = v.validityStartDate;
          newDTO.validTo = v.validityEndDate;

          if (v.recordStatus === "O") {
            newDTO.status = self.resource.active;
          } else if (v.recordStatus === "I") {
            newDTO.status = self.resource.inactive;
          } else {
            newDTO.status = self.resource.close;
          }

          tempDTO.push(newDTO);

          return newDTO;
        });
      });
    };

    self.onSelectedInTable = function (data) {
      const rowSelectedDTO = [];

      newArr.forEach(function (obj) {
        if (data.remittanceID === obj.remitterId) {
          rowSelectedDTO.push(obj);
        }
      });

      self.partyIdParam(params.dashboard.userData.userProfile.partyId.value);
      self.remittanceCodeParam(data.remittanceListID);

      params.dashboard.loadComponent("remittance-view", {
        remittanceListDTO: rowSelectedDTO[0],
        fullDataInfo: self.fullData
      }, self);
    };

    self.filter = function () {
      self.viewTable(false);

      if (tempDTO) {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
          idAttribute: "remittanceListID"
        })));
      } else {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
      }

      self.viewTable(true);
      self.dataSourceCreated(true);
    };

    self.reset = function () {
      self.viewTable(false);
      self.remittanceListID("");
      self.remittanceListName("");
      self.dataSourceCreated(false);
      self.tableFieldsDTO(self.remittanceData());

      if (tempDTO) {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
          idAttribute: "remitterListId"
        })));
      } else {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
      }

      self.viewTable(true);
      self.dataSourceCreated(true);
    };

    if (self.viewSearchInfo()) {
      self.searchResult();
      self.clear();
    }

    self.closeDialogBox = function () {
      $("#searchError").hide();
    };

    if (params.rootModel.params.data) {
      self.fromApproval(true);
      newArr.push(params.rootModel.transactionDetails().transactionSnapshot.requestPayload);
      self.tableFieldsDTO(params.rootModel.transactionDetails().transactionSnapshot.requestPayload.RemitterIdDetailServiceSaveDTO, params.rootModel.transactionDetails().transactionSnapshot.requestPayload.remitterDesc);

      if (newArr.length) {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
          keyAttributes: "remittanceListID"
        })));

        self.viewTable(true);
        self.dataSourceCreated(true);
      } else {
        self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {})));
        self.viewTable(true);
        self.dataSourceCreated(true);
      }
    }

  };
});
