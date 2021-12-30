define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const DemandDraftModel = function() {
        const Model = function() {
            this.addressDetails = {
                modeofDelivery: null,
                addressType: null,
                addressTypeDescription: null,
                postalAddress: {
                    line1: "",
                    line2: "",
                    line3: "",
                    line4: "",
                    line5: "",
                    line6: "",
                    line7: "",
                    line8: "",
                    line9: "",
                    line10: "",
                    line11: "",
                    line12: "",
                    city: "",
                    state: "",
                    country: "",
                    zipCode: "",
                    branch: "",
                    branchName: ""
                }
            };

            this.demandDraftModel = {
                dictionaryArray: null,
                refLinks: null,
                amount: {
                    currency: null,
                    amount: null
                },
                valueDate: null,
                userReferenceNo: null,
                remarks: null,
                purpose: null,
                debitAccountId: {
                    displayValue: null,
                    value: null
                },
                status: null,
                payeeId: null,
                inFavourOf: null
            };

            this.demandDraftInstructionModel = {
                dictionaryArray: null,
                refLinks: null,
                type: "NONREC",
                frequency: "10",
                startDate: null,
                endDate: null,
                nextExecutionDate: null,
                amount: {
                    currency: null,
                    amount: null
                },
                userReferenceNo: null,
                remarks: null,
                purpose: null,
                debitAccountId: {
                    displayValue: null,
                    value: null
                },
                statusType: null,
                payeeId: null,
                inFavourOf: null
            };

            this.favoritesModel = {
                id: null,
                transactionType: null,
                payeeId: null,
                amount: {
                    currency: null,
                    amount: null
                },
                debitAccountId: {
                    displayValue: null,
                    value: null
                },
                remarks: null,
                payeeGroupId: null,
                valueDate: null,
                payeeNickName: null,
                payeeAccountName: null
            };
        },
         baseService = BaseService.getInstance();
        /* variable to make sure that in case there is no change
         * in model no additional fetch requests are fired.*/

        let fireBatchDeferred;
        const fireBatch = function(deferred, batchRequest, type) {
            const options = {
                url: "batch",
                success: function(data, status, jqXHR) {
                    deferred.resolve(data, status, jqXHR);
                },
                error: function(data, status, jqXHR) {
                    deferred.reject(data, status, jqXHR);
                }
            };

            baseService.batch(options, {
                type: type
            }, batchRequest);
        };

        return {
            getNewModel: function() {
                return new Model();
            },
            getPayeeList: function() {
                return baseService.fetch({
                    url: "payments/payeeGroup?expand=ALL&types=DEMANDDRAFT"
                });
            },
            getAccountList: function() {
                return baseService.fetch({
                    url: "accounts/demandDeposit"
                });
            },
            initiateDomesticDDIssue: function(model) {
                return baseService.add({
                    url: "payments/drafts/domestic",
                    data: model
                });
            },
            listAccessPoint: function() {
                return baseService.fetch({
                    url: "accessPoints"
                });
            },
            deleteFavourite: function(paymentId, transactionType) {
                return baseService.remove({
                    url: "payments/favorites?transactionId={paymentId}&&type={transactionType}"
                }, {
                    paymentId: paymentId,
                    transactionType: transactionType
                });
            },
            initiateDomesticDDInstructionIssue: function(model) {
                return baseService.add({
                    url: "payments/instructions/drafts/domestic",
                    data: model
                });
            },
            initiateInternationalDDIssue: function(model) {
                return baseService.add({
                    url: "payments/drafts/international",
                    data: model
                });
            },
            initiateInternationalDDInstructionIssue: function(model) {
                return baseService.add({
                    url: "payments/instructions/drafts/international",
                    data: model
                });
            },
            getPayeeSubList: function(groupId) {
                return baseService.fetch({
                    url: "payments/payeeGroup/{groupId}/payees?types={type}&nickName={nickName}"
                }, {
                    groupId: groupId,
                    type: "DEMANDDRAFT",
                    nickName: ""
                });
            },
            getDemandDraftPayee: function(payeeId, groupId) {
                return baseService.fetch({
                    url: "payments/payeeGroup/{groupId}/payees/demandDraft/{payeeId}"
                }, {
                    payeeId: payeeId,
                    groupId: groupId
                });
            },
            getBranchAddress: function(branchCode) {
                return baseService.fetch({
                    url: "locations/branches?branchCode={branchCode}"
                }, {
                    branchCode: branchCode
                });
            },
            getTransferData: function(paymentId, param1, param2, date) {
                let url;

                if (date === "now") {
                    url = "payments/{paymentType}/{transferType}/{paymentId}";
                } else {
                    url = "payments/instructions/{paymentType}/{transferType}/{paymentId}";
                }

                return baseService.fetch({
                    url: url
                }, {
                    paymentType: param1,
                    transferType: param2,
                    paymentId: paymentId
                });
            },
            fetchCourierAddress: function() {
                return baseService.fetch({
                    url: "me/party"
                });
            },
            fetchBankConfig: function() {
                return baseService.fetch({
                    url: "bankConfiguration"
                });
            },
            addFavorites: function(model) {
                return baseService.add({
                    url: "payments/favorites",
                    data: model
                });
            },
            getHostDate: function() {
                return baseService.fetch({
                    url: "payments/currentDate"
                });
            },
            fireBatch: function(batchRequest, type) {
                fireBatchDeferred = $.Deferred();
                fireBatch(fireBatchDeferred, batchRequest, type);

                return fireBatchDeferred;
            },
            getPayeeMaintenance: function() {
                return baseService.fetch({
                    url: "maintenances/payments"
                });
            }
        };
    };

    return new DemandDraftModel();
});