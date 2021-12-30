define([
  "baseService"
], function(BaseService) {
  "use strict";

  const ActivityLogModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getTransactionList: function(view, fromDate, toDate) {
        let url = "transactions?view={view}&discriminator={discriminator}";

        if (fromDate && toDate) {
          url += "&fromDate={fromDate}&toDate={toDate}";
        }

        const options = {
            url: url,
            mockedUrl: "framework/json/design-dashboard/corporateDashboard/recent-payments.json"
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
