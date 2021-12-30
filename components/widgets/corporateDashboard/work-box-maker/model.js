define([

  "baseService"
], function(BaseService) {
  "use strict";

  const ActivityLogModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getCountList: function(view, fromDate, toDate) {
        const options = {
          url: "transactions/count?countFor={view}&fromDate={fromDate}&toDate={toDate}",
          mockedUrl:"framework/json/design-dashboard/corporateDashboard/work-box-maker/work-box-maker.json"
        };

        return baseService.fetchWidget(options, {
          fromDate: fromDate,
          toDate: toDate,
          view: view
        });
      },
      getTransactionList: function(view, fromDate, toDate) {
        let url = "transactions?view={view}&discriminator={discriminator}";

        if (fromDate && toDate) {
          url += "&fromDate={fromDate}&toDate={toDate}";
        }

        const options = {
            url: url,
            mockedUrl:"framework/json/design-dashboard/accounts/demand-deposit.json"
          },
          params = {
            discriminator: "PAYMENTS",
            view: view,
            fromDate: fromDate,
            toDate: toDate
          };

        return baseService.fetchWidget(options, params);
      }
    };
  };

  return new ActivityLogModel();
});