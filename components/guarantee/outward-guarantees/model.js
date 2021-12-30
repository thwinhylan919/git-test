define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
        OutwardGuaranteesModel = function() {
            const Model = function() {
                this.model = {
                    beneName: "",
                    applicantName: "",
                    fromAmount: "",
                    toAmount: "",
                    currency: "",
                    bgStatus: "",
                    issueDatefrom: "",
                    issueDateto: "",
                    expiryDatefrom: "",
                    expiryDateto: "",
                    bgNumber: "",
                    transactionType: "OUTWARD"
                };
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
            let getBankGuaranteeDeferred;
            const getBankGuarantees = function(model, deferred) {
                const options = {
                    url: "bankguarantees?partyId=" + model.applicantName + "&beneName=" + model.beneName + "&bgStatus=" + model.bgStatus + "&fromAmount=" + model.fromAmount + "&toAmount=" + model.toAmount + "&issueDatefrom=" + model.issueDatefrom + "&issueDateto=" + model.issueDateto + "&expiryDatefrom=" + model.expiryDatefrom + "&expiryDateto=" + model.expiryDateto + "&bgNumber=" + model.bgNumber + "&transactionType=" + model.transactionType,
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                };

                baseService.fetch(options);
            };
            let getBGDetailsDeferred;
            const getBGDetails = function(bankGuaranteeId, deferred) {
                const options = {
                        url: "bankguarantees/{bankGuaranteeId}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        bankGuaranteeId: bankGuaranteeId
                    };

                baseService.fetch(options, params);
            };
            let fetchPDFDeferred;
            const fetchPDF = function(model) {
                const options = {
                    url: "bankguarantees?media=application/pdf&partyId=" + model.applicantName + "&beneName=" + model.beneName + "&transactionType=" + model.transactionType + "&bgStatus=" + model.bgStatus + "&fromAmount=" + model.fromAmount + "&toAmount=" + model.toAmount + "&issueDatefrom=" + model.issueDatefrom + "&issueDateto=" + model.issueDateto + "&expiryDatefrom=" + model.expiryDatefrom + "&expiryDateto=" + model.expiryDateto + "&bgNumber=" + model.bgNumber
                };

                baseService.downloadFile(options);
            };

            return {
                getNewModel: function(modelData) {
                    return new Model(modelData);
                },
                getBankGuarantees: function(model) {
                    getBankGuaranteeDeferred = $.Deferred();
                    getBankGuarantees(model, getBankGuaranteeDeferred);

                    return getBankGuaranteeDeferred;
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
                },
                fetchPDF: function(model) {
                    fetchPDFDeferred = $.Deferred();
                    fetchPDF(model, fetchPDFDeferred);

                    return fetchPDFDeferred;
                },
                getBGDetails: function(bankGuaranteeId) {
                    getBGDetailsDeferred = $.Deferred();
                    getBGDetails(bankGuaranteeId, getBGDetailsDeferred);

                    return getBGDetailsDeferred;
                }
            };
        };

    return new OutwardGuaranteesModel();
});