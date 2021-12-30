define([
  "baseService"
], function(BaseService) {
  "use strict";

  const RequestPinModel = function() {
    const baseService = BaseService.getInstance();

    return {
      updatePIN: function(model, creditCardId) {
        const params = {
          creditCardId: creditCardId
        },
        options = {
          url: "accounts/cards/credit/{creditCardId}/credentials",
          data: model
        };

        return baseService.update(options, params);
      }
    };
  };

  return new RequestPinModel();
});
