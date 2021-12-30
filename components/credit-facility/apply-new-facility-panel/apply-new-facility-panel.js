define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/facility-application",
    "./model",
    "ojs/ojbutton",
    "ojs/ojnavigationlist",
    "ojs/ojvalidationgroup",
    "ojs/ojformlayout",
    "ojs/ojarraytabledatasource"

], function(oj, ko, $, resourceBundle, AddFacilityModel) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);

        const todayDate = params.baseModel.getDate();

        self.nls = resourceBundle;
        self.monthListOptions = ko.observableArray();
        self.isCurrencyLoaded = ko.observable(false);
        self.currencyListOptions = ko.observableArray([]);
        self.facilityTypeListOptions = ko.observableArray([]);
        self.areTypesLoaded = ko.observable(false);
        self.monthsValue = ko.observable();
        self.yearsValue = ko.observable();
        self.facilityTypeSelected = ko.observable("");

        self.facilityPayload = {
            availableAmount: {
                amount: ko.observable(""),
                currency: ko.observable("")
            },
            lineStartDate: ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(todayDate))),
            expiryDate: ko.observable(""),
            categoryDesc: ko.observable(""),
            category: ko.observable(""),
            description: ko.observable(""),
            instructions: ko.observable(""),
            childFacilities: ko.observableArray([])
        };

        if (self.mode.mode() === "editDetails") {
            const one_day = 1000 * 60 * 60 * 24,
                diff = (new Date(self.payload.expiryDate())).getTime() - (new Date(self.payload.lineStartDate())).getTime(),

                days = Math.floor(diff / one_day);

            self.monthsValue(Math.floor((days % 365) / 30));
            self.yearsValue(Math.floor(days / 365));

            self.facilityPayload = {
                availableAmount: {
                    amount: self.payload.availableAmount.amount,
                    currency: self.payload.availableAmount.currency
                },
                lineStartDate: self.payload.lineStartDate,
                expiryDate: self.payload.expiryDate,
                categoryDesc: self.payload.categoryDesc,
                category: self.payload.category,
                description: self.payload.description,
                instructions: self.payload.instructions,
                childFacilities: self.payload.childFacilities
            };

            self.facilityTypeSelected(self.payload.category());
            self.productData().amount = self.productData().payload.availableAmount.amount();
            self.productData().currency = self.productData().payload.availableAmount.currency();

        }

        if (self.mode.mode() === "editFacility") {
            const one_day = 1000 * 60 * 60 * 24,
                diff = (new Date(self.data.expiryDate())).getTime() - (new Date(self.data.lineStartDate())).getTime(),

                days = Math.floor(diff / one_day);

            self.monthsValue(Math.floor((days % 365) / 30));
            self.yearsValue(Math.floor(days / 365));

            self.facilityPayload = {
                availableAmount: {
                    amount: self.data.availableAmount.amount,
                    currency: self.data.availableAmount.currency
                },
                lineStartDate: self.data.lineStartDate,
                expiryDate: self.data.expiryDate,
                categoryDesc: self.data.categoryDesc,
                category: self.data.categoryDesc,
                description: self.data.description,
                instructions: self.data.instructions,
                childFacilities: self.data.childFacilities
            };

            self.facilityTypeSelected(self.data.category());

        }

        self.addUpdateButton = function() {
            if (self.mode.mode() === "addNew") {

                self.productData().payload = self.facilityPayload;

                self.flag.addFacilityFlag(true);
                self.productData().data.amount = self.productData().payload.availableAmount.amount();
                self.productData().data.currency = self.productData().payload.availableAmount.currency();
            } else if (self.mode.mode() === "addSubFacilityMain") {
                self.productData().payload.childFacilities.push(self.facilityPayload);
                self.datasource = new oj.ArrayTableDataSource(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });
                self.flag.addSubFacilityFlag(true);

            } else if (self.mode.mode() === "addSubFacility") {
                self.data.childFacilities.push(self.facilityPayload);
                self.datasource = new oj.ArrayTableDataSource(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });
                self.datasourceNew = new oj.ArrayTableDataSource(self.data.childFacilities, { idAttribute: "categoryDesc" });

            }

            self.facilityPayload.expiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(todayDate.setMonth(todayDate.getMonth() + (12 * ~~self.yearsValue()) + ~~self.monthsValue()))));

            params.closeHandler();
        };

        AddFacilityModel.fetchCurrency().then(function(data) {
            for (let i = 0; i < data.currencyList.length; i++) {
                self.currencyListOptions.push({
                    value: data.currencyList[i].code
                });

            }

            self.isCurrencyLoaded(true);
        });

        function setFacilityCategories(category) {
            if (category) {
                self.facilityTypeListOptions.push({
                    label: category.description,
                    value: category.description,
                    type: category.facilityType
                });

                if (category.subCategories && category.subCategories.length) {
                    for (let i = 0; i < category.subCategories.length; i++) {
                        setFacilityCategories(category.subCategories[i]);
                    }
                }
            }
        }

        AddFacilityModel.fetchFacilityTypes().then(function(data) {
            if (data && data.facilityCategory) {
                setFacilityCategories(data.facilityCategory);
            }

            self.areTypesLoaded(true);
        });

        self.addUpdateButtonValidate = function() {
            const tracker = document.getElementById("applyNewFacilityTracker");

            if (tracker.valid === "valid") {
                self.addUpdateButton();
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };

        self.requestTypeChangedHandler = function(event) {
            for (let j = 0; j < self.facilityTypeListOptions().length; j++) {
                if (self.facilityTypeListOptions()[j].value === self.facilityTypeSelected()) {
                    self.facilityPayload.categoryDesc(self.facilityTypeListOptions()[j].type);
                    self.facilityPayload.category(self.facilityTypeListOptions()[j].value);
                }
            }
        };

        self.callBack = function(id) {
            $("#" + id).keypress(function(event) {
                const charCode = event.which ? event.which : event.keyCode,
                    char = String.fromCharCode(charCode),
                    replacedValue = char.replace(/[^0-9\.]/g, "");

                if (char !== replacedValue) {
                    return false;
                }

                return true;
            });
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
            },
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

    };
});