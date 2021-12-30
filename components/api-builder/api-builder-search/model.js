define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const APIBuilderSearchModel = function () {
    const baseService = BaseService.getInstance();

    let getApiGroupsDeferred;
    const getApiGroups = function (deferred) {
      const options = {
        url: "builder/apiGroup",
        version: "ext",
        success: function (result, status, xhr) {
          deferred.resolve(result, status, xhr);
        },
        error: function (data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getApiGroupServicesDeferred;
    const getApiGroupServices = function (deferred, apiGroup, serviceId, serviceName, serviceURL) {
      const options = {
          url: "builder/api?apiGroup={apiGroup}&serviceId={serviceId}&serviceName={serviceName}&serviceURL={serviceURL}",
          version: "ext",
          success: function (result, status, xhr) {
            deferred.resolve(result, status, xhr);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          apiGroup: apiGroup,
          serviceId: serviceId,
          serviceName: serviceName,
          serviceURL: serviceURL
        };

      baseService.fetch(options, params);
    };
    let getServiceDetailsDeferred;
    const getServiceDetails = function (deferred, serviceId) {
      const options = {
          url: "builder/api/{serviceId}",
          version: "ext",
          success: function (result, status, xhr) {
            deferred.resolve(result, status, xhr);
          },
          error: function (data) {
            deferred.reject(data);
          }
        },
        params = {
          serviceId: serviceId
        };

      baseService.fetch(options, params);
    };

    return {
      getApiGroups: function () {
        getApiGroupsDeferred = $.Deferred();
        getApiGroups(getApiGroupsDeferred);

        return getApiGroupsDeferred;
      },
      getApiGroupServices: function (apiGroup, serviceId, serviceName, serviceURL) {
        getApiGroupServicesDeferred = $.Deferred();
        getApiGroupServices(getApiGroupServicesDeferred, apiGroup, serviceId, serviceName, serviceURL);

        return getApiGroupServicesDeferred;
      },
      getServiceDetails: function (serviceId) {
        getServiceDetailsDeferred = $.Deferred();
        getServiceDetails(getServiceDetailsDeferred, serviceId);

        return getServiceDetailsDeferred;
      }
    };
  };

  return new APIBuilderSearchModel();
});