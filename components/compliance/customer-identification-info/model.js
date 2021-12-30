define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const CustomerIdentificationModel = function() {
    const baseService = BaseService.getInstance();
    let fetchCountryListDeferred;
    const fetchCountryList = function(deferred) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchStateListDeferred;
    const fetchStateList = function(country, deferred) {
      const params = {
          country: country
        },
        options = {
          url: "enumerations/country/{country}/state",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchIdentificationListDeferred;
    const fetchIdentificationList = function(deferred) {
      const options = {
        url: "enumerations/fatcaIdentificationType",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchCountryList: function() {
        fetchCountryListDeferred = $.Deferred();
        fetchCountryList(fetchCountryListDeferred);

        return fetchCountryListDeferred;
      },
      fetchStateList: function(country) {
        fetchStateListDeferred = $.Deferred();
        fetchStateList(country, fetchStateListDeferred);

        return fetchStateListDeferred;
      },
      fetchIdentificationList: function() {
        fetchIdentificationListDeferred = $.Deferred();
        fetchIdentificationList(fetchIdentificationListDeferred);

        return fetchIdentificationListDeferred;
      }
    };
  };

  return new CustomerIdentificationModel();
});