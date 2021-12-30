define(["jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const ClientReviewModel = function() {
        const baseService = BaseService.getInstance();
        let updateClientDeferred;
        const updateClient = function(payload, deferred) {
            const options = {
                url: "oauthpolicyadmin/updateClient",
                apiType: "extended",
                data: payload,
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                },
                error: function(data, status, jqXhr) {
                    deferred.reject(data, status, jqXhr);
                }
            };

            baseService.update(options);
        };
        let createClientDeferred;
        const createClient = function(payload, deferred) {
            const options = {
                url: "oauthpolicyadmin/createClient",
                apiType: "extended",
                data: payload,
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                },
                error: function(data, status, jqXhr) {
                    deferred.reject(data, status, jqXhr);
                }
            };

            baseService.add(options);
        };

        return {
            updateClient: function(payload) {
                updateClientDeferred = $.Deferred();
                updateClient(payload, updateClientDeferred);

                return updateClientDeferred;
            },
            createClient: function(payload) {
                createClientDeferred = $.Deferred();
                createClient(payload, createClientDeferred);

                return createClientDeferred;
            }
        };
    };

    return new ClientReviewModel();
});