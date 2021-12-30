define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/scheduled-payments-widgets",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojselectcombobox"
], function(oj, ko, ScheduledPaymentsInfoModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,

            batchRequest = {
                batchDetailRequestList: []
            },
            groupBatchRequest = {
                batchDetailRequestList: []
            };

        self.resource = ResourceBundle;
        self.datasource = null;
        self.upcomingPaymentsData = [];
        self.upcomingPaymentsLoaded = ko.observable(false);
        self.groupIdMap = ko.observable({});
        self.contentIdMap = ko.observable({});
        self.imageUploadFlag = ko.observable(false);
        rootParams.baseModel.registerElement("date-box");

        self.openTab = function(applicationType, defaultTab) {
            self.selectedTab = "";

            rootParams.dashboard.loadComponent("manage-accounts", {
                applicationType: applicationType,
                defaultTab: defaultTab,
                isStandingInstruction: applicationType === "standing-instructions",
                isSuccess: self.params ? self.params.isSuccess : false
            });
        };

        function loadGroupRequest(groupId) {
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
        }

        function loadBatchRequest(id) {
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
        }

        function setPreviewData() {
            if (batchRequest.batchDetailRequestList.length) {
                ScheduledPaymentsInfoModel.batchRead(batchRequest).done(function(batchData) {
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
        }

        function getGroupContentData() {
            ScheduledPaymentsInfoModel.batchRead(groupBatchRequest).done(function(groupBatchData) {
                for (let i = 0; i < groupBatchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = groupBatchData.batchDetailResponseDTOList[i].responseObj;

                    if (responseDTO.payeeGroup.contentId && responseDTO.payeeGroup.contentId.value) {
                        self.groupIdMap()[responseDTO.payeeGroup.contentId.value] = ko.observable();
                        self.groupIdMap()[responseDTO.payeeGroup.contentId.value](responseDTO.payeeGroup.groupId);
                        loadBatchRequest(responseDTO.payeeGroup.contentId.value);
                    }
                }

                setPreviewData();
            });
        }

        function loadBatchImages() {
            ScheduledPaymentsInfoModel.getPayeeMaintenance().then(function(data) {
                const propertyValue = ko.utils.arrayFirst(data.configurationDetails, function(element) {
                    return element.propertyId === "RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED";
                }).propertyValue;

                if (propertyValue === "Y") {
                    self.imageUploadFlag(true);
                } else {
                    self.imageUploadFlag(false);
                }

                if (self.imageUploadFlag()) {
                    if (groupBatchRequest.batchDetailRequestList.length > 0) { getGroupContentData(); } else { setPreviewData(); }
                }
            });
        }

        function setData(data) {
            self.upcomingPaymentsLoaded(false);

            if (data.instructionsList) {
                for (let i = 0; i < data.instructionsList.length; i++) {
                    self.upcomingPaymentsData[i] = {
                        externalReferenceNumber: data.instructionsList[i].externalReferenceNumber,
                        date: data.instructionsList[i].nextExecutionDate,
                        amount: data.instructionsList[i].amount.amount,
                        currency: data.instructionsList[i].amount.currency,
                        name: data.instructionsList[i].payeeNickName ? data.instructionsList[i].payeeNickName : "-",
                        initials: oj.IntlConverterUtils.getInitials(data.instructionsList[i].payeeNickName ? data.instructionsList[i].payeeNickName : "-"),
                        preview: ko.observable(null)
                    };

                    if (data.instructionsList[i].contentId && data.instructionsList[i].contentId.value) {
                        if (!self.contentIdMap()[data.instructionsList[i].contentId.value]) {
                            self.contentIdMap()[data.instructionsList[i].contentId.value] = ko.observable();
                        }

                        self.upcomingPaymentsData[i].preview = self.contentIdMap()[data.instructionsList[i].contentId.value];
                        loadBatchRequest(data.instructionsList[i].contentId.value);
                    } else if (data.instructionsList[i].payeeGroupId) {
                        if (!self.contentIdMap()[data.instructionsList[i].payeeGroupId]) {
                            self.contentIdMap()[data.instructionsList[i].payeeGroupId] = ko.observable();
                        }

                        self.upcomingPaymentsData[i].preview = self.contentIdMap()[data.instructionsList[i].payeeGroupId];
                        loadGroupRequest(data.instructionsList[i].payeeGroupId);
                    }
                }

                self.upcomingPaymentsData.sort(function(a, b) {
                    a = new Date(a.date);
                    b = new Date(b.date);

                    return a < b ? 1 : a > b ? -1 : 0;
                });

                self.datasource = new oj.ArrayTableDataSource(self.upcomingPaymentsData.slice(0, 3) || [], {
                    idAttribute: [
                        "externalReferenceNumber",
                        "name"
                    ]
                });

                self.upcomingPaymentsLoaded(true);
            } else {
                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {
                    idAttribute: [
                        "externalReferenceNumber",
                        "name"
                    ]
                }));

                self.upcomingPaymentsLoaded(true);
            }

            loadBatchImages();
        }

        self.getData = function(fromDate, toDate) {
            ScheduledPaymentsInfoModel.getUpcomingPaymentsList(fromDate, toDate).done(function(data) {
                setData(data);
            });
        };

        ScheduledPaymentsInfoModel.getHostDate().done(function(data) {
            const date = new Date(data.currentDate.valueDate);

            date.setDate(date.getDate() + 30);
            self.getData(oj.IntlConverterUtils.dateToLocalIso(new Date(data.currentDate.valueDate)), oj.IntlConverterUtils.dateToLocalIso(date));
        });
    };
});