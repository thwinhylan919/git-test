define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const AdditionalKycModel = function() {
    const baseService = BaseService.getInstance();
    let fetchOccupationListDeferred;
    const fetchOccupationList = function(deferred) {
      const options = {
        url: "enumerations/occupationType",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchGrossAnnualIncomeListDeferred;
    const fetchGrossAnnualIncomeList = function(deferred) {
      const options = {
        url: "enumerations/occupationType",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchOccupationList: function() {
        fetchOccupationListDeferred = $.Deferred();
        fetchOccupationList(fetchOccupationListDeferred);

        return fetchOccupationListDeferred;
      },
      fetchGrossAnnualIncomeList: function() {
        fetchGrossAnnualIncomeListDeferred = $.Deferred();
        fetchGrossAnnualIncomeList(fetchGrossAnnualIncomeListDeferred);

        return fetchGrossAnnualIncomeListDeferred;
      }
    };
  };

  return new AdditionalKycModel();
});