define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function paymentstransfersselfpostCall(payload, config) {
            return Model.paymentstransfersselfpost(payload, config);
        }

                function paymentstransfersinternalpostCall(payload, config) {
            return Model.paymentstransfersinternalpost(payload, config);
        }

                function paymentsmerchantsgetCall(code, description, remittanceType, payload, config) {
            return Model.paymentsmerchantsget(code, description, remittanceType, payload, config);
        }

                function instructionspayinspostCall(payload, config) {
            return Model.instructionspayinspost(payload, config);
        }

                function accountsdemandDepositgetCall(status, taskCode, module, expand, excludeBaseCurrency, lmEnabled, accountCurrency, productType, accountType, payload, config) {
            return Model.accountsdemandDepositget(status, taskCode, module, expand, excludeBaseCurrency, lmEnabled, accountCurrency, productType, accountType, payload, config);
        }

                function walletstransferexternalpostCall(payload, config) {
            return Model.walletstransferexternalpost(payload, config);
        }

                function accessPointsgetCall(accessPointId, description, accessType, accessPointStatus, clientId, payload, config) {
            return Model.accessPointsget(accessPointId, description, accessType, accessPointStatus, clientId, payload, config);
        }

                function Channel12ValueChangeHook() {
            self.viewLimitsModaldetails(false);
            ko.tasks.runEarly();
            self.viewLimitsModaldetails(true);
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;

            self.pageRendered = function () {
                return true;
            };

            self.transfer = ko.observable("myaccounts");
            self.allenumloaded = ko.observable(false);
            self.mobile_number = ko.observable();
            self.merchantId = ko.observable();
            self.merchantAccNo = ko.observable();
            self.walletCurrency = ko.observable(params.dashboard.appData.localCurrency);
            self.modelInstance.paymentstransfersselfpostv1payload.amount.currency(self.walletCurrency());
            self.modelInstance.instructionspayinspostv1payload.amount.currency(self.walletCurrency());
            self.modelInstance.paymentstransfersinternalpostv1payload.amount.currency(self.walletCurrency());
            self.modelInstance.walletstransferexternalpostv1payload.amount.currency(self.walletCurrency());
            self.payload.currency = self.walletCurrency();
            self.paymentsmerchantsgetremittanceType = ko.observable("INWARD");
            self.modelInstance.paymentstransfersinternalpostv1payload.partyId.value = params.dashboard.userData.userProfile.partyId.value;
            self.redirectionUrl = ko.observable();
            self.successUrl = ko.observable();
            self.accesspointsloaded = ko.observable(false);
            self.viewLimitsModalId = ko.observable();
            self.viewLimitsModaldetails = ko.observable(false);
            self.failureUrl = ko.observable();
            self.paymentType = ko.observable();
            self.selectedChannel = ko.observable();
            self.network = ko.observable();
            self.merchantLanguage = ko.observable("en");
            self.paymentId = ko.observable("");
            self.taskCode = "PC_F_CSFT";
            self.walletDetailsloaded = ko.observable(false);
            self.walletAccountNo = ko.observable();
            self.transferFromAccount = ko.observable();
            self.transferFromAdditionalDetail = ko.observable();
            self.customUrl = "demandDeposit?accountType=CURRENT,SAVING";
            self.parentPayloads = params.getStageState("add-money-to-wallet-stage1");
            rootParams.baseModel.registerComponent("add-to-favorite-base", "payments");
            params.baseModel.registerComponent("available-limits", "financial-limits");

            if (self.parentPayloads && self.parentPayloads.selfpayload && self.parentPayloads.requestpayload) {
                self.modelInstance.paymentstransfersselfpostv1payload = self.parentPayloads.selfpayload;
                self.modelInstance.instructionspayinspostv1payload = self.parentPayloads.requestpayload;
            }

            if (self.parentPayloads && self.parentPayloads.transfer) {
                self.transfer(self.parentPayloads.transfer);
            }

            paymentsmerchantsgetCall(self.paymentsmerchantsgetcode(), self.paymentsmerchantsgetdescription(), self.paymentsmerchantsgetremittanceType()).then(function (response) {
                self.allenumloaded(true);
                self.paymentsmerchantsgetVar(response);

                if (response.response[0].merchantDetailsDTO) {
                    self.merchantId(response.response[0].merchantDetailsDTO.customerId);
                    self.merchantAccNo(response.response[0].merchantDetailsDTO.merchantAccount);
                    self.redirectionUrl(response.response[0].merchantDetailsDTO.redirectionUrl);
                    self.successUrl(response.response[0].merchantDetailsDTO.successUrl);
                    self.failureUrl(response.response[0].merchantDetailsDTO.failureUrl);
                    self.modelInstance.paymentstransfersinternalpostv1payload.debitAccountId.value = self.merchantAccNo();
                }
            });

            accountsdemandDepositgetCall(self.accountsdemandDepositgetstatus(), self.accountsdemandDepositgettaskCode(), self.accountsdemandDepositgetmodule(), self.accountsdemandDepositgetexpand(), self.accountsdemandDepositgetexcludeBaseCurrency(), self.accountsdemandDepositgetlmEnabled(), self.accountsdemandDepositgetaccountCurrency(), self.accountsdemandDepositgetproductType(), self.accountsdemandDepositgetaccountType()).then(function (response) {
                if (response && response.accounts) {
                    self.walletDetailsloaded(true);
                    self.accountsdemandDepositgetVar(response.accounts);

                    const walletacc = self.accountsdemandDepositgetVar().filter(function (e) {
                        return e.productDTO.productId === "WALLET";
                    });

                    if (walletacc.length) {
                        self.walletAccountNo(walletacc[0].id.value);
                        self.modelInstance.paymentstransfersselfpostv1payload.creditAccountId.value = self.walletAccountNo();
                    }
                }
            });

            accessPointsgetCall(self.accessPointsgetaccessPointId(), self.accessPointsgetdescription(), self.accessPointsgetaccessType(), self.accessPointsgetaccessPointStatus(), self.accessPointsgetclientId()).then(function (response) {
                self.accesspointsloaded(true);
                self.viewLimitsModaldetails(true);
                self.accessPointsgetVar(response.accessPointListDTO);
            });

            return true;
        }

        return {
            paymentstransfersselfpostCall: paymentstransfersselfpostCall,
            paymentstransfersinternalpostCall: paymentstransfersinternalpostCall,
            paymentsmerchantsgetCall: paymentsmerchantsgetCall,
            instructionspayinspostCall: instructionspayinspostCall,
            accountsdemandDepositgetCall: accountsdemandDepositgetCall,
            walletstransferexternalpostCall: walletstransferexternalpostCall,
            accessPointsgetCall: accessPointsgetCall,
            Channel12ValueChangeHook: Channel12ValueChangeHook,
            init: init
        };
    };
});