define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function letterofcreditsletterOfCreditIdgetCall(letterOfCreditId, versionNo, forBillsCreation, payload, config) {
            return Model.letterofcreditsletterOfCreditIdget(letterOfCreditId, versionNo, forBillsCreation, payload, config);
        }

                function tradeApplicationsapplicationIdgetCall(applicationId, payload, config) {
            return Model.tradeApplicationsapplicationIdget(applicationId, payload, config);
        }

                function onClickBack49() {
            params.dashboard.hideDetails();
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.dataLoaded = ko.observable(false);
            self.letterofcreditsletterOfCreditIdgetVar = ko.observable();
            self.previousData = ko.observable();
            self.previousData(rootParams.rootModel.params);
            self.letterofcreditsletterOfCreditIdgetVar(self.previousData().letterOfCreditDetails);
            self.dataLoaded(true);
            self.applicationDetails = "process-management/application-details.svg";
            self.documentImagePath = "process-management/documents.svg";
            params.baseModel.registerComponent("view-letter-of-credit", "letter-of-credit");
            params.baseModel.registerComponent("application-tracker-documents", "process-management");
            params.baseModel.registerComponent("view-trade-application-details", "trade-finance");
            params.baseModel.registerComponent("view-guarantee-application-details", "trade-finance");
            params.baseModel.registerComponent("review-amend-lc", "letter-of-credit");
            params.baseModel.registerComponent("view-discrepancies", "customer-acceptance");

            self.loadDocument = function () {
                const parameters = {
                    selectedCustomerName: self.previousData().selectedCustomerName,
                    applicationNumber: self.previousData().applicationDetails.applicationNumber,
                    beneficiaryName: self.previousData().applicationDetails.beneficiaryName,
                    status: self.nls.Status[self.previousData().selectedItem],
                    selectedItem: self.previousData().selectedItem,
                    applicationDetails: self.previousData().applicationDetails,
                    selectedCustomerId: self.previousData().selectedCustomerId,
                    selectedApplicationType: self.previousData().selectedApplicationType,
                    selectedApplicationDuration: self.previousData().selectedApplicationDuration,
                    tradeApplications: self.previousData().tradeApplications,
                    dataAvailable: self.previousData().dataAvailable
                };

                params.dashboard.loadComponent("application-tracker-documents", parameters);
            };

            self.loadApplicationDetails = function () {
                self.letterofcreditsletterOfCreditIdgetletterOfCreditId(self.previousData().applicationDetails.applicationNumber);

                tradeApplicationsapplicationIdgetCall(self.letterofcreditsletterOfCreditIdgetletterOfCreditId(), self.letterofcreditsletterOfCreditIdgetversionNo(), self.letterofcreditsletterOfCreditIdgetforBillsCreation()).then(function (response) {
                    let multiGoodsSupported;

                    if (self.previousData().applicationDetails.processManagementApplicationType === "LETTER_OF_CREDIT") {
                        if (response.payload.letterOfCreditDTO.goods.length) {
                            multiGoodsSupported = "true";
                        } else {
                            multiGoodsSupported = "false";
                        }

                        const parameters = {
                            mode: "VIEW",
                            letterOfCreditDetails: ko.mapping.toJS(response.payload.letterOfCreditDTO),
                            multiGoodsSupported: multiGoodsSupported,
                            applicationNumber: response.applicationNumber,
                            selectedItem: self.previousData().selectedItem,
                            applicationDetails: self.previousData().applicationDetails,
                            selectedCustomerId: self.previousData().selectedCustomerId,
                            selectedApplicationType: self.previousData().selectedApplicationType,
                            selectedApplicationDuration: self.previousData().selectedApplicationDuration,
                            tradeApplications: self.previousData().tradeApplications,
                            dataAvailable: self.previousData().dataAvailable
                        };

                        params.dashboard.loadComponent("view-trade-application-details", parameters);
                    } else if (self.previousData().applicationDetails.processManagementApplicationType === "BANK_GUARANTEE") {
                        const parameters = {
                            mode: "VIEW",
                            guaranteeDetails: ko.mapping.toJS(response.payload.bankGuaranteeDTO),
                            selectedItem: self.previousData().selectedItem,
                            guaranteeTransactionType: "OUTWARD",
                            applicationNumber: response.applicationNumber,
                            applicationDetails: self.previousData().applicationDetails,
                            selectedCustomerId: self.previousData().selectedCustomerId,
                            selectedApplicationType: self.previousData().selectedApplicationType,
                            selectedApplicationDuration: self.previousData().selectedApplicationDuration,
                            tradeApplications: self.previousData().tradeApplications,
                            dataAvailable: self.previousData().dataAvailable
                        };

                        params.dashboard.loadComponent("view-guarantee-application-details", parameters);
                    } else if (self.previousData().applicationDetails.processManagementApplicationType === "IMPORT_LETTER_OF_CREDIT_AMENDMENT" || self.previousData().applicationDetails.processManagementApplicationType === "EXPORT_LETTER_OF_CREDIT_AMENDMENT") {
                        if (response.payload.letterOfCreditAmendment.goods.length) {
                            multiGoodsSupported = "true";
                        } else {
                            multiGoodsSupported = "false";
                        }

                        const parameters = {
                            mode: "VIEW",
                            flow: "TRACKER",
                            lcAmendType: self.previousData().applicationDetails.processManagementApplicationType === "IMPORT_LETTER_OF_CREDIT_AMENDMENT" ? "IMPORT" : "EXPORT",
                            lcAmendmentDetails: ko.mapping.toJS(response.payload.letterOfCreditAmendment),
                            multiGoodsSupported: multiGoodsSupported,
                            selectedItem: self.previousData().selectedItem,
                            applicationDetails: self.previousData().applicationDetails,
                            selectedCustomerId: self.previousData().selectedCustomerId,
                            selectedApplicationType: self.previousData().selectedApplicationType,
                            selectedApplicationDuration: self.previousData().selectedApplicationDuration,
                            tradeApplications: self.previousData().tradeApplications,
                            dataAvailable: self.previousData().dataAvailable
                        };

                        params.dashboard.loadComponent("review-amend-lc", parameters);
                    } else if (self.previousData().applicationDetails.processManagementApplicationType === "IMPORT_LC_AMENDMENT_CUST_ACCEPTANCE" || self.previousData().applicationDetails.processManagementApplicationType === "EXPORT_LC_AMENDMENT_CUST_ACCEPTANCE") {
                        if (response.payload.letterOfCreditAmendment.goods.length) {
                            multiGoodsSupported = "true";
                        } else {
                            multiGoodsSupported = "false";
                        }

                        const parameters = {
                            mode: "VIEW",
                            flow: "TRACKER",
                            lcAmendType: self.previousData().applicationDetails.processManagementApplicationType === "IMPORT_LC_AMENDMENT_CUST_ACCEPTANCE" ? "IMPORT" : "EXPORT",
                            lcAmendmentDetails: ko.mapping.toJS(response.payload.letterOfCreditAmendment),
                            multiGoodsSupported: multiGoodsSupported,
                            selectedItem: self.previousData().selectedItem,
                            applicationDetails: self.previousData().applicationDetails,
                            selectedCustomerId: self.previousData().selectedCustomerId,
                            selectedApplicationType: self.previousData().selectedApplicationType,
                            selectedApplicationDuration: self.previousData().selectedApplicationDuration,
                            tradeApplications: self.previousData().tradeApplications,
                            dataAvailable: self.previousData().dataAvailable
                        };

                        params.dashboard.loadComponent("review-amend-lc", parameters);
                    } else if (self.previousData().applicationDetails.processManagementApplicationType === "BILL_DISCREPANCY_CUST_ACCEPTANCE") {
                        const parameters = {
                            mode: "VIEW",
                            initiateButtonEnabled: false,
                            billDetails: response.payload.discrepancyDTO.discrepancyDTO,
                            billReferenceNumber: response.contactReferenceNumber,
                            multiGoodsSupported: multiGoodsSupported,
                            selectedItem: self.previousData().selectedItem,
                            applicationDetails: self.previousData().applicationDetails,
                            selectedCustomerId: self.previousData().selectedCustomerId,
                            selectedApplicationType: self.previousData().selectedApplicationType,
                            selectedApplicationDuration: self.previousData().selectedApplicationDuration,
                            tradeApplications: self.previousData().tradeApplications,
                            dataAvailable: self.previousData().dataAvailable
                        };

                        params.dashboard.loadComponent("view-discrepancies", parameters);
                    }
                });
            };

            return true;
        }

        return {
            letterofcreditsletterOfCreditIdgetCall: letterofcreditsletterOfCreditIdgetCall,
            tradeApplicationsapplicationIdgetCall: tradeApplicationsapplicationIdgetCall,
            onClickBack49: onClickBack49,
            init: init
        };
    };
});