define(["jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const BusinessActivityModel = function () {
        const baseService = BaseService.getInstance(),
            Model = function () {
                this.businessActivity = {
                    entityType: "Public",
                    businessNature: "",
                    exportImportLicenceNo: "",
                    remarks: null,
                    companyDetails: [{
                        parentCompanyName: null,
                        shareHoldingPercent: null
                    }],
                    yearWiseDetails: [],
                    businessActivityDocument: [{
                        documentName: null,
                        documentType: null,
                        documentLinkageId: null
                    }]
                };

                this.yearWiseDetails = {
                    year: "",
                    currency: "",
                    balanceSheetSize: null,
                    operatingProfit: null,
                    netProfit: null
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

        let businessNatureListDeferred;
        const businessNatureList = function (deferred) {
            const options = {
                url: "enumerations/businessNature",
                success: function (data) {
                    deferred.resolve(data);
                },
                error: function (data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
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
            businessNatureList: function () {
                businessNatureListDeferred = $.Deferred();
                businessNatureList(businessNatureListDeferred);

                return businessNatureListDeferred;
            }
        };
    };

    return new BusinessActivityModel();
});