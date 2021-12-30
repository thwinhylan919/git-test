define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    /**
     * Main file for Virtual Identifier Information Model. This file contains the model definition
     * for list of virtual identifier fetched from the host through the pass through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of virtual identifiers:
     *          <ul>
     *              <li>[init()]{@link RemitterIdentifierInformationModel.init}</li>.
     *
     *              <li>[getProperty()]{@link RemitterIdentifierInformationModel.fetchRemitterIdentifiersList}</li>
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~RemitterIdentifierInformationModel
     * @class RemitterIdentifierInformationModel
     */
    const RemitterIdentifierInformationModel = function() {
        const baseService = BaseService.getInstance();
        /* variable to make sure that in case there is no change
         * in model no additional fetch requests are fired.*/
        let fetchRemitterIdentifiersListDeferred;
        /**
         * Private method to fetch the list of remittance based on search. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function fetchRemitterIdentifiersList
         * @memberOf RemitterIdentifierInformationModel
         * @param {Object} deferred - An object type Deferred.
         * @param {string} realCustomerNo - Real customer number.
         * @param {string} limit - Limit for  remittance.
         * @param {string} offset - Offset for  remittance.
         * @returns {void}
         * @private
         */
        const fetchRemitterIdentifiersList = function(deferred, realCustomerNo, limit, offset) {
            const options = {
                    url: "virtualIdentifiers?realCustomerNo={realCustomerNo}&limit={limit}&offset={offset}",
                    mockedUrl: "framework/json/design-dashboard/virtual-account-management/virtual-identifiers.json",
                    apiType: "extended",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                },
                params = {
                    realCustomerNo: realCustomerNo,
                    limit: limit,
                    offset: offset
                };

            baseService.fetchWidget(options, params);
        };

        return {
            fetchRemitterIdentifiersList: function(realCustomerNo, limit, offset) {
                fetchRemitterIdentifiersListDeferred = $.Deferred();
                fetchRemitterIdentifiersList(fetchRemitterIdentifiersListDeferred, realCustomerNo, limit, offset);

                return fetchRemitterIdentifiersListDeferred;
            }
        };
    };

    return new RemitterIdentifierInformationModel();
});