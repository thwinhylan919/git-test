define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const LoanAppTrackerModel = function () {
        const baseService = BaseService.getInstance();

        let getProcessSnapshotsDeferred;
        const getProcessSnapshots = function (deferred,partyId) {
             const options = {
                     url: "processManagement?moduleId=OBCLPM&partyId={partyId}",
                     success: function(data, status, jqXhr) {
                         deferred.resolve(data, status, jqXhr);
                     },
                     error: function(data, status, jqXhr) {
                         deferred.reject(data, status, jqXhr);
                     }
                 },
                 params = {
                     partyId: partyId
                 };

             baseService.fetch(options, params);
        };

        return {
            mepartyget: function () {
                const params = {},
                 options = {
                    url: "/me/party",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            },
            getProcessSnapshots: function (partyId) {
                getProcessSnapshotsDeferred = $.Deferred();
                getProcessSnapshots(getProcessSnapshotsDeferred,partyId);

                return getProcessSnapshotsDeferred;
            }
        };
    };

    return new LoanAppTrackerModel();
});