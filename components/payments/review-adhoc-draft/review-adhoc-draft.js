define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/adhoc-payments",
    "ojL10n!resources/nls/demand-draft-payee",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function(oj, ko, $, ReviewAdhocPaymentModel, ResourceBundle, CommonPayee) {
    "use strict";

    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(ReviewAdhocPaymentModel.getNewModel());

                return KoModel;
            };

        self.addressDetails = getNewKoModel().addressDetails;

        ko.utils.extend(self, rootParams.rootModel);

        const batchRequest = {
            batchDetailRequestList: []
        };

        self.paymentId = ko.observable();
        self.common = CommonPayee.payments.common;
        self.paymentType = ko.observable();
        self.transferDetails = ko.observable();
        self.payeeReadResponse = ko.observable();
        self.loadDetails = ko.observable(false);
        self.payeeDetails = ko.observable();
        self.draftType = ko.observable();
        self.mode = ko.observable();
        self.selectedComponent = ko.observable();
        self.payeeListExpandAll = ko.observableArray();
        self.addPayeeInGroup = ko.observable();
        self.adhocPayeeDetails = ko.observable();
        self.p2pAddPayeeAs = ko.observable("existing-payee");

        self.payments = ResourceBundle.payments;
        self.typeOfAccount = ko.observable();
        self.typeOfAccountDescription = ko.observable();
        self.payeeAccountTypeList = ko.observable();
        self.accountNumber = ko.observable();
        self.region = ko.observable();
        self.payeeNickName = ko.observable();
        self.sepaType = ko.observable();
        self.accountName = ko.observable();
        self.network = ko.observable();
        self.bankDetailsCode = ko.observable();
        self.bankName = ko.observable();
        self.bankAddress = ko.observable();
        self.country = ko.observable();
        self.city = ko.observable();
        self.contentIdMap = ko.observable({});
        self.inFavourOf = ko.observable();
        self.currentAccountType = ko.observable(self.params.currentAccountType);
        self.genericPayeePayload = ko.observable(self.params.genericPayeePayload);
        self.imageUploadFlag = ko.observable(false);
        self.payeePhotoLoaded = ko.observable(false);
        self.confirmScreenExtensions = self.params.confirmScreenExtensions;
        self.disableConfirmButton = ko.observable(false);

        let confirmScreenDetailsArray;

        rootParams.baseModel.registerComponent("demand-draft-payee", "payee");
        rootParams.dashboard.headerName(self.payments.adhocDemandDraft);
        self.payeeStatus = self.params.transferData ? self.params.transferData.payeeStatus : "INT";
        self.typeofPayment = self.payeeStatus === "DEL" ? self.params.transferData.paymentType : "GENERIC";

        if (self.params.instructionId) {
            self.paymentId(ko.utils.unwrapObservable(self.params.instructionId));
            self.transferNow(false);
        } else if (self.params.paymentId) { self.paymentId(ko.utils.unwrapObservable(self.params.paymentId)); } else if (self.params.data) {
            self.paymentId(ko.utils.unwrapObservable(self.params.data.paymentId ? self.params.data.paymentId : self.params.data.instructionId));
        }

        ReviewAdhocPaymentModel.readAdhocPayment(self.paymentId(), self.typeofPayment, self.payeeStatus).done(function(data) {
            if (data !== null) {
                self.payeeReadResponse(data.payeeReadResponse ? data.payeeReadResponse : data.payeeDetails);

                if (data.payeeDetails) {

                    self.payeeReadResponse().payeeDTO = { nickName: null };
                    self.payeeReadResponse().payeeDTO.nickName = self.payeeReadResponse.nickName;

                }

                self.paymentType(data.paymentType);

                if (self.paymentType() === "DOMESTICDRAFT") {
                    const details = data.domesticDraftReadResponse ? data.domesticDraftReadResponse : data;

                    self.draftType(self.payments.payee.accdomestic);
                    self.transferDetails(details.draftDetails);
                    self.inFavourOf(details.inFavourOf);
                    ko.utils.extend(self.addressDetails.postalAddress, ko.mapping.fromJS(details.payeeDetails.address));
                    self.payeeDetails(details.payeeDetails);
                    self.mode(details.payeeDetails.demandDraftDeliveryDTO.deliveryMode);
                } else if (self.paymentType() === "DOMESTICDRAFT_PAYLATER") {
                    self.draftType(self.payments.payee.accdomestic);
                    self.inFavourOf(data.domesticDraftInstructionReadResponse.draftDetails.instructionDetails.inFavourOf);
                    self.transferDetails(data.domesticDraftInstructionReadResponse.draftDetails.instructionDetails);
                    ko.utils.extend(self.addressDetails.postalAddress, ko.mapping.fromJS(data.domesticDraftInstructionReadResponse.draftDetails.payeeDetails.address));
                    self.payeeDetails(data.domesticDraftInstructionReadResponse.draftDetails.payeeDetails);
                    self.mode(data.domesticDraftInstructionReadResponse.draftDetails.payeeDetails.demandDraftDeliveryDTO.deliveryMode);
                } else if (self.paymentType() === "INTERNATIONALDRAFT") {
                    self.draftType(self.payments.payee.accinternational);
                    self.inFavourOf(data.internationalDraftReadResponse.inFavourOf);
                    self.transferDetails(data.internationalDraftReadResponse.draftDetails);
                    ko.utils.extend(self.addressDetails, ko.mapping.fromJS(data.internationalDraftReadResponse.payeeDetails.address));
                    self.payeeDetails(data.internationalDraftReadResponse.payeeDetails);
                    self.mode(data.internationalDraftReadResponse.payeeDetails.demandDraftDeliveryDTO.deliveryMode);
                } else if (self.paymentType() === "INTERNATIONALDRAFT_PAYLATER") {
                    self.draftType(self.payments.payee.accinternational);
                    self.inFavourOf(data.internationalDraftInstructionReadResponse.draftDetails.instructionDetails.inFavourOf);
                    self.transferDetails(data.internationalDraftInstructionReadResponse.draftDetails.instructionDetails);
                    ko.utils.extend(self.addressDetails, ko.mapping.fromJS(data.internationalDraftInstructionReadResponse.draftDetails.payeeDetails.address));
                    self.payeeDetails(data.internationalDraftInstructionReadResponse.draftDetails.payeeDetails);
                    self.mode(data.internationalDraftInstructionReadResponse.draftDetails.payeeDetails.demandDraftDeliveryDTO.deliveryMode);
                }

                self.payeeReadResponse().payeeDTO = self.payeeDetails();

                if (self.payeeDetails().demandDraftDeliveryDTO.deliveryMode === "BRN") {
                    self.getBranchDetails(self.payeeDetails().demandDraftDeliveryDTO.branch);
                } else if (self.payeeDetails().demandDraftDeliveryDTO.deliveryMode === "MAI") {
                    self.getPartyAddress(self.payeeDetails().demandDraftDeliveryDTO.addressType);
                } else if (self.payeeDetails().demandDraftDeliveryDTO.deliveryMode === "OTHADD") {
                    ko.utils.extend(self.addressDetails.postalAddress, ko.mapping.fromJS(self.payeeReadResponse().payeeDTO.address));
                    self.loadDetails(true);
                    ko.tasks.runEarly();
                    self.setConfirmScreenExtension();
                }
            }
        });

        self.getPartyAddress = function(addressType) {
            ReviewAdhocPaymentModel.getPartyAddress().done(function(data) {
                if (data.party) {
                    for (let i = 0; i < data.party.addresses.length; i++) {
                        if (data.party.addresses[i].type === addressType) {
                            self.addressDetails.postalAddress = data.party.addresses[i].postalAddress ? data.party.addresses[i].postalAddress : "";
                            break;
                        }
                    }
                }

                self.addressDetails.addressTypeDescription = self.payments.payee[addressType];
                self.addressDetails.postalAddress.zipCode = self.addressDetails.postalAddress.postalCode;
                self.setConfirmScreenExtension();
                self.loadDetails(true);
                ko.tasks.runEarly();
            });
        };

        self.getBranchDetails = function(branchCode) {
            ReviewAdhocPaymentModel.getBranchDetails(branchCode).done(function(data) {
                ko.utils.extend(self.addressDetails.postalAddress, ko.mapping.fromJS(data.addressDTO[0].branchAddress.postalAddress));
                self.addressDetails.postalAddress.branchName(data.addressDTO[0].branchName);
                self.setConfirmScreenExtension();
                self.loadDetails(true);
                ko.tasks.runEarly();
            });
        };

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON && jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON && jqXHR.responseJSON.transactionAction) {
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
            } else if (rootParams.dashboard.appData.segment === "CORP" && jqXHR.status && jqXHR.getResponseStatus() === 202) {
                return self.payments.common.confirmScreen.corpMaker;
            }

            return self.payments.common.confirmScreen.successSI;

        };

        self.confirmDDIssue = function() {
            self.disableConfirmButton(true);

            ReviewAdhocPaymentModel.confirmPayment(self.paymentId(), self.paymentType()).done(function(data, status, jqXHR) {
                if (data !== null) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.externalReferenceId,
                        transactionName: self.payments.adhocDemandDraft,
                        addAdhocPayee: self.addAdhocPayee,
                        createPayee: self.createPayee,
                        payeeListExpandAll: self.payeeListExpandAll,
                        p2pAddPayeeAs: self.p2pAddPayeeAs,
                        imageUploadFlag: self.imageUploadFlag,
                        addPayeeInGroup: self.addPayeeInGroup,
                        common: self.common,
                        isAdhoc: true,
                        confirmScreenExtensions: {
                            isSet: true,
                            taskCode: "PC_F_ID",
                            confirmScreenDetails: confirmScreenDetailsArray,
                            template: "confirm-screen/payments-template"
                        }
                    }, self);
                }
            });
        };

        self.setConfirmScreenExtension = function() {
            confirmScreenDetailsArray = [
                [{
                        label: self.payments.payee.domesticDraft.domestic.draftfavouring,
                        value: self.inFavourOf()
                    },
                    {
                        label: self.payments.moneytransfer.amount,
                        value: self.transferDetails().amount.amount,
                        currency: self.transferDetails().amount.currency,
                        isCurrency: true
                    }
                ],
                [{
                        label: self.payments.moneytransfer.scheduledon,
                        value: self.paymentType() === "INTERNATIONALDRAFT_PAYLATER" || self.paymentType() === "DOMESTICDRAFT_PAYLATER" ? self.transferDetails().startDate : self.transferDetails().valueDate,
                        isDate: true
                    },
                    {
                        label: self.payments.moneytransfer.transferfrom,
                        value: self.transferDetails().debitAccountId.displayValue
                    }
                ],
                [{
                    label: self.payments.common.DeliveryLocation,
                    value: self.payeeDetails().demandDraftDeliveryDTO.deliveryMode === "OTHADD" ? [self.addressDetails.postalAddress.line1, self.addressDetails.postalAddress.line2, self.addressDetails.postalAddress.city, self.addressDetails.postalAddress.state, self.addressDetails.postalAddress.country, self.addressDetails.postalAddress.zipCode] : [
                        self.addressDetails.postalAddress.branchName,
                        self.addressDetails.postalAddress.city,
                        self.addressDetails.postalAddress.country,
                        self.addressDetails.postalAddress.line1,
                        self.addressDetails.postalAddress.line2
                    ]
                }]
            ];

            if (self.params.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    taskCode: "PC_F_ID",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    template: "confirm-screen/payments-template"
                });
            }
        };

        self.existingPayee = function() {
            const groupId = self.addPayeeInGroup().groupId,
                obj = ko.utils.arrayFirst(self.payeeListExpandAll(), function(element) {
                    return element.groupId === groupId;
                });

            self.createBankAccountPayee("manage-accounts", {
                payeeName: obj.payeeGroupName,
                payeeGroupId: groupId,
                isNew: false,
                preview: self.addPayeeInGroup().preview
            });
        };

        self.newPayee = function() {
            self.createBankAccountPayee("manage-accounts", {
                isNew: true
            });
        };

        self.createPayee = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("createpayee"))) {
                return;
            }

            if (self.p2pAddPayeeAs() === "existing-payee") {
                self.existingPayee();
            } else {
                self.newPayee();
            }
        };

        /**
         * This function will help initializing the dealType and its associated fields.
         *
         * @memberOf review-adhoc-draft
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

        /**
         * This function will help initializing the dealType and its associated fields.
         *
         * @memberOf review-adhoc-draft
         * @function loadBatchImages
         * @returns {void}
         */
        function loadBatchImages() {
            ReviewAdhocPaymentModel.batchRead(batchRequest).done(function(batchData) {
                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                }

                $("#p2p-payee").trigger("openModal");
            });
        }

        self.addAdhocPayee = function() {
            if (rootParams.dashboard.appData.segment === "RETAIL") {
                ReviewAdhocPaymentModel.getPayeeList().done(function(data) {
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

                    if (batchRequest.batchDetailRequestList.length) { loadBatchImages(); } else {
                        $("#p2p-payee").trigger("openModal");
                        self.payeePhotoLoaded(true);
                    }
                });
            } else {
                self.createBankAccountPayee("demand-draft-payee", {
                    isNew: true
                });
            }
        };

        self.createBankAccountPayee = function(component, params) {
            if (self.currentAccountType() === "INTERNATIONAL") {
                self.selectedComponent("international-demand-draft");
            } else if (self.currentAccountType() === "DOMESTIC") {
                self.selectedComponent("domestic-demand-draft");
            }

            self.addressDetails.modeofDelivery(self.payeeReadResponse().payeeDTO.demandDraftDeliveryDTO.deliveryMode);

            if (self.addressDetails.modeofDelivery() !== "MAI") {
                if (self.addressDetails.modeofDelivery() === "OTHADD") {
                    ko.utils.extend(self.addressDetails.postalAddress, ko.mapping.fromJS(self.payeeReadResponse().payeeDTO.address));
                } else {
                    self.addressDetails.postalAddress.branch(self.payeeReadResponse().payeeDTO.demandDraftDeliveryDTO.branch);
                }
            } else {
                self.addressDetails.modeofDelivery("MAI");
            }

            ReviewAdhocPaymentModel.readPayee(self.payeeReadResponse().payeeDTO.groupId, self.payeeReadResponse().payeeDTO.id, "demandDraft").done(function(data) {
                self.adhocPayeeDetails(data);

                rootParams.dashboard.loadComponent(component, ko.toJS({
                    currentAccountType: self.currentAccountType,
                    fromAdhoc: true,
                    defaultTab: "demand-draft-payee",
                    applicationType: "payee",
                    isNew: params.isNew,
                    payeeName: params.payeeName,
                    payeeId: self.payeeReadResponse().payeeDTO.id,
                    payeeNickName: self.payeeReadResponse().payeeDTO.nickName,
                    addressDetails: self.addressDetails,
                    payAtCity: self.payAtCity,
                    payAtCountry: self.payAtCountry,
                    selectedComponent: self.selectedComponent,
                    adhocPayLoad: self.genericPayeePayload,
                    accessType: "PRIVATE",
                    payeeGroupId: params.payeeGroupId,
                    preview: params.preview ? params.preview : ko.observable()
                }));
            });
        };

    };
});