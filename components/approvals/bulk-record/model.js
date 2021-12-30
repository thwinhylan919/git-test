define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BulkModel = function() {
    const baseService = BaseService.getInstance();
    let getActivityLogDetailsDeferred;
    const getTransactionList = function(deferred, view, fromDate, toDate,roleType) {
      const url = "transactions?view={view}&discriminator={discriminator}&roleType={roleType}&fromDate={fromDate}&toDate={toDate}",
        options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          discriminator: "BULK_RECORD",
          view: view,
          fromDate: fromDate,
          toDate: toDate,
          roleType: roleType
        };

      baseService.fetch(options, params);
    };

    return {
      getTransactionList: function(view, fromDate, toDate,roleType) {
        getActivityLogDetailsDeferred = $.Deferred();
        getTransactionList(getActivityLogDetailsDeferred, view, fromDate, toDate,roleType);

        return getActivityLogDetailsDeferred;
      }
    };
  };

  return new BulkModel();
});