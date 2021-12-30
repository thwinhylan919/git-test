define([

    "knockout",

    "./model",
    "ojL10n!resources/nls/api-builder-view",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojknockout-validation"
], function(ko, APIBuilderViewModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("api-builder-edit", "api-builder");
        rootParams.baseModel.registerComponent("api-builder-search", "api-builder");
        self.resource = resourceBundle;
        rootParams.dashboard.headerName(self.resource.headerName);
        self.apiServiceDTO = ko.observable(rootParams.rootModel.params.viewDto);
        self.selectedItem = ko.observable();
        self.groupName = ko.observable();
        self.header = ko.observableArray();
        self.selectedModule = ko.observable();
        self.selectedCategory = ko.observable();
        self.actionTypes = ko.observableArray();
        self.taskAspects = ko.observableArray();
        self.selectedTaskAspects = ko.observableArray();
        self.isTaskAspectFetched = ko.observable(false);
        self.transactionType = ko.observable();

        self.listItem = ko.observable([{
                id: self.resource.serviceDetails,
                label: self.resource.serviceDetails
            },
            {
                id: self.resource.entDetails,
                label: self.resource.entDetails
            },
            {
                id: self.resource.jsonPath,
                label: self.resource.jsonPath
            },
            {
                id: self.resource.alerts,
                label: self.resource.alerts
            }
        ]);

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.selectedItem
        };

        APIBuilderViewModel.getApiGroups().then(function(data) {
            ko.utils.arrayForEach(data.apiGroupList, function(item) {
                if (item.groupCode === self.apiServiceDTO().apiGroupName) {
                    self.groupName(item.groupDescription);
                }
            });
        });

        APIBuilderViewModel.fetchActionType().done(function(data) {
            if (data.enumRepresentations) {
                ko.utils.arrayForEach(data.enumRepresentations[0].data, function(item) {
                    for (let i = 0; i < self.apiServiceDTO().actionTypes.length; i++) {
                        if (item.code === self.apiServiceDTO().actionTypes[i]) {
                            self.actionTypes.push(item.description);
                        }
                    }
                });
            }
        });

        if (self.apiServiceDTO().taskAspects) {
            APIBuilderViewModel.fetchTaskAspect().done(function(data) {
                self.taskAspects.removeAll();

                if (data.enumRepresentations) {
                    ko.utils.arrayForEach(data.enumRepresentations[0].data, function(item) {
                        for (let i = 0; i < self.apiServiceDTO().taskAspects.length; i++) {
                            if (item.code === self.apiServiceDTO().taskAspects[i]) {
                                self.selectedTaskAspects.push(item.code);
                            }
                        }

                        self.taskAspects.push({
                            text: item.description,
                            value: item.code
                        });
                    });
                }

                self.isTaskAspectFetched(true);
            });
        }

        APIBuilderViewModel.fetchTransactionType().done(function(data) {
            if (data.enumRepresentations) {
                ko.utils.arrayForEach(data.enumRepresentations[0].data, function(item) {
                    if (item.code === self.apiServiceDTO().transactionType) {
                        self.transactionType(item.description);
                    }
                });
            }
        });

        if (self.apiServiceDTO().moduleName) {
            APIBuilderViewModel.fetchModuleName().done(function(data) {
                if (data.enumRepresentations) {
                    ko.utils.arrayForEach(data.enumRepresentations[0].data, function(item) {
                        if (item.code === self.apiServiceDTO().moduleName) {
                            self.selectedModule(item.description);
                        }
                    });
                }
            });

            APIBuilderViewModel.fetchCategoryName(self.apiServiceDTO().moduleName).done(function(data) {
                if (data.enumRepresentations) {
                    ko.utils.arrayForEach(data.enumRepresentations[0].data, function(item) {
                        if (item.code === self.apiServiceDTO().categoryName) {
                            self.selectedCategory(item.description);
                        }
                    });
                }
            });
        }

        let a = JSON.stringify(self.apiServiceDTO().headers);

        a = a.replace(/[{|}|\"]/g, "");
        a = a.split(",");

        if (a.length === 1) {
            self.headerValues = {
                key: ko.observable(),
                value: ko.observable()
            };

            self.header.push(self.headerValues);

            const b = a[0].split(":");

            self.header()[0].key = b[0];
            self.header()[0].value = b[1];
        } else if (a.length > 1) {
            for (let m = 0; m < a.length; m++) {
                self.headerValues = {
                    key: ko.observable(),
                    value: ko.observable()
                };

                self.header.push(self.headerValues);

                const b = a[m].split(":");

                self.header()[m].key = b[0];
                self.header()[m].value = b[1];

            }
        }

        self.selectedItem(self.listItem()[0].label);

        self.onClickCancel = function() {
            rootParams.dashboard.switchModule();
        };

        self.onClickBack = function() {
            rootParams.dashboard.loadComponent("api-builder-search", self);
        };

        self.edit = function() {
            rootParams.dashboard.loadComponent("api-builder-edit", self);
        };
    };
});