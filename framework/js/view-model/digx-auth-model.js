define(["baseService"], function(BaseService) {
    "use strict";

    const resolveData = {
        userData: {},
        currentModule: {},
        menuNavigationAvailable: false,
        config: {},
        localCurrency: null,
        authorizedUIComponents: {
            authorizedUIComponents: ["login-form", "login-form-web", "login-form-mobile", "authorize-consent", "oracle-live"],
            defaultDashboards: []
        },
        dashboard: {
            resolutionLevel: null,
            list: []
        }
    };

    return {
        init: function() {
            BaseService.getInstance({
                nonceEnabled: false
            });
        },
        perform: function(setCurrentEntity) {
            setCurrentEntity();

            return Promise.resolve(resolveData);
        },
        fetchCurrentBrand: function() {
            return Promise.resolve({});
        }
    };

});