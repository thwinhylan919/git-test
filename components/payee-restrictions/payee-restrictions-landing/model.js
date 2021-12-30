define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const payeeCountLimitModel = function payeeCountLimitModel() {
    const Model = function() {
        this.updatePayload = {
          payeeCountLimitList: []
        };

        this.updateElement = {
          payeeType: null,
          payeesPerDay: null,
          payeeCountLimitStatus: null,
          entityDTO:{
            value:null,
            type :null
          }
        };
      },
      baseService = BaseService.getInstance();
    let listAllLimitsDeferred;
    const listAllLimits = function(targetType,targetValue,deferred) {
      const options = {
        url: "payments/maintenances/payeecount?targetType={targetType}&targetValue={targetValue}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
        params = {
          targetType: targetType,
          targetValue: targetValue
        };

      baseService.fetch(options, params);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      listAllLimits: function(targetType,targetValue) {
        listAllLimitsDeferred = $.Deferred();
        listAllLimits(targetType,targetValue,listAllLimitsDeferred);

        return listAllLimitsDeferred;
      },
      addPayeeLimits: function(model) {
            return baseService.update({
             url: "payments/maintenances/payeecount",
             data: model
           });
      }
    };
  };

  return new payeeCountLimitModel();
});