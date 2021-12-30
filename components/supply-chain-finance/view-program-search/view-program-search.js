define([
    "./model",
    "ojL10n!resources/nls/view-program-search",
    "knockout",
    "ojs/ojcore",
    "jquery",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojpagingcontrol"
], function (Model, resourceBundle, ko, oj, $) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.selectedRole = ko.observable("B");
        self.fetchedProgramTypes = ko.observableArray();
        self.programTypesLoaded = ko.observable(false);

        self.queryParameter = ko.observable({
            criteria: []
        });

        self.sortByParameter = ko.observableArray();
        self.count = ko.observable();
        self.fetchedCounterparties = ko.observableArray();
        self.counterpartiesLoaded = ko.observable(false);
        self.programName = ko.observable();
        self.programCode = ko.observable();
        self.programType = ko.observable();
        self.associatedPartyId = ko.observable();
        self.fetchedPrograms = ko.observableArray();
        self.programsListLoaded = ko.observable(false);
        self.partyDetails = ko.observable();
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        self.showList = ko.observable(true);
        self.activeLayout = ko.observable("thumbView");
        params.baseModel.registerComponent("program-details-view", "supply-chain-finance");
        params.baseModel.registerComponent("program-management-global", "supply-chain-finance");

        self.layoutViewRadios = [{
                id: "thumbView",
                icon: "oj-fwk-icon-grid oj-fwk-icon",
                label: "thumbView"
            },
            {
                id: "listView",
                icon: "oj-fwk-icon-list oj-fwk-icon",
                label: "listView"
            }
        ];

        if (params.rootModel.params.role) {
            self.selectedRole(params.rootModel.params.role);
        }

        if (params.rootModel.previousState) {
            self.selectedRole(params.rootModel.previousState.selectedRole);
        }

        Model.programTypesget(JSON.stringify(self.queryParameter()), JSON.stringify(self.sortByParameter()), self.count()).then(function (response) {
            self.fetchedProgramTypes(response.programProducts);
            self.programTypesLoaded(true);
        });

        self.queryParameter().criteria.push({
            operand: "relation",
            operator: "ENUM",
            value: ["BOTH"]
        });

        Model.counterPartiesget(JSON.stringify(self.queryParameter()), JSON.stringify(self.sortByParameter()), self.count()).then(function (response) {
            for (let i = 0; i < response.associatedParties.length; i++) {
                self.fetchedCounterparties.push({
                    code: response.associatedParties[i].id.value,
                    label: response.associatedParties[i].name
                });
            }

            self.counterpartiesLoaded(true);
        });

        self.setProgramQueryParameters = function () {
            self.queryParameter().criteria = [];

            if (self.programName()) {
                self.queryParameter().criteria.push({
                    operand: "programKey.programName",
                    operator: "CONTAINS",
                    value: [self.programName()]
                });
            }

            if (self.programCode()) {
                self.queryParameter().criteria.push({
                    operand: "programKey.programCode",
                    operator: "CONTAINS",
                    value: [self.programCode()]
                });
            }

            if (self.selectedRole()) {
                self.queryParameter().criteria.push({
                    operand: "role",
                    operator: "ENUM",
                    value: [self.selectedRole()]
                });
            }

            if (self.programType()) {
                self.queryParameter().criteria.push({
                    operand: "programProduct.programProductKey.productCode",
                    operator: "EQUALS",
                    value: [self.programType()]
                });
            }

            if (self.associatedPartyId()) {
                self.queryParameter().criteria.push({
                    operand: "associatedPartyList.associatedPartyKey.id",
                    operator: "EQUALS",
                    value: [self.associatedPartyId()]
                });
            }

            self.sortByParameter().push({
                sortBy: "programKey.programName",
                sortOrder: "ASC"
            });
        };

        self.getUserRole = function (relation, role) {

            const jsonDataRole = self.nls.Role,
                jsonDataRelation = self.nls.Relation;

            return params.baseModel.format(self.nls.userRoleToDisplay, {
                userRelation: jsonDataRelation[relation] ? jsonDataRelation[relation] : "-",
                userRole: jsonDataRole[role] ? jsonDataRole[role] : "-"
            });
        };

        self.convertStatus = function (status) {

            const jsonDataStatus = self.nls.Status;

            return jsonDataStatus[status] ? jsonDataStatus[status] : jsonDataStatus.OTHERS;
        };

        self.calculateClass = function (status) {

            return status.toLowerCase();
        };

        self.setProgramQueryParameters();

        if (params.rootModel.previousState) {
            self.programCode(params.rootModel.previousState.programCode);
            self.programName(params.rootModel.previousState.programName);
            self.programType(params.rootModel.previousState.programType);
            self.associatedPartyId(params.rootModel.previousState.associatedPartyId);
            self.queryParameter(params.rootModel.previousState.queryParameter);
        }

        Model.programsget(JSON.stringify(self.queryParameter()), JSON.stringify(self.sortByParameter()), self.count()).then(function (response) {

            if (response.programs !== null) {
                self.fetchedPrograms(response.programs);

                self.fetchedPrograms().forEach(function (data) {
                    data.noOfAssociatedParties = data.associatedParties.length;
                    data.userRole = self.getUserRole(data.relation, data.role);
                    data.status = self.convertStatus(data.status);
                    data.statusClass = self.calculateClass(data.status);
                });

                self.programsListLoaded(true);
            }
        });

        Model.mepartyget().then(function (response) {
            self.partyDetails(response);
            self.partyId(self.partyDetails().party.id.displayValue);
            self.partyName(self.partyDetails().party.personalDetails.fullName);
        });

        self.dataSource16 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.fetchedPrograms, {
            idAttribute: "programCode"
        }));

        self.dataSource34 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.fetchedPrograms, {
            idAttribute: "programCode"
        }));

        self.loadCreateProgram = function () {
            params.dashboard.loadComponent("program-management-global", {});
        };

        self.viewButtonSetValueChange = function () {
            if (self.showList()) {
                self.showList(false);
            } else {
                self.showList(true);
            }
        };

        self.roleButtonValueChange = function () {
            self.setProgramQueryParameters();

            Model.programsget(JSON.stringify(self.queryParameter()), JSON.stringify(self.sortByParameter()), self.count()).then(function (response) {
                self.programsListLoaded(false);
                ko.tasks.runEarly();

                if (response.programs !== null) {
                    self.fetchedPrograms(response.programs);

                    self.fetchedPrograms().forEach(function (data) {
                        data.noOfAssociatedParties = data.associatedParties.length;
                        data.userRole = self.getUserRole(data.relation, data.role);
                        data.status = self.convertStatus(data.status);
                        data.statusClass = self.calculateClass(data.status);
                    });

                    self.programsListLoaded(true);
                }
            });
        };

        const roleButtonSubscriber = self.selectedRole.subscribe(self.roleButtonValueChange),
            viewButtonSetSubscriber = self.activeLayout.subscribe(self.viewButtonSetValueChange);

        self.onClickSearch = function () {
            self.setProgramQueryParameters();

            Model.programsget(JSON.stringify(self.queryParameter()), JSON.stringify(self.sortByParameter()), self.count()).then(function (response) {
                self.programsListLoaded(false);
                ko.tasks.runEarly();

                if (response.programs !== null) {
                    self.fetchedPrograms(response.programs);

                    self.fetchedPrograms().forEach(function (data) {
                        data.noOfAssociatedParties = data.associatedParties.length;
                        data.userRole = self.getUserRole(data.relation, data.role);
                        data.status = self.convertStatus(data.status);
                        data.statusClass = self.calculateClass(data.status);
                    });

                    self.programsListLoaded(true);
                }
            });
        };

        self.onClickClear = function () {
            self.programName(null);
            self.programCode(null);
            self.programType(null);
            self.associatedPartyId(null);
        };

        self.onClickProgramName = function (data) {
            params.dashboard.loadComponent("program-details-view", {
                programId: data.programCode,
                selectedRole: self.selectedRole(),
                programCode: self.programCode(),
                programName: self.programName(),
                programType: self.programType(),
                associatedPartyId: self.associatedPartyId(),
                queryParameter: self.queryParameter()
            });
        };

        self.onHoverEvent = function (x, z) {
            const y = document.getElementById(x + "_hover");

            if(z.fromElement && z.fromElement.id === y.id) {
                $(y).removeClass("hover-color");
            } else {
                $(y).addClass("hover-color");
            }
        };

        self.dispose = function () {
            roleButtonSubscriber.dispose();
            viewButtonSetSubscriber.dispose();
        };
    };
});