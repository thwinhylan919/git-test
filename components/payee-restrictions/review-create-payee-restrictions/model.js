/**
 * Model for review-create-payee-restrictions.
 * @param {object} jquery jquery instance
 * @param {object} BaseService base service instance for server communication
 * @return {object} payeeCountLimitModel Modal instance
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const payeeCountLimitModel = function payeeCountLimitModel() {
        const baseService = BaseService.getInstance();

        return {
            /**
             * AddPayeeLimits - add the payee restriction.
             *
             * @param {Object} model  - It contains the data to set payee creation restiction.
             * @returns {Promise}  Returns the promise object.
             */
            addPayeeLimits: function(model) {
            return baseService.add({
             url: "payments/maintenances/payeecount",
             data: model
           });
            }
        };
    };

    return new payeeCountLimitModel();
});