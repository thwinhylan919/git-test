define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self;

                function instructionspayinspostCall(payload, config) {
            return Model.instructionspayinspost(payload, config);
        }

                function paymentstransfersselfpostCall(payload, config) {
            return Model.paymentstransfersselfpost(payload, config);
        }

                function paymentstransfersselfpaymentIdpatchCall(paymentId, payload, config) {
            return Model.paymentstransfersselfpaymentIdpatch(paymentId, payload, config);
        }

        function init(bindingContext, _rootParams) {
            self = bindingContext;
            self.parentPayloads = self.getStageState("add-money-to-wallet-stage1");
            self.transfer = self.parentPayloads.transfer;
            self.transferfromMyaccount = self.parentPayloads.transferFromAccount;
            self.selfpayload = self.parentPayloads.selfpayload;
            self.externalpayload = self.parentPayloads.externalpayload;
            self.walletcurrency = self.selfpayload.amount.currency();
            self.requestpayload = self.parentPayloads.requestpayload;
            self.paymentId = self.parentPayloads.paymentId;
            self.amountMyaccount = self.selfpayload.amount.amount();
            self.noteMyaccount = self.selfpayload.remarks;
            self.mobileNumber = self.requestpayload.mobileNumber;
            self.amountRequestaccount = self.requestpayload.amount.amount();
            self.amountToMyAccount = ko.observable(_rootParams.baseModel.formatCurrency(self.amountMyaccount, self.walletcurrency));
            self.amountToRequestMoney = ko.observable(_rootParams.baseModel.formatCurrency(self.amountRequestaccount, self.walletcurrency));
            self.noteRequestaccount = self.requestpayload.note;
            self.amountExternnalaccount = self.externalpayload.amount.amount();
            self.amountToExternal = ko.observable(_rootParams.baseModel.formatCurrency(self.amountExternnalaccount, self.walletcurrency));
            self.model = self.selfpayload;
            self.payeeId = self.selfpayload.creditAccountId.value;
            self.wallet = "Wallet";

            if (self.transfer === "myaccounts") {
                self.confirmScreenDetailsArray = [[
                        {
                            label: self.nls.Addmoney.TransferTo,
                            value: self.wallet
                        },
                        {
                            label: self.nls.Addmoney.Amount,
                            value: self.amountMyaccount,
                            currency: self.walletcurrency,
                            isCurrency: true
                        },
                        {
                            label: self.nls.Addmoney.TransferFrom,
                            value: self.transferfromMyaccount
                        },
                        {
                            label: self.nls.Addmoney.Note,
                            value: self.noteMyaccount
                        }
                    ]];
            } else if (self.transfer === "request") {
                self.confirmScreenDetailsArray = [[
                        {
                            label: self.nls.RequestMobileNumber,
                            value: self.mobileNumber
                        },
                        {
                            label: self.nls.Addmoney.Amount,
                            value: self.amountRequestaccount,
                            currency: self.walletcurrency,
                            isCurrency: true
                        },
                        {
                            label: self.nls.Addmoney.Note,
                            value: self.noteRequestaccount
                        }
                    ]];
            }
        }

        return {
            instructionspayinspostCall: instructionspayinspostCall,
            paymentstransfersselfpostCall: paymentstransfersselfpostCall,
            paymentstransfersselfpaymentIdpatchCall: paymentstransfersselfpaymentIdpatchCall,
            init: init
        };
    };
});