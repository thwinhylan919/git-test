define([
    "./model",
    "knockout",
    "ojs/ojcore"
], function (Model, ko, oj) {
    "use strict";

    return function () {
        let self,
         params;

                function creditFacilitiescollateralTypesgetCall() {
            return Model.creditFacilitiescollateralTypesget();
        }

                function Isinsuranceavailableforthecollateral70ValueChangeHook(newValue) {
            if (newValue === "Yes") {
                self.insuranceDetails.push({ endDate: ko.observable() });
            } else if (newValue === "No") {
                self.insuranceDetails.splice(0, 1);
            }

            ko.tasks.runEarly();
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.review = params.review;
            self.collateralType = ko.observable();
            self.collateralDesc = ko.observable();

            self.collateralValue = {
                amount: ko.observable(),
                currency: ko.observable()
            };

            self.collateralTypeList = ko.observableArray([]);
            self.currencyCode = ko.observable();
            self.currencyList = ko.observableArray([]);
            self.insuranceDetails = ko.observableArray([]);
            self.startDate = ko.observable();
            self.remarks = ko.observable();
            self.minInsuranceExpiryDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(params.baseModel.getDate()));
            self.maxCollateralAvailableDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(params.baseModel.getDate().getTime() + 7776000000)));
            self.insuranceDetails.push({ endDate: ko.observable() });
            ko.utils.extend(self, ko.mapping.fromJS(ko.mapping.toJS(params.payload)));
            self.insuranceRadioFlag = ko.observable(self.insuranceDetails() && self.insuranceDetails().length ? "Yes" : "No");

            ko.utils.extend(params.payload, {
                collateralType: self.collateralType,
                collateralDesc: self.collateralDesc,
                collateralValue: self.collateralValue,
                currencyCode: self.currencyCode,
                insuranceDetails: self.insuranceDetails,
                startDate: self.startDate,
                remarks: self.remarks
            });

            if (params.review) {
                params.dashboard.headerName(self.nls.collaterEvaluationHeader);
            }

            self.currencyParser = function (data) {
                self.currencyList(data.currencyList);

                const output = {};

                output.currencies = [];

                if (data) {
                    if (data.currencyList && data.currencyList !== null) {
                        for (let i = 0; i < data.currencyList.length; i++) {
                            output.currencies.push({
                                code: data.currencyList[i].code,
                                description: data.currencyList[i].code
                            });
                        }
                    }
                }

                return output;
            };

            creditFacilitiescollateralTypesgetCall().then(function (response) {
                self.collateralTypeList(response.collateralTypes);
            });

            params.rootModel.successHandler = function () {
                return new Promise(function (resolve) {
                    if (params.baseModel.showComponentValidationErrors(document.getElementById("collateralEvaluationDetailsTracker"))) {
                        resolve();
                    }
                });
            };

            return true;
        }

        return {
            creditFacilitiescollateralTypesgetCall: creditFacilitiescollateralTypesgetCall,
            Isinsuranceavailableforthecollateral70ValueChangeHook: Isinsuranceavailableforthecollateral70ValueChangeHook,
            init: init
        };
    };
});