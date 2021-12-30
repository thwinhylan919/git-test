define([
    "./model",
    "jquery",
    "knockout"
], function (Model, $, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function accountsdemandDepositgetCall(status, taskCode, module, expand, excludeBaseCurrency, lmEnabled, accountCurrency, productType, accountType, payload, config) {
            return Model.accountsdemandDepositget(status, taskCode, module, expand, excludeBaseCurrency, lmEnabled, accountCurrency, productType, accountType, payload, config);
        }

                function walletsaccountpostCall(payload, config) {
            return Model.walletsaccountpost(payload, config);
        }

                function onClickRegisterNow43() {
            $("#registerWallet1").trigger("openModal");
            self.walletRegisterSuccess(false);
            self.userDetails(true);
        }

                function AcceptTermsandConditions25ValueChangeHook(newValue) {
            const enableGetOTOButton = self.otpButton();

            if (newValue[0] === true) {
                self.otpButton(!enableGetOTOButton);
            } else {
                self.otpButton(true);
            }
        }

                function onClickIagreetothetermsandconditions4() {
            $("#termsAndConditionModal").trigger("openModal");
        }

                function onClickGetOTP99(_event, data) {
            walletsaccountpostCall(null, { showInModalWindow: true }).then(function (data) {
                if (data) {
                    if (data.accountDTO.productCode === "WALLET") {
                        self.walletRegiteredResponse(data);
                        self.isWalletUser(false);
                        self.isRegisteredWalletUser(true);
                        self.walletRegisterSuccess(true);
                        self.userDetails(false);
                    }
                }
            });
        }

                function onClickAddMoneytoWallet56() {
            params.dashboard.loadComponent("manage-accounts", {
                applicationType: "payments",
                defaultTab: "add-money-to-wallet"
            });
        }

                function onClickBacktoDashboard42() {
            self.isWalletUser(false);
            self.isRegisteredWalletUser(true);
            self.hideWalletModal(true);
            $("#registerWallet1").trigger("closeModal");
        }

                function onClickOk33() {
            $("#termsAndConditionModal").trigger("closeModal");
        }

                function onClickAddMoney31() {
            params.dashboard.loadComponent("manage-accounts", {
                applicationType: "payments",
                defaultTab: "add-money-to-wallet"
            });
        }

                function onClickSendMoney85() {
            self.transferTo = "self";

            params.dashboard.loadComponent("manage-accounts", {
                applicationType: "payments",
                defaultTab: "payments-money-transfer",
                params: self
            });
        }

                function onClickViewStatement2() {
            self.walletViewStatement = "";

            ko.utils.arrayForEach(self.walletAccountDetails(), function (item) {
                self.walletViewStatement = item;
            });

            self.walletViewStatement.applicationType = "demand-deposits";
            self.walletViewStatement.defaultTab = "demand-deposit-transactions";
            params.dashboard.loadComponent("manage-accounts", self.walletViewStatement);
        }

        function init(bindingContext, _rootParams) {
            self = bindingContext;

            self.pageRendered = function () {
                return true;
            };

            params = _rootParams;
            self.agreement = ko.observableArray();
            self.walletAccount = ko.observableArray([]);
            self.otpButton = ko.observable(true);
            self.isWalletUser = ko.observable(false);
            self.apiresponse = ko.observable();
            self.accountType = ko.observable();
            self.walletAccountType = ko.observable();
            self.accountCurrency = ko.observable();
            self.isRegisteredWalletUser = ko.observable(false);
            self.avaliableBalanceAmount = ko.observable();
            self.walletRegisterSuccess = ko.observable(false);
            self.userDetails = ko.observable(true);
            params.baseModel.registerComponent("add-money-to-wallet", "payments");
            params.baseModel.registerComponent("account-transactions", "accounts");
            params.baseModel.registerComponent("payments-money-transfer", "payments");
            params.baseModel.registerComponent("demand-deposit-transactions", "demand-deposits");
            params.baseModel.registerElement("flow");
            self.successWallet = "password-policy/confirmation.gif";
            self.walletImage = "wallet/wallet-money.svg";
            self.baseURL = "";
            self.walletRegiteredResponse = ko.observable();
            self.hideWalletModal = ko.observable(false);
            self.walletAccountDetails = ko.observableArray([]);

            accountsdemandDepositgetCall(self.accountsdemandDepositgetstatus(), self.accountsdemandDepositgettaskCode(), self.accountsdemandDepositgetmodule(), self.accountsdemandDepositgetexpand(), self.accountsdemandDepositgetexcludeBaseCurrency(), self.accountsdemandDepositgetlmEnabled(), self.accountsdemandDepositgetaccountCurrency(), self.accountsdemandDepositgetproductType(), self.accountsdemandDepositgetaccountType()).then(function (response) {
                self.accountsdemandDepositgetVar(response);
                self.apiresponse(response);

                if (response.accounts) {
                    for (let i = 0; i < response.accounts.length; i++) {
                        self.walletAccountType = response.accounts[i].productDTO.productId;
                        self.accountType = response.accounts[i].id.displayValue;

                        if (self.walletAccountType.toUpperCase() === "WALLET") {
                            self.walletAccountDetails().push(response.accounts[i]);
                            self.avaliableBalanceAmount = response.accounts[i].availableBalance.amount;
                            self.accountCurrency = response.accounts[i].availableBalance.currency;
                            self.isWalletUser(false);
                            self.isRegisteredWalletUser(true);

                            return;
                        }

                        self.isWalletUser(true);
                        self.isRegisteredWalletUser(false);

                        if (response.accounts.length === 0) {
                            self.isWalletUser(true);
                            self.isRegisteredWalletUser(false);
                        }
                    }
                } else if (response.status.message && response.status.message.type === "INFO") {
                    self.isWalletUser(true);
                    self.isRegisteredWalletUser(false);
                }
            });

            self.mobileNumber = ko.observable(params.dashboard.userData.userProfile.phoneNumber.displayValue);
            self.emailId = ko.observable(params.dashboard.userData.userProfile.emailId.displayValue);
            self.getOTPButton = ko.observable(false);
            self.verification = ko.observable(false);

            self.OtpAuthentication = function (data) {
                if (data.tokenValid) {
                    params.dashboard.switchModule();
                }
            };

            return true;
        }

        return {
            accountsdemandDepositgetCall: accountsdemandDepositgetCall,
            walletsaccountpostCall: walletsaccountpostCall,
            onClickRegisterNow43: onClickRegisterNow43,
            AcceptTermsandConditions25ValueChangeHook: AcceptTermsandConditions25ValueChangeHook,
            onClickIagreetothetermsandconditions4: onClickIagreetothetermsandconditions4,
            onClickGetOTP99: onClickGetOTP99,
            onClickAddMoneytoWallet56: onClickAddMoneytoWallet56,
            onClickBacktoDashboard42: onClickBacktoDashboard42,
            onClickOk33: onClickOk33,
            onClickAddMoney31: onClickAddMoney31,
            onClickSendMoney85: onClickSendMoney85,
            onClickViewStatement2: onClickViewStatement2,
            init: init
        };
    };
});