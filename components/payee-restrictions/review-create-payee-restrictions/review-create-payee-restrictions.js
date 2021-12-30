define([
        "knockout",
        "./model",
    "ojL10n!resources/nls/review-create-payee-restrictions",
    "promise",
    "ojs/ojinputnumber",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function(ko, payeeCountLimitModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        Params.dashboard.headerName(self.resource.payeeCount.title);
        self.targetType = self.params.targetType;
        self.targetValue = self.params.targetValue;
        self.payeeRestrictionModel = self.params.payeeRestrictionModel;
        self.enterpriseRole =self.params.enterpriseRole;
        self.segmentSelectedForRole = self.params.segmentSelectedForRole;

        self.payeeLimitStatus = [{
                id: true,
                label: self.resource.generic.common.yes
            },
            {
                id: false,
                label: self.resource.generic.common.no
            }
        ];

        self.confirm = function() {
            const payeeCountLimitList = [];

            for (let i = 0; i < self.payeeRestrictionModel.payeeCountLimitList.length; i++) {
                if (self.payeeRestrictionModel.payeeCountLimitList[i].accountPayee.length > 0) {
                    for (let k = 0; k < self.payeeRestrictionModel.payeeCountLimitList[i].accountPayee.length; k++) {
                        payeeCountLimitList.push(ko.toJS(self.payeeRestrictionModel.payeeCountLimitList[i].accountPayee[k]));
                    }
                }

                if (self.payeeRestrictionModel.payeeCountLimitList[i].draftpayee.length > 0) {
                    for (let j = 0; j < self.payeeRestrictionModel.payeeCountLimitList[i].draftpayee.length; j++) {
                        payeeCountLimitList.push(ko.toJS(self.payeeRestrictionModel.payeeCountLimitList[i].draftpayee[j]));
                    }
                }
            }

            const payload = {
                payeeCountLimitList: payeeCountLimitList
            };

            payeeCountLimitModel.addPayeeLimits(ko.mapping.toJSON(payload)).then(function(data) {
                Params.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    transactionName: self.resource.payeeCount.title,
                    okLabel:self.resource.common.ok,
                    template: "payee/confirm-screen-templates/payee-restrictions-landing"
                }, self);
            });
        };
    };
});