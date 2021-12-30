define([
    "baseService"
], function(BaseService) {
    "use strict";

    const Model = function() {
        const baseService = BaseService.getInstance();

        return {
            /**
             * fetchIdentityDomain - fetches identity domain
             * @param  {String} domainName  name of identity domain
             * @returns {Promise}  Returns the promise object
             */
            fetchIdentityDomain: function(domainName) {
                const params = {
                        domainName: domainName
                    },
                    options = {
                        url: "oauthpolicyadmin/fetchIdentityDomain?domainName={domainName}",
                        apiType: "extended"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});