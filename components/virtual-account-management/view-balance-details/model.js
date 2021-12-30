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
     *              <li>[getProperty()]{@link VirtualStructureModel.viewBalanceDetailsDeferred}</li>
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
         * @function viewStructure
         * @memberOf VirtualStructureModel
         * @param {string} virtualAccountNo - Virtual Account Number.
         * @param {string} virtualAccountCcy - Virtual Account Currency.
         * @returns {void}
         * @private
         */
        viewBalanceDetails = function(virtualAccountNo, virtualAccountCcy) {
            const options = {
                    url: "accounts/virtual/{virtualAccountNo}/balances;currency={virtualAccountCcy}"
                },
                params = {
                    virtualAccountNo: virtualAccountNo,
                    virtualAccountCcy: virtualAccountCcy
                };

           return baseService.fetch(options, params);
        };

        return {
            viewBalanceDetails: function(virtualAccountNo, virtualAccountCcy) {
                return viewBalanceDetails(virtualAccountNo, virtualAccountCcy);
            }
        };
    };

    return new VirtualStructureModel();
});