define(["baseService"], function(BaseService) {
    "use strict";

    const Login = function() {
        const baseService = BaseService.getInstance();

        return {
            login: baseService.login
        };
    };

    return new Login();
});