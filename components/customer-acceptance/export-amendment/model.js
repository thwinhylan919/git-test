define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const ExportAmendmentModel = function() {
        const baseService = BaseService.getInstance();
        let exportAmendmentListDeffered;
        const getExportAmendments = function(partyId, applicantName, lcNumber, deferred) {
            const options = {
                    url: "letterofcredits/amendments?letterOfCreditId=" + lcNumber + "&partyId=" + partyId + "&applicantName=" + applicantName + "&amendStatus=UNCONFIRMED&type=EXPORT",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    lcNumber: lcNumber,
                    partyId: partyId,
                    applicantName: applicantName
                };

            baseService.fetch(options, params);
        };
        let getAmmendmentDetailsDeferred;
        const getAmendmentDetails = function(letterOfCreditId, amendmentId, deferred) {
            const options = {
                    url: "letterofcredits/{letterOfCreditId}/amendments/{amendmentId}",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    letterOfCreditId: letterOfCreditId,
                    amendmentId: amendmentId
                };

            baseService.fetch(options, params);
        };
        let fetchPartyRelationsDeferred;
        const fetchPartyRelations = function(deferred) {
            const options = {
                url: "me/party/relations",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchPartyDetailsDeferred;
        const fetchPartyDetails = function(deferred) {
            const options = {
                url: "me/party",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };

        return {
            getExportAmendments: function(partyId, applicantName, lcNumber) {
                exportAmendmentListDeffered = $.Deferred();
                getExportAmendments(partyId, applicantName, lcNumber, exportAmendmentListDeffered);

                return exportAmendmentListDeffered;
            },
            getAmendmentDetails: function(letterOfCreditId, amendmentId) {
                getAmmendmentDetailsDeferred = $.Deferred();
                getAmendmentDetails(letterOfCreditId, amendmentId, getAmmendmentDetailsDeferred);

                return getAmmendmentDetailsDeferred;
            },
            fetchPartyRelations: function() {
                fetchPartyRelationsDeferred = $.Deferred();
                fetchPartyRelations(fetchPartyRelationsDeferred);

                return fetchPartyRelationsDeferred;
            },
            fetchPartyDetails: function() {
                fetchPartyDetailsDeferred = $.Deferred();
                fetchPartyDetails(fetchPartyDetailsDeferred);

                return fetchPartyDetailsDeferred;
            }
        };
    };

    return new ExportAmendmentModel();
});