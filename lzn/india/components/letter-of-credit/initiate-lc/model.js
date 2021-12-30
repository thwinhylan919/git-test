define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const CreateTradeFinanceModel = function () {
        let params;
        const baseService = BaseService.getInstance(),
            Model = function () {
                this.TradeFinanceDetails = {
                    amount: {
                        currency: null,
                        amount: null
                    },
                    availableWith: null,
                    advisingBankCode: null,
                    attachedDocuments: [],
                    applicationDate: null,
                    versionNo: null,
                    counterPartyName: null,
                    counterPartyAddress: {
                        line1: null,
                        line2: null,
                        line3: null,
                        country: null,
                        zipCode: null
                    },
                    chargesFromBeneficiary: null,
                    beneId: null,
                    billingDrafts: [],
                    branchId: null,
                    bankAddress: null,
                    chargingAccountId: {
                        displayValue: null,
                        value: null
                    },
                    confirmationInstruction: null,
                    requestedConfirmationParty: null,
                    confirmingBankCode: null,
                    advisingThroughBankCode: null,
                    requestedConfirmationPartyDetails: {
                        branchAddress: {
                            line1: null,
                            line2: null,
                            line3: null,
                            country: null
                        },
                        name: null
                    },
                    chargesBorneBy: null,
                    confirmed: true,
                    customerReferenceNo: null,
                    deliveryMode: "SWIFT",
                    document: [],
                    documentPresentationDays: null,
                    draftsRequired: "false",
                    drawingStatus: null,
                    expiryDate: null,
                    expiryPlace: null,
                    exposure: {
                        currency: null,
                        amount: 0
                    },
                    incoterm: {
                        code: null,
                        description: null
                    },
                    instructionDescription: null,
                    irRevocable: false,
                    name: null,
                    negotiatingBankCode: null,
                    nominatedBankCode: null,
                    partyId: {
                        displayValue: null,
                        value: null
                    },
                    paymentClause: null,
                    paymentType: null,
                    productId: null,
                    reimbursingBankCode: null,
                    revolving: "false",
                    revolvingDetails: {
                        frequency: null,
                        autoReinstatement: "false",
                        cumulativeFrequency: "true",
                        reinstatementDate: null,
                        type: "VALUE",
                        frequencyUnit: "DAYS"
                    },
                    shipmentDetails: {
                        date: null,
                        description: null,
                        destination: null,
                        dischargePort: null,
                        goodsCode: null,
                        id: null,
                        loadingPort: null,
                        partial: "false",
                        period: null,
                        source: null,
                        transShipment: "false"
                    },
                    goods: {
                        code: null,
                        description: null,
                        units: null,
                        pricePerUnit: null,
                        licenseDetails: {
                            amount: null,
                            balance: null,
                            currency: null,
                            expiryDate: null,
                            issueDate: null,
                            licenseNumber: null,
                            type: null
                        },
                        underLicense: false
                    },
                    state: "TEMPLATE",
                    status: null,
                    swiftId: null,
                    toleranceUnder: null,
                    toleranceAbove: null,
                    toleranceType: null,
                    transferable: "false",
                    transferableType: null,
                    visibility: "PRIVATE"
                };
            };
        let initiateLCDeferred, getAccountDetailDeferred;
        const initiateLC = function (model, deferred) {
            const options = {
                url: "letterofcredits",
                data: model,
                success: function (data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                }
            };

            baseService.add(options);
        };
        let fetchBeneNameDeferred;
        const fetchBeneName = function (deferred) {
            const options = {
                url: "beneficiaries?transactionType=LETTEROFCREDIT",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchPartyRelationsDeferred;
        const fetchPartyRelations = function (deferred) {
            const options = {
                url: "me/party/relations",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchPartyDeferred;
        const fetchParty = function (deferred) {
            const options = {
                url: "me/party",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let deleteLCDeferred;
        const deleteLC = function (id, deferred) {
            const options = {
                url: "letterofcredits/{Id}",
                success: function (data, status, jqXhr) {
                    deferred.resolve(data, status, jqXhr);
                },
                error: function (data, status, jqXhr) {
                    deferred.reject(data, status, jqXhr);
                }
            },
                params = {
                    Id: id
                };

            baseService.remove(options, params);
        };
        let fetchProductDeferred;
        const fetchProduct = function (deferred) {
            const options = {
                url: "products/letterofcredits",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchGoodsDeferred;
        const fetchGoods = function (deferred) {
            const options = {
                url: "letterofcredits/goods",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchBranchDeferred;
        const fetchBranch = function (deferred) {
            const options = {
                url: "locations/country/all/city/all/branchCode/",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchIncotermDeferred;
        const fetchIncoterm = function (deferred) {
            const options = {
                url: "letterofcredits/incoterms",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchBeniCountryDeferred;
        const fetchBeniCountry = function (deferred) {
            const options = {
                url: "enumerations/country",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        },
            getAccountDetail = function (deferred) {
                const options = {
                    url: "accounts/demandDeposit?taskCode=TF_AF_CLC",
                    success: function (data) {
                        deferred.resolve(data);
                    }
                };

                baseService.fetch(options, params);
            };
        let deleteDocumentDeferred;
        const deleteDocument = function (documentId, deferred) {
            const params = {
                documentId: documentId
            },
                options = {
                    url: "contents/{documentId}?transactionType=LC",
                    success: function (data) {
                        deferred.resolve(data);
                    }
                };

            baseService.remove(options, params);
        };
        let getDocumentInfoDeffered;
        const getDocumentInfo = function (documentId, ownerId, deferred) {
            const params = {
                documentId: documentId,
                ownerId: ownerId
            },
                options = {
                    url: "contents/{documentId}",
                    success: function (data) {
                        deferred.resolve(data);
                    }
                };

            baseService.fetch(options, params);
        };
        let updateTemplateDeferred;
        const updateTemplate = function (letterOfCreditId, model, deferred) {
            const params = {
                letterOfCreditId: letterOfCreditId
            },
                options = {
                    url: "letterofcredits/{letterOfCreditId}",
                    data: model,
                    success: function (data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    }
                };

            baseService.update(options, params);
        };
        let getBankDetailsBICDeferred;
        const getBankDetailsBIC = function (code, deferred) {
            const options = {
                url: "financialInstitution/bicCodeDetails/{BICCode}",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            },
                params = {
                    BICCode: code
                };

            baseService.fetch(options, params);
        };

        return {
            getNewModel: function () {
                return new Model();
            },
            initiateLC: function (model) {
                initiateLCDeferred = $.Deferred();
                initiateLC(model, initiateLCDeferred);

                return initiateLCDeferred;
            },
            getAccountDetail: function () {
                getAccountDetailDeferred = $.Deferred();
                getAccountDetail(getAccountDetailDeferred);

                return getAccountDetailDeferred;
            },
            fetchBeneName: function () {
                fetchBeneNameDeferred = $.Deferred();
                fetchBeneName(fetchBeneNameDeferred);

                return fetchBeneNameDeferred;
            },
            fetchPartyRelations: function () {
                fetchPartyRelationsDeferred = $.Deferred();
                fetchPartyRelations(fetchPartyRelationsDeferred);

                return fetchPartyRelationsDeferred;
            },
            fetchParty: function () {
                fetchPartyDeferred = $.Deferred();
                fetchParty(fetchPartyDeferred);

                return fetchPartyDeferred;
            },
            fetchIncoterm: function () {
                fetchIncotermDeferred = $.Deferred();
                fetchIncoterm(fetchIncotermDeferred);

                return fetchIncotermDeferred;
            },
            fetchBeniCountry: function () {
                fetchBeniCountryDeferred = $.Deferred();
                fetchBeniCountry(fetchBeniCountryDeferred);

                return fetchBeniCountryDeferred;
            },
            deleteLC: function (id) {
                deleteLCDeferred = $.Deferred();
                deleteLC(id, deleteLCDeferred);

                return deleteLCDeferred;
            },
            fetchBranch: function () {
                fetchBranchDeferred = $.Deferred();
                fetchBranch(fetchBranchDeferred);

                return fetchBranchDeferred;
            },
            fetchProduct: function () {
                fetchProductDeferred = $.Deferred();
                fetchProduct(fetchProductDeferred);

                return fetchProductDeferred;
            },
            getDocumentInfo: function (documentId, ownerId) {
                getDocumentInfoDeffered = $.Deferred();
                getDocumentInfo(documentId, ownerId, getDocumentInfoDeffered);

                return getDocumentInfoDeffered;
            },
            deleteDocument: function (documentId) {
                deleteDocumentDeferred = $.Deferred();
                deleteDocument(documentId, deleteDocumentDeferred);

                return deleteDocumentDeferred;
            },
            fetchGoods: function () {
                fetchGoodsDeferred = $.Deferred();
                fetchGoods(fetchGoodsDeferred);

                return fetchGoodsDeferred;
            },
            updateTemplate: function (letterOfCreditId, model) {
                updateTemplateDeferred = $.Deferred();
                updateTemplate(letterOfCreditId, model, updateTemplateDeferred);

                return updateTemplateDeferred;
            },
            getBankDetailsBIC: function (code) {
                getBankDetailsBICDeferred = $.Deferred();
                getBankDetailsBIC(code, getBankDetailsBICDeferred);

                return getBankDetailsBICDeferred;
            }
        };
    };

    return new CreateTradeFinanceModel();
});
