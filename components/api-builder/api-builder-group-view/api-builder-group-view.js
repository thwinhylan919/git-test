define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/api-builder-view",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojnavigationlist",
    "ojs/ojknockout-validation"
], function(oj, ko, APIBuilderGroupViewModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("api-builder-edit", "api-builder");
        rootParams.baseModel.registerComponent("api-group-search", "api-builder");
        self.resource = resourceBundle;
        rootParams.dashboard.headerName(self.resource.headerName);
        self.showServiceDetails = ko.observable(false);
        self.selectedItem = ko.observable();
        self.selectedService = ko.observable();
        self.apiServiceDTO = ko.observable();
        self.servicesArray = ko.observableArray();
        self.header = ko.observableArray();
        self.groupName = ko.observable();
        self.selectedModule = ko.observable();
        self.selectedCategory = ko.observable();
        self.actionTypes = ko.observableArray();
        self.taskAspects = ko.observableArray();
        self.selectedTaskAspects = ko.observableArray();
        self.isTaskAspectFetched = ko.observable(false);
        self.showList = ko.observable(false);
        self.transactionType = ko.observable();
        self.dataSource = ko.observable();

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

        self.uiServiceOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.selectedService,
            type: "start"
        };

        for (let i = 0; i < rootParams.rootModel.params.dto.length; i++) {
            self.servicesArray().push({
                methodType: rootParams.rootModel.params.dto[i].methodType,
                serviceName: rootParams.rootModel.params.dto[i].serviceName
            });
        }

        self.dataSource(new oj.ArrayTableDataSource(self.servicesArray, {
            idAttribute: "serviceName"
        }));

        self.showList(true);

        self.showDetails = function(event) {
            let serviceId;

            if (event) {
                ko.utils.arrayForEach(rootParams.rootModel.params.dto, function(item) {
                    if (item.serviceName === event.row.serviceName) {
                        serviceId = item.serviceId;
                    }
                });
            } else {
                serviceId = rootParams.rootModel.params.dto[0].serviceId;
            }

            APIBuilderGroupViewModel.getServiceDetails(serviceId).then(function(data) {
                self.apiServiceDTO(data.apiBuilderDTO);
                self.showServiceDetails(true);
                self.header.removeAll();

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

                self.getDetails();
            });
        };

        if (rootParams.rootModel.params.dto) {
            self.showDetails();
        }

        self.selectedItem(self.listItem()[0].label);

        self.getDetails = function() {
            APIBuilderGroupViewModel.getApiGroups().then(function(data) {
                ko.utils.arrayForEach(data.apiGroupList, function(item) {
                    if (item.groupCode === self.apiServiceDTO().apiGroupName) {
                        self.groupName(item.groupDescription);
                    }
                });
            });

            APIBuilderGroupViewModel.fetchActionType().done(function(data) {
                self.actionTypes.removeAll();

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
                APIBuilderGroupViewModel.fetchTaskAspect().done(function(data) {
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

            APIBuilderGroupViewModel.fetchTransactionType().done(function(data) {
                if (data.enumRepresentations) {
                    ko.utils.arrayForEach(data.enumRepresentations[0].data, function(item) {
                        if (item.code === self.apiServiceDTO().transactionType) {
                            self.transactionType(item.description);
                        }
                    });
                }
            });

            if (self.apiServiceDTO().moduleName) {
                APIBuilderGroupViewModel.fetchModuleName().done(function(data) {
                    if (data.enumRepresentations) {
                        ko.utils.arrayForEach(data.enumRepresentations[0].data, function(item) {
                            if (item.code === self.apiServiceDTO().moduleName) {
                                self.selectedModule(item.description);
                            }
                        });
                    }
                });

                APIBuilderGroupViewModel.fetchCategoryName(self.apiServiceDTO().moduleName).done(function(data) {
                    if (data.enumRepresentations) {
                        ko.utils.arrayForEach(data.enumRepresentations[0].data, function(item) {
                            if (item.code === self.apiServiceDTO().categoryName) {
                                self.selectedCategory(item.description);
                            }
                        });
                    }
                });
            }
        };

        self.onClickCancel = function() {
            rootParams.dashboard.switchModule();
        };

        self.onClickBack = function() {
            rootParams.dashboard.loadComponent("api-group-search", self);
        };

        self.edit = function() {
            rootParams.dashboard.loadComponent("api-builder-edit", self);
        };
    };
});