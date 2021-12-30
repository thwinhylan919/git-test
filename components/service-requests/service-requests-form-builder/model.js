define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request form builder Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsFormBuilderModel
   */
  const ServiceRequestsFormBuilderModel = function () {
    const baseService = BaseService.getInstance();
    let uploadDocumentDeferred;
    const uploadDocument = function (form, deferred) {
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
      uploadDocument: function (form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);

        return uploadDocumentDeferred;
      }
    };
  };

  return new ServiceRequestsFormBuilderModel();
});