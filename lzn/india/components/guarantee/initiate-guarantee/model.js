define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const InitiateGuaranteeModel = function() {
        const baseService = BaseService.getInstance(),
            Model = function() {
                this.TradeFinanceDetails = {
                    issueDate: null,
                    attachedDocuments: [],
                    branchId: null,
                    productId: null,
                    partyId: {
                        displayValue: null,
                        value: null
                    },
                    beneId: null,
                    beneName: null,
                    beneAddress: {
                        line1: null,
                        line2: null,
                        line3: null,
                        country: null,
                        zipCode: null
                    },
                    advisingBankCode: null,
                    beneContractReferenceNo: null,
                    contractAmount: {
                        currency: null,
                        amount: null
                    },
                    guaranteeAmount: {
                        currency: null,
                        amount: null
                    },
                    closureDate: null,
                    effectiveDate: null,
                    expiryDate: null,
                    chargingAccountId: {
                        displayValue: null,
                        value: null
                    },
                    instruction: null,
                    name: null,
                    visibility: null,
                    state: null,
                    guaranteetype: null,
                    guaranteeStatus: null,
                    bankGuaranteeContract: [],
                    userId: null,
                    validityType: null,
                    expiryCondition: null,
                    termsAndConditions: []
                };
            };
        let initiateGuaranteeDeferred;
        const initiateGuarantee = function(model, deferred) {
            const options = {
                url: "bankguarantees",
                data: model,
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                }
            };

            baseService.add(options);
        };
        let fetchProductDeferred;
        const fetchProduct = function(deferred) {
            const options = {
                url: "products/bankguarantees",
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };
        let fetchGuranteeTypeDeferred;
        const fetchGuranteeType = function(deferred) {
            const options = {
                url: "bankguarantees/types",
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };
        let getAccountDetailDeferred;
        const getAccountDetail = function(deferred) {
            const options = {
                url: "accounts/demandDeposit?taskCode=TF_AF_CBG",
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };
        let fetchBeniCountryDeferred;
        const fetchBeniCountry = function(deferred) {
            const options = {
                url: "enumerations/country",
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };
        let fetchBranchDeferred;
        const fetchBranch = function(deferred) {
            const options = {
                url: "locations/country/all/city/all/branchCode/",
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };
        let fetchBeneNameDeferred;
        const fetchBeneName = function(deferred) {
            const options = {
                url: "beneficiaries?transactionType=GUARANTEE",
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };
        let fetchPartyRelationsDeferred;
        const fetchPartyRelations = function(deferred) {
            const options = {
                url: "me/party/relations",
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };
        let fetchPartyDeferred;
        const fetchParty = function(deferred) {
            const options = {
                url: "me/party",
                success: function(data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                }
            };

            baseService.fetch(options);
        };
        let getBankDetailsBICDeferred;
        const getBankDetailsBIC = function(code, deferred) {
            const options = {
                    url: "financialInstitution/bicCodeDetails/{BICCode}",
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    },
                    error: function(data, status, jqXhr) {
                        deferred.reject(data, status, jqXhr);
                    }
                },
                params = {
                    BICCode: code
                };

            baseService.fetch(options, params);
        };
        let updateTemplateDeferred;
        const updateTemplate = function(guaranteeId, model, deferred) {
            const params = {
                    guaranteeId: guaranteeId
                },
                options = {
                    url: "bankguarantees/{guaranteeId}",
                    data: model,
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    }
                };

            baseService.update(options, params);
        };
        let deleteGuaranteeDeferred;
        const deleteGuarantee = function(guaranteeId, deferred) {
            const options = {
                    url: "bankguarantees/{bgId}",
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    bgId: guaranteeId
                };

            baseService.remove(options, params);
        };
        let deleteDocumentDeferred;
        const deleteDocument = function(documentId, deferred) {
            const params = {
                    documentId: documentId
                },
                options = {
                    url: "contents/{documentId}?transactionType=LC",
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    }
                };

            baseService.remove(options, params);
        };
        let getDocumentInfoDeffered;
        const getDocumentInfo = function(documentId, ownerId, deferred) {
            const params = {
                    documentId: documentId,
                    ownerId: ownerId
                },
                options = {
                    url: "contents/{documentId}",
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    }
                };

            baseService.fetch(options, params);
        };

        return {
            getNewModel: function() {
                return new Model();
            },
            initiateGuarantee: function(model) {
                initiateGuaranteeDeferred = $.Deferred();
                initiateGuarantee(model, initiateGuaranteeDeferred);

                return initiateGuaranteeDeferred;
            },
            getAccountDetail: function() {
                getAccountDetailDeferred = $.Deferred();
                getAccountDetail(getAccountDetailDeferred);

                return getAccountDetailDeferred;
            },
            fetchBeneName: function() {
                fetchBeneNameDeferred = $.Deferred();
                fetchBeneName(fetchBeneNameDeferred);

                return fetchBeneNameDeferred;
            },
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
            fetchBeniCountry: function() {
                fetchBeniCountryDeferred = $.Deferred();
                fetchBeniCountry(fetchBeniCountryDeferred);

                return fetchBeniCountryDeferred;
            },
            fetchBranch: function() {
                fetchBranchDeferred = $.Deferred();
                fetchBranch(fetchBranchDeferred);

                return fetchBranchDeferred;
            },
            fetchProduct: function() {
                fetchProductDeferred = $.Deferred();
                fetchProduct(fetchProductDeferred);

                return fetchProductDeferred;
            },
            fetchGuranteeType: function() {
                fetchGuranteeTypeDeferred = $.Deferred();
                fetchGuranteeType(fetchGuranteeTypeDeferred);

                return fetchGuranteeTypeDeferred;
            },
            getBankDetailsBIC: function(code) {
                getBankDetailsBICDeferred = $.Deferred();
                getBankDetailsBIC(code, getBankDetailsBICDeferred);

                return getBankDetailsBICDeferred;
            },
            updateTemplate: function(guaranteeId, model) {
                updateTemplateDeferred = $.Deferred();
                updateTemplate(guaranteeId, model, updateTemplateDeferred);

                return updateTemplateDeferred;
            },
            deleteGuarantee: function(guaranteeId) {
                deleteGuaranteeDeferred = $.Deferred();
                deleteGuarantee(guaranteeId, deleteGuaranteeDeferred);

                return deleteGuaranteeDeferred;
            },
            getDocumentInfo: function(documentId, ownerId) {
                getDocumentInfoDeffered = $.Deferred();
                getDocumentInfo(documentId, ownerId, getDocumentInfoDeffered);

                return getDocumentInfoDeffered;
            },
            deleteDocument: function(documentId) {
                deleteDocumentDeferred = $.Deferred();
                deleteDocument(documentId, deleteDocumentDeferred);

                return deleteDocumentDeferred;
            }
        };
    };

    return new InitiateGuaranteeModel();
});
