define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/workflow-admin-approvals",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(oj, ko, $, WorkflowSearchModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resourceBundle = resourceBundle;
        self.searchWorkflowList = ko.observableArray();
        rootParams.dashboard.headerName(self.resourceBundle.workflow.adminWorkflowDetails);
        self.userType = ko.observable("");
        self.dataLoaded = ko.observable(false);
        self.datasource = {};
        self.mode = "";
        self.validationTracker = ko.observable();
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("workflow-admin-view", "admin-approvals");

        const getNewKoModel = function() {
            const KoModel = WorkflowSearchModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.createNew = function() {
            self.mode = "CREATE";

            const data = {};

            data.partyDetails = self.rootModelInstance().approvals;

            rootParams.dashboard.loadComponent("workflow-admin-view", {
                partyDetails: ko.toJS(data.partyDetails),
                mode: ko.toJS(self.mode),
                approvalUser: ko.toJS(rootParams.rootModel.params.approvalUser)
            });
        };

        self.rootModelInstance = ko.observable(getNewKoModel());
        self.workflowDetails = rootParams.rootModel.workflowDetails;

        self.fetchWorkflowDetailsCode = function() {
            if (!self.workflowDetails.workflowName() && !self.workflowDetails.workflowDescription()) {
                rootParams.baseModel.showMessages(null, [self.resourceBundle.info.noDescription], "ERROR");

                return;
            }

            WorkflowSearchModel.searchWorkflow(self.workflowDetails.workflowName(), self.workflowDetails.workflowDescription()).then(function(data) {
                const workflowCodeData = $.map(data.workFlowDTOs, function(workflowData) {
                    workflowData.approvalCount = workflowData.steps.length;
                    workflowData.workflowDetails = self.workflowDetails;
                    workflowData.mode = "";
                    self.workflowDetails.name = workflowData.name;
                    self.workflowDetails.workflowDescription = workflowData.description;
                    self.workflowDetails.version = workflowData.version;

                    return workflowData;
                });

                if (workflowCodeData.length > 0) {
                    self.datasource = new oj.ArrayTableDataSource(workflowCodeData, {
                        idAttribute: "workFlowId"
                    });

                    self.dataLoaded(true);
                } else {
                    self.dataLoaded(false);
                    rootParams.baseModel.showMessages(null, [self.resourceBundle.info.noRecordFound], "INFO");
                }
            });
        };

        self.onWorkflowSelected = function(data) {
            self.mode = "VIEW";

            rootParams.dashboard.loadComponent("workflow-admin-view", {
                workFlowId: ko.toJS(data),
                partyDetails: ko.toJS(self.rootModelInstance().approvals),
                mode: ko.toJS(self.mode),
                approvalUser: ko.toJS(rootParams.rootModel.params.approvalUser),
                workflowDetails: ko.toJS(self.workflowDetails)
            });
        };

        self.goToMap = function(data) {
            data.mode = "VIEW";
            self.mode = "VIEW";
            data.partyDetails = self.rootModelInstance().approvals;

            rootParams.dashboard.loadComponent("workflow-admin-view", {
                data: ko.utils.unwrapObservable(data),
                mode: self.mode
            });
        };

        self.back = function() {
            history.back();
        };

        self.clear = function() {
            self.workflowDetails.workflowName(null);
            self.workflowDetails.workflowDescription(null);
            self.workflowDetails.workflowDetailsFetched(false);
            self.dataLoaded(false);
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule();
        };
    };
});