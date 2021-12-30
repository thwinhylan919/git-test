define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            mepartyget: function () {
                const params = {},
                    options = {
                        url: "/me/party",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            createPartyAttributeAccess: function (isCorpAdmin, partyId, payload) {
                const params = {
                        partyId: partyId
                    },
                    options = {
                        url: isCorpAdmin ? "me/party/attributeAccess" : "parties/{partyId}/preferences/attributeAccess",
                        version: "v1",
                        data: payload
                    };

                return baseService.add(options, params);
            },
            updatePartyAttributeAccess: function (isCorpAdmin, accessId, partyId, payload) {
                const params = {
                        partyId: partyId,
                        accessId: accessId
                    },
                    options = {
                        url: isCorpAdmin ? "me/party/attributeAccess/{accessId}" : "parties/{partyId}/preferences/attributeAccess/{accessId}",
                        version: "v1",
                        data: payload
                    };

                return baseService.update(options, params);
            },
            readPartyAttributeAccess: function (isCorpAdmin, partyId, module) {
                const params = {
                        partyId: partyId,
                        module: module
                    },
                    options = {
                        url: isCorpAdmin ? "me/party/attributeAccess?module={module}" : "parties/{partyId}/preferences/attributeAccess?module={module}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});