define(["jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const LoanDetailsModel = function () {
        const baseService = BaseService.getInstance(),
            Model = function () {
                this.loanDetails = {
                    loanCurrencyCode: "",
                    loanAmount: "",
                    loanTenor: "",
                    valueDate: "",
                    maturityType: "F"
                };

                this.liability = {
                    applicationNumber: "",
                    extLiabilityId: null,
                    remarks: null,
                    customerType: "N",
                    facilitiesCreate: null,
                    facilitiesLinkage: []
                };

                this.facilitiesLinkage = {
                    extFacilityId: "",
                    linkagePercent: "",
                    utilizationOrder: ""
                };
            };

        this.getNewModel = function () {
            return new this.Model();
        };

        let allCurrencyTypeDeferred;
        const allCurrencyType = function (deferred) {
            const options = {
                url: "currency",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };

        let linkFacilitiesDeferred;
        const linkFacilities = function (deferred, liabilityId, partyId) {
            const options = {
                    url: "liabilities/{liabilityId}/facilities?branchCode=000&currencyCode=INR&partyId={partyId}&locale=en",
                    success: function (data) {
                        deferred.resolve(data);
                    },
                    error: function (data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    liabilityId: liabilityId,
                    partyId: partyId
                };

            baseService.fetch(options, params);
        };

        let liabilityIdFetchDeferred;
        const liabilityIdFetch = function (deferred, partyId) {
            const options = {
                    url: "liabilities?partyId={partyId}",
                    success: function (data) {
                        deferred.resolve(data);
                    },
                    error: function (data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    partyId: partyId
                };

            baseService.fetch(options, params);
        };

        return {

            getNewModel: function (modelData) {
                return new Model(modelData);
            },

            allCurrencyType: function () {
                allCurrencyTypeDeferred = $.Deferred();
                allCurrencyType(allCurrencyTypeDeferred);

                return allCurrencyTypeDeferred;
            },
            linkFacilities: function (liabilityId, partyId) {
                linkFacilitiesDeferred = $.Deferred();
                linkFacilities(linkFacilitiesDeferred, liabilityId, partyId);

                return linkFacilitiesDeferred;
            },
            liabilityIdFetch: function (partyId) {
                liabilityIdFetchDeferred = $.Deferred();
                liabilityIdFetch(liabilityIdFetchDeferred, partyId);

                return liabilityIdFetchDeferred;
            }
        };
    };

    return new LoanDetailsModel();
});