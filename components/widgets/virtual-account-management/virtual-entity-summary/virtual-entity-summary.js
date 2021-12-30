define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-entity-summary",
  "load!./virtual-entity-summary.json",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojarraydataprovider",
  "ojs/ojpagingdataproviderview",
  "ojs/ojtable",
  "ojs/ojpagingcontrol"
], function (oj, ko, EntitySummaryModel, resourceBundle, AuthorizedComponents) {
  "use strict";

  return function (params) {
    const self = this,
      realEntityAddress = [];
    let tempDTO = [];

    self.resource = resourceBundle;
    self.viewTable = ko.observable(false);
    self.dataSource = ko.observableArray([]);
    self.dataSourceCreated = ko.observable(false);
    self.filterEntityList = ko.observable([]);
    self.checkboxFlag = ko.observable();
    self.mailingCheckboxFlag = ko.observable();
    self.virtualEntityCount = ko.observable();
    self.mappedAccountsCount = ko.observable();
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    params.baseModel.registerComponent("review-virtual-entity", "virtual-account-management");
    params.baseModel.registerComponent("virtual-account-search", "virtual-account-management");
    params.baseModel.registerElement("modal-window");
    self.limit = "0";
    self.offset = "0";
    self.dataSourcePopUp = ko.observableArray([]);
    self.viewPopUpTable = ko.observable(false);
    self.unMappedAccounts = ko.observable();
    self.linkToRealAccounts = ko.observable();
    self.linkToStructure = ko.observable();
    self.authorizedLinks = ko.observableArray([]);

    const authorizedComponents = params.baseModel.filterAuthorisedComponents(AuthorizedComponents["virtual-account-management"], "name");

    authorizedComponents.forEach(function (item) {
      if (item.name === "virtual-entity-create") {
        params.baseModel.registerComponent(item.name, item.module);

        self.authorizedLinks.push({
          id: "createEntity",
          label: self.resource.labels.createEntity,
          name: item.name,
          module: item.module,
          cssClass: authorizedComponents.length === 2 ? "oj-sm-6" : "oj-sm-12"
        });
      } else if (item.name === "virtual-account") {
        params.baseModel.registerTransaction(item.name, item.module);

        self.authorizedLinks.push({
          id: "createAccounts",
          label: self.resource.labels.createAccounts,
          name: item.name,
          module: item.module,
          cssClass: authorizedComponents.length === 2 ? "oj-sm-6" : "oj-sm-12"
        });
      }
    });

    self.dataSource(new oj.PagingDataProviderView(new oj.ArrayDataProvider(tempDTO, {
      idAttribute: "entityId"
    })));

    EntitySummaryModel.getRealEntityAddress().then(function (data) {
      for (let i = 0; i < data.party.addresses.length; i++) {
        if (data.party.addresses[i].type.toLowerCase() === "pst") {
          realEntityAddress.push(data.party.addresses[i].postalAddress);
        }
      }
    });

    const getQueryAsString = function () {
      const qQuery = {
        criteria: [{
          operand: "status",
          operator: "EQUALS",
          value: ["O"]
        }]
      };

      return JSON.stringify(qQuery);
    };

    EntitySummaryModel.fetchVirtualEntities(getQueryAsString(), null, 0).then(
      function (response) {
        if (response && response.virtualEntities && response.virtualEntities.length > 0) {
          self.tableFieldsDTO(response.virtualEntities);

          if (response.virtualEntities.length) {
            self.virtualEntityCount(response.virtualEntities.length);

            const mappedAccountsCount = tempDTO.reduce(function (accumulator, currentValue) {
              return accumulator + currentValue.mappedAccounts;
            }, 0);

            self.mappedAccountsCount(mappedAccountsCount);

            self.dataSource(new oj.PagingDataProviderView(new oj.ArrayDataProvider(tempDTO, {
              idAttribute: "entityId"
            })));

            self.viewTable(true);
            self.dataSourceCreated(true);
          }
        }
      }
    );

    self.tableFieldsDTO = function (data) {
      tempDTO = data.map(function (v) {
        return {
          entityId: v.virtualEntityId,
          entityName: v.virtualEntityName,
          mappedAccounts: v.childAccountCount ? v.childAccountCount : 0
        };
      });
    };

    self.onSelectedInTable = function (data) {
      let selectedEntity, checkboxFlag, mailingCheckboxFlag;

      EntitySummaryModel.readEntity(data.entityId).then(
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
              mappedVirtualAccounts: data.mappedAccounts
            });
          }
        }
      );
    };

    self.onClickLink = function (id) {
      params.dashboard.loadComponent(id);
    };

  };
});