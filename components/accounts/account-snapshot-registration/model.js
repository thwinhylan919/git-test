define(["baseService"], function(BaseService) {
  "use strict";

  const AccontSnapshotRegistrationModel = function() {
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
      }
    };
  };

  return new AccontSnapshotRegistrationModel();
});