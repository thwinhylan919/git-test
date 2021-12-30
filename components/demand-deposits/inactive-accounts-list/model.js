define(["baseService"], function(BaseService) {
  "use strict";

  const InactiveAccountsModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchInactiveAccounts: function() {
        const options = {
          url: "accounts/demandDeposit?status=CLOSED"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new InactiveAccountsModel();
});