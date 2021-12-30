define([
    "knockout",
    "ojL10n!resources/nls/select-persona",
    "./model", "load!./dashboardTypes.json", "ojs/ojknockout", "ojs/ojvalidationgroup", "ojs/ojcheckboxset", "ojs/ojlabel"
], function(ko, locale, Model, DashboardTypes) {
    "use strict";

    const vm = function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        params.baseModel.registerElement("page-section");
        params.dashboard.headerName(locale.pageHeader);
        self.nls = locale;
        self.validationTracker = ko.observable();

        self.selectedEnterpriseRole = ko.observable().extend({
            notify: "always"
        });

        self.enterpriseRolesLoaded = ko.observable(false);
        self.selectedMenuValue = ko.observable();
        self.segmentRoles = ko.observableArray();
        self.applicationRoles = ko.observableArray();
        self.segmentList = ko.observable();
        self.menuSelection = ko.observable();
        self.selectedSegmentHeader = ko.observable(self.nls.segmentHeader);
        self.designChoice = ko.observableArray();
        self.disableOthers = ko.observable(false);
        self.currentSegmentRole = ko.observable();
        self.dashboardName = ko.observable();
        self.dashboardDesc = ko.observable();

        if (params.rootModel.previousState) {
            self.menuSelection(params.rootModel.previousState.data.segment);
            self.designChoice([].concat(params.rootModel.previousState.data.designChoice));
            self.dashboardName(params.rootModel.previousState.data.name);
            self.dashboardDesc(params.rootModel.previousState.data.desc);
        }

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        self.menuOptions = DashboardTypes.types.map(function(element) {
            return {
                id: element,
                label: self.nls.dashboardClass[element]
            };
        });

        Model.getEnterpriseRoles().then(function(data) {
            if (data.enterpriseRoleDTOs) {
                self.segmentList(data.enterpriseRoleDTOs);

                self.selectedEnterpriseRole(self.segmentList()[0].enterpriseRoleId);

                self.enterpriseRolesLoaded(true);
            }
        });

        params.baseModel.registerElement("nav-bar");

        /**
         * Function fetches modules based on the segment selected.
         *
         * @function fetchModules
         * @param {string} selectedMenuItem - Value of selectedMenuItem.
         * @param {string} selectedSegment - Value of selectedSegment.
         * @returns {Array} - List of segment roles.
         **/
        function fetchModules(selectedMenuItem, selectedSegment) {
            self.segmentRoles.removeAll();

            if (selectedMenuItem === "SEGMENT") {
                Model.getSegmentRoles(selectedSegment).then(function(data) {
                    if (data.segmentdtos && data.segmentdtos.length > 0) {
                        data.segmentdtos.forEach(function(item) {
                            self.segmentRoles.push({
                                name: item.name,
                                code: item.code,
                                roles: item.roles
                            });
                        });
                    }
                });

                self.selectedSegmentHeader(self.nls.segmentHeader);
            } else if (selectedMenuItem === "APPLICATION_ROLE") {
                Model.getApplicationRoles(selectedSegment).then(function(data) {
                    self.applicationRoles(data.applicationRoleDTOs);

                    if (data.applicationRoleDTOs && data.applicationRoleDTOs.length > 0) {
                        data.applicationRoleDTOs.forEach(function(role) {
                            if (self.segmentRoles().indexOf(role.applicationRoleName) === -1) {
                                self.segmentRoles.push({
                                    name: role.applicationRoleDisplayName,
                                    code: role.applicationRoleName
                                });
                            }
                        });
                    }
                });

                self.selectedSegmentHeader(self.nls.appRoleHeader);
            } else if (selectedMenuItem === "MODULE") {
                Model.getDashboardList(self.selectedEnterpriseRole()).then(function(data) {
                    data.dashboardDTOs.filter(function(item) {
                        return item.factory;
                    }).forEach(function(role) {
                        self.segmentRoles.push({
                            code: role.dashboardClassValue,
                            name: role.dashboardName
                        });
                    });
                });

                self.selectedSegmentHeader(self.nls.selectModule);
            } else {
                setTimeout(function() {
                    self.segmentList().forEach(function(item) {
                        self.segmentRoles.push({
                            name: item.enterpriseRoleName,
                            code: item.enterpriseRoleId
                        });
                    });
                }, 100);

                self.selectedSegmentHeader(self.nls.userHeader);
            }
        }

        self.menuSelection.subscribe(function(newValue) {
            self.selectedEnterpriseRole(newValue === "USER_TYPE" ? null : self.segmentList()[0].enterpriseRoleId);
        });

        self.selectedEnterpriseRole.subscribe(function(newValue) {
            fetchModules(self.menuSelection(), newValue);
        });

        let dashboardStructure;

        self.createDashboard = function(module) {
            Model.fetchDashboardDesign(self.selectedEnterpriseRole().toUpperCase(), module).then(function(data) {
                dashboardStructure = data.dashboardDTO.layout;

                params.dashboard.loadComponent("dashboard-create", {
                    mode: "create",
                    ownDashboard: false,
                    data: {
                        module: module,
                        segment: self.selectedEnterpriseRole()
                    },
                    dashboardStructure: dashboardStructure
                });
            });
        };

        self.createRoleDashboard = function(module, enterpriseRole, code, roles) {
            params.dashboard.loadComponent("dashboard-create", {
                mode: "create",
                ownDashboard: false,
                data: {
                    module: module,
                    selectedEnterpriseRole: enterpriseRole || code,
                    segment: self.menuSelection(),
                    appRoles: self.applicationRoles(),
                    selectedSegment: code,
                    roles: roles
                }
            });
        };

        self.createDashboardDesign = function() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker")) || !self.menuSelection()) {
                if (!self.menuSelection()) {
                    params.baseModel.showMessages(null, [self.nls.invalidDashboardType], "ERROR");
                }

                return;
            }

            const module = self.segmentRoles().find(function(data) {
                return data.code === self.currentSegmentRole();
            });

            params.dashboard.loadComponent("dashboard-create", {
                mode: "create",
                ownDashboard: false,
                data: {
                    dashboardName: self.dashboardName(),
                    dashboardDescription: self.dashboardDesc(),
                    module: module.code,
                    segment: self.menuSelection(),
                    selectedEnterpriseRole: self.selectedEnterpriseRole() || module.code,
                    selectedSegment: module.code,
                    designChoice: self.designChoice()
                }
            });
        };
    };

    return vm;
});