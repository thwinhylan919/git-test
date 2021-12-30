define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/scheduled-payments",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojselectcombobox",
    "ojs/ojavatar"
], function (oj, ko, $, ScheduledPaymentsInfoModel, ResourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;
        let i = 0;
        const getNewKoModel = function () {
            const KoModel = ScheduledPaymentsInfoModel.getNewModel();

            return KoModel;
        };

        ko.utils.extend(self, rootParams.rootModel);

        const batchRequest = {
                batchDetailRequestList: []
            },
            groupBatchRequest = {
                batchDetailRequestList: []
            };

        self.resource = ResourceBundle;

        if (!rootParams.dashboard.isDashboard()) {
            rootParams.dashboard.headerName(rootParams.baseModel.small() ? self.resource.upcomingPayments.smalltitle : self.resource.upcomingPayments.title);
        }

        self.upcomingPaymentsData = [];
        self.upcomingPaymentsLoaded = ko.observable(false);
        self.drillDown = ko.observable(false);
        self.currentUpcomingPaymentData = ko.observable();
        self.cancelSIClicked = ko.observable(false);
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.monthDate = ko.observable();
        self.switcher = ko.observable(0);
        self.validator = ko.observable();
        self.confirmScreenDetails = ko.observable();
        self.datasource = null;
        self.accountId = ko.observable();
        self.accountList = ko.observableArray();
        self.additionalDetails = ko.observable();
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.dataLoaded = ko.observable(false);
        self.isWeek = ko.observable(false);
        self.isMonth = ko.observable(true);
        self.weekCount = ko.observable(0);
        self.monthCount = ko.observable(0);
        self.menuSelection = ko.observable();
        self.menuCountOptions = ko.observableArray();
        self.uiOptions = ko.observable();
        self.paymentDetails = ko.observable({});
        self.beneficiaryName = ko.observable();
        self.extRefId = ko.observable();
        self.currentTask = ko.observable("PC_I_INSTRL");
        rootParams.baseModel.registerElement(["date-box", "modal-window", "floating-panel", "nav-bar", "confirm-screen", "account-input", "search-box", "object-card"]);
        rootParams.baseModel.registerComponent("payments-money-transfer", "payments");
        rootParams.baseModel.registerComponent("standing-instructions-landing", "payments");
        rootParams.baseModel.registerComponent("review-scheduled-payments", "payments");
        self.cancelModel = getNewKoModel().cancelModel;
        self.accountList = ko.observableArray();
        self.accountFetched = ko.observable(false);
        self.contentIdMap = ko.observable({});
        ScheduledPaymentsInfoModel.init();
        self.imageUploadFlag = ko.observable();
        self.selectedPayeeImage = ko.observable();
        self.selectedPayeeInitials = ko.observable();
        self.groupIdMap = ko.observable({});

        self.categoryChangeHandler = function (data) {
            if (data.detail.value && data.detail.trigger) {
                self.accountId(data.detail.value);

                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {
                    idAttribute: ["externalReferenceNumber", "name"]
                }));

                self.monthDatasource = null;
                self.weekDatasource = null;
                self.isWeek(false);
                self.isMonth(true);
                self.accountId(data.detail.value);
                self.getData();
            }
        };

        self.closeDialog = function () {
            $("#noaccount").hide();
        };

        let sortAscending = true;

        /**
         * This function compares two dates.
         *
         * @param {Date} a  - - - - - - - - - - - - - - - An object containing date.
         * @param {Date} b  An object containing date.
         * @return {int}  -1:when a is less than b  1:when a is greater than b  0 when a is equals to b.
         */
        function sortTxnByDate(a, b) {
            if (a.date < b.date) {
                return sortAscending ? -1 : 1;
            } else if (a.date > b.date) {
                return sortAscending ? 1 : -1;
            }

            return 0;
        }

        self.sortcallback = function (event, ui) {
            sortAscending = ui.direction === "ascending";

            if (ui.header === "date") {
                self.monthDatasource.sort(sortTxnByDate);

                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.monthDatasource || [], {
                    idAttribute: ["externalReferenceNumber", "name"]
                }));
            }
        };

        self.openTab = function (applicationType, defaultTab) {
            self.selectedTab = "";

            rootParams.dashboard.loadComponent("manage-accounts", {
                applicationType: applicationType,
                defaultTab: defaultTab,
                isStandingInstruction: applicationType === "standing-instructions",
                isSuccess: self.params ? self.params.isSuccess : false
            });
        };

        self.fetchAccountList = function () {
            self.accountList.removeAll();

            const urlList = ["virtual?q=" + JSON.stringify({
                criteria: [{
                    operand: "vStatus",
                    operator: "EQUALS",
                    value: ["O"]
                }]
            }), "demandDeposit"];

            ScheduledPaymentsInfoModel.fetchAccountData(self.currentTask(), urlList).then(function (response) {
                self.accountList.removeAll();

                let accounts = [];

                response.batchDetailResponseDTOList.forEach(function (res) {
                    if (res.status === 200) {
                        accounts = accounts.concat(res.responseObj.accounts || res.responseObj || []);
                    }
                });

                if (accounts.length) {
                    self.accountList.push({
                        id: {
                            value: "all",
                            displayValue: self.resource.upcomingPayments.allAccounts
                        }
                    });

                    ko.utils.arrayPushAll(self.accountList, accounts);
                    self.accountFetched(true);
                } else {
                    self.accountFetched(false);
                    $("#noaccount").trigger("openModal");
                }
            }).catch(function () {
                self.accountFetched(false);
                $("#noaccount").trigger("openModal");
            });
        };

        if (!rootParams.dashboard.isDashboard()) {
            self.fetchAccountList();
        }

        self.menuSelection.subscribe(function (newValue) {
            self.upcomingPaymentsLoaded(false);

            if (newValue === "month") {
                self.isMonth(true);
                self.isWeek(false);

                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.monthDatasource || [], {
                    idAttribute: ["externalReferenceNumber", "name"]
                }));
            } else if (newValue === "week") {
                self.isWeek(true);
                self.isMonth(false);

                self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.weekDatasource || [], {
                    idAttribute: ["externalReferenceNumber", "name"]
                }));
            }

            ko.tasks.runEarly();
            self.upcomingPaymentsLoaded(true);
        });

        self.callMenu = function () {
            self.menuCountOptions.removeAll();

            self.menuCountOptions.push({
                label: self.resource.upcomingPayments.week,
                id: "week",
                count: self.weekCount()
            });

            self.menuCountOptions.push({
                label: self.resource.upcomingPayments.month,
                id: "month",
                count: self.monthCount()
            });

            self.menuSelection(self.menuCountOptions()[0].id);

            self.uiOptions({
                menuFloat: "left",
                fullWidth: false,
                defaultOption: self.menuSelection
            });

            self.upcomingPaymentsLoaded(true);
        };

        self.uiOptions({
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        });

        self.showModule = function (module) {
            self.menuSelection(module.id);
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
                ScheduledPaymentsInfoModel.batchRead(batchRequest).done(function (batchData) {
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
            ScheduledPaymentsInfoModel.batchRead(groupBatchRequest).done(function (groupBatchData) {
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
            ScheduledPaymentsInfoModel.getPayeeMaintenance().then(function (data) {
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
                        getGroupContentData();
                    } else {
                        setPreviewData();
                    }
                }
            });
        }

        self.getData = function () {
            self.upcomingPaymentsLoaded(false);
            self.baseURL = "payments/instructions?status=ACTIVE&type=ALL&fromDate={fromDate}&toDate={toDate}";

            if (rootParams.dashboard.appData.segment === "CORP" && self.accountId() !== "all") {
                self.baseURL = self.baseURL + "&accountId=" + self.accountId();
            }

            const toDate = self.isWeek() ? self.toDate() : self.monthDate();

            ScheduledPaymentsInfoModel.getUpcomingPaymentsList(self.fromDate(), toDate, self.accountId(), self.baseURL).done(function (data) {
                if (data.instructionsList) {
                    self.upcomingPaymentsData = [];
                    batchRequest.batchDetailRequestList = [];

                    const count = data.instructionsList.length;

                    for (i = 0; i < count; i++) {
                        const paymenttype = data.instructionsList[i].paymentType,
                            type = data.instructionsList[i].type;

                        self.upcomingPaymentsData[i] = {
                            date: data.instructionsList[i].nextExecutionDate,
                            amount: data.instructionsList[i].amount.amount,
                            currency: data.instructionsList[i].amount.currency,
                            creditAccount: data.instructionsList[i].creditAccountId,
                            account: data.instructionsList[i].debitAccountId.displayValue,
                            dealId: data.instructionsList[i].dealId,
                            description: self.resource.upcomingPayments.type[data.instructionsList[i].paymentType],
                            externalReferenceNumber: data.instructionsList[i].externalReferenceNumber,
                            name: data.instructionsList[i].payeeNickName ? data.instructionsList[i].payeeNickName : "-",
                            desc: self.resource.upcomingPayments.type[paymenttype],
                            descforTable: self.resource.upcomingPayments.type.table[paymenttype],
                            payType: self.resource.upcomingPayments.type[type],
                            type: type,
                            startDate: data.instructionsList[i].startDate,
                            endDate: data.instructionsList[i].endDate,
                            freqYears: data.instructionsList[i].freqYears,
                            freqDays: data.instructionsList[i].freqDays,
                            freqMonths: data.instructionsList[i].freqMonths,
                            nextExecutionDate: data.instructionsList[i].nextExecutionDate,
                            instances: data.instructionsList[i].instances,
                            paymenttype: paymenttype,
                            branch: data.instructionsList[i].branchCode,
                            remarks: data.instructionsList[i].remarks,
                            purpose: data.instructionsList[i].purpose,
                            contentId: data.instructionsList[i].contentId,
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

                    loadBatchImages();

                    self.upcomingPaymentsData.sort(function (a, b) {
                        a = new Date(a.date);
                        b = new Date(b.date);

                        return a < b ? 1 : a > b ? -1 : 0;
                    });

                    if (self.isWeek()) {
                        self.weekDatasource = self.upcomingPaymentsData;

                        self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.weekDatasource || [], {
                            idAttribute: ["externalReferenceNumber", "name"]
                        }));

                        self.weekCount(count);
                        self.isWeek(false);
                        self.callMenu();
                    }

                    if (self.isMonth()) {
                        self.monthDatasource = self.upcomingPaymentsData;
                        self.monthCount(count);
                        self.isMonth(false);
                        self.isWeek(true);

                        if (rootParams.dashboard.appData.segment === "CORP") {
                            self.getData();
                        } else if (rootParams.dashboard.appData.segment !== "CORP" && !rootParams.dashboard.isDashboard()) {
                            self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.monthDatasource || [], {
                                idAttribute: ["externalReferenceNumber", "name"]
                            }));

                            self.upcomingPaymentsLoaded(true);
                        }
                    }
                } else {
                    if (self.isMonth()) {
                        self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {
                            idAttribute: ["externalReferenceNumber", "name"]
                        }));

                        self.monthDatasource = null;
                        self.weekDatasource = null;
                        self.monthCount(0);
                        self.weekCount(0);
                    } else if (self.isWeek()) {
                        self.weekCount(0);
                        self.weekDatasource = null;
                    }

                    self.callMenu();
                }

            });
        };

        ScheduledPaymentsInfoModel.getHostDate().done(function (data) {
            self.fromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(data.currentDate.valueDate)));

            const date = new Date(data.currentDate.valueDate);

            date.setDate(date.getDate() + 8);
            self.toDate(oj.IntlConverterUtils.dateToLocalIso(date));
            date.setDate(date.getDate() + 22);
            self.monthDate(oj.IntlConverterUtils.dateToLocalIso(date));
            self.getData();
        });

        let openTab;

        self.changeIcon = function (data) {
            if (data.externalReferenceNumber !== openTab) {
                $(".id_drilldown").slideUp();
                $("#" + data.externalReferenceNumber + "drilldown").slideToggle();
                openTab = data.externalReferenceNumber;
            } else {
                $(".id_drilldown").slideUp();
            }
        };

        self.getDate = function (startDate) {
            const date = startDate.substring(9, 10);

            return date;
        };

        self.cancelSI = function (data) {
            self.selectedPayeeImage(data.preview());
            self.selectedPayeeInitials(data.initials);
            self.cancelSIClicked(false);
            self.currentUpcomingPaymentData(data);
            self.cancelSIClicked(true);

            rootParams.dashboard.loadComponent("cancel-standing-instruction", {
                header: self.resource.upcomingPayments.cancelTitle,
                data: self.currentUpcomingPaymentData(),
                selectedPayeeImage: self.selectedPayeeImage,
                selectedPayeeInitials: self.selectedPayeeInitials,
                callback: self.getData(),
                imageUploadFlag: self.imageUploadFlag
            }, self);
        };

        self.delete = function (data) {
            self.type = data.type;
            self.extRefId(data.externalReferenceNumber);
            self.cancelModel.instructionType = data.type;

            const payload = ko.toJSON(self.cancelModel);

            ScheduledPaymentsInfoModel.initiateCancelSI(data.externalReferenceNumber, payload).done(function () {
                self.paymentDetails({
                    payeeName: data.name,
                    accountType: data.desc,
                    accountNumber: data.creditAccount,
                    accountName: "",
                    branch: data.branch,
                    amount: data.amount,
                    currency: data.currency,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    fromAccount: data.account,
                    purpose: "",
                    frequency: self.getRepeatData(data),
                    extRefId: data.externalReferenceNumber,
                    type: data.type,
                    remarks: data.remarks,
                    isDraft: data.paymenttype.indexOf("DRAFT") > -1,
                    transactionType: data.paymenttype
                });

                self.beneficiaryName(self.paymentDetails().payeeName);
                self.dataLoaded(true);
                self.stageOne(false);

                rootParams.dashboard.loadComponent("review-scheduled-payments", {
                    reviewMode: true,
                    header: rootParams.dashboard.headerName(),
                    confirmScreenDetails: self.confirmScreenDetails(),
                    data: {
                        externalReferenceId: ko.observable(data.externalReferenceNumber),
                        preview: data.preview(),
                        initials: data.initials,
                        imageUploadFlag: self.imageUploadFlag,
                        confirmDelete: self.confirmDelete
                    }
                });

                rootParams.dashboard.headerName(self.resource.upcomingPayments.titleDelete);
            });
        };

        self.back = function () {
            self.stageTwo(false);
            self.stageOne(true);
        };

        self.confirmDelete = function () {
            ScheduledPaymentsInfoModel.verifyCancelSI(self.extRefId()).done(function (data, status, jqXHR) {
                if (!data.tokenAvailable) {
                    self.stageTwo(false);
                    self.httpStatus = jqXHR.status;

                    let successMessage, statusMessages;

                    if (rootParams.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                        successMessage = self.resource.common.confirmScreen.corpMaker;
                        statusMessages = self.resource.common.confirmScreen.approvalMessages.PENDING_APPROVAL.statusmsg;
                    } else {
                        successMessage = self.resource.common.confirmScreen.successSI;
                        statusMessages = self.resource.common.success;
                    }

                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        eReceiptRequired: true,
                        confirmScreenExtensions: {
                            successMessage: successMessage,
                            statusMessages: statusMessages,
                            isSet: true,
                            eReceiptRequired: true,
                            taskCode: "PC_F_PIC",
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/payments-template"
                        },
                        hostReferenceNumber: self.extRefId(),
                        transactionName: self.resource.upcomingPayments.confirmDelete
                    });

                    self.transactionName = self.resource.upcomingPayments.titleDelete;
                }
            });
        };

        self.getRepeatData = function (data) {
            if (data.type === "REC") {
                if (data.freqYears > 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgyears, {
                        n: data.freqYears
                    });
                } else if (data.freqMonths > 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgmonths, {
                        n: data.freqMonths
                    });
                } else if (data.freqDays > 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgdays, {
                        n: data.freqDays
                    });
                } else if (data.freqYears === 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgyear);
                } else if (data.freqMonths === 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgmonth);
                } else if (data.freqDays === 1) {
                    return rootParams.baseModel.format(self.resource.upcomingPayments.repeatmsgday);
                }
            } else {
                return "";
            }
        };

        self.showFloatingPanel = function () {
            $("#scheduled-payment-options")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
        };

        self.dismissDialog = function () {
            $("#menuButtonDialog").hide();
        };

        rootParams.baseModel.registerComponent("cancel-standing-instruction", "payments");

        self.menuItems = [{
            id: "cancel",
            label: self.resource.generic.common.cancel
        }];

        self.openMenu = function (data, event) {
            $("#menuLauncher-payments-contents-" + data.externalReferenceNumber).ojMenu("open", event);
        };

        self.closeHandler = function () {
            self.cancelSIClicked(false);
            $("#menuButtonDialog").hide();
        };

        self.menuItemSelect = function (data, event, ui) {
            if (ui.item[0].id === "cancel") {
                self.cancelSI(data);
            }
        };
    };
});