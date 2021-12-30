define([
    "ojL10n!resources/nls/add-collateral",
    "knockout",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojmenu"
], function(resourceBundle, ko, AddCollateralModel) {
    "use strict";

    return function(params) {
        const self = this;

        self.nls = resourceBundle;
        self.isCurrencyLoaded = ko.observable(false);
        self.currencyListOptions = ko.observableArray([]);
        self.collateralTypeListOptions = ko.observableArray([]);
        self.areTypesLoaded = ko.observable(false);

        self.collateralPayload = {
            collateralType: ko.observable(""),
            collateralValue: {
                amount: ko.observable(""),
                currency: ko.observable("")
            },
            purpose: ko.observable(""),
            collateralDesc: ko.observable(""),
            remarks: ko.observable("")
        };

        AddCollateralModel.fetchCurrency().then(function(data) {
            for (let i = 0; i < data.currencyList.length; i++) {
                self.currencyListOptions.push({
                    value: data.currencyList[i].code
                });

            }

            self.isCurrencyLoaded(true);
        });

        AddCollateralModel.fetchCollateralTypes().then(function(data) {
            for (let i = 0; i < data.collateralTypes.length; i++) {
                self.collateralTypeListOptions.push({
                    label: data.collateralTypes[i].description,
                    value: data.collateralTypes[i].code
                });

            }

            self.areTypesLoaded(true);
        });

        ko.utils.extend(self, params.rootModel);

        if (self.mode && self.mode.mode() === "edit") {
            self.collateralPayload = {
                collateralType: self.data.collateralType,
                collateralValue: {
                    amount: self.data.collateralValue.amount,
                    currency: self.data.collateralValue.currency
                },
                purpose: self.data.purpose,
                collateralDesc: self.data.collateralDesc,
                remarks: self.data.remarks
            };

        }

        self.onClickAdd77 = function(event, data) {

            const tracker = document.getElementById("addCollateralTracker");

            if (tracker.valid === "valid") {
                self.newCollateralsArray.push(self.collateralPayload);
                self.newcollateralListDataLoaded(true);

                params.closeHandler();
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }

        };

        self.onClickEdit77 = function(event, data) {
            params.closeHandler();
        };
    };
});