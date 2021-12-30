define(["baseService"], function(BaseService) {
  "use strict";

  const eStatementModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    const baseService = BaseService.getInstance(),
      estatementDetailsModel = function() {
        this.primaryEmailId = null;
        this.frequency = null;
        this.subscriptionStatus = null;
        this.dayOfMonth = null;
      };

    return {
      updateSubscriptionForStatement: function(cardId, payload) {
        const params = {
          cardId: cardId
        },
        options = {
          url: "accounts/cards/credit/{cardId}/preferences/eStatement",
          data: payload
        };

        return baseService.update(options, params);
      },
      getNewEStatementDetailsModel: function() {
        return new estatementDetailsModel();
      }
    };
  };

  return new eStatementModel();
});
