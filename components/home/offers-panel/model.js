define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const OffersModel = function() {
    const Model = function() {
      this.offers = {
        offerName: "",
        applicationFees: "",
        interestRate: "",
        offerId: ""
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let prodGrpId, fetchOffersAdditionalDetailsDeferred;
    const fetchOffersAdditionalDetails = function(deferred, offerId, productType) {
      const params = {
          offerId: offerId,
          productType: productType
        },
        options = {
          url: "offers/{offerId}?productType={productType}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchOffersDeferred;
    const fetchOfferDetails = function(deferred, offerId) {
      const params = {
          productGroupId: prodGrpId,
          productId: offerId
        },
        options = {
          url: "productGroups/{productGroupId}/products/{productId}/offers",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let getOffersDeferred;
    const getOffers = function(deferred) {
      const params = {
          productGroupId: prodGrpId
        },
        options = {
          url: "productGroups/{productGroupId}/offers",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let createSessionDeferred;
    const createSession = function(deferred) {
        const options = {
          url: "session",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.add(options);
      },
      errors = {
        InitializationException: function() {
          let message = "";

          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\",\"productGroupSerialNumber\");";

          return message;
        }(),
        ObjectNotInitialized: function() {
          let message = "";

          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\",\"productGroupSerialNumber\");";

          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };

    return {
      init: function(productGroupId) {
        prodGrpId = productGroupId || undefined;

        if (!prodGrpId) {
          throw new Error(errors.InitializationException);
        }

        modelInitialized = true;

        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getOffers: function() {
        objectInitializedCheck();
        getOffersDeferred = $.Deferred();
        getOffers(getOffersDeferred);

        return getOffersDeferred;
      },
      fetchOfferDetails: function(offerId) {
        objectInitializedCheck();
        fetchOffersDeferred = $.Deferred();
        fetchOfferDetails(fetchOffersDeferred, offerId);

        return fetchOffersDeferred;
      },
      fetchOffersAdditionalDetails: function(offerId, productType) {
        objectInitializedCheck();
        fetchOffersAdditionalDetailsDeferred = $.Deferred();
        fetchOffersAdditionalDetails(fetchOffersAdditionalDetailsDeferred, offerId, productType);

        return fetchOffersAdditionalDetailsDeferred;
      },
      createSession: function() {
        createSessionDeferred = $.Deferred();
        createSession(createSessionDeferred);

        return createSessionDeferred;
      }
    };
  };

  return new OffersModel();
});