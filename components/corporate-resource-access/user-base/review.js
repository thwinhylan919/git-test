define([
        "ojL10n!resources/nls/user-base",
        "./model",
        "knockout",
        "ojs/ojformlayout",
        "ojs/ojvalidationgroup",
        "ojs/ojcheckboxset"
    ],
    function (resourceBundle, Model, ko) {
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

            self.callConfirm = function (payload) {
                payload.userId = self.userData.userid;

                if (self.accessData.partyLevelAccess.indexOf("true") !== -1) {
                    payload.partyLevelAccess = true;
                } else {
                    payload.partyLevelAccess = false;
                }

                if (payload.id) {
                    return Model.updateUserAttributeAccess(payload.id, payload.userId, ko.mapping.toJSON(payload));
                }

                return Model.createUserAttributeAccess(payload.userId, ko.mapping.toJSON(payload));

            };

        };
    });