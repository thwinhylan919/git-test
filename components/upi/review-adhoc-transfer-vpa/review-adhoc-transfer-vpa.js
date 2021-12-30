define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/review-adhoc-transfer-vpa",
    "ojs/ojinputtext",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, reviewAdhocVpaModel, ResourceBundle) {
    "use strict";

    /** New VPA Creation.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.currentTask = ko.observable();
        self.contentIdMap = ko.observable({});
        self.payeePhotoLoaded = ko.observable();
        self.imageUploadFlag = ko.observable(false);
        self.p2pAddPayeeAs = ko.observable("existing-payee");
        self.common = self.resource.common;
        self.addPayeeInGroup = ko.observable();
        self.payeeListExpandAll = ko.observableArray();
        self.transferMode = self.params.adhocTransferVpaModel.creditVPAId;
        self.adhocTransferVpaModel = self.params.adhocTransferVpaModel;
        self.payeeName = self.params.payeeName;
        self.payeeAccountTypeList = ko.observable();
        self.region = ko.observable("INDIA");

        const batchRequest = {
            batchDetailRequestList: []
        };

        rootParams.baseModel.registerComponent("upi-payee", "upi");
        rootParams.baseModel.registerComponent("manage-accounts", "payments");
        rootParams.baseModel.registerComponent("bank-account-payee", "payee");
        rootParams.dashboard.headerName(self.resource.reviewAdhocVpa.header);

        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "row",
            "account-input"
        ]);

        const confirmScreenDetailsArray = [
            [].concat(self.transferMode ? [{
                label: self.resource.reviewAdhocVpa.transferTo,
                value: self.params.payeeName
            }, {
                label: self.resource.reviewAdhocVpa.payeeVpa,
                value: self.adhocTransferVpaModel.creditVPAId
            }] : [{
                label: self.resource.reviewAdhocVpa.payeeAccountNo,
                value: self.adhocTransferVpaModel.accountTransferDetails.accountNumber
            },
            {
                label: self.resource.reviewAdhocVpa.bankName,
                value: self.adhocTransferVpaModel.accountTransferDetails.bankDetails.name
            },
            {
                label: self.resource.reviewAdhocVpa.ifscCode,
                value: self.adhocTransferVpaModel.accountTransferDetails.bankDetails.code
            }
                ]).concat([{
                    label: self.resource.reviewAdhocVpa.transferFrom,
                    value: self.adhocTransferVpaModel.debitVPAId
                }, {
                    label: self.resource.reviewAdhocVpa.amount,
                    value: self.adhocTransferVpaModel.amount.amount,
                    currency: true,
                    currencyType: self.adhocTransferVpaModel.amount.currency
                }, {
                    label: self.resource.reviewAdhocVpa.note,
                    value: self.adhocTransferVpaModel.remarks
                }
                ])

        ];

        self.confirmTransfer = function () {
            reviewAdhocVpaModel.confirmTransfer(ko.toJSON(self.adhocTransferVpaModel)).done(function (data, status, jqXHR) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    isAdhoc: true,
                    transactionName: self.resource.reviewAdhocVpa.header,
                    confirmScreenExtensions: {
                        successMessage: self.resource.confirm.RETAIL_SUCCESS_MESSAGE,
                        isSet: true,
                        taskCode: "PC_F_UT",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        template: "confirm-screen/adhoc-transfer-vpa"
                    }
                }, self);
            });
        };

        /**
         * This function will help initializing the dealType and its associated fields.
         *
         * @memberOf review-adhoc-transfer-vpa
         * @function loadBatchImages
         * @returns {void}
         */
        function loadBatchImages() {
            reviewAdhocVpaModel.batchRead(batchRequest).done(function (batchData) {
                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                }

                $("#p2p-payee").trigger("openModal");
            });
        }

        /**
         * This function will help initializing the dealType and its associated fields.
         *
         * @memberOf review-adhoc-transfer-vpa
         * @param {Object} id  - ContentId of image.
         * @function loadBatchRequest
         * @returns {void}
         */
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

        self.newPayee = function () {
            if (self.transferMode) {
                rootParams.dashboard.loadComponent("upi-payee", {
                    isExisting: false,
                    vpaId: self.adhocTransferVpaModel.creditVPAId,
                    accountName: self.payeeName
                }, self);
            }
            else if (!self.transferMode) {
                rootParams.dashboard.loadComponent("manage-accounts", {
                    selectedComponent: ko.observable("domestic-payee"),
                    payeeAccountTypeList: self.payeeAccountTypeList,
                    typeOfAccount: ko.observable("10"),
                    typeOfAccountDescription: ko.observable(),
                    fromAdhocTransferUpi: true,
                    currentRelationType: ko.observable("ACC"),
                    currentAccountType: ko.observable("DOMESTIC"),
                    accountNumber: self.adhocTransferVpaModel.accountTransferDetails.accountNumber,
                    fromAdhoc: true,
                    defaultTab: "bank-account-payee",
                    applicationType: "payee",
                    isNew: ko.observable(true),
                    accountName: self.payeeName,
                    bankDetailsCode: self.adhocTransferVpaModel.accountTransferDetails.bankDetails.code,
                    accessType: ko.observable("PRIVATE"),
                    region: ko.observable("INDIA")
                }, self);
            }
        };

        self.createPayee = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("createpayee"))) {
                return;
            }

            if (self.p2pAddPayeeAs() === "existing-payee") {
                self.existingPayee();
            } else {
                self.newPayee();
            }
        };

        self.existingPayee = function () {
            const groupId = self.addPayeeInGroup(),
                obj = ko.utils.arrayFirst(self.payeeListExpandAll(), function (element) {
                    return element.groupId === groupId;
                });

            if (self.transferMode) {
                rootParams.dashboard.loadComponent("upi-payee", {
                    contentId: ko.observable(obj.contentId),
                    payeeName: obj.payeeGroupName,
                    payeeGroupId: groupId,
                    isExisting: true,
                    vpaId: self.adhocTransferVpaModel.creditVPAId,
                    accountName: self.payeeName
                }, self);
            }
            else if (!self.transferMode) {
                rootParams.dashboard.loadComponent("manage-accounts", {
                    selectedComponent: ko.observable("domestic-payee"),
                    currentRelationType: ko.observable("ACC"),
                    currentAccountType: ko.observable("DOMESTIC"),
                    fromAdhocTransferUpi: true,
                    accountNumber: self.adhocTransferVpaModel.accountTransferDetails.accountNumber,
                    payeeAccountTypeList: self.payeeAccountTypeList,
                    typeOfAccountDescription: ko.observable(),
                    typeOfAccount: ko.observable("10"),
                    fromAdhoc: true,
                    defaultTab: "bank-account-payee",
                    applicationType: "payee",
                    isNew: ko.observable(false),
                    payeeName: ko.observable(obj.payeeGroupName),
                    payeeGroupId: ko.observable(groupId),
                    accountName: self.payeeName,
                    bankDetailsCode: self.adhocTransferVpaModel.accountTransferDetails.bankDetails.code,
                    accessType: ko.observable("PRIVATE"),
                    region: ko.observable("INDIA")
                }, self);
            }
        };

        reviewAdhocVpaModel.getPayeeAccountType(self.region()).then(function (responseData) {
            self.payeeAccountTypeList(responseData.enumRepresentations[0].data);
        });

        self.addAdhocPayee = function () {
            reviewAdhocVpaModel.getPayeeList().done(function (data) {
                if (data.payeeGroups.length === 0) {
                    self.newPayee();

                    return;
                }

                for (let i = 0; i < data.payeeGroups.length; i++) {
                    if (data.payeeGroups[i].contentId) {
                        loadBatchRequest(data.payeeGroups[i].contentId.value);
                        self.contentIdMap()[data.payeeGroups[i].contentId.value] = ko.observable();
                    }

                    self.payeeListExpandAll.push({
                        payeeGroupName: data.payeeGroups[i].name,
                        payeeList: data.payeeGroups[i].listPayees,
                        groupId: data.payeeGroups[i].groupId,
                        contentId: data.payeeGroups[i].contentId ? data.payeeGroups[i].contentId.value : null,
                        preview: data.payeeGroups[i].contentId ? self.contentIdMap()[data.payeeGroups[i].contentId.value] : null,
                        initials: oj.IntlConverterUtils.getInitials(data.payeeGroups[i].name)
                    });
                }

                if (batchRequest.batchDetailRequestList.length) { loadBatchImages(); }
                else {
                    $("#p2p-payee").trigger("openModal");
                    self.payeePhotoLoaded(true);
                }
            });
        };
    };
});
