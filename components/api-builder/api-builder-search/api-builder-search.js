define([
    "ojs/ojcore",
    "knockout",

    "./model",
    "ojL10n!resources/nls/api-builder-search",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojknockout-validation",
    "ojs/ojarraytabledatasource"
], function(oj, ko, APIBuilderSearchModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.Nls = resourceBundle;
        rootParams.dashboard.headerName(self.Nls.headerName);
        rootParams.baseModel.registerComponent("api-builder-create", "api-builder");
        rootParams.baseModel.registerComponent("api-builder-view", "api-builder");
        self.groupName = ko.observableArray();
        self.serviceList = ko.observableArray();
        self.selectedGroup = ko.observable();
        self.serviceID = ko.observable();
        self.serviceName = ko.observable();
        self.serviceURL = ko.observable();
        self.apiGroupsloaded = ko.observable(false);
        self.showList = ko.observable(false);
        self.cancelButtonFlag = ko.observable(true);
        self.dataSource = ko.observable();

        APIBuilderSearchModel.getApiGroups().then(function(data) {
            ko.utils.arrayForEach(data.apiGroupList, function(item) {
                self.groupName().push(item);
            });

            self.apiGroupsloaded(true);
        });

        self.create = function() {
            rootParams.dashboard.loadComponent("api-builder-create", self);
        };

        self.viewDetails = function(event) {
            APIBuilderSearchModel.getServiceDetails(event.row.serviceId).then(function(data) {
                self.viewDto = data.apiBuilderDTO;
                rootParams.dashboard.loadComponent("api-builder-view", self);
            });
        };

        self.search = function() {
            if (!self.selectedGroup()) {
                rootParams.baseModel.showMessages(null, [self.Nls.noGroupName], "ERROR");
            } else {
                APIBuilderSearchModel.getApiGroupServices(self.selectedGroup(), self.serviceID(), self.serviceName(), self.serviceURL()).then(function(data) {
                    self.serviceList.removeAll();

                    ko.utils.arrayForEach(data.listResponse, function(item) {
                        self.serviceList().push(item);
                    });

                    self.dataSource(new oj.ArrayTableDataSource(self.serviceList(), {
                        idAttribute: "serviceId"
                    }));

                    self.showList(true);
                    self.cancelButtonFlag(false);
                });
            }
        };

        if (rootParams.rootModel.params.params) {
            self.selectedGroup(rootParams.rootModel.params.params.selectedGroup());
            self.serviceID(rootParams.rootModel.params.params.serviceID());
            self.serviceName(rootParams.rootModel.params.params.serviceName());
            self.serviceURL(rootParams.rootModel.params.params.serviceURL());
            self.search();
        }

        self.onClickCancel = function() {
            rootParams.dashboard.switchModule();
        };

        self.onClickBack = function() {
            self.selectedGroup("");
            self.serviceID("");
            self.serviceName("");
            self.serviceURL("");
            self.showList(false);
            self.cancelButtonFlag(true);
        };
    };
});