define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/system-configuration-welcome",
  "ojs/ojselectcombobox",
  "ojs/ojconveyorbelt"
], function(ko, SystemConfigurationWelcome, Resourcebundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = Resourcebundle;
    self.mode = ko.observable("create");
    self.hostList = ko.observable();
    self.entitiesList = ko.observableArray();
    params.dashboard.headerName(self.nls.headings.systemConfigureHeading);
    self.hostListLoaded = ko.observable(false);
    self.hostSelected = ko.observable(false);
    self.modeSelected = ko.observable(false);
    self.entitiesListLoaded = ko.observable(false);
    self.selectedHost = ko.observable();
    self.disableEntity = ko.observable(false);
    self.disableSelection = ko.observable(false);
    self.newEntityFlag = ko.observable(false);
    self.hostFetched = ko.observable(false);
    self.entityDataLoaded = ko.observable(false);
    self.noOfEntities = 0;
    self.selectedEntity = "";
    params.baseModel.registerComponent("system-configuration-start", "system-configuration");
    self.entities = ko.observableArray([]);
    self.entities(params.rootModel.params.entities);
    self.defaultEntityFetched = ko.observable(params.rootModel.params.defaultEntityFetched);
    self.currentEntity = params.rootModel.params.currentEntity ? ko.observable(params.rootModel.params.currentEntity) : ko.observable();
    self.currentEntityName = params.rootModel.params.currentEntityName ? ko.observable(params.rootModel.params.currentEntityName) : ko.observable();
    self.noOfEntities = self.entities().length;
    self.timeZone = ko.observable(params.rootModel.params.timeZone);
    self.isNewEntity = false;

    SystemConfigurationWelcome.getHostList().done(function(data) {
      self.hostList(data.enumRepresentations[0]);

      self.tempObj = {
        options: ko.observableArray([])
      };

      for (let k = 0; k < self.hostList().data.length; k++) {
        self.tempObj.options.push({
          key: self.hostList().data[k].code,
          description: self.hostList().data[k].description
        });
      }

      self.hostListLoaded(true);
    });

    self.currentEntity(self.entities()[0].businessUnitCode);
    self.currentEntityName(self.entities()[0].businessUnitName());

    SystemConfigurationWelcome.getSystemConfiguration(self.currentEntity()).done(function(data) {
      if (data.configResponseList[0].propertyValue === "true") {
        self.isNewEntity = false;
        self.mode("view");
      } else {
        self.mode("create");
        self.isNewEntity = true;
      }

      self.modeSelected(true);

      if (!self.isNewEntity) {
        SystemConfigurationWelcome.getHostSelection(self.currentEntity()).done(function(data) {
          if (data.configResponseList[0].propertyValue) {
            self.selectedHost(data.configResponseList[0].propertyValue);
            self.hostSelected(true);
            self.disableSelection(true);
            self.hostFetched(true);
          } else {
            self.disableSelection(false);
            self.hostSelected(false);
            self.hostFetched(true);
          }
        });
      } else {
        self.disableSelection(false);
        self.hostSelected(false);
        self.hostFetched(true);
        self.entityDataLoaded(true);
      }
    }).fail(function() {
      self.hostFetched(true);
      self.entityDataLoaded(true);
    });

    self.parentOptionChangedHandler = function(event) {
      if (event.detail.value && event.detail.updatedFrom === "internal") {
        self.hostSelected(false);
        ko.tasks.runEarly();
        self.selectedHost(event.detail.value);
        self.hostSelected(true);
      }
    };

    self.optionChangedHandlerButtonset = function(event) {
      if (event.detail.value) {
        self.modeSelected(false);
        self.hostSelected(false);
        self.hostListLoaded(false);
        self.hostFetched(false);
        self.entityDataLoaded(false);
        self.selectedHost("");
        ko.tasks.runEarly();

        SystemConfigurationWelcome.getSystemConfiguration(self.currentEntity()).done(function(data) {
          if (data.configResponseList[0].propertyValue === "true") {
            self.mode("view");
            self.isNewEntity = false;
          } else {
            self.mode("create");
            self.isNewEntity = true;
          }

          self.modeSelected(true);
          self.hostListLoaded(true);

          let tempEntity = "";

          tempEntity = ko.utils.arrayFilter(self.entities(), function(entity) {
            if (entity.businessUnitCode === event.detail.value) {
              return entity;
            }
          });

          if (tempEntity[0].businessUnitName()) {
            self.currentEntityName(tempEntity[0].businessUnitName());
            self.timeZone(tempEntity[0].temp_timeZone());
            self.newEntityFlag(tempEntity[0].temp_isNew);
            self.selectedEntity = tempEntity[0];
          }

          if (!self.isNewEntity) {
            SystemConfigurationWelcome.getHostSelection(self.currentEntity()).done(function(data) {
              if (data.configResponseList[0].propertyValue) {
                self.selectedHost(data.configResponseList[0].propertyValue);
                self.hostSelected(true);
                self.disableSelection(true);
                self.hostFetched(true);
              } else {
                self.disableSelection(false);
                self.hostSelected(false);
                self.hostFetched(true);
              }
            });
          } else {
            self.disableSelection(false);
            self.hostSelected(false);
            self.hostFetched(true);
            self.entityDataLoaded(true);
          }
        }).fail(function() {
          self.hostFetched(true);
          self.entityDataLoaded(true);
        });
      }
    };
  };
});
