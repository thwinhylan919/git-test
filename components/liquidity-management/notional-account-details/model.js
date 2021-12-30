/** Model for notional-account-details
 * @return {object} notionalDetailsModel
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const notionalDetailsModel = function() {

        /**
         * In case more than one instance of notionalDetailsModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const Model = function() {
                this.notionalAccountDetailsModel = {
                    systemAccBranch: null,
                    systemAccCcy: null
                };
            },
            baseService = BaseService.getInstance();

        return {
            /**
             * Method to get new modal instance.
             *
             * @returns {Object}  Returns the modelData.
             */
            getNewModel: function() {
                return new Model();
            },
            /**
             * GetBranches - fetches branches.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getBranches: function() {
                return baseService.fetch({
                    url: "liquidityManagement/enumerations/branch",
                    apiType: "extended"
                });
            },
            /**
             * GetCurrency - fetches currencies.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getCurrency: function() {
                return baseService.fetch({
                    url: "liquidityManagement/enumerations/currency",
                    apiType: "extended"
                });
            },
            /**
             * GetPartyDetails - fetches party details of current entity.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getPartyDetails: function() {
                return baseService.fetch({
                    url: "me/party"
                });
            }
        };
    };

    return new notionalDetailsModel();
});