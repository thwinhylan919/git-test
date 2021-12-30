define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ScheduledPaymentsInfoModel = function() {
    const baseService = BaseService.getInstance();
    let getHostDateDeferred;
    const getHostDate = function(deferred) {
      const options = {
        url: "payments/currentDate",
        mockedUrl:"framework/json/design-dashboard/payments/scheduled-payments/scheduled-payments.json",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetchWidget(options);

    };
    let getUpcomingPaymentsListDeferred;
    const getUpcomingPaymentsList = function(fromDate, toDate, deferred) {
      const options = {
          url: "payments/instructions?status=ACTIVE&type=ALL&maxRecords=4&fromDate={fromDate}&toDate={toDate}",
          mockedUrl:"framework/json/design-dashboard/payments/scheduled-payments/upcoming-payment-list.json",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          fromDate: fromDate,
          toDate: toDate
        };

        baseService.fetchWidget(options, params);

    };
    let fireBatchDeferred;
      const batchRead = function(deferred, batchRequest, type) {
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
      }, batchRequest);
    };

    return {
      getUpcomingPaymentsList: function(fromDate, toDate) {
        getUpcomingPaymentsListDeferred = $.Deferred();
        getUpcomingPaymentsList(fromDate, toDate, getUpcomingPaymentsListDeferred);

        return getUpcomingPaymentsListDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);

        return getHostDateDeferred;
      },
      batchRead: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        batchRead(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      getPayeeMaintenance: function() {

        return baseService.fetchWidget({
          url: "maintenances/payments",
          mockedUrl:"framework/json/design-dashboard/payments/scheduled-payments/maitenance-payments.json"
        });

      }
    };
  };

  return new ScheduledPaymentsInfoModel();
});