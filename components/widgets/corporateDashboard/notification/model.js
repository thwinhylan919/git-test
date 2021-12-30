define([
  "baseService"
], function(BaseService) {
  "use strict";

  /* Extending predefined baseService to get ajax functions. */
  const baseService = BaseService.getInstance(),
    MiniMailboxModel = function() {
      return {
        getNotifications: function() {
          const options = {
            url: "mailbox/mailers"
          };

          return baseService.fetch(options);
        }
      };
    };

  return new MiniMailboxModel();
});
