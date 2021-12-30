define([
    "jquery",
    "knockout",
    "ojL10n!resources/nls/design-dashboard",
    "ojL10n!resources/nls/design-dashboard-component-name",
    "ojL10n!resources/nls/design-dashboard-component-input",
    "ojs/ojarraydataprovider",
    "ojs/ojtable", "ojs/ojknockout", "ojs/ojlistviewdnd",
    "ojs/ojarraytabledatasource", "ojs/ojradioset", "ojs/ojbutton", "ojs/ojlabel"
], function($, ko, locale, componentNamesLocale, componentInputNLS, ArrayDataProvider) {
    "use strict";

    return function(params) {
        const self = this;

        self.targetSource = params.data;
        self.resourceBundle = locale;
        self.componentNames = componentNamesLocale;
        self.componentInputNLS = componentInputNLS;
        self.renderComponentInputs = ko.observable(false);
        self.inputDetails = ko.observable();
        self.componentInputSource = ko.observable();
        self.componentInputValues = ko.observableArray();
        self.listviewSelection = [];
        self.listId = "floatingListContainer" + params.baseModel.incrementIdCount();
        self.modalId = "componentInputDialog" + params.baseModel.incrementIdCount();

        self.listViewContainerId = "listViewContainer" + params.baseModel.incrementIdCount();

        const componentList = [];

        self.updateComponentList = function(operation, element) {
            if (operation === "remove") {
                componentList.splice(componentList.findIndex(function(ele) {
                    return ele.componentName === element.componentName && ele.module === element.module;
                }), 1);
            } else if (operation === "add") {
                componentList.unshift(element);
            }
        };

        let listviewDataArray = [];

        self.listviewArr = ko.observableArray();

        self.listviewDataProvider = new ArrayDataProvider(self.listviewArr, {
            keyAttributes: "id"
        });

        params.baseModel.registerElement("modal-window");

        params.components().forEach(function(data) {

            const searchComponent = self.targetSource().findIndex(function(component) {
                return component.componentName === data.componentName && data.module === component.module && !component.input;
            });

            if (searchComponent === -1) {

                if (!data.width.small) {
                    data.width.small = 12;
                }

                data.newWidth = Object.assign({}, data.width);
                componentList.push(data);
            }

            params.baseModel.registerComponent(data.componentName, "widgets/" + data.module);

        });

        listviewDataArray = [].concat(componentList);
        self.listviewArr(listviewDataArray);

        self.listviewHandleDragEnd = function(event, _context) {
            let i, j;

            if (event.dataTransfer.dropEffect !== "none") {
                for (i = 0; i < self.listviewSelection.length; i++) {
                    for (j = 0; j < listviewDataArray.length; j++) {
                        // remove the selected items from array
                        if (listviewDataArray[j].id === self.listviewSelection[i] && !Object.hasOwnProperty.call(listviewDataArray[j], "input")) {
                            self.updateComponentList("remove", listviewDataArray[j]);
                            listviewDataArray.splice(j, 1);
                            break;
                        }
                    }
                }

                self.listviewArr.valueHasMutated();
            }
        };

        const listviewDataArray2 = [].concat(self.targetSource()),
            newWidthSelector = params.design;

        self.newWidthSelector = params.design;
        self.listviewArr2 = ko.observableArray(listviewDataArray2);

        self.updateSource = function(nv) {
            self.targetSource.removeAll();
            self.targetSource([].concat(nv));
        };

        self.listviewArr2.subscribe(function(nv) {
            self.updateSource(nv);
        });

        self.listviewDataProvider2 = new ArrayDataProvider(self.listviewArr2, {
            keyAttributes: "id"
        });

        const searchComponentFilterResults = function(newValue) {
            if (newValue && newValue.length) {
                listviewDataArray.length = 0;

                listviewDataArray.push.apply(listviewDataArray, componentList.filter(function(component) {
                    return self.componentNames.names[component.module][component.componentName].toLowerCase().indexOf(newValue.toLowerCase()) > -1;
                }));

                self.listviewArr.valueHasMutated();

            } else {
                listviewDataArray.length = 0;
                listviewDataArray.push.apply(listviewDataArray, componentList);
                self.listviewArr.valueHasMutated();
            }
        };

        self.listviewSelection2 = [];

        const dropContext = {};

        self.listviewHandleDrop2 = function(event, context, input) {

            const inputReceived = input || false;

            let data, index, i, itemContext;

            event.preventDefault();

            if (!inputReceived) {
                data = event.dataTransfer.getData("application/ojlistviewitems+json");
                data = JSON.parse(data);
            } else {
                data = dropContext.data;
            }

            if (!data[0].input || inputReceived) {
                if (context.item) {
                    itemContext = document.getElementById(self.listViewContainerId + "container").getContextByNode(context.item);
                    index = itemContext.index;

                    if (context.position === "after") {
                        index = index + 1;
                    }

                    for (i = data.length - 1; i >= 0; i--) {
                        listviewDataArray2.splice(index, 0, data[i]);
                    }
                } else {
                    // empty list case
                    for (i = 0; i < data.length; i++) {
                        listviewDataArray2.push(data[i]);
                    }
                }

                self.listviewArr2.valueHasMutated();

                setTimeout(function() {
                    document.getElementById(self.listViewContainerId).refresh();
                }, 800);

            } else {

                dropContext.event = event;
                dropContext.context = context;
                dropContext.data = data;
                self.inputDetails(data[0].input);

                self.componentInputSource({
                    componentName: data[0].componentName,
                    module: data[0].module
                });

                self.componentInputValues(new Array(data[0].input.options.length).fill(null));
                self.renderComponentInputs(true);
                $("#" + self.modalId).trigger("openModal");
            }
        };

        self.closeComponentInput = function() {
            self.renderComponentInputs(false);
        };

        self.componentInputEntered = function() {
            const componentInput = {
                data: {}
            };

            self.componentInputValues().forEach(function(input, index) {
                componentInput.data[self.inputDetails().options[index]] = input;
            });

            Object.assign(dropContext.data[0], componentInput);
            self.renderComponentInputs(false);
            $("#" + self.modalId).hide();
            self.listviewHandleDrop2(dropContext.event, dropContext.context, true);
        };

        self.listviewHandleDragEnd2 = function(event, _context) {
            let i, j;

            if (event.dataTransfer.dropEffect !== "none") {
                for (i = 0; i < self.listviewSelection2.length; i++) {
                    for (j = 0; j < listviewDataArray2.length; j++) {
                        // remove the selected items from array
                        if (listviewDataArray2[j].id === self.listviewSelection2[i]) {
                            listviewDataArray2.splice(j, 1);
                            break;
                        }
                    }
                }

                self.listviewArr2.valueHasMutated();

            }
        };

        self.designRenderer = function(element) {
            setTimeout(function() {
                if (element.data.newWidth[newWidthSelector] !== undefined || element.data.width[newWidthSelector] !== undefined) {
                    $("div[designAttribute='" + self.newWidthSelector + element.data.module + element.data.componentName + "']").parent().parent().addClass("oj-sm-" + (element.data.newWidth[newWidthSelector] || element.data.width[newWidthSelector]));
                }
            }, 800);
        };

        function swapElements(source, destination) {

            const index1 = self.listviewArr2().findIndex(function(data) {
                    return data.id === source;
                }),
                index2 = self.listviewArr2().findIndex(function(data) {
                    return data.id === destination;
                }),
                temp = Object.assign({}, self.listviewArr2()[index1]);

            listviewDataArray2.splice(index1, 1);

            listviewDataArray2.splice(index2, 0, temp);

        }

        self.handleReorder = function(event) {

            let source, i;

            const listview = document.getElementById(self.listViewContainerId),
                dest = listview.getContextByNode(event.detail.reference),
                items = event.detail.items;

            for (i = 0; i < items.length; i++) {
                source = listview.getContextByNode(items[i]);
                swapElements(source.key, dest.key, event.detail.position);
            }

            self.listviewArr2.valueHasMutated();

            setTimeout(function() {
                self.handleMoveSuccess();
            }, 200);
        };

        self.handleMoveSuccess = function() {
            const listview = document.getElementById(self.listViewContainerId);

            listview.refresh();

        };

        self.expandComponent = function(data) {
            if ((parseInt(data.data.newWidth[newWidthSelector]) + 1) <= 12) {
                $("div[designAttribute='" + self.newWidthSelector + data.data.module + data.data.componentName + "']").find(".newActions .compressIcon").removeClass("disableIcon");
                listviewDataArray2[data.index].newWidth[newWidthSelector] = parseInt(data.data.newWidth[newWidthSelector]) + 1;

                $("div[designAttribute='" + self.newWidthSelector + data.data.module + data.data.componentName + "']").parent().removeClass("oj-sm-" + (listviewDataArray2[data.index].newWidth[newWidthSelector] - 1))
                    .addClass("oj-sm-" + listviewDataArray2[data.index].newWidth[newWidthSelector]);

                self.updateSource(listviewDataArray2);
            } else {
                $("div[designAttribute='" + self.newWidthSelector + data.data.module + data.data.componentName + "']").find(".newActions .icon-expand").addClass("disableIcon");
            }
        };

        self.compressComponent = function(data) {
            if ((parseInt(data.data.newWidth[newWidthSelector]) - 1) >= parseInt(data.data.width[newWidthSelector])) {
                $("div[designAttribute='" + self.newWidthSelector + data.data.module + data.data.componentName + "']").find(".newActions .icon-expand").removeClass("disableIcon");
                listviewDataArray2[data.index].newWidth[newWidthSelector] = parseInt(data.data.newWidth[newWidthSelector]) - 1;

                $("div[designAttribute='" + self.newWidthSelector + data.data.module + data.data.componentName + "']").parent().removeClass("oj-sm-" + (listviewDataArray2[data.index].newWidth[newWidthSelector] + 1))
                    .addClass("oj-sm-" + listviewDataArray2[data.index].newWidth[newWidthSelector]);

                self.updateSource(listviewDataArray2);
            } else {
                $("div[designAttribute='" + self.newWidthSelector + data.data.module + data.data.componentName + "']").find(".newActions .compressIcon").addClass("disableIcon");
            }
        };

        self.removeWidget = function(data) {

            listviewDataArray2.splice(data.index, 1);
            self.listviewArr2.valueHasMutated();

            setTimeout(function() {
                self.handleMoveSuccess();
            }, 200);

            if (!Object.hasOwnProperty.call(data.data, "input")) {
                Object.assign(data.data.newWidth, data.data.width);
                self.updateComponentList("add", data.data);
                listviewDataArray.unshift(data.data);
                searchComponentFilterResults(self.searchComponent());
                self.listviewArr.valueHasMutated();
                self.handleMoveSuccess();
            }

        };

        self.searchComponent = ko.observable();

        self.searchComponent.subscribe(searchComponentFilterResults);
    };
});