define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const ImportAmendmentModel = function() {
        const baseService = BaseService.getInstance();
        let importAmendmentListDeffered;
        const getImportAmendments = function(partyId, beneficiaryName, lcNumber, deferred) {
            const options = {
                    url: "letterofcredits/amendments?letterOfCreditId=" + lcNumber + "&partyId=" + partyId + "&beneficiaryName=" + beneficiaryName + "&amendStatus=UNCONFIRMED&type=IMPORT",
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
                    beneficiaryName: beneficiaryName
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
            getImportAmendments: function(partyId, beneficiaryName, lcNumber) {
                importAmendmentListDeffered = $.Deferred();
                getImportAmendments(partyId, beneficiaryName, lcNumber, importAmendmentListDeffered);

                return importAmendmentListDeffered;
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

    return new ImportAmendmentModel();
});