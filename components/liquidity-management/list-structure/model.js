/**
 * Model for list-structure
 * @param {object} BaseService base service instance for server communication
 * @return {object} listStructureModel Modal instance
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";

    const listStructureModel = function() {
        /**
         * In case more than one instance of listStructureModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const baseService = BaseService.getInstance();

        return {
            /**
             * GetPartyDetails - fetches party details of current entity.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getPartyDetails: function() {
                return baseService.fetch({
                    url: "me/party"
                });
            },
            /**
             * GetStructureStatus - fetches structure status.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getStructureStatus: function() {
                return baseService.fetch({
                    url: "enumerations/structureStatus"
                });
            },
            /**
             * GetStructureType - fetches structure types.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getStructureType: function() {
                return baseService.fetch({
                    url: "enumerations/structureType"
                });
            },
            /**
             * GetInterestMethods - fetches interest methods.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getInterestMethods: function() {
                return baseService.fetch({
                    url: "enumerations/sweepInterestMethod"
                });
            },
            /**
             * GetStructureDetails - fetches structure listing.
             *
             * @param {Object} structureModel - Payload to be passed to.
             * @returns {Promise}  Returns the promise object.
             */
            getStructureDetails: function(structureModel) {
                return baseService.fetch({
                    url: "liquidityManagement/structure/details?structureStatus={structureStatus}&structureType={structureType}",
                    apiType: "extended"
                },{
                    structureStatus:structureModel.structureStatus,
                    structureType:structureModel.structureType
                });
            }
        };
    };

    return new listStructureModel();
});