/**
 * Model for assemble-structure
 * @param {object} BaseService base service instance for server communication
 * @param {object} constants constants to be fetched
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
        const baseService = BaseService.getInstance();

        return {

            /**
             * SaveStructure - validates the created structure before creation.
             *
             * @param {Object} payload - Payload for structure account validation.
             * @returns {Promise}  Returns the promise object.
             */
            saveStructure: function(payload) {
                return baseService.add({
                    url: "virtualAccountStructures",
                    data: payload
                });
            },

            /**
             * UpdateStructure - validates the created structure before creation.
             *
             * @param {Object} payload - Payload for structure account validation.
             * @returns {Promise}  Returns the promise object.
             */
            updateStructure: function(payload, structureCode) {

                return baseService.update({
                    structureCode: structureCode,
                    url: "virtualAccountStructures/{structureCode}",
                    data: payload
                }, {
                    structureCode: structureCode
                });
            }
        };
    };

    return new assembleStructureModel();
});
