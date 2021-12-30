define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const PFMmodel = function PFMmodel() {
        const baseService = BaseService.getInstance();
        let getGoalsListDeferred;
        const getGoalsList = function(isDashboard, deferred) {
            const options = {
                url: "goals?status=ACTIVE",
                selfLoader: isDashboard,
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchBankConfigDeferred;
        const fetchBankConfig = function(deferred) {
            const options = {
                url: "bankConfiguration",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fireBatchDeferred;
        const fireBatch = function(subRequestList, deferred) {
            const options = {
                headers: {
                    BATCH_ID: "5678"
                },
                url: "batch/",
                selfLoader: true,
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.batch(options, {}, subRequestList);
        };
        let getinActiveGoalsListDeferred;
        const getinActiveGoalsList = function(deferred) {
            const options = {
                url: "goals?status=CLOSED",
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
            getGoalsList: function(isDashboard) {
                getGoalsListDeferred = $.Deferred();
                getGoalsList(isDashboard, getGoalsListDeferred);

                return getGoalsListDeferred;
            },
            getinActiveGoalsList: function() {
                getinActiveGoalsListDeferred = $.Deferred();
                getinActiveGoalsList(getinActiveGoalsListDeferred);

                return getinActiveGoalsListDeferred;
            },
            fetchBankConfig: function() {
                fetchBankConfigDeferred = $.Deferred();
                fetchBankConfig(fetchBankConfigDeferred);

                return fetchBankConfigDeferred;
            },
            fireBatch: function(subRequestList) {
                fireBatchDeferred = $.Deferred();
                fireBatch(subRequestList, fireBatchDeferred);

                return fireBatchDeferred;
            }
        };
    };

    return new PFMmodel();
});