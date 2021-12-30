define([

    "knockout",

    "./model",
    "ojL10n!resources/nls/equipment-details",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton"
], function (ko, EquipmentDetailsModel, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this,
            getNewModel = function () {
                const KoModel = ko.mapping.fromJS(EquipmentDetailsModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.review = params.review;
        self.loanCurrencyCode = ko.observableArray();
        self.typeOfMachine = ko.observable();
        self.isCurrencyLoaded = ko.observable(false);
        params.baseModel.registerElement("amount-input");

        if (params.rootModel.productData().payload.equipmentDetails === undefined) {
            self.equipmentDetails = getNewModel().equipmentDetails;
            params.rootModel.productData().payload.equipmentDetails = self.equipmentDetails;
            self.path = params.rootModel.productData;
        } else {
            self.path = params.rootModel.productData;
        }

        self.machineryTypeList = [{
            typeOfMachine: "New"
        }, {
            typeOfMachine: "Used"
        }];

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

        params.rootModel.successHandler = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            return new Promise(function (resolve) {
                resolve();
            });
        };

    };
});