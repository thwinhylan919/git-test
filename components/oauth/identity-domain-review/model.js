define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const Model = function() {
        const baseService = BaseService.getInstance();
        let updateIDDomainDeferred;
        const updateIDDomain = function(payload, deferred) {
            const options = {
                url: "oauthpolicyadmin/updateIdentityDomain",
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
        let createIDDomainDeferred;
        const createIDDomain = function(payload, deferred) {
            const options = {
                url: "oauthpolicyadmin/createIdentityDomain",
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
            updateIDDomain: function(payload) {
                updateIDDomainDeferred = $.Deferred();
                updateIDDomain(payload, updateIDDomainDeferred);

                return updateIDDomainDeferred;
            },
            createIDDomain: function(payload) {
                createIDDomainDeferred = $.Deferred();
                createIDDomain(payload, createIDDomainDeferred);

                return createIDDomainDeferred;
            }
        };
    };

    return new Model();
});