define(["baseService"], function(BaseService) {
  "use strict";

  const AccontSnapshotModel = function() {
    const baseService = BaseService.getInstance();

    return {
      getTransactions: function(accountId) {
        const options = {
          url: "accounts/demandDeposit/{accountId}/transactions?noOfTransactions=5&searchBy=LNT"
        };

        return baseService.fetch(options, {
          accountId: accountId
        });
      }
    };
  };

  return new AccontSnapshotModel();
});