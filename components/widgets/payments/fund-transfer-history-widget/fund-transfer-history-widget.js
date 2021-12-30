define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/fund-transfer-history-widget",
    "load!../../../payments/fund-transfer-view-details/fund-transfer-view-details.json",
    "ojs/ojformlayout",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojavatar"
], function (oj, ko, $, Model, resourceBundle, FundTransferJSON) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;

        params.baseModel.registerElement("date-box");
        params.baseModel.registerComponent("fund-transfer-history", "payments");
        params.baseModel.registerComponent("fund-transfer-view-details", "payments");
        self.dataSource4 = ko.observable();
        self.paymentId = ko.observable();
        self.paymentType = ko.observable();
        self.selectedPaymentId = ko.observable();
        self.selectedPaymentType = ko.observable();
        self.groupIdMap = ko.observable({});
        self.contentIdMap = ko.observable({});
        self.paymentDataList = ko.observableArray();
        self.paymentListDataLoaded = ko.observable(false);
        self.imageUploadFlag = ko.observable(false);
        self.paymentDetails = ko.observable();
        self.transactionStatus = ko.observable();
        self.defaultImagePath = "dashboard/quick-access/manage-recipients.svg";

        params.baseModel.registerComponent("fund-transfer-view-details", "payments");

        const batchRequest = {
                batchDetailRequestList: []
            },
            groupBatchRequest = {
                batchDetailRequestList: []
            };

        self.loadBatchRequest = function (id) {
            batchRequest.batchDetailRequestList.push({
                methodType: "GET",
                uri: {
                    value: "/contents/{id}",
                    params: {
                        id: id
                    }
                },
                headers: {
                    "Content-Id": batchRequest.batchDetailRequestList.length + 1,
                    "Content-Type": "application/json"
                }
            });
        };

        self.loadGroupRequest = function (groupId) {
            groupBatchRequest.batchDetailRequestList.push({
                methodType: "GET",
                uri: {
                    value: "/payments/payeeGroup/{groupId}",
                    params: {
                        groupId: groupId
                    }
                },
                headers: {
                    "Content-Id": groupBatchRequest.batchDetailRequestList.length + 1,
                    "Content-Type": "application/json"
                }
            });
        };

        self.setPreviewData = function () {
            if (batchRequest.batchDetailRequestList.length) {
                Model.batchRead(batchRequest).done(function (batchData) {
                    let groupId;

                    for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                        const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                        if (responseDTO.contentDTOList && responseDTO.contentDTOList[0].contentId) {
                            if (self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]) {
                                self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                            } else if (self.groupIdMap()[responseDTO.contentDTOList[0].contentId.value]) {
                                groupId = self.groupIdMap()[responseDTO.contentDTOList[0].contentId.value]();
                                self.contentIdMap()[groupId]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                            }
                        }
                    }
                });
            }
        };

        self.getGroupContentData = function () {
            Model.batchRead(groupBatchRequest).done(function (groupBatchData) {
                for (let i = 0; i < groupBatchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = groupBatchData.batchDetailResponseDTOList[i].responseObj;

                    if (responseDTO.payeeGroup.contentId && responseDTO.payeeGroup.contentId.value) {
                        self.groupIdMap()[responseDTO.payeeGroup.contentId.value] = ko.observable();
                        self.groupIdMap()[responseDTO.payeeGroup.contentId.value](responseDTO.payeeGroup.groupId);
                        self.loadBatchRequest(responseDTO.payeeGroup.contentId.value);
                    }
                }

                self.setPreviewData();
            });
        };

        self.loadBatchImages = function () {
            Model.getPayeeMaintenance().then(function (data) {
                const propertyValue = ko.utils.arrayFirst(data.configurationDetails, function (element) {
                    return element.propertyId === "RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED";
                }).propertyValue;

                if (propertyValue === "Y") {
                    self.imageUploadFlag(true);
                } else {
                    self.imageUploadFlag(false);
                }

                if (self.imageUploadFlag()) {
                    if (groupBatchRequest.batchDetailRequestList.length > 0) {
                        self.getGroupContentData();
                    } else {
                        self.setPreviewData();
                    }

                }
            });
        };

        Model.paymentsget().then(function (data) {
            self.paymentDataList.removeAll();

            batchRequest.batchDetailRequestList = [];
            groupBatchRequest.batchDetailRequestList = [];

            if (data.paymentDetailsDTOs) {
                for (let i = 0; i < data.paymentDetailsDTOs.length; i++) {

                    const obj = {
                        paymentId: data.paymentDetailsDTOs[i].paymentId ? data.paymentDetailsDTOs[i].paymentId : null,
                        instructionId: data.paymentDetailsDTOs[i].instructionId ? data.paymentDetailsDTOs[i].instructionId : null,
                        fromDate: data.paymentDetailsDTOs[i].fromDate,
                        status: data.paymentDetailsDTOs[i].status ? data.paymentDetailsDTOs[i].status.replace(/\s/g, "").toLowerCase() : null,
                        debitAccountId: data.paymentDetailsDTOs[i].debitAccountId.displayValue,
                        payeeNickName: data.paymentDetailsDTOs[i].paymentType === "SELFFT" ? self.nls.FundsTransferHistory.selfPayeeNickName : data.paymentDetailsDTOs[i].payeeNickName ? data.paymentDetailsDTOs[i].payeeNickName : "",
                        payeeAccountId: data.paymentDetailsDTOs[i].payeeAccountId ? data.paymentDetailsDTOs[i].payeeAccountId.displayValue : data.paymentDetailsDTOs[i].transferValue ? data.paymentDetailsDTOs[i].payeeNickName === "TWITTER" ? data.paymentDetailsDTOs[i].transferValue.substring(20) : data.paymentDetailsDTOs[i].transferValue : "",
                        transferValue: data.paymentDetailsDTOs[i].transferValue ? data.paymentDetailsDTOs[i].transferValue : null,
                        externalReferenceNumber: data.paymentDetailsDTOs[i].externalReferenceNumber,
                        amount: data.paymentDetailsDTOs[i].amount,
                        paymentType: data.paymentDetailsDTOs[i].paymentType,
                        contentId: data.paymentDetailsDTOs[i].contentId ? data.paymentDetailsDTOs[i].contentId : null,
                        initials: data.paymentDetailsDTOs[i].payeeNickName ? oj.IntlConverterUtils.getInitials(data.paymentDetailsDTOs[i].payeeNickName.split(/\s+/)[0], data.paymentDetailsDTOs[i].payeeNickName.split(/\s+/)[1]) : "OA",
                        preview: data.paymentDetailsDTOs[i].contentId ? self.contentIdMap()[data.paymentDetailsDTOs[i].contentId.value] : ko.observable()
                    };

                    if (data.paymentDetailsDTOs[i].contentId && data.paymentDetailsDTOs[i].contentId.value) {
                        if (!self.contentIdMap()[data.paymentDetailsDTOs[i].contentId.value]) {
                            self.contentIdMap()[data.paymentDetailsDTOs[i].contentId.value] = ko.observable();
                        }

                        obj.preview = self.contentIdMap()[data.paymentDetailsDTOs[i].contentId.value];
                        self.loadBatchRequest(data.paymentDetailsDTOs[i].contentId.value);
                    } else if (data.paymentDetailsDTOs[i].groupId) {
                        if (!self.contentIdMap()[data.paymentDetailsDTOs[i].groupId]) {
                            self.contentIdMap()[data.paymentDetailsDTOs[i].groupId] = ko.observable();
                        }

                        obj.preview = self.contentIdMap()[data.paymentDetailsDTOs[i].groupId];
                        self.loadGroupRequest(data.paymentDetailsDTOs[i].groupId);
                    }

                    self.paymentDataList.push(obj);
                }
            }

            self.dataSource4(new oj.ArrayTableDataSource(self.paymentDataList, {
                idAttribute: "externalReferenceNumber"
            }) || []);

            self.paymentListDataLoaded(true);
            self.loadBatchImages();

        });

        self.menuItems = [{
                id: "viewDetails",
                label: self.nls.FundsTransferHistory.viewDetails
            },
            {
                id: "reInitiate",
                label: self.nls.FundsTransferHistory.reInitiate
            }
        ];

        self.reInitiateDetails = function (event) {
            Model.getPaymentDetails(self.selectedPaymentId(), self.selectedPaymentType()).then(function (responseData) {
                const data = responseData;

                if (self.selectedPaymentType() === "DOMESTICDRAFT") {
                    data.transferDetails = responseData.draftDetails;
                } else if (self.selectedPaymentType() === "INDIADOMESTICFT") {
                    data.transferDetails = responseData.payoutDetails;
                }

                self.paymentDetails({
                    accountName: data.payeeDetails ? data.payeeDetails.accountName || data.payeeDetails.nickName : "Self",

                    amount: data.transferDetails.amount.amount ? data.transferDetails.amount.amount : null,
                    autopopulate: true,
                    creditAccountDisplayValue: data.transferDetails.creditAccountId ? data.transferDetails.creditAccountId.displayValue : null,
                    creditAccountId: data.transferDetails.creditAccountId ? data.transferDetails.creditAccountId.value : null,
                    currency: data.transferDetails.amount.currency ? data.transferDetails.amount.currency : null,
                    debitAccountId: data.transferDetails.debitAccountId.value ? data.transferDetails.debitAccountId.value : null,
                    displayValue: data.transferDetails.debitAccountId.displayValue ? data.transferDetails.debitAccountId.displayValue : null,
                    nickName: data.payeeDetails ? data.payeeDetails.nickName : null,

                    payeeId: data.transferDetails.payeeId ? data.transferDetails.payeeId : data.payeeDetails ? data.payeeDetails.id : null,
                    payeeType: data.payeeDetails ? FundTransferJSON[self.selectedPaymentType()].payeeType : null,
                    groupId: data.payeeDetails ? data.payeeDetails.groupId : null,

                    paymentId: data.paymentId,
                    paymentType: data.paymentType,
                    remarks: data.transferDetails.remarks ? data.transferDetails.remarks : null,

                    purpose: data.transferDetails.purpose ? data.transferDetails.purpose : null,

                    transactionType: data.paymentType ? data.paymentType : "PEER_TO_PEER",
                    valueDate: data.transferDetails.valueDate ? data.transferDetails.valueDate : null,
                    isFavoriteTransaction: true,
                    adhocPayment: null,
                    payeeStatus: null,
                    payeeAccountType: null,
                    payAtCity: data.payeeDetails ? data.payeeDetails.payAtCity ? data.payeeDetails.payAtCity : null : null,
                    addressDetails: data.payeeDetails ? data.payeeDetails.demandDraftDeliveryDTO ? data.payeeDetails.demandDraftDeliveryDTO : null : null,

                    bankDetailsCode: data.payeeDetails ? data.payeeDetails.indiaDomesticPayee ? data.payeeDetails.indiaDomesticPayee.bankDetails.code : null : null,
                    network: data.transferDetails.network ? data.transferDetails.network : null,

                    transferMode: data.transferMode ? data.transferMode : null,
                    transferValue: data.transferValue ? data.transferValue : null
                });

                self.checkIfAdhoc(self.paymentDetails(), event);
            });
        };

        self.checkIfAdhoc = function (data, event) {
            if (data.payeeId && data.groupId) {
                Model.readPayee(data.groupId, data.payeeId, data.payeeType).then(function (responseData) {
                    const details = responseData.internalPayee ? responseData.internalPayee : responseData.domesticPayee ? responseData.domesticPayee.indiaDomesticPayee : responseData.demandDraftPayeeDTO ? responseData.demandDraftPayeeDTO : responseData.peerToPeerPayee ? responseData.peerToPeerPayee : null;

                    if (details.status === "ACT") {
                        self.paymentDetails().adhocPayment = false;
                    } else {
                        self.paymentDetails().adhocPayment = true;
                        self.paymentDetails().payeeStatus = details.status;
                        self.paymentDetails().payeeAccountType = details.accountType;

                    }

                    self.performAction(event);

                });
            } else {
                self.paymentDetails().adhocPayment = true;
                self.performAction(event);
            }

        };

        self.performAction = function (event) {
            if (event.target.value === "viewDetails") {
                const transferDataParam = {
                        paymentId: self.selectedPaymentId(),
                        paymentType: self.selectedPaymentType(),
                        reInitiateData: self.paymentDetails(),
                        payeeStatus: self.paymentDetails().payeeStatus,
                        transactionStatus: self.transactionStatus()
                    },
                    data = {
                        paymentId: ko.observable(self.selectedPaymentId())
                    };

                if (self.selectedPaymentType() === "PEER_TO_PEER" || self.selectedPaymentType() === "SELFFT" || self.selectedPaymentType() === "INTERNALFT" || self.selectedPaymentType() === "INDIADOMESTICFT") {
                    params.dashboard.loadComponent("fund-transfer-view-details", {
                        mode: "approval",
                        paymentId: self.selectedPaymentId(),
                        reviewMode: false,
                        transferData: transferDataParam,
                        retainedData: self,
                        data: data
                    }, self);
                } else if (self.selectedPaymentType() === "DOMESTICDRAFT") {
                    params.dashboard.loadComponent("fund-transfer-view-details", {
                        paymentId: self.selectedPaymentId(),
                        reviewMode: false,
                        transferData: transferDataParam,
                        retainedData: self,
                        data: data
                    }, self);
                }
            } else {
                let loadingComponent;

                if (self.paymentDetails().adhocPayment) {
                    loadingComponent = FundTransferJSON[self.selectedPaymentType()].initADhocComponent;
                } else {
                    loadingComponent = FundTransferJSON[self.selectedPaymentType()].initComponent;
                }

                if (self.selectedPaymentType() === "PEER_TO_PEER" || self.selectedPaymentType() === "SELFFT" || self.selectedPaymentType() === "INTERNALFT" || self.selectedPaymentType() === "INDIADOMESTICFT") {
                    if (params.dashboard.appData.segment === "CORP") {
                        params.baseModel.registerComponent(loadingComponent, "payments");

                        params.dashboard.loadComponent(loadingComponent, {
                            transferObject: self.paymentDetails ? ko.observable(self.paymentDetails()) : null
                        });

                    } else {
                        params.dashboard.loadComponent("manage-accounts", {
                            applicationType: "payments",
                            defaultTab: loadingComponent,
                            transferObject: self.paymentDetails ? ko.observable(self.paymentDetails()) : null
                        });
                    }

                } else if (self.selectedPaymentType() === "DOMESTICDRAFT") {
                    if (params.dashboard.appData.segment === "CORP") {
                        params.baseModel.registerComponent(loadingComponent, "payments");

                        params.dashboard.loadComponent(loadingComponent, {
                            fundTransferObject: self.paymentDetails ? ko.observable(self.paymentDetails()) : null
                        });
                    } else {
                        params.dashboard.loadComponent("manage-accounts", {
                            applicationType: "payments",
                            defaultTab: loadingComponent,
                            component: loadingComponent,
                            fundTransferObject: self.paymentDetails ? ko.observable(self.paymentDetails()) : null
                        });
                    }
                }
            }
        };

        self.menuItemSelect = function (event, rowData) {

            self.selectedPaymentId(rowData.paymentId);
            self.selectedPaymentType(rowData.paymentType);
            self.transactionStatus(rowData.status);

            self.reInitiateDetails(event);

        };

        self.openMenu = function (rowData, event) {
            $("#" + rowData).ojMenu("open", event);
        };

        self.openTab = function (applicationType, defaultTab) {
            params.dashboard.loadComponent("manage-accounts", {
                applicationType: applicationType,
                defaultTab: defaultTab,
                isStandingInstruction: applicationType === "standing-instructions",
                isSuccess: self.params ? self.params.isSuccess : false
            });
        };

    };
});