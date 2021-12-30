define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/transactions",
    "framework/js/constants/task-component-mapping"
], function(ko, TransactionDetailModel, resourceBundle, Task) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.Nls = resourceBundle;
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerComponent("transaction-journey", "approvals");
        rootParams.baseModel.registerComponent("batch-process-approvals", "approvals");
        rootParams.baseModel.registerComponent("review-user-action", "user-management");
        self.forceShow = ko.observable(rootParams.rootModel.params.isPending);
        self.hideOnSuccess = ko.observable(true);

        if (rootParams.rootModel.params.event !== undefined && rootParams.rootModel.params.event.type !== undefined ) {
            self.type = ko.observable(rootParams.rootModel.params.event.type);
            rootParams.dashboard.headerName(rootParams.rootModel.params.event.type);
        }else if(rootParams.rootModel.params.type !== undefined){
            self.type = ko.observable(rootParams.rootModel.params.type);
            rootParams.dashboard.headerName(rootParams.rootModel.params.type);
        }else{
            self.type = ko.observable();
        }

        self.confirmScreenExtensions = {};
        self.loadComponentName = ko.observable();
        self.transactionDetails = ko.observable();
        self.transactionDetailsLoaded = ko.observable(false);
        self.isFlow = ko.observable(false);

        if (rootParams.rootModel.params.event !== undefined && rootParams.rootModel.params.event.transactionId !== undefined) {
            self.transactionId = rootParams.rootModel.params.event.transactionId;
        }else{
            self.transactionId = rootParams.rootModel.params.transactionId;
        }

        self.taskForApproval = null;

        self.eReceiptTransactionList = [
            "PC_F_DDD",
            "PC_F_DDDI",
            "PC_F_IDD",
            "PC_F_IDDI",
            "CH_N_CBR",
            "TD_F_TTD",
            "PC_F_ITR",
            "PC_F_ITRI",
            "PC_F_DFT",
            "PC_F_DFTI",
            "PC_F_ITF",
            "PC_F_ITFI",
            "PC_F_SFT",
            "PC_F_SFTI",
            "TD_F_OTD",
            "TD_N_ATD",
            "LN_F_LRP",
            "PC_F_GNIP",
            "PC_F_GNITNP",
            "PC_F_GNDP",
            "PC_F_GNDDD",
            "PC_F_GNIDD",
            "CH_N_CIN",
            "PC_F_CDDD",
            "PC_F_CIDD",
            "PC_F_CIDDI",
            "PC_F_CDDDI",
            "PC_F_CITFI",
            "PC_F_CITRI",
            "PC_F_CDFTI",
            "PC_F_CITF",
            "PC_F_CITR",
            "PC_F_CDFT",
            "PC_F_CBPT",
            "TD_F_RTD",
            "PC_I_INSTRL",
            "PC_F_PIC",
            "PC_F_BPT",
            "PC_F_CSFT",
            "PC_F_CSFTI",
            "PC_F_INTRNL",
            "PC_F_DOM",
            "PC_F_IT"
        ];

        self.enableEReceipt = ko.observable(false);

        TransactionDetailModel.readTransaction(self.transactionId).done(function(data) {
            self.transactionDetails(data.transactionDTO);

            const obj = data.transactionDTO.transactionSnapshot,
                task = Task[self.transactionDetails().taskDTO.id];

            self.taskForApproval = task;

            if (self.eReceiptTransactionList.indexOf(self.transactionDetails().taskDTO.id) !== -1) {
                self.enableEReceipt(true);
            } else {
                self.enableEReceipt(false);
            }

            self.params = {
                data: obj,
                transactionId: self.transactionId,
                versionId: data.transactionDTO.version,
                type: self.type,
                taskCode: self.transactionDetails().taskDTO.id,
                mode: "approval",
                confirmScreenExtensions: self.confirmScreenExtensions,
                transactionDetails : self.transactionDetails()
            };

            rootParams.dashboard.headerName(self.transactionDetails().taskDTO.name);
            self.forceShow(data.pendingApproval);

            if (task.class === "flow") {
                self.loadComponentName(task.name);
                self.isFlow(true);
            } else if (task.class === "legacy") {
                rootParams.baseModel.registerComponent(task.name, task.module);
                self.loadComponentName(task.name);
            } else {
                rootParams.baseModel.registerTransaction(task.name, task.module);
                self.loadComponentName("review-" + task.name);
            }

            self.transactionDetailsLoaded(true);
        });

        self.downloadEreceipt = function() {
            TransactionDetailModel.downloadEreceipt(self.transactionId);
        };
    };
});