define([

  "baseService"
], function (BaseService) {
  "use strict";

  const transactionList = function () {
    const baseService = BaseService.getInstance();

    return {
      getTransactionsList: function (view, roleType, fromDate, toDate) {
        const options = {
            url: "transactions/count?countFor={countFor}&roleType={roleType}&fromDate={fromDate}&toDate={toDate}",
            mockedUrl:"framework/json/design-dashboard/approval/count.json"
          },
          params = {
            countFor: view,
            roleType: roleType,
            fromDate: fromDate,
            toDate: toDate
          };

        return baseService.fetchWidget(options, params);
      }
    };
  };

  return new transactionList();
});