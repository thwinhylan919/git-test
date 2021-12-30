define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/spend-summary",
    "ojs/ojbutton",
    "ojs/ojselectcombobox",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview",
    "ojs/ojmenu", "ojs/ojoption",
    "ojs/ojchart", "ojs/ojlegend"
], function(oj, ko, SpendSummary, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;
        let i = 0;

        self.type = Params.data.data.type;
        self.resource = ResourceBundle;
        Params.baseModel.registerComponent("transaction-list", "personal-finance-management");
        self.validationTracker = ko.observable();
        self.refreshChart = ko.observable(false);
        self.innerRadius = ko.observable(0.8);
        self.pieSeriesValue = ko.observable();
        self.totalSpend = ko.observable();
        self.topSpends = ko.observable([]);
        self.viewSpends = ko.observable(false);
        self.centerLabel = ko.observable();
        self.selectedCategoryName = ko.observable(self.resource.spend.allcategories);
        self.selectedCategory = ko.observable();
        self.categoryList = ko.observableArray();
        self.selectedperiod = ko.observable("0");
        self.baseCurrency = ko.observable();
        self.selectedPeriodLabel = ko.observable(self.resource.filter.l30days);

        self.periodRanges = ko.observableArray([{
                label: self.resource.filter.thisMonth,
                value: "0"
            },
            {
                label: self.resource.filter.l30days,
                value: "30"
            },
            {
                label: self.resource.filter.l60days,
                value: "60"
            },
            {
                label: self.resource.filter.l90days,
                value: "90"
            }
        ]);

        const categoriesColorArray = [{
                color: "#FAC85A",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            },
            {
                color: "#14BA92",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            },
            {
                color: "#FF669E",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            },
            {
                color: "#53D3BA",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            },
            {
                color: "#006bad",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            },
            {
                color: "#E76363",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            },
            {
                color: "#3949AB",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            },
            {
                color: "#21a0a0",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            },
            {
                color: "#fdc42b",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            },
            {
                color: "#F16B40",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            },
            {
                color: "#EF7598",
                shades: [
                    "#993A48",
                    "#5EA82A",
                    "#D81B60",
                    "#53D3BA",
                    "#006bad",
                    "#E76363",
                    "#3949AB",
                    "#21a0a0",
                    "#fdc42b",
                    "#F16B40",
                    "#EF7598"
                ]
            }
        ];

        self.durationFilter = ko.observable();
        self.dateFilterResorce = "&fromDate={fyear}-{fmonth}-{fdate}&toDate={tyear}-{tmonth}-{tdate}";
        self.today = null;

        self.legendStyle = ko.observable({});

        function setDurationFilter(days) {
            const today = self.today,
                priorDate = new Date(new Date(self.today).setDate(today.getDate() - Number(days)));

            self.durationFilter(Params.baseModel.format(self.dateFilterResorce, {
                fyear: priorDate.getFullYear(),
                fmonth: priorDate.getMonth() + 1,
                fdate: priorDate.getDate(),
                tyear: today.getFullYear(),
                tmonth: today.getMonth() + 1,
                tdate: today.getDate()
            }));
        }

        self.periodChangeHandler = function(event) {
            const data = event.target.value;

            self.selectedPeriodLabel(data.label);
            setDurationFilter(data.value !== "0" ? data.value : self.today.getDate() - 1);
            self.showsub(self.selectedCategory()[0] !== "all" ? self.selectedCategory()[0] : undefined);
        };

        self.categoryDropdownChangeHandler = function(event) {
            const data = event.target.value,
                categoryId = data.id;

            if (categoryId && [
                    "null",
                    "undefined"
                ].indexOf(categoryId.split("_")[1]) < 0) {
                self.selectedCategory([categoryId]);
                self.showsub(categoryId !== "all" ? categoryId : undefined);
                self.selectedCategoryName(categoryId !== "all" ? self.categoryList()[parseInt(categoryId.split("_")[0])].name : self.resource.spend.allcategories);
            }
        };

        self.categoryChangeHandler = function(event) {
            if (event.detail.value) {
                const categoryId = event.detail.value.id;

                if (categoryId && categoryId.indexOf("_") > -1 && [
                        "null",
                        "undefined"
                    ].indexOf(categoryId.split("_")[1]) < 0) {
                    self.selectedCategory([categoryId]);
                    self.showsub(categoryId);
                    self.selectedCategoryName(event.detail.value.series);
                }
            }
        };

        self.resetDonut = function() {
            setDurationFilter(self.today.getDate() - 1);
            self.selectedCategoryName(self.resource.spend.allcategories);
            self.selectedPeriodLabel(self.resource.filter.l30days);
            self.selectedCategory(["all"]);
            self.selectedperiod("0");
            self.showsub();
        };

        self.legendDataSource = ko.observable();
        self.noSpendData = ko.observable(false);
        self.loadSubCategories = ko.observable(false);

        const categoryColorMap = {};

        function sortTxnByAmount(a, b) {
            if (b.totalSpent < a.totalSpent) { return -1; } else if (b.totalSpent > a.totalSpent) { return 1; }

            return 0;
        }

        self.legendArray = ko.observableArray([{
            items: []
        }]);

        function computeTopTwoSpends(data, categoryId) {
            data.sort(sortTxnByAmount);

            const loopCount = data.length < 2 ? data.length : 2;

            for (let i = 0; i < loopCount; i++) {
                const categoryName = !data[i].categoryId && !categoryId ? self.resource.spend.uncategorized : data[i].categoryName === "OTHER" ? self.resource.spend.other : data[i].categoryName;

                self.topSpends()[i] = {
                    CategoryName: categoryName,
                    amount: data[i].totalSpent,
                    currency: data[i].currency,
                    color: categoryColorMap[categoryName]
                };
            }
        }

        function setSpendAnalysis(data, pieSeries, categoryId) {
            self.refreshChart(false);
            self.noSpendData(false);
            self.topSpends([]);

            if (!categoryId) {
                self.loadSubCategories(false);

                self.categoryList([{
                    name: self.resource.spend.allcategories,
                    id: "all"
                }]);
            } else {
                self.loadSubCategories(true);
            }

            if (data.spendAnalysis) {
                let totalSpend = 0,
                    id = 0;

                self.baseCurrency(data.spendAnalysis[0].currency);

                if (!categoryId) {
                    self.selectedCategory(["all"]);
                }

                self.centerLabel(self.selectedCategoryName());

                for (i = 0; i < data.spendAnalysis.length; i++) {
                    const categoryName = !data.spendAnalysis[i].categoryId && !categoryId ? self.resource.spend.uncategorized : data.spendAnalysis[i].categoryName === "OTHER" ? self.resource.spend.other : data.spendAnalysis[i].categoryName;

                    if (!categoryId && data.spendAnalysis[i].categoryId) {
                        self.categoryList().push({
                            name: categoryName,
                            id: ++id + "_" + data.spendAnalysis[i].categoryId
                        });
                    }

                    pieSeries[i] = {
                        name: categoryName,
                        items: [{
                            value: data.spendAnalysis[i].totalSpent,
                            id: categoryId ? undefined : i + "_" + data.spendAnalysis[i].categoryId
                        }],
                        color: categoryId ? categoriesColorArray[i % parseInt(categoryId.split("_")[0])].shades[i % categoriesColorArray[i % parseInt(categoryId.split("_")[0])].shades.length] : categoriesColorArray[i % categoriesColorArray.length].color
                    };

                    categoryColorMap[categoryName] = pieSeries[i].color;
                    totalSpend += data.spendAnalysis[i].totalSpent;

                    self.legendArray()[0].items.push({
                        text: categoryName,
                        markerShape: "circle",
                        color: categoryColorMap[categoryName],
                        svgClassName: self.legendStyle().color
                    });
                }

                computeTopTwoSpends(data.spendAnalysis, categoryId);
                self.totalSpend(totalSpend);
            } else {
                self.noSpendData(true);
                self.centerLabel(self.resource.spend.nodata);

                for (i = 0; i < 5; i++) {
                    pieSeries[i] = {
                        items: [{
                            value: 1
                        }],
                        color: categoriesColorArray[i].color
                    };
                }

                self.selectedCategory(["all"]);
            }

            self.pieSeriesValue(pieSeries);
            self.legendDataSource(new oj.ArrayTableDataSource(pieSeries));
            ko.tasks.runEarly();
            self.refreshChart(true);
            self.viewSpends(true);
        }

        self.showsub = function(categoryId) {
            const pieSeries = [];
            let filter = self.durationFilter() + (categoryId ? "&categoryId=" + categoryId.split("_")[1] : "");

            if (self.type === "cards") {
                filter = "";
            }

            SpendSummary.getSpendAnalysis(filter).done(function(data) {
                setSpendAnalysis(data, pieSeries, categoryId);
            });
        };

        if (Params.dashboard.appData.segment === "ADMIN") {
            SpendSummary.getHostDate().done(function(data) {
                self.today = new Date(data.currentDate.valueDate);
                setDurationFilter(30);
                self.showsub();
            });
        }
    };
});