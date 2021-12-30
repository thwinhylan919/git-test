define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/review-add-biller-main",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton"
], function(ko, $, newBillerModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.resource = ResourceBundle.biller;
        self.payments = ResourceBundle;
        self.confirmScreenDetails = Params.rootModel.confirmScreenDetails;
        self.confirmScreenExtensions = Params.rootModel.confirmScreenExtensions;
        self.common = ResourceBundle.generic.common;
        self.biller = ko.observable();
        self.detailsLoaded = ko.observable(false);
        self.confirmBiller = self.params.confirmBiller ? self.params.confirmBiller :null;

        if (self.params.reviewMode) {
            Params.dashboard.headerName(self.params.header);
        }

        const billerDetails = self.params.data ? self.params.data.billerDetails : self.params.billerDetails;

        newBillerModel.getBillerDetails(billerDetails.billerId(), billerDetails.relationshipNumber()).done(function(data) {
            self.biller(data);
            self.getBillerDescription(data.billerDetails.billerId);
        });

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.resource.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.resource.common.confirmScreen.approvalMessages.FAILED.statusmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg; }
        };

        self.getBillerDescription = function(billerId) {
            newBillerModel.getBillerDescription(billerId).done(function(data) {
                self.biller().billerDetails.billerDescription = data.billerCategoryRel.billerDescription;
                self.detailsLoaded(true);

                const confirmScreenDetailsArray = [
                    [{
                            label: self.resource.category,
                            value: self.biller().billerDetails.categoryType
                        },
                        {
                            label: self.resource.billerName,
                            value: self.biller().billerDetails.billerDescription
                        }
                    ],
                    [{
                        label: self.resource.relationship1,
                        value: self.biller().billerDetails.relationshipNumber
                    }]
                ];

                if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); } else if (self.confirmScreenExtensions) {
                    $.extend(self.confirmScreenExtensions, {
                        isSet: true,
                        confirmScreenDetails: confirmScreenDetailsArray,
                        confirmScreenMsgEval: self.getConfirmScreenMsg,
                        confirmScreenStatusEval: self.getConfirmScreenStatus,
                        template: "confirm-screen/payments-template"
                    });
                }
            });
        };
    };
});