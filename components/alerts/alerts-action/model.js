define([
    "baseService"
], function(BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
        ActionableAlertsModel = function() {
            return {
                fetchUrl: function(token) {
                    return baseService.fetch({
                        url: "actionAlerts/public/fetchURL?id={token}"
                    }, {
                        token: token
                    });
                },
                fetchSecureUrl: function(token) {
                    return baseService.fetch({
                        url: "actionAlerts/private/fetchURL?id={token}"
                    }, {
                        token: token
                    });
                }
            };
        };

    return new ActionableAlertsModel();
});