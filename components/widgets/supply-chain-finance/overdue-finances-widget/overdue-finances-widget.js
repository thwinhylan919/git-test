define([
    "ojL10n!resources/nls/overdue-finances-widget",
    "./model",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function (resourceBundle, Model, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.invoicesgetVar = ko.observable();
        self.invoicesgetrole = ko.observable("S");

        self.invoiceList = ko.observableArray();
        self.listLoaded = ko.observable(false);
        params.baseModel.registerComponent("view-finances", "supply-chain-finance");
        self.financesList = ko.observableArray();

        self.tableColumns = [{
                field: "id",
                headerText: self.nls.FinanceNumber,
                headerClassName: "header-background",
                sortable: "disabled"
            },
            {
                field: "outstandingAmount",
                headerText: self.nls.AmountOverdue,
                headerClassName: "header-background",
                sortable: "disabled"
            },
            {
                field: "noOfDaysOverdue",
                headerText: self.nls.Noofdaysoverdue,
                headerClassName: "header-background",
                sortable: "disabled"
            }
        ];

        self.populateTableInput = function (list) {
            self.financesList().length = 0;

            list.forEach(function (data) {

                self.financesList().push(data);

            });

            let dateToCompare = "";

            self.financesList().forEach(function (finance) {
                dateToCompare = new Date(finance.dueDate);
                finance.noOfDaysOverdue = parseInt((params.baseModel.getDate().getTime() - dateToCompare.getTime()) / (1000 * 60 * 60 * 24));
                finance.headerClass = false;
            });

            self.financesList().sort(function (left, right) {
                return left.noOfDaysOverdue === right.noOfDaysOverdue ? 0 : left.noOfDaysOverdue > right.noOfDaysOverdue ? -1 : 1;
            });

            self.financesList(self.financesList().slice(0, 5));

            self.listLoaded(true);
        };

        const jsonDataFinanceStatus = self.nls.FinanceStatus,
            financeStatusArray = [];

        Object.keys(jsonDataFinanceStatus).forEach(function (key) {
            financeStatusArray.push(key);
        });

        const query = {
            criteria: [{
                    operand: "status",
                    operator: "IN",
                    value: financeStatusArray
                },
                {
                    operand: "toDueDate",
                    operator: "EQUALS",
                    value: [oj.IntlConverterUtils.dateToLocalIso(params.baseModel.getDate())]
                }
            ]
        };

        Model.getFinances(JSON.stringify(query)).then(function (response) {
            for (let i = 0; i < response.finances.length; i++) {
                if (response.finances[i].amounts) {
                    for (let j = 0; j < response.finances[i].amounts.length; j++) {
                        if (response.finances[i].amounts[j].type === "OUTSTANDING") {
                            response.finances[i].outstandingAmount = response.finances[i].amounts[j].totalAmount ? response.finances[i].amounts[j].totalAmount : "-";
                        }
                    }
                }
            }

            self.populateTableInput(response.finances);
        });

        self.dataSource26 = new oj.ArrayTableDataSource(self.financesList, {
            idAttribute: "id"
        });

        self.viewAll = function () {
            params.dashboard.loadComponent("view-finances");
        };
    };
});