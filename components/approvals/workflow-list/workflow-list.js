define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/workflow",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(oj, ko, $, WorkflowSearchModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.searchWorkflowList = ko.observableArray();
        rootParams.dashboard.headerName(self.nls.workflow.workflowDetails);
        self.userType = ko.observable("");

        self.datasource = self.datasource || ko.observableArray([]);

        self.dataLoaded = self.dataLoaded || ko.observable(false);

        self.nls = resourceBundle;
        self.partyIdFetched = self.partyIdFetched || ko.observable(false);
        self.mode = "";
        self.validationTracker = ko.observable();

        self.backLabel = self.nls.generic.common.back;
        self.cancel = self.nls.generic.common.cancel;
        self.createNewLabel = self.nls.common.createNew;
        self.workflowCodeLabel = self.nls.workflow.workflowCode;
        self.workflowDescriptionLabel = self.nls.workflow.workflowDescription;
        self.workflowApprovalLevels = self.nls.workflow.approvalLevels;
        self.partyIdAvailable = null;
        self.partyIdDisplayValue = null;
        self.partyDetailsFromApprovalNavBar = rootParams.rootModel.partyDetailsFromApprovalNavBar;

        let partyList;

        self.setDatasource = function () {
            self.dataLoaded(false);
            ko.tasks.runEarly();

            self.datasource = new oj.ArrayTableDataSource(partyList, {
                idAttribute: "workFlowId"
            });

            self.dataLoaded(true);
        };

          self.fetchMeData = function () {
            if (self.partyIdAvailable) {
                self.rootModelInstance().approvals.party.value(self.partyIdAvailable);
                self.partyIdFetched(true);

                WorkflowSearchModel.fetchMeWithParty().then(function (dataName) {
                    if (dataName.party.personalDetails.fullName) {
                        self.rootModelInstance().approvals.partyName(dataName.party.personalDetails.fullName);
                        self.rootModelInstance().approvals.partyDetailsFetched(true);
                        self.rootModelInstance().approvals.party.displayValue(self.partyIdDisplayValue);
                    }
                });
            } else {
                self.rootModelInstance().approvals.party.value(null);
                self.rootModelInstance().approvals.party.displayValue(null);
                self.rootModelInstance().approvals.partyName(null);
            }
        };

        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("workflow-view", "approvals");

        const getNewKoModel = function() {
            const KoModel = WorkflowSearchModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = self.rootModelInstance || ko.observable(getNewKoModel());

        const partyId = {};

        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;

        if (partyId.value) {
            self.rootModelInstance().approvals.party.value(partyId.value);
            self.rootModelInstance().approvals.party.displayValue(partyId.displayValue);
            self.rootModelInstance().approvals.partyDetailsFetched(true);
            self.partyIdFetched(true);
        }

        self.partyDetails = self.rootModelInstance().approvals;

        self.createNew = function() {
            self.mode = "CREATE";

            const data = {};

            data.partyDetails = self.rootModelInstance().approvals;

            rootParams.dashboard.loadComponent("workflow-view", {
                partyDetails: ko.toJS(data.partyDetails),
                mode: ko.toJS(self.mode),
                approvalUser: ko.toJS(rootParams.rootModel.params.approvalUser)
            });
        };

        self.viewWorkflow = function(workflowId) {
            if (workflowId) {
                WorkflowSearchModel.searchWorkflow("approvalWorkflows/" + workflowId).then(function(data) {
                    const context = data;

                    context.mode = ko.observable("VIEW");
                    self.mode = "VIEW";

                    rootParams.dashboard.loadComponent("workflow-view", {
                        mode: ko.toJS(self.mode),
                        data: ko.toJS(data.workFlowDetails),
                        partyDetails: ko.toJS(self.partyDetails),
                        approvalUser: ko.toJS(rootParams.rootModel.params.approvalUser)
                    });
                });
            }
        };

        if (!self.partyDetailsFromApprovalNavBar.value) {
            self.partyIdFetched(true);
        } else {
            self.partyIdAvailable = self.partyDetailsFromApprovalNavBar.value;
            self.partyIdDisplayValue = self.partyDetailsFromApprovalNavBar.displayValue;
            self.fetchMeData();
        }

        self.back = function() {
            self.rootModelInstance().approvals.partyDetailsFetched(false);
            self.rootModelInstance().approvals.party.value("");
            self.rootModelInstance().approvals.party.displayValue("");
            self.rootModelInstance().approvals.partyName("");
            self.rootModelInstance().approvals.additionalDetails("");
        };

        self.cancelSearch = function() {
            rootParams.dashboard.switchModule();
        };

        self.loadWorkflows = function(searchURL) {
            WorkflowSearchModel.searchWorkflow(searchURL).then(function(data) {
                const partyData = $.map(data.workFlowDTOs, function(workflowData) {
                    workflowData.approvalCount = workflowData.steps.length;
                    workflowData.partyDetails = self.partyDetails;
                    workflowData.mode = "";

                    return workflowData;
                });

                partyList = partyData;
                self.setDatasource();
            });
        };

        //if corpadmin is the case then mandatorily load workflow
        if (rootParams.dashboard.userData.userProfile.partyId.value && rootParams.dashboard.userData.userProfile.partyId.value !== null) {
            self.searchUrl = ko.computed(function() {
                return "approvalWorkflows?partyId=" + self.partyDetails.party.value();
            });

            self.dispose = function() {
                self.searchUrl.dispose();
            };

            self.loadWorkflows(self.searchUrl());
        }

        const partyDetailsFetchedSubscriptions = self.rootModelInstance().approvals.partyDetailsFetched.subscribe(function(newValue) {
            if (newValue) {
                if (self.rootModelInstance().workflowSearch.name() !== null && self.rootModelInstance().workflowSearch.name() !== "") {
                    self.searchUrl = ko.computed(function() {
                        return "approvalWorkflows?partyId=" + self.partyDetails.party.value() + "&workflowName=" + self.rootModelInstance().workflowSearch.name();
                    });

                    self.dispose = function() {
                        self.searchUrl.dispose();
                    };
                } else {
                    self.searchUrl = ko.computed(function() {
                        return "approvalWorkflows?partyId=" + self.partyDetails.party.value();
                    });

                    self.dispose = function() {
                        self.searchUrl.dispose();
                    };
                }

                self.loadWorkflows(self.searchUrl());
            }
        });

        self.dispose = function() {
            partyDetailsFetchedSubscriptions.dispose();
        };

        self.onWorkflowSelected = function(data, event) {
            if (rootParams.baseModel.small()) {
                self.goToMap(data);
            } else if (event.option === "currentRow") {

                self.datasource.data[event.value.rowIndex].mode = "VIEW";
                self.goToMap(self.datasource.data[event.value.rowIndex]);
            }
        };

        self.onWorkflowSelected_1 = function(data) {
            if (rootParams.baseModel.small()) {
                self.goToMap(data);
            } else if (data) {
                self.goToMap(data);
            }
        };

        self.goToMap = function(data) {
            data.mode = "VIEW";
            self.mode = "VIEW";
            data.partyDetails = self.rootModelInstance().approvals;

            rootParams.dashboard.loadComponent("workflow-view", {
                data: ko.toJS(data)
            });
        };

        self.reset = function() {
            self.partyDetails.partyId(null);
            self.partyDetails.partyName(null);
            self.partyDetails.partyDetailsFetched(false);
        };
    };
});