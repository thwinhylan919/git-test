define(["baseService"], function(BaseService) {
  "use strict";

  const AccontSnapshotModel = function() {
    const baseService = BaseService.getInstance();

    return {
      smsbankingpinRegistration: function(payload) {
        const options = {
          url: "smsbanking/pinRegistration",
          data: payload
        };

        return baseService.update(options);
      }
    };
  };

  return new AccontSnapshotModel();
});