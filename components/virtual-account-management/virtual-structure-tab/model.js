/**
 * Model for view-tabular-structure
 * @param1 {object} BaseService base service instance for server communication
 * @param2 {object} constants constant instance for server communication
 * @return {object} viewTabularStructureModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";

    const viewTabularStructureModel = function() {
        /**
         * In case more than one instance of viewTabularStructureModel is required we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const baseService = BaseService.getInstance();
        let structureCode;
        const Model = function() {
            this.viewStructureListModel = {
                structureKey: {
                    structureCode: structureCode
                },
                eodexecution: false
            };
        },
        /**
         * Private method to fetch the list of virtual structures based on search. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function getStructuredata
         * @memberOf VirtualStructureModel
         * @param {string} structureCode - code to uniquely identify each structure
         * @returns {Promise}
         * @private
         */
         getStructuredata = function(structureCode) {
            const options = {
                    url: "virtualAccountStructures/{structureCode}"
                },
                params = {
                    structureCode: structureCode
                };

            return baseService.fetch(options, params);
        };

        return {
            /**
             * Method to get new modal instance.
             *
             * @returns {Object} Returns the modelData.
             */
            getNewModel: function() {
                return new Model();
            },
            /**
             * Fetches date to view in tabular tree structure for a particular structure virtualMainAcc.
             *
             * @param {string} virtualMainAcc - virtualMainAcc for structure data.
             * @returns {Promise}  Returns the promise object.
             */
            getStructuredata: function(structureCode) {
                return getStructuredata(structureCode);
            }
        };
    };

    return new viewTabularStructureModel();
});