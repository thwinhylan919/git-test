define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const LocationSearchModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.locationAddAtmPayload = {
          id: "",
          name: "",
          bankCode: "",
          postalAddress: "",
          supportedServices: [],
          type: "ATM",
          geoCoordinate: {
            latitude: "",
            longitude: ""
          }
        };

        this.locationAddBranchPayload = {
          id: "",
          name: "",
          bankCode: "",
          postalAddress: "",
          workTimings: [],
          workDays: [],
          branchPhone: [],
          supportedServices: [],
          type: "BRANCH",
          geoCoordinate: {
            latitude: "",
            longitude: ""
          },
          additionalDetails: []
        };

        this.address = {
          postalAddress: {
            line1: "",
            line2: "",
            line3: "",
            line4: "",
            city: "",
            country: ""
          }
        };
      };
    let
      fetchSupportedServicesDeferred;
    const fetchSupportedServices = function(type, deferred) {
      const params ={type:type.toUpperCase()},
       options = {
        url: "locator/services?type={type}",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, params);
    };

    let uploadDocumentDeferred;
    const uploadDocument = function(file, deferred) {
      const form = new FormData();

      form.append("file", file);

      const options = {
        url: "locator/upload?type=BRANCH",
        formData: form,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.uploadFile(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      fetchSupportedServices: function(type) {
        fetchSupportedServicesDeferred = $.Deferred();
        fetchSupportedServices(type, fetchSupportedServicesDeferred);

        return fetchSupportedServicesDeferred;
      },

      uploadDocument: function(file) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(file, uploadDocumentDeferred);

        return uploadDocumentDeferred;
      }
    };
  };

  return new LocationSearchModel();
});