define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const AppTrackerFilmStripModel = function() {
        const baseService = BaseService.getInstance();

        let fetchApplicationDetailsDeferred;
        const fetchApplicationDetails = function(module, deferred) {
            const params = {
                    module: module
                },
                options = {
                    url: "processSnapshots/listSnapshots?moduleId={module}",
                    version: "ext",
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
            fetchApplicationDetails: function(module) {
                fetchApplicationDetailsDeferred = $.Deferred();
                fetchApplicationDetails(module, fetchApplicationDetailsDeferred);

                return fetchApplicationDetailsDeferred;
            }
        };
    };

    return new AppTrackerFilmStripModel();
});