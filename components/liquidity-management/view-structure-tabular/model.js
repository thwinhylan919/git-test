/**
 * Model for view-tabular-structure
 * @param {object} BaseService base service instance for server communication
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

        return {
            /**
             * Fetches date to view in tabular tree structure for a particular structure ID.
             *
             * @param {Object} structureId - Structure id.
             * @returns {Promise}  Returns the promise object.
             */
            getStructuredata: function(structureId) {
                return baseService.fetch({
                    url: "liquidityManagement/structure/details?eodexecution=false&structureId={structureId}",
                    apiType: "extended"
                },{
                    structureId:structureId
                });
            }
        };
    };

    return new viewTabularStructureModel();
});