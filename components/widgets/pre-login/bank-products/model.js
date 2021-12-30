define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const bankProductsModel = function() {
        const baseService = BaseService.getInstance();
        let fetchProductTilesDeferred;
        const fetchProductTiles = function(deferred) {
            const params = {
                    status: "ACTIVE"
                },
                options = {
                    url: "productTypes?status={status}",
                    showMessage: false,
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };

            baseService.fetch(options, params);
        };
        let checkLoginStatusDeferred;
        const checkLoginStatus = function(deferred) {
            const options = {
                showMessage: false,
                url: "me",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchDealerListDeferred;
        const fetchDealerList = function(deferred) {
            const options = {
                url: "dealers",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchProductGroupsDeferred;
        const fetchProductGroups = function(url, deferred) {
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
        let createSessionDeferred;
        const createSession = function(deferred) {
            const options = {
                url: "session",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.add(options);
        };

        return {
            fetchProductTiles: function() {
                fetchProductTilesDeferred = $.Deferred();
                fetchProductTiles(fetchProductTilesDeferred);

                return fetchProductTilesDeferred;
            },
            checkLoginStatus: function() {
                checkLoginStatusDeferred = $.Deferred();
                checkLoginStatus(checkLoginStatusDeferred);

                return checkLoginStatusDeferred;
            },
            fetchDealerList: function() {
                fetchDealerListDeferred = $.Deferred();
                fetchDealerList(fetchDealerListDeferred);

                return fetchDealerListDeferred;
            },
            createSession: function() {
                createSessionDeferred = $.Deferred();
                createSession(createSessionDeferred);

                return createSessionDeferred;
            },
            fetchProductGroups: function(url) {
                fetchProductGroupsDeferred = $.Deferred();
                fetchProductGroups(url, fetchProductGroupsDeferred);

                return fetchProductGroupsDeferred;
            }
        };
    };

    return new bankProductsModel();
});