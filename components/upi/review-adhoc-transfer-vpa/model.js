/**
 * Model for adhoc-transfer-vpa
 *
 * @param {object} BaseService instance
 * @param {object} $ instance
 * @return {object} reviewAdhocVpaModel
 */
define([
    "baseService", "jquery"
], function(BaseService, $) {
    "use strict";

    const reviewAdhocVpaModel = function() {
        const baseService = BaseService.getInstance();
        /**
         * confirm vpa adhoc transfer
         * @param1 {object} payload  An string containg the data to be sent to host
         * @param2 {string} deferred  An string containg the data to be recieved from host
         * @returns {Promise}  Returns the promise object
         */
        let confirmTransferDeferred;
        const confirmTransfer = function(payload, deferred) {
            const options = {
                url: "payments/transfers/upi",
                data: payload,
                success: function(data, status, jqXHR) {
                    deferred.resolve(data, status, jqXHR);
                }
            };

            baseService.add(options);

        };
        let getPayeeListDeferred;
        const getPayeeList = function(deferred) {
            const options = {
                url: "payments/payeeGroup?expand=ALL",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
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
            confirmTransfer: function(payload) {
                confirmTransferDeferred = $.Deferred();
                confirmTransfer(payload, confirmTransferDeferred);

                return confirmTransferDeferred;
            },
            getPayeeList: function() {
                getPayeeListDeferred = $.Deferred();
                getPayeeList(getPayeeListDeferred);

                return getPayeeListDeferred;
            },
            batchRead: function(batchRequest, type) {
                fireBatchDeferred = $.Deferred();
                batchRead(fireBatchDeferred, batchRequest, type);

                return fireBatchDeferred;
            },
            getPayeeAccountType: function(region) {
                return baseService.fetch({
                    url: "enumerations/payeeAccountType?REGION={region}"
                  },{
                    region :region
                  });
              }
        };
    };

    return new reviewAdhocVpaModel();
});