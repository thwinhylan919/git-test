define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const APIBuilderGroupViewModel = function () {
    const baseService = BaseService.getInstance();
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
    let fetchModuleNameDeferred;
    const fetchModuleName = function (deferred) {
      const options = {
        url: "enumerations/entitlementCategory",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchCategoryNameDeferred;
    const fetchCategoryName = function (id, deferred) {
      if (id.length !== 0) {
        const options = {
          url: "enumerations/entitlementCategory/" + id + "/subcategories",
          success: function (data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      }
    };
    let fetchActionTypeDeferred;
    const fetchActionType = function (deferred) {
      const options = {
        url: "enumerations/actionTypes",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchTransactionTypeDeferred;
    const fetchTransactionType = function (deferred) {
      const options = {
        url: "enumerations/taskType",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchTaskAspectDeferred;
    const fetchTaskAspect = function (deferred) {
      const options = {
        url: "enumerations/taskAspect",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
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

    return {
      getServiceDetails: function (serviceId) {
        getServiceDetailsDeferred = $.Deferred();
        getServiceDetails(getServiceDetailsDeferred, serviceId);

        return getServiceDetailsDeferred;
      },
      fetchModuleName: function () {
        fetchModuleNameDeferred = $.Deferred();
        fetchModuleName(fetchModuleNameDeferred);

        return fetchModuleNameDeferred;
      },
      fetchCategoryName: function (id) {
        fetchCategoryNameDeferred = $.Deferred();
        fetchCategoryName(id, fetchCategoryNameDeferred);

        return fetchCategoryNameDeferred;
      },
      fetchActionType: function () {
        fetchActionTypeDeferred = $.Deferred();
        fetchActionType(fetchActionTypeDeferred);

        return fetchActionTypeDeferred;
      },
      fetchTransactionType: function () {
        fetchTransactionTypeDeferred = $.Deferred();
        fetchTransactionType(fetchTransactionTypeDeferred);

        return fetchTransactionTypeDeferred;
      },
      fetchTaskAspect: function () {
        fetchTaskAspectDeferred = $.Deferred();
        fetchTaskAspect(fetchTaskAspectDeferred);

        return fetchTaskAspectDeferred;
      },
      getApiGroups: function () {
        getApiGroupsDeferred = $.Deferred();
        getApiGroups(getApiGroupsDeferred);

        return getApiGroupsDeferred;
      }
    };
  };

  return new APIBuilderGroupViewModel();
});