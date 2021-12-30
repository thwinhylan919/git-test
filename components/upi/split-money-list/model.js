/**
 * Model for split-money-list
 * @param {object} BaseService base service instance for server communication
 * @return {object} Model Modal instance
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const Model = function() {
        const baseService = BaseService.getInstance();

        return {
            /**
             * Function to get payee list.
             * @param {Object} batchRequest  - An object containg the data to be sent to host.
             * @param {String} type  - An String containg the data to be sent to host.
             * @returns {Promise}  Returns the promise object.
             */
            batchRead: function(batchRequest, type) {
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
            paymentspayeeGroupget: function() {
                const params = {
                        expand: "ALL",
                        types: "VPA"
                    },
                    options = {
                        url: "/payments/payeeGroup?expand={expand}&types={types}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            /**
             * Checks validity of vpa.
             *
             * @param {String} vpaId - Holds vpaId.
             * @returns {Promise}  Returns the promise object.
             */
            checkValidity: function(vpaId) {
                return baseService.fetch({
                    url: "virtualPaymentAddresses/{vpaAddress}/validation"
                }, {
                    vpaAddress: vpaId
                });
            },
            /**
             * Function to get payee Maintenance.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getPayeeMaintenance: function() {
                return baseService.fetch({
                    url: "maintenances/payments"
                });
            },
            /**
             * Method to get new modal instance.
             *
             * @returns {Object}  Returns the modelData.
             */
            getNewModel: function() {
                return {
                    totalAmount: {
                        currency: null,
                        amount: null
                    },
                    deviceDetails: {
                        version: null,
                        uuid: null,
                        platform: null,
                        model: null,
                        manufacturer: null,
                        virtual: null,
                        serial: null,
                        sim1IMEI: null,
                        sim2IMEI: null,
                        latitude: null,
                        longitude: null
                    },
                    remarks: null,
                    upFundRequestDTOs: [{
                        amount: {
                            currency: null,
                            amount: null
                        },
                        debitVPAId: null
                    }],
                    expiryDate: null,
                    creditVPAId: null
                };
            }
        };
    };

    return new Model();
});