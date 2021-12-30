define(["baseService"], function(BaseService) {
  "use strict";

  const AccontSnapshotModel = function() {
    const baseService = BaseService.getInstance();

    return {
      missedCallBankingAndSMSBanking: function(payload) {
        const options = {
          url: "smsbanking/pinRegistration",
          data: payload
        };

        return baseService.update(options);
      },
      smsbankingpinRegistrationRead: function() {
        const options = {
          url: "smsbanking/pinRegistration"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new AccontSnapshotModel();
});