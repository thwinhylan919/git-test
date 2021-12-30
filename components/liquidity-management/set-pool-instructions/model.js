/**
 * Model for set-pool-instructions
 * @param {object} BaseService base service instance for server communication
 * @return {object} setPoolInstructionsModel Modal instance
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const setPoolInstructionsModel = function() {
        const baseService = BaseService.getInstance();

        return {
            /**
             * GetReallocationMethod - fetches reallocation methods.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getReallocationMethod: function() {
                return baseService.fetch({
                    url: "enumerations/sweepReallocationMethod"
                });
            }
        };
    };

    return new setPoolInstructionsModel();
});