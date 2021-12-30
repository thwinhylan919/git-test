/**
 * Model for transfer-payee-upi
 *
 * @param {object} BaseService instance
 * @return {object} transferPayeeUpiModel
 */
define([
    "baseService",
    "jquery"
], function(BaseService, $) {
    "use strict";

    const transferPayeeUpiModel = function() {
        /**
         * In case more than one instance of transferPayeeUpiModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const Model = function() {
                this.transferPayeeUpiModel = {
                    amount: {
                        currency: null,
                        amount: null
                    },
                    payeeDetails: {
                        id: null,
                        nickName: null
                    },
                    valueDate: null,
                    remarks: null,
                    debitVPAId: null,
                    creditVPAId: null,
                    sourceAccount: {
                        displayValue: null,
                        value: null
                    },
                    accountTransferDetails: {
                        transferMode: null,
                        accountNumber: null,
                        accountName: null,
                        shared: false,
                        bankDetails: {
                            name: null,
                            branch: null,
                            address: null,
                            city: null,
                            country: null,
                            codeType: null,
                            code: null
                        },
                        accountType: null
                    },
                    deviceDetails: {
                        uuid: null,
                        version: null,
                        platform: null,
                        model: null,
                        manufacturer: null,
                        virtual: false,
                        serial: null,
                        sim1IMEI: null,
                        sim2IMEI: null,
                        latitude: null,
                        longitude: null
                    }

                };

            },
            baseService = BaseService.getInstance();

        let fireBatchDeferred;
        const fireBatch = function(deferred, batchRequest, type) {
            const options = {
                url: "batch",
                success: function(data, status, jqXHR) {
                    deferred.resolve(data, status, jqXHR);
                },
                error: function(data, status, jqXHR) {
                    deferred.reject(data, status, jqXHR);
                }
            };

            baseService.batch(options, {
                type: type
            }, batchRequest);
        };

        return {
            /**
             * Returns new Model instance.
             *
             * @returns {Object}  Returns the modelData.
             */
            getNewModel: function() {
                return new Model();
            },
            /**
             * Fetches list of vpa's.
             *
             * @returns {Promise}  Returns the promise object.
             */
            fetchPayeeList: function() {
                return baseService.fetch({
                    url: "payments/payeeGroup?expand=ALL&types=INDIADOMESTIC,VPA"
                });
            },
            /**
             * Fetches bankConfiguration.
             *
             * @returns {Promise}  Returns the promise object.
             */
            fetchBankConfig: function() {
                return baseService.fetch({
                    url: "bankConfiguration"
                });
            },
            /**
             * Validates vpa request.
             *
             * @param {Object} payload - Returns the promise object.
             * @returns {Promise}  Returns the promise object.
             */
            validateRequest: function(payload) {
                return baseService.add({
                    url: "payments/transfers/upi",
                    data: payload,
                    headers: {
                        "X-Validate-Only": "Y"
                    }
                });
            },
            /**
             * Fetches batch response.
             *
             * @param {Object} batchRequest - - - - - - - - - - - - - - Returns the promise object.
             * @param {Object} type Returns the promise object.
             * @returns {Promise}  Returns the promise object.
             */
            fireBatch: function(batchRequest, type) {
                fireBatchDeferred = $.Deferred();
                fireBatch(fireBatchDeferred, batchRequest, type);

                return fireBatchDeferred;
            },
            /**
             * Get maintenance details for payee.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getPayeeMaintenance: function() {
                return baseService.fetch({
                    url: "maintenances/payments"
                });
            },
            /**
             * Fetches list of vpa's.
             *
             * @returns {Promise}  Returns the promise object.
             */
            fetchList: function() {
                return baseService.fetch({
                    url: "virtualPaymentAddresses"
                });
            }
        };
    };

    return new transferPayeeUpiModel();
});
