define(["baseService"], function(BaseService) {
  "use strict";

  const AlternateLogin = function() {
    const baseService = BaseService.getInstance();

    return {
      session: function() {
        return baseService.add({
          url: "session",
          method: "POST",
          data: ""
        });
      }
    };
  };

  return new AlternateLogin();
});