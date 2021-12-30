define(["jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const ClientViewModel = function() {
        const baseService = BaseService.getInstance();
        let readDeferred;
        const read = function(clientId, deferred) {
            const params = {
                    clientId: clientId
                },
                options = {
                    url: "oauthpolicyadmin/listClient?clientId={clientId}",
                    apiType: "extended",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };

            baseService.fetch(options, params);
        };
        let fetchResourceServersDeferred;
        const fetchResourceServers = function(identityDomain, deferred) {
            const params = {
                    identityDomain: identityDomain
                },
                options = {
                    url: "oauthpolicyadmin/listResourceServer?identityDomainName={identityDomain}",
                    apiType: "extended",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };

            baseService.fetch(options, params);
        };

        return {
            fetchResourceServers: function(identityDomain) {
                fetchResourceServersDeferred = $.Deferred();
                fetchResourceServers(identityDomain, fetchResourceServersDeferred);

                return fetchResourceServersDeferred;
            },
            read: function(client) {
                readDeferred = $.Deferred();
                read(client, readDeferred);

                return readDeferred;
            }
        };
    };

    return new ClientViewModel();
});