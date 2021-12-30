define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    SystemConfigurationStart = function() {
      let Deferred;
      const getHostSelection = function(deferred) {
        const options = {
          url: "configurations/variable/ConfigurationVariable/properties/BANK.DEFAULT.HOST?environmentId=OBDX",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchConfigurationDetailsDeferred;
      const fetchConfigurationDetails = function(deferred) {
        const options = {
          url: "configurations/base/BaseConfig/properties/MULTI_ENTITY_CONFIGURATION",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        getHostSelection: function() {
          Deferred = $.Deferred();
          getHostSelection(Deferred);

          return Deferred;
        },
        fetchConfigurationDetails: function() {
          fetchConfigurationDetailsDeferred = $.Deferred();
          fetchConfigurationDetails(fetchConfigurationDetailsDeferred);

          return fetchConfigurationDetailsDeferred;
        }
      };
    };

  return new SystemConfigurationStart();
});