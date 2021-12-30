/**
 * Model for create-vpa
 *
 * @param {object} BaseService instance
 * @param {object} $ instance
 * @return {object} reviewCreateVpaModel
 */
define([
    "baseService", "jquery"
], function(BaseService, $) {
    "use strict";

    const reviewCreateVpaModel = function() {
        const baseService = BaseService.getInstance();
        /**
         * confirm forex deal
         * @param1 {string} payload  An string containg the data to be sent to host
         * @param2 {string} isEdit Check if it is editable mode
         * @param3 {string} deferred  An string containg the data to be recieved from host
         * @returns {Promise}  Returns the promise object
         */
        let confirmCreateVpaDeferred;
        const confirmCreateVpa = function(payload, isEdit, deferred) {
            const options = {
                url: isEdit ? "virtualPaymentAddresses/{id}" : "virtualPaymentAddresses",
                data: payload,
                success: function(data, status, jqXHR) {
                    deferred.resolve(data, status, jqXHR);
                }
            },
            params = {
                id: JSON.parse(payload).id
            };

            if(!isEdit)
                {baseService.add(options);}
            else if(isEdit)
                {baseService.update(options, params);}
        };

        return {
            confirmCreateVpa: function(payload, isEdit) {
                confirmCreateVpaDeferred = $.Deferred();
                confirmCreateVpa(payload, isEdit, confirmCreateVpaDeferred);

                return confirmCreateVpaDeferred;
            }
        };
    };

    return new reviewCreateVpaModel();
});