define([
    "baseService",
    "jquery"
], function(BaseService, $) {
    "use strict";

    const resourceServerReviewModel = function() {
        const baseService = BaseService.getInstance();
        let resourceServerCreateDeferred;
        const resourceServerCreate = function(deferred, model) {
            const options = {
                url: "oauthpolicyadmin/createResourceServer",
                apiType: "extended",
                data: model,
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                },
                error: function(data, status, jqXhr) {
                    deferred.reject(data, status, jqXhr);
                }
            };

            baseService.add(options);
        };
        let resourceServerUpdateDeferred;
        const resourceServerUpdate = function(deferred, model) {
            const options = {
                url: "oauthpolicyadmin/updateResourceServer",
                apiType: "extended",
                data: model,
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
            resourceServerCreate: function(model) {
                resourceServerCreateDeferred = $.Deferred();
                resourceServerCreate(resourceServerCreateDeferred, model);

                return resourceServerCreateDeferred;
            },
            resourceServerUpdate: function(model) {
                resourceServerUpdateDeferred = $.Deferred();
                resourceServerUpdate(resourceServerUpdateDeferred, model);

                return resourceServerUpdateDeferred;
            }
        };
    };

    return new resourceServerReviewModel();
});