define([
    "jquery",
    "ojs/ojcore",
    "knockout",

    "./model",
    "ojL10n!resources/nls/api-group-search",
    "ojs/ojarraytabledatasource",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojlistview"
], function($, oj, ko, APIGroupSearchModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        rootParams.dashboard.headerName(self.Nls.headerName);
        rootParams.baseModel.registerComponent("api-group-create", "api-builder");
        rootParams.baseModel.registerComponent("api-group-view", "api-builder");
        rootParams.baseModel.registerComponent("api-builder-search", "api-builder");
        rootParams.baseModel.registerComponent("api-builder-group-view", "api-builder");
        rootParams.baseModel.registerElement("modal-window");
        self.apiGroupsloaded = ko.observable(false);
        self.showList = ko.observable(false);
        self.cancelButtonFlag = ko.observable(true);
        self.dataSource = ko.observable();
        self.groups = ko.observableArray();
        self.updatedgroups = ko.observableArray();

        self.groupName = ko.observable([{
            groupCode: self.Nls.all,
            groupDescription: self.Nls.all
        }]);

        self.selectedGroup = ko.observable();

        self.showGroupPatameters = function(event) {
            self.viewDto = event.data;
            rootParams.dashboard.loadComponent("api-group-view", self);
        };

        self.showServiceDetails = function(event) {
            APIGroupSearchModel.getGroupDetails(event.data.groupCode).then(function(data) {
                self.dto = data.listResponse;

                if (data.listResponse.length === 0) {
                    $("#errormessagewindow").trigger("openModal");
                } else {
                    rootParams.dashboard.loadComponent("api-builder-group-view", self);
                }
            });
        };

        self.closeModal = function() {
            $("#errormessagewindow").trigger("closeModal");
        };

        self.create = function() {
            rootParams.dashboard.loadComponent("api-group-create", self);
        };

        self.search = function() {
            if (self.selectedGroup().toUpperCase() === "ALL") {
                self.dataSource(new oj.ArrayTableDataSource(self.groups, {
                    idAttribute: "groupCode"
                }));
            } else if (self.selectedGroup()) {
                self.updatedgroups.removeAll();

                ko.utils.arrayForEach(self.groupName(), function(item) {
                    if (self.selectedGroup() === item.groupCode) {
                        self.updatedgroups().push(item);
                    }
                });

                self.dataSource(new oj.ArrayTableDataSource(self.updatedgroups, {
                    idAttribute: "groupCode"
                }));
            }

            self.showList(true);
            self.cancelButtonFlag(false);
        };

        if (rootParams.rootModel.params.params && rootParams.rootModel.params.params.selectedGroup) {
            self.selectedGroup(rootParams.rootModel.params.params.selectedGroup());

            APIGroupSearchModel.getApiGroups().then(function(data) {
                ko.utils.arrayForEach(data.apiGroupList, function(item) {
                    self.groupName().push(item);
                    self.groups().push(item);
                });

                self.apiGroupsloaded(true);
                self.search();
            });
        } else {
            APIGroupSearchModel.getApiGroups().then(function(data) {
                ko.utils.arrayForEach(data.apiGroupList, function(item) {
                    self.groupName().push(item);
                    self.groups().push(item);
                });

                self.apiGroupsloaded(true);
            });
        }

        self.onClickCancel = function() {
            rootParams.dashboard.switchModule();
        };

        self.onClickBack = function() {
            self.selectedGroup("");
            self.showList(false);
            self.cancelButtonFlag(true);
        };
    };
});