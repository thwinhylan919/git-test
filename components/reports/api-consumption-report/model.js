define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reportGenerationModel = function() {
    const Model = function() {
        this.reportParams = {
          frequency: null,
          startDate: null,
          endDate: null
        };
      },
      baseService = BaseService.getInstance();
    let fetchFrequenciesDeferred, fetchMeDeferred, fetchMeWithPartyDeferred, fetchAccessPointsDeferred, fetchUserSegmentDeferred;
    const fetchFrequencies = function(deferred, code) {
        const options = {
            url: "enumerations/apiReportFrequency",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            code: code
          };

        baseService.fetch(options, params);
      },
      fetchMe = function(deferred) {
        const options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchMeWithParty = function(deferred) {
        const options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchAccessPoints = function(deferred) {
        const options = {
          url: "accessPoints",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchUserSegment = function(deferred) {
        const options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchFrequencies: function(code) {
        fetchFrequenciesDeferred = $.Deferred();
        fetchFrequencies(fetchFrequenciesDeferred, code);

        return fetchFrequenciesDeferred;
      },
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);

        return fetchMeDeferred;
      },
      fetchMeWithParty: function() {
        fetchMeWithPartyDeferred = $.Deferred();
        fetchMeWithParty(fetchMeWithPartyDeferred);

        return fetchMeWithPartyDeferred;
      },
      fetchAccessPoints: function() {
        fetchAccessPointsDeferred = $.Deferred();
        fetchAccessPoints(fetchAccessPointsDeferred);

        return fetchAccessPointsDeferred;
      },
      fetchUserSegment: function() {
        fetchUserSegmentDeferred = $.Deferred();
        fetchUserSegment(fetchUserSegmentDeferred);

        return fetchUserSegmentDeferred;
      }
    };
  };

  return new reportGenerationModel();
});