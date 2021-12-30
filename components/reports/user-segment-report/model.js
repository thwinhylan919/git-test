define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const userSegmentModel = function() {

        const baseService = BaseService.getInstance();
        let fetchEnumerationDeferred;
        const fetchEnumeration = function(deferred) {
            const options = {
                url: "enterpriseRoles?isLocal=true",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchSegmentsDeferred;
        const fetchSegments = function(deferred) {
            const options = {
                url: "segments",
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
            fetchEnumeration: function() {
                fetchEnumerationDeferred = $.Deferred();
                fetchEnumeration(fetchEnumerationDeferred);

                return fetchEnumerationDeferred;
            },
            fetchSegments: function() {
                fetchSegmentsDeferred = $.Deferred();
                fetchSegments(fetchSegmentsDeferred);

                return fetchSegmentsDeferred;
            }
        };
    };

    return new userSegmentModel();
});