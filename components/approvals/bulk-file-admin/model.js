define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BulkFileAdminModel = function() {
    const baseService = BaseService.getInstance();
    let getTransactionListDeferred;
    const getTransactionList = function(deferred, view,roleType) {
      const url = "transactions?view={view}&discriminator={discriminator}&roleType={roleType}",
        options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          discriminator: "BULK_FILE_ADMIN",
          view: view,
          roleType:roleType
        };

      baseService.fetch(options, params);
    };

    return {
      getTransactionList: function(view,roleType) {
        getTransactionListDeferred = $.Deferred();
        getTransactionList(getTransactionListDeferred, view,roleType);

        return getTransactionListDeferred;
      }
    };
  };

  return new BulkFileAdminModel();
});