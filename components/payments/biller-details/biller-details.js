define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/biller-details",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojknockout-validation"
], function(ko, $, BillerDetailsModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);
        self.transferedData = Params.rootModel.params;

        self.billers = ResourceBundle.billers;
        self.categoryType = self.transferedData.categoryType;
        self.subBillerName = self.transferedData.billerName;
        self.selectedBillerId = self.transferedData.billerId;
        self.relationshipNumber = self.transferedData.relationshipNumber;
        self.consumerNumber = self.transferedData.consumerNumber;
        self.accountRelationshipNumber = self.transferedData.accountRelationshipNumber;
        self.externalReferenceId = ko.observable();
        self.showBillerDetails = ko.observable(true);
        self.verifyDeleteComponent = ko.observable(true);
        self.showDeletemessage = ko.observable(false);
        self.transferedData.autopopulate = true;

        if (Params.dashboard.appData.segment === "CORP") { Params.dashboard.headerName(self.billers.editTitle); } else { Params.dashboard.headerName(self.billers.viewEditTitle); }

        self.confirmScreenDetails = ko.observable();

        const confirmScreenDetailsArray = [
            [{
                    label: self.billers.category,
                    value: self.categoryType
                },
                {
                    label: self.billers.billerName,
                    value: self.subBillerName
                }
            ],
            [{
                label: self.billers.relationship1,
                value: self.relationshipNumber
            }]
        ];

        self.confirmScreenDetails(confirmScreenDetailsArray);

        self.deleteBiller = function() {
            $("#delete-biller").trigger("openModal");
        };

        self.cancelDeleteBiller = function() {
            $("#delete-biller").hide();
        };

        self.goBack = function() {
            history.go(-1);
        };

        self.ConfirmDelete = function() {
            BillerDetailsModel.deleteBiller(self.selectedBillerId, self.relationshipNumber).done(function(data, status, jqXHR) {
                $("#delete-biller").hide();
                self.httpStatus = jqXHR.status;

                let successMessage, statusMessages;

                if (Params.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus !== 202) {
                    successMessage = self.billers.deleteSuccess;
                    statusMessages = self.billers.sucessfull;
                } else {
                    successMessage = self.billers.corpMaker;
                    statusMessages = self.billers.pendingApproval;
                }

                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.billers.confirmDelete,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        isSet: true,
                        taskCode: "PC_N_DPBR",
                        confirmScreenDetails: self.confirmScreenDetails(),
                        template: "confirm-screen/payments-template"
                    }
                }, self);
            });
        };
    };
});