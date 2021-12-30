define([
    "baseService"
], function(BaseService) {
    "use strict";

    /**
     * Main file for virtaul structure management Model. This file contains the model definition
     * for list of structures fetched from the host through the pass through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of structures:
     *          <ul>
     *              <li>[init()]{@link VirtualStructureModel.init}</li>.
     *
     *              <li>[getProperty()]{@link VirtualStructureModel.fetchVirtualStructureList}</li>
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~VirtualStuctureModel
     * @class VirtualStuctureModel
     */
    const VirtualStructureModel = function() {
        const baseService = BaseService.getInstance(),
        /**
         * Private method to fetch the list of virtual structures based on search. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function fetchVirtualStructureList
         * @memberOf VirtualStructureModel
         * @param {string} query - Real customer number.
         * @param {string} taskCode - Structure code for virtual structure.
         * @returns {void}
         * @private
         */
        fetchVirtualStructureList = function(query, taskCode) {
            const options = {
                    url: "virtualAccountStructures?q={query}&taskCode={taskCode}"
                },
                params = {
                    query: query,
                    taskCode: taskCode
                };

            return baseService.fetch(options, params);
        };

        return {
            fetchVirtualStructureList: function(query, taskCode) {
                return fetchVirtualStructureList(query, taskCode);
            }
        };
    };

    return new VirtualStructureModel();
});