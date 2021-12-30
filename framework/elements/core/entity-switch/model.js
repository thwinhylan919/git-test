define([
    "baseService"
], function(BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
        Model = function() {
            return {
                fetchUserData: function() {
                    return baseService.fetch({
                        url: "me"
                    });
                },
                fetchAvailableLocale: function() {
                    return baseService.fetch({
                        url: "enumerations/locale",
                        showMessage: false
                    });
                },
                fetchEntities: function() {
                    return baseService.fetch({
                        url: "entities",
                        showMessage: false
                    });
                }
            };
        };

    return new Model();
});