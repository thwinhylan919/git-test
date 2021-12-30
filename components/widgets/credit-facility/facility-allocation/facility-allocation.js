define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/credit-facility",
    "./model",
    "ojs/ojchart",
    "ojs/ojtable",
    "ojs/ojarraydataprovider",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojprogress",
    "ojs/ojconveyorbelt",
    "ojs/ojlistview"

], function (oj, ko, resourceBundle, model) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.baseModel);

        const pieGroups = [""];

        self.show = ko.observable(false);
        self.pieSeriesValue = ko.observableArray();
        self.pieGroupsValue = ko.observableArray(pieGroups);
        self.innerRadius = ko.observable(0.95);
        self.selectedFacilityType = ko.observable();
        self.facilityTableArr = ko.observableArray();
        self.currencyView = ko.observable("FC");
        self.facilityTypeArray = [];
        self.datasource=ko.observable();
        rootParams.baseModel.registerComponent("facility-details", "credit-facility");

        self.showFacilityDetails = function (data) {
            const parameters = {
                directedThorughFacility: true,
                facilityId: data.lineCode + "_" + data.lineSerialNumber
            };

            rootParams.dashboard.loadComponent("facility-details", parameters);

        };

        function calucaulteUtilizedPercentage() {
            self.categoryMainLineMap.forEach((value, key) => {

                let categoryWiseAmount = 0;
                const obj = {};

                obj.facilityType = key;

                value.forEach(mainline => {
                    categoryWiseAmount = categoryWiseAmount + mainline.effectiveAmountInBaseCurr.amount;
                });

                obj.utilizedPercentage = Math.round(((categoryWiseAmount / self.sanctionedAmount) * 100) * 100) / 100;
                self.facilityTypeArray.push(obj);

                self.pieSeriesValue().push({
                    name: key,
                    items: [categoryWiseAmount]
                });

            });
        }

        self.calculateProgress = function (data1) {
                return data1.effectiveAmount.amount ? Math.round(((data1.utilizedAmount.amount / data1.effectiveAmount.amount) * 100) * 100) / 100 : 0;
            };

        model.fetchLiabilityId().done(function (data1) {
            model.fetchFacilityList(data1.liabilitydtos[0].id, data1.liabilitydtos[0].branch, data1.liabilitydtos[0].partyId, "INR").then(function (data) {
                self.sanctionedAmount = 0;
                self.categoryMainLineMap = new Map();

                if (data && data.facilitydtos) {
                    self.mainlines = data.facilitydtos;

                    data.facilitydtos.forEach(element => {
                        if (self.categoryMainLineMap.get(element.categoryDesc)) {
                            self.categoryMainLineMap.get(element.categoryDesc).push(element);
                        } else {
                            const facilityArray = [];

                            facilityArray.push(element);
                            self.categoryMainLineMap.set(element.categoryDesc, facilityArray);
                        }

                        element.utilizedAmt = element.utilizedAmount.amount;
                        element.availableAmt=element.availableAmount.amount;
                        element.sanctionedAmt=element.effectiveAmount.amount;

                        self.currency=element.availableAmount.currency;
                        self.baseCurrency = element.effectiveAmountInBaseCurr.currency;
                        self.localCurrency=element.effectiveAmountInBaseCurr.currency;

                        self.sanctionedAmount = self.sanctionedAmount + element.effectiveAmountInBaseCurr.amount;
                        element.utilizedPer=self.calculateProgress(element);
                    });

                    calucaulteUtilizedPercentage();

                    self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.facilityTableArr, {
                        idAttribute: "key"
                      })));

                    self.show(true);
                    self.selectedFacilityType(self.mainlines[0].categoryDesc);
                }
            });
        });

        function getFacilities(data, facilityArray) {
            data.forEach(element => {
                element.key = element.lineCode + "_" + element.lineSerialNumber;
                facilityArray.push(element);

                if (element.childFacilities) {
                    getFacilities(element.childFacilities, facilityArray);
                }
            });

            return facilityArray;
        }

        self.centerCallback = function (dataContext) {
            const centerLabel = document.createElement("div");

  centerLabel.innerHTML =
                "<div style=\"position:absolute;text-align:center;padding-top:7%;\">" +
                "<div class=\"center;\">" +
                self.nls.sanctionedAmount + "</div>" +
                "<div>" +
                self.formatCurrency(self.sanctionedAmount, self.baseCurrency) + "*</div>" +
                "</div>";

            const outerDiv = centerLabel.children[0],
                innerBounds = dataContext.innerBounds;

            outerDiv.style.top = innerBounds.y + "px";
            outerDiv.style.left = innerBounds.x + "px";
            outerDiv.style.height = innerBounds.height + "px";
            outerDiv.style.width = innerBounds.width + "px";

            return { insert: centerLabel };
        };

        self.selectedFacilityType.subscribe(function (newValue) {
            self.facilityTableArr.removeAll();

            self.categoryMainLineMap.get(newValue).forEach(mainline => {
                mainline.key = mainline.lineCode + "_" + mainline.lineSerialNumber;
                self.facilityTableArr.push(mainline);

                if (mainline.childFacilities) {
                    getFacilities(mainline.childFacilities, []).forEach(childLine => {
                        self.facilityTableArr.push(childLine);
                    });
                }
            });

            self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.facilityTableArr, {
                idAttribute: "key"
              })));

        });
    };
});