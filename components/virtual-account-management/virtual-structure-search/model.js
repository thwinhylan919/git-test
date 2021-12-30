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
         * @param {string} query - Query Parameters.
         * @param {string} count - Maximum number of records to be fetched.
         * @param {string} sortBy - the field through which the results needs to be sot and by order
         * @returns {void}
         * @private
         */
        fetchVirtualStructureList = function(query, count, sortBy) {
            const options = {
                    url: "virtualAccountStructures?q={query}&count={count}&sortBy={sortBy}"
                },
                params = {
                    query: query,
                    count: count,
                    sortBy: sortBy
                };

            return baseService.fetch(options, params);
        };

        return {
            fetchVirtualStructureList: function(query, count, sortBy){
                return fetchVirtualStructureList(query, count, sortBy);
            }
        };
    };

    return new VirtualStructureModel();
});