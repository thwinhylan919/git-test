define([
    "ojL10n!resources/nls/select-role-invoice",
    "knockout",
    "jquery",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function (resourceBundle, ko, $) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.baseModel.registerElement("modal-window");

        self.role = ko.observable("B");
        params.baseModel.registerComponent("view-invoice", "supply-chain-finance");

        self.loadModal = function () {
            $("#selectRoleContainer").trigger("openModal");
        };

        self.onClickProceed14 = function () {
            params.dashboard.loadComponent("view-invoice", { role: self.role() });
        };
    };
});