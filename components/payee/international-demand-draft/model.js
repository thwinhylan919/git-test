define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const internationalDDPayeeModel = function() {
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let city, branchCode,
      getCountriesDeferred;
    const getCountries = function(deferred) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getBranchesDeferred;
    const getBranches = function(deferred) {
      const options = {
          url: "locations/country/all/city/{city}/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          city: city
        };

      baseService.fetch(options, params);
    };
    let getCitiesDeferred;
    const getCities = function(deferred) {
      const options = {
        url: "locations/country/all/city",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getBranchAddressDeferred;
    const getBranchAddress = function(deferred) {
      const options = {
          url: "locations/branches?branchCode={branchCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          branchCode: branchCode
        };

      baseService.fetch(options, params);
    };
    let getPostOrCourierAddressDeferred;
    const getPostOrCourierAddress = function(deferred) {
      const options = {
        url: "parties/me/addresses",
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
      /**
       * Method to initialize the described model.
       */
      init: function(bCode) {
        branchCode = bCode || undefined;
      },
      getCountries: function() {
        getCountriesDeferred = $.Deferred();
        getCountries(getCountriesDeferred);

        return getCountriesDeferred;
      },
      getBranchAddress: function() {
        getBranchAddressDeferred = $.Deferred();
        getBranchAddress(getBranchAddressDeferred);

        return getBranchAddressDeferred;
      },
      getBranches: function() {
        getBranchesDeferred = $.Deferred();
        getBranches(getBranchesDeferred);

        return getBranchesDeferred;
      },
      getCities: function() {
        getCitiesDeferred = $.Deferred();
        getCities(getCitiesDeferred);

        return getCitiesDeferred;
      },
      getPostOrCourierAddress: function() {
        getPostOrCourierAddressDeferred = $.Deferred();
        getPostOrCourierAddress(getPostOrCourierAddressDeferred);

        return getPostOrCourierAddressDeferred;
      }
    };
  };

  return new internationalDDPayeeModel();
});