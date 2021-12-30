define([
    "ojL10n!resources/nls/review-transaction-details",
    "knockout",
    "./model",
    "jquery",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup"
], function (resourceBundle, ko, Model, $) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        $.extend(true, self.nls, params.rootModel.nls);
        self.isApproval = false;
        self.loadApprovalData = ko.observable(false);

        const rootParams = params.rootModel;

        self.attributeData = rootParams.attributeData;
        self.accessData = rootParams.accessData;
        self.partyId = rootParams.partyId;
        self.partyName = rootParams.partyName;
        self.moduleName = rootParams.moduleName;
        self.userData = rootParams.userData;
        self.dataSource = rootParams.dataSource;
        self.attributeName = rootParams.attributeName;
        self.isUserSelected = rootParams.isUserSelected;
        self.accessLevel = rootParams.accessLevel;
        self.selectedModule = rootParams.selectedModule;
        self.value = rootParams.value;

        let isCorpAdmin = false,
            approvalData;

        if (params.dashboard.appData.segment === "CORPADMIN") {
            isCorpAdmin = true;
        }

        if (params.rootModel.mode === "approval") {
            self.isApproval = true;
            approvalData = params.rootModel.data;
        }

        params.baseModel.registerComponent("access-type", "corporate-resource-access");
        params.baseModel.registerComponent("entity-details", "corporate-resource-access");
        params.baseModel.registerComponent("mapping-train", "corporate-resource-access");
        params.baseModel.registerComponent("attribute-transaction-mapping", "corporate-resource-access");

        function getAttributeData(tasks, moduletaskAll) {
            if (tasks !== undefined && tasks.length > 0) {
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].childTasks !== undefined && tasks[i].childTasks.length > 0 && tasks[i].childTasks[0].childTasks !== undefined) {
                        getAttributeData(tasks[i].childTasks, moduletaskAll);
                    } else {
                        const childTaskData = [];

                        ko.utils.arrayForEach(tasks[i].childTasks, function (item) {
                            childTaskData.push({
                                allowed: false,
                                id: item.id,
                                name: item.name
                            });

                        });

                        moduletaskAll.push({
                            allowed: false,
                            id: tasks[i].id,
                            name: tasks[i].name,
                            childTasks: childTaskData
                        });

                    }
                }
            }

        }

        function setTransactionData(response) {
            const data = response[0],
                module = response[1].enumRepresentations[0].data,
                moduletaskAll = [];

            self.attributeData = [];
            getAttributeData(data.taskList[0].childTasks, moduletaskAll);

            ko.utils.arrayForEach(approvalData.attributeInclusionList, function (item) {
                const data = {
                    allowed: ["false"],
                    id: item.attributeId,
                    name: item.name,
                    status: item.status,
                    tasks: JSON.parse(JSON.stringify(moduletaskAll))
                };

                self.attributeData.push(data);

            });

            self.accessData = {
                accessLevel: approvalData.accessLevel,
                futureAttributeAccess: approvalData.futureAttributeAccess,
                id: approvalData.id,
                module: approvalData.module,
                partyId: approvalData.partyId,
                partyLevelAccess: approvalData.partyLevelAccess,
                userId: approvalData.userId,
                attributeName: approvalData.attributeName
            };

            self.partyId = self.accessData.partyId.displayValue;
            self.partyName = params.rootModel.partyName.fullName;
            self.moduleName = self.accessData.module;

            ko.utils.arrayForEach(module, function (item) {
                if (item.code === self.moduleName) {
                    self.moduleName = item.description;
                }
            });

            self.userData = {
                userid: self.accessData.userId,
                username: self.accessData.userId
            };

            self.attributeName = self.accessData.attributeName;
            self.isUserSelected = !!self.accessData.userId;
            self.accessData.partyLevelAccess = self.accessData.partyLevelAccess ? ["true"] : [];
            self.accessLevel = self.accessData.accessLevel;
            self.dataSource = [];

            for (let i = 0; i < self.attributeData.length; i++) {
                self.attributeData[i].allowed = ["false"];

                let isAnyChildTaskAllowed = false;

                for (let j = 0; j < approvalData.attributeInclusionList.length; j++) {
                    if (approvalData.attributeInclusionList[j].taskIds && approvalData.attributeInclusionList[j].taskIds.length > 0 && approvalData.attributeInclusionList[j].attributeId === self.attributeData[i].id) {

                        for (let k = 0; k < self.attributeData[i].tasks.length; k++) {
                            for (let l = 0; l < self.attributeData[i].tasks[k].childTasks.length; l++) {

                                if (approvalData.attributeInclusionList[j].taskIds.indexOf(self.attributeData[i].tasks[k].childTasks[l].id) !== -1) {
                                    self.attributeData[i].tasks[k].childTasks[l].allowed = true;
                                    isAnyChildTaskAllowed = true;
                                } else {
                                    self.attributeData[i].tasks[k].childTasks[l].allowed = false;
                                }
                            }
                        }
                    }
                }

                if (isAnyChildTaskAllowed) {
                    self.attributeData[i].allowed = ["true"];

                }
            }

            self.loadApprovalData(true);

        }

        if (self.isApproval) {
            if (approvalData.accessLevel === "PARTY") {

                Promise.all([Model.fetchAllTasksForModule(approvalData.module), Model.enumerationsaccessModuleget()]).then(function (response) {

                    setTransactionData(response);
                });
            } else if (approvalData.accessLevel === "USER") {

                Promise.all([Model.fetchAllTasksForModule(approvalData.module), Model.enumerationsaccessModuleget()]).then(function (response) {
                    setTransactionData(response);
                });

            }
        } else {
            self.loadApprovalData(true);
        }

        self.onClickCancel20 = function () {
            $("#cancelConfirmationModal").trigger("openModal");
        };

        self.hideModal = function () {
            $("#cancelConfirmationModal").hide();
        };

        self.cancel = function () {
            params.dashboard.switchModule();
        };

        self.onClickBack = function () {
            params.dashboard.hideDetails();
        };

        function callConfirmScreen(data) {
            params.dashboard.loadComponent("confirm-screen", {
                transactionResponse: data,
                transactionName: self.nls.componentHeader
            });
        }

        function buildPayload(payload) {
            payload.version = self.accessData.version;
            payload.accessLevel = self.accessLevel;
            payload.module = self.selectedModule.code;
            payload.attributeInclusionList = [];
            payload.partyId = self.value;
            payload.id = self.accessData.id;
            payload.attributeName = self.accessData.attributeName;

            for (let i = 0; i < self.dataSource.length; i++) {
                const attributeInclusion = {};

                attributeInclusion.attributeId = self.dataSource[i].attr.id;
                attributeInclusion.name = self.dataSource[i].attr.name;
                attributeInclusion.status = self.dataSource[i].attr.status;

                if (self.dataSource[i].children) {
                    attributeInclusion.taskIds = self.dataSource[i].children[0].attr.selectedTasks;
                }

                payload.attributeInclusionList.push(attributeInclusion);
            }
        }

        self.onClickConfirm = function () {
            const payload = Model.getNewModel();

            buildPayload(payload);

            params.rootModel.callConfirm(payload, isCorpAdmin).then(function (data) {
                callConfirmScreen(data);
            });

        };

    };
});