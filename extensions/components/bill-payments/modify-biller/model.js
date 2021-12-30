define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    Model = function() {
      this.ModifiedBillerDetails = {
        billerRegistrationId: null,
        billerNickName: null,
        autopay: "false",
        schedulePayment: "false",
        autopayInstructions: {
          paymentType: null,
          debitAccount: {
            displayValue: null,
            value: null
          },
          limitAmount: {
            currency: null,
            amount: null
          },
          startDate: null,
          endDate: null,
          frequency: null
        }
      };
    },
    ManageBillerRegistrationModel = function() {
      let fetchCategoryDeferred;
      const fetchCategory = function(categoryId, deferred) {
        const options = {
            url: "categories/{categoryId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            categoryId: categoryId
          };

        baseService.fetch(options, params);
      };
      let fetchLocationDetailsDeferred;
      const fetchLocationDetails = function(operationalAreaId, deferred) {
        const options = {
            url: "operationalareas/{operationalAreaId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            operationalAreaId: operationalAreaId
          };

        baseService.fetch(options, params);
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
      let fetchRegisteredBillersDeferred;
      const fetchRegisteredBillers = function(deferred) {
        const options = {
          url: "registeredBillers",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchRegisteredBillerDetailsDeferred;
      const fetchRegisteredBillerDetails = function(billerRegistrationId, deferred) {
        const options = {
            url: "registeredBillers/{billerRegistrationId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            billerRegistrationId: billerRegistrationId
          };

        baseService.fetch(options, params);
      };
      let deleteBillerDeferred;
      const deleteBiller = function(billerRegistrationId, deferred) {
        const options = {
            url: "registeredBillers/{billerRegistrationId}",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          },
          params = {
            billerRegistrationId: billerRegistrationId
          };

        baseService.remove(options, params);
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

      return {
        getNewModel: function() {
          return new Model();
        },
        fetchCategory: function(categoryId) {
          fetchCategoryDeferred = $.Deferred();
          fetchCategory(categoryId, fetchCategoryDeferred);

          return fetchCategoryDeferred;
        },
        fetchLocationDetails: function(operationalAreaId) {
          fetchLocationDetailsDeferred = $.Deferred();
          fetchLocationDetails(operationalAreaId, fetchLocationDetailsDeferred);

          return fetchLocationDetailsDeferred;
        },
        fetchBillerDetails: function(billerId) {
          fetchBillerDetailsDeferred = $.Deferred();
          fetchBillerDetails(billerId, fetchBillerDetailsDeferred);

          return fetchBillerDetailsDeferred;
        },
        fetchRegisteredBillers: function() {
          fetchRegisteredBillersDeferred = $.Deferred();
          fetchRegisteredBillers(fetchRegisteredBillersDeferred);

          return fetchRegisteredBillersDeferred;
        },
        fetchRegisteredBillerDetails: function(billerRegistrationId) {
          fetchRegisteredBillerDetailsDeferred = $.Deferred();
          fetchRegisteredBillerDetails(billerRegistrationId, fetchRegisteredBillerDetailsDeferred);

          return fetchRegisteredBillerDetailsDeferred;
        },
        deleteBiller: function(billerRegistrationId) {
          deleteBillerDeferred = $.Deferred();
          deleteBiller(billerRegistrationId, deleteBillerDeferred);

          return deleteBillerDeferred;
        },
        fetchNicknames: function() {
          fetchNicknamesDeferred = $.Deferred();
          fetchNicknames(fetchNicknamesDeferred);

          return fetchNicknamesDeferred;
        }
      };
    };

  return new ManageBillerRegistrationModel();
});