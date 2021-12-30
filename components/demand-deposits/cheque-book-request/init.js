define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/cheque-book-request",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup"
], function (ko, demandDepositChequeRequestModel, locale) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.chequeBookRequestLocale = locale;
        self.common = locale.common;

        self.accountNumber = ko.observable();
        self.accountAdditionalDetails = ko.observable();
        self.validRequest = ko.observable();
        self.noOfChequeBooksEnabled = ko.observable(false);

        const confirmScreenExtensions = {},
            getNewKoModel = function () {
                const KoModel = demandDepositChequeRequestModel.getNewModel();

                return ko.mapping.fromJS(KoModel);
            };

        self.modelInstance = rootParams.rootModel.previousState ? ko.mapping.fromJS({
            chequeBookDetails: rootParams.rootModel.previousState.data
        }) : getNewKoModel();

        self.chequeBookTypeArray = ko.observableArray();
        self.chequeBookType = ko.observable();
        self.chequBookTypeLoaded = ko.observable(false);
        ko.utils.extend(self, rootParams.rootModel);
        self.dispose = null;

        self.taxonomy = rootParams.dashboard.getTaxonomyDefinition("com.ofss.digx.app.dda.dto.chequeBook.ChequeBookDTO");

        if (self.params.id) {
            self.accountNumber(self.params.id.value);
        }
        else{
            self.accountNumber(self.modelInstance.chequeBookDetails.accountId.value());
        }

        demandDepositChequeRequestModel.getMaintenance().then(function(data) {
            self.noOfChequeBooksEnabled(data.noOfChequeBooks === "Y");
        });

        self.numberOfLeavesOptions = ko.observableArray([{
                number: "10",
                value: "10",
                label: rootParams.baseModel.format(self.chequeBookRequestLocale.chequeBookRequest.chequeBookLeaveOption, {
                    leavesCount: 10
                })
            },
            {
                number: "25",
                value: "25",
                label: rootParams.baseModel.format(self.chequeBookRequestLocale.chequeBookRequest.chequeBookLeaveOption, {
                    leavesCount: 25
                })
            },
            {
                number: "50",
                value: "50",
                label: rootParams.baseModel.format(self.chequeBookRequestLocale.chequeBookRequest.chequeBookLeaveOption, {
                    leavesCount: 50
                })
            }
        ]);

        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("review-cheque-book-request", "demand-deposits");
        rootParams.baseModel.registerElement("address");
        rootParams.baseModel.registerComponent("responsive-select", "inputs");
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.dashboard.headerName(self.chequeBookRequestLocale.compName.compName);

        self.chequeBookType.subscribe(function (data) {
            const cheqbookTypeValue = data.split("-");

            self.modelInstance.chequeBookDetails.chequeBookTypeList()[0].stockCode(cheqbookTypeValue[0]);
            self.modelInstance.chequeBookDetails.chequeBookTypeList()[0].stockCurrency(cheqbookTypeValue[1]);
            self.modelInstance.chequeBookDetails.chequeBookTypeList()[0].stockDescription(cheqbookTypeValue[2]);
        });

        self.callChequeBookType = function () {
            demandDepositChequeRequestModel.fetchChequeBookType().then(function (data) {
                self.chequBookTypeLoaded(false);
                self.chequeBookTypeArray.removeAll();

                for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.chequeBookTypeArray.push({
                        label: data.enumRepresentations[0].data[i].description,
                        description: data.enumRepresentations[0].data[i].stockDescription,
                        currency: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code + "-" + data.enumRepresentations[0].data[i].description + "-" + data.enumRepresentations[0].data[i].description
                    });
                }

                self.chequBookTypeLoaded(true);

                if (rootParams.rootModel.previousState) {
                    const chequeBookTypeList = rootParams.rootModel.previousState.data.chequeBookTypeList[0];

                    self.chequeBookType(chequeBookTypeList.stockCode + "-" + chequeBookTypeList.stockDescription + "-" + chequeBookTypeList.stockDescription);
                }
            });
        };

        if (rootParams.dashboard.appData.segment !== "CORP" || self.accountNumber()) {
            self.callChequeBookType();
        }

        self.accountNumber.subscribe(function () {
            self.callChequeBookType();
        });

        self.review = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("requestChequeBook"))) {
                return;
            }

            self.modelInstance.chequeBookDetails.accountId = self.accountAdditionalDetails().account.id;
            self.modelInstance.chequeBookDetails.currency(self.accountAdditionalDetails().account.currencyCode);
            self.modelInstance.chequeBookDetails.noOfChequeBooksEnabled = self.noOfChequeBooksEnabled();

            rootParams.dashboard.loadComponent("review-cheque-book-request", {
                mode: "review",
                data: ko.mapping.toJS(self.modelInstance.chequeBookDetails),
                confirmScreenExtensions: confirmScreenExtensions
            }, self);
        };

        self.accountsParser = function (data) {
            const tempData = data;

            if (tempData.accounts) {
                const filteredAccounts = tempData.accounts.filter(function (account) {
                    return account.accountFacilities.hasChequeBook;
                });

                tempData.accounts = filteredAccounts;
            }

            return tempData;
        };
    };
});