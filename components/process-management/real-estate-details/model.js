define(["jquery", "baseService"], function ($, BaseService) {
    "use strict";

    const RealEstateDetailsModel = function () {
        const baseService = BaseService.getInstance(),
            Model = function () {
                this.realEstateDetails = {
                    propertyType: null,
                    propertyStatus: null,
                    constructionStatus: null,
                    expectedCompletionDate: null,
                    nameOfBuilder: null,
                    classificationOfBuilder: null,
                    completionDate: null,
                    purchaseDate: null,
                    registrationNumber: null,
                    addressLine1: null,
                    addressLine2: null,
                    addressLine3: null,
                    addressLine4: null,
                    city: null,
                    state: null,
                    country: null,
                    zipcode: null,
                    totalAreaofProperty: null,
                    unit: null,
                    marketValue: null,
                    marketValueCurrency: null,
                    eligibleValue: null,
                    eligibleValueCurrency: null,
                    ownershipStatus: null,
                    existingCharges: null,
                    specialZone: null
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

        return {

            getNewModel: function (modelData) {
                return new Model(modelData);
            },

            allCurrencyType: function () {
                allCurrencyTypeDeferred = $.Deferred();
                allCurrencyType(allCurrencyTypeDeferred);

                return allCurrencyTypeDeferred;
            }

        };
    };

    return new RealEstateDetailsModel();
});