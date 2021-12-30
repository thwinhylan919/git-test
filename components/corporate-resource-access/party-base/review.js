define([
    "ojL10n!resources/nls/party-base",
    "./model",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup"
], function (resourceBundle, Model, ko) {
    "use strict";

    return function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel.params);
        params.baseModel.registerComponent("review-transaction-details", "corporate-resource-access");
        self.nls = resourceBundle;

        if (self.mode === "approval") {
            self.partyName = params.rootModel.transactionDetails().partyName;
        }

        params.dashboard.headerName(self.nls.componentHeader);

        self.callConfirm = function (payload, isCorpAdmin) {
            payload.futureAttributeAccess = self.accessData.futureAttributeAccess;

            if (payload.id) {
                return Model.updatePartyAttributeAccess(isCorpAdmin, payload.id, payload.partyId, ko.mapping.toJSON(payload));
            }

            return Model.createPartyAttributeAccess(isCorpAdmin, payload.partyId, ko.mapping.toJSON(payload));

        };

    };
});