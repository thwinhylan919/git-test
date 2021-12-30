define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            enumerationsaccessModuleget: function () {
                const params = {},
                    options = {
                        url: "/enumerations/accessModule",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            fetchAllTasksForModule: function (module) {
                const params = {
                    module: module
                },
                    options = {
                        url: "resourceTasks?accessModule={module}&view=hierarchy",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            getNewModel: function () {
                return {
                    version: null,
                    attributeInclusionList: [{
                        attributeId: null,
                        attributeInclusionId: null,
                        taskIds: []
                    }],
                    id: null,
                    module: null,
                    accessLevel: null,
                    partyId: null
                };
            }
        };
    };

    return new Model();
});