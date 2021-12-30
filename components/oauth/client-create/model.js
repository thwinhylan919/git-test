define(["jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const ClientCreateModel = function() {
        const Model = function() {
                this.clientDTO = {
                    attributes: [],
                    grant_types: [],
                    clientType: null,
                    defaultScope: null,
                    idDomain: null,
                    id: null,
                    isHttps: false,
                    name: null,
                    description: null,
                    scopes: [],
                    secret: null,
                    redirect_uris: []
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
            },
            createClient: function(payload) {
                createClientDeferred = $.Deferred();
                createClient(payload, createClientDeferred);

                return createClientDeferred;
            }
        };
    };

    return new ClientCreateModel();
});