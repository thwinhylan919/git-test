define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const DetailsScreenModel = function () {
        const baseService = BaseService.getInstance();

        let fetchPartyDeferred;
        const fetchParty = function(deferred) {
            const options = {
                url: "me/party",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };

        return {
            fetchParty: function() {
                fetchPartyDeferred = $.Deferred();
                fetchParty(fetchPartyDeferred);

                return fetchPartyDeferred;
            }
        };
    };

    return new DetailsScreenModel();
});