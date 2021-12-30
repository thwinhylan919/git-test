define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    /**
     * Main file for remittance management Model. This file contains the model definition
     * for list of properties fetched from the host through the pass through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of properties:
     *          <ul>
     *              <li>[init()]{@link RemittanceModel.init}</li>.
     *
     *              <li>[getProperty()]{@link RemittanceModel.deleteRemittanceDeferred}</li>
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
        let deleteRemittanceDeferred,
            updateRemittanceDeferred;
        const deleteRemittance = function(payload, keyId, deferred) {
                const options = {
                        url: "virtualIdentifiers/{keyId}/",
                        apiType: "extended",
                        data: payload,
                        success: function(data, status, jqXhr) {
                            deferred.resolve(data, status, jqXhr);
                        },
                        error: function(data, status, jqXhr) {
                            deferred.reject(data, status, jqXhr);
                        }
                    },
                    params = {
                        keyId: keyId
                    };

                baseService.update(options, params);
            },
            updateRemittanceList = function(payload, keyId, deferred) {
                const options = {
                        url: "virtualIdentifiers/{keyId}",
                        data: payload,
                        apiType: "extended",
                        success: function(data, status, jqXHR) {
                            deferred.resolve(data, status, jqXHR);
                        },
                        error: function(data, status, jqXhr) {
                            deferred.reject(data, status, jqXhr);
                        }
                    },
                    params = {
                        keyId: keyId
                    };

                baseService.update(options, params);
            };

        return {
            deleteRemittance: function(payload, keyId) {
                deleteRemittanceDeferred = $.Deferred();
                deleteRemittance(payload, keyId, deleteRemittanceDeferred);

                return deleteRemittanceDeferred;
            },
            updateRemittanceList: function(data, payload) {
                updateRemittanceDeferred = $.Deferred();
                updateRemittanceList(data, payload, updateRemittanceDeferred);

                return updateRemittanceDeferred;
            }
        };
    };

    return new RemittanceModel();
});