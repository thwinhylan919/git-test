define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/virtual-multi-currency-account",
    "ojs/ojarraydataprovider",
    "ojs/ojbutton"
], function (oj, ko, ReviewMultiCurrencyModel, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.resource = resourceBundle;
        params.dashboard.headerName(self.resource.title);
        params.baseModel.registerElement("confirm-screen");
        self.virtualMultiCurrencyAccountId = params.rootModel.params.data ? params.rootModel.params.data.groupId : params.rootModel.params.multiccyaccountgroups.accGroupId();
        self.virtualMultiCurrencyAccountName = params.rootModel.params.data ? params.rootModel.params.data.name : params.rootModel.params.multiccyaccountgroups.accGroupDesc();
        self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
        self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
        self.multiCurrencyAccountGroup = ko.observable();
        self.multiCurrencyList = ko.observableArray(params.rootModel.params.data ? [] : params.rootModel.params.multiccyaccountgroups.VacTmCcyAccGroupDetailDTO());
        self.multiCurrencyAccountGroup = ko.observable();
        self.VAEnabledRealAccounts = params.rootModel.params.data ? "" : params.rootModel.params.multiccyaccountgroups.VAEnabledRealAccounts();
        self.mode = params.rootModel.params.data ? "approval" : params.rootModel.params.mode;
        self.viewDTO = self.mode === "edit" ? JSON.parse(params.rootModel.params.multiCurrencyViewDTO) : "";
        self.deleteFlag = ko.observable(!((self.mode === "approval" && params.rootModel.params.taskCode === "VAMMC_M_DMCA")));

        if (self.mode === "approval") {
            if (params.rootModel.params.taskCode === "VAMMC_M_DMCA" && params.rootModel.params.data.accounts === undefined) {
                ReviewMultiCurrencyModel.readVirtualMultiCurrencyAccount(params.rootModel.params.data.multiCurrencyAccount.groupId).then(function (data) {
                    if (data && data.multiCurrencyAccount) {
                        self.virtualMultiCurrencyAccountName = data.multiCurrencyAccount.name;
                        self.virtualMultiCurrencyAccountId = params.rootModel.params.data.multiCurrencyAccount.groupId;

                        for (let i = 0; i < data.multiCurrencyAccount.accounts.length; i++) {
                            self.multiCurrencyList.push({
                                realAccountNo: data.multiCurrencyAccount.accounts[i].id,
                                realCustomerName: self.realCustomerName,
                                realAccountCurrency: data.multiCurrencyAccount.accounts[i].currencyCode,
                                realAccountBranch: data.multiCurrencyAccount.accounts[i].realAccountBrn,
                                defaultAccount: data.multiCurrencyAccount.accounts[i].defaultAccount
                            });

                        }

                        self.multiCurrencyAccountGroup(new oj.ArrayDataProvider(self.multiCurrencyList(), { idAttribute: "realAccountNo" }));
                        self.deleteFlag(true);
                    }
                });

            } else {
                const accounts = params.rootModel.params.data.accounts;

                for (let i = 0; i < accounts.length; i++) {
                    self.multiCurrencyList.push({
                        realAccountNo: accounts[i].id,
                        realCustomerName: self.realCustomerName,
                        realAccountCurrency: accounts[i].currencyCode,
                        realAccountBranch: accounts[i].realAccountBrn,
                        defaultAccount: accounts[i].defaultAccount
                    });

                }
            }

            self.multiCurrencyAccountGroup(new oj.ArrayDataProvider(self.multiCurrencyList(), { idAttribute: "realAccountNo" }));
        } else {
            self.multiCurrencyAccountGroup(new oj.ArrayDataProvider(self.multiCurrencyList(), { idAttribute: "realAccountNo" }));
        }

        self.confirmScreenCreateMessage = function () {
            return resourceBundle.successCreateMessage;
        };

        self.confirmScreenUpdateMessage = function () {
            return resourceBundle.successUpdateMessage;
        };

        self.confirm = function () {
            const multiccyaccountgroups = {
                name: self.virtualMultiCurrencyAccountName,
                groupId: self.virtualMultiCurrencyAccountId,
                accounts: []
            };

            for (let i = 0; i < self.multiCurrencyList().length; i++) {
                multiccyaccountgroups.accounts.push({
                    defaultAccount: self.multiCurrencyList()[i].defaultAccount,
                    realAccountBrn: self.multiCurrencyList()[i].realAccountBranch,
                    currencyCode: self.multiCurrencyList()[i].realAccountCurrency,
                    id: self.multiCurrencyList()[i].realAccountNo
                });
            }

            if (self.mode === "edit") {
                ReviewMultiCurrencyModel.updateVirtualMultiCurrencyAccount(ko.mapping.toJSON(multiccyaccountgroups), self.viewDTO.groupId).then(function (data) {
                    if ((data.message && data.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
                            params.baseModel.showMessages(null, [data.message.detail], "error");
                    } else if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
                        params.dashboard.loadComponent("confirm-screen", {
                            transactionResponse: data,
                            transactionName: self.resource.title,
                            eReceiptRequired: true,
                            hostReferenceNumber: data.referenceNumber,
                            confirmScreenExtensions: {
                                resource: resourceBundle,
                                confirmScreenDetails: [{
                                    virtualMultiCurrencyAccountId: self.virtualMultiCurrencyAccountId,
                                    virtualMultiCurrencyAccountName: self.virtualMultiCurrencyAccountName
                                }],
                                isSet: true,
                                template: "confirm-screen/virtual-multi-currency-account-group-update-confirm-screen"
                            }
                        });
                    } else {
                        params.dashboard.loadComponent("confirm-screen", {
                            transactionResponse: data,
                            transactionName: self.resource.title,
                            eReceiptRequired: true,
                            hostReferenceNumber: data.referenceNumber,
                            confirmScreenExtensions: {
                                resource: resourceBundle,
                                confirmScreenMsgEval: self.confirmScreenUpdateMessage,
                                isSet: true,
                                confirmScreenDetails: [{
                                    virtualMultiCurrencyAccountId: self.virtualMultiCurrencyAccountId,
                                    virtualMultiCurrencyAccountName: self.virtualMultiCurrencyAccountName
                                }],
                                template: "confirm-screen/virtual-multi-currency-account-group-update-confirm-screen"
                            }
                        });
                    }
                });
            } else {
                ReviewMultiCurrencyModel.createVirtualMultiCurrencyAccount(ko.mapping.toJSON(multiccyaccountgroups)).then(function (data) {
                    if ((data.message && data.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
                            params.baseModel.showMessages(null, [data.message.detail], "error");
                    }else if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
                        params.dashboard.loadComponent("confirm-screen", {
                            transactionResponse: data,
                            transactionName: self.resource.title,
                            eReceiptRequired: true,
                            hostReferenceNumber: data.referenceNumber,
                            confirmScreenExtensions: {
                                resource: resourceBundle,
                                isSet: true,
                                confirmScreenDetails: [{
                                    virtualMultiCurrencyAccountId: self.virtualMultiCurrencyAccountId,
                                    virtualMultiCurrencyAccountName: self.virtualMultiCurrencyAccountName
                                }],
                                template: "confirm-screen/virtual-multi-currency-account-group-create-confirm-screen"
                            }
                        });
                    } else {
                        params.dashboard.loadComponent("confirm-screen", {
                            transactionResponse: data,
                            transactionName: self.resource.title,
                            eReceiptRequired: true,
                            hostReferenceNumber: data.referenceNumber,
                            confirmScreenExtensions: {
                                resource: resourceBundle,
                                confirmScreenMsgEval: self.confirmScreenCreateMessage,
                                isSet: true,
                                confirmScreenDetails: [{
                                    virtualMultiCurrencyAccountId: self.virtualMultiCurrencyAccountId,
                                    virtualMultiCurrencyAccountName: self.virtualMultiCurrencyAccountName
                                }],
                                template: "confirm-screen/virtual-multi-currency-account-group-create-confirm-screen"
                            }
                        });
                    }
                });
            }
        };

    };
});
