define([
  "ojs/ojcore",
  "knockout",
      "./model",
  "ojL10n!resources/nls/user-segments-product",
  "promise",
  "ojs/ojlistview",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojtable",
  "ojs/ojdatacollection-utils",
  "ojs/ojarraytabledatasource",
  "ojs/ojknockout-validation",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup"
], function(oj, ko, UserSegmentListModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerComponent("user-segments-product-map", "user-segments-product");
    rootParams.dashboard.headerName(self.resource.header.productMapping);
    rootParams.dashboard.headerCaption("");
    self.tasksLoaded = ko.observable(false);
    self.productTypesLoaded = ko.observable(false);
    self.enterpriseRoleId = ko.observable();
    self.enterpriseRoleName = ko.observable();
    self.userLoaded = ko.observable(false);
    self.rowTemplateValue = ko.observable("rowTemplate");
    self.productMappedLocal = ko.observable();
    self.datasource = ko.observable();
    self.stageOne = ko.observable(false);
    self.selectedProductType = ko.observable();
    self.productType = ko.observable();
    self.productTypeId = ko.observable();
    self.userRoles = ko.observableArray([]);
    self.userRolesList = ko.observableArray([]);
    self.selectedUserType = ko.observable();
    self.userType = ko.observable();
    self.selectedProductModule = ko.observable();
    self.productModule = ko.observable();
    self.segments = ko.observableArray([]);
    self.mappingLoaded = ko.observable(false);
    self.mappingData=ko.observableArray([]);
    self.productTypesList=ko.observableArray([]);
    self.isProductSelected = ko.observable(true);
    self.isUserRoleSelected = ko.observable(true);

    let segCount=0, segmentCount=0;

    self.prodModules = ko.observableArray([]);
    self.productTypes = ko.observableArray([]);

    self.defaultProductTypes = [{
      code: "CON",
      description: "CONVENTIONAL"
    }];

    self.productModules = [{
        id: "TD",
        label: self.resource.productMapping.productModule.TD
      },
      {
        id: "RD",
        label: self.resource.productMapping.productModule.RD
      }
    ];

    self.back = function() {
      history.back();
    };

    /**
     * Self - createMap - to create mapping for
     * selected segment or role.
     *
     * @param  {type} item - Description.
     * @return {type}      Description.
     */
    self.createMap = function(item) {
      const context = {};

      context.mode = "CREATE";
      context.productModuleId = self.productModule();
      context.productTypeId = self.productTypeId();
      context.productType = self.productType();
      context.enterpriseRole = self.userType();

      if(item.userSegmentId!==""){
        context.entityType="SEGMENT";
      }
      else {
        context.entityType="ROLE";
      }

      context.entityName=item.userSegment;
      context.entityNameId=item.userSegmentId;
      rootParams.dashboard.loadComponent("user-segments-product-map", context);
    };

    self.getNewKoModel = function() {
      const KoModel = UserSegmentListModel.getNewModel();

      return KoModel;
    };

    /**
     * Self - viewMappedProducts - reads mapped products
     * for selected segment or role.
     *
     * @param  {type} item - Description.
     * @return {type}      Description.
     */
    self.viewMappedProducts = function(item) {
      const context = {};

      context.maintenanceId = item.maintenanceId;
      context.mode = "VIEW";
      context.enterpriseRole = self.selectedUserType();
      context.productModuleId = self.productModule();
      context.productTypeId = self.productTypeId();
      context.productType = self.productType();

      if(item.userSegmentId!==""){
        context.entityType="SEGMENT";
      }
      else {
        context.entityType="ROLE";
      }

      context.entityName=item.userSegment;
      context.entityNameId=item.userSegmentId;
      rootParams.dashboard.loadComponent("user-segments-product-map", context);
    };

    /**
     * Self - fetchMappedProducts - fetches list of products mapped
     * based on productModule and userType.
     *
     * @param  {type} productModule - - - - - - - - - - - - - Description.
     * @param  {type} productType Description.
     * @param  {type} userType    Description.
     * @param  {type} entityValue Description.
     * @param  {type} entityName  Description.
     * @return {type}             Description.
     */
    self.fetchMappedProducts = function(productModule, productType, userType, entityValue, segmentName, entityName){
      UserSegmentListModel.fetchAllMappedProducts(productModule, productType, entityValue,entityName).then(function(data2) {
        self.loadMappingData(userType, entityValue, segmentName, entityName, data2);
        segCount++;

        if(segCount===segmentCount){
          UserSegmentListModel.fetchAllMappedProducts(productModule, productType, userType,"ROLE").then(function(data2) {
            self.loadMappingData(userType, "", "", userType, data2);
          });
        }
      });
    };

    self.loadMappingData = function(userType, entityValue, segmentName, entityName, data2){
      self.productMappedLocal(null);

        const productIds = new Set();

        for (let x = 0; x < data2.maintenances.length; x++) {
          if(data2.maintenances[x].productMainItems){
            for (let y = 0; y < data2.maintenances[x].productMainItems.length; y++) {
              productIds.add(data2.maintenances[x].productMainItems[y].id);
            }

            self.productMappedLocal(rootParams.baseModel.format(self.resource.productMapping.noOfMapped, {
              count: productIds.size
            }));
          }
        }

        if(entityName==="ROLE"){
          entityValue="";
        }

          let isMapped= false;

          for(let y = 0;y < data2.maintenances.length;y++){
              if(data2.maintenances[y].productMainItems){
            self.mappingData.push({
              userType:self.resource.productMapping[userType],
              userSegment:segmentName,
              userSegmentId:entityValue,
              productCount:productIds.size,
              maintenanceId:data2.maintenances[y].maintenanceId
            });
            }
            else{
              self.mappingData.push({
              userType:self.resource.productMapping[userType],
              userSegment:segmentName,
              userSegmentId:entityValue,
              productCount:0,
              maintenanceId:data2.maintenances[y].maintenanceId
            });
            }

            isMapped=true;
        }

        if(!isMapped){
          self.mappingData.push({
            userType:self.resource.productMapping[userType],
            userSegment:segmentName,
            userSegmentId:entityValue,
            maintenanceId:"",
            productCount:0
          });
        }

        self.datasource = new oj.ArrayTableDataSource(self.mappingData, {
              idAttribute: ["userSegment"] || []
        });

        self.mappingLoaded(true);
      };

    /**
     * Self - fetchSegments - fetches list of segments for given userType.
     *
     * @param  {type} productModule - - - - - - - - - - - - - - - Description.
     * @param  {type} productType Description.
     * @param  {type} userType    Description.
     * @return {type}             Description.
     */
    self.fetchSegments = function(productModule, productType, userType){
      if(self.stageOne()){
      self.mappingLoaded(false);
      self.segments([]);
      self.mappingData([]);

      UserSegmentListModel.fetchSegments(userType).then(function(data3) {
        for(let i=0;i<data3.segmentdtos.length;i++){
          if(data3.segmentdtos[i].status==="ENABLED"){
          self.segments.push(data3.segmentdtos[i].code);
          segmentCount++;
          self.fetchMappedProducts(productModule, productType, userType, data3.segmentdtos[i].code, data3.segmentdtos[i].name,"SEGMENT");
          }
        }

        if(data3.segmentdtos.length===0){
          UserSegmentListModel.fetchAllMappedProducts(productModule, productType, userType,"ROLE").then(function(data2) {
            self.loadMappingData(userType, "", "", userType, data2);
          });
        }
      });
      }
    };

    /**
     * Self - fetchEnterpriseRoles - fetches list of enterpriseRoles.
     *
     * @return {type}             Description.
     */
    self.fetchEnterpriseRoles = function() {
      self.tasksLoaded(false);

      UserSegmentListModel.enterpriseRolesList().then(function(data) {
        self.tasksLoaded(true);

        const roles = [];

        ko.utils.arrayForEach(data.enterpriseRoleDTOs, function(role) {
          if (role.enterpriseRoleId !== "administrator")
            {roles.push(role);}
        });

        self.userRoles=roles;
        self.userRolesList(self.userRoles);
      });
    };

    self.fetchEnterpriseRoles();

    self.fetchProductTypes = function(){
      self.productTypesLoaded(false);

      UserSegmentListModel.fetchProductTypes().then(function(data) {
        self.productTypesLoaded(true);
        self.productTypes(data.enumRepresentations[0].data);
      });
    };

    self.fetchProductTypes();

    /**
     * Self - search - fetches segments for selected productModule and userType.
     *
     * @return {type}  Description.
     */
    self.search = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("productTracker")))
        {return;}

      self.productModule(self.selectedProductModule());
      self.productTypeId(self.selectedProductType());

      for(let index=0; index<self.productTypesList().length;index++){
        if(self.productTypesList()[index].code===self.productTypeId()){
          self.productType(self.productTypesList()[index].description);
        }
      }

      self.userType(self.selectedUserType());

      if (self.productModule()) {
        self.stageOne(true);
        self.fetchSegments(self.productModule(), self.productTypeId(), self.userType());
      }
    };

    self.productModuleChanged = function(){
      self.isProductSelected(false);
      self.productTypesList([]);

      if(self.selectedProductModule()==="TD" && self.selectedUserType()==="retailuser"){
        self.productTypesList(self.productTypes());
      }
      else{
        self.productTypesList.push(self.defaultProductTypes[0]);
      }

      ko.tasks.runEarly();
      self.isProductSelected(true);
    };

    self.userRoleChanged = function(){
      self.isUserRoleSelected(false);
      self.isProductSelected(false);
      self.prodModules([]);
      self.productTypesList([]);

      if(self.selectedUserType()==="retailuser"){
        if(self.selectedProductModule()==="TD"){
          self.productTypesList(self.productTypes());
        }

        self.prodModules(self.productModules);
      }
      else{
        self.productTypesList.push(self.defaultProductTypes[0]);
        self.prodModules.push(self.productModules[0]);
      }

      ko.tasks.runEarly();
      self.isUserRoleSelected(true);
      self.isProductSelected(true);
    };
  };
});
