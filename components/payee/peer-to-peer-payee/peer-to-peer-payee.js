define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/peer-to-peer-payee",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojavatar",
    "ojs/ojvalidationgroup"
], function(ko, P2PPayeeModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;
        let payload;
        const getNewKoModel = function() {
            const KoModel = ko.mapping.fromJS(P2PPayeeModel.getNewModel());

            return KoModel;
        };

        ko.utils.extend(self, rootParams.rootModel);

        self.taxonomyDefinition = rootParams.dashboard.getTaxonomyDefinition("com.ofss.digx.app.payment.dto.payee.PeerToPeerPayeeCreateRequestDTO");
        self.validationTracker = ko.observable();
        self.common = ResourceBundle.common;
        self.payments = ResourceBundle.payments;
        self.p2pPayeeModel = getNewKoModel().p2pPayee;
        self.p2pPayeeGroup = getNewKoModel().payeeGroup;
        self.otpEntered = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.externalReferenceId = ko.observable();
        rootParams.dashboard.headerName(rootParams.rootModel.params && !rootParams.rootModel.params.isEdit ? self.payments.addrecipient_header : self.payments.editrecipient_header);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.p2pData = ko.observable();
        self.payeeGroupId = ko.observable(self.params.payeeGroupId);
        self.payeeId = ko.observable(self.params.payeeId);
        self.type = ko.observable("peerToPeer");
        self.payeeType = ko.observable();
        self.p2pPayeeModel.transferValue(self.params.transferValue);
        self.p2pPayeeModel.name(self.params.payeeName);
        self.p2pPayeeModel.nickName(self.params.payeeNickName);
        self.isNew = ko.observable(false);
        self.file = ko.observable();
        self.contentId = ko.observable();
        self.preview = ko.observable();
        self.fileId = ko.observable("input");
        self.imageId = ko.observable("target");
        self.isImageExist = ko.observable();
        self.avatarSize = ko.observable("md");
        self.fileTypeArray = ko.observableArray();
        self.maxFileSize = ko.observable();
        self.payeeImageAvailable = ko.observable(false);
        self.defaultPreview = ko.observable();
        self.groupValid = ko.observable();

        rootParams.baseModel.registerComponent("image-upload", "goals");

        if (self.params && self.params.isNew) {
            self.isNew(true);
        }

        if (self.params.preview) {
            self.preview = ko.observable(self.params.preview);
        }

        P2PPayeeModel.init();

        self.back = function() {
            self.stageOne(true);
            self.stageTwo(false);
            self.stageThree(false);
        };

        self.createPayeeGroup = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            if (!self.isNew()) {
                self.p2pPayeeModel.contentId(self.contentId());
                self.addPayee();

                return;
            }

            self.p2pPayeeGroup.contentId(self.contentId());
            self.p2pPayeeGroup.name(self.p2pPayeeModel.name());

            const payload = ko.toJSON(self.p2pPayeeGroup);

            P2PPayeeModel.createPayeeGroup(payload).done(function(data) {
                self.payeeGroupId(data.payeeGroup.groupId);
                self.addPayee();
            });
        };

        function initializeModel() {
            if (rootParams.rootModel.params && rootParams.rootModel.params.isEdit) {
                self.p2pPayeeModel.contentId = self.contentId;
            }
        }

        initializeModel();

        function loadImage(contentId) {
            P2PPayeeModel.retrieveImage(contentId).then(function(data) {
                self.imageUploadFlag(false);
                ko.tasks.runEarly();

                if (data && data.contentDTOList[0]) {
                    self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
                }

                self.imageUploadFlag(true);
            });
        }

        function groupLoadImage(contentId) {
            P2PPayeeModel.retrieveImage(contentId).then(function(data) {
                self.imageUploadFlag(false);
                ko.tasks.runEarly();

                if (data && data.contentDTOList[0]) {
                    self.defaultPreview("data:image/gif;base64," + data.contentDTOList[0].content);
                }

                self.imageUploadFlag(true);
            });
        }

        function readPayeeAndGroupDetails(){
             P2PPayeeModel.getPayeeDetails(self.payeeId(), self.payeeGroupId(), self.type()).then(function(data) {
                if (data.peerToPeerPayee.contentId) {
                    loadImage(data.peerToPeerPayee.contentId.value);

                    self.contentId(data.peerToPeerPayee.contentId.value);
                    self.payeeImageAvailable(true);
                }

                self.p2pData(data.peerToPeerPayee);
            });

            if (rootParams.dashboard.appData.segment !== "CORP") {
                P2PPayeeModel.getGroupDetails(self.payeeGroupId()).then(function(data) {
                    if (data.payeeGroup.contentId) {
                        groupLoadImage(data.payeeGroup.contentId.value);
                    }
                });
            }
        }

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        P2PPayeeModel.getPayeeMaintenance().then(function(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (rootParams.dashboard.appData.segment === "CORP") {
                self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            } else {
                self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            }

            if (self.imageUploadFlag()) {
                P2PPayeeModel.retrieveImageTypeSuuport().then(function(data) {
                    if (data) {
                        self.fileTypeArray(data.allowedImageMIMEType.split(","));
                        self.maxFileSize(data.maxSize);
                    }
                });
            }

            if (rootParams.rootModel.params && rootParams.rootModel.params.isEdit && self.imageUploadFlag()) {
                readPayeeAndGroupDetails();
            }
        });

        self.imageCallBackHandler = function(data) {
            if (data) {
                self.payeeImageAvailable(true);
            } else {
                self.imageUploadFlag(false);
                self.payeeImageAvailable(false);
                ko.tasks.runEarly();
                self.imageUploadFlag(true);
            }
        };

        let editPayeePayload;

        function updatePayeeDetails() {
            editPayeePayload = self.addPayee();

            if (editPayeePayload) {
                P2PPayeeModel.validateRequest(self.payeeId(), self.payeeGroupId(), ko.toJSON(editPayeePayload)).then(function() {
                    ko.utils.extend(self.p2pData(), ko.mapping.toJS(editPayeePayload));
                    self.stageOne(false);
                    self.stageTwo(true);
                });
            }
        }

        self.uploadImage = function() {
            if (self.file()) {
                const form = new FormData();

                form.append("file", self.file());
                form.append("isThumbnail", "true");
                form.append("moduleIdentifier", "PAYEE");
                form.append("isShared", "true");

                P2PPayeeModel.uploadImage(form).done(function(data) {
                    if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                        self.contentId(data.contentDTOList[0].contentId.value);

                        if (rootParams.rootModel.params && rootParams.rootModel.params.isEdit) {
                            updatePayeeDetails();
                        } else {
                            self.createPayeeGroup();
                        }
                    }
                });
            } else if (rootParams.rootModel.params && rootParams.rootModel.params.isEdit) {
                updatePayeeDetails();
            } else {
                self.createPayeeGroup();
            }
        };

        self.addPayee = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            if (self.p2pPayeeModel.transferValue().indexOf("@") > -1) {
                self.p2pPayeeModel.transferMode("EMAIL");
                self.payeeType("email");
            } else {
                self.p2pPayeeModel.transferMode("MOBILE");
                self.payeeType("mobile");
            }

            self.p2pPayeeModel.groupId(self.payeeGroupId());
            payload = ko.toJSON(self.p2pPayeeModel);

            if (rootParams.rootModel.params && rootParams.rootModel.params.isEdit) {
                return self.p2pPayeeModel;
            }

            P2PPayeeModel.addPayee(self.payeeGroupId(), self.type(), payload).done(function(data) {
                self.payeeId(data.peerToPeerPayee.id);

                P2PPayeeModel.getPayeeDetails(self.payeeId(), self.payeeGroupId(), self.type()).then(function(data) {
                    self.p2pData(data.peerToPeerPayee);

                    if (data.peerToPeerPayee.contentId) {
                        loadImage(data.peerToPeerPayee.contentId.value);
                    } else {
                        P2PPayeeModel.getGroupDetails(self.payeeGroupId()).then(function(response) {
                            if (response.payeeGroup.contentId) {
                                loadImage(response.payeeGroup.contentId.value);
                            }
                        });
                    }

                    self.stageOne(false);
                    self.stageTwo(true);
                });
            });
        };

        self.verifyPayee = function() {
            const currentServiceCall = !self.params.isEdit ? P2PPayeeModel.verifyPayee(self.payeeGroupId(), self.payeeId(), self.type()) : P2PPayeeModel.updatePayee(self.payeeGroupId(), self.payeeId(), self.type(), ko.toJSON(editPayeePayload));

            currentServiceCall.then(function(data, status) {
                self.httpStatus = data.getResponseStatus();
                self.baseURL = "payments/payeeGroup/" + self.payeeGroupId() + "/payees/" + self.type() + "/" + self.payeeId();
                self.stageTwo(false);

                if (data.tokenAvailable) {
                    self.stageThree(true);
                } else {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: data,
                        hostReferenceNumber: data.externalReferenceId,
                        transactionName: rootParams.dashboard.headerName(),
                        confirmScreenExtensions: {
                            taskCode: !rootParams.rootModel.params.isEdit ? "PC_N_CPTPP" : "PC_N_UPTPP"
                        },
                        template: "confirm-screen/payments-template"
                    });
                }
            });
        };

        self.cancelPayee = function() {
            self.stageOne(true);
            self.stageTwo(false);
        };

        self.cancel = function() {
            history.go(-1);
        };
    };
});