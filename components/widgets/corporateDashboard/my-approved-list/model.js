define([
  "baseService"
], function (BaseService) {
  "use strict";

  const transactionList = function () {
    const baseService = BaseService.getInstance();

    return {
      getTransactionsList: function (fromDate, toDate) {
        const options = {
            url: "transactions/count?countFor={countFor}&fromDate={fromDate}&toDate={toDate}",
            mockedUrl: "framework/json/design-dashboard/corporateDashboard/my-approved-list.json"
          },
          params = {
            countFor: "approved",
            fromDate: fromDate,
            toDate: toDate
          };

        return baseService.fetchWidget(options, params);
      }
    };
  };

  return new transactionList();
});