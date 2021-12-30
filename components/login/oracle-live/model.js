define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const OracleLiveModel = function() {
    const baseService = BaseService.getInstance();
    let getAccessTokenDeferred;
    const getAccessToken = function(deferred) {
      const options = {
        url: "liveExperience/accessToken",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getPreferenceDeferred;
    const getPreference = function(deferred) {
      const options = {
        url: "configurations/help",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      return baseService.fetch(options);
    };

    return {
      getAccessToken: function() {
        getAccessTokenDeferred = $.Deferred();
        getAccessToken(getAccessTokenDeferred);

        return getAccessTokenDeferred;
      },
      getPreference: function() {
        getPreferenceDeferred = $.Deferred();
        getPreference(getPreferenceDeferred);

        return getPreferenceDeferred;
      }
    };
  };

  return new OracleLiveModel();
});