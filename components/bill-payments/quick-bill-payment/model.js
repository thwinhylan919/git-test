define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const QuickBillPaymentModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.QuickBillPayDetails = {
          id: null,
          debitAccount: {
            value: null,
            displayValue: null
          },
          customerName: null,
          billerRegistrationId: null,
          billAmount: {
            currency: null,
            amount: null
          },
          paymentDate: null,
          planId: null,
          billerId: null,
          location: null,
          billerName: null,
          billId: null,
          partyId: null,
          cardExpiryDate: null,
          paymentStatus: "COM",
          billPaymentRelDetails: [],
          paymentType: null,
          payLater: "false",
          recurring: "false",
          billerType: null,
          locationId: null,
          categoryId: null,
          category: null,
          paymentHostStatus: null,
          billerRegistration: {
            billerNickName: null,
            autopayInstructions: {
              frequency: null,
              endDate: null
            }
          }
        };
      };
    let fetchCategoryDeferred;
    const fetchCategory = function(deferred) {
      const options = {
        url: "categories",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchLocationDeferred;
    const fetchLocation = function(categoryId, deferred) {
      const options = {
          url: "operationalareas?categoryId={categoryId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          categoryId: categoryId
        };

      baseService.fetch(options, params);
    };
    let fetchBillersDeferred;
    const fetchBillers = function(categoryId, locationId, deferred) {
      const options = {
          url: "billers?categoryId={categoryId}&operationalAreaId={operationalAreaId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          categoryId: categoryId,
          operationalAreaId: locationId
        };

      baseService.fetch(options, params);
    };
    let retrieveImageDeffered;
    const retrieveImage = function(id, deferred) {
      const options = {
          url: "contents/{id}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.fetch(options, params);
    };
    let fetchNicknamesDeferred;
    const fetchNicknames = function(deferred) {
      const options = {
        url: "registeredBillers/userDetails",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fireBatchDeferred;
    const fireBatch = function(deferred, subRequestList, type) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {
        type: type
      }, subRequestList);
    };
    let fetchBillerDetailsDeferred;
    const fetchBillerDetails = function(billerId, deferred) {
      const options = {
          url: "billers/{billerId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          billerId: billerId
        };

      baseService.fetch(options, params);
    };
    let listAccessPointDeferred;
    const listAccessPoint = function(deferred) {
      const options = {
        url: "accessPoints",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      fetchCategory: function() {
        fetchCategoryDeferred = $.Deferred();
        fetchCategory(fetchCategoryDeferred);

        return fetchCategoryDeferred;
      },
      fetchLocation: function(categoryId) {
        fetchLocationDeferred = $.Deferred();
        fetchLocation(categoryId, fetchLocationDeferred);

        return fetchLocationDeferred;
      },
      fetchBillers: function(categoryId, locationId) {
        fetchBillersDeferred = $.Deferred();
        fetchBillers(categoryId, locationId, fetchBillersDeferred);

        return fetchBillersDeferred;
      },
      retrieveImage: function(id) {
        retrieveImageDeffered = $.Deferred();
        retrieveImage(id, retrieveImageDeffered);

        return retrieveImageDeffered;
      },
      fetchNicknames: function() {
        fetchNicknamesDeferred = $.Deferred();
        fetchNicknames(fetchNicknamesDeferred);

        return fetchNicknamesDeferred;
      },
      fireBatch: function(subRequestList, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, subRequestList, type);

        return fireBatchDeferred;
      },
      fetchBillerDetails: function(billerId) {
        fetchBillerDetailsDeferred = $.Deferred();
        fetchBillerDetails(billerId, fetchBillerDetailsDeferred);

        return fetchBillerDetailsDeferred;
      },
      listAccessPoint: function() {
        listAccessPointDeferred = $.Deferred();
        listAccessPoint(listAccessPointDeferred);

        return listAccessPointDeferred;
      }
    };
  };

  return new QuickBillPaymentModel();
});
