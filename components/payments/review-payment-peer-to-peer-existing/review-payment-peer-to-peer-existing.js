/**
 * review-payment-peer-to-peer-existing.
 *
 * @module payments
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} peertopeerModel
 * @requires {object} ResourceBundle
 */
define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/payment-peer-to-peer",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojknockout-validation"
], function(oj, ko, peertopeerModel, ResourceBundle) {
    "use strict";

    /** Review-payment-peer-to-peer-existing..
     *
     *IT allows user to review the details of peer to peer transfer.
     *
     * @param {Object} Params  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.p2ppaymentData = ko.observable();
        self.imageUploadFlag = ko.observable();
        self.resource = ResourceBundle;
        self.paymentId = self.params && self.params.data ? self.params.data.paymentId() : self.params.paymentId();
        self.loadData = ko.observable(false);
        self.verifyPayment = self.params.verifyPayment;
        self.cancelPayment = self.params.cancelPayment;
        Params.dashboard.headerName(self.resource.payments.transferMoney);

        Params.baseModel.registerElement([
            "row",
            "page-section"
        ]);

        const batchRequest = {
                batchDetailRequestList: []
            },
            groupBatchRequest = {
                batchDetailRequestList: []
            };

        self.groupIdMap = ko.observable({});
        self.contentIdMap = ko.observable({});

        peertopeerModel.getPayeeMaintenance().then(function(data) {
            const propertyValue = ko.utils.arrayFirst(data.configurationDetails, function(element) {
                return element.propertyId === "RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED";
            }).propertyValue;

            if (propertyValue === "Y") {
                self.imageUploadFlag(true);
            } else {
                self.imageUploadFlag(false);
            }
        });

        self.loadBatchRequest = function(id) {
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

        self.loadGroupRequest = function(groupId) {
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

        self.loadBatchImages = function() {
            if (self.imageUploadFlag()) {
                if (groupBatchRequest.batchDetailRequestList.length > 0) {
                    self.getGroupContentData();
                } else {
                    self.setPreviewData();
                }
            }

        };

        self.setPreviewData = function() {
            if (batchRequest.batchDetailRequestList.length) {
                peertopeerModel.batchRead(batchRequest).done(function(batchData) {
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

        self.getGroupContentData = function() {
            peertopeerModel.batchRead(groupBatchRequest).done(function(groupBatchData) {
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

        self.setPayeeDetails = function(data) {
            if (self.params && self.params.data) {
                peertopeerModel.getPayeeDetails(data.payeeDetails.groupId, data.payeeDetails.id).then(function(payeeData) {

                    self.payeeDetails = ko.observable({
                        payeeNickName: payeeData.peerToPeerPayee.nickName,
                        contentId: payeeData.peerToPeerPayee.contentId ? payeeData.peerToPeerPayee.contentId : null,
                        initials: oj.IntlConverterUtils.getInitials(payeeData.peerToPeerPayee.payeeNickName ? payeeData.peerToPeerPayee.nickName : "-"),
                        preview: ko.observable(null)
                    });

                    if (payeeData.peerToPeerPayee.contentId && payeeData.peerToPeerPayee.contentId.value) {
                        if (!self.contentIdMap()[payeeData.peerToPeerPayee.contentId.value]) {
                            self.contentIdMap()[payeeData.peerToPeerPayee.contentId.value] = ko.observable();
                        }

                        self.payeeDetails().preview = self.contentIdMap()[payeeData.peerToPeerPayee.contentId.value];
                        self.loadBatchRequest(payeeData.peerToPeerPayee.contentId.value);
                    } else if (payeeData.peerToPeerPayee.groupId) {
                        if (!self.contentIdMap()[payeeData.peerToPeerPayee.groupId]) {
                            self.contentIdMap()[payeeData.peerToPeerPayee.groupId] = ko.observable();
                        }

                        self.payeeDetails().preview = self.contentIdMap()[payeeData.peerToPeerPayee.groupId];
                        self.loadGroupRequest(payeeData.peerToPeerPayee.groupId);
                    }

                    self.loadData(true);
                    self.loadBatchImages();
                });
            } else {
                self.payeeDetails = self.params.payeeDetails;
                self.loadData(true);
            }
        };

        peertopeerModel.readP2P(self.paymentId).then(function(data) {
            self.p2ppaymentData(data);
            self.setPayeeDetails(data);
        });

    };
});