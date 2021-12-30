define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-entity-search",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingdataproviderview"
], function (oj, ko, EntityModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this,
      newArr = [],
      realEntityAddress = [],
      count = 0;
    let tempDTO = [];

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerComponent("virtual-entity-create", "virtual-account-management");
    params.baseModel.registerComponent("virtual-entity-information", "virtual-account-management");
    params.baseModel.registerComponent("virtual-entity-identification-details", "virtual-account-management");
    params.baseModel.registerComponent("review-virtual-entity", "virtual-account-management");
    self.searchEntityID = ko.observable();
    self.searchEntityName = ko.observable();
    self.viewTable = ko.observable(false);
    self.dataSource = ko.observableArray([]);
    self.filterEntityList = ko.observable([]);
    self.dataSourceCreated = ko.observable(false);
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;

    const getQueryAsString = function () {
      const qQuery = {
        criteria: []
      };

      if (self.searchEntityID()) {
        qQuery.criteria.push({
          operand: "virtualEntityKey.virtualEntityId",
          operator: "CONTAINS",
          value: [self.searchEntityID()]
        });
      }

      if (self.searchEntityName()) {
        qQuery.criteria.push({
          operand: "virtualEntityName",
          operator: "CONTAINS",
          value: [self.searchEntityName()]
        });
      }

      return qQuery.criteria.length === 0 ? undefined : JSON.stringify(qQuery);
    };

    self.headerText = ko.observableArray([{
        headerText: self.resource.entityIDName,
        renderer: oj.KnockoutTemplateUtils.getRenderer("searchIdentifier", true),
        field: "entityId"
      },
      {
        headerText: self.resource.entityType,
        field: "entityType",
        sortable: "none"
      },
      {
        headerText: self.resource.creationDate,
        field: "creationDate",
        renderer: oj.KnockoutTemplateUtils.getRenderer("dateIdentifier", true)
      },
      {
        headerText: self.resource.mappedVirtualAccounts,
        field: "mappedVirtualAccounts",
        sortable: "none"
      },
      {
        headerText: self.resource.status,
        field: "status",
        sortable: "none"
      }
    ]);

    EntityModel.getRealEntityAddress().then(
      function (data) {
        for (let i = 0; i < data.party.addresses.length; i++) {
          if (data.party.addresses[i].type.toLowerCase() === "pst") {
            realEntityAddress.push(data.party.addresses[i].postalAddress);
          }
        }
      }
    );

    const showBlankTable = function () {
      self.dataSource(new oj.PagingDataProviderView(new oj.ArrayDataProvider([], {})));
      self.viewTable(true);
      self.dataSourceCreated(true);
    };

    self.searchResult = function () {
      EntityModel.getEntityList(getQueryAsString(), null, count).then(
        function (response) {
          if (response && response.virtualEntities && response.virtualEntities.length > 0) {
            for (let i = 0; i < response.virtualEntities.length; i++) {
              newArr.push(response.virtualEntities[i]);
              self.filterEntityList().push(response.virtualEntities[i]);
            }

            self.tableFieldsDTO(response.virtualEntities);

            if (newArr.length) {
              self.dataSource(new oj.PagingDataProviderView(new oj.ArrayDataProvider(tempDTO, {
                idAttribute: "entityId"
              })));

              self.viewTable(true);
              self.dataSourceCreated(true);
            }
          } else {
            showBlankTable();
          }
        }
      ).catch(function () {
        showBlankTable();
      });
    };

    self.searchResult();

    self.tableFieldsDTO = function (data) {
      tempDTO = data.map(function (v) {
        return {
          entityId: v.virtualEntityId,
          entityName: v.virtualEntityName,
          entityType: v.entityType === "C" ? self.resource.corporate : self.resource.individual,
          creationDate: v.creationDate,
          mappedVirtualAccounts: v.childAccountCount,
          status: v.status === "O" ? self.resource.active : self.resource.closed
        };
      });
    };

    self.onSelectedInTable = function (data) {
      let selectedEntity, checkboxFlag, mailingCheckboxFlag;

      EntityModel.readEntity(data.entityId).then(
        function (response) {
          if (response && response.virtualEntity) {
            selectedEntity = response.virtualEntity;
            checkboxFlag = selectedEntity.address.line1 === realEntityAddress[0].line1 && selectedEntity.address.line2 === realEntityAddress[0].line2 && selectedEntity.address.country.toLowerCase() === realEntityAddress[0].country.toLowerCase() && selectedEntity.address.zipCode === realEntityAddress[0].postalCode;
            mailingCheckboxFlag = selectedEntity.address.line1 === selectedEntity.mailingAddress.line1 && selectedEntity.address.line2 === selectedEntity.mailingAddress.line2 && selectedEntity.address.country === selectedEntity.mailingAddress.country && selectedEntity.address.zipCode === selectedEntity.mailingAddress.zipCode;

            params.dashboard.loadComponent("review-virtual-entity", {
              fromEntitySearch: true,
              viewMode: true,
              viewDTO: selectedEntity,
              realCustomerNo: self.realCustomerNo,
              realEntityAddress: realEntityAddress,
              checkboxFlag: checkboxFlag,
              mailingCheckboxFlag: mailingCheckboxFlag,
              mappedVirtualAccounts: data.mappedVirtualAccounts
            });
          }
        }
      );

    };

    self.clearFields = function () {
      self.searchEntityID(null);
      self.searchEntityName(null);
    };

  };
});