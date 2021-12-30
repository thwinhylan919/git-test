define([
    "knockout",
    "./model",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton"

], function(ko, ActionableAlertsModel) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        rootParams.baseModel.registerElement("page-section");
        self.isLoaded = ko.observable(false);

        const token = self.params.id;

        ActionableAlertsModel[rootParams.dashboard.userData ? "fetchSecureUrl" : "fetchUrl"](token).then(function(response) {
            window.location.href = response.getResponseHeader("actionUri");
        });
    };
});