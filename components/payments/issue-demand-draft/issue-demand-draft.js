define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/issue-demand-draft",
    "ojs/ojselectcombobox",
    "ojs/ojradioset",
    "ojs/ojdatetimepicker",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojavatar"
], function(oj, ko, $, DemandDraftModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            batchRequest = {
                batchDetailRequestList: []
            },
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(DemandDraftModel.getNewModel());

                return KoModel;
            };

        self.payments = ResourceBundle.payments;

        self.transferOnArray = [{
                id: "NOW",
                label: self.payments.demanddraft.now
            }
        ];

        self.issueDate = ko.observable(self.transferOnArray[0].id);
        self.addressDetailsFetched = ko.observable(false);
        self.demandDraftPayload = getNewKoModel().demandDraftModel;
        self.addressDetails = ko.toJS(getNewKoModel().addressDetails);
        self.currentTask = ko.observable("PC_F_DOMDRAFT");
        self.customCurrencyURL = ko.observable(null);
        self.transferCurrency = ko.observable();
        self.payeeReceiverDetailsLoaded = ko.observable(false);
        self.payeeData = ko.observable();

        let callRefreshDropDown = false;

        self.selectedPayee = ko.observable();
        self.payeeId = ko.observable(self.params ? self.params.payeeId || null : null);
        self.groupId = ko.observable(self.params ? self.params.groupId || null : null);
        self.payee = ko.observable();
        ko.utils.extend(self, rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState) : rootParams.rootModel);
        self.defaultData = rootParams.options ? rootParams.options.data : rootParams.rootModel.params;

        rootParams.dashboard.headerCaption("");
        self.paymentId = ko.observable();

        self.common = ResourceBundle.payments.common;
        self.parentTaskCode = ko.observable("");

        if (rootParams.dashboard.appData.segment === "CORP") {
            rootParams.dashboard.headerName(self.payments.demanddraft_header);
        } else {
            rootParams.dashboard.headerName(self.payments.demanddraft_header_retail);
        }

        self.currentDate = ko.observable();
        self.tomorrow = ko.observable();
        self.additionalDetails = ko.observable();
        self.fromFavourites = ko.observable(false);
        self.removeFavouriteFlag = ko.observable(false);

        rootParams.baseModel.registerElement([
            "comment-box",
            "amount-input",
            "account-input",
            "confirm-screen"
        ]);

        rootParams.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        rootParams.baseModel.registerComponent("available-limits", "financial-limits");
        self.validationTracker = ko.observable();
        self.model = ko.observable();
        self.isDataLoaded = ko.observable(true);
        self.verificationCode = ko.observable();
        self.invalidVerificationCode = ko.observable(false);
        self.readSuccess = ko.observable(false);
        self.transactionType = ko.observable();
        self.minSelectableDate = ko.observable();
        self.currentDateLoaded = ko.observable(false);
        self.demandDraftInstructionPayload = getNewKoModel().demandDraftInstructionModel;
        self.favoritesPayLoad = getNewKoModel().favoritesModel;
        self.formattedToday = ko.observable();
        self.payeeType = ko.observable();
        self.refreshAmountComponent = ko.observable(true);
        self.isPayeeListEmpty = ko.observable(false);
        self.formattedTomorrow = ko.observable();

        if (self.currentDate() === undefined) {
            self.currentDateLoaded(false);

            DemandDraftModel.getHostDate().then(function(data) {
                const today = new Date(data.currentDate.valueDate);

                self.formattedToday(today);
                self.currentDate(today);

                const tomorrow = new Date(data.currentDate.valueDate);

                tomorrow.setDate(today.getDate() + 1);
                self.formattedTomorrow(tomorrow);
                self.tomorrow(tomorrow);
                self.currentDateLoaded(true);
            });
        }

        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageTwoPointTwo = ko.observable(false);
        self.isLaterDateRequired = ko.observable(false);
        self.externalReferenceId = ko.observable();
        self.payeeList = ko.observableArray();
        self.isPayeeListLoaded = ko.observable(false);
        self.payeeSubList = ko.observableArray();
        self.isPayeeSubListLoaded = ko.observable(false);
        self.isPayeeDropdownActive = ko.observable(false);
        self.dropDownActive = ko.observable(false);
        self.payeeListRefresh = ko.observable(true);
        self.currencyCode = ko.observableArray();
        self.isCurrencyLoaded = ko.observable(false);
        self.accountList = ko.observableArray();
        self.isAccLoaded = ko.observable(true);
        self.refreshTransferOn = ko.observable(true);
        self.accountListMap = {};
        self.refreshAccounts = ko.observable(true);
        rootParams.baseModel.registerComponent("warning-message-dialog", "payee");
        rootParams.baseModel.registerComponent("review-domestic-demand-draft", "payments");
        rootParams.baseModel.registerComponent("review-international-demand-draft", "payments");
        self.isPayeeSelected = ko.observable(false);
        self.showMessage = ko.observable(false);
        self.demandDraftPayment = ko.observable();
        self.customPayeeName = ko.observable();
        self.payeeGroupId = ko.observable(self.params ? self.params.payeeGroupId || null : null);
        self.type = ko.observable(self.params ? self.params.type || null : null);
        rootParams.baseModel.registerComponent("demand-draft-payee", "payee");
        self.loadAccessPointList = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);
        self.isCommentRequired = ko.observable();
        self.contentIdMap = ko.observable({});
        self.customURL = ko.observable("demandDeposit?accountType=CURRENT,SAVING");

        DemandDraftModel.fetchBankConfig().then(function(data) {
            self.isCommentRequired(data.bankConfigurationDTO.region === "INDIA");
        });

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        DemandDraftModel.getPayeeMaintenance().then(function(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (rootParams.dashboard.appData.segment === "CORP") {
                self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            } else {
                self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            }
        });

        self.channelTypeChangeHandler = function() {
            if (self.selectedChannelIndex() !== null) {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };

        self.channelList = ko.observableArray();

        DemandDraftModel.listAccessPoint().then(function(data) {
            self.channelList(data.accessPointListDTO);

            for (let i = 0; i < data.accessPointListDTO.length; i++) {
                if (data.accessPointListDTO[i].currentLoggedIn === true) {
                    self.selectedChannelIndex(i);
                }
            }

            self.selectedChannel(true);
            self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
            self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
            self.loadAccessPointList(true);
        });

        self.channelPopup = function() {
            const popup1 = document.querySelector("#channel-popup");

            if (popup1.isOpen()) {
                popup1.close();
            } else {
                popup1.open("#channel-disclaimer");
            }
        };

        self.loadPayees = function() {
            self.isPayeeDropdownActive(true);
        };

        self.refreshPayeeList = function() {
            self.payeeListRefresh(false);
            self.isPayeeListLoaded(true);
            self.payeeListRefresh(true);
        };

        self.setPayee = function(data) {
            self.customPayeeName(data.nickName);
            self.dropDownActive(false);
            self.isPayeeSelected(true);
            self.payeeId(data.id);
            self.groupId(data.groupId);
            self.readPayee();
        };

        self.getBranchAddress = function() {
            DemandDraftModel.getBranchAddress(self.payeeData().demandDraftDeliveryDTO.branch).then(function(data) {
                self.addressDetails.postalAddress = data.addressDTO[0] ? data.addressDTO[0].branchAddress.postalAddress : "";

                if (!self.addressDetails.postalAddress.branchName) {
                    self.addressDetails.postalAddress.branchName = data.addressDTO[0].branchName;
                }

                self.addressDetailsFetched(true);
            });
        };

        self.getMyAddress = function() {
            DemandDraftModel.fetchCourierAddress().then(function(data) {
                if (data.party) {
                    for (let i = 0; i < data.party.addresses.length; i++) {
                        if (data.party.addresses[i].type === self.payeeData().demandDraftDeliveryDTO.addressType) {
                            self.addressDetails.postalAddress = data.party.addresses[i].postalAddress ? data.party.addresses[i].postalAddress : "";
                            self.addressDetailsFetched(true);
                            break;
                        }
                    }
                }
            });
        };

        self.refreshDropDown = function() {
            self.refreshAmountComponent(false);
            self.demandDraftPayload.remarks("");
            self.issueDate("NOW");
            self.setTaskCodeForIssueNow();
            self.demandDraftPayload.valueDate(oj.IntlConverterUtils.dateToLocalIso(self.currentDate()));
            self.isLaterDateRequired(false);
            self.payeeId(null);
            self.isPayeeSelected(false);
            self.isPayeeListLoaded(true);
            self.addressDetailsFetched(false);
            self.customPayeeName(null);
            self.selectedPayee("");
            self.dropDownActive(false);
            self.isPayeeSubListLoaded(false);
            self.payeeReceiverDetailsLoaded(false);

            if (rootParams.dashboard.appData.segment !== "CORP") {
                self.payee(null);
            }

            self.demandDraftPayload.amount.amount("");
            self.customCurrencyURL(null);
            self.refreshAmountComponent(true);
            self.customLimitType(undefined);
            self.payeeType(undefined);
        };

        self.setTaskCodeForIssueNow = function() {
            self.refreshAccounts(false);

            if (self.payeeType() === "DOM") {
                self.currentTask("PC_F_DOMDRAFT");
            } else if (self.payeeType() === "INT") {
                self.currentTask("PC_F_ID");
            }

            self.refreshAccounts(true);
        };

        self.setTaskCodeForIssueLater = function() {
            self.refreshAccounts(false);

            if (self.payeeType() === "DOM") {
                self.currentTask("PC_F_DOMDRAFT");
            } else if (self.payeeType() === "INT") {
                self.currentTask("PC_F_ID");
            }

            self.refreshAccounts(true);
        };

        self.dateChanged = function(event) {
            if (event.detail.value) {
                if (event.detail.value === "NOW") {
                    self.setTaskCodeForIssueNow();
                    self.isLaterDateRequired(false);
                    self.demandDraftPayload.valueDate(oj.IntlConverterUtils.dateToLocalIso(self.currentDate()));
                } else {
                    self.demandDraftPayload.valueDate("");
                    self.setTaskCodeForIssueLater();
                    self.isLaterDateRequired(true);
                }
            }
        };

        self.filterBranchDetails = function() {
            const branchAddress = [ko.utils.unwrapObservable(self.addressDetails.postalAddress.branchName), ko.utils.unwrapObservable(self.addressDetails.postalAddress.line1), ko.utils.unwrapObservable(self.addressDetails.postalAddress.line2), ko.utils.unwrapObservable(self.addressDetails.postalAddress.line3), ko.utils.unwrapObservable(self.addressDetails.postalAddress.line4), ko.utils.unwrapObservable(self.addressDetails.postalAddress.state), ko.utils.unwrapObservable(self.addressDetails.postalAddress.city), ko.utils.unwrapObservable(self.addressDetails.postalAddress.country), ko.utils.unwrapObservable(self.addressDetails.postalAddress.postalCode), ko.utils.unwrapObservable(self.addressDetails.postalAddress.zipCode)];

            return branchAddress.filter(function(n) {
                return n && n.trim() !== "";
            }).join(",");
        };

        self.groupPreview = ko.observable();
        self.groupInitials = ko.observable();
        self.payeeGroupIndices = ko.observable({});

        self.payeeChanged = function(event) {
            if (event.detail.value) {
                let index = -1;

                self.groupInitials(oj.IntlConverterUtils.getInitials(event.detail.value.split(/\s+/)[0], event.detail.value.split(/\s+/)[1]));
                self.selectedPayee(event.detail.value.split("-")[0]);
                self.groupId(event.detail.value.split("-")[1]);

                DemandDraftModel.getPayeeSubList(self.groupId()).then(function(data) {
                    self.payeeSubList.removeAll();

                    for (let i = 0; i < data.listPayees.length; i++) {
                        if (self.payeeId() && self.payeeId() === data.listPayees[i].id) {
                            index = i;
                        }

                        self.payeeSubList.push(data.listPayees[i]);

                        const payeeSublist = ko.toJS(data.listPayees[i]),
                            subList = payeeSublist.indiaDomesticPayee || payeeSublist.ukDomesticPayee || payeeSublist.sepaDomesticPayee || payeeSublist;

                        self.payeeSubList()[i].contentId = subList.contentId ? subList.contentId.value : null;
                        self.payeeSubList()[i].preview = subList.contentId ? self.contentIdMap()[subList.contentId.value] : self.payeeList()[self.payeeGroupIndices()[self.groupId()]].contentId ? self.contentIdMap()[self.payeeList()[self.payeeGroupIndices()[self.groupId()]].contentId.value] : ko.observable();
                        self.payeeSubList()[i].initials = oj.IntlConverterUtils.getInitials(payeeSublist.nickName.split(/\s+/)[0], payeeSublist.nickName.split(/\s+/)[1]);
                    }

                    if (data.listPayees.length === 0) {
                        self.isPayeeListEmpty(true);
                    }

                    self.isPayeeListLoaded(false);
                    self.isPayeeSubListLoaded(true);
                    self.dropDownActive(true);

                    if (event.detail && event.detail.index) {
                        let index;

                        for (let i = 0; i < self.payeeSubList().length; i++) {
                            if (self.payeeSubList()[i].id === event.detail.index) {
                                index = i;
                                break;
                            }
                        }

                        if (index !== -1) { self.setPayee(self.payeeSubList()[index]); }
                    } else if (index !== -1) {
                        self.setPayee(self.payeeSubList()[index]);
                    }
                });
            }
        };

        function loadBatchImages() {
            DemandDraftModel.fireBatch(batchRequest).then(function(batchData) {
                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
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

        function subPayees(data) {
            for (let j = 0; j < data.listPayees.length; j++) {
                const payeeDetails = data.listPayees[j].domesticPayeeType ? data.listPayees[j][{
                    INDIA: "indiaDomesticPayee",
                    UK: "ukDomesticPayee",
                    SEPA: "sepaDomesticPayee"
                }[data.listPayees[j].domesticPayeeType]] : data.listPayees[j];

                if (rootParams.dashboard.appData.segment !== "CORP" && payeeDetails.contentId) {
                    if (!self.contentIdMap()[payeeDetails.contentId.value]) {
                        self.contentIdMap()[payeeDetails.contentId.value] = ko.observable();
                        loadBatchRequest(payeeDetails.contentId.value);
                    }
                }
            }
        }

        self.preview = ko.observable();

        self.readPayee = function() {
            DemandDraftModel.getDemandDraftPayee(self.payeeId(), self.groupId()).then(function(data) {
                self.refreshAmountComponent(false);
                self.payeeType(data.demandDraftPayeeDTO.demandDraftPayeeType);
                self.payeeData(data.demandDraftPayeeDTO);
                self.refreshTransferOn(false);
                self.payeeReceiverDetailsLoaded(false);
                self.demandDraftPayload.payeeId(self.payeeId() + "");
                self.demandDraftPayload.inFavourOf(self.payeeData().nickName);
                self.customPayeeName(self.payeeData().nickName);
                self.payeeData().initials = oj.IntlConverterUtils.getInitials(self.payeeData().nickName.split(/\s+/)[0], self.payeeData().nickName.split(/\s+/)[1]);

                if (self.payeeData().demandDraftDeliveryDTO.deliveryMode === "MAI") {
                    self.getMyAddress();
                } else if (self.payeeData().demandDraftDeliveryDTO.deliveryMode === "BRN") {
                    self.getBranchAddress();
                } else if (self.payeeData().demandDraftDeliveryDTO.deliveryMode === "OTHADD") {
                    self.addressDetails.postalAddress = self.payeeData().address ? self.payeeData().address : "";
                    self.addressDetailsFetched(true);
                }

                if (self.payeeType() === "DOM") {
                    self.setTaskCodeForIssueNow();
                    self.customCurrencyURL("payments/currencies?type=DOMESTICDRAFT");
                } else if (self.payeeType() === "INT") {
                    self.setTaskCodeForIssueNow();
                    self.customCurrencyURL("payments/currencies?type=PC_F_ID");
                }

                if (self.params && self.params.isFavoriteTransaction) {
                    self.demandDraftPayload.amount.amount(self.params.amount);
                    self.demandDraftPayload.debitAccountId.value(self.params.debitAccountId);
                    self.demandDraftPayload.remarks(self.params.remarks);
                    self.transferCurrency(self.params.currency);
                    self.fromFavourites(true);

                    if (self.params.valueDate) {
                        self.issueDate("LATER");
                        self.demandDraftPayload.valueDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.params.valueDate)));
                    }
                }

                self.payeeReceiverDetailsLoaded(true);
                self.refreshTransferOn(true);
                self.refreshAmountComponent(true);
            });
        };

        self.removeFavourite = function() {
            self.stageOne(false);
            self.removeFavouriteFlag(true);
        };

        self.cancelDeletion = function() {
            self.removeFavouriteFlag(false);
            self.stageOne(true);
        };

        self.confirmDeleteFavourite = function() {
            DemandDraftModel.deleteFavourite(self.params.paymentId, self.params.transactionType).then(function(data) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.payments.confirm,
                    template: "confirm-screen/payments-template"
                }, self);

                self.removeFavouriteFlag(false);
            });
        };

        self.subPayeeChanged = function(data, event) {
            $("#content").html(event.target.innerHTML);
            $("#content").find("#cancel").css("display", "inline");

            $("#content").find("#cancel").click(function() {
                self.payeeListRefresh(false);
                self.isPayeeListLoaded(true);
                self.isPayeeDropdownActive(false);
                self.payeeListRefresh(true);
            });

            self.payeeId(data.id);

            if (self.payeeId() !== null) {
                self.isPayeeSubListLoaded(false);

                DemandDraftModel.getDemandDraftPayee(self.payeeId(), self.groupId()).then(function(data) {
                    self.payeeData(data.demandDraftPayeeDTO);
                    self.payeeReceiverDetailsLoaded(false);
                    self.demandDraftPayload.payeeId(self.payeeId() + "");
                    self.demandDraftPayload.inFavourOf(self.payeeData().name);
                    self.payeeReceiverDetailsLoaded(true);
                });
            }
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.cancelDDIssue = function() {
            history.go(-1);
        };

        self.initiateDDIssue = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("drafttracker"))) {
                return;
            }

            self.demandDraftPayload.amount.currency(self.transferCurrency());

            if (oj.IntlConverterUtils.dateToLocalIso(self.currentDate()) === self.demandDraftPayload.valueDate() || self.demandDraftPayload.valueDate() === null) {
                self.demandDraftPayload.amount.currency(self.transferCurrency());
                self.demandDraftPayload.payeeId(self.demandDraftPayload.payeeId());
                self.demandDraftPayload.debitAccountId.value(self.demandDraftPayload.debitAccountId.value());

                const demandDraftPayload = ko.toJSON(self.demandDraftPayload);

                if (self.payeeData().demandDraftPayeeType === "DOM") {
                    DemandDraftModel.initiateDomesticDDIssue(demandDraftPayload).then(function(data) {
                        self.paymentId(data.paymentId);

                        const domDraftParams = {
                            issueDate: self.issueDate,
                            demandDraftPayload: self.demandDraftPayload,
                            addressDetails: self.addressDetails,
                            currentTask: self.currentTask,
                            customCurrencyURL: self.customCurrencyURL,
                            transferCurrency: self.transferCurrency,
                            payeeReceiverDetailsLoaded: self.payeeReceiverDetailsLoaded,
                            selectedPayee: self.selectedPayee,
                            payeeId: self.payeeId,
                            groupId: self.groupId,
                            payee: self.payee,
                            reviewMode: true,
                            header: rootParams.dashboard.headerName,
                            paymentId: self.paymentId
                        };

                        rootParams.dashboard.loadComponent("review-domestic-demand-draft", ko.mapping.toJS(domDraftParams));
                    });

                    self.transactionType("DOMESTICDRAFT");
                } else if (self.payeeData().demandDraftPayeeType === "INT") {
                    DemandDraftModel.initiateInternationalDDIssue(demandDraftPayload).then(function(data) {
                        self.paymentId(data.paymentId);

                        const intDraftParams = {
                            issueDate: self.issueDate,
                            demandDraftPayload: self.demandDraftPayload,
                            addressDetails: self.addressDetails,
                            currentTask: self.currentTask,
                            customCurrencyURL: self.customCurrencyURL,
                            transferCurrency: self.transferCurrency,
                            payeeReceiverDetailsLoaded: self.payeeReceiverDetailsLoaded,
                            selectedPayee: self.selectedPayee,
                            payeeId: self.payeeId,
                            groupId: self.groupId,
                            payee: self.payee,
                            reviewMode: true,
                            header: rootParams.dashboard.headerName,
                            paymentId: self.paymentId
                        };

                        rootParams.dashboard.loadComponent("review-international-demand-draft", ko.mapping.toJS(intDraftParams));
                    });

                    self.transactionType("INTERNATIONALDRAFT");
                }
            } else {
                self.demandDraftInstructionPayload.amount.currency(self.transferCurrency());
                self.demandDraftInstructionPayload.payeeId(self.demandDraftPayload.payeeId());
                self.demandDraftInstructionPayload.debitAccountId.value(self.demandDraftPayload.debitAccountId.value());
                self.demandDraftInstructionPayload.startDate(self.demandDraftPayload.valueDate());
                self.demandDraftInstructionPayload.endDate(self.demandDraftPayload.valueDate());
                self.demandDraftInstructionPayload.remarks(self.demandDraftPayload.remarks());
                self.demandDraftInstructionPayload.amount.amount(self.demandDraftPayload.amount.amount());
                self.demandDraftInstructionPayload.inFavourOf(self.demandDraftPayload.inFavourOf());

                const payload = ko.toJSON(self.demandDraftInstructionPayload);

                if (self.payeeData().demandDraftPayeeType === "DOM") {
                    DemandDraftModel.initiateDomesticDDInstructionIssue(payload).then(function(data) {
                        self.paymentId(data.instructionId);

                        const domInstructionDraftParams = {
                            issueDate: self.issueDate,
                            demandDraftPayload: self.demandDraftPayload,
                            addressDetails: self.addressDetails,
                            currentTask: self.currentTask,
                            customCurrencyURL: self.customCurrencyURL,
                            transferCurrency: self.transferCurrency,
                            payeeReceiverDetailsLoaded: self.payeeReceiverDetailsLoaded,
                            selectedPayee: self.selectedPayee,
                            payeeId: self.payeeId,
                            groupId: self.groupId,
                            payee: self.payee,
                            reviewMode: true,
                            header: rootParams.dashboard.headerName,
                            instructionId: self.paymentId
                        };

                        rootParams.dashboard.loadComponent("review-domestic-demand-draft", ko.mapping.toJS(domInstructionDraftParams));
                    });

                    self.transactionType("DOMESTICDRAFT_PAYLATER");
                } else if (self.payeeData().demandDraftPayeeType === "INT") {
                    DemandDraftModel.initiateInternationalDDInstructionIssue(payload).then(function(data) {
                        self.paymentId(data.instructionId);

                        const intInstructionDraftParams = {
                            issueDate: self.issueDate,
                            demandDraftPayload: self.demandDraftPayload,
                            addressDetails: self.addressDetails,
                            currentTask: self.currentTask,
                            customCurrencyURL: self.customCurrencyURL,
                            transferCurrency: self.transferCurrency,
                            payeeReceiverDetailsLoaded: self.payeeReceiverDetailsLoaded,
                            selectedPayee: self.selectedPayee,
                            payeeId: self.payeeId,
                            groupId: self.groupId,
                            payee: self.payee,
                            reviewMode: true,
                            header: rootParams.dashboard.headerName,
                            instructionId: self.paymentId
                        };

                        rootParams.dashboard.loadComponent("review-international-demand-draft", ko.mapping.toJS(intInstructionDraftParams));
                    });

                    self.transactionType("INTERNATIONALDRAFT_PAYLATER");
                }
            }
        };

        self.corporatePayeeChange = function(event) {
            if (self.groupId() || event.detail.value) {
                for (let i = 0; i < self.payeeList().length; i++) {
                    if (self.groupId() === self.payeeList()[i].id || event.detail.value === self.payeeList()[i].id) {
                        if (callRefreshDropDown) {
                            self.refreshDropDown();
                        }

                        self.setPayee(self.payeeList()[i]);
                        callRefreshDropDown = true;
                        break;
                    }
                }
            }
        };

        if ((self.params && self.params.transferDataPayee) || (self.defaultData && self.defaultData.transferDataPayee)) {
            const payeeTransferData = self.params && self.params.transferDataPayee ? self.params.transferDataPayee : self.defaultData ? self.defaultData.transferDataPayee : null;

            self.payeeId(payeeTransferData.id);
            self.groupId(payeeTransferData.groupId);

            if (rootParams.dashboard.appData.segment !== "CORP") {
                self.payee(payeeTransferData.name + "-" + payeeTransferData.groupId);
            } else {
                self.payee(payeeTransferData.id);
            }
        }

        self.getPayeeList = function() {
            batchRequest.batchDetailRequestList = [];

            DemandDraftModel.getPayeeList().then(function(data) {
                self.isPayeeListLoaded(false);

                if (rootParams.dashboard.appData.segment === "CORP") {
                    self.payeeList.removeAll();

                    for (let i = 0; i < data.payeeGroups.length; i++) {
                        if (data.payeeGroups[i].listPayees[0].contentId) {
                            self.contentIdMap()[data.payeeGroups[i].listPayees[0].contentId.value] = ko.observable();
                            loadBatchRequest(data.payeeGroups[i].listPayees[0].contentId.value);
                        }

                        self.payeeList.push(data.payeeGroups[i].listPayees[0]);
                        self.payeeList()[i].preview = data.payeeGroups[i].listPayees[0].contentId ? self.contentIdMap()[data.payeeGroups[i].listPayees[0].contentId.value] : ko.observable();
                        self.payeeList()[i].initials = oj.IntlConverterUtils.getInitials(data.payeeGroups[i].listPayees[0].nickName.split(/\s+/)[0], data.payeeGroups[i].listPayees[0].nickName.split(/\s+/)[1]);
                        self.payeeGroupIndices()[data.payeeGroups[i].groupId] = i;
                    }

                    if (self.params && self.params.isFavoriteTransaction) {
                        self.payee(self.params.payeeId);

                        self.corporatePayeeChange({
                            detail: {
                                value: self.params.payeeId
                            }
                        });
                    } else if (self.payeeId()) {
                        self.corporatePayeeChange({
                            detail: {
                                value: self.payeeId()
                            }
                        });
                    } else if (self.params && self.params.fundTransferObject) {
                        self.payee(self.params.fundTransferObject().payeeId);
                        self.fromFavourites(true);

                        self.corporatePayeeChange({
                            detail: {
                                value: self.params.fundTransferObject().payeeId
                            }
                        });
                    }
                } else {
                    for (let j = 0; j < data.payeeGroups.length; j++) {
                        if (data.payeeGroups[j].contentId) {
                            self.contentIdMap()[data.payeeGroups[j].contentId.value] = ko.observable();
                            loadBatchRequest(data.payeeGroups[j].contentId.value);
                        }

                        self.payeeList.push(data.payeeGroups[j]);
                        self.payeeList()[j].preview = data.payeeGroups[j].contentId ? self.contentIdMap()[data.payeeGroups[j].contentId.value] : ko.observable();
                        self.payeeList()[j].initials = oj.IntlConverterUtils.getInitials(data.payeeGroups[j].name.split(/\s+/)[0], data.payeeGroups[j].name.split(/\s+/)[1]);
                        self.payeeGroupIndices()[data.payeeGroups[j].groupId] = j;
                        subPayees(data.payeeGroups[j]);
                    }

                    if (self.payee && self.payee()) {
                        self.payeeChanged({
                            detail: {
                                value: self.payee()
                            }
                        });
                    }
                }

                if (batchRequest.batchDetailRequestList.length) {
                    loadBatchImages();
                }

                ko.tasks.runEarly();
                self.isPayeeListLoaded(true);
            });
        };

        self.getPayeeList();

        let favoritePersistedSuccessfully = false;

        self.persistFavorites = function() {
            self.favoritesPayLoad.id(self.paymentId());
            self.favoritesPayLoad.transactionType(self.transactionType());
            self.favoritesPayLoad.payeeId(self.payeeId());
            self.favoritesPayLoad.amount.amount(self.demandDraftPayload.amount.amount());
            self.favoritesPayLoad.amount.currency(self.transferCurrency());
            self.favoritesPayLoad.debitAccountId.value(self.demandDraftPayload.debitAccountId.value());
            self.favoritesPayLoad.remarks(self.demandDraftPayload.remarks());
            self.favoritesPayLoad.payeeGroupId(self.groupId());
            self.favoritesPayLoad.valueDate(oj.IntlConverterUtils.dateToLocalIso(self.currentDate()) !== self.demandDraftPayload.valueDate() ? self.demandDraftPayload.valueDate() : null);
            self.favoritesPayLoad.payeeNickName(self.demandDraftPayload.inFavourOf());
            self.favoritesPayLoad.payeeAccountName(self.payeeData().name);

            const favoritesPayLoad = ko.toJSON(self.favoritesPayLoad);

            DemandDraftModel.addFavorites(favoritesPayLoad).then(function() {
                self.favoriteSuccess();
            });
        };

        self.stageFavoriteSuccess = ko.observable(false);
        self.stageFavoriteAdd = ko.observable(true);

        self.addToFavorites = function() {
            if (!favoritePersistedSuccessfully) {
                self.stageFavoriteAdd(true);
                $("#favoritesDialog").trigger("openModal");
            }
        };

        self.favoriteSuccess = function() {
            self.stageFavoriteAdd(false);
            self.stageFavoriteSuccess(true);
            favoritePersistedSuccessfully = true;
        };

        self.closeFavoriteModal = function() {
            $("#favoritesDialog").trigger("closeModal");
            self.stageFavoriteSuccess(false);
            self.stageFavoriteAdd(true);
        };

        self.currencyParser = function(data) {
            const output = {};

            output.currencies = [];

            if (data) {
                if (data.currencyList !== null) {
                    if (self.payeeType() === "DOM") {
                        output.currencies.push({
                            code: data.currencyList[0].code,
                            description: data.currencyList[0].code
                        });
                    } else {
                        for (let i = 0; i < data.currencyList.length; i++) {
                            output.currencies.push({
                                code: data.currencyList[i].code,
                                description: data.currencyList[i].code
                            });
                        }
                    }

                    if (!self.transferCurrency()) {
                        self.transferCurrency(output.currencies[0].code);
                    }
                }
            }

            return output;
        };

        self.customLimitType = ko.observable();
        self.viewlimitsFlag = ko.observable(false);

        self.viewLimits = function() {
            self.viewlimitsFlag(false);
            self.customLimitType(undefined);

            if (self.payeeType() === "DOM") {
                self.customLimitType("PC_F_DOMDRAFT");
                self.parentTaskCode("PC_F_CDDD");
            } else if (self.payeeType() === "INT") {
                self.customLimitType("PC_F_ID");
                self.parentTaskCode("PC_F_CIDD");
            }

            ko.tasks.runEarly();
            $("#viewlimits-DD").trigger("openModal");
            self.viewlimitsFlag(true);
        };

        self.closeModal = function() {
            $("#viewlimits-DD").trigger("closeModal");
        };

        if ((rootParams.options && rootParams.options.data && rootParams.options.data.fundTransferObject) || (self.params && self.params.fundTransferObject)) {
            const data = rootParams.options && rootParams.options.data ? rootParams.options.data.fundTransferObject : self.params.fundTransferObject();

            self.demandDraftPayload.amount.amount(data.amount);
            self.demandDraftPayload.debitAccountId.value(data.debitAccountId);
            self.demandDraftPayload.remarks(data.remarks);
            self.transferCurrency(data.currency);

            if (self.params.valueDate) {
                self.issueDate("LATER");
                self.demandDraftPayload.valueDate(oj.IntlConverterUtils.dateToLocalIso(new Date(data.valueDate)));
            }

            self.payeeChanged({
                detail: {
                    value: self.payments.demanddraft.demandDraftPayee + data.groupId,
                    index: data.payeeId
                }
            });
        }
    };
});