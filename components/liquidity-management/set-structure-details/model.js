/**
 * Model for list-structure
 * @param {object} BaseService base service instance for server communication
 * @return {object} setStructureDetailsModel Modal instance
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";

    const setStructureDetailsModel = function() {
        /**
         * In case more than one instance of setStructureDetailsModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const baseService = BaseService.getInstance();
        let partyCode;
        const Model = function() {
            this.setStructureDetailsModel = {
                customerId: partyCode
            };
        };

        return {
            /**
             * Method to initiate model.
             *
             * @param {string} partyId - Contains party id.
             * @returns {Object}  Returns the modelData.
             */
            init: function(partyId) {
                partyCode = partyId;
            },
            /**
             * Method to get new modal instance.
             *
             * @returns {Object}  Returns the modelData.
             */
            getNewModel: function() {
                return new Model();
            },
            /**
             * GetInstructionType - fetches instruction type.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getInstructionType: function() {
                return baseService.fetch({
                    url: "liquidityManagement/enumerations/instructionType",
                    apiType: "extended"
                });
            },
            /**
             * GetReallocationMethod - fetches reallocation methods.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getReallocationMethod: function() {
                return baseService.fetch({
                    url: "enumerations/sweepReallocationMethod"
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
             * GetInterestMethod - fetches interest methods.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getInterestMethod: function() {
                return baseService.fetch({
                    url: "enumerations/sweepInterestMethod"
                });
            },
            /**
             * GetFrequency - fetches frequency.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getFrequency: function() {
                return baseService.fetch({
                    url: "liquidityManagement/enumerations/frequency",
                    apiType: "extended"
                });
            },
            /**
             * Method to get account details.
             *
             * @returns {Object}  Returns the modelData.
             */
            fetchAccount: function() {
                return baseService.fetch({
                    url: "liquidityManagement/accounts?notionalAccFlag=N",
                    apiType: "extended"
                });
            }
        };
    };

    return new setStructureDetailsModel();
});