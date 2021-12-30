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
    let params,
    createRepaymentRequestDeferred;
    const createRepaymentRequest = function(accountId, dataToBeSent, deferred) {
      params = {
        accountId: accountId
      };

      const options = {
        url: "accounts/loan/{accountId}/repayments",
        data: dataToBeSent,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options, params);
    };

    return {
      createRepaymentRequest: function(accountId, dataToBeSent) {
        createRepaymentRequestDeferred = $.Deferred();
        createRepaymentRequest(accountId, dataToBeSent, createRepaymentRequestDeferred);

        return createRepaymentRequestDeferred;
      }
    };
  };

  return new LoansRepayModel();
});