define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/loan-requirements",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojarraydataprovider",
    "ojs/ojcheckboxset",
    "ojs/ojjsontreedatasource",
    "ojs/ojtable",
    "ojs/ojpagingtabledatasource",
    "ojs/ojindexermodeltreedatasource",
    "ojs/ojpagingcontrol"
], function (oj, ko, LoanDetailsModel, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this,
            getNewModel = function () {
                const KoModel = ko.mapping.fromJS(LoanDetailsModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.isCurrencyLoaded = ko.observable(false);
        self.code = ko.observable();
        self.loanAmount = ko.observable();
        self.noYears = ko.observable();
        self.noOfMonths = ko.observable();
        self.monthArray = ko.observableArray();
        self.loanCurrencyCode = ko.observableArray();
        self.monthsLoaded = ko.observable(false);
        self.loanTenor = ko.observable();
        self.noFacilityFlag = ko.observable(false);
        self.facilityFlag = ko.observable(false);
        params.baseModel.registerElement("amount-input");
        self.yearFlag = ko.observable(false);
        self.monthFlag = ko.observable(false);
        self.loanLinkData = ko.observableArray();
        self.backupLinkData = ko.observableArray();
        self.review = params.review;
        self.selectedItems = ko.observable([]);
        self.selectedSelectionMode = ko.observable("multiple");
        self.currentItem = ko.observable();
        self.loanLinkData1 = ko.observableArray();
        self.allFlag = ko.observable(true);
        self.selectedFlag = ko.observable(false);
        self.liabilityId = ko.observable();
        self.currentPartyId = ko.observable();
        self.path = params.rootModel.productData;

        if (params.rootModel.productData().payload.loanDetails) {
            self.path = params.rootModel.productData;
            self.loanDetails = params.rootModel.productData().payload.loanDetails;

            self.calcLoanTenor = function () {
                if (Math.floor(self.loanDetails.loanTenor / 12) >= 0) {
                    self.noYears(Math.floor(self.loanDetails.loanTenor / 12));

                    const fraction = (self.loanDetails.loanTenor / 12) - self.noYears();

                    self.noOfMonths(Math.round(fraction * 12));
                }
            };

            self.calcLoanTenor();
        } else {
            self.loanDetails = getNewModel().loanDetails;
            params.rootModel.productData().payload.loanDetails = self.loanDetails;
            self.liability = getNewModel().liability;
            params.rootModel.productData().payload.liability = self.liability;
            params.rootModel.productData().payload.loanDetails.valueDate = params.baseModel.getDate().toJSON().slice(0, 10);
        }

        if (params.rootModel.productData().data.trackerFlag) {
            if (Math.floor(self.loanDetails.loanTenor() / 12) >= 0) {
                self.noYears(Math.floor(self.loanDetails.loanTenor() / 12));

                const fraction = (self.loanDetails.loanTenor() / 12) - self.noYears();

                self.noOfMonths(Math.round(fraction * 12));
            }

            params.rootModel.productData().data.amount = params.rootModel.productData().payload.loanDetails.loanAmount;
            params.rootModel.productData().data.currency = params.rootModel.productData().payload.loanDetails.loanCurrencyCode;
        }

        self.currencyParser = function (data) {
            const output = {};

            output.currencies = [];

            output.currencies.push({
                code: "",
                description: ""
            });

            for (let i = 0; i < data.currencyList.length; i++) {
                output.currencies.push({
                    code: data.currencyList[i].code,
                    description: data.currencyList[i].code
                });
            }

            return output;
        };

        self.filledYear = function (event) {
            self.noYears(event.detail.value);
            self.yearFlag(true);
            self.tenorFlag();
        };

        self.filledMonth = function (event) {
            self.noOfMonths(event.detail.value);
            self.monthFlag(true);
            self.tenorFlag();
        };

        self.tenorFlag = function () {
            if (self.yearFlag() && self.monthFlag()) {
                self.calLoanTenor();
            }
        };

        self.monthList = function () {
            for (let i = 0; i < 12; i++) {
                self.monthArray.push({
                    month: i
                });
            }

            self.monthsLoaded(true);
        };

        self.calLoanTenor = function () {
            self.loanTenor((self.noYears() * 12) + self.noOfMonths());
            params.rootModel.productData().payload.loanDetails.loanTenor = self.loanTenor();
        };

        params.rootModel.successHandler = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            return new Promise(function (resolve) {
                resolve();
            });
        };

        LoanDetailsModel.allCurrencyType().then(function (data) {
            for (let i = 0; i < data.currencyList.length; i++) {
                self.loanCurrencyCode.push({
                    code: data.currencyList[i].code
                });
            }

            self.isCurrencyLoaded(true);
            self.monthList();
        });

        LoanDetailsModel.liabilityIdFetch(params.rootModel.productData().payload.applicantDetails.customerNumber()).then(function (data) {
            self.liabilityId(data.liabilitydtos[0].id);
            self.currentPartyId(data.liabilitydtos[0].partyId);
            self.callLinkFacility();
        });

        self.callLinkFacility = function () {
            LoanDetailsModel.linkFacilities(self.liabilityId(), params.rootModel.productData().payload.applicantDetails.customerNumber()).then(function (data) {
                if (data.facilitydtos) {

                    ko.utils.arrayForEach(data.facilitydtos, function (facilityLine) {

                        self.facilityLink(facilityLine);

                    });

                    for (let i = 0; i < self.loanLinkData().length; i++) {
                        for (let j = 0; j < self.path().payload.liability.facilitiesLinkage().length; j++) {
                            if (self.loanLinkData()[i].extFacilityId === (typeof self.path().payload.liability.facilitiesLinkage()[j].extFacilityId === "function" ? self.path().payload.liability.facilitiesLinkage()[j].extFacilityId() : self.path().payload.liability.facilitiesLinkage()[j].extFacilityId) ) {
                                self.loanLinkData()[i].utilizationOrder = typeof self.path().payload.liability.facilitiesLinkage()[j].utilizationOrder === "function" ? self.path().payload.liability.facilitiesLinkage()[j].utilizationOrder() :self.path().payload.liability.facilitiesLinkage()[j].utilizationOrder;
                                self.loanLinkData()[i].linkagePercent = typeof self.path().payload.liability.facilitiesLinkage()[j].linkagePercent === "function" ? self.path().payload.liability.facilitiesLinkage()[j].linkagePercent() : self.path().payload.liability.facilitiesLinkage()[j].linkagePercent;
                                self.loanLinkData()[i].flag(true);
                            }
                        }
                    }

                    if (self.review) {
                        self.selectedCards();

                        self.loanLinkData1 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.loanLinkData, {
                            keyAttributes: "extFacilityId"
                        }));
                    }

                    self.facilityFlag(true);

                } else {
                    self.noFacilityFlag(true);
                }
            });
        };

        if (self.path().payload.liability.facilitiesLinkage().length) {
            self.currentItem = 0;
        } else {
            self.currentItem = self.path().payload.liability.facilitiesLinkage().length;
        }

        self.facilityLink = function (data) {
            const inputValues = {
                utilizationOrder: self.path().payload.liability.facilitiesLinkage()[0] ? self.path().payload.liability.facilitiesLinkage()[0].utilizationOrder() : ko.observable(),
                linkagePercent: self.path().payload.liability.facilitiesLinkage()[0] ? self.path().payload.liability.facilitiesLinkage()[0].linkagePercent() : ko.observable(),
                flag: ko.observable(false)
            };

            self.tempData = [];
            self.tempData.extFacilityId = data.lineCode + "_" + data.lineSerialNumber;
            self.tempData.limitAmountAmount = data.limitAmount.amount;
            self.tempData.limitAmountAmountCurr = data.limitAmount.currency;
            self.tempData.availableAmountAmount = data.availableAmount.amount;
            self.tempData.availableAmountAmountCurr = data.availableAmount.currency;
            self.tempData.categoryDesc = data.description;
            self.tempData.utilizationOrder = inputValues.utilizationOrder;
            self.tempData.linkagePercent = inputValues.linkagePercent;
            self.tempData.flag = inputValues.flag;

            self.loanLinkData.push(self.tempData);
            self.backupLinkData.push(self.tempData);

            if (data.childFacilities) {

                self.tempArray = data.childFacilities;

                for (let i = 0; i < self.tempArray.length; i++) {

                    self.facilityLink(self.tempArray[i]);
                }
            }
        };

        if (!self.review) {
            self.loanLinkData1 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.loanLinkData, {
                keyAttributes: "extFacilityId"
            }));
        }

        self.selectedCards = function () {
            self.selectedFlag(true);
            self.allFlag(false);
            self.loanLinkData.removeAll();

            for (let i = 0; i < self.path().payload.liability.facilitiesLinkage().length; i++) {
                for (let j = 0; j < self.backupLinkData().length; j++) {
                    if ((typeof self.path().payload.liability.facilitiesLinkage()[i].extFacilityId=== "function" ? self.path().payload.liability.facilitiesLinkage()[i].extFacilityId() : self.path().payload.liability.facilitiesLinkage()[i].extFacilityId) === self.backupLinkData()[j].extFacilityId) {
                        self.loanLinkData.push(self.backupLinkData()[j]);
                    }
                }
            }
        };

        self.allCards = function () {
            self.allFlag(true);
            self.selectedFlag(false);
            self.loanLinkData(self.backupLinkData().slice(0));
        };

        self.valueChangeTest = function (event) {
            const extFacilityId = event.detail.value[0][0],
                data = [];

            for (let i = 0; i < self.loanLinkData1.dataSource.data().length; i++) {
                if (self.loanLinkData1.dataSource.data()[i].extFacilityId === extFacilityId) {
                    data.extFacilityId = extFacilityId;
                    data.limitAmountAmount = self.loanLinkData1.dataSource.data()[i].limitAmountAmount;
                    data.limitAmountAmountCurr = self.loanLinkData1.dataSource.data()[i].limitAmountAmountCurr;
                    data.availableAmountAmount = self.loanLinkData1.dataSource.data()[i].availableAmountAmount;
                    data.availableAmountAmountCurr = self.loanLinkData1.dataSource.data()[i].availableAmountAmountCurr;
                    data.categoryDesc = self.loanLinkData1.dataSource.data()[i].categoryDesc;
                    data.utilizationOrder = self.loanLinkData1.dataSource.data()[i].utilizationOrder;
                    data.linkagePercent = self.loanLinkData1.dataSource.data()[i].linkagePercent;
                    data.flag = self.loanLinkData1.dataSource.data()[i].flag;
                    break;
                }
            }

            if (data.flag()) {

                for (let i = 0; i < self.path().payload.liability.facilitiesLinkage().length; i++) {
                    if (self.path().payload.liability.facilitiesLinkage()[i].extFacilityId === data.extFacilityId) {
                        self.path().payload.liability.facilitiesLinkage.splice(i, 1);
                    }
                }

                for (let i = 0; i < self.path().payload.liability.facilitiesLinkage().length; i++) {
                    if (data.utilizationOrder() < self.path().payload.liability.facilitiesLinkage()[i].utilizationOrder()) {
                        let temp = self.path().payload.liability.facilitiesLinkage()[i].utilizationOrder();

                        temp -= 1;
                        self.path().payload.liability.facilitiesLinkage()[i].utilizationOrder(temp);
                    }
                }

                self.currentItem -= 1;
                data.utilizationOrder("");
                data.linkagePercent("");
                data.flag(false);
            } else {
                self.currentItem += 1;
                data.utilizationOrder(self.currentItem);
                data.linkagePercent(100);

                const facilitiesLinkage = getNewModel().facilitiesLinkage;

                facilitiesLinkage.extFacilityId = data.extFacilityId;
                facilitiesLinkage.linkagePercent = data.linkagePercent;
                facilitiesLinkage.utilizationOrder = data.utilizationOrder;
                self.path().payload.liability.facilitiesLinkage.push(facilitiesLinkage);
                data.flag(true);
            }
        };

        self.textBox = function (flag) {
            if (flag) {
                flag.stopPropagation();
            }
        };
    };
});