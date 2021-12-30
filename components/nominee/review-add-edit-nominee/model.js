/** Model for review add edit nominee
 * @param {object} BaseService
 * @return {object} reviewNomineeModel
 */
define(["baseService"], function(BaseService) {
    "use strict";

    /**
     * In case more than one instance of reviewNomineeModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class reviewNomineeModel
     * @private
     */
    const reviewNomineeModel = function() {
        const baseService = BaseService.getInstance();

        return {
            /**
             * Add nominee.
             *
             * @param1 {string} payload  An string containg the data to be sent to host
             * @returns {Promise}  Returns the promise object.
             */
            confirmAddNominee: function(payload) {
                return baseService.add({
                    url: "nominee",
                    data: payload
                });
            },
            /**
             * Update nomineeDetails.
             *
             * @param1 {string} payload  An string containg the data to be sent to host
             * @returns {Promise}  Returns the promise object.
             */
            confirmEditNominee: function(payload) {
                return baseService.update({
                    url: "nominee",
                    data: payload
                });
            },
            /**
             * Fetch nomineeRelation.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getRelation: function() {
                return baseService.fetch({
                    url: "enumerations/nomineeRelations"
                });
            },
            /**
             * Fetch country.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getCountry: function() {
                return baseService.fetch({
                    url: "enumerations/country"
                });
            }
        };
    };

    return new reviewNomineeModel();
});