define([
    "jquery",
    "baseService"
  ],
  function($, BaseService) {
    "use strict";

    const UserProfileMaintenanceReviewModel = function() {
      const baseService = BaseService.getInstance(),
        Model = function() {
          this.profileMaintenance = {
            personalDetails: [{
              editable: "",
              determinantValue: "",
              fieldName: "",
              displayValue: ""
            }],
            contactDetails: [{
              editable: "",
              determinantValue: "",
              fieldName: "",
              displayValue: ""
            }]
          };
        };
      let updateProfileMaintenanceDeferred;
      const updateProfileMaintenance = function(deferred,payload) {
        const options = {
          url: "profileConfig",
          data: payload,

          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };

        baseService.update(options);
      };
      let createProfileMaintenanceDeferred;
      const createProfileMaintenance = function(deferred,payload) {
        const options = {
          url: "profileConfig",
          data: payload,

          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };

        baseService.add(options);
      };
      let fetchContactTypeDeferred;
      const fetchContactType = function (deferred) {
        const options = {
          url: "enumerations/contactPoint",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchIdentificationTypeDeferred;
      const fetchIdentificationType = function (deferred) {
        const options = {
          url: "enumerations/identificationType",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        getNewModel: function() {
          return new Model();
        },
        updateProfileMaintenance: function(payload) {
          updateProfileMaintenanceDeferred = $.Deferred();
          updateProfileMaintenance(updateProfileMaintenanceDeferred,payload);

          return updateProfileMaintenanceDeferred;
        },
        createProfileMaintenance: function(payload) {
          createProfileMaintenanceDeferred = $.Deferred();
          createProfileMaintenance(createProfileMaintenanceDeferred,payload);

          return createProfileMaintenanceDeferred;
        },
        fetchIdentificationType: function () {
          fetchIdentificationTypeDeferred = $.Deferred();
          fetchIdentificationType(fetchIdentificationTypeDeferred);

          return fetchIdentificationTypeDeferred;
        },
        fetchContactType: function () {
          fetchContactTypeDeferred = $.Deferred();
          fetchContactType(fetchContactTypeDeferred);

          return fetchContactTypeDeferred;
        }
      };
    };

    return UserProfileMaintenanceReviewModel();
  });
