define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            /**
             * getAccounts - fetch the accounts of the logged in user
             *
             * @param  {Object} consentId
             * @return {Promise}  Returns the promise object.
             */
            getAccounts: function (consentId,client_id,state) {
                const params = {
                        consentId: consentId,
                        client_id: client_id,
                        state: state
                    },
                    options = {
                        url: "accounts?consentId={consentId}&client_id={client_id}&state={state}",
                        apiType: "digx-auth"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});