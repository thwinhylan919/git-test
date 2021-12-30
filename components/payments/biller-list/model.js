define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BillerListModel = function() {
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let deleteBillerDeferred;
    const deleteBiller = function(billerId, relationshipNumber, deferred) {
      const options = {
        url: "payments/registeredBillers/{billerId}/relations/{relationshipNumber}",
        showInModalWindow : true,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          if (data.status !== 417) {
            deferred.reject(data, status, jqXHR);
          }
        }
      },
      params = {
        billerId: billerId,
        relationshipNumber :relationshipNumber
        };

      baseService.remove(options, params);
    };
    let getCategoriesDeferred;
    const getCategories = function(deferred) {
      const options = {
        url: "payments/billers?categoryType=ALL",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getBillerNamesDeferred;
    const getBillerNames = function(deferred) {
      const options = {
        url: "payments/billers?categoryType=ALL",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getBillerListDeferred;
    const getBillerList = function(deferred) {
      const options = {
        url: "payments/registeredBillers",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getCategories: function() {
        getCategoriesDeferred = $.Deferred();
        getCategories(getCategoriesDeferred);

        return getCategoriesDeferred;
      },
      deleteBiller: function(billerId, relationshipNumber) {
        deleteBillerDeferred = $.Deferred();
        deleteBiller(billerId, relationshipNumber, deleteBillerDeferred);

        return deleteBillerDeferred;
      },
      getBillerList: function() {
        getBillerListDeferred = $.Deferred();
        getBillerList(getBillerListDeferred);

        return getBillerListDeferred;
      },
      getBillerNames: function() {
        getBillerNamesDeferred = $.Deferred();
        getBillerNames(getBillerNamesDeferred);

        return getBillerNamesDeferred;
      }
    };
  };

  return new BillerListModel();
});