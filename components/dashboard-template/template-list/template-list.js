define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/template-list",
    "./model",
    "ojs/ojtable", "ojs/ojknockout", "ojs/ojarraydataprovider",
    "ojs/ojarraytabledatasource", "ojs/ojradioset", "ojs/ojbutton", "ojs/ojlabel"
], function(oj, ko, locale, model) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        params.dashboard.headerName(locale.pageHeader);
        self.resourceBundle = locale;

        self.selectSegment = ko.observable();
        self.menuSelection = ko.observable("dashboard");
        self.segmentList = ko.observable();
        self.enterpriseRolesLoaded = ko.observable(false);

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        self.menuOptions = ko.observableArray([{
                id: "dashboard",
                label: self.resourceBundle.titles.design
            },
            {
                id: "mapping",
                label: self.resourceBundle.titles.mapping
            }
        ]);

        const masterDashboardList = [];

        self.dashboardList = ko.observableArray();

        self.datasource = new oj.ArrayDataProvider(self.dashboardList, {
            idAttribute: "dashboardId"
        });

        params.baseModel.registerComponent("dashboard-create", "dashboard-template");
        params.baseModel.registerComponent("image-caption", "dashboard-template");
        params.baseModel.registerComponent("view-dashboard-design", "dashboard-template");
        params.baseModel.registerComponent("select-persona", "dashboard-template");
        params.baseModel.registerComponent("dashboard-mapping", "dashboard-template");
        params.baseModel.registerComponent("dashboard-mapping-list", "dashboard-template");

        function getDashboardList(segment) {
            return model.getDashboardList(segment).then(function(data) {
                masterDashboardList.length = 0;

                data.dashboardDTOs.forEach(function(element) {
                    masterDashboardList.push(element);
                });

                self.dashboardList(data.dashboardDTOs);
            });
        }

        model.getEnterpriseRoles().then(function(data) {
            if (data.enterpriseRoleDTOs && data.enterpriseRoleDTOs.length > 0) {
                self.segmentList(data.enterpriseRoleDTOs);
                self.selectSegment(data.enterpriseRoleDTOs[0].enterpriseRoleId);
            }
        }).then(function() {
            return getDashboardList(self.selectSegment());
        }).then(function() {
            self.enterpriseRolesLoaded(true);
        });

        self.selectSegment.subscribe(getDashboardList);

        self.createDashboard = function() {
            params.dashboard.loadComponent("select-persona", {
                data: {
                    selectSegment: self.selectSegment()
                },
                mode: "create"
            });
        };

        self.viewDashboard = function(data) {
            data.selectSegment = self.selectSegment();

            params.dashboard.loadComponent("view-dashboard-design", {
                data: data
            });
        };

        self.columnArray = [{
            headerText: self.resourceBundle.tableHeaders.dashboardName,
            field: "dashboardName"
        }, {
            headerText: self.resourceBundle.tableHeaders.dashboardDesc,
            field: "dashboardDescription"
        }, {
            headerText: self.resourceBundle.tableHeaders.dashboardClass,
            field: "dashboardClass",
            template: "moduleName"
        }, {
            headerText: self.resourceBundle.tableHeaders.dashboardClassValue,
            field: "dashboardClassValue"
        }, {
            headerText: self.resourceBundle.tableHeaders.dateCreated,
            field: "creationDate",
            template: "formattedDate"
        }, {
            headerText: self.resourceBundle.tableHeaders.actions,
            template: "theme-actions"
        }];

        self.createTemplateMapping = function() {
            params.dashboard.loadComponent("dashboard-mapping", {
                mode: "create",
                data: {
                    dashboards: masterDashboardList
                }
            });
        };

        self.setDefaultDashboard = function(data) {
            model.applyDashboard(data.dashboardId).then(function(data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr
                }, self);
            });
        };

        self.dashboardMapping = function() {
            params.dashboard.loadComponent("dashboard-mapping-list", {
                mode: "create"
            });
        };

        self.searchDashboards = function(event) {
            self.dashboardList.removeAll();

            ko.utils.arrayPushAll(self.dashboardList, masterDashboardList.filter(function(element) {
                return element.dashboardName.toLowerCase().indexOf(event.detail.value.toLowerCase()) > -1;
            }));
        };
    };
});