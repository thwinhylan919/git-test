define([
    "baseService"
], function(BaseService) {
    "use strict";

    const headerModel = function() {
        const baseService = BaseService.getInstance();

        return {
            logOut: function() {
                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage("logout");
                }

                return baseService.remove({
                    url: "session"
                });
            },
            showLoginTime: function() {
                return baseService.fetch({
                    url: "me"
                });
            },
            helpDeskSessionOut: function(payload) {

                return baseService.update({
                    url: "helpDeskSession",
                    data: payload
                });
            },
            getMailCount: function () {
              return baseService.fetch({
                url: "mailbox/count?msgFlag=T"
              });
            },
            baseServiceProps: function(key, value) {
                return baseService.props(key, value);
            }
        };
    };

    return new headerModel();
});