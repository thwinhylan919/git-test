define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const ExportBillModel = function() {
        const Model = function() {
                this.model = {
                    billType: "EXPORT",
                    draweeName: "",
                    drawerName: "",
                    status: "",
                    fromAmount: "",
                    toAmount: "",
                    issueDatefrom: "",
                    issueDateto: "",
                    expiryDatefrom: "",
                    expiryDateto: "",
                    billNumber: ""
                };
            },
            baseService = BaseService.getInstance();
        let getBillDetailsDeferred;
        const getBillDetails = function(billNo, deferred) {
            const params = {
                    billReferenceNo: billNo
                },
                options = {
                    url: "bills/{billReferenceNo}",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };

            baseService.fetch(options, params);
        };
        let fetchPDFDeferred;
        const fetchPDF = function(model) {
            const options = {
                url: "bills?media=application/pdf&partyId=" + model.drawerName + "&billType=" + model.billType + "&billReferenceNo=" + model.billNumber + "&billAmtFrom=" + model.fromAmount + "&billAmtTo=" + model.toAmount + "&billDateFrom=" + model.issueDatefrom + "&billDateTo=" + model.issueDateto + "&status=" + model.status + "&drawee=" + model.draweeName
            };

            baseService.downloadFile(options);
        };
        let getListExportBillsDeferred;
        const getListExportBills = function(model, deferred) {
            const options = {
                url: "bills?partyId=" + model.drawerName + "&billType=" + model.billType + "&billReferenceNo=" + model.billNumber + "&billAmtFrom=" + model.fromAmount + "&billAmtTo=" + model.toAmount + "&billDateFrom=" + model.issueDatefrom + "&billDateTo=" + model.issueDateto + "&status=" + model.status + "&drawee=" + model.draweeName,
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
        };

        return {
            getNewModel: function(modelData) {
                return new Model(modelData);
            },
            getBillDetails: function(billNo) {
                getBillDetailsDeferred = $.Deferred();
                getBillDetails(billNo, getBillDetailsDeferred);

                return getBillDetailsDeferred;
            },
            fetchPDF: function(model) {
                fetchPDFDeferred = $.Deferred();
                fetchPDF(model);

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
            getListExportBills: function(model) {
                getListExportBillsDeferred = $.Deferred();
                getListExportBills(model, getListExportBillsDeferred);

                return getListExportBillsDeferred;
            }
        };
    };

    return new ExportBillModel();
});