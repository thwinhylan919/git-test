define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const ApplicationListingModel = function () {
        const baseService = BaseService.getInstance();

        let fetchApplicationDetailsDeferred;
        const fetchApplicationDetails = function (deferred) {
            const options = {
                url: "v1/credit-facility/000383/applications",
                version: "ext",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };

        let facilityDataDeferred;
        const facilityData = function (deferred) {
            const options = {
                url: "processManagement?moduleId=OBCFPM",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };

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

        let readAppDeferred;
        const readApp = function(id, deferred) {
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

            baseService.fetch(options, params);
        };

        return {
            fetchApplicationDetails: function () {
                fetchApplicationDetailsDeferred = $.Deferred();
                fetchApplicationDetails(fetchApplicationDetailsDeferred);

                return fetchApplicationDetailsDeferred;
            },
            facilityData: function () {
                facilityDataDeferred = $.Deferred();
                facilityData(facilityDataDeferred);

                return facilityDataDeferred;
            },
            deleteDraft: function(id) {
                deleteDraftDeferred = $.Deferred();
                deleteDraft(id, deleteDraftDeferred);

                return deleteDraftDeferred;
            },
            readApp: function(id) {
                readAppDeferred = $.Deferred();
                readApp(id, readAppDeferred);

                return readAppDeferred;
            }
        };
    };

    return new ApplicationListingModel();
});