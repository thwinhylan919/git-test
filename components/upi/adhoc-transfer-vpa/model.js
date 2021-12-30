/**
 * Model for adhoc-transfer-vpa
 *
 * @param {object} BaseService instance
 * @return {object} adhocTransferVpaModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";

    const adhocTransferVpaModel = function() {
        /**
         * In case more than one instance of adhocTransferVpaModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const Model = function() {
                this.adhocTransferVpaModel = {
                    amount: {
                        currency: null,
                        amount: null
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
            fetchList: function() {
                return baseService.fetch({
                    url: "virtualPaymentAddresses"
                });
            },
            /**
             * Fetches list of vpa's.
             *
             * @param {string} bankCode - Returns the promise object.
             * @returns {Promise}  Returns the promise object.
             */
            getBankDetailsDCC: function(bankCode) {
                return baseService.fetch({
                    url: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}"
                }, {
                    domesticClearingCodeType: "INDIA",
                    domesticClearingCode: bankCode
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
            }
        };
    };

    return new adhocTransferVpaModel();
});
