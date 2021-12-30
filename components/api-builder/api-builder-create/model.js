define([
  "jquery",
  "baseService"

], function ($, BaseService) {
  "use strict";

  const APIBuilderCreateModel = function () {
    const baseService = BaseService.getInstance(),
      Model = function () {
        this.apiServiceDTO = {
          apiGroupName: null,
          serviceURL: null,
          serviceId: null,
          serviceName: null,
          methodType: null,
          transactionType: null,
          responseRedactionType: null,
          requestRedactionType: null,
          responseRedaction: null,
          refBusinessPolicy: null,
          taskAspects: [],
          taskCode: null,
          headers: null,
          moduleName: null,
          categoryName: null,
          actionTypes: [],
          alertRequired: null,
          jsonPathAcc: null,
          jsonPathParty: null,
          jsonPathCurrency: null,
          jsonPathAmount: null,
          jsonPathErrorCode: null
        };
      };

    this.getNewModel = function () {
      return new this.Model();
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
    let fetchRedactionTypeDeferred;
    const fetchRedactionType = function (deferred) {
      const options = {
        url: "enumerations/redactionTypes",
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
      getNewModel: function (modelData) {
        return new Model(modelData);
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
      fetchActionType: function () {
        fetchActionTypeDeferred = $.Deferred();
        fetchActionType(fetchActionTypeDeferred);

        return fetchActionTypeDeferred;
      },
      fetchRedactionType: function () {
        fetchRedactionTypeDeferred = $.Deferred();
        fetchRedactionType(fetchRedactionTypeDeferred);

        return fetchRedactionTypeDeferred;
      },
      getApiGroups: function () {
        getApiGroupsDeferred = $.Deferred();
        getApiGroups(getApiGroupsDeferred);

        return getApiGroupsDeferred;
      }
    };
  };

  return new APIBuilderCreateModel();
});