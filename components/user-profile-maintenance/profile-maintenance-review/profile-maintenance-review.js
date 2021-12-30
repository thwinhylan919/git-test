define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/user-profile-maintenance",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojdatetimepicker",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation",
  "ojs/ojtable",
  "ojs/ojswitch",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojcheckboxset"
], function (oj, ko, UserProfileMaintenanceReviewModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.params);
    self.nls = resourceBundle;

    const getNewKoModel = function () {
      const KoModel = UserProfileMaintenanceReviewModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.rootModelInstance = getNewKoModel();

    if (params.rootModel.params && params.rootModel.params.data) {
      self.reviewData = ko.mapping.toJS(params.rootModel.params.data);
    }

    self.allIdentificationTypes = ko.observableArray();
    self.allContactTypes = ko.observableArray();
    self.validationTracker = ko.observable();
    self.isProfileNotEditable = ko.observable(true);
    self.reviewVisited = ko.observable(true);
    self.transactionStatus = ko.observable();
    params.dashboard.headerName(self.nls.pageTitle.userProfileMaintenance);
    params.baseModel.registerComponent("profile-maintenance", "user-profile-maintenance");
    params.baseModel.registerElement("confirm-screen");

    if (self.transactionDetails && self.transactionDetails().transactionSnapshot) {
      self.showTable = ko.observable();

      self.selectedContactType = ko.observableArray();
      self.selectedIdentificationType = ko.observableArray();
      self.profileMaintenanceTableList = ko.observableArray();

      ko.utils.arrayForEach(self.reviewData.contactDetails, function (data) {
        if (data.fieldName !== null) {
          self.selectedContactType.push(data.fieldName);
        }
      });

      ko.utils.arrayForEach(self.reviewData.personalDetails, function (data) {
        if (data.fieldName !== null) {
          self.selectedIdentificationType.push(data.fieldName);
        }
      });
    }

    self.editOnReview = function () {
      const context = {};

      context.userProfileMaintenanceDatasource = self.userProfileMaintenanceDatasource;
      context.selectedContactType = self.selectedContactType ;
      context.selectedIdentificationType = self.selectedIdentificationType ;
      context.profileMaintenanceTableList =self.profileMaintenanceTableList;
      context.showCreateScreen = self.showCreateScreen;
      context.showTable = self.showTable ;
      context.reviewVisited = self.reviewVisited;
      context.contactDetails = self.contactDetails;
      context.personalDetails = self.personalDetails;
      context.showMaintenanceData = self.showMaintenanceData;
      params.dashboard.loadComponent("profile-maintenance", context);
    };

    UserProfileMaintenanceReviewModel.fetchIdentificationType().done(function (data) {
      self.allIdentificationTypes(data.enumRepresentations[0].data);
    });

    UserProfileMaintenanceReviewModel.fetchContactType().done(function (data) {
      self.allContactTypes(data.enumRepresentations[0].data);
    });

    if (self.reviewData !== undefined) {
      for (let j = 0; j < self.reviewData.contactDetails.length; j++) {

        const contactDetailsMaintenance = {};

        contactDetailsMaintenance.displayId = self.reviewData.contactDetails[j].displayValue;
        contactDetailsMaintenance.id = self.reviewData.contactDetails[j].fieldName;
        contactDetailsMaintenance.editable = self.reviewData.contactDetails[j].editable;
        contactDetailsMaintenance.type = self.nls.fieldname.contact;

        self.profileMaintenanceTableList().push(contactDetailsMaintenance);

      }

      for (let j = 0; j < self.reviewData.personalDetails.length; j++) {

        const personalDetailsMaintenance = {};

        personalDetailsMaintenance.displayId = self.reviewData.personalDetails[j].displayValue;
        personalDetailsMaintenance.id = self.reviewData.personalDetails[j].fieldName;
        personalDetailsMaintenance.editable = self.reviewData.personalDetails[j].editable;
        personalDetailsMaintenance.type = self.nls.fieldname.identification;

        self.profileMaintenanceTableList().push(personalDetailsMaintenance);

      }

      self.userProfileMaintenanceDatasource = new oj.ArrayTableDataSource([], {
        idAttribute: "displayId"
      });

      self.showTable= ko.observable(true);

      self.userProfileMaintenanceDatasource.reset(self.profileMaintenanceTableList(), {
        idAttribute: "displayId"
      });

    }

    self.confirm = function () {

      self.rootModelInstance.profileMaintenance.personalDetails([]);
      self.rootModelInstance.profileMaintenance.contactDetails([]);

      for (let i = 0; i < self.profileMaintenanceTableList().length; i++) {
        if (self.profileMaintenanceTableList()[i].type === "Identification") {
          const personalDetails = {};

          personalDetails.editable = self.profileMaintenanceTableList()[i].editable;
          personalDetails.fieldName = self.profileMaintenanceTableList()[i].id;
          personalDetails.displayValue = self.profileMaintenanceTableList()[i].displayId;
          self.rootModelInstance.profileMaintenance.personalDetails().push(personalDetails);
        }

        if (self.profileMaintenanceTableList()[i].type === "Contact") {
          const contactDetails = {};

          contactDetails.editable = self.profileMaintenanceTableList()[i].editable;
          contactDetails.fieldName = self.profileMaintenanceTableList()[i].id;
          contactDetails.displayValue = self.profileMaintenanceTableList()[i].displayId;
          self.rootModelInstance.profileMaintenance.contactDetails().push(contactDetails);
        }
      }

      if (self.rootModelInstance.profileMaintenance.personalDetails().length > 0 && typeof self.rootModelInstance.profileMaintenance.personalDetails()[0].fieldName === "function" && self.rootModelInstance.profileMaintenance.personalDetails()[0].fieldName() === "") {
        self.rootModelInstance.profileMaintenance.personalDetails().splice(0, 1);
      }

      if (self.rootModelInstance.profileMaintenance.contactDetails().length > 0 && typeof self.rootModelInstance.profileMaintenance.contactDetails()[0].fieldName === "function" && self.rootModelInstance.profileMaintenance.contactDetails()[0].fieldName() === "") {
        self.rootModelInstance.profileMaintenance.contactDetails().splice(0, 1);
      }

      if (!self.showCreateScreen()) {
        UserProfileMaintenanceReviewModel.updateProfileMaintenance(ko.mapping.toJSON(self.rootModelInstance.profileMaintenance)).done(function (data, status, jqXhr) {
          self.transactionStatus(data.status);

          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.pageTitle.userProfileMaintenance,
            transactionResponse: data
          });
        });
      } else {
        UserProfileMaintenanceReviewModel.createProfileMaintenance(ko.mapping.toJSON(self.rootModelInstance.profileMaintenance)).done(function (data, status, jqXhr) {
          self.transactionStatus(data.status);

          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.pageTitle.userProfileMaintenance,
            transactionResponse: data
          });
        });
      }
    };

  };
});
