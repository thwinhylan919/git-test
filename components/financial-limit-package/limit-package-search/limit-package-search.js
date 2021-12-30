define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/limit-package-search",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojpagingcontrol",
  "ojs/ojknockout",
  "ojs/ojnavigationlist",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojtable",
  "ojs/ojselectcombobox",
  "ojs/ojradioset"
], function(oj, ko, $, componentModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.showOptionRecords = ko.observable(false);
    self.selectedName = self.selectedName || ko.observable();
    self.selectedDesc = self.selectedDesc || ko.observable();
    self.fromDate = ko.observable();
    self.toDate = ko.observable();
    self.changeParameter = ko.observable("Y");
    self.selectedAccessPointGroupType = self.selectedAccessPointGroupType || ko.observable();
    self.selectedRoleValues = self.selectedRoleValues || ko.observable();
    self.selectedAccessPoint = self.selectedAccessPoint || ko.observable();
    self.selectedCurrency = self.selectedCurrency || ko.observable();
    rootParams.baseModel.registerElement("action-widget");
    rootParams.dashboard.headerName(self.nls.pageHeader);
    rootParams.baseModel.registerComponent("limits", "financial-limit-package");
    rootParams.baseModel.registerComponent("review-limit-package", "financial-limit-package");
    rootParams.baseModel.registerComponent("limit-package", "financial-limit-package");
    rootParams.baseModel.registerComponent("package-create", "financial-limit-package");
    self.isNewLimitGroup = false;
    self.validationTracker = ko.observable();
    self.accessPointType = ko.observable("SINGLE");
    self.isCorpAdmin = ko.observable();
    self.checkCorpAdmin = ko.observable();
    self.today = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));

    const partyId = {};

    partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
    partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;

    if (partyId.value) {
      self.isCorpAdmin = true;
    } else {
      self.isCorpAdmin = false;
    }

    self.limitsData = ko.observable({
      LimitTransactions: ko.observable(),
      enterpriseRoles: ko.observable(),
      accessPoint: ko.observable(),
      accessPointGroup: ko.observable(),
      currencies: ko.observable()
    });

    self.groupData = ko.observableArray([{
        label: "INTERNAL",
        children: []
      },
      {
        label: "EXTERNAL",
        children: []
      }
    ]);

    componentModel.fetchEnterpriseRoles().done(function(data) {
      self.limitsData().enterpriseRoles(data.enterpriseRoleDTOs);
    });

    componentModel.fetchSystemConfigurationDetails().then(function(data) {
        self.changeParameter(data.configResponseList[0].propertyValue);

        if(self.changeParameter() ==="N"){
        self.accessPointType("GLOBAL");
      }
    });

    componentModel.fetchAccessPoint().done(function(data) {
      self.limitsData().accessPoint(data.accessPointListDTO);

      for (let i = 0; i < data.accessPointListDTO.length; i++) {
        if (data.accessPointListDTO[i].type === "INT") {
          self.groupData()[0].children.push({
            value: data.accessPointListDTO[i].id,
            label: data.accessPointListDTO[i].description
          });
        } else if (data.accessPointListDTO[i].type === "EXT") {
          self.groupData()[1].children.push({
            value: data.accessPointListDTO[i].id,
            label: data.accessPointListDTO[i].description
          });
        }
      }
    });

    componentModel.fetchAccessPointGroup().done(function(data) {
      self.limitsData().accessPointGroup(data.accessPointGroupListDTO);
    });

    self.showCurrencies = ko.observable(false);

    componentModel.fetchCurrencies().done(function(data) {
      self.limitsData().currencies(data.currencyList);
    });

    function setPageData(data) {
      const tempData = $.map(data.limitPackageDTOList, function(v) {
        const newObj = {
          key: {}
        };

        newObj.id = v.key.id;
        newObj.name = v.key.id;
        newObj.desc = v.description;
        self.roleArray = ko.observableArray();

        for (let i = 0; i < v.assignableToList.length; i++) {
          self.roleArray.push(v.assignableToList[i].key.value);
        }

        newObj.role = self.roleArray;
        newObj.currency = v.currency;
        newObj.accessPointValue = v.accessPointValue;
        newObj.accessPointGroupType = v.accessPointGroupType;
        newObj.count = v.targetLimitLinkages.length;

        if (v.lastUpdatedDate && v.lastUpdatedDate !== "-") {
          newObj.lastUpdatedOn = v.lastUpdatedDate;
        } else {
          newObj.lastUpdatedOn = "-";
        }

        return newObj;
      });

      self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
        idAttribute: "id"
      })));

      self.showPackageData(true);
    }

    self.showOptions = function() {
      self.showOptionRecords(true);
    };

    self.showLessOptions = function() {
      self.showOptionRecords(false);
    };

    self.checkCorpAdmin(self.isCorpAdmin ? "corporateuser" : "");
    self.showPackageData = self.showPackageData || ko.observable(false);

    self.searchParameters = {
      name: "",
      description: "",
      assignableEntities: [{
        key: {
          type: "ROLE",
          value: self.checkCorpAdmin()
        }
      }],
      currency: "",
      accessPointValue: "",
      accessPointGroupType: "",
      fromDate: "",
      toDate: ""
    };

    self.showPackageList = function() {
      self.searchParameters.name = self.selectedName();
      self.searchParameters.description = self.selectedDesc();
      self.searchParameters.assignableEntities[0].key.value = self.selectedRoleValues();
      self.searchParameters.currency = self.selectedCurrency();
      self.searchParameters.accessPointValue = self.selectedAccessPoint();
      self.searchParameters.accessPointGroupType = self.selectedAccessPointGroupType();
      self.searchParameters.fromDate = self.fromDate();
      self.searchParameters.toDate = self.toDate();

      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      componentModel.fetchPackages(JSON.parse(ko.toJSON(self.searchParameters))).done(function(data) {
        setPageData(data);
      });
    };

    if(self.changeParameter() === "Y"){
   self.headerText = [{
       headerText: self.nls.limit_package_search.code_search,
       field: "name",
       renderer: oj.KnockoutTemplateUtils.getRenderer("amountWithCurrencyField", true)
     },
     {
       headerText: self.nls.limit_package_search.desc_search,
       field: "desc"
     },
     {
       headerText: self.nls.limit_package_search.access_point_search,
       field: "accessPointValue"
     },
     {
       headerText: self.nls.limit_package_search.currency,
       field: "currency"
     },
     {
       headerText: self.nls.limit_package_search.updationDate,
       field: "lastUpdatedOn",
       template :"formattedDate"
     }

   ].concat(self.isCorpAdmin ? [] : [{
     headerText: self.nls.limit_package_search.roles,
     field: "role"
   }]);
 }
 else {
   self.headerText = [{
       headerText: self.nls.limit_package_search.code_search,
       field: "name",
       renderer: oj.KnockoutTemplateUtils.getRenderer("amountWithCurrencyField", true)
     },
     {
       headerText: self.nls.limit_package_search.desc_search,
       field: "desc"
     },
     {
       headerText: self.nls.limit_package_search.currency,
       field: "currency"
     },
     {
       headerText: self.nls.limit_package_search.updationDate,
       field: "lastUpdatedOn",
       template :"formattedDate"
     }
   ].concat(self.isCorpAdmin ? [] : [{
     headerText: self.nls.limit_package_search.roles,
     field: "role"
   }]);
 }

    self.submitIfEnter = function(data, event) {
      if (event.keyCode === 13) {
        self.showPackageList();
      }
    };

    self.showPackageCreate = function() {
      rootParams.dashboard.loadComponent("limit-package", {
        action: "CREATE"
      });
    };

    self.clearSearchParams = function() {
      self.selectedName("");
      self.selectedDesc("");
      self.fromDate("");
      self.toDate("");
      self.selectedAccessPointGroupType("");
      self.selectedRoleValues("");
      self.selectedAccessPoint("");
      self.selectedCurrency("");
      self.pagingDatasource();
      self.showPackageData(false);
    };

    self.pagingDatasource = self.pagingDatasource || ko.observable();

    self.showPackageDetails = function(data) {
      rootParams.dashboard.loadComponent("review-limit-package", {
        data: data,
        packageId: data.id,
        action: "VIEW"
      });
    };
  };
});
