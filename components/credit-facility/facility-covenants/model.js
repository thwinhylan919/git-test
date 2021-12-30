define(["jquery","baseService"], function ($,BaseService) {
    "use strict";

    const FacilityCovenantModel = function () {
        const baseService = BaseService.getInstance();
        let Deferred;
        const getImportLCs = function(liability,facility,deferred) {
                const options = {
                    url: "liabilities/{liability}/facilities/{facility}",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    liability: liability,
                    facility:facility
                };

            baseService.fetch(options, params);

        };

        return {
            getNewModel: function(modelData) {
                return new FacilityCovenantModel(modelData);
            },
            getImportLCs: function(liability,facility) {
                Deferred = $.Deferred();
                getImportLCs(liability,facility, Deferred);

                return Deferred;
            }
        };
    };

    return new FacilityCovenantModel();
});
