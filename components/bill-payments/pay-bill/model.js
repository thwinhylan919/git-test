define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    Model = function() {
      this.BillerPaymentDetails = {
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
          billerNickName: "null",
          autopayInstructions: {
            frequency: null,
            endDate: null
          }
        }
      };
    },
    PayBillModel = function() {
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
      let listRechargePlansDeferred;
      const listRechargePlans = function(billerId, deferred) {
        const options = {
          url: "plans?billerID={billerID}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          billerID: billerId
        };

        baseService.fetch(options, params);
      };

      return {
        getNewModel: function() {
          return new Model();
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
        fetchLocationDetails: function(operationalAreaId) {
          fetchLocationDetailsDeferred = $.Deferred();
          fetchLocationDetails(operationalAreaId, fetchLocationDetailsDeferred);

          return fetchLocationDetailsDeferred;
        },
        listAccessPoint: function() {
          listAccessPointDeferred = $.Deferred();
          listAccessPoint(listAccessPointDeferred);

          return listAccessPointDeferred;
        },
        listRechargePlans: function(billerId) {
          listRechargePlansDeferred = $.Deferred();
          listRechargePlans(billerId, listRechargePlansDeferred);

          return listRechargePlansDeferred;
        }
      };
    };

  return new PayBillModel();
});
