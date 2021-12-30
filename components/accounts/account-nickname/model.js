define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const accountNicknameModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.AccountNickname = {
          accountNicknameDTOs: [{
            accountNickname: null,
            accountNumber: null,
            partyId: null,
            accountType: null
          }]
        };
      };
    let accountNicknameDeferred;
    const accountNickname = function(data, deferred) {
      const options = {
        url: "accountNickname",
        data: data,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };

    return {
      accountNickname: function(data) {
        accountNicknameDeferred = $.Deferred();
        accountNickname(data, accountNicknameDeferred);

        return accountNicknameDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };

  return new accountNicknameModel();
});