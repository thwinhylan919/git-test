define([
    "baseService"
], function(BaseService) {
    "use strict";

    const draftModel = function() {
        const baseService = BaseService.getInstance();

        return {
            getDraftData: function(paymentId, paymentType, transferType, transferNow) {
                let url;

                if (transferNow) {
                    url = "payments/{paymentType}/{transferType}/{paymentId}";
                } else {
                    url = "payments/instructions/{paymentType}/{transferType}/{paymentId}";
                }

                return baseService.fetch({
                    url: url
                }, {
                    paymentType: paymentType,
                    paymentId: paymentId,
                    transferType: transferType
                });
            },
            getPurposeDesc: function() {
                return baseService.fetch({
                    url: "purposes/PC"
                });
            },
            getDeliveryMode: function() {
                return baseService.fetch({
                    url: "enumerations/modeOfDelivery"
                });
            },
            fetchCourierAddress: function() {
                return baseService.fetch({
                    url: "me/party"
                });
            },
            getBranchAddress: function(branchCode) {
                return baseService.fetch({
                    url: "locations/branches?branchCode={branchCode}"
                }, {
                    branchCode: branchCode
                });
            },
            retrieveImage: function(id) {
                return baseService.fetch({
                    url: "contents/{id}"
                }, {
                    id: id
                });
            },
            getPayeeMaintenance: function() {
                return baseService.fetch({
                    url: "maintenances/payments"
                });
            },
            getGroupDetails: function(payeeGroupId) {
                return baseService.fetch({
                    url: "payments/payeeGroup/{payeeGroupId}"
                }, {
                    payeeGroupId: payeeGroupId
                });
            },
            getPayeeDetails: function(payeeGroupId, payeeId) {
                return baseService.fetch({
                    url: "payments/payeeGroup/{payeeGroupId}/payees/demandDraft/{payeeId}"
                }, {
                    payeeGroupId: payeeGroupId,
                    payeeId: payeeId
                });
            },
            confirmDomesticDDIssue: function(paymentId) {
                return baseService.patch({
                    url: "payments/drafts/domestic/{paymentId}"
                }, {
                    paymentId: paymentId
                });
            },
            confirmDomesticDDInstructionIssue: function(paymentId) {
                return baseService.patch({
                    url: "payments/instructions/drafts/domestic/{instructionId}"
                }, {
                    instructionId: paymentId
                });
            }
        };
    };

    return new draftModel();
});