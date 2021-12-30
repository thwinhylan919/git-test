define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
        SearchCreditLineModel = function() {
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
            let fetchPartyDetailsDeferred;
            const fetchPartyDetails = function(partyId, deferred) {
                const params = {
                        partyId: partyId
                    },
                    options = {
                        url: "me/party/relations/{partyId}",
                        success: function(data) {
                            deferred.resolve(data);
                        }
                    };

                baseService.fetch(options, params);
            };
            let getCreditLimitsDeferred;
            const getCreditLimits = function(partyId, deferred) {
                let lineLimitUrl;

                if (partyId === "ALL") {
                    lineLimitUrl = "parties/lineLimit";
                } else {
                    lineLimitUrl = "parties/lineLimit?partyId=" + partyId;
                }

                const options = {
                    url: lineLimitUrl,
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };

                baseService.fetch(options);
            };
            let getLimitDetailsDeferred;
            const getLimitDetails = function(partyId, lineId, deferred) {
                const options = {
                        url: "parties/lineLimit/{lineId}?partyId={partyId}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        lineId: lineId,
                        partyId: partyId
                    };

                baseService.fetch(options, params);
            };

            return {
                fetchPartyRelations: function() {
                    fetchPartyRelationsDeferred = $.Deferred();
                    fetchPartyRelations(fetchPartyRelationsDeferred);

                    return fetchPartyRelationsDeferred;
                },
                fetchParty: function() {
                    fetchPartyDeferred = $.Deferred();
                    fetchParty(fetchPartyDeferred);

                    return fetchPartyDeferred;
                },
                fetchPartyDetails: function(partyId) {
                    fetchPartyDetailsDeferred = $.Deferred();
                    fetchPartyDetails(partyId, fetchPartyDetailsDeferred);

                    return fetchPartyDetailsDeferred;
                },
                getCreditLimits: function(partyId) {
                    getCreditLimitsDeferred = $.Deferred();
                    getCreditLimits(partyId, getCreditLimitsDeferred);

                    return getCreditLimitsDeferred;
                },
                getLimitDetails: function(partyId, lineId) {
                    getLimitDetailsDeferred = $.Deferred();
                    getLimitDetails(partyId, lineId, getLimitDetailsDeferred);

                    return getLimitDetailsDeferred;
                }
            };
        };

    return new SearchCreditLineModel();
});