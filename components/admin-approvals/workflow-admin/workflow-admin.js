define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/workflow-admin-approvals",
    "ojs/ojinputtext",
    "ojs/ojradioset"
], function(ko, WorkflowValidateModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resourceBundle = resourceBundle;
        rootParams.baseModel.registerComponent("workflow-admin-create", "admin-approvals");
        rootParams.baseModel.registerComponent("workflow-admin-search", "admin-approvals");
        rootParams.baseModel.registerComponent("workflow-admin-view", "admin-approvals");
        rootParams.baseModel.registerComponent("workflow-admin-list", "admin-approvals");
        rootParams.baseModel.registerElement("action-header");
        rootParams.dashboard.headerName(self.resourceBundle.workflow.adminWorkflowDetails);
        self.validationTracker = ko.observable();
        self.mode = "";
        self.validationTrackers = ko.observable();
        self.createWorkflow = ko.observable();
        self.searchWorkflow = ko.observable();

        const getNewKoModel = function() {
            const KoModel = WorkflowValidateModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = ko.observable(getNewKoModel());
        self.workflowDetails = self.rootModelInstance().approvals;

        self.createNew = function() {
            self.mode = "CREATE";
            rootParams.dashboard.loadComponent("workflow-admin-view", {});
        };

        self.reset = function() {
            self.workflowDetails.workflowName(null);
            self.workflowDetails.workflowDescription(null);
            self.workflowDetails.workflowDetailsFetched(false);
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule();
        };
    };
});