define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const resourceServerSearchModel = function() {
        const baseService = BaseService.getInstance();
        let listResourceServerDeferred;
        const listResourceServer = function(PARAMS, deferred) {
            const options = {
                url: PARAMS,
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
        let listIdentityDomainDeferred;
        const listIdentityDomain = function(deferred) {
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

        return {
            listResourceServer: function(PARAMS) {
                listResourceServerDeferred = $.Deferred();
                listResourceServer(PARAMS, listResourceServerDeferred);

                return listResourceServerDeferred;
            },
            listIdentityDomain: function() {
                listIdentityDomainDeferred = $.Deferred();
                listIdentityDomain(listIdentityDomainDeferred);

                return listIdentityDomainDeferred;
            }
        };
    };

    return new resourceServerSearchModel();
});