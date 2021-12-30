define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
        DashboardListModel = function() {
            let saveDashboardDeferred;
            const saveDashboard = function(payload, deffered) {
                const options = {
                    url: "dashboards/",
                    data: payload,
                    success: function(data, status, jqXhr) {
                        deffered.resolve(data, status, jqXhr);
                    },
                    error: function(data, status, jqXhr) {
                        deffered.reject(data, status, jqXhr);
                    }
                };

                baseService.add(options);
            };
            let saveUserDashboardDeferred;
            const saveUserDashboard = function(payload, deffered) {
                const options = {
                    url: "dashboards/user",
                    data: payload,
                    success: function(data, status, jqXhr) {
                        deffered.resolve(data, status, jqXhr);
                    },
                    error: function(data, status, jqXhr) {
                        deffered.reject(data, status, jqXhr);
                    }
                };

                baseService.add(options);
            };
            let updateDashboardDeferred;
            const updateDashboard = function(payload, id, deffered) {
                const params = {
                        id: id
                    },
                    options = {
                        url: "dashboards/{id}",
                        data: payload,
                        success: function(data, status, jqXhr) {
                            deffered.resolve(data, status, jqXhr);
                        },
                        error: function(data, status, jqXhr) {
                            deffered.reject(data, status, jqXhr);
                        }
                    };

                baseService.update(options, params);
            };
            let updateUserDashboardDeferred;
            const updateUserDashboard = function(payload, id, deffered) {
                const params = {
                        id: id
                    },
                    options = {
                        url: "dashboards/user/{id}",
                        data: payload,
                        success: function(data, status, jqXhr) {
                            deffered.resolve(data, status, jqXhr);
                        },
                        error: function(data, status, jqXhr) {
                            deffered.reject(data, status, jqXhr);
                        }
                    };

                baseService.update(options, params);
            };

            return {
                getTargetLinkageModel: function() {
                    let dashboardObj = {};

                    dashboardObj = {
                        dashboardName: null,
                        dashboardDescription: null,
                        dashboardClass: null,
                        dashboardClassValue: null,
                        enterpriseRole: null,
                        creationDate: null,
                        layout: {
                            layout: {
                                large: [],
                                medium: [],
                                small: []
                            },
                            titleName: null,
                            name: null
                        },
                        dashboardDesign: null
                    };

                    return dashboardObj;
                },
                saveDashboard: function(payload) {
                    saveDashboardDeferred = $.Deferred();
                    saveDashboard(payload, saveDashboardDeferred);

                    return saveDashboardDeferred;
                },
                saveUserDashboard: function(payload) {
                    saveUserDashboardDeferred = $.Deferred();
                    saveUserDashboard(payload, saveUserDashboardDeferred);

                    return saveUserDashboardDeferred;
                },
                updateDashboard: function(payload, id) {
                    updateDashboardDeferred = $.Deferred();
                    updateDashboard(payload, id, updateDashboardDeferred);

                    return updateDashboardDeferred;
                },
                updateUserDashboard: function(payload, id) {
                    updateUserDashboardDeferred = $.Deferred();
                    updateUserDashboard(payload, id, updateUserDashboardDeferred);

                    return updateUserDashboardDeferred;
                }
            };
        };

    return new DashboardListModel();
});