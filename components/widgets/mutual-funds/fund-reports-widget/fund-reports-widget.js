define([
    "ojs/ojcore",
    "ojL10n!resources/nls/fund-reports-widget",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function (oj, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;

        self.reportsData = [{
                code: "CGR",
                label: self.nls.Reports.capitalReports,
                component: "capital-gain-reports",
                module: "mutual-funds"
            },
            {
                code: "DTR",
                label: self.nls.Reports.transactionReports,
                component: "transaction-reports",
                module: "mutual-funds"
            },
            {
                code: "DIVR",
                label: self.nls.Reports.dividendReports,
                component: "dividend-reports",
                module: "mutual-funds"
            }
        ];

        self.dataSource = new oj.ArrayTableDataSource(self.reportsData, {
            idAttribute: "code"
        });

        self.onClickMutualFundsReports = function (data) {
            params.baseModel.registerComponent(data.component, data.module);
            params.dashboard.loadComponent(data.component);
        };
    };
});