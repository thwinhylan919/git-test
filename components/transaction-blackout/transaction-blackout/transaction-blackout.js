define([
    "knockout",
    "ojL10n!resources/nls/transaction-blackout",
    "ojs/ojinputtext",
    "ojs/ojradioset"
], function(ko, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.nls = resourceBundle;
        self.partyId = ko.observable();
        self.actionHeaderheading = ko.observable(self.nls.transaction.blackout);
        rootParams.baseModel.registerComponent("search-transaction-blackout", "transaction-blackout");
    };
});