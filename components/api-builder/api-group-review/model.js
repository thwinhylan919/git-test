define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const APIGroupReviewModel = function () {
    const baseService = BaseService.getInstance();
    let createApiGroupDeferred;
    const createApiGroup = function (payload, deferred) {
      const options = {
        url: "builder/apiGroup",
        version: "ext",
        data: payload,
        success: function (data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function (data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let updateApiGroupDeferred;
    const updateApiGroup = function (payload, deferred) {
      const options = {
        url: "builder/apiGroup",
        version: "ext",
        data: payload,
        success: function (data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function (data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.update(options);
    };

    return {
      createApiGroup: function (payload) {
        createApiGroupDeferred = $.Deferred();
        createApiGroup(payload, createApiGroupDeferred);

        return createApiGroupDeferred;
      },
      updateApiGroup: function (payload) {
        updateApiGroupDeferred = $.Deferred();
        updateApiGroup(payload, updateApiGroupDeferred);

        return updateApiGroupDeferred;
      }
    };
  };

  return new APIGroupReviewModel();
});