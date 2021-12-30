define(["jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const EquipmentDetailsModel = function () {
        const baseService = BaseService.getInstance(),
            Model = function () {
                this.equipmentDetails = {
                    currencyId: null,
                    currencyCode: null,
                    intendedUse: null,
                    machineDetails: null,
                    machineryType: null,
                    manufacturerModel: null,
                    manufacturedYear: null,
                    manufacturerName: null,
                    assetValue: null,
                    purchaseDate: null,
                    remarks: null
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

    return new EquipmentDetailsModel();
});