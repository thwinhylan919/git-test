define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/debtor-group-list",
    "ojs/ojinputnumber",
    "ojs/ojpopup"
], function(ko, debtorSubListModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = debtorSubListModel.getNewModel();

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.debtors = ResourceBundle.debtors;
        rootParams.dashboard.headerName(self.debtors.managedebtor_header);
        self.payerGroupData = self.data;
        self.cardDisplayDetails = getNewKoModel().debtorDetails;
        self.subPayers = ko.observableArray();
        self.subPayerName = ko.observable();
        self.subPayer = ko.observable();
        self.isSubPayerLoaded = ko.observable(false);
        self.payerGroupImage = ko.observable();
        debtorSubListModel.init(self.payerGroupData.name);
        self.subPayerName(self.payerGroupData.name);
        self.subPayer(self.payeeGroupData);
        self.groupId = ko.observable();

        if (self.payerGroupData.groupId) {
            self.groupId(self.payerGroupData.groupId);
        } else {
            self.groupId(self.payerGroupData.id);
        }

        rootParams.baseModel.registerComponent("debtor-details", "debtor");
        rootParams.baseModel.registerComponent("payee-data-card", "payee");
        rootParams.baseModel.registerComponent("add-new-relationship", "debtor");

        debtorSubListModel.getPayerSubList(self.groupId()).done(function(data) {
            for (let i = 0; i < data.listPayers.length; i++) {
                self.subPayers.push(data.listPayers[i]);
            }

            self.isSubPayerLoaded(true);
        });
    };
});