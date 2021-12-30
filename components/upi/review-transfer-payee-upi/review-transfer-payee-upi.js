define([
    "knockout",
    "./model",

    "ojL10n!resources/nls/review-transfer-payee-upi",
    "ojs/ojinputtext",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup"
], function(ko, reviewTransferPayeeUpiModel, ResourceBundle) {
    "use strict";

    /** Review Transfer to Payee UPI.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.currentTask = ko.observable();
        self.contentIdMap = ko.observable({});
        self.imageUploadFlag = self.params.imageUploadFlag;
        self.common = self.resource.common;
        self.payeeListExpandAll = ko.observableArray();
        self.transferPayeeUpiModel = self.params.transferPayeeUpiModel;
        self.region = ko.observable("INDIA");

        rootParams.baseModel.registerComponent("transfer-payee-upi", "upi");
        rootParams.dashboard.headerName(self.resource.reviewTransferUpi.header);

        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "row",
            "account-input"
        ]);

        const confirmScreenDetailsArray = [
            [{
                label: self.resource.reviewTransferUpi.transferTo,
                value: self.params.payeeData.nickName
            }].concat(self.params.payeeData.payeeType === "VPA" ? [{
                label: self.resource.reviewTransferUpi.payeeVpa,
                value: self.transferPayeeUpiModel.creditVPAId
            }, {
                label: self.resource.reviewTransferUpi.accountName,
                value: self.params.payeeData.accountName
            }] : [{
                    label: self.resource.reviewTransferUpi.accountName,
                    value: self.params.payeeData.accountName
                }, {
                    label: self.resource.reviewTransferUpi.accountType,
                    value: self.transferPayeeUpiModel.accountTransferDetails.accountType
                }, {
                    label: self.resource.reviewTransferUpi.payeeAccountNo,
                    value: self.transferPayeeUpiModel.accountTransferDetails.accountNumber
                },
                {
                    label: self.resource.reviewTransferUpi.bankDetails,
                    value: self.transferPayeeUpiModel.accountTransferDetails.bankDetails,
                    bankDetails: true
                }
            ]).concat([{
                label: self.resource.reviewTransferUpi.transferFrom,
                value: self.transferPayeeUpiModel.debitVPAId
            }, {
                label: self.resource.reviewTransferUpi.amount,
                value: self.transferPayeeUpiModel.amount.amount,
                currency: true,
                currencyType: self.transferPayeeUpiModel.amount.currency
            }, {
                label: self.resource.reviewTransferUpi.note,
                value: self.transferPayeeUpiModel.remarks
            }])

        ];

        self.confirmTransfer = function() {
            reviewTransferPayeeUpiModel.confirmTransfer(ko.toJSON(self.transferPayeeUpiModel)).done(function(data, status, jqXHR) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.resource.reviewTransferUpi.header,
                    confirmScreenExtensions: {
                        successMessage: self.resource.confirm.RETAIL_SUCCESS_MESSAGE,
                        isSet: true,
                        taskCode: "PC_F_UT",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        template: "confirm-screen/transfer-payee-upi"
                    }
                }, self);
            });
        };
    };
});
