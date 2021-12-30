define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  const LoansRepayModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    const baseService = BaseService.getInstance();
    let params;
    const Model = function() {
      this.settlementAccountId = {
        displayValue: null,
        value: null
      };

      this.loanAccountId = {
        displayValue: null,
        value: null
      };

      this.amount = {
        amount: null,
        currency: null
      };

      this.installmentArrears = {
        amount: null,
        currency: null
      };

      this.principalBalance = {
        amount: null,
        currency: null
      };

      this.date = null;
    };
    let createRepaymentRequestDeferred;
    const createRepaymentRequest = function(accountId, dataToBeSent, deferred) {
      params = {
        accountId: accountId
      };

      const options = {
        url: "accounts/loan/{accountId}/repayments",
        data: dataToBeSent,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options, params);
    };
    let fetchOutstandingInfoDeferred;
    const fetchOutstandingInfo = function(accountId,installmentDate, deferred) {
      params = {
        accountId: accountId,
        installmentDate:installmentDate
      };

      const options = {
        url: "accounts/loan/{accountId}/outstanding?installmentDate={installmentDate}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      createRepaymentRequest: function(accountId, dataToBeSent) {
        createRepaymentRequestDeferred = $.Deferred();
        createRepaymentRequest(accountId, dataToBeSent, createRepaymentRequestDeferred);

        return createRepaymentRequestDeferred;
      },
      fetchOutstandingInfo: function(accountId,installmentDate) {
        fetchOutstandingInfoDeferred = $.Deferred();
        fetchOutstandingInfo(accountId,installmentDate, fetchOutstandingInfoDeferred);

        return fetchOutstandingInfoDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };

  return new LoansRepayModel();
});