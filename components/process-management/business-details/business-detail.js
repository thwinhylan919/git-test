define([

    "knockout",

    "./model",
    "ojL10n!resources/nls/business-detail",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojbutton"
], function (ko, BusinessActivityModel, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this,
            getNewModel = function () {
                const KoModel = ko.mapping.fromJS(BusinessActivityModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.review = params.review;
        self.turnoverccyArray = ko.observableArray();
        self.code = ko.observable();
        params.baseModel.registerElement("amount-input");
        self.businessNatureLoaded = ko.observable(false);
        self.isCurrencyLoaded = ko.observable(false);
        self.businessNature = ko.observableArray();
        self.businessName = ko.observable();
        self.path = params.rootModel.productData;

        if (params.rootModel.productData().payload.businessActivity === undefined) {
            self.businessActivity = getNewModel().businessActivity;
            self.yearWiseDetails = getNewModel().yearWiseDetails;
            params.rootModel.productData().payload.businessActivity = self.businessActivity;
            params.rootModel.productData().payload.businessActivity.yearWiseDetails.push(self.yearWiseDetails);
            self.year = params.baseModel.getDate().getFullYear();
            self.path().payload.businessActivity.yearWiseDetails()[0].year = self.year;
        }

        BusinessActivityModel.businessNatureList().then(function (data) {
            for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.businessNature.push(data.enumRepresentations[0].data[i]);
            }

            if (self.review) {
                self.businessDescription();
            }

            self.businessNatureLoaded(true);
        });

        params.rootModel.successHandler = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            return new Promise(function (resolve) {
                resolve();
            });
        };

        BusinessActivityModel.allCurrencyType().then(function (data) {
            for (let i = 0; i < data.currencyList.length; i++) {
                self.turnoverccyArray.push({
                    code: data.currencyList[i].code
                });

            }

            self.isCurrencyLoaded(true);
        });

        self.businessDescription = function () {
            for (let i = 0; i < self.businessNature().length; i++) {
                if (self.path().payload.businessActivity.businessNature() === self.businessNature()[i].code) {
                    self.businessName(self.businessNature()[i].description);
                }
            }
        };

    };
});