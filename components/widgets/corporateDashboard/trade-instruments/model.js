define([
  "baseService"
], function (BaseService) {
  "use strict";

  const tradeInstrumentsModel = function () {
    const baseService = BaseService.getInstance();

    return {
      fetchTradeInstruments: function (expiryDate) {
        const options = {
          url: "tradefinance/summary?expiryDate={expiryDate}",
          mockedUrl: "framework/json/design-dashboard/corporateDashboard/trade-instruments.json"
        };

        return baseService.fetchWidget(options, {
          expiryDate: expiryDate
        });
      }
    };
  };

  return new tradeInstrumentsModel();
});