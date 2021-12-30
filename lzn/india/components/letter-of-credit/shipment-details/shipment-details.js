define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/shipment-details",
    "ojL10n!resources/nls/trade-finance-errors",
    "ojL10n!resources/nls/trade-finance-common"
], function (oj, ko, ShipmentDetailsModel, resourceBundle, resourceBundleError, tradeFinanceCommon) {
    "use strict";

    let self;
    const vm = function (params) {
        self = this;

        let i;

        ko.utils.extend(self, params.rootModel);
        self.stageIndex = params.index;
        self.goodsDescription = ko.observable();
        self.nls = resourceBundle;
        self.errorNls = resourceBundleError;
        self.tradeFinanceCommonNls = tradeFinanceCommon;
        self.partialShipmentOptionsArray = ko.observableArray();
        self.transShipmentOptionsArray = ko.observableArray();
        self.branchDate = ko.observable();
        self.currencyListOptions = ko.observable();
        self.duplicatesEntered = ko.observable(false);
        self.licenseLoaded = self.goodsArray()[0].underLicense() === true ? ko.observable(true) : ko.observable(false);

        function fetchCurrency() {
            ShipmentDetailsModel.fetchCurrency().done(function (currencyData) {
                const currency = currencyData.currencyList.map(function (currencyData) {
                    return {
                        value: currencyData.code,
                        label: currencyData.code
                    };
                });

                self.currencyListOptions(currency);
            });
        }

        fetchCurrency();

        self.addLicense = function (data) {
            self.licenseLoaded(false);

            data.licenseDetails.push({
                id: ko.observable(data.licenseDetails().length + 1),
                licenseNumber: ko.observable(""),
                type: ko.observable(""),
                currency: ko.observable(""),
                amount: ko.observable(""),
                balance: ko.observable(""),
                issueDate: ko.observable(""),
                expiryDate: ko.observable("")
            });

            self.licenseLoaded(true);
        };

        self.removeLicense = function (parentData, data) {
            self.licenseLoaded(false);

            const licenseData = parentData.licenseDetails().filter(function (license) {
                return license.id() !== data.id();
            });

            parentData.licenseDetails(licenseData);
            self.licenseLoaded(true);
        };

        self.partialShipmentOptionsArray = ko.observable([
            {
                label: self.resourceBundle.common.labels.allowed,
                value: "Y"
            },
            {
                label: self.resourceBundle.common.labels.notAllowed,
                value: "N"
            },
            {
                label: self.nls.labels.conditional,
                value: "C"
            }
        ]);

        self.transShipmentOptionsArray = ko.observable([
            {
                label: self.resourceBundle.common.labels.allowed,
                value: "Y"
            },
            {
                label: self.resourceBundle.common.labels.notAllowed,
                value: "N"
            },
            {
                label: self.nls.labels.conditional,
                value: "C"
            }
        ]);

        if (self.mode() === "EDIT") {
            if (self.letterOfCreditDetails.shipmentDetails.goodsCode() !== null) {
                self.goodsDescription(self.letterOfCreditDetails.shipmentDetails.goodsCode());
            }

            if (self.letterOfCreditDetails.shipmentDetails.date() && self.letterOfCreditDetails.shipmentDetails.date() !== null) {
                self.shipmentDatePeriodRadioSetValue("latestdateofShipment");
            } else if (self.letterOfCreditDetails.shipmentDetails.period() && self.letterOfCreditDetails.shipmentDetails.period() !== null) {
                self.shipmentDatePeriodRadioSetValue("latestperiodofShipment");
            }
        }

        self.continueFunc = function () {
            const tracker = document.getElementById("shipmentTracker");

            if (tracker.valid === "valid") {
                self.stages[self.stageIndex()].expanded(false);
                self.stages[self.stageIndex()].validated(true);
                self.stages[self.stageIndex() + 1].expanded(true);
            } else {
                self.stages[self.stageIndex()].validated(false);
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };

        self.addGoods = function () {
            //Maximum 5 goods rows can be added
            const licenseArray = ko.observableArray([]);

            licenseArray.push({
                id: ko.observable(1),
                licenseNumber: ko.observable(""),
                type: ko.observable(""),
                currency: ko.observable(""),
                amount: ko.observable("0"),
                balance: ko.observable("0"),
                issueDate: ko.observable(""),
                expiryDate: ko.observable("")
            });

            if ((self.goodsArray().length + 1) <= 5) {
                if (self.transactionType !== "SHIPPING_GUARANTEE") {
                    self.goodsArray.push({
                        id: ko.observable(self.goodsArray().length + 1),
                        code: ko.observable(""),
                        description: ko.observable(""),
                        units: ko.observable(""),
                        pricePerUnit: ko.observable(""),
                        licenseDetails: licenseArray,
                        underLicense: ko.observable(true),
                        datasourceForLicense: ko.observable(new oj.ArrayTableDataSource(licenseArray, { idAttribute: "id" }))
                    });
                } else {
                    self.goodsArray.push({
                        srNo: ko.observable(self.goodsArray().length + 1),
                        id: ko.observable(""),
                        description: ko.observable(""),
                        units: ko.observable(""),
                        pricePerUnit: ko.observable("")
                    });
                }
            } else {
                params.baseModel.showMessages(null, [self.nls.labels.maxGoodLimit], "ERROR");
            }
        };

        function findIndexInData(data, value) {
            for (i = 0; i < data.length; i++) {
                if (data[i].id() === value) {
                    return i;
                }
            }

            return -1;
        }

        self.remove = function (data) {
            const index = findIndexInData(self.goodsArray(), data.id());

            self.goodsArray.splice(index, 1);
        };

        self.validateGoodsAmount = {
            validate: function (value) {
                if (value) {
                    if (value <= 0) {
                        throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.invalidAmountErrorMessage);
                    }

                    const numberfractional1 = value.toString().split(".");

                    if (numberfractional1[0] && (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0]))) {
                        throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
                    }

                    if (numberfractional1[1]) {
                        if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
                            throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
                        }
                    }
                }

                return true;
            }
        };

        self.goodsTypeHandler = function (data, event) {
            let selectedgoodsValue;

            self.licenseLoaded(false);

            if (event.detail && event.detail.value) {
                //This will handle case of entity 14
                selectedgoodsValue = event.detail.value;
            } else if (data.detail && data.detail.value) {
                //This will handle case of entity 12.0
                selectedgoodsValue = data.detail.value;
            }

            const selectedgoodsCodeArray = self.goodsTypeOptions().filter(function (data) {
                return data.value === selectedgoodsValue;
            });

            if (self.multiGoodsSupported()) {
                if (self.goodsArray()) {

                    for (i = 0; i < self.goodsArray().length; i++) {
                        if ((self.transactionType !== "SHIPPING_GUARANTEE" && (selectedgoodsCodeArray[0].value === self.goodsArray()[i].code())) || (self.transactionType === "SHIPPING_GUARANTEE" && (selectedgoodsCodeArray[0].value === self.goodsArray()[i].id()))) {
                            const s = [];

                            s.push(self.nls.labels.duplicateError);
                            params.baseModel.showMessages(null, s, "ERROR");
                            self.duplicatesEntered(true);

                            return;
                        }

                        self.duplicatesEntered(false);

                    }
                }

                self.goodsArray()[data].description(selectedgoodsCodeArray[0].description);
                self.goodsArray.removeAll();

                self.goodsArray = ko.observableArray([{
                    id: ko.observable(1),
                    code: ko.observable(""),
                    description: ko.observable(""),
                    units: ko.observable(""),
                    pricePerUnit: ko.observable(""),
                    licenseDetails: ko.observableArray([]),
                    underLicense: ko.observable(),
                    datasourceForLicense: ko.observable()
                }]);

                const licenseArray = ko.observableArray([]);

                licenseArray.push({
                    id: ko.observable(1),
                    licenseNumber: ko.observable(""),
                    type: ko.observable(""),
                    currency: ko.observable(""),
                    amount: ko.observable(""),
                    balance: ko.observable(""),
                    issueDate: ko.observable(""),
                    expiryDate: ko.observable("")
                });

                if (self.transactionType !== "SHIPPING_GUARANTEE") {
                    self.goodsArray()[data].code(selectedgoodsValue);
                } else {
                    self.goodsArray()[0].licenseDetails = licenseArray;
                    self.goodsArray()[0].datasourceForLicense(new oj.ArrayTableDataSource(licenseArray, { idAttribute: "id" }));
                    self.goodsArray()[0].description(selectedgoodsCodeArray[0].description);
                    self.goodsArray()[data].id(selectedgoodsValue);
                    self.licenseLoaded(true);

                }
            } else if (self.letterOfCreditDetails.shipmentDetails.goodsCode() !== selectedgoodsCodeArray[0].value) {
                self.letterOfCreditDetails.shipmentDetails.goodsCode(selectedgoodsCodeArray[0].value);
                self.letterOfCreditDetails.shipmentDetails.description(selectedgoodsCodeArray[0].description);

                if (selectedgoodsCodeArray[0].underLicense === false) {
                    self.goodsArray()[0].licenseDetails.removeAll();
                    self.goodsArray()[0].underLicense(false);
                    self.licenseLoaded(false);
                }
                else {
                    self.goodsArray()[0].licenseDetails.removeAll();

                    self.goodsArray()[0].licenseDetails.push({
                        id: ko.observable(1),
                        licenseNumber: ko.observable(""),
                        type: ko.observable(""),
                        currency: ko.observable(""),
                        amount: ko.observable(""),
                        balance: ko.observable(""),
                        issueDate: ko.observable(""),
                        expiryDate: ko.observable("")
                    });

                    self.goodsArray()[0].datasourceForLicense(new oj.ArrayTableDataSource(self.goodsArray()[0].licenseDetails, { idAttribute: "id" }));
                    self.goodsArray()[0].underLicense(true);
                    self.licenseLoaded(true);
                }
            }
        };

        self.shipmentRasioBtnSubscribe = self.shipmentDatePeriodRadioSetValue.subscribe(function (newValue) {
            if (newValue === "latestdateofShipment") {
                self.letterOfCreditDetails.shipmentDetails.period(null);
            } else if (newValue === "latestperiodofShipment") {
                self.letterOfCreditDetails.shipmentDetails.date(null);
            }
        });
    };

    vm.prototype.dispose = function () {
        this.shipmentRasioBtnSubscribe.dispose();
    };

    return vm;
});
