/**
 * Model for transfer-view-limits
 * @param {object} $ jquery instance
 * @param {object} BaseService instance
 * @return {object} TransferViewLimitsModel
 */
define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const TransferViewLimitsModel = function() {
        const
            baseService = BaseService.getInstance();
        /**
         * fetches assigned limit package
         *
         * @param {object} accessPointValue access point
         * @param {object} accessPointGroupType accesspoint group
         * @param {object} deferred Deferred object
         * @returns {Promise}  Returns the promise object
         */
        let fetchAssignedLimitPackagesDeferred;
        const fetchAssignedLimitPackages = function(accessPointValue, accessPointGroupType, deferred) {
            const params = {
                    accessPointValue: accessPointValue,
                    accessPointGroupType: accessPointGroupType
                },
                options = {
                    url: "me/assignedLimitPackage?accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };

            baseService.fetch(options, params);
        };
        /**
         * fetches custom limit package
         *
         * @param {object} accessPointValue access point
         * @param {object} accessPointGroupType accesspoint group
         * @param {object} deferred Deferred object
         * @returns {Promise}  Returns the promise object
         */
        let fetchCustomLimitPackagesDeferred;
        const fetchCustomLimitPackages = function(accessPointValue, accessPointGroupType, deferred) {
            const params = {
                    accessPointValue: accessPointValue,
                    accessPointGroupType: accessPointGroupType
                },
                options = {
                    url: "me/customLimitPackage?accessPointValue={accessPointValue}&accessPointGroupType={accessPointGroupType}",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };

            baseService.fetch(options, params);
        };
        /**
         * fetches utilized limit
         *
         * @param {object} deferred Deferred object
         * @param {object} url url
         * @returns {Promise}  Returns the promise object
         */
        let fetchUtilizationLimitDeferred;
        const fetchUtilizationLimit = function(deferred, url) {
            const options = {
                url: url,
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
            /**
             * Fetches utilized limit.
             *
             * @param {Object} url - Url.
             * @returns {Promise}  Returns the promise object.
             */
            fetchUtilizationLimit: function(url) {
                fetchUtilizationLimitDeferred = $.Deferred();
                fetchUtilizationLimit(fetchUtilizationLimitDeferred, url);

                return fetchUtilizationLimitDeferred;
            },
            /**
             * Fetches assigned limit package.
             *
             * @param {Object} accessPointValue - Access point.
             * @param {Object} accessPointGroupType - Accesspoint group.
             * @returns {Promise}  Returns the promise object.
             */
            fetchAssignedLimitPackages: function(accessPointValue, accessPointGroupType) {
                fetchAssignedLimitPackagesDeferred = $.Deferred();
                fetchAssignedLimitPackages(accessPointValue, accessPointGroupType, fetchAssignedLimitPackagesDeferred);

                return fetchAssignedLimitPackagesDeferred;
            },
            /**
             * Fetches custom limit package.
             *
             * @param {Object} accessPointValue - Access point.
             * @param {Object} accessPointGroupType - Accesspoint group.
             * @returns {Promise}  Returns the promise object.
             */
            fetchCustomLimitPackages: function(accessPointValue, accessPointGroupType) {
                fetchCustomLimitPackagesDeferred = $.Deferred();
                fetchCustomLimitPackages(accessPointValue, accessPointGroupType, fetchCustomLimitPackagesDeferred);

                return fetchCustomLimitPackagesDeferred;
            }
        };
    };

    return new TransferViewLimitsModel();
});