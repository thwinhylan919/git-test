define(
    ["knockout",
        "ojL10n!resources/nls/attribute-list",
        "ojs/ojcore",
        "ojs/ojformlayout",
        "ojs/ojvalidationgroup",
        "ojs/ojcheckboxset",
        "ojs/ojtable",
        "ojs/ojarraytabledatasource"
    ],
    function (ko, resourceBundle, oj) {
        "use strict";

        return function (params) {
            const self = this;

            self.nls = resourceBundle;

            self.attributeData = params.attributeData;
            self.nextPressed = params.nextPressed;
            self.editPressed = params.editPressed;
            self.disabled = params.disabled;
            self.selectedItem = params.selectedItem;
            self.mapAll = ko.observableArray();
            self.attributeName = params.attributeName;
            self.isUserSelected = params.isUserSelected;
            self.partyLevelChangesAuto = params.partyLevelChangesAuto;
            self.count = ko.observable(0);
            self.mapAllCheckboxMsg = ko.observable();

            if (params.attributeName === "Program") {
                self.mapAllCheckboxMsg(self.nls.ResourceMapping.MapAllPrograms);
            } else if (params.attributeName === "Facility") {
                self.mapAllCheckboxMsg(self.nls.ResourceMapping.MapAllFacilities);
            } else if (params.attributeName === "Remitter List") {
                self.mapAllCheckboxMsg(self.nls.ResourceMapping.MapAllRemitterLists);

            }

            const countChange = function (newValue) {
                if (self.attributeData.length === newValue) {
                    self.mapAll.removeAll();
                    self.mapAll.push("true");
                } else {
                    self.mapAll.removeAll();
                }
            };

            self.count.subscribe(function (newValue) {
                countChange(newValue);
            });

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

            for (let i = 0; i < self.attributeData.length; i++) {
                if (!ko.isObservable(self.attributeData[i].allowed)) {
                    self.attributeData[i].allowed = ko.observableArray(
                        !Array.isArray(self.attributeData[i].allowed) ?
                        self.attributeData[i].allowed ? [self.attributeData[i].allowed.toString()] : [] :
                        self.attributeData[i].allowed);

                    if (self.attributeData[i].allowed()[0] === "true") {
                        self.count(self.count() + 1);
                    }

                }

                countChange(self.count());
            }

            self.handleCheckboxMapAll = function (event) {
                if (event.detail) {
                    if (event.detail.updatedFrom === "internal") {
                        self.count(0);

                        for (let i = 0; i < self.attributeData.length; i++) {
                            self.attributeData[i].allowed.removeAll();
                            self.attributeData[i].allowed.push.apply(self.attributeData[i].allowed, event.detail.value);
                        }
                    }

                    if (event.detail.value[0] === "true") {
                        self.count(self.attributeData.length);
                    }
                }
            };

            self.checkboxListener = function (event) {
                if (event.detail && event.detail.updatedFrom === "internal") {
                    if (event.detail.value[0] === "true") {
                        self.count(self.count() + 1);

                    } else {
                        self.count(self.count() - 1);

                    }

                }
            };

            self.dataSource14 = new oj.ArrayTableDataSource(self.attributeData, {
                idAttribute: "id"
            });
        };
    });