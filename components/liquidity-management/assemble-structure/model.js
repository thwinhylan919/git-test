/**
 * Model for assemble-structure
 * @param {object} BaseService base service instance for server communication
 * @return {object} assembleStructureModel Modal instance
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const assembleStructureModel = function() {

        /**
         * In case more than one instance of createStructure is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const Model = function() {
                this.validateStructureModel = {};
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
             * ValidateStructure - validates the created structure before creation.
             *
             * @param {Object} validateStructureModel - Payload for structure account validation.
             * @returns {Promise}  Returns the promise object.
             */
            validateStructure: function(validateStructureModel) {
                return baseService.add({
                    url: "liquidityManagement/structure/validation",
                    apiType: "extended",
                    data: validateStructureModel
                });
            }
        };
    };

    return new assembleStructureModel();
});