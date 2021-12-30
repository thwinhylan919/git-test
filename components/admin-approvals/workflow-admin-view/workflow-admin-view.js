define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/workflow-admin-approvals",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup"
], function(oj, ko, WorkflowViewModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.datasource = new oj.ArrayTableDataSource([]);
        self.userID = ko.observable("");
        self.resourceBundle = resourceBundle;
        self.actionHeaderheading = ko.observable();
        self.mode = ko.observable(rootParams.rootModel.params.mode);
        self.transactionName = ko.observable();
        rootParams.dashboard.headerName(self.resourceBundle.workflow.adminWorkflowDetails);
        self.workflowCode = ko.observable(self.name);
        self.version = ko.observable();
        self.workflowDescription = ko.observable();
        rootParams.baseModel.registerElement("confirm-screen");
        self.workflowDetails = ko.observable();
        self.prevMode = ko.observable();
        self.userList = ko.observableArray();
        self.userListLoaded = ko.observable(false);
        self.selectedUser = ko.observable();
        self.validationTracker = ko.observable();
        self.workflowDetailsLoaded = ko.observable(false);
        self.showInitiators = ko.observable(true);
        self.userInputModel = ko.observableArray([]);
        rootParams.baseModel.registerComponent("user-input", "common");
        rootParams.baseModel.registerElement("modal-window");
        self.statusMessage = ko.observable();
        self.approvalUser = rootParams.rootModel.params.approvalUser;

        const getNewKoModel = function() {
            const KoModel = WorkflowViewModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = ko.observable(getNewKoModel());
        self.httpStatus = ko.observable();
        self.transactionStatus = ko.observable();
        self.groupValid = ko.observable();

        self.viewFunction = function() {
            if (self.params.workFlowId) {
                WorkflowViewModel.readWorkflow(self.params.workFlowId).then(function(data) {
                    self.workflowDetails(data.workFlowDetails);
                    self.workflowCode(data.workFlowDetails.name);
                    self.version(data.workFlowDetails.version);
                    self.workflowDescription(data.workFlowDetails.description);

                    if (self.mode() !== "CREATE") {
                        self.userInputModel.removeAll();

                        for (let i = 0; i < self.workflowDetails().steps.length; i++) {
                            if (i > 0) {
                                let sequenceNo = self.sequenceNo();

                                self.rootModelInstance().workflowPayload.steps.push(ko.mapping.fromJS({
                                    sequenceNo: sequenceNo,
                                    userGroup: {
                                        id: null,
                                        name: null,
                                        partyId: null,
                                        unary: null,
                                        users: [{
                                            userId: null,
                                            firstName: null,
                                            lastName: null
                                        }]
                                    }
                                }));

                                sequenceNo++;
                                self.sequenceNo(sequenceNo);
                            }

                            if (self.workflowDetails().steps[i].userGroup.unary) {
                                self.userInputModel.push({
                                    useCase: "DEFAULT",
                                    selectedUser: self.workflowDetails().steps[i].userGroup.users[0].userId,
                                    selectedUserGroup: null,
                                    buttonSet: "USER",
                                    userType: "ADMIN",
                                    customLabel: true,
                                    labelDisplay: ko.observable(rootParams.baseModel.format(self.resourceBundle.workflow.level, {
                                        level: self.workflowDetails().steps[i].sequenceNo
                                    })),
                                    useMode: "modify",
                                    additionalDetails: null,
                                    mode: ko.observable("review")
                                });
                            } else {
                                self.userInputModel.push({
                                    useCase: "DEFAULT",
                                    selectedUser: null,
                                    selectedUserGroup: self.workflowDetails().steps[i].userGroup.id,
                                    buttonSet: "USERGROUP",
                                    userType: "ADMIN",
                                    customLabel: true,
                                    labelDisplay: ko.observable(rootParams.baseModel.format(self.resourceBundle.workflow.level, {
                                        level: self.workflowDetails().steps[i].sequenceNo
                                    })),
                                    useMode: "modify",
                                    additionalDetails: null,
                                    mode: ko.observable("review")
                                });
                            }
                        }

                        const nextSequenceNo = self.userInputModel().length + 1;

                        self.sequenceNo(nextSequenceNo);
                    }

                    self.workflowDetailsLoaded(true);
                });
            } else {
                self.workflowDetailsLoaded(true);
            }
        };

        function checkHash() {
            if (self.mode() === "EDIT") {
                rootParams.dashboard.headerName(self.resourceBundle.workflow.adminWorkflowDetails);
                self.actionHeaderheading(self.resourceBundle.generic.common[self.mode().toLowerCase()]);
            } else if (self.mode() === "VIEW") {
                rootParams.dashboard.headerName(self.resourceBundle.workflow.adminWorkflowDetails);
                self.viewFunction();
                self.actionHeaderheading(self.resourceBundle.approvals.headers[self.mode().toLowerCase()]);
            } else if (self.mode() === "CREATE") {
                rootParams.dashboard.headerName(self.resourceBundle.workflow.adminWorkflowDetails);
                self.viewFunction();

                if (self.prevMode() === "REVIEW") {
                    for (let j = 0; j < self.userInputModel().length; j++) {
                        self.userInputModel()[j].useMode = "modify";
                    }
                }

                self.actionHeaderheading(self.resourceBundle.generic.common[self.mode().toLowerCase()]);
            } else if (self.mode() === "REVIEW") {
                rootParams.dashboard.headerName(self.resourceBundle.workflow.adminWorkflowDetails);
                self.actionHeaderheading(self.resourceBundle.approvals.headers[self.mode().toLowerCase()]);
            }
        }

        checkHash();

        self.editReview = function() {
            self.prevMode(self.mode());
            history.back();
        };

        self.back = function() {
            if (self.mode() === "VIEW" || self.mode() === "CREATE") {
                history.go(-2);
            } else {
                history.back();
            }
        };

        self.confirm = function() {
            if (self.prevMode() === "EDIT") {
                self.transactionName(self.resourceBundle.workflow.modifyWorkflow);
                self.rootModelInstance().workflowPayload.name = self.workflowCode();
                self.rootModelInstance().workflowPayload.version = self.version();
                self.rootModelInstance().workflowPayload.description = self.workflowDescription();
                self.rootModelInstance().workflowPayload.workFlowId = self.params.workFlowId;

                WorkflowViewModel.updateWorkflow(ko.mapping.toJSON(self.rootModelInstance().workflowPayload), self.rootModelInstance().workflowPayload.workFlowId).then(function(data) {
                    self.mode("SUCCESS");
                    checkHash();

                    rootParams.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        transactionName: self.transactionName()
                    });
                });
            } else if (self.prevMode() === "CREATE") {
                self.transactionName(self.resourceBundle.workflow.createWorkflow);
                self.rootModelInstance().workflowPayload.name = self.workflowCode();
                self.rootModelInstance().workflowPayload.description = self.workflowDescription();

                WorkflowViewModel.createWorkflow(ko.mapping.toJSON(self.rootModelInstance().workflowPayload)).then(function(data) {
                    self.mode("SUCCESS");
                    checkHash();

                    rootParams.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        transactionName: self.transactionName()
                    });
                });
            }
        };

        if (self.mode() === "CREATE") {
            self.userInputModel = ko.observableArray([{
                useCase: "DEFAULT",
                selectedUser: null,
                selectedUserGroup: null,
                buttonSet: "USER",
                userType: "ADMIN",
                customLabel: true,
                labelDisplay: ko.observable(rootParams.baseModel.format(self.resourceBundle.workflow.level, {
                    level: 1
                })),
                useMode: null,
                additionalDetails: null,
                mode: ko.observable("review")
            }]);
        }

        self.save = function() {
            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                let i;

                if (self.userInputModel().length > 0) {
                    for (i = 0; i < self.userInputModel().length; i++) {
                        if (self.userInputModel()[i].selectedUser === null && self.userInputModel()[i].selectedUserGroup === null) {
                            return;
                        }
                    }
                } else {
                    return;
                }

                if (self.prevMode() === "REVIEW") {
                    self.rootModelInstance().workflowPayload = ko.mapping.fromJS(self.rootModelInstance().workflowPayload);
                }

                self.prevMode(self.mode());
                self.mode("REVIEW");
                checkHash();
                self.actionHeaderheading(self.resourceBundle.approvals.headers[self.mode().toLowerCase()]);
                self.rootModelInstance().workflowPayload.workFlowId(self.workFlowId);

                for (i = 0; i < self.rootModelInstance().workflowPayload.steps().length; i++) {
                    if (self.userInputModel()[i].buttonSet === "USER") {
                        self.rootModelInstance().workflowPayload.steps()[i].userGroup.unary(true);
                        self.rootModelInstance().workflowPayload.steps()[i].userGroup.users()[0].userId(self.userInputModel()[i].selectedUser);
                        self.rootModelInstance().workflowPayload.steps()[i].userGroup.users()[0].firstName(self.userInputModel()[i].additionalDetails.firstName);
                        self.rootModelInstance().workflowPayload.steps()[i].userGroup.users()[0].lastName(self.userInputModel()[i].additionalDetails.lastName);
                    } else if (self.userInputModel()[i].buttonSet === "USERGROUP") {
                        self.rootModelInstance().workflowPayload.steps()[i].userGroup.unary(false);
                        self.rootModelInstance().workflowPayload.steps()[i].userGroup.id(self.userInputModel()[i].selectedUserGroup);
                        self.rootModelInstance().workflowPayload.steps()[i].userGroup.name(self.userInputModel()[i].additionalDetails.name);
                    }

                    const copy = ko.mapping.toJS(self.rootModelInstance().workflowPayload.steps()[i]);

                    self.rootModelInstance().workflowPayload.steps()[i] = copy;
                }

                const copy1 = ko.mapping.toJS(self.rootModelInstance().workflowPayload);

                self.rootModelInstance().workflowPayload = copy1;
                self.workflowDetails(copy1);
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };

        self.editWorkflow = function() {
            self.mode("EDIT");
            checkHash();
            self.actionHeaderheading(self.resourceBundle.generic.common[self.mode().toLowerCase()]);
        };

        self.sequenceNo = ko.observable(2);

        self.addApprovalLevel = function() {
            let sequenceNo = self.sequenceNo();

            self.userInputModel.push({
                useCase: "DEFAULT",
                selectedUser: null,
                selectedUserGroup: null,
                buttonSet: "USER",
                userType: "ADMIN",
                customLabel: true,
                labelDisplay: ko.observable(rootParams.baseModel.format(self.resourceBundle.workflow.level, {
                    level: sequenceNo
                })),
                useMode: null,
                additionalDetails: null,
                mode: ko.observable("review")
            });

            self.rootModelInstance().workflowPayload.steps.push(ko.mapping.fromJS({
                sequenceNo: sequenceNo,
                userGroup: {
                    id: null,
                    name: null,
                    partyId: null,
                    unary: "User",
                    users: [{
                        userId: null,
                        firstName: null,
                        lastName: null
                    }]
                }
            }));

            sequenceNo++;
            self.sequenceNo(sequenceNo);
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.deleteApprovalFromWorkflow = function(index, data) {
            if ((data.selectedUser !== null || data.selectedUserGroup !== null) && !rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            for (let i = index; i < self.userInputModel().length; i++) {
                self.userInputModel()[i].labelDisplay = {
                    level: i
                };

                self.userInputModel()[i].useMode = "modify";
            }

            self.userInputModel.remove(data);
            self.temp = ko.observableArray();
            self.temp(self.userInputModel.slice(0));
            self.userInputModel.removeAll();

            for (let j = 0; j < self.temp().length; j++) {
                self.temp()[j].useMode = "modify";

                const newJob = ko.mapping.fromJS(ko.mapping.toJS(self.temp()[j]));

                self.userInputModel.push(ko.mapping.toJS(newJob));
            }

            let sequenceNo = self.sequenceNo();

            sequenceNo--;
            self.sequenceNo(sequenceNo);
            self.rootModelInstance().workflowPayload.steps.pop();
        };
    };
});