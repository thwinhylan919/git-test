define(["jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const ClientEditModel = function() {
        const Model = function() {
                this.clientDTO = {
                    attributes: [],
                    grant_types: [],
                    clientType: null,
                    defaultScope: null,
                    description: null,
                    idDomain: null,
                    id: null,
                    isHttps: false,
                    name: null,
                    scopes: [],
                    secret: null,
                    url: null
                };
            },
            baseService = BaseService.getInstance();
        let fetchIdentityDomainsDeferred;
        const fetchIdentityDomains = function(deferred) {
            const options = {
                url: "oauthpolicyadmin/listIdentityDomain",
                apiType: "extended",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
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
            getNewModel: function(modelData) {
                return new Model(modelData);
            },
            fetchIdentityDomains: function() {
                fetchIdentityDomainsDeferred = $.Deferred();
                fetchIdentityDomains(fetchIdentityDomainsDeferred);

                return fetchIdentityDomainsDeferred;
            },
            fetchResourceServers: function(identityDomain) {
                fetchResourceServersDeferred = $.Deferred();
                fetchResourceServers(identityDomain, fetchResourceServersDeferred);

                return fetchResourceServersDeferred;
            }
        };
    };

    return new ClientEditModel();
});