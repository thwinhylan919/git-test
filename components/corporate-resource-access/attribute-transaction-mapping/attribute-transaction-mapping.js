define([
        "knockout",
        "jquery",
        "ojL10n!resources/nls/attribute-transaction-mapping",
        "ojs/ojcore",
        "ojs/ojformlayout",
        "ojs/ojvalidationgroup",
        "ojs/ojcheckboxset",
        "ojs/ojtable",
        "ojs/ojarraytabledatasource",
        "ojs/ojrowexpander",
        "ojs/ojflattenedtreedatagriddatasource",
        "ojs/ojjsontreedatasource",
        "ojs/ojflattenedtreetabledatasource"
    ],
    function (ko, $, resourceBundle, oj) {
        "use strict";

        return function (params) {
            const self = this;

            self.nls = resourceBundle;
            self.partyLevelAccessAllowed = ko.observableArray();
            self.attributeData = params.attributeData;
            self.dataSource = params.dataSource;
            self.attributeName = params.attributeName;
            self.disableTree = params.disableTree;
            self.expanded = params.expanded;
            self.mapAllToAllCheckboxMsg = ko.observable();
            self.transactionCount = ko.observable(0);
            self.dataLength = ko.observable(0);
            params.baseModel.registerComponent("attribute-transaction-tree", "corporate-resource-access");

            const TRUE = "true";

            function structureTreeData(tasks, id, selection) {
                const rootArray = [],
                    parentTaskArray = [],
                    parentTaskList = tasks,
                    parent = {
                        attr: {},
                        children: []
                    };

                if (parentTaskList.length > 0) {
                    parent.attr.id = id;
                    parent.attr.title = self.nls.mapAllTransaction;

                    for (let j = 0; j < parentTaskList.length; j++) {
                        const childTaskList = parentTaskList[j].childTasks,

                            child = {
                                attr: {},
                                children: []
                            };

                        child.attr.id = params.baseModel.incrementIdCount();
                        child.attr.taskId = parentTaskList[j].id;
                        child.attr.title = parentTaskList[j].name;

                        const childArray = [];

                        if (childTaskList.length > 0) {
                            for (let k = 0; k < childTaskList.length; k++) {
                                const temp = {
                                    attr: {}
                                };

                                temp.attr.id = params.baseModel.incrementIdCount();
                                temp.attr.taskId = childTaskList[k].id;
                                temp.attr.title = childTaskList[k].name;
                                childArray.push(temp);

                                if (childTaskList[k].allowed) {
                                    selection.push(childTaskList[k].id);
                                }

                            }
                        }

                        child.children = childArray;
                        parentTaskArray.push(child);
                    }
                }

                parent.children = parentTaskArray;
                rootArray.push(parent);

                return rootArray;
            }

            if (params.attributeName === "Program") {
                self.mapAllToAllCheckboxMsg(self.nls.TransactionMapping.MapAllTransactionstoAllPrograms);
            } else if (params.attributeName === "Facility") {
                self.mapAllToAllCheckboxMsg(self.nls.TransactionMapping.MapAllTransactionstoAllFacilities);
            } else if (params.attributeName === "Remitter List") {
                self.mapAllToAllCheckboxMsg(self.nls.TransactionMapping.MapAllTransactionstoAllRemitterLists);
            }

            self.columnArray = [{
                    headerText: "",
                    field: "allowed",
                    style: "width:10%"

                },
                {
                    headerText: params.baseModel.format(self.nls.attributeIdHeader, {
                        attributeName: params.attributeName
                    }),
                    field: "id",
                    style: "width:30%"
                },
                {
                    headerText: params.baseModel.format(self.nls.attributeNameHeader, {
                        attributeName: params.attributeName
                    }),
                    field: "name",
                    style: "width:30%"
                },
                {
                    headerText: self.nls.status,
                    field: "status",
                    style: "width:30%"
                }
            ];

            if (self.dataSource.length === 0 && self.dataSource.constructor === Array) {

                self.attributeData.sort(function (a, b) {
                    if (a.allowed.indexOf(TRUE) !== -1) {
                        return -1;
                    } else if (b.allowed.indexOf(TRUE) !== -1) {
                        return 1;
                    }

                    return 0;
                });

                $.map(self.attributeData, function (val) {
                    const tempVal = {};

                    tempVal.attr = {
                        id: val.id,
                        name: val.name,
                        status: val.status,
                        allowed: val.allowed
                    };

                    if (val.tasks.length !== 0 && val.allowed.indexOf(TRUE) !== -1) {
                        const selection = ko.observableArray(),
                            treeData = structureTreeData(val.tasks, val.id, selection);

                        tempVal.children = [{
                            attr: {
                                treeData: treeData,
                                selectedTasks: selection
                            }
                        }];
                    }

                    self.dataSource.push(tempVal);

                });

            }

            let selectedTask = 0,
                totalTask = 0;

            for (let i = 0; i < self.dataSource.length; i++) {
                if (self.dataSource[i].children && self.dataSource[i].children.length > 0) {

                    if (self.dataSource[i].children[0].attr.treeData[0].children !== undefined && self.dataSource[i].children[0].attr.treeData[0].children.length > 0) {
                        selectedTask = selectedTask + (ko.isObservable(self.dataSource[i].children[0].attr.selectedTasks) ? self.dataSource[i].children[0].attr.selectedTasks().length : self.dataSource[i].children[0].attr.selectedTasks.length);

                        let childTask = 0;

                        self.dataLength(self.dataLength() + 1);

                        for (let j = 0; j < self.dataSource[i].children[0].attr.treeData[0].children.length; j++) {
                            totalTask = totalTask + self.dataSource[i].children[0].attr.treeData[0].children[j].children.length;
                            childTask = childTask + self.dataSource[i].children[0].attr.treeData[0].children[j].children.length;
                        }

                        if ((ko.isObservable(self.dataSource[i].children[0].attr.selectedTasks) ? self.dataSource[i].children[0].attr.selectedTasks().length : self.dataSource[i].children[0].attr.selectedTasks.length) === childTask) {
                            self.transactionCount(self.transactionCount() + 1);
                        }
                    }
                }

                if (i === self.dataSource.length - 1 && selectedTask === totalTask && self.dataSource[i].children ) {
                    self.partyLevelAccessAllowed.push(TRUE);
                }
            }

            self.openRowExpander = function (event) {

                const a = $(".token").find("div .oj-rowexpander-touch-area").find("a");

                $(a).each(function (index) {

                    if ($(this).attr("aria-expanded") === "false") {
                        $(this).trigger("click");
                    }

                    const element = "oj-tree-view[data-id=program" + self.attributeData[index].id + "]";

                    oj.Context.getContext(document.querySelector(element)).getBusyContext().whenReady().then(function () {

                        $(element).trigger("mapAllClick", [self.attributeData[index].id, event.target.checked ? 1 : -1]);
                    });

                });
            };

            self.dataSource46 = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.dataSource, {
                idAttribute: "id"
            }), {
                expanded: self.expanded
            }));

        };
    });