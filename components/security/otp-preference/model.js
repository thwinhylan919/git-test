define(["baseService"], function (BaseService) {
  "use strict";

  const Model = function () {
    const baseService = BaseService.getInstance();

    return {
      getPreference: function () {
        return baseService.fetch({
          url: "me/preferences?userID"
        });
      },
      updatePreference: function (payload) {
        return baseService.update({
          url: "me/preferences",
          data: payload
        });
      }
    };
  };

  return new Model();
});