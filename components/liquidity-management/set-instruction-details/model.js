/**
 * Model for set-instruction-details
 * @param {object} BaseService base service instance for server communication
 * @return {object} setStructureDetailsModel Modal instance
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";

    const setInstructionDetailsModel = function() {
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
            this.setInstructionDetailsModel = {
                customerId: partyCode
            };

            this.instructionDetailList = {
                instructiondetailList: []
            };

            this.instructionDetail = {
                callFromSweep: false,
                frequencyList: {
                    frequencyList: []
                },
                instructionDetailKey: {
                    instructionDetailId: null
                },
                instructionInstructPriority: "1",
                instructionParamLst: [],
                instructionType: null
            };

            this.instructionParamList = {
                instructionParamKey: {
                    paramName: null
                },
                paramvalue: null
            };

            this.frequencyList = {
                cronExpression: null,
                description: null,
                frequencyKeyDTO: {
                    frequencyId: null
                },
                statusFlag: false
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
             * GetSweepDirection - fetches structure types.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getSweepDirection: function() {
                return baseService.fetch({
                    url: "enumerations/sweepDirection"
                });
            }
        };
    };

    return new setInstructionDetailsModel();
});