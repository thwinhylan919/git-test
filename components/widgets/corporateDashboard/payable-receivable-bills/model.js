define([
  "baseService"
], function(BaseService) {
  "use strict";

  const PayableBillsModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchPayableBills: function() {
        const options = {
          url: "bills/summary",
          mockedUrl: "framework/json/design-dashboard/corporateDashboard/payable-receivable-bills.json"
        };

        return baseService.fetchWidget(options);
      }
    };
  };

  return new PayableBillsModel();
});
