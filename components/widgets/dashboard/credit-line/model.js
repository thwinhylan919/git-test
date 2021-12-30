define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const CreditLineUsageModel = function() {
    const baseService = BaseService.getInstance();
    let fetchLinesDeferred;
    const fetchLines = function(deferred) {
      const options = {
        url: "parties/lineLimit",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchLines: function() {
        fetchLinesDeferred = $.Deferred();
        fetchLines(fetchLinesDeferred);

        return fetchLinesDeferred;
      }
    };
  };

  return new CreditLineUsageModel();
});