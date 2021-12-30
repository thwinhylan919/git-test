define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/user-profile-maintenance",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation",
  "ojs/ojtable",
  "ojs/ojswitch",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function (oj, ko, UserProfileMaintenanceModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.params);
    self.nls = resourceBundle;
    self.userTypeSelectionIdle = ko.observable(true);

    self.validationTracker = ko.observable();

    params.dashboard.headerName(self.nls.pageTitle.userProfileMaintenance);
    params.baseModel.registerComponent("profile-maintenance-review", "user-profile-maintenance");
    params.baseModel.registerComponent("profile-maintenance-search", "user-profile-maintenance");
    self.allContactTypes = ko.observableArray();
    self.allIdentificationTypes = ko.observableArray();
    self.selectedIdentificationType = self.selectedIdentificationType && self.reviewVisited() ? self.selectedIdentificationType : ko.observableArray();
    self.selectedContactType = self.selectedContactType && self.reviewVisited() ? self.selectedContactType : ko.observableArray();
    self.profileMaintenanceTableList = self.profileMaintenanceTableList && self.reviewVisited() ? self.profileMaintenanceTableList : ko.observableArray();
    self.isProfileNotEditable = ko.observable(true);
    self.showTable = ko.observable(false);
    self.profileMaintenanceList = ko.observableArray();

    UserProfileMaintenanceModel.fetchContactType().done(function (data) {
      self.allContactTypes(data.enumRepresentations[0].data);
    });

    UserProfileMaintenanceModel.fetchIdentificationType().done(function (data) {
      self.allIdentificationTypes(data.enumRepresentations[0].data);
    });

    if (!self.reviewVisited()) {
      ko.utils.arrayForEach(self.contactDetails(), function (item) {
        self.selectedContactType().push(item.fieldName.toUpperCase());
      });

      ko.utils.arrayForEach(self.personalDetails(), function (item) {
        self.selectedIdentificationType().push(item.fieldName.toUpperCase());
      });

      if (self.showCreateScreen()) {
        self.isProfileNotEditable = ko.observable(false);

        self.userProfileMaintenanceDatasource = new oj.ArrayTableDataSource([], {
          idAttribute: "displayId"
        });
      }

      for (let j = 0; j < self.contactDetails().length; j++) {
        self.showTable(true);

        const contactDetailsMaintenance = {};

        contactDetailsMaintenance.displayId = self.contactDetails()[j].displayValue;
        contactDetailsMaintenance.id = self.contactDetails()[j].fieldName;
        contactDetailsMaintenance.editable = self.contactDetails()[j].editable;
        contactDetailsMaintenance.type = self.nls.fieldname.contact;

        self.profileMaintenanceTableList().push(contactDetailsMaintenance);

      }

      for (let j = 0; j < self.personalDetails().length; j++) {
        self.showTable(true);

        const personalDetailsMaintenance = {};

        personalDetailsMaintenance.displayId = self.personalDetails()[j].displayValue;
        personalDetailsMaintenance.id = self.personalDetails()[j].fieldName;
        personalDetailsMaintenance.editable = self.personalDetails()[j].editable;
        personalDetailsMaintenance.type = self.nls.fieldname.identification;

        self.profileMaintenanceTableList().push(personalDetailsMaintenance);

      }

      self.userProfileMaintenanceDatasource = new oj.ArrayTableDataSource([], {
        idAttribute: "displayId"
      });

      self.userProfileMaintenanceDatasource = new oj.ArrayTableDataSource(self.profileMaintenanceTableList(), {
        idAttribute: "displayId"
      });
    } else {
      self.isProfileNotEditable(false);
      self.showTable(true);
    }

    self.edit = function () {
      self.isProfileNotEditable(false);
    };

    self.notInOld = ko.observableArray();
    self.notInNew = ko.observableArray();

    self.valueChangeHandler = function (event) {
      for (const i in event.detail.previousValue) {
        if (event.detail.value.indexOf(event.detail.previousValue[i]) === -1)
          {self.notInOld().push(event.detail.previousValue[i]);}
      }

      if (self.notInOld().length !== 0) {
        for (let j = 0; j < self.notInOld().length; j++) {
          for (let k = 0; k < self.profileMaintenanceTableList().length; k++) {
            if (self.profileMaintenanceTableList()[k].id.toUpperCase() === self.notInOld()[j]) {
              const index = self.profileMaintenanceTableList().indexOf(self.profileMaintenanceTableList()[k]);

              self.profileMaintenanceTableList().splice(index, 1);
            }
          }
        }

        self.notInOld([]);

        self.userProfileMaintenanceDatasource.reset(self.profileMaintenanceTableList(), {
          idAttribute: "displayId"
        });
      }

      for (const i in event.detail.value) {
        if (event.detail.previousValue.indexOf(event.detail.value[i]) === -1)
          {self.notInNew().push(event.detail.value[i]);}
      }

      if (self.notInNew().length !== 0) {
        for (let j = 0; j < self.notInNew().length; j++) {
          for (let k = 0; k < self.allIdentificationTypes().length; k++) {
            const personalDetailsMaintenance = {};

            if (self.allIdentificationTypes()[k].code === self.notInNew()[j]) {
              personalDetailsMaintenance.displayId = self.allIdentificationTypes()[k].description;
              personalDetailsMaintenance.id = self.notInNew()[j];

              personalDetailsMaintenance.editable = false;
              personalDetailsMaintenance.type = self.nls.fieldname.identification;
              self.profileMaintenanceTableList().push(personalDetailsMaintenance);
              self.notInNew([]);

              self.userProfileMaintenanceDatasource.reset(self.profileMaintenanceTableList(), {
                idAttribute: "displayId"
              });
            }
          }

          for (let k = 0; k < self.allContactTypes().length; k++) {
            const contactDetailsMaintenance = {};

            if (self.allContactTypes()[k].code === self.notInNew()[j]) {
              contactDetailsMaintenance.displayId = self.allContactTypes()[k].description;
              contactDetailsMaintenance.id = self.notInNew()[j];

              contactDetailsMaintenance.editable = false;
              contactDetailsMaintenance.type = self.nls.fieldname.contact;
              self.profileMaintenanceTableList().push(contactDetailsMaintenance);
              self.notInNew([]);

              self.userProfileMaintenanceDatasource.reset(self.profileMaintenanceTableList(), {
                idAttribute: "displayId"
              });
            }
          }
        }
      }

      self.showTable(true);
    };

    self.switchChangeHandler = function (rowContext) {
      if (rowContext.editable !== null) {

        for (let i = 0; i < self.profileMaintenanceTableList().length; i++) {
          if (self.profileMaintenanceTableList()[i].id === rowContext.id) {
            self.profileMaintenanceTableList()[i].editable = rowContext.editable;
          }
        }
      }
    };

    const context = {};

    context.userProfileMaintenanceDatasource = self.userProfileMaintenanceDatasource;
    context.selectedContactType = self.selectedContactType ;
    context.selectedIdentificationType = self.selectedIdentificationType ;
    context.profileMaintenanceTableList =self.profileMaintenanceTableList;
    context.showCreateScreen = self.showCreateScreen;
    context.showTable = self.showTable ;

    self.save = function () {
      params.dashboard.loadComponent("profile-maintenance-review", context);
    };

    self.backtoView = function () {
      params.dashboard.loadComponent("profile-maintenance-search", context);
    };
  };
});
