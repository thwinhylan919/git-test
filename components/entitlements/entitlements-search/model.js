define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const EntitlementSearchModel = function() {
    const baseService = BaseService.getInstance();

    this.getNewModel = function() {
      return new this.Model();
    };

    let fetchModuleNameDeferred;
    const fetchModuleName = function(deferred) {
      const options = {
        url: "enumerations/entitlementCategory",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchCategoryNameDeferred;
    const fetchCategoryName = function(id, deferred) {
      const params = {id : id};

      if (id.length !== 0) {
        const options = {
          url: "enumerations/entitlementCategory/{id}/subcategories",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options,params);
      }
    };
    let fetchEntitlementsDeferred;
    const fetchEntitlements = function(searchParams, deferred) {
      const options = {
        url: "entitlementGroups?module={module}&category={categoryName}&entitlement={entitlementName}",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, searchParams);
    };

    return {
      fetchModuleName: function() {
        fetchModuleNameDeferred = $.Deferred();
        fetchModuleName(fetchModuleNameDeferred);

        return fetchModuleNameDeferred;
      },
      fetchCategoryName: function(id) {
        fetchCategoryNameDeferred = $.Deferred();
        fetchCategoryName(id, fetchCategoryNameDeferred);

        return fetchCategoryNameDeferred;
      },
      fetchEntitlements: function(searchParams) {
        fetchEntitlementsDeferred = $.Deferred();
        fetchEntitlements(searchParams, fetchEntitlementsDeferred);

        return fetchEntitlementsDeferred;
      }
    };
  };

  return new EntitlementSearchModel();
});