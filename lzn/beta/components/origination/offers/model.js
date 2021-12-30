define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const OffersModel = function() {
    const Model = function() {
      this.offers = {
        offerName: "",
        features: "",
        offerId: ""
      };
    };
    let modelInitialized = false;
    const baseService = BaseService.getInstance();
    let submissionId, productGroupSerialNumber, getOffersDeferred;
    const getOffers = function(deferred) {
      const params = {
          submissionId: submissionId,
          productGroupSerialNumber: productGroupSerialNumber
        },
        options = {
          url: "submissions/{submissionId}/products/{productGroupSerialNumber}/offers",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchSelectedOfferDeferred;
    const fetchSelectedOffer = function(deferred) {
      const params = {
          submissionId: submissionId,
          productGroupSerialNumber: productGroupSerialNumber
        },
        options = {
          url: "submissions/{submissionId}/products/{productGroupSerialNumber}/selectedOffer",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let submitOffersDeferred;
    const submitOffers = function(offerId, deferred) {
        const params = {
            submissionId: submissionId,
            productGroupSerialNumber: productGroupSerialNumber
          },
          options = {
            url: "submissions/{submissionId}/products/{productGroupSerialNumber}/selectedOffer",
            data: JSON.stringify({
              offerId: offerId
            }),
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.add(options, params);
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
      init: function(subId, serialNumber) {
        submissionId = subId || undefined;
        productGroupSerialNumber = serialNumber || undefined;

        if (!submissionId || !productGroupSerialNumber) {
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
      fetchSelectedOffer: function() {
        objectInitializedCheck();
        fetchSelectedOfferDeferred = $.Deferred();
        fetchSelectedOffer(fetchSelectedOfferDeferred);

        return fetchSelectedOfferDeferred;
      },
      submitOffers: function(offerId) {
        objectInitializedCheck();
        submitOffersDeferred = $.Deferred();
        submitOffers(offerId, submitOffersDeferred);

        return submitOffersDeferred;
      }
    };
  };

  return new OffersModel();
});