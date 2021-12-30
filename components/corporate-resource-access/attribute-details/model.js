define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            deletePartyAttributeAccess: function (partyId, accessId, payload) {
                const params = {
                        partyId: partyId,
                        accessId: accessId
                    },
                    options = {
                        url: "parties/{partyId}/preferences/attributeAccess/{accessId}",
                        version: "v1",
                        data: payload
                    };

                return baseService.remove(options, params);
            },
            deleteUserAttributeAccess: function (userId, accessId, payload) {
                const params = {
                        userId: userId,
                        accessId: accessId
                    },
                    options = {
                        url: "users/{userId}/attributeAccess/{accessId}",
                        version: "v1",
                        data: payload
                    };

                return baseService.remove(options, params);
            }
        };
    };

    return new Model();
});