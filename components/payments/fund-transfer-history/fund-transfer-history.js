define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "ojL10n!resources/nls/fund-transfer-history",
    "load!./fund-transfer-history.json",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojdatetimepicker",
    "ojs/ojavatar",
    "ojs/ojoption",
    "ojs/ojlistview"

], function (oj, ko, FundTransferHistorySearchModel, $, resourceBundle, FundTransferJSON) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.headers.fundTransferHistory);
        self.fundTransfersData = ko.observableArray();
        self.fundsDatasource = ko.observable();
        self.fundTransfersLoaded = ko.observable(false);
        self.filterDetailsLoaded = ko.observable(false);
        self.imageUploadFlag = ko.observable();
        self.payeeName = ko.observable();
        self.payeeDetailsArray = ko.observableArray();
        self.payeeDetailsMap = {};

        self.transactionReferenceNumber = ko.observable();
        self.status = ko.observable();
        self.statusArray = ko.observableArray();
        self.transferType = ko.observable();
        self.accountList = ko.observableArray();
        self.accountFetched = ko.observable(false);
        self.groupIdMap = ko.observable({});
        self.contentIdMap = ko.observable({});
        self.selectedPaymentId = ko.observable();
        self.selectedPaymentType = ko.observable();
        self.paymentDetails = ko.observable();
        rootParams.baseModel.registerComponent("fund-transfer-view-details", "payments");
        rootParams.baseModel.registerComponent("payments-money-transfer", "payments");
        rootParams.baseModel.registerComponent("manage-accounts", "payments");

        self.debitAccountId = ko.observable();
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.showOptionRecords = ko.observable(false);
        self.transactionStatus = ko.observable();
        self.defaultImagePath = "dashboard/quick-access/manage-recipients.svg";
        self.isDownload = ko.observable(false);
        self.mediaTypeSelected = ko.observable();
        self.mediaFormat = ko.observable();
        self.availableFomats = ko.observableArray();
        self.mediatypeLoaded = ko.observable(false);
        self.transferTypeArray = ko.observableArray();

        ko.utils.extend(self, rootParams.rootModel.previousState ? rootParams.rootModel.previousState.retainedData : rootParams.rootModel);

        const batchRequest = {
                batchDetailRequestList: []
            },
            groupBatchRequest = {
                batchDetailRequestList: []
            };

        self.menuItems = [{
                id: "viewDetails",
                label: self.nls.headers.viewDetails
            },
            {
                id: "reInitiate",
                label: self.nls.headers.reInitiate
            }
        ];

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

        self.getFilterDetails = function () {
            Promise.all([FundTransferHistorySearchModel.getPayeeList(), FundTransferHistorySearchModel.fetchAccountData(), FundTransferHistorySearchModel.fetchTransferTypes(), FundTransferHistorySearchModel.fetchTransferStatus()])
                .then(function (data) {
                    const payeeListData = data[0],
                        accountData = data[1],
                        transferTypeData = data[2],
                        transferStatusData = data[3];

                    if (payeeListData !== null) {
                        self.payeeDetailsMap.All = {
                            payeeNickName: self.nls.history.allPayees,
                            status: null,
                            payeeDomesticAccountType: null,
                            payeeGroupId: null
                        };

                        self.payeeDetailsArray.push({
                            payeeId: "All",
                            payeeNickName: self.nls.history.allPayees,
                            status: null,
                            payeeDomesticAccountType: null

                        });

                        for (let m = 0; m < payeeListData.payeeGroups.length; m++) {
                            for (let i = 0; i < payeeListData.payeeGroups[m].listPayees.length; i++) {
                                self.payeeDetailsArray.push({
                                    payeeId: payeeListData.payeeGroups[m].listPayees[i].id,
                                    payeeNickName: payeeListData.payeeGroups[m].listPayees[i].nickName,
                                    status: payeeListData.payeeGroups[m].listPayees[i].status,
                                    payeeDomesticAccountType: payeeListData.payeeGroups[m].listPayees[i].indiaDomesticPayee ? payeeListData.payeeGroups[m].listPayees[i].indiaDomesticPayee.accountType : null
                                });

                                self.payeeDetailsMap[payeeListData.payeeGroups[m].listPayees[i].id] = {
                                    payeeNickName: payeeListData.payeeGroups[m].listPayees[i].nickName,
                                    status: payeeListData.payeeGroups[m].listPayees[i].status,
                                    payeeDomesticAccountType: payeeListData.payeeGroups[m].listPayees[i].indiaDomesticPayee ? payeeListData.payeeGroups[m].listPayees[i].indiaDomesticPayee.accountType : null,
                                    payeeGroupId: payeeListData.payeeGroups[m].listPayees[i].groupId

                                };
                            }
                        }

                    }

                    if (accountData !== null) {
                        for (let m = 0; m < accountData.accounts.length; m++) {
                            self.accountList.push({
                                displayValue: accountData.accounts[m].id.displayValue,
                                value: accountData.accounts[m].id.value
                            });
                        }
                    }

                    for (let i = 0; i < transferTypeData.enumRepresentations.length; i++) {
                        for (let j = 0; j < transferTypeData.enumRepresentations[i].data.length; j++) {
                            self.transferTypeArray.push({
                                description: transferTypeData.enumRepresentations[i].data[j].description,
                                code: transferTypeData.enumRepresentations[i].data[j].code
                            });
                        }
                    }

                    for (let i = 0; i < transferStatusData.enumRepresentations.length; i++) {
                        for (let j = 0; j < transferStatusData.enumRepresentations[i].data.length; j++) {
                            self.statusArray.push({
                                description: transferStatusData.enumRepresentations[i].data[j].description,
                                code: transferStatusData.enumRepresentations[i].data[j].code
                            });
                        }
                    }

                    self.filterDetailsLoaded(true);
                    ko.tasks.runEarly();

                });

        };

        if (!self.filterDetailsLoaded()) {
            self.getFilterDetails();
        }

        self.setPreviewData = function () {
            if (batchRequest.batchDetailRequestList.length) {
                FundTransferHistorySearchModel.batchRead(batchRequest).done(function (batchData) {
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
            FundTransferHistorySearchModel.batchRead(groupBatchRequest).done(function (groupBatchData) {
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
            FundTransferHistorySearchModel.getPayeeMaintenance().then(function (data) {
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

        self.search = function () {
            if (self.toDate() < self.fromDate()) {
                rootParams.baseModel.showMessages(null, [self.nls.history.errorMessageDate], "ERROR");
                self.fundTransfersLoaded(false);
                ko.tasks.runEarly();

                return;
            }

            self.fundTransfersLoaded(false);
            self.isDownload(false);
            ko.tasks.runEarly();

            self.queryParameters = {
                fromDate: self.fromDate(),
                toDate: self.toDate(),
                debitAccountId: self.debitAccountId(),
                transferType: self.transferType(),
                status: self.status(),
                transactionReferenceNumber: self.transactionReferenceNumber(),
                payeeName: self.payeeName() === "All" ? null : self.payeeName()
            };

            FundTransferHistorySearchModel.listFundTransfers(self.queryParameters, self.isDownload()).done(function (data) {

                self.fundTransfersData.removeAll();
                self.contentIdMap({});
                self.fundsDatasource(null);

                if (data.paymentDetailsDTOs.length) {
                    self.fundTransfersLoaded(false);

                    batchRequest.batchDetailRequestList = [];
                    groupBatchRequest.batchDetailRequestList = [];

                    for (let i = 0; i < data.paymentDetailsDTOs.length; i++) {

                        const obj = {
                            paymentId: data.paymentDetailsDTOs[i].paymentId ? data.paymentDetailsDTOs[i].paymentId : null,
                            instructionId: data.paymentDetailsDTOs[i].instructionId ? data.paymentDetailsDTOs[i].instructionId : null,
                            date: data.paymentDetailsDTOs[i].fromDate,
                            status: data.paymentDetailsDTOs[i].status ? data.paymentDetailsDTOs[i].status.replace(/\s/g, "").toLowerCase() : null,
                            debitAccountId: data.paymentDetailsDTOs[i].debitAccountId.displayValue,
                            payeeNickName: data.paymentDetailsDTOs[i].paymentType === "SELFFT" ? self.nls.history.self : data.paymentDetailsDTOs[i].payeeNickName ? data.paymentDetailsDTOs[i].payeeNickName : "",
                            payeeAccountId: data.paymentDetailsDTOs[i].payeeAccountId ? data.paymentDetailsDTOs[i].payeeAccountId.displayValue : "",
                            transferValue: data.paymentDetailsDTOs[i].transferValue ? data.paymentDetailsDTOs[i].payeeNickName === "TWITTER" ? data.paymentDetailsDTOs[i].transferValue.substring(20) : data.paymentDetailsDTOs[i].transferValue : "",
                            externalReferenceNumber: data.paymentDetailsDTOs[i].externalReferenceNumber,
                            amount: data.paymentDetailsDTOs[i].amount.amount,
                            currency: data.paymentDetailsDTOs[i].amount.currency,
                            paymentType: data.paymentDetailsDTOs[i].paymentType,
                            contentId: data.paymentDetailsDTOs[i].contentId ? data.paymentDetailsDTOs[i].contentId : null,
                            initials: data.paymentDetailsDTOs[i].payeeNickName ? oj.IntlConverterUtils.getInitials(data.paymentDetailsDTOs[i].payeeNickName.split(/\s+/)[0], data.paymentDetailsDTOs[i].payeeNickName.split(/\s+/)[1]) : "OA",
                            preview: ko.observable(null)
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

                        self.fundTransfersData.push(obj);
                    }

                    self.fundsDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.fundTransfersData, {
                        idAttribute: ["externalReferenceNumber"]
                    })));

                    self.fundTransfersLoaded(true);
                    ko.tasks.runEarly();
                    self.loadBatchImages();
                } else {
                    rootParams.baseModel.showMessages(null, [self.nls.history.errorMessage], "ERROR");
                }
            });

        };

        self.reInitiateDetails = function (event) {
            FundTransferHistorySearchModel.getPaymentDetails(self.selectedPaymentId(), self.selectedPaymentType(), false, null, null).then(function (responseData) {
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
            if (data.payeeId) {
                if (self.payeeDetailsMap[data.payeeId]) {
                    self.paymentDetails().adhocPayment = false;
                    self.performAction(event);

                } else if (data.payeeId && data.groupId) {
                    FundTransferHistorySearchModel.readPayee(data.groupId, data.payeeId, data.payeeType).then(function (responseData) {
                        const details = responseData.internalPayee ? responseData.internalPayee : responseData.domesticPayee ? responseData.domesticPayee.indiaDomesticPayee : responseData.demandDraftPayeeDTO ? responseData.demandDraftPayeeDTO : null;

                        self.paymentDetails().adhocPayment = true;
                        self.paymentDetails().payeeStatus = details.status;
                        self.paymentDetails().payeeAccountType = details.accountType;

                        self.performAction(event);

                    });
                }

            } else {
                self.paymentDetails().adhocPayment = true;
                self.performAction(event);
            }
        };

        self.openMenu = function (rowData, event) {
            $("#menuLauncher-contents-" + rowData.externalReferenceNumber).ojMenu("open", event);
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
                    rootParams.dashboard.loadComponent("fund-transfer-view-details", {
                        mode: "approval",
                        paymentId: self.selectedPaymentId(),
                        reviewMode: false,
                        transferData: transferDataParam,
                        retainedData: self,
                        data: data
                    }, self);
                } else if (self.selectedPaymentType() === "DOMESTICDRAFT") {
                    rootParams.dashboard.loadComponent("fund-transfer-view-details", {
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
                    if (rootParams.dashboard.appData.segment === "CORP") {
                        rootParams.baseModel.registerComponent(loadingComponent, "payments");

                        rootParams.dashboard.loadComponent(loadingComponent, {
                            transferObject: self.paymentDetails ? ko.observable(self.paymentDetails()) : null
                        });

                    } else {
                        rootParams.changeView(loadingComponent, {
                            //component: loadingComponent,
                            transferObject: self.paymentDetails ? ko.observable(self.paymentDetails()) : null,
                            applicationType: "payments"
                        });
                    }
                } else if (self.selectedPaymentType() === "DOMESTICDRAFT") {
                    if (rootParams.dashboard.appData.segment === "CORP") {
                        rootParams.baseModel.registerComponent(loadingComponent, "payments");

                        rootParams.dashboard.loadComponent(loadingComponent, {
                            fundTransferObject: self.paymentDetails ? ko.observable(self.paymentDetails()) : null
                        });
                    } else {
                        rootParams.changeView(loadingComponent, {
                            fundTransferObject: self.paymentDetails ? ko.observable(self.paymentDetails()) : null
                        });
                    }

                }
            }
        };

        self.menuItemSelect = function (rowData, event) {

            self.selectedPaymentId(rowData.paymentId);
            self.selectedPaymentType(rowData.paymentType);
            self.transactionStatus(rowData.status);
            self.reInitiateDetails(event);

        };

        FundTransferHistorySearchModel.fetchMediaType().done(function (data) {
            self.mediatypeLoaded(false);
            self.availableFomats.removeAll();

            for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.availableFomats.push({
                    text: data.enumRepresentations[0].data[i].code,
                    value: data.enumRepresentations[0].data[i].value,
                    description: data.enumRepresentations[0].data[i].description
                });
            }

            self.mediatypeLoaded(true);
        });

        self.download = function () {
            self.isDownload(true);
            FundTransferHistorySearchModel.downloadTransferHistory(self.queryParameters, self.isDownload());
        };

        self.clear = function () {
            self.payeeName("All");
            self.transactionReferenceNumber(null);
            self.status("");
            self.transferType("");
            self.debitAccountId("");
            self.fromDate("");
            self.toDate("");

            self.fundTransfersData.removeAll();
            self.contentIdMap({});
            self.fundsDatasource(null);

            self.fundTransfersLoaded(false);
            ko.tasks.runEarly();
        };

        self.showOptions = function () {
            self.showOptionRecords(true);
        };

        self.showLessOptions = function () {
            self.showOptionRecords(false);
        };

        if (!self.fundTransfersLoaded()) {
            self.search();
        }
    };
});