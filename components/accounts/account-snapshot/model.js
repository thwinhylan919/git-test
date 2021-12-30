define(["baseService"], function(BaseService) {
  "use strict";

  const AccontSnapshotModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getMePreference: function() {
        const options = {
          url: "me/preferences"
        };

        return baseService.fetch(options);
      },
      updateMePreference: function(payload) {
        const options = {
          data: payload,
          url: "me/preferences"
        };

        return baseService.update(options);
      },
      getDemandDeposits: function() {
        const options = {
          url: "accounts/demandDeposit"
        };

        return baseService.fetch(options);
      },
      deleteSession: function() {
        return new Promise(function(resolve, reject) {
          baseService.remove({
            url: "session"
          }).then(function() {
            baseService.invalidateSession();
            resolve();
          }, function() {
            reject();
          });
        });
      }
    };
  };

  return new AccontSnapshotModel();
});