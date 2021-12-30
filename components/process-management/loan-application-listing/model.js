define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const ApplicationListingModel = function () {
        const baseService = BaseService.getInstance();

        let fetchApplicationDetailsDeferred;
        const fetchApplicationDetails = function (status, partyId, deferred) {
            const params = {
                status: status,
                partyId: partyId
            }
                , options = {
                    url: "processManagement?moduleId=OBCLPM&status={status}&partyId={partyId}",
                    version: "v1",
                    success: function (data) {
                        deferred.resolve(data);
                    },
                    error: function (data) {
                        deferred.reject(data);
                    }
                };

            baseService.fetch(options, params);
        };

        let mePartyRelationsGetDeferred;
        const mePartyGetRelations = function (deferred) {

            const options = {
                url: "/me/party/relations",
                version: "v1",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            };

            return baseService.fetch(options);
        };

        let fetchAppDataDeferred;
        const fetchAppData = function (refId, deferred) {
            const params = {
                refId: refId
            }
                , options = {
                    url: "processManagement/{refId}",
                    version: "v1",
                    success: function (data) {
                        deferred.resolve(data);
                    },
                    error: function (data) {
                        deferred.reject(data);
                    }
                };

            baseService.fetch(options, params);
        };

        let deleteDraftDeferred;
        const deleteDraft = function (refId, deferred) {
            const params = {
                refId: refId
            },
                options = {
                    url: "processManagement/{refId}",
                    version: "v1",
                    success: function (data) {
                        deferred.resolve(data);
                    },
                    error: function (data) {
                        deferred.reject(data);
                    }
                };

            baseService.remove(options, params);
        };

        let fetchDatasegmentDeferred;
        const fetchDatasegment = function (productCode, deferred) {
            const params = {
                productCode: productCode
            },
                options = {
                    url: "v1/obclpm/listDataSegments/{productCode}/LoanOrig?includeStageInfo=true",
                    version: "ext",
                    success: function (data) {
                        deferred.resolve(data);
                    },
                    error: function (data) {
                        deferred.reject(data);
                    }
                };

            baseService.fetch(options, params);
        };

        return {
            fetchApplicationDetails: function (status, partyId) {
                fetchApplicationDetailsDeferred = $.Deferred();
                fetchApplicationDetails(status, partyId, fetchApplicationDetailsDeferred);

                return fetchApplicationDetailsDeferred;
            }
            ,
            mePartyGetRelations: function () {
                mePartyRelationsGetDeferred = $.Deferred();
                mePartyGetRelations(mePartyRelationsGetDeferred);

                return mePartyRelationsGetDeferred;
            }
            ,
            fetchAppData: function (refId) {
                fetchAppDataDeferred = $.Deferred();
                fetchAppData(refId, fetchAppDataDeferred);

                return fetchAppDataDeferred;
            }
            ,
            deleteDraft: function (id) {
                deleteDraftDeferred = $.Deferred();
                deleteDraft(id, deleteDraftDeferred);

                return deleteDraftDeferred;
            }
            ,
            fetchDatasegment: function (productCode) {
                fetchDatasegmentDeferred = $.Deferred();
                fetchDatasegment(productCode, fetchDatasegmentDeferred);

                return fetchDatasegmentDeferred;
            }
        };
    };

    return new ApplicationListingModel();

});