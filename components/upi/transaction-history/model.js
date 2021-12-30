/**
 * Model for transaction-history
 * @param {object} BaseService base service instance for server communication
 * @return {object} Model Modal instance
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const Model = function() {
        const baseService = BaseService.getInstance();

        return {
            /**
             * Function to get transaction history.
             * @param {String} vpaId  - An object containg the data to be sent to host.
             * @param {String} startDate  - An String containg the data to be sent to host.
             * @param {String} endDate  - An String containg the data to be sent to host.
             * @param {String} transactionStatus  - An String containg the data to be sent to host.
             * @param {String} transactionType  - An String containg the data to be sent to host.
             * @returns {Promise}  Returns the promise object.
             */
            getTransactionHistory: function(vpaId, startDate, endDate, transactionStatus, transactionType) {
                const params = {
                        vpaId: vpaId === "all" ? null : vpaId,
                        startDate: startDate,
                        endDate: endDate,
                        transactionStatus: transactionStatus === "all" ? null : transactionStatus,
                        transactionType: transactionType === "all" ? null : transactionType
                    },
                    options = {
                        url: "/payments/transfers/upi/transactionHistory?vpaId={vpaId}&startDate={startDate}&endDate={endDate}&transactionStatus={transactionStatus}&transactionType={transactionType}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            /**
             * Function to get Payment Addresses.
             *
             * @returns {Promise}  Returns the promise object.
             */
            virtualPaymentAddressesget: function() {
                const options = {
                    url: "/virtualPaymentAddresses",
                    version: "v1"
                };

                return baseService.fetch(options);
            },
            /**
             * Function to get payee list.
             * @param {Object} batchRequest  - An object containg the data to be sent to host.
             * @param {String} type  - An String containg the data to be sent to host.
             * @returns {Promise}  Returns the promise object.
             */
            fireBatch: function(batchRequest, type) {
                return baseService.batch({
                    url: "batch"
                }, {
                    type: type
                }, batchRequest);
            },
            /**
             * Function to get payee list.
             *
             * @returns {Promise}  Returns the promise object.
             */
            fetchPayeeList: function() {
                return baseService.fetch({
                    url: "payments/payeeGroup?expand=ALL&types=VPA"
                });
            },
            /**
             * Function to get HostDate.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getHostDate: function() {
                return baseService.fetch({
                    url: "payments/currentDate"
                });
            },
            /**
             * Function to get Transfer Status.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getTransferStatus: function() {
                return baseService.fetch({
                    url: "enumerations/transferType/UPI"
                });
            },
            /**
             * mepartyget - fetches party details.
             *
             * @returns {Promise}  Returns the promise object.
             */
            mepartyget: function() {
                const params = {},
                    options = {
                        url: "/me/party",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            /**
             * Function to get Transfer Type.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getTransferType: function() {
                return baseService.fetch({
                    url: "enumerations/transferStatus/UPI"
                });
            }
        };
    };

    return new Model();
});