define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/bank-custom-limits",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojswitch", "ojs/ojmodel",
    "promise",
    "ojs/ojcube",
    "ojs/ojdatagrid"
], function (oj, ko, $, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;

        ko.utils.extend(self, params.rootModel);
        self.approvalMode = self.params.mode ? ko.observable(self.params.mode) : ko.observable();

        self.dataSource = ko.observable();
        self.index = params.index;
        params.baseModel.registerElement("amount-input");

        let cube = null,
            topLevelItems = [];

        const attrArr = [{
                attribute: "bank",
                label: self.nls.BankCustomLimits.allocated,
                aggregation: oj.CubeAggType.FIRST
            },
            {
                attribute: "user",
                label: self.nls.BankCustomLimits.custom,
                aggregation: oj.CubeAggType.FIRST
            },
            {
                attribute: "utilized",
                label: self.nls.BankCustomLimits.utilized,
                aggregation: oj.CubeAggType.FIRST
            },
            {
                attribute: "available",
                label: self.nls.BankCustomLimits.available,
                aggregation: oj.CubeAggType.FIRST
            }
        ].concat(self.approvalMode() === "approval" ? [{
            attribute: "newValue",
            label: self.nls.BankCustomLimits.newValue,
            aggregation: oj.CubeAggType.FIRST
        }] : []);

        if (self.mode() === "EDIT") {
            attrArr.push({
                attribute: "newValue",
                label: self.nls.BankCustomLimits.newValue,
                aggregation: oj.CubeAggType.FIRST
            });
        }

        const generateCube = function (dataArr, axes, attr) {
                return new oj.DataValueAttributeCube(dataArr, axes, attr);
            },

            axes = [{
                    axis: 0,
                    levels: [{
                        attribute: "dataTypeDesc"
                    }]
                },
                {
                    axis: 1,
                    levels: [{
                            attribute: "typeDesc"
                        },
                        {
                            dataValue: true
                        }
                    ]
                },
                {
                    axis: 2,
                    levels: [{
                        attribute: "transactionDesc"
                    }]
                }
            ],

            getItemsForLevel = function (axis, lvl) {
                const arr = [],
                    axes = cube.getAxes(),
                    level = axes[axis].getLevels()[lvl],
                    length = axes[axis].getExtent();
                let index = 0;

                while (index < length) {
                    const val = level.getValue(index);

                    arr.push({
                        value: val.getValue(),
                        label: val.getLabel()
                    });

                    index += val.getExtent();
                }

                return arr;
            };

        self.reloadDataSource = function () {
            cube = generateCube(self.dataGridSource(), axes, attrArr);
            topLevelItems = getItemsForLevel(2, 0);
            self.transactions(topLevelItems);

            if (!self.currentTransaction()) {
                self.currentTransaction(topLevelItems[0].value);
            }

            self.dataSource(new oj.CubeDataGridDataSource(cube));

            const initheight = (self.dataSource().getCount("row") * 2.3125) + 2.4375,
                initheightprop = initheight + "rem";

            $("#datagrid").css({
                height: initheightprop,
                width: "100%",
                "max-width": "56.25rem"
            });
        };

        const refreshGrid = function () {
                const key = {};

                key.transactionDesc = self.currentTransaction();

                cube.setPage({
                    axis: 2,
                    index: cube.getAxes()[2].getIndex(JSON.stringify(key))
                });

                const height = (self.dataSource().getCount("row") * 2.3125) + 2.4375,
                    heightprop = height + "rem";

                $("#datagrid").css({
                    height: heightprop,
                    width: "100%",
                    "max-width": "56.25rem"
                });

                self.dataSource().setCube(cube);
            },
            dataGridSourceDipose = self.dataGridSource.subscribe(function () {
                self.reloadDataSource();
                refreshGrid();
            });

        self.reloadDataSource();

        self.edit = function () {
            attrArr.push({
                attribute: "newValue",
                label: self.nls.BankCustomLimits.newValue,
                aggregation: oj.CubeAggType.FIRST
            });

            cube = generateCube(self.dataGridSource(), axes, attrArr);
            self.dataSource().setCube(cube);
            refreshGrid();
            self.mode("EDIT");
        };

        self.rowHeaderRenderer = function (headerContext) {
            headerContext.parentElement.style.width = "9.9375rem";

            if (headerContext.level === 1) {
                headerContext.parentElement.style.background = "var(--base-background-tertiary)";

            } else {
                headerContext.parentElement.style.background = "var(--base-background-primary)";
            }
        };

        self.columnHeaderRenderer = function (headerContext) {
            headerContext.parentElement.style.width = "9.0625rem";
            headerContext.parentElement.style.background = "var(--base-background-primary)";

        };

        self.cellRenderer = function (cellContext) {
            cellContext.parentElement.style.background = "var(--base-background-primary)";

            return oj.KnockoutTemplateUtils.getRenderer("editCellTemplate")(cellContext);
        };

        self.getCellClassName = function (cellContext) {
            const key = cellContext.keys.row;

            if (key.indexOf("newValue") > -1 && self.mode() !== "REVIEW") {
                return "oj-sm-justify-content-flex-end";
            }

            return "oj-sm-justify-content-flex-end oj-read-only";

        };

        const currentTransactionDispose = self.currentTransaction.subscribe(function () {
                refreshGrid();
            }),

            currentAccessPointDispose = self.currentAccessPoint.subscribe(function () {
                self.displayGrid(false);
                self.fetchAllLimits();
            });

        self.backToEdit = function () {
            self.dataGridSource(self.dataGridSourceCopy());
            self.mode("EDIT");
            self.limitsHeader(self.nls.BankCustomLimits.viewLimits);
        };

        self.dispose = function () {
            dataGridSourceDipose.dispose();
            currentTransactionDispose.dispose();
            currentAccessPointDispose.dispose();
        };

    };
});
