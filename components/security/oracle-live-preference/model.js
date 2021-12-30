define(["baseService"], function(BaseService) {
  "use strict";

  const OracleLivePreferenceModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getPreference: function() {
        const options = {
          url: "me/preferences?userID"
        };

        return baseService.fetch(options);
      },
      updatePreference: function(payload) {
        const options = {
          data: payload,
          url: "me/preferences"
        };

        return baseService.update(options);
      }
    };
  };

  return new OracleLivePreferenceModel();
});