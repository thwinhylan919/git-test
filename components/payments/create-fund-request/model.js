define([

  "baseService"
], function(BaseService) {
  "use strict";

  const createFundRequestModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.payDetails = {
          title: null,
          status: null,
          requestee: null,
          totalAmount: {
            currency: null,
            amount: null
          },
          collections: []
        };

        this.computeDetails = {
          name: null,
          amount: null,
          percentage: null
        };

        this.fundCollectionDetails = {
          status: null,
          amount: {
            currency: null,
            amount: null
          },
          recipient: null,
          message: null
        };
      };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      postFundRequest: function(payload) {
        const options = {
          url: "fundRequests",
          data: payload
        };

        return baseService.add(options);
      }
    };
  };

  return new createFundRequestModel();
});