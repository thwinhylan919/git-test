define([

    "knockout",
    "jquery",
    "ojL10n!resources/nls/service-requests-configuration",
    "ojL10n!resources/nls/service-requests-details",
    "./model",
    "jqueryui-amd/widgets/sortable",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojtrain"
], function (ko, $, ResourceBundle, ResourceBundleRequestDetails, ServiceRequestsDetailModel) {
    "use strict";

    return function (Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);
        self.preLoadRootModel = Params.rootModel;
        self.model = Params.model;
        self.validationTracker = ko.observable();
        self.showApprovalButtonset = ko.observable(true);
        self.resource = ResourceBundle;
        self.requestDetailsTemplate = ResourceBundleRequestDetails;
        Params.dashboard.headerName(self.resource.serviceRequest.detailHeader);
        self.detailsLoaded = ko.observable(false);
        self.branchDetailsLoaded = ko.observable(false);
        self.disableApproveReject = ko.observable(true);
        self.id_ref = ko.observable("");
        self.id_ref_history = ko.observable("");
        self.showModal = ko.observable(false);
        self.natureOfTask = ko.observable(Params.rootModel.params.natureOfTask);
        self.remarks = ko.observable(Params.rootModel.params.remarks);
        self.disableApproveRejectButton = ko.observable(Params.rootModel.params.disableApproveRejectButton);
        self.serviceRequest = ko.observable(Params.rootModel.params.serviceRequestId);
        Params.baseModel.registerElement("confirm-screen");

        self.back = function () {
            self.backFromDetails = ko.observable(true);
            self.showApprovalButtonset(false);

            Params.dashboard.loadComponent("service-requests-base", {
                backFromDetails: self.backFromDetails(),
                showApprovalButtonset: self.showApprovalButtonset()
            });
        };

        let note;

        self.renderLabels = function () {
            $(".oj-train-label").each(function () {
                if ($(this).text().indexOf("current") !== -1) {
                    $(this).text($(this).text().substring(0, $(this).text().indexOf("current")));
                }

                $(this).text($(this).text().trim());

                if ($(this).text() === "PENDING TO RETAIL") {
                    $(this).html(self.resource.serviceRequest.trainStatusAdmin.PE + "<br/>" + self.id_ref().status === "PE" ? self.id_ref().creationDate : self.id_ref_history()[0].creationDate + "<br/>" +
                        self.id_ref().status === "PE" ? self.id_ref().creationDate : self.id_ref_history()[0].creationDate);
                } else if ($(this).text() === "COMPLETE") {
                    $(this).html(self.resource.serviceRequest.trainStatusAdmin.complete);
                } else if ($(this).text() === "COMPLETE TO RETAIL") {
                    note = self.id_ref().comments ? Params.baseModel.format(self.resource.serviceRequest.trainStatusAdmin.note, {
                        note: self.id_ref().comments
                    }) : "";

                    $(this).html(self.resource.serviceRequest.trainStatusAdmin[self.id_ref().status] + "<br/>" + self.id_ref().lastUpdatedDate + "<br/>" + self.id_ref().lastUpdatedDate + "<br/>" + note);
                } else if ($(this).text() === "PENDING TO ADMIN") {
                    $(this).html(self.resource.serviceRequest.trainStatusAdmin.PE + "<br/>" + self.id_ref().status === "PE" ? self.id_ref().creationDate : self.id_ref_history()[0].creationDate + "<br/>" +
                        self.id_ref().status === "PE" ? self.id_ref().creationDate : self.id_ref_history()[0].creationDate + "<br/>" + (self.id_ref().status === "PE" ? self.id_ref().userName : self.id_ref_history()[0].userName)
                    );
                } else if ($(this).text() === "COMPLETE TO ADMIN") {
                    note = self.id_ref().comments ? Params.baseModel.format(self.resource.serviceRequest.trainStatusAdmin.note, {
                        note: self.id_ref().comments
                    }) : "";

                    $(this).html(self.resource.serviceRequest.trainStatusAdmin[self.id_ref().status] + "<br/>" + self.id_ref().lastUpdatedDate + "<br/>" + self.id_ref().lastUpdatedDate + "<br/>" + self.id_ref().userName + "<br/>" + note);
                }
            });
        };

        $(document).off("keyup", "#remarksBox");

        $(document).on("keyup", "#remarksBox", function () {
            if ($("#remarksBox").val().length > 0) {
                self.disableApproveRejectButton(false);
            } else {
                self.disableApproveRejectButton(true);
            }
        });

        self.submit = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            $("#otherTransactionsApproval").hide().trigger("closeModal");
            self.fireTransactions(self.serviceRequest());
        };

        self.cancelModal = function () {
            self.disableApproveRejectButton(true);
            $("#otherTransactionsApproval").hide().trigger("closeModal");
        };

        self.showModalWindow = function (nature) {
            self.natureOfTask(nature);
            self.remarks("");
            self.showModal(true);
            $("#otherTransactionsApproval").trigger("openModal", "textarea");
        };

        self.fireTransactions = function (id) {
            let status = "";

            if (self.natureOfTask() === "approve") {
                self.approvalStatus = "CO";
                status = "CO";
            } else if (self.natureOfTask() === "reject") {
                status = "RE";
                self.approvalStatus = "RE";
            }

            ServiceRequestsDetailModel.approveRejectSR(id, self.remarks(), status).done(function (data, status, jqXhr) {
                self.backFromDetails = ko.observable(true);

                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    srNo: self.serviceRequest(),
                    transactionName: self.resource.serviceRequest.header,
                    transactionStatus: self.resource.serviceRequest.status[self.approvalStatus]
                }, self);
            });
        };

        ServiceRequestsDetailModel.fetchProductsDetail(Params.rootModel.params.serviceRequestId).done(function (data) {
            self.id_ref(data.response);
            self.id_ref_history(data.historyDetails);
            self.id_ref().requestTypeDescription = Params.baseModel.getDescriptionFromCode(Params.rootModel.params.requestTypeArray, self.id_ref().requestType);
            self.currentStepValue = ko.observable(self.id_ref().status);
            self.requestDetails = JSON.parse(self.id_ref().requestData);

            if (self.requestDetails.applicationDTO.deliveryOption === "BRN") {
                self.requestDetails.applicationDTO.deliveryOption = "Branch";
            } else if (self.requestDetails.applicationDTO.deliveryOption === "COR") {
                self.requestDetails.applicationDTO.deliveryOption = "Courier";
            }

            if (self.requestDetails.applicationDTO.reason === "NC") {
                self.requestDetails.applicationDTO.reason = "New Card";
            } else if (self.requestDetails.applicationDTO.reason === "PCH") {
                self.requestDetails.applicationDTO.reason = "Previous card was hotlisted";
            } else if (self.requestDetails.applicationDTO.reason === "PCW") {
                self.requestDetails.applicationDTO.reason = "Previous card not working";
            }

            self.partialName = self.id_ref().requestType.toLowerCase().split("_").join("-");

            if (self.partialName === "credit-card-supplimentary") {
                self.partialName = "credit-card-supplementary";
            }

            if (self.partialName === "credit-card-supplementary" && self.requestDetails.deliveryDetails.branches && self.requestDetails.deliveryDetails.branches.namBranch) {
                ServiceRequestsDetailModel.fetchBranchDetail(self.requestDetails.deliveryDetails.branches.namBranch).done(function (data1) {
                    self.requestDetails.branchDetails = data1.addressDTO[0];
                    self.branchDetailsLoaded(true);
                });
            }

            if (self.partialName === "credit-card-set-credential" && self.requestDetails.branch && self.requestDetails.branch.namBranch) {
                ServiceRequestsDetailModel.fetchBranchDetail(self.requestDetails.branch.namBranch).done(function (data1) {
                    self.requestDetails.branchDetails = data1.addressDTO[0];
                    self.branchDetailsLoaded(true);
                });
            }

            if (Params.dashboard.appData.segment === "RETAIL") {
                if (self.id_ref().status === "PE") {
                    self.stepArray = ko.observableArray(
                        [{
                            label: "PENDING TO RETAIL",
                            disabled: true,
                            id: "PE"
                        }, {
                            label: "COMPLETE",
                            disabled: true,
                            id: "complete"
                        }]);
                } else {
                    self.stepArray = ko.observableArray(
                        [{
                            label: "PENDING TO RETAIL",
                            disabled: true,
                            id: "PE"
                        }, {
                            label: "COMPLETE TO RETAIL",
                            disabled: true,
                            id: self.id_ref().status
                        }]);
                }
            } else if (self.id_ref().status === "PE") {
                self.stepArray = ko.observableArray(
                    [{
                        label: "PENDING TO ADMIN",
                        disabled: true,
                        id: "PE"
                    }, {
                        label: "COMPLETE",
                        disabled: true,
                        id: "complete"
                    }]);
            } else {
                self.stepArray = ko.observableArray(
                    [{
                        label: "PENDING TO ADMIN",
                        disabled: true,
                        id: "PE"
                    }, {
                        label: "COMPLETE TO ADMIN",
                        disabled: true,
                        id: self.id_ref().status
                    }]);
            }

            self.detailsLoaded(true);
        });

        self.getTemplate = function () {
            if (Params.dashboard.appData.segment === "RETAIL") {
                return "retailTemplate";
            }

            return "template";
        };
    };
});