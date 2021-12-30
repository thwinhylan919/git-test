define([
    "baseService"
], function(BaseService) {
    "use strict";

    const ClientSearchModel = function() {
        const baseService = BaseService.getInstance();

        return {
            fetchClientTypes: function() {
                return baseService.fetch({
                    url: "enumerations/clientTypes"
                });
            },
            fetchIdentityDomains: function() {
                const options = {
                    url: "oauthpolicyadmin/listIdentityDomain",
                    apiType: "extended"
                };

                return baseService.fetch(options);
            },
            search: function(queryParams) {
                const params = {
                        clientId: queryParams.clientId,
                        clientName: queryParams.clientName,
                        domainName: queryParams.identityDomain,
                        clientType: queryParams.clientType
                    },
                    options = {
                        url: "oauthpolicyadmin/listClient?clientId={clientId}&clientName={clientName}&domainName={domainName}&clientType={clientType}",
                        apiType: "extended"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new ClientSearchModel();
});