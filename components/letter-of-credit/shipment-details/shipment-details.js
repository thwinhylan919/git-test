define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/shipment-details",
    "ojL10n!resources/nls/trade-finance-errors",
    "ojL10n!resources/nls/trade-finance-common",
    "./model"
], function (oj, ko, resourceBundle, resourceBundleError, tradeFinanceCommon, ShipimentDetailsModel) {
    "use strict";

    let self;
    const vm = function (params) {
        self = this;

        ko.utils.extend(self, params.rootModel);
        self.stageIndex = params.index;
        self.goodsDescription = ko.observable();
        self.nls = resourceBundle;
        self.errorNls = resourceBundleError;
        self.tradeFinanceCommonNls = tradeFinanceCommon;
        self.partialShipmentOptionsArray = ko.observableArray();
        self.transShipmentOptionsArray = ko.observableArray();
        self.duplicatesEntered = ko.observable(false);
        self.modetypeLoaded = ko.observable(false);

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

            if ((self.goodsArray().length + 1) <= 5) {

                self.goodsArray.push({
                    id: ko.observable(self.goodsArray().length + 1),
                    code: ko.observable(""),
                    description: ko.observable(""),
                    units: ko.observable(""),
                    pricePerUnit: ko.observable("")
                });
            } else {
                params.baseModel.showMessages(null, [self.nls.labels.maxGoodLimit], "ERROR");
            }
        };

        function findIndexInData(data, value) {
            for (let i = 0; i < data.length; i++) {
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

                    for (let i = 0; i < self.goodsArray().length; i++) {
                        if (selectedgoodsCodeArray[0].value === self.goodsArray()[i].code()) {
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

                self.goodsArray()[data].code(selectedgoodsValue);

            } else if (self.letterOfCreditDetails.shipmentDetails.goodsCode() !== selectedgoodsCodeArray[0].value) {
                self.letterOfCreditDetails.shipmentDetails.goodsCode(selectedgoodsCodeArray[0].value);
                self.letterOfCreditDetails.shipmentDetails.description(selectedgoodsCodeArray[0].description);
            }
        };

        self.shipmentRasioBtnSubscribe = self.shipmentDatePeriodRadioSetValue.subscribe(function (newValue) {
            if (newValue === "latestdateofShipment") {
                self.letterOfCreditDetails.shipmentDetails.period(null);
            } else if (newValue === "latestperiodofShipment") {
                self.letterOfCreditDetails.shipmentDetails.date(null);
            }
        });

        if (self.transactionType === "SHIPPING_GUARANTEE") {
            ShipimentDetailsModel.fetchtransportationModes().done(function (data) {
                if (data.enumRepresentations) {
                    for (let j = 0; j < data.enumRepresentations[0].data.length; j++) {
                        self.transportationModes.push({
                            label: data.enumRepresentations[0].data[j].description,
                            value: data.enumRepresentations[0].data[j].code
                        });
                    }
                }

                self.modetypeLoaded(true);

            });
        }
    };

    vm.prototype.dispose = function () {
        this.shipmentRasioBtnSubscribe.dispose();
    };

    return vm;
});