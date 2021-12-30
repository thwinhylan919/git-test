define(["baseService"], function(BaseService) {
  "use strict";

  const LinkAccountModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    const baseService = BaseService.getInstance();

    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    return {
      fetchAccesstoken : function() {
        const options = {
          url: "accesstokens",
          showMessage: false
        };

        return baseService.fetch(options);
      }
    };
  };

  return new LinkAccountModel();
});
