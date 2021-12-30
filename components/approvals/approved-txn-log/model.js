define([
  "baseService"
], function(BaseService) {
  "use strict";

  const transactionList = function() {
    const baseService = BaseService.getInstance();

    return {
      getTransactionsList: function(fromDate, toDate,roleType) {
        return baseService.fetch({
          url: "transactions/count?countFor={countFor}&fromDate={fromDate}&toDate={toDate}&roleType={roleType}"
        }, {
          countFor: "approved",
          fromDate: fromDate,
          toDate: toDate,
          roleType: roleType
        });
      }
    };
  };

  return new transactionList();
});