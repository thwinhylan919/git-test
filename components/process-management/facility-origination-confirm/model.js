define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const ApplicationListingModel = function () {
        const baseService = BaseService.getInstance();

         let deleteDraftDeferred;
         const deleteDraft = function(id, deferred) {
            const options = {
                url: "processManagement/{Id}",
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    },
                    error: function(data, status, jqXhr) {
                        deferred.reject(data, status, jqXhr);
                    }
                },
                params = {
                    Id: id
                };

            baseService.remove(options, params);
        };

        return {

            deleteDraft: function(id) {
                deleteDraftDeferred = $.Deferred();
                deleteDraft(id, deleteDraftDeferred);

                return deleteDraftDeferred;
            }
        };
    };

    return new ApplicationListingModel();
});