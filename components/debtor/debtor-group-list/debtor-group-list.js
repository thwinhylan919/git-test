define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/debtor-group-list",
    "ojs/ojinputnumber",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojavatar"
], function(oj, ko, $, manageDebtorsModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            batchRequest = {
                batchDetailRequestList: []
            };
        let i = 0,
            j = 0;
        const getNewKoModel = function() {
            const KoModel = ko.mapping.fromJS(manageDebtorsModel.getNewModel());

            return KoModel;
        };

        ko.utils.extend(self, rootParams.rootModel);
        self.debtors = ResourceBundle.debtors;
        rootParams.dashboard.headerName(self.debtors.managedebtor_header);
        self.isDebtorsListLoaded = ko.observable(false);
        self.debtorsList = ko.observableArray();
        self.debtorListDataSource = ko.observable();
        self.contentIdMap = ko.observable({});
        self.contentId = ko.observable();
        self.preview = ko.observable();
        self.file = ko.observable();
        self.fileId = ko.observable("input");
        self.imageId = ko.observable("target");
        self.imageUploaded = ko.observable();
        self.fileTypeArray = ko.observableArray();
        self.maxFileSize = ko.observable();
        rootParams.baseModel.registerComponent("add-new-debtor", "debtor");

        rootParams.baseModel.registerElement([
            "confirm-screen",
            "search-box"
        ]);

        rootParams.baseModel.registerComponent("debtor-details", "debtor");
        rootParams.baseModel.registerComponent("payee-card", "payee");
        rootParams.baseModel.registerComponent("debtor-sub-list", "debtor");
        rootParams.baseModel.registerComponent("debtor-money-request", "debtor");
        rootParams.baseModel.registerComponent("payee-data-card", "payee");
        rootParams.baseModel.registerComponent("image-upload", "goals");
        manageDebtorsModel.init();

        function loadBatchImages() {
            manageDebtorsModel.batchRead(batchRequest).done(function(batchData) {
                self.isDebtorsListLoaded(false);

                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                }

                for (let k = 0; k < self.debtorsList().length; k++) {
                    if (self.debtorsList()[k].contentId) {
                        self.debtorsList()[k].preview(self.contentIdMap()[self.debtorsList()[k].contentId.value]());
                    }
                }

                self.debtorListDataSource(new oj.ArrayTableDataSource(self.debtorsList(), {
                    idAttribute: ["name"]
                }));

                self.isDebtorsListLoaded(true);
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

        self.editPayerModel = getNewKoModel().editPayerModel;
        self.imageUploadSuccessMsg = ko.observable(false);

        let previousContentId;
        const contentID = self.contentId.subscribe(function() {
            const params = {
                groupId: self.debtorData().groupId,
                payerId: self.debtorData().id
            };

            self.editPayerModel.nickName(self.debtorData().nickName);
            self.editPayerModel.groupId(self.debtorData().groupId);
            self.editPayerModel.sepaDomesticPayer.bankDetails.code = self.debtorData().bankDetails.code;
            self.editPayerModel.sepaDomesticPayer.iban = self.debtorData().accountNumber;
            self.editPayerModel.contentId(self.contentId());

            manageDebtorsModel.editPayer(ko.toJSON(self.editPayerModel), params).done(function() {

                if (previousContentId && self.contentId() && previousContentId !== self.contentId()) {
                    self.imageUploadSuccessMsg(rootParams.baseModel.format(self.debtors.uploadSuccess, { message: self.debtors.imageMessage.EDIT }));
                } else if (previousContentId && !self.contentId()) {
                    self.imageUploadSuccessMsg(rootParams.baseModel.format(self.debtors.uploadSuccess, { message: self.debtors.imageMessage.REMOVE }));
                } else if (!previousContentId && self.contentId()) {
                    self.imageUploadSuccessMsg(rootParams.baseModel.format(self.debtors.uploadSuccess, { message: self.debtors.imageMessage.UPLOAD }));
                }

                setTimeout(function() {
                    self.imageUploadSuccessMsg(null);
                }, 4000);

                previousContentId = self.contentId();
            });
        });

        self.dispose = function() {
            contentID.dispose();
        };

        manageDebtorsModel.getDebtorsList().done(function(data) {
            batchRequest.batchDetailRequestList = [];
            self.debtorsList.removeAll();

            for (i = 0; i < data.payerGroups.length; i++) {
                for (j = 0; j < data.payerGroups[i].listPayers.length; j++) {
                    self.debtorsList.push({
                        name: data.payerGroups[i].name,
                        id: data.payerGroups[i].listPayers[j].id,
                        accountNumber: data.payerGroups[i].listPayers[j].sepaDomesticPayer.iban,
                        bankName: data.payerGroups[i].listPayers[j].sepaDomesticPayer.bankDetails.name,
                        address: data.payerGroups[i].listPayers[j].sepaDomesticPayer.bankDetails.city,
                        nickName: data.payerGroups[i].listPayers[j].nickName,
                        bicCode: data.payerGroups[i].listPayers[j].sepaDomesticPayer.bankDetails.code,
                        groupId: data.payerGroups[i].groupId,
                        bankDetails: data.payerGroups[i].listPayers[j].sepaDomesticPayer.bankDetails,
                        contentId: data.payerGroups[i].listPayers[j].contentId ? data.payerGroups[i].listPayers[j].contentId : null,
                        preview: ko.observable(null),
                        initials: oj.IntlConverterUtils.getInitials(data.payerGroups[i].name)
                    });

                    if (data.payerGroups[i].listPayers[j].contentId) {
                        self.contentIdMap()[data.payerGroups[i].listPayers[j].contentId.value] = ko.observable();
                        loadBatchRequest(data.payerGroups[i].listPayers[j].contentId.value);
                    }

                }
            }

            if (batchRequest.batchDetailRequestList.length) {
                loadBatchImages();
            }

            if (batchRequest.batchDetailRequestList.length === 0) {
                self.debtorListDataSource(new oj.ArrayTableDataSource(self.debtorsList(), {
                    idAttribute: ["name"]
                }));

                self.isDebtorsListLoaded(true);

            }
        });

        self.menuItems = [{
                id: "request",
                label: self.debtors.labels.requestmoney
            },
            {
                id: "view",
                label: self.debtors.labels.view
            },
            {
                id: "delete",
                label: self.debtors.labels.delete
            }
        ];

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        manageDebtorsModel.getPayerMaintenance().then(function(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (rootParams.dashboard.appData.segment !== "CORP") {
                self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            }

            if (self.imageUploadFlag()) {
                manageDebtorsModel.retrieveImageTypeSuuport().then(function(data) {
                    if (data) {
                        self.fileTypeArray(data.allowedImageMIMEType.split(","));
                        self.maxFileSize(data.maxSize);
                    }
                });
            }

        });

        self.debtorData = ko.observable();

        self.confirmDeleteDebtor = function() {
            manageDebtorsModel.deleteDebtor(self.debtorData().groupId, self.debtorData().id).done(function(data, status, jqXHR) {
                manageDebtorsModel.deleteDebtorGroup(self.debtorData().groupId).done(function() {
                    self.closeModal();

                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        template: "confirm-screen/payments-template",
                        transactionName: self.debtors.deleteDebtor
                    }, self);
                });
            });
        };

        self.openMenu = function(data, event) {
            $("#menuLauncher-debtorlist-contents-" + data.id).ojMenu("open", event);
        };

        self.closeModal = function() {
            $("#view-debtor").trigger("closeModal");
            $("#delete-debtor").trigger("closeModal");
        };

        self.requestSelectedDebtor = function() {
            if (rootParams.baseModel.small()) {
                rootParams.dashboard.loadComponent("debtor-money-request", {
                    transferDataDebtor: self.debtorData()
                }, self);
            } else {
                rootParams.changeView("debtor-money-request", self.params);
            }
        };

        self.menuItemSelect = function(data, event) {
            self.debtorData(data);

            previousContentId = data.contentId ? data.contentId.value : null;

            if (event.target.value === "request") {
                self.requestSelectedDebtor();
            } else if (event.target.value === "view") {
                $("#view-debtor").trigger("openModal");
                self.imageUploaded(!data.preview());
            } else if (event.target.value === "delete") {
                $("#delete-debtor").trigger("openModal");
            }
        };
    };
});