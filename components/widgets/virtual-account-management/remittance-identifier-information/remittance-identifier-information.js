define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/remittance-identifier-information",
    "load!./remittance-identifier-information.json",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojarraydataprovider",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource"
  ], function(oj, ko, $, RemitterIdentifierInformationModel, resourceBundle,AuthorizedComponents) {
    "use strict";

    return function(params) {
      const self = this,
            newArr =[];
      let tempDTO = [];

      ko.utils.extend(self, params.rootModel);
      self.resource = resourceBundle;
      self.viewTable = ko.observable(false);
      self.dataSource = ko.observableArray([]);
      self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
      self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
      params.baseModel.registerTransaction("virtual-identifiers-create", "virtual-account-management");
      params.baseModel.registerComponent("remittance-search", "virtual-account-management");
      self.limit = "0";
      self.offset = "0";
      self.authorizedLinks = ko.observableArray();

    const authorizedComponents = params.baseModel.filterAuthorisedComponents(AuthorizedComponents["virtual-account-management"], "name");

      self.headerText = ko.observableArray([{
        headerText: self.resource.listNameAndId,
        renderer: oj.KnockoutTemplateUtils.getRenderer("remittanceRowTemplate", true),
        sortable: "none",
        headerClassName: "table-header-style"
        },
        {
        headerText: self.resource.mappedId,
        field: "mappedIds",
        sortable: "none",
        headerClassName: "table-header-style"
        }
      ]);

      authorizedComponents.forEach(function(item){
        if(item.name === "virtual-identifiers-create") {
          params.baseModel.registerComponent(item.name, item.module);

          self.authorizedLinks.push({
            id: "createRemittanceList",
            label: self.resource.createRemitterList,
            name: item.name,
            module: item.module,
            cssClass: authorizedComponents.length === 2 ? "oj-sm-6" : "oj-sm-12"
          });
        } else if (item.name === "remittance-search"){
          params.baseModel.registerTransaction(item.name, item.module);

          self.authorizedLinks.push({
            id: "viewAllRemittanceList",
            label: self.resource.viewRemitterId,
            name: item.name,
            module: item.module,
            cssClass: authorizedComponents.length === 2 ? "oj-sm-6" : "oj-sm-12"
          });
        }
      });

      self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
        idAttribute: "remittanceListID"
      })));

      RemitterIdentifierInformationModel.fetchRemitterIdentifiersList(self.realCustomerNo,self.limit,self.offset).done(function(remitterIdList){
        if(remitterIdList && remitterIdList.jsonNode && remitterIdList.jsonNode.data.length > 0)
        {
          for(let i = 0; i < remitterIdList.jsonNode.data.length; i++)
          {
            newArr.push(remitterIdList.jsonNode.data);
          }

          self.tableFieldsDTO(remitterIdList.jsonNode.data);

          if(newArr.length){
            self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempDTO, {
              idAttribute: "remittanceListID"
            })));

            self.viewTable(true);
          }
        }
      });

      self.tableFieldsDTO = function(data) {
        tempDTO = $.map(data, function(v) {
          const newDTO = {};

          newDTO.remittanceListID = v.remitterListId;
          newDTO.remittanceListName = v.remitterDesc;
          newDTO.mappedIds = v.RemitterIdDetailServiceDTO.length;

          return newDTO;
        });
      };

      self.onSelectedInRemittanceTable = function(data){
        params.dashboard.loadComponent("remittance-search", {
          remittanceListName: data.remittanceListName,
          remittanceListID: data.remittanceListID,
          viewSearchInfo: true
        });
      };

      self.createRemittanceList = function() {
        params.dashboard.loadComponent("virtual-identifiers-create", {});
      };

      self.viewAllRemittanceList = function() {
        params.dashboard.loadComponent("remittance-search", {});
      };

      self.onClickLink = function(id) {
        params.dashboard.loadComponent(id);
      };
    };
  });
