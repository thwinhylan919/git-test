define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-payee-list",
    "ojs/ojinputnumber",
    "ojs/ojpopup",
    "ojs/ojlistview",
    "ojs/ojaccordion",
    "ojs/ojvalidationgroup",
    "ojs/ojarraytabledatasource",
    "ojs/ojcheckboxset",
    "ojs/ojavatar"
], function(oj, ko, $, PayeeListModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            batchRequest = {
                batchDetailRequestList: []
            },
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(PayeeListModel.getNewModel());

                return KoModel;
            };

        let payeeLimitsMap = {},
            payeeLimitsMap2 = {};

        ko.utils.extend(self, rootParams.rootModel);

        self.payments = ResourceBundle.payments;
        self.peerToPeerValue = ko.observable(self ? self.transferValue ? self.transferValue : "" : "");
        self.isPayeesLoaded = ko.observable(false);
        self.payees = ko.observableArray();
        self.typeOfAccountDescription = ko.observable();
        self.expandedAccordians = ko.observableArray([]);

        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "amount-input",
            "search-box"
        ]);

        rootParams.baseModel.registerComponent("payments-money-transfer", "payments");
        rootParams.baseModel.registerComponent("payee-view-edit", "payments");
        rootParams.baseModel.registerComponent("issue-demand-draft", "payments");
        rootParams.baseModel.registerComponent("bank-account-payee", "payee");
        rootParams.baseModel.registerComponent("demand-draft-payee", "payee");
        rootParams.baseModel.registerComponent("image-upload", "goals");
        rootParams.dashboard.headerName(self.payments.managerecipients_header);
        self.payeeGroupImage = ko.observable();
        self.limitPackage = ko.observable({});
        self.refreshPayeeList = ko.observable(true);
        self.limitCurrency = ko.observable();
        self.countryCodeMap = {};
        self.newLimitAmount = ko.observable();
        self.newMonthlyLimitAmount = ko.observable();
        self.tommDailyLimitAmount = ko.observable();
        self.tommMonthlyLimitAmount = ko.observable();
        self.payeeData = ko.observable();
        self.validationTracker = ko.observable();
        self.setBackButton = ko.observable(false);
        self.avatarSize = ko.observable("xs");
        self.contentIdMap = ko.observable({});
        self.payeeAccountTypeList = ko.observableArray([]);
        self.file = ko.observable();
        self.imageUploadSuccessMsg = ko.observable();
        self.currentPayeeGroup = ko.observable({});
        self.payeeGroupContentId = ko.observable();
        self.preview = ko.observable();
        self.fileId = ko.observable("input");
        self.imageId = ko.observable("target");
        self.editPayeeModel = getNewKoModel().editPayeeModel;
        self.fileTypeArray = ko.observableArray();
        self.maxFileSize = ko.observable();

        PayeeListModel.assignedLimitPackages().then(function(data) {
            if (data.limitPackageDTOList[0].targetLimitLinkages.length > 0) { self.limitCurrency(data.limitPackageDTOList[0].targetLimitLinkages[0].limits[0].currency); }
        });

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        PayeeListModel.getPayeeMaintenance().then(function(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (rootParams.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }

            if (self.imageUploadFlag()) {
                PayeeListModel.retrieveImageTypeSuuport().then(function(data) {
                    if (data) {
                        self.fileTypeArray(data.allowedImageMIMEType.split(","));
                        self.maxFileSize(data.maxSize);
                    }
                });
            }
        });

        const payeeGroupContentId = self.payeeGroupContentId.subscribe(function() {
            if (self.payeeGroupContentId && self.currentPayeeGroup().id) {
                self.payeeGroup = getNewKoModel().payeeGroup;
                self.payeeGroup.contentId(self.payeeGroupContentId());

                PayeeListModel.editPayeeGroup(ko.toJSON(self.payeeGroup), self.currentPayeeGroup().id).then(function() {
                    if (self.currentPayeeGroup().contentId && self.payeeGroupContentId() && self.currentPayeeGroup().contentId !== self.payeeGroupContentId()) {
                        self.imageUploadSuccessMsg(rootParams.baseModel.format(self.payments.payee.message.payeeGroupUploadSuccess, { message: self.payments.payee.message.imageMessage.EDIT }));
                    } else if (self.currentPayeeGroup().contentId && !self.payeeGroupContentId()) {
                        self.imageUploadSuccessMsg(rootParams.baseModel.format(self.payments.payee.message.payeeGroupUploadSuccess, { message: self.payments.payee.message.imageMessage.REMOVE }));
                    } else if (!self.currentPayeeGroup().contentId && self.payeeGroupContentId()) {
                        self.imageUploadSuccessMsg(rootParams.baseModel.format(self.payments.payee.message.payeeGroupUploadSuccess, { message: self.payments.payee.message.imageMessage.UPLOAD }));
                    }

                    self.currentPayeeGroup().contentId = self.payeeGroupContentId();

                    setTimeout(function() {
                        self.imageUploadSuccessMsg(null);
                    }, 4000);
                });
            }
        });

        self.dispose = function() {
            payeeGroupContentId.dispose();
        };

        function getPayeeLimits() {
            PayeeListModel.getPayeeLimit().then(function(data) {
                if (data.limitPackageDTOList && data.limitPackageDTOList.length > 0) {
                    payeeLimitsMap = {};
                    payeeLimitsMap2 = {};

                    for (let k = 0; k < data.limitPackageDTOList.length; k++) {
                        if (data.limitPackageDTOList[k].targetLimitLinkages && data.limitPackageDTOList[k].targetLimitLinkages.length > 0) {
                            for (let i = 0; i < data.limitPackageDTOList[k].targetLimitLinkages.length; i++) {
                                if (data.limitPackageDTOList[k].targetLimitLinkages[i].target.type.id === "PAYEE") {
                                    if (data.limitPackageDTOList[k].targetLimitLinkages[i].limits && data.limitPackageDTOList[k].targetLimitLinkages[i].limits[0].periodicity) {
                                        const newEffectiveDate = new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].effectiveDate),
                                            effectiveDate1 = new Date(newEffectiveDate.setHours(0, 0, 0, 0));

                                        effectiveDate1.setDate(newEffectiveDate);

                                        if ((!data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate ||
                                                new Date(data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate) > rootParams.baseModel.getDate()) &&
                                            !(new Date(effectiveDate1) > rootParams.baseModel.getDate())) {
                                            if (!payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value]) { payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value] = {}; }

                                            for (let j = 0; j < data.limitPackageDTOList[k].targetLimitLinkages[i].limits.length; j++) {
                                                payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity] = {
                                                    periodicity: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity,
                                                    maxAmount: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].maxAmount,
                                                    effectiveDate: effectiveDate1,
                                                    expiryDate: data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate,
                                                    isEffectiveFromTomorrow: new Date(effectiveDate1) > rootParams.baseModel.getDate()
                                                };

                                                payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity].maxAmount.amount = payeeLimitsMap[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[j].periodicity].maxAmount.amount;
                                            }
                                        }

                                        if (!data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate && new Date(effectiveDate1) > rootParams.baseModel.getDate()) {
                                            if (!payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value]) { payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value] = {}; }

                                            for (let f = 0; f < data.limitPackageDTOList[k].targetLimitLinkages[i].limits.length; f++) {
                                                payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity] = {
                                                    periodicity: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity,
                                                    maxAmount: data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].maxAmount,
                                                    effectiveDate: effectiveDate1,
                                                    expiryDate: data.limitPackageDTOList[k].targetLimitLinkages[i].expiryDate,
                                                    isEffectiveFromTomorrow: new Date(effectiveDate1) > rootParams.baseModel.getDate()
                                                };

                                                payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity].maxAmount.amount = payeeLimitsMap2[data.limitPackageDTOList[k].targetLimitLinkages[i].target.value][data.limitPackageDTOList[k].targetLimitLinkages[i].limits[f].periodicity].maxAmount.amount;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    self.limitPackage().data = data;
                }
            });
        }

        getPayeeLimits();

        const payeetypesMap = {
            DEMANDDRAFT: "demandDraft",
            INTERNAL: "internal",
            DOMESTIC: "domestic",
            INTERNATIONAL: "international",
            PEERTOPEER: "peerToPeer"
        };

        self.createPayeeInExistingGroup = function(defaultTab, data) {
            self.selectedTab = "";

            rootParams.dashboard.loadComponent("manage-accounts", {
                applicationType: "payee",
                defaultTab: defaultTab,
                payeeGroupId: data.id,
                payeeName: data.name,
                preview: data.preview
            });
        };

        self.choiseBoxOpened = ko.observable(false);

        self.openChoiseBox = function() {
            $("#choiseDialog").trigger("openModal");
            self.choiseBoxOpened(true);
        };

        self.editPayeeGroupImage = ko.observable(false);

        self.openEditBox = function(data) {
            self.currentPayeeGroup(data);
            self.editPayeeGroupImage(true);
            self.payeeData(null);
            $("#edit-payeeGroupImage").trigger("openModal");
        };

        self.changeComponent = function(componentName) {
            rootParams.dashboard.loadComponent(componentName, {});
        };

        self.readImage = function(gId) {
            PayeeListModel.readImage(gId).done(function(data) {
                self.payeeGroupImage(data.payeeGroupImageDTO ? data.payeeGroupImageDTO.image : "");
            });
        };

        self.payeeViewEditCloseHandler = function() {
            $("#view-payee").hide();
        };

        self.componentList = [{
                id: "payee-sub-list"
            },
            {
                id: "bank-account-payee"
            },
            {
                id: "demand-draft-payee"
            },
            {
                id: "payee-card"
            },
            {
                id: "account-type-dialog"
            }
        ];

        for (let i = 0; i < self.componentList.length; i++) {
            rootParams.baseModel.registerComponent(self.componentList[i].id, "payee");
        }

        PayeeListModel.init("");
        self.srcCountArray = ko.observableArray();

        self.back = function() {
            history.back();
        };

        function loadBatchImages() {
            PayeeListModel.batchRead(batchRequest).done(function(batchData) {
                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                }

                self.isPayeesLoaded(false);
                self.isPayeesLoaded(true);
            });
        }

        function loadBatchRequest(id) {
            if (Object.keys(self.contentIdMap()).length !== batchRequest.batchDetailRequestList.length) {
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
        }

        PayeeListModel.getPayeeAccountType("INDIA").then(function(data) {
            self.payeeAccountTypeList(data.enumRepresentations[0].data);
        });

        let bankAccountCount = 0,
            p2pCount = 0,
            demandDraftcount = 0;

        function subPayees(data, index, groupImageReference) {
            for (let j = 0; j < data.listPayees.length; j++) {
                const type = data.listPayees[j].payeeType;

                if (type === "INTERNAL" || type === "INTERNATIONAL" || type === "DOMESTIC") {
                    bankAccountCount++;
                } else if (type === "DEMANDDRAFT") {
                    demandDraftcount++;
                } else if (type === "PEERTOPEER") {
                    p2pCount++;
                }

                const domType = {
                    INDIA: "indiaDomesticPayee",
                    UK: "ukDomesticPayee",
                    SEPA: "sepaDomesticPayee"
                }[data.listPayees[j].domesticPayeeType];

                if (type !== "DOMESTIC") {
                    if (data.listPayees[j].contentId) {
                        if (!self.contentIdMap()[data.listPayees[j].contentId.value]) { self.contentIdMap()[data.listPayees[j].contentId.value] = ko.observable(); }

                        self.payees()[index].dataSource().data[j].preview = self.contentIdMap()[data.listPayees[j].contentId.value];
                        loadBatchRequest(data.listPayees[j].contentId.value);
                    } else {
                        self.payees()[index].dataSource().data[j].preview = ko.observable();
                    }

                    self.payees()[index].dataSource().data[j].defaultPreview = groupImageReference;
                    self.payees()[index].dataSource().data[j].initials = oj.IntlConverterUtils.getInitials(data.listPayees[j].nickName.split(/\s+/)[0], data.listPayees[j].nickName.split(/\s+/)[1]);
                } else if (type === "DOMESTIC") {
                    if (data.listPayees[j][domType].contentId) {
                        if (!self.contentIdMap()[data.listPayees[j][domType].contentId.value]) { self.contentIdMap()[data.listPayees[j][domType].contentId.value] = ko.observable(); }

                        self.payees()[index].dataSource().data[j][domType].preview = self.contentIdMap()[data.listPayees[j][domType].contentId.value];
                        loadBatchRequest(data.listPayees[j][domType].contentId.value);
                    } else {
                        self.payees()[index].dataSource().data[j][domType].preview = ko.observable();
                    }

                    self.payees()[index].dataSource().data[j].preview = self.payees()[index].dataSource().data[j][domType].preview;
                    self.payees()[index].dataSource().data[j][domType].defaultPreview = groupImageReference;
                    self.payees()[index].dataSource().data[j].defaultPreview = groupImageReference;
                    self.payees()[index].dataSource().data[j].initials = oj.IntlConverterUtils.getInitials(data.listPayees[j].nickName.split(/\s+/)[0], data.listPayees[j].nickName.split(/\s+/)[1]);
                    self.payees()[index].dataSource().data[j][domType].initials = oj.IntlConverterUtils.getInitials(data.listPayees[j].nickName.split(/\s+/)[0], data.listPayees[j].nickName.split(/\s+/)[1]);
                }
            }
        }

        PayeeListModel.getPayeeList().done(function(data) {
            batchRequest.batchDetailRequestList = [];

            if (data.payeeGroups !== null) {
                for (let i = 0; i < data.payeeGroups.length; i++) {
                    bankAccountCount = 0;
                    p2pCount = 0;
                    demandDraftcount = 0;

                    if (data.payeeGroups[i].contentId) {
                        self.contentIdMap()[data.payeeGroups[i].contentId.value] = ko.observable();
                        loadBatchRequest(data.payeeGroups[i].contentId.value);
                    }

                    const srcCount = ko.observableArray([{
                            src: bankAccountCount !== 0 ? "payments/recipients-accounts.svg" : "default",
                            count: bankAccountCount !== 0 ? bankAccountCount : null
                        },
                        {
                            src: p2pCount !== 0 ? "payments/recipients-mobile-email.svg" : "default",
                            count: p2pCount !== 0 ? p2pCount : null
                        },
                        {
                            src: demandDraftcount !== 0 ? "payments/recipients-demand-drafts.svg" : "default",
                            count: demandDraftcount !== 0 ? demandDraftcount : null
                        }
                    ]);

                    self.payees.push({
                        name: data.payeeGroups[i].name,
                        id: data.payeeGroups[i].groupId,
                        icons: srcCount(),
                        contentId: data.payeeGroups[i].contentId ? data.payeeGroups[i].contentId.value : null,
                        preview: data.payeeGroups[i].contentId ? self.contentIdMap()[data.payeeGroups[i].contentId.value] : ko.observable(),
                        listPayees: data.payeeGroups[i].listPayees,
                        initials: oj.IntlConverterUtils.getInitials(data.payeeGroups[i].name.split(/\s+/)[0], data.payeeGroups[i].name.split(/\s+/)[1]),
                        dataSource: ko.observable(new oj.ArrayTableDataSource(data.payeeGroups[i].listPayees, {
                            idAttribute: "id"
                        }))
                    });

                    subPayees(data.payeeGroups[i], i, self.payees()[i].preview);
                }

                if (batchRequest.batchDetailRequestList.length) {
                    loadBatchImages();
                }
            }

            self.isPayeesLoaded(true);
        });

        self.getAccountTypeDescription = function(code) {
            return ko.utils.arrayFirst(self.payeeAccountTypeList(), function(element) {
                return element.code === code;
            }).description;
        };

        function getConfirmScreenDetailsArray() {
            let confirmScreenDetailsArray;

            if (self.payeeData().payeeType === "INTERNAL") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.labels.acctype,
                            value: self.payments.payee.type[self.payeeData().payeeType]
                        },
                        {
                            label: self.payments.payee.labels.accountName,
                            value: self.payeeData().accountName
                        },
                        {
                            label: self.payments.payee.labels.nickname,
                            value: self.payeeData().nickName
                        }
                    ],
                    [
                    {
                        label: self.payments.payee.labels.accountNumber,
                        value: self.payeeData().accountNumber,
                        isInternalAccNo: true
                    }]
                ];
            } else if (self.payeeData().payeeType === "DOMESTIC") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.labels.acctype,
                            value: self.payments.payee.type[self.payeeData().payeeType]
                        },
                        {
                            label: self.payments.payee.labels.accountNumber,
                            value: self.payeeData().accountNumber
                        }
                    ],
                    [{
                            label: self.payments.payee.labels.accountName,
                            value: self.payeeData().accountName
                        },
                        {
                            label: self.payments.payee.labels.bnkdetails,
                            value: [
                                self.payeeData().bankDetails.code,
                                self.payeeData().bankDetails.name,
                                self.payeeData().bankDetails.city,
                                self.payeeData().bankDetails.country
                            ]
                        }
                    ]
                ];
            } else if (self.payeeData().payeeType === "INTERNATIONAL") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.labels.acctype,
                            value: self.payments.payee.type[self.payeeData().payeeType]
                        },
                        {
                            label: self.payments.payee.labels.accountName,
                            value: self.payeeData().accountName
                        }
                    ],
                    [{
                        label: self.payments.payee.labels.bnkdetails,
                        value: [
                            self.payeeData().bankDetails.code,
                            self.payeeData().bankDetails.name,
                            self.payeeData().bankDetails.city,
                            self.payeeData().bankDetails.country
                        ]
                    }]
                ];
            } else if (self.payeeData().payeeType === "DEMANDDRAFT" && self.payeeData().demandDraftPayeeType === "DOM") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.labels.drafttype,
                            value: self.payments.payee.type[self.payeeData().demandDraftPayeeType]
                        },
                        {
                            label: self.payments.payee.labels.nickname,
                            value: self.payeeData().nickName
                        }
                    ],
                    [{
                        label: self.payments.payee.labels.payAtCity,
                        value: self.payeeData().payAtCity
                    }]
                ];
            } else if (self.payeeData().payeeType === "DEMANDDRAFT" && self.payeeData().demandDraftPayeeType === "INT") {
                confirmScreenDetailsArray = [
                    [{
                            label: self.payments.payee.labels.drafttype,
                            value: self.payments.payee.type[self.payeeData().demandDraftPayeeType]
                        },
                        {
                            label: self.payments.payee.labels.nickname,
                            value: self.payeeData().nickName
                        }
                    ],
                    [{
                            label: self.payments.payee.labels.payAtCountry,
                            value: self.countryCodeMap[self.payeeData().payAtCountry]
                        },
                        {
                            label: self.payments.payee.labels.payAtCity,
                            value: self.payeeData().payAtCity
                        }
                    ]
                ];
            }

            return confirmScreenDetailsArray;
        }

        const payeeTaskCodesMap = {
            DEMANDDRAFT: "PC_N_DDDP",
            INTERNAL: "PC_N_DIP",
            DOMESTIC: "PC_N_DDP",
            INTERNATIONAL: "PC_N_DITNP",
            PEERTOPEER: "PC_N_DPTPP"
        };

        self.confirmDeletePayee = function() {
            PayeeListModel.deletePayee(payeetypesMap[self.payeeData().payeeType], self.payeeData().groupId, self.payeeData().id).done(function(data, status, jqXHR) {
                self.httpStatus = jqXHR.status;

                let successMessage, statusMessages;

                if (rootParams.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus !== 202) {
                    successMessage = self.payments.payee.confirmScreen.successMessage;
                    statusMessages = self.payments.common.completed;
                } else if (rootParams.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                    successMessage = self.payments.payee.confirmScreen.corpMaker;
                    statusMessages = self.payments.payee.confirmScreen.pendingApproval;
                } else if (rootParams.dashboard.appData.segment !== "CORP") {
                    successMessage = self.payments.payee.confirmScreen.successMessage;
                    statusMessages = self.payments.common.success;
                }

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.payments.payee.labels.deletePayee,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        isSet: true,
                        taskCode: payeeTaskCodesMap[self.payeeData().payeeType],
                        confirmScreenDetails: getConfirmScreenDetailsArray(),
                        template: "confirm-screen/payments-template"
                    }
                });

            });

            self.closeModal();
        };

        self.menuItems = [{
                id: "pay",
                label: self.payments.payee.labels.pay
            },
            {
                id: "viewedit",
                label: self.payments.payee.labels.viewedit
            },
            {
                id: "delete",
                label: self.payments.payee.labels.delete
            }
        ];

        self.openMenu = function(data, event) {
            $("#menuLauncher-payeelist-contents-" + data.id).ojMenu("open", event);
        };

        self.closeModal = function() {
            $("#view-payee").hide();
            $("#delete-payee").hide();
            self.editPayeeGroupImage(false);
            $("#edit-payeeGroupImage").hide();

            if (self.choiseBoxOpened()) {
                self.choiseBoxOpened(false);
                $("#choiseDialog").hide();
            }
        };

        PayeeListModel.fetchCountryCode().done(function(data) {
            const enumRepresentations = data.enumRepresentations;

            if (enumRepresentations !== null) {
                for (let j = 0; j < enumRepresentations[0].data.length; j++) {
                    self.countryCodeMap[enumRepresentations[0].data[j].code] = enumRepresentations[0].data[j].description;
                }
            }
        });

        self.paySelectedPayee = function() {
            rootParams.dashboard.loadComponent(self.payeeData().payeeType === "DEMANDDRAFT" ? "issue-demand-draft" : "payments-money-transfer", {
                transferDataPayee: self.payeeData()
            });
        };

        function menuItemSelectHandler(selectedItem, data) {
            if (selectedItem === "pay") { self.paySelectedPayee(); } else if (selectedItem === "viewedit") {

                rootParams.dashboard.loadComponent("payee-view-edit", ko.mapping.toJS({
                    payeeData: self.payeeData,
                    payeeAccountTypeList: self.payeeAccountTypeList,
                    typeOfAccountDescription: self.typeOfAccountDescription,
                    newLimitAmount: self.newLimitAmount,
                    newMonthlyLimitAmount: self.newMonthlyLimitAmount,
                    tommDailyLimitAmount: self.tommDailyLimitAmount,
                    tommMonthlyLimitAmount: self.tommMonthlyLimitAmount,
                    limitPackage: self.limitPackage,
                    imageUploadFlag: self.imageUploadFlag,
                    countryCodeMap: self.countryCodeMap,
                    payeeLimitsMap: payeeLimitsMap
                }));
            } else if (selectedItem === "delete") { $("#delete-payee").trigger("openModal"); }
        }

        self.menuItemSelect = function(data, event) {
            if (data.payeeType === "DOMESTIC") {
                if (data.domesticPayeeType === "INDIA") {
                    self.payeeData(data.indiaDomesticPayee);
                    self.payeeData().domesticPayeeType = "INDIA";

                    self.typeOfAccountDescription(ko.utils.arrayFirst(self.payeeAccountTypeList(), function(element) {
                        return element.code === self.payeeData().accountType;
                    }).description);
                } else if (data.domesticPayeeType === "UK") {
                    self.payeeData(data.ukDomesticPayee);
                    self.payeeData().domesticPayeeType = "UK";
                    self.typeOfAccountDescription(null);
                } else if (data.domesticPayeeType === "SEPA") {
                    self.payeeData(data.sepaDomesticPayee);
                    self.payeeData().domesticPayeeType = "SEPA";
                    self.typeOfAccountDescription(null);
                }
            } else {
                self.payeeData(data);
                self.typeOfAccountDescription(null);
            }

            ko.tasks.runEarly();

            const payeeLimit = payeeLimitsMap[self.payeeData().id] && payeeLimitsMap[self.payeeData().id].DAILY ? payeeLimitsMap[self.payeeData().id].DAILY : null;

            if (payeeLimit) {
                self.newLimitAmount(payeeLimit.maxAmount.amount);
            } else {
                self.newLimitAmount("");
            }

            const monthlyPayeeLimit = payeeLimitsMap[self.payeeData().id] && payeeLimitsMap[self.payeeData().id].MONTHLY ? payeeLimitsMap[self.payeeData().id].MONTHLY : null;

            if (monthlyPayeeLimit) {
                self.newMonthlyLimitAmount(monthlyPayeeLimit.maxAmount.amount);
            } else {
                self.newMonthlyLimitAmount("");
            }

            const effFromTommDailyPayeeLimit = payeeLimitsMap2[self.payeeData().id] && payeeLimitsMap2[self.payeeData().id].DAILY ? payeeLimitsMap2[self.payeeData().id].DAILY : null;

            if (effFromTommDailyPayeeLimit) {
                self.tommDailyLimitAmount(effFromTommDailyPayeeLimit.maxAmount.amount);
            } else {
                self.tommDailyLimitAmount("");
            }

            const effFromTommMonthlyPayeeLimit = payeeLimitsMap2[self.payeeData().id] && payeeLimitsMap2[self.payeeData().id].MONTHLY ? payeeLimitsMap2[self.payeeData().id].MONTHLY : null;

            if (effFromTommMonthlyPayeeLimit) {
                self.tommMonthlyLimitAmount(effFromTommMonthlyPayeeLimit.maxAmount.amount);
            } else {
                self.tommMonthlyLimitAmount("");
            }

            self.payeeData().limitDetails = {
                DAILY: {
                    isEffectiveFromTomorrow: payeeLimit ? payeeLimit.isEffectiveFromTomorrow : "",
                    maxAmount: payeeLimit ? payeeLimit.maxAmount : {
                        amount: null,
                        currency: self.limitCurrency()
                    }
                },
                MONTHLY: {
                    isEffectiveFromTomorrow: monthlyPayeeLimit ? monthlyPayeeLimit.isEffectiveFromTomorrow : "",
                    maxAmount: monthlyPayeeLimit ? monthlyPayeeLimit.maxAmount : {
                        amount: null,
                        currency: self.limitCurrency()
                    }
                }
            };

            menuItemSelectHandler(event.target.value, data);
        };
    };
});