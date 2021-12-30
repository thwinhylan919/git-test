define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reportGenerationModel = function() {
    const Model = function() {
        this.reportParams = {
          emailId: null,
          mobileNo: null,
          startDate: null,
          endDate: null
        };
      },
      baseService = BaseService.getInstance();
    let fetchEnumerationDeferred;
    const fetchEnumeration = function(deferred) {
      const options = {
        url: "enumerations/transactionType",
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
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      fetchEnumeration: function() {
        fetchEnumerationDeferred = $.Deferred();
        fetchEnumeration(fetchEnumerationDeferred);

        return fetchEnumerationDeferred;
      }
    };
  };

  return new reportGenerationModel();
});