define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    const CollectionDetailsModel = function() {
        const baseService = BaseService.getInstance();
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
        const fetchPartyDetails = function(partyID, deferred) {
            const params = {
                    partyId: partyID
                },
                options = {
                    url: "me/party/relations/{partyId}",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };

            baseService.fetch(options, params);
        };
        let fetchBeneficiaryDetailsDeferred;
        const fetchBeneficiaryDetails = function(beneficiaryId, deferred) {
            const params = {
                    beneficiaryId: beneficiaryId
                },
                options = {
                    url: "beneficiaries/{beneficiaryId}",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };

            baseService.fetch(options, params);
        };
        let fetchBranchDateDeferred;
        const fetchBranchDate = function(code, deferred) {
            const options = {
                    url: "branchdate/{branchCode}",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    branchCode: code
                };

            baseService.fetch(options, params);
        };
        let getBankDetailsBICDeferred;
        const getBankDetailsBIC = function(code, deferred) {
            const options = {
                    url: "financialInstitution/bicCodeDetails/{BICCode}",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    BICCode: code
                };

            baseService.fetch(options, params);
        };
        let fetchDraweeCountryDeferred;
        const fetchDraweeCountry = function(deferred) {
            const options = {
                url: "enumerations/country",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchBranchDeferred;
        const fetchBranch = function(deferred) {
            const options = {
                url: "locations/country/all/city/all/branchCode/",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchProductDetailsDeferred;
        const fetchProductDetails = function(productId, deferred) {
            const params = {
                    productId: productId
                },
                options = {
                    url: "products/bills/{productId}",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                };

            baseService.fetch(options, params);
        };
        let getProductsDeferred;
        const getProductsList = function(payload, deferred) {
            const options = {
                url: "products/bills?paymentType=" + payload.paymentType() + "&lcLinkage=" + payload.lcLinked() + "&docAttached=" + payload.docAttached(),
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let getBaseDateDescriptionDefered;
        const getBaseDateDescrption = function(deferred) {
            const options = {
                url: "bills/baseDateDescriptions",
                success: function(data) {
                    deferred.resolve(data);
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
            fetchParty: function() {
                fetchPartyDeferred = $.Deferred();
                fetchParty(fetchPartyDeferred);

                return fetchPartyDeferred;
            },
            fetchPartyDetails: function(partyID) {
                fetchPartyDetailsDeferred = $.Deferred();
                fetchPartyDetails(partyID, fetchPartyDetailsDeferred);

                return fetchPartyDetailsDeferred;
            },
            fetchBeneficiaryDetails: function(counterpartyId) {
                fetchBeneficiaryDetailsDeferred = $.Deferred();
                fetchBeneficiaryDetails(counterpartyId, fetchBeneficiaryDetailsDeferred);

                return fetchBeneficiaryDetailsDeferred;
            },
            fetchBranchDate: function(code) {
                fetchBranchDateDeferred = $.Deferred();
                fetchBranchDate(code, fetchBranchDateDeferred);

                return fetchBranchDateDeferred;
            },
            getBankDetailsBIC: function(code) {
                getBankDetailsBICDeferred = $.Deferred();
                getBankDetailsBIC(code, getBankDetailsBICDeferred);

                return getBankDetailsBICDeferred;
            },
            fetchBranch: function() {
                fetchBranchDeferred = $.Deferred();
                fetchBranch(fetchBranchDeferred);

                return fetchBranchDeferred;
            },
            fetchDraweeCountry: function() {
                fetchDraweeCountryDeferred = $.Deferred();
                fetchDraweeCountry(fetchDraweeCountryDeferred);

                return fetchDraweeCountryDeferred;
            },
            getProductsList: function(payload) {
                getProductsDeferred = $.Deferred();
                getProductsList(payload, getProductsDeferred);

                return getProductsDeferred;
            },
            fetchProductDetails: function(productId) {
                fetchProductDetailsDeferred = $.Deferred();
                fetchProductDetails(productId, fetchProductDetailsDeferred);

                return fetchProductDetailsDeferred;
            },
            getBaseDateDescrption: function() {
                getBaseDateDescriptionDefered = $.Deferred();
                getBaseDateDescrption(getBaseDateDescriptionDefered);

                return getBaseDateDescriptionDefered;
            }
        };
    };

    return new CollectionDetailsModel();
});