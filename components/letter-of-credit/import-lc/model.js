define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const ImportLCModel = function() {
        const Model = function() {
                this.model = {
                    beneName: "",
                    lcStatus: [],
                    fromAmount: "",
                    toAmount: "",
                    status: [],
                    issueDatefrom: "",
                    issueDateto: "",
                    expiryDatefrom: "",
                    expiryDateto: "",
                    lcNumber: "",
                    applicantName: [],
                    shipmentDateFrom: "",
                    expiryStatus: [],
                    shipmentDateTo: "",
                    lcType: "Import"
                };
            },
            baseService = BaseService.getInstance();
        let fetchPDFDeferred;
        const fetchPDF = function(model) {
            const options = {
                url: "letterofcredits?media=application/pdf&lcType=" + model.lcType + "&partyId=" + model.applicantName + "&lcNumber=" + model.lcNumber + "&beneName=" + model.beneName + "&lcStatus=" + model.lcStatus + "&fromAmount=" + model.fromAmount + "&toAmount=" + model.toAmount + "&status=" + model.status + "&issueDatefrom=" + model.issueDatefrom + "&issueDateto=" + model.issueDateto + "&expiryDatefrom=" + model.expiryDatefrom + "&expiryDateto=" + model.expiryDateto + "&shipmentDatefrom=" + model.shipmentDateFrom + "&shipmentDateto=" + model.shipmentDateTo + "&expiryStatus=" + model.expiryStatus
            };

            baseService.downloadFile(options);
        };
        let Deferred;
        const getImportLCs = function(model, deferred) {
            const options = {
                url: "letterofcredits?lcType=" + model.lcType + "&partyId=" + model.applicantName + "&lcNumber=" + model.lcNumber + "&beneName=" + model.beneName + "&lcStatus=" + model.lcStatus + "&fromAmount=" + model.fromAmount + "&toAmount=" + model.toAmount + "&status=" + model.status + "&issueDatefrom=" + model.issueDatefrom + "&issueDateto=" + model.issueDateto + "&expiryDatefrom=" + model.expiryDatefrom + "&expiryDateto=" + model.expiryDateto + "&shipmentDatefrom=" + model.shipmentDateFrom + "&shipmentDateto=" + model.shipmentDateTo + "&expiryStatus=" + model.expiryStatus,
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
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
            },
            getImportLC = function(lcNumber, deferred) {
                const options = {
                        url: "letterofcredits/{lcNumber}",
                        success: function(data) {
                            deferred.resolve(data);
                        },
                        error: function(data) {
                            deferred.reject(data);
                        }
                    },
                    params = {
                        lcNumber: lcNumber
                    };

                baseService.fetch(options, params);
            };

        return {
            getNewModel: function(modelData) {
                return new Model(modelData);
            },
            fetchPDF: function(model) {
                fetchPDFDeferred = $.Deferred();
                fetchPDF(model, fetchPDFDeferred);

                return fetchPDFDeferred;
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
            getImportLCs: function(model) {
                Deferred = $.Deferred();
                getImportLCs(model, Deferred);

                return Deferred;
            },
            getImportLC: function(lcNumber) {
                Deferred = $.Deferred();
                getImportLC(lcNumber, Deferred);

                return Deferred;
            }
        };
    };

    return new ImportLCModel();
});