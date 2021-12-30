define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "ojL10n!resources/nls/transactions",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource"
], function (oj, ko, liquidityManagementModel, $, resourceBundle) {
    "use strict";

    /** LiquidityManagement.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     *
     */
    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.transactionListLoaded = ko.observable(false);
        self.dataSourceLoaded = ko.observable(false);
        self.countForHeader = rootParams.rootModel.params ? rootParams.rootModel.params.countForHeader : "";
        self.view = rootParams.rootModel.view || rootParams.rootModel.params.view;
        rootParams.baseModel.registerElement("date-time");
        rootParams.baseModel.registerComponent("transaction-detail", "approvals");

        if (rootParams.dashboard.isDashboard() === false) {
            rootParams.dashboard.headerName(self.nls.labels.LIQUIDITY_MANAGEMENT);
        }

        self.liquidityManagementDataSource = ko.observable();

        self.columnArray = [{
                headerText: self.nls.labels.date,
                template: "creation_Date"
            },
            {
                headerText: self.nls.labels.transactionType,
                field: "type"
            },
            {
                headerText: self.nls.labels.structureId,
                field: "structureId"
            },
            {
                headerText: self.nls.labels.structureDescription,
                field: "structureDescription"
            },
            {
                headerText: self.nls.labels.referenceNumber,
                template: "referenceNumber"
            },
            {
                headerText: self.nls.labels.status,
                template: "approvalStatus"
            }
        ];

        liquidityManagementModel.getTransactionList(self.view, self.fromDate && self.fromDate(), self.toDate && self.toDate(), rootParams.dashboard.appData.segmentt === "ADMIN" ? "A" : rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : "P").then(function (data) {
            const liquidityManagementListArray = $.map(data.transactionDTOs, function (transaction) {
                return {
                    date: transaction.creationDate,
                    type: transaction.taskDTO.name,
                    structureId: transaction.transactionName === "LM_M_IMS" ? transaction.transactionSnapshot.requestPayload.strListKeyDTO[0].structureId : transaction.transactionSnapshot.requestPayload.structureList[0].structureKey.structureId,
                    structureDescription: transaction.transactionName === "LM_M_IMS" ? transaction.transactionSnapshot.requestPayload.strListKeyDTO[0].desc : transaction.transactionSnapshot.requestPayload.structureList[0].desc,
                    transactionId: transaction.transactionId,
                    initiatedBy: transaction.createdBy,
                    status: self.nls.status[transaction.approvalDetails.status],
                    noOfApprovalSteps: transaction.approvalDetails.countOfApprovals,
                    processingStatus: transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.approvalDetails.status === "APPROVED" ? "S" : transaction.processingDetails.status
                };
            });

            self.liquidityManagementDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(liquidityManagementListArray) || []));
            self.dataSourceLoaded(true);
        });

        /**
         * This function will load the liquidityManagement details.
         *
         * @memberOf liquidity-Management
         * @param {Object} event  - Contains the transaction Id.
         * @function onTransactionRowClicked
         * @returns {void}
         */
        self.onTransactionRowClicked = function (event) {
            rootParams.dashboard.loadComponent("transaction-detail", {
                event: event
            });
        };
    };
});