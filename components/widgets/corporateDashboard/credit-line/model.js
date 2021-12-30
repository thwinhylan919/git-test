define(["baseService"], function(BaseService) {
  "use strict";

  const CreditLineUsageModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchLines: function() {
        const options = {
          url: "parties/lineLimit",
          mockedUrl: "framework/json/design-dashboard/corporateDashboard/credit-line.json"
        };

        return baseService.fetchWidget(options);
      }
    };
  };

  return new CreditLineUsageModel();
});