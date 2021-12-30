define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const confirmAuthenticationMaintenanceModel = function() {
        const baseService = BaseService.getInstance();
        let createAuthenticationMaintenanceDeferred;
        const createAuthenticationMaintenance = function(payload, deferred) {
            const options = {
                url: "authenticationMaintenances",
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
        let updateAuthenticationMaintenanceDeferred;
        const updateAuthenticationMaintenance = function(payload, deferred) {
            const options = {
                url: "authenticationMaintenances",
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

        return {
            createAuthenticationMaintenance: function(data) {
                createAuthenticationMaintenanceDeferred = $.Deferred();
                createAuthenticationMaintenance(data, createAuthenticationMaintenanceDeferred);

                return createAuthenticationMaintenanceDeferred;
            },
            updateAuthenticationMaintenance: function(data) {
                updateAuthenticationMaintenanceDeferred = $.Deferred();
                updateAuthenticationMaintenance(data, updateAuthenticationMaintenanceDeferred);

                return updateAuthenticationMaintenanceDeferred;
            }
        };
    };

    return new confirmAuthenticationMaintenanceModel();
});