define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/account-input",
    "ojs/ojknockout",
    "ojs/ojselectcombobox"
], function (ko, AccountDetailsModel, locale) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.locale = locale;
        self.accountsParser = rootParams.accountsParser;
        self.accountList = ko.observableArray();
        self.displayAccountList = ko.observableArray();
        self.customerName = ko.observable();
        self.taskCode = rootParams.taskCode;
        self.class = rootParams.class;
        self.accountFetched = ko.observable();
        self.adtnlFetched = ko.observable(false);
        self.bankCode = ko.observable();
        self.type = rootParams.type;
        self.account = rootParams.account;
        self.id = rootParams.baseModel.incrementIdCount();
        self.readOnly = rootParams.readOnly ? rootParams.readOnly : false;
        self.label = self.readOnly ? locale.accountSelected : rootParams.label || locale.selectAccount;
        self.additionalDetails = rootParams.additionalDetails || ko.observable();
        self.dataURL = rootParams.customURL ? rootParams.customURL : "demandDeposit";
        rootParams.baseModel.registerElement("modal-window");

        let dataURLSubciption, taskCodeSubcription;
        const moduleSet = new Set();

        if (ko.isObservable(self.dataURL)) {
            dataURLSubciption = self.dataURL.subscribe(function () {
                self.fetchList();
            });
        }

        self.getDisplayText = function (accountNumber, nickName) {
            if (nickName) {
                return rootParams.baseModel.format(self.locale.displayContent, {
                    displayValue: accountNumber,
                    nickname: nickName
                });
            }

            return accountNumber;
        };

        function setAdditionalDetails(account) {
            self.adtnlFetched(false);

            if (account) {
                let i;

                for (i = 0; i < self.accountList().length; i++) {
                    if (self.accountList()[i].id.value === account) {
                        self.account(account);
                        self.customerName(self.accountList()[i].partyName);
                        break;
                    }
                }

                if (self.type === "address") {
                    self.bankCode(self.accountList()[i].branchCode);

                    AccountDetailsModel.fetchBankAddress(self.bankCode()).then(function (data) {
                        self.additionalDetails({
                            address: data.addressDTO[0],
                            account: self.accountList()[i]
                        });

                        self.adtnlFetched(true);
                    });
                } else if (self.type === "balance") {
                    self.additionalDetails({
                        account: self.accountList()[i]
                    });

                    self.adtnlFetched(true);
                } else if (self.type === "nodeValue") {
                    self.additionalDetails(self.accountList()[i]);
                    self.adtnlFetched(true);
                } else if (self.module && self.module === "loans") {
                    self.additionalDetails({
                        account: self.accountList()[i]
                    });

                    self.adtnlFetched(true);
                }
            }
        }

        self.fetchList = function () {
            AccountDetailsModel.fetchAccountData(ko.utils.unwrapObservable(self.dataURL), ko.utils.unwrapObservable(self.taskCode)).then(function (response) {
                self.accountList.removeAll();
                self.displayAccountList.removeAll();

                let accounts = [];

                response.batchDetailResponseDTOList.forEach(function (res) {
                    if (res.status === 200) {
                        accounts = accounts.concat(res.responseObj.accounts || res.responseObj || []);
                    }
                });

                if (self.accountsParser) {
                    accounts = self.accountsParser(accounts);
                }

                if (!accounts.length) {
                    rootParams.baseModel.showMessages(null, [rootParams.no_data_message || self.locale.noAccounts], "ERROR");
                    self.accountFetched(true);

                    return;
                }

                if (self.account()) {
                    const accountInFilteredResults = accounts.filter(function (element) {
                        return element.id.value === self.account();
                    })[0];

                    if (!accountInFilteredResults) {
                        rootParams.baseModel.showMessages(null, [self.locale.txnNotAvailable], "ERROR");
                        self.accountFetched(true);

                        return;
                    }
                }

                ko.utils.arrayPushAll(self.accountList, accounts);

                accounts = rootParams.baseModel.sortLib(accounts, [
                    "partyName",
                    "accountNickname"
                ]);

                accounts.forEach(function (item) {
                    item.label = self.getDisplayText(item.id.displayValue, item.accountNickname);
                    item.value = item.id.value;
                    moduleSet.add(item.module);

                    if (item.defaultAccount && !self.account()) {
                        self.account(item.id.value);
                    }
                });

                let result = rootParams.baseModel.groupBy(accounts, moduleSet.size > 1 ? [
                    "partyId.value",
                    "module"
                ] : ["partyId.value"], function (item) {
                    return [
                        item.partyName,
                        moduleSet.size > 1 ? self.locale[item.module] : item.partyName
                    ];
                });

                if (result.length === 1) {
                    result = result[0].children;
                }

                ko.utils.arrayPushAll(self.displayAccountList, result);
                setAdditionalDetails(self.account());
                self.accountFetched(true);
            });
        };

        self.fetchList();

        if (self.taskCode && ko.isObservable(self.taskCode)) {
            taskCodeSubcription = self.taskCode.subscribe(function () {
                self.fetchList();
            });
        }

        const localAccountSubciption = self.account.subscribe(function (value) {
            setAdditionalDetails(value);
        });

        self.dispose = function () {
            localAccountSubciption.dispose();

            if (dataURLSubciption) {
                dataURLSubciption.dispose();
            }

            if (taskCodeSubcription) {
                taskCodeSubcription.dispose();
            }
        };
    };
});