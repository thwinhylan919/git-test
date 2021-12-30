define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function walletstransferpaymentIdgetCall(paymentId, payload, config) {
            return Model.walletstransferpaymentIdget(paymentId, payload, config);
        }

                function walletstransferexternalpaymentIdpatchCall(paymentId, payload, config) {
            return Model.walletstransferexternalpaymentIdpatch(paymentId, payload, config);
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;

            self.pageRendered = function (data) {
                self.currency = ko.observable();
                self.amount = ko.observable();
                self.error = ko.observable();
                self.referanceno = ko.observable(data.queryMap.referenceNumber);
                self.status = ko.observable(data.queryMap.transactionStatus);
                self.validate = ko.observable(true);

                if (self.status() !== "SUCCESS") {
                    self.validate(false);
                    self.StatusMessages = self.nls.AddMoney.Failed;
                }

                self.walletstransferexternalpaymentIdpatchpaymentId = ko.observable(data.queryMap.paymentId);
                self.walletstransferpaymentIdgetpaymentId = ko.observable(data.queryMap.paymentId);
                self.modelInstance.walletstransferexternalpaymentIdpatchv1payload.validated = self.validate();
                self.modelInstance.walletstransferexternalpaymentIdpatchv1payload.externalReferenceNumber = self.referanceno();

                walletstransferpaymentIdgetCall(self.walletstransferpaymentIdgetpaymentId()).then(function (response) {
                    self.amount(response.amount.amount);
                    self.currency(response.amount.currency);

                    self.confirmScreenDetailsArray = [[
                            {
                                label: self.nls.AddMoney.TransferFrom,
                                value: self.nls.AddMoney.debitAccount
                            },
                            {
                                label: self.nls.AddMoney.TransferTo,
                                value: self.nls.AddMoney.creditAccount
                            },
                            {
                                label: self.nls.AddMoney.Amount,
                                value: self.amount._latestValue,
                                currency: self.currency._latestValue,
                                isCurrency: true
                            }
                        ]];
                }).then(function (data) {
                    walletstransferexternalpaymentIdpatchCall(self.walletstransferexternalpaymentIdpatchpaymentId(), ko.mapping.toJSON(self.modelInstance.walletstransferexternalpaymentIdpatchv1payload)).then(function (response) {
                        if (response) {
                            params.dashboard.loadComponent("confirm-screen", {
                                transactionResponse: response,
                                transactionName: self.nls.componentHeader,
                                hostReferenceNumber: response.externalReferenceId,
                                favorite: true,
                                confirmScreenExtensions: {
                                    isSet: true,
                                    taskCode: "WA_F_WFE",
                                    successMessage: self.nls.AddMoney.Failed,
                                    confirmScreenDetails: self.confirmScreenDetailsArray,
                                    template: "confirm-screen/payments-template"
                                },
                                confirmationType: {
                                    version: "v1",
                                    name: null
                                }
                            });
                        }
                    });
                });

                return true;
            };

            return true;
        }

        return {
            walletstransferpaymentIdgetCall: walletstransferpaymentIdgetCall,
            walletstransferexternalpaymentIdpatchCall: walletstransferexternalpaymentIdpatchCall,
            init: init
        };
    };
});