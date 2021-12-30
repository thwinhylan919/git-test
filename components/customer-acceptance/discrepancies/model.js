define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
        DiscrepanciesModel = function() {
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
            let listDiscrepanciesDeferred;
            const listDiscrepancies = function(partyId, counterPartyName, id, deferred) {
                const options = {
                    url: "bills/discrepancies?partyId=" + partyId + "&counterPartyName=" + counterPartyName + "&id=" + id + "&billType=IMPORT",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };

                baseService.fetch(options);
            };
            let getBillDiscrepanciesDetailsDeferred;
            const getBillDiscrepanciesDetails = function(billNumber, deferred) {
                const options = {
                    url: "bills/discrepancies/" + billNumber,
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };

                baseService.fetch(options);
            };

            return {
                fetchPartyRelations: function() {
                    fetchPartyRelationsDeferred = $.Deferred();
                    fetchPartyRelations(fetchPartyRelationsDeferred);

                    return fetchPartyRelationsDeferred;
                },
                fetchPartyDetails: function() {
                    fetchPartyDetailsDeferred = $.Deferred();
                    fetchPartyDetails(fetchPartyDetailsDeferred);

                    return fetchPartyDetailsDeferred;
                },
                listDiscrepancies: function(partyId, counterPartyName, id) {
                    listDiscrepanciesDeferred = $.Deferred();
                    listDiscrepancies(partyId, counterPartyName, id, listDiscrepanciesDeferred);

                    return listDiscrepanciesDeferred;
                },
                getBillDiscrepanciesDetails: function(billNumber) {
                    getBillDiscrepanciesDetailsDeferred = $.Deferred();
                    getBillDiscrepanciesDetails(billNumber, getBillDiscrepanciesDetailsDeferred);

                    return getBillDiscrepanciesDetailsDeferred;
                }
            };
        };

    return new DiscrepanciesModel();
});