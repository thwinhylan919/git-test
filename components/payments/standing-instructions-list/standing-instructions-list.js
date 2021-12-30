define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/standing-instructions",
    "ojs/ojinputnumber",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojavatar"
], function(oj, ko, $, SIModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            baseModel = rootParams.baseModel,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(SIModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel.previousState ? rootParams.rootModel.previousState.retainedData : rootParams.rootModel);

        const batchRequest = {
                batchDetailRequestList: []
            },
            groupBatchRequest = {
                batchDetailRequestList: []
            };

        self.resource = ResourceBundle.payments.standinginstructions;
        self.lebel = ResourceBundle.payments.label;
        self.generic = ResourceBundle.payments.generic;
        self.common = ResourceBundle.payments.common;
        rootParams.dashboard.headerName(self.resource.standinginstruction_header);
        self.SIList = ko.observableArray();
        self.isSIListLoaded = ko.observable(false);
        self.dataLoaded = ko.observable(false);
        self.stageOne = ko.observable(true);
        self.SIListDataSource = ko.observable(null);
        self.isStandingInstruction = ko.observable(true);
        self.paymentType = ko.observable();
        self.SIDetailsLoaded = ko.observable(false);
        self.confirmScreenDetails = ko.observable();
        self.stopClicked = ko.observable(false);
        self.paymentDetails = ko.observable({});
        self.paymentType = ko.observable();
        self.selectedSIExternRfNum = ko.observable();
        self.modelWindowLoaded = ko.observable(false);
        self.contentIdMap = ko.observable({});
        self.groupIdMap = ko.observable({});
        self.selectedPayeeImage = ko.observable();
        self.selectedPayeeInitials = ko.observable();
        self.SICancelModel = getNewKoModel().standingInstructionCancelModel;
        self.dispose = null;

        baseModel.registerComponent("payments-money-transfer", "payments");
        baseModel.registerComponent("standing-instruction-detail", "payments");

        baseModel.registerElement([
            "search-box",
            "confirm-screen"
        ]);

        self.menuItems = [{
                id: "view",
                label: self.lebel.view
            },
            {
                id: "stop",
                label: self.lebel.stop
            }
        ];

        self.imageUploadFlag = ko.observable();

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
                SIModel.batchRead(batchRequest).done(function(batchData) {
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
            SIModel.batchRead(groupBatchRequest).done(function(groupBatchData) {
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
            SIModel.getPayeeMaintenance().then(function(data) {
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

        self.openMenu = function(data, event) {
            $("#menuLauncher-standingInstruction-contents-" + data.externalReferenceNumber).ojMenu("open", event);
        };

        self.menuItemSelect = function(data, event) {
            self.selectedSIExternRfNum(data.externalReferenceNumber);
            self.selectedPayeeImage(data.preview());
            self.selectedPayeeInitials(data.initials);

            if (event.target.id === "stop") {
                self.stopClicked(true);
                self.loadDetailsComponent(data);
            } else if (event.target.id === "view") {
                self.paymentType(data.paymentType);
                self.stopClicked(false);
                self.loadDetailsComponent(data);
            }
        };

        let sortAscending = true;

        function sortTxnByDate(a, b) {
            if (a.nextExecDateObj < b.nextExecDateObj) { return sortAscending ? -1 : 1; } else if (a.nextExecDateObj > b.nextExecDateObj) { return sortAscending ? 1 : -1; }

            return 0;
        }

        function sortTxnByAmount(a, b) {
            if (a.amount.amount < b.amount.amount) { return sortAscending ? -1 : 1; } else if (a.amount.amount > b.amount.amount) { return sortAscending ? 1 : -1; }

            return 0;
        }

        self.sortcallback = function(event, ui) {
            sortAscending = ui.direction === "ascending";

            if (ui.header === "nextExecutionDate") {
                self.SIList.sort(sortTxnByDate);

                self.SIListDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.SIList(), {
                    idAttribute: ["payeeNickName"]
                })));
            } else if (ui.header === "amount") {
                self.SIList.sort(sortTxnByAmount);

                self.SIListDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.SIList(), {
                    idAttribute: ["payeeNickName"]
                })));
            }
        };

        SIModel.init();
        self.paymentType = ko.observable();

        self.loadDetailsComponent = function(data) {
            self.dataLoaded(false);
            self.paymentType(data.paymentType);
            self.selectedPayeeImage(data.preview());
            self.selectedPayeeInitials(data.initials);
            self.selectedSIExternRfNum(data.externalReferenceNumber);

            rootParams.dashboard.loadComponent("standing-instruction-detail", {
                externalReferenceId: self.selectedSIExternRfNum(),
                retainedData: self,
                paymentType: self.paymentType,
                isStopClicked: self.stopClicked,
                getRepeatData: self.getRepeatData,
                closeModal: self.closeModal,
                confirmScreenDetails: self.confirmScreenDetails,
                selectedPayeeImage: self.selectedPayeeImage,
                selectedPayeeInitials: self.selectedPayeeInitials,
                imageUploadFlag: self.imageUploadFlag
            }, self);
        };

        self.formatFrequency = function(fyear, fmonth, fday) {
            if (fyear && fmonth && fday) {
                return rootParams.baseModel.format(self.resource.frequencymsg.everynyearsnmonthsndays, {
                    y: fyear,
                    m: fmonth,
                    d: fday
                });
            } else if (fyear && fmonth) {
                return rootParams.baseModel.format(self.resource.frequencymsg.everynyearsnmonths, {
                    y: fyear,
                    m: fmonth
                });
            } else if (fyear && fday) {
                return rootParams.baseModel.format(self.resource.frequencymsg.everynyearsndays, {
                    y: fyear,
                    d: fday
                });
            } else if (fmonth && fday) {
                return rootParams.baseModel.format(self.resource.frequencymsg.everynmonthsndays, {
                    m: fmonth,
                    d: fday
                });
            } else if (fyear > 1) {
                return rootParams.baseModel.format(self.resource.frequencymsg.everynyears, {
                    y: fyear
                });
            } else if (fmonth > 1) {
                return rootParams.baseModel.format(self.resource.frequencymsg.everynmonths, {
                    m: fmonth
                });
            } else if (fday > 1) {
                return rootParams.baseModel.format(self.resource.frequencymsg.everyndays, {
                    d: fday
                });
            } else if (fyear) { return self.resource.frequencymsg.everyyear; } else if (fmonth) { return self.resource.frequencymsg.everymonth; } else if (fday) { return self.resource.frequencymsg.everyday; }
        };

        self.closeModal = function() {
            if (rootParams.dashboard.appData.segment !== "CORP" && baseModel.large()) {
                self.stopClicked(false);
                $("#view-SI").hide();
                self.modelWindowLoaded(false);
            } else { rootParams.dashboard.hideDetails(); }
        };

        self.getData = function() {
            SIModel.getSIList().done(function(data) {
                self.isSIListLoaded(false);
                self.SIList.removeAll();

                if (data.instructionsList) {
                    for (let i = 0; i < data.instructionsList.length; i++) {
                        const obj = data.instructionsList[i];

                        obj.transactionType = self.resource.msgtype.table[obj.paymentType];
                        obj.frequency = self.formatFrequency(obj.freqYears, obj.freqMonths, obj.freqDays);
                        obj.acno = obj.debitAccountId.displayValue;
                        obj.nextExecDateObj = new Date(obj.nextExecutionDate);
                        obj.initials = oj.IntlConverterUtils.getInitials(obj.payeeNickName);
                        obj.preview = ko.observable(null);

                        if (obj.contentId && obj.contentId.value) {
                            if (!self.contentIdMap()[obj.contentId.value]) { self.contentIdMap()[obj.contentId.value] = ko.observable(); }

                            obj.preview = self.contentIdMap()[obj.contentId.value];
                            loadBatchRequest(obj.contentId.value);
                        } else if (obj.payeeGroupId) {
                            if (!self.contentIdMap()[obj.payeeGroupId]) { self.contentIdMap()[obj.payeeGroupId] = ko.observable(); }

                            obj.preview = self.contentIdMap()[obj.payeeGroupId];
                            loadGroupRequest(obj.payeeGroupId);

                        }

                        self.SIList.push(obj);
                    }
                }

                self.SIListDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.SIList(), {
                    idAttribute: ["payeeNickName"]
                } || [])));

                self.isSIListLoaded(true);
                loadBatchImages();
            });

        };

        self.getData();

        self.createSI = function() {
            rootParams.dashboard.loadComponent("payments-money-transfer", {
                isStandingInstruction: true,
                retainedData: self
            });
        };

        self.getRepeatData = function(data) {
            return self.formatFrequency(data.freqYears, data.freqMonths, data.freqDays);
        };
    };
});