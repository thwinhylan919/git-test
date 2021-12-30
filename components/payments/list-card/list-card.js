define([
    "knockout",
    "./model",
    "ojs/ojinputnumber"
], function(ko, ListInfoModel) {
    "use strict";

    return function(rootParams) {
        const self = this;
        let i = 0;

        ko.utils.extend(self, rootParams.rootModel);

        self.main = ko.observableArray();
        self.mainData = rootParams.data;
        self.componentsRegistered = ko.observable(false);
        self.customListUrl = ko.observable("");
        self.compDisplayName = ko.observable("");
        self.listType = ko.observable("SI");
        self.listLoaded = ko.observable(true);
        self.listCount = ko.observable("...");
        rootParams.baseModel.registerComponent("standing-instructions-list", "payments");
        rootParams.baseModel.registerComponent("payments-payee-list", "payee");
        rootParams.baseModel.registerComponent("biller-list", "payments");
        rootParams.baseModel.registerComponent("debtor-group-list", "debtor");
        ListInfoModel.init();
        rootParams.baseModel.registerElement("payment-card");
        self.customListUrl(rootParams.data.url);
        self.compDisplayName(rootParams.data.data);
        self.type = rootParams.data.type;

        let count = 0;

        ListInfoModel.getList(self.customListUrl()).done(function(data) {
            if (self.type === "managebiller") {
                count = 0;

                for (i = 0; i < data.partyBillerDetails.length; i++) {
                    count = count + data.partyBillerDetails[i].length;
                }

                self.listCount(count);
            } else if (self.type === "standinginstruction") {
                self.listCount(data.instructionsList ? data.instructionsList.length : 0);
            } else if (self.type === "managepayees") {
                count = 0;

                for (i = 0; i < data.payeeGroups.length; i++) {
                    count = count + data.payeeGroups[i].listPayees.length;
                }

                self.listCount(count);
            } else if (self.type === "managedebtor") {
                count = data.payerGroups ? data.payerGroups.length : "0";
                self.listCount(count);
            }

            self.listLoaded(false);
            self.listLoaded(true);
        });
    };
});