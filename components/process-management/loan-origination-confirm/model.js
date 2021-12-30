define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const LoanOriginationConfirmModel = function () {
        const baseService = BaseService.getInstance();

        let localSubmitDeferred;
        const localSubmit = function (draftPayload, deferred) {
            const options = {
                url: "processManagement",
                data: draftPayload,
                success: function (data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                },
                error: function (data, status, jqXhr) {
                    deferred.reject(data, status, jqXhr);
                }
            };

            baseService.add(options);
        };

        return {
            localSubmit: function (draftPayload) {
                localSubmitDeferred = $.Deferred();
                localSubmit(draftPayload, localSubmitDeferred);

                return localSubmitDeferred;
            }
        };
    };

    return new LoanOriginationConfirmModel();
});