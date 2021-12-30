define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BulkModel = function() {
    const baseService = BaseService.getInstance();
    let getActivityLogDetailsDeferred;
    const getTransactionList = function(deferred, view, fromDate, toDate,roleType) {
      let url = "transactions?view={view}&discriminator={discriminator}&roleType={roleType}";

      if (fromDate && toDate) {
        url += "&fromDate={fromDate}&toDate={toDate}";
      }

      const options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          discriminator: "NON_FINANCIAL_BULK_FILE",
          view: view,
          fromDate: fromDate,
          toDate: toDate,
          roleType:roleType
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