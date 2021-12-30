define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    /**
     * Main file for remittance management Model. This file contains the model definition
     * for list of remittance fetched from the host through the pass through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of remittance:
     *          <ul>
     *              <li>[init()]{@link RemittanceModel.init}</li>.
     *
     *              <li>[getProperty()]{@link RemittanceModel.fetchRemittanceList}</li>
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~RemittanceModel
     * @class RemittanceModel
     */
    const RemittanceModel = function() {
        const baseService = BaseService.getInstance();
        /* variable to make sure that in case there is no change
         * in model no additional fetch requests are fired.*/
        let fetchRemittanceListDeferred;
        /**
         * Private method to fetch the list of remittance based on search. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function fetchRemittanceList
         * @memberOf RemittanceModel
         * @param {Object} deferred - An object type Deferred.
         * @param {string} remitterListId - Remittance ID list.
         * @param {string} remitterDesc - Remittance name list.
         * @param {string} realCustomerNo - Real customer number.
         * @param {string} limit - Limit for  remittance.
         * @param {string} offset - Offset for  remittance.
         * @returns {void}
         * @private
         */
        const fetchRemittanceList = function(deferred, remitterListId, remitterDesc, realCustomerNo, limit, offset) {
            const options = {
                    url: "virtualIdentifiers?remitterListId={remitterListId}&remitterDesc={remitterDesc}&realCustomerNo={realCustomerNo}&limit={limit}&offset={offset}",
                    apiType: "extended",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                },
                params = {
                    remitterListId: remitterListId,
                    remitterDesc: remitterDesc,
                    realCustomerNo: realCustomerNo,
                    limit: limit,
                    offset: offset
                };

            baseService.fetch(options, params);
        };

        return {
            fetchRemittanceList: function(remitterListId, remitterDesc, realCustomerNo, limit, offset) {
                fetchRemittanceListDeferred = $.Deferred();
                fetchRemittanceList(fetchRemittanceListDeferred, remitterListId, remitterDesc, realCustomerNo, limit, offset);

                return fetchRemittanceListDeferred;
            }
        };
    };

    return new RemittanceModel();
});