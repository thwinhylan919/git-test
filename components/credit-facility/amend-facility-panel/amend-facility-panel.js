define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/facility-application",
    "./model",
    "ojs/ojbutton",
    "ojs/ojnavigationlist",
    "ojs/ojvalidationgroup",
    "ojs/ojformlayout"
], function (oj, ko, resourceBundle,AmendFacilityModel) {
    "use strict";

    return function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);

        self.nls = resourceBundle;
        self.currencyListOptions = ko.observableArray([]);
        self.monthListOptions = ko.observableArray();
        self.isCurrencyLoaded=ko.observable(false);

        self.monthsValue = ko.observable();
        self.yearsValue = ko.observable();

        params.baseModel.registerElement("nav-bar");

        const one_day=1000*60*60*24,
        diff=(new Date(self.data.expiryDate)).getTime()-(new Date(self.data.lineStartDate)).getTime(),

        days= Math.floor(diff/one_day);

        self.monthsValue(Math.floor((days%365)/30));
        self.yearsValue(Math.floor(days/365));

        self.setUpdateFlag = function () {
            self.facilityPayload.expiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date((new Date(self.data.lineStartDate)).setMonth((new Date(self.data.lineStartDate)).getMonth() + (12 * self.yearsValue()) + self.monthsValue()))));

            if(self.data.effectiveAmount.amount!==self.facilityPayload.availableAmount.amount() || self.data.availableAmountInBaseCurr.currency!==self.facilityPayload.availableAmount.currency())
            {self.updateAmountFlag(true);}

            if(self.data.expiryDate!==self.facilityPayload.expiryDate())
            {self.updateDateFlag(true);}

            if(self.facilityPayload.instructions!==self.payload.instructions()){
                self.updateBankInstructionsFlag(true);
            }

            self.payload=self.facilityPayload;
            params.closeHandler();

        };

        self.productData.data.amount = self.productData.payload.availableAmount.amount();
        self.productData.data.currency = self.productData.payload.availableAmount.currency();

        self.requestTypeChangedHandler = function (event) {
            self.facilityPayload.categoryDesc(self.facilityTypeSelected().type);
            self.facilityPayload.category(self.facilityTypeSelected().value);
        };

        self.monthListOptions = [{
            label: "1",
            value: 1
        },
        {
            label: "2",
            value: 2
        },
        {
            label: "3",
            value: 3
        },
        {
            label: "4",
            value: 4
        },
        {
            label: "5",
            value: 5
        },
        {
            label: "6",
            value: 6
        }
            ,
        {
            label: "7",
            value: 7
        },
        {
            label: "8",
            value: 8
        },
        {
            label: "9",
            value: 9
        },
        {
            label: "10",
            value: 10
        },
        {
            label: "11",
            value: 11
        }
        ];

        AmendFacilityModel.fetchCurrency().then(function (data) {
            for (let i = 0; i < data.currencyList.length; i++) {
                self.currencyListOptions.push({
                    value: data.currencyList[i].code
                });

            }

            self.isCurrencyLoaded(true);
        });

        self.addUpdateButtonValidate = function () {
            const tracker = document.getElementById("amendTracker");

            if (tracker.valid === "valid") {
                self.setUpdateFlag();
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };

    };
});
