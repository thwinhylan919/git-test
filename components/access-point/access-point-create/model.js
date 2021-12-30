define(["baseService", "jquery"], function (BaseService, $) {
  "use strict";

  const AccessPointCreateModel = function () {
    const Model = function () {
        this.accessPointModel = {
          id: null,
          description: null,
          clientId: null,
          status: null,
          type: null,
          headlessMode: null,
          aspects: null,
          selfOnboard: null,
          defaultSelect: null,
          imgRefno: null,
          scopes: null,
          version: null,
          skipLoginFlow: false,
          pwdEncryptionEnabled: false,
          consentRequired: false
        };
      },
      baseService = BaseService.getInstance();
    let fetchAccessPointTypeDeferred;
    const fetchAccessPointType = function (deferred) {
      const options = {
        url: "enumerations/accessPointType",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchScopeDeferred;
    const fetchScope = function (deferred) {
      const options = {
        url: "accessPointScopes",
        success: function (data) {
          deferred.resolve(data);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let uploadImageDeferred;
    const uploadImage = function (form, deferred) {
      const options = {
        url: "contents",
        selfLoader: true,
        formData: form,
        success: function (data) {
          deferred.resolve(data);
        },
        error: function () {
          deferred.reject();
        }
      };

      baseService.uploadFile(options);
    };

    return {
      getNewModel: function () {
        return new Model();
      },
      fetchAccessPointType: function () {
        fetchAccessPointTypeDeferred = $.Deferred();
        fetchAccessPointType(fetchAccessPointTypeDeferred);

        return fetchAccessPointTypeDeferred;
      },
      fetchScope: function () {
        fetchScopeDeferred = $.Deferred();
        fetchScope(fetchScopeDeferred);

        return fetchScopeDeferred;
      },
      uploadImage: function (form) {
        uploadImageDeferred = $.Deferred();
        uploadImage(form, uploadImageDeferred);

        return uploadImageDeferred;
      }
    };
  };

  return new AccessPointCreateModel();
});