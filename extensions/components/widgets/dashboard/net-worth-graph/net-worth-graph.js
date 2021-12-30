define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/net-worth-graph",
    "ojs/ojchart"
], function (ko, Model, ResourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.resource = ResourceBundle;
        self.pieSeriesValueForCredit = ko.observableArray();
        self.pieSeriesValueForDebit = ko.observableArray();
        self.showIHaveGraph = ko.observable(true);
        self.amountData = ko.observable(false);
        self.selectedValue = ko.observable("iHave");
        self.TotalAssets = ko.observable();
        self.TotalLiability = ko.observable();
        self.currency = ko.observable();

        const summary = {};
        let asset = 0,
            liability = 0,
            creditCardData = null;

        self.centerLabelStyle = ko.observable({
            "font-size": "1rem"
        });

        self.innerRadius = ko.observable("0.9");
        self.dataLabelPosition = ko.observable("none");
        self.legendPosition = ko.observable("auto");
        self.legendRenderer = ko.observable("off");

        self.netWorthLabels = [{
            id: "iHave",
            label: self.resource.iHave
        }, {
            id: "iOwe",
            label: self.resource.iOwe
        }];

        function calculateNetWorth(data) {
            summary.CSAAmount = 0;
            summary.CSAODAmount = 0;
            summary.TRDAmount = 0;
            summary.RDAmount = 0;
            summary.LOANAmount = 0;
            summary.WalletAmount = 0;
            asset = 0;
            liability = 0;

            const summarydata = data.summary.items,
                walletdata = data.accounts;

            ko.utils.arrayForEach(summarydata, function (item) {
                if (item.accountType === "CSA") {
                    self.currency(item.totalActiveAvailableBalance.currency);

                    summary.CSAAmount += item.totalActiveAvailableBalance.amount +
                        item.totalISLActiveAvailableBalance.amount;

                    summary.CSAODAmount += (item.totalActiveNegativeBalance.amount +
                        item.totalISLActiveNegativeBalance.amount
                    ) * -1;
                } else if (item.accountType === "TRD") {
                    self.currency(item.totalActiveAvailableBalance.currency);
                    summary.TRDAmount += item.totalActiveAvailableBalance.amount + item.totalISLActiveAvailableBalance.amount;
                    summary.RDAmount += item.totalRDActiveAvailableBalance.amount;
                } else if (item.accountType === "LON") {
                    self.currency(item.totalActiveOutstandingBalance.currency);
                    summary.LOANAmount += item.totalActiveOutstandingBalance.amount + item.totalISLActiveOutstandingBalance.amount;
                }
            });

            ko.utils.arrayForEach(walletdata, function (item) {
                if (item.productDTO.productId === "WALLET") {
                    self.currency(item.availableBalance.currency);
                    summary.WalletAmount += item.availableBalance.amount;
                }
            });

            summary.CSAAmount -= summary.WalletAmount;

            if (creditCardData) {
                summary.CCAAmount = creditCardData.sumOfEquivalentDue.amount || 0;
                self.currency(creditCardData.sumOfEquivalentDue.currency || creditCardData.domesticCurrency);
            }

            liability = summary.CSAODAmount + summary.LOANAmount + summary.CCAAmount;
            self.TotalLiability(rootParams.baseModel.formatCurrency(liability, self.currency()));
            asset = summary.CSAAmount + summary.TRDAmount + summary.RDAmount + summary.WalletAmount;
            self.TotalAssets(rootParams.baseModel.formatCurrency(asset, self.currency()));

            self.pieSeriesValueForCredit.removeAll();
            self.pieSeriesValueForDebit.removeAll();

            self.pieSeriesValueForCredit.push({
                name: self.resource.labels.CSA,
                items: [summary.CSAAmount],
                color: "#FCB300"
            }, {
                name: self.resource.labels.TRD,
                items: [summary.TRDAmount],
                color: "#14BA92"
            }, {
                name: self.resource.labels.RD,
                items: [summary.RDAmount],
                color: "#FF669E"
            }, {
                name: self.resource.labels.wallet,
                items: [summary.WalletAmount],
                color: "#0000FF"
            });

            self.pieSeriesValueForDebit.push({
                name: self.resource.labels.CSAOD,
                items: [summary.CSAODAmount],
                color: "#FCB300"
            }, {
                name: self.resource.labels.LON,
                items: [summary.LOANAmount],
                color: "#5fefef"
            });

            if (creditCardData) {
                self.pieSeriesValueForDebit.push({
                    name: self.resource.labels.CCA,
                    items: [summary.CCAAmount],
                    color: "#ff7b6d"
                });
            }

            self.amountData(self.pieSeriesValueForCredit().length || self.pieSeriesValueForCredit().length);
        }

        function setDataForAccounts() {
            Promise.all([
                Model.fetchAccounts()
            ]).then(function (values) {
                creditCardData = values[1];
                calculateNetWorth(values[0]);
            });
        }

        self.selectedValue.subscribe(function (value) {
            if (value === "iHave") {
                self.showIHaveGraph(true);
            } else {
                self.showIHaveGraph(false);
            }

            setDataForAccounts();
        });

        setDataForAccounts();

        self.styleDefaults = ko.pureComputed(function () {
            return {
                pieInnerRadius: self.innerRadius(),
                dataLabelPosition: self.dataLabelPosition()
            };
        });

        self.legend = ko.pureComputed(function () {
            return {
                position: self.legendPosition(),
                textStyle: self.centerLabelStyle(),
                rendered: self.legendRenderer()
            };
        });

        self.pieCenterLabelContent = function (dataContext) {
            const pieChartNode = document.createElement("div");
            let outerDiv;

            if (self.showIHaveGraph() && asset !== 0) {
                pieChartNode.innerHTML =
                    "<div style=\"position:absolute;text-align:center;font-size:1rem;top:4rem;\">" +
                    "<div data=\"textlabel\">" + self.resource.iHave + "</div>" +
                    "<div data=\"amount\">" + self.TotalAssets() + "</div>" +
                    "</div>";

                outerDiv = pieChartNode.children[0];

                if (rootParams.baseModel.medium()) {
                    outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
                    outerDiv.style.top = (dataContext.innerBounds.y + 40) + "px";
                    outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
                } else {
                    outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
                    outerDiv.style.top = (dataContext.innerBounds.y + 20) + "px";
                    outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
                }
            } else if (!self.showIHaveGraph() && liability !== 0) {
                pieChartNode.innerHTML =
                    "<div style=\"position:absolute;text-align:center;font-size:1rem;top:4rem;\">" +
                    "<div data=\"textlabel\">" + self.resource.iOwe + "</div>" +
                    "<div data=\"amount\">" + self.TotalLiability() + "</div>" +
                    "</div>";

                outerDiv = pieChartNode.children[0];

                if (rootParams.baseModel.medium()) {
                    outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
                    outerDiv.style.top = (dataContext.innerBounds.y + 40) + "px";
                    outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
                } else {
                    outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
                    outerDiv.style.top = (dataContext.innerBounds.y + 20) + "px";
                    outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
                }
            }

            return {
                insert: pieChartNode
            };
        };
    };
});