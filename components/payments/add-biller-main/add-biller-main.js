define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/add-biller-main",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function(ko, $, newBillerModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(newBillerModel.getNewModel());

                return KoModel;
            };

        self.catDes = ko.observable("");
        self.biller = getNewKoModel().addBillerModel;
        ko.utils.extend(self, Params.rootModel.previousState ? Params.rootModel.previousState.retainedData : Params.rootModel);
        self.data = ko.observable(Params.rootModel.params);

        self.billers = ResourceBundle.billers;
        self.common = ResourceBundle.common;
        self.validationTracker = Params.validator;
        Params.dashboard.headerName(self.billers.header);
        self.categoryList = ko.observableArray();
        self.isCategoriesLoaded = ko.observable(false);
        self.billerNames = ko.observableArray("");
        self.isbillerNamesLoaded = ko.observable(true);
        self.stageOne = ko.observable(false);
        self.stageTwo = ko.observable(false);
        self.validationTracker = ko.observable();
        self.responseStatus = ko.observable();
        self.stageTwoPointTwo = ko.observable(false);
        self.category = ko.observable();
        self.billerMap = {};
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.externalReferenceId = ko.observable();
        self.stageOneprevent = ko.observable(false);
        self.currentDate = ko.observable();
        self.confirmScreenDetails = ko.observable();
        self.forModification = !!self.data().transactionId;
        newBillerModel.init();

        Params.baseModel.registerElement([
            "confirm-screen",
            "account-input"
        ]);

        Params.baseModel.registerComponent("bill-payments", "payments");
        Params.baseModel.registerComponent("review-add-biller-main", "payments");

        self.getBillerDetails = function() {
            newBillerModel.getBillerDetails(self.data().data.billerDetails.billerId(), self.data().data.billerDetails.relationshipNumber()).done(function(data) {
                self.biller.categoryType(data.billerDetails.categoryType + "-" + data.billerDetails.categoryType);
                self.biller.billerId(data.billerDetails.billerId);
                self.biller.relationshipNumber(data.billerDetails.relationshipNumber);
                self.biller.consumerNumber(data.billerDetails.consumerNumber);
                self.biller.accountRelationshipNumber(data.billerDetails.accountRelationshipNumber);
                self.getCategories();
            });
        };

        self.getCategories = function() {
            newBillerModel.getCategories().done(function(data) {
                self.isCategoriesLoaded(false);
                self.categoryList.removeAll();

                for (let i = 0; i < data.billers.length; i++) {
                    if ($.grep(self.categoryList(), function(el) {
                            return el.text === data.billers[i].categoryType;
                        }).length === 0) {
                        self.categoryList.push({
                            text: data.billers[i].categoryType,
                            value: data.billers[i].categoryType
                        });
                    }
                }

                self.stageOne(true);
                self.isCategoriesLoaded(true);

                if (ko.utils.unwrapObservable(self.biller.categoryType)) {
                    self.biller.categoryType(self.biller.categoryType() + "-" + self.catDes());

                    self.getBillerNames({
                        detail: {
                            value: self.biller.categoryType()
                        }
                    });
                }
            });
        };

        self.getBillerNames = function(event) {
            if (self.forModification || event.detail.value) {
                self.forModification = false;
                self.stageOne(false);

                const categoryType = self.forModification ? self.biller.categoryType() : event.detail.value.split("-")[0];

                newBillerModel.getBillerNames(categoryType).done(function(data) {
                    self.billerNames.removeAll();
                    self.billerMap = {};

                    for (let i = 0; i < data.billers.length; i++) {
                        self.billerNames.push({
                            text: data.billers[i].description,
                            value: data.billers[i].id
                        });

                        self.billerMap[data.billers[i].id] = data.billers[i].description;
                    }

                    self.stageOne(true);

                    if (!self.stageOneprevent()) {
                        ko.tasks.runEarly();
                        self.stageOne(true);
                    }
                });
            }
        };

        if (self.forModification) {
            self.getBillerDetails();
        } else {
            self.getCategories();
        }

        self.registerBiller = function() {
            newBillerModel.getHostDate().done(function(data) {
                const dt = Params.baseModel.getDate(data.currentDate.valueDate);

                self.biller.registrationDate(dt.getFullYear() + "-" + (dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1) + "-" + (dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate()));
                self.addBiller();
            });
        };

        self.addBiller = function() {
            const addBillerTracker = document.getElementById("addBillerTracker");

            if (addBillerTracker) {
                if (!Params.baseModel.showComponentValidationErrors(addBillerTracker)) {
                    return;
                }
            }

            const catdescription = self.biller.categoryType();

            self.category(catdescription);
            self.biller.categoryType(catdescription.split("-")[0]);
            self.catDes(catdescription.split("-")[1]);
            self.biller.categoryType(self.biller.categoryType());
            self.biller.billerId(self.biller.billerId());

            const billerPayload = ko.toJSON(self.biller);

            newBillerModel.addNewBiller(billerPayload).done(function() {
                self.stageOneprevent(true);

                Params.dashboard.loadComponent("review-add-biller-main", {
                    reviewMode: true,
                    header: Params.dashboard.headerName(),
                    confirmBiller: self.confirmBiller,
                    billerDetails: {
                        billerId: self.biller.billerId,
                        relationshipNumber: self.biller.relationshipNumber,
                        confirmScreenDetails: self.confirmScreenDetails
                    },
                    retainedData: self
                });
            }).fail(function() {
                self.biller.categoryType(self.category());
            });
        };

        self.deleteBiller = function() {
            newBillerModel.deleteBiller(self.biller.billerId(), self.biller.relationshipNumber()).done(function() {
                self.biller.categoryType(self.category());
                history.go(-2);
            });
        };

        Params.baseModel.registerComponent("warning-message-dialog", "payee");

        self.cancel = function() {
            if (self.stageOne()) {
                Params.dashboard.switchModule(true);
            } else {
                self.biller.categoryType([self.biller.categoryType() + "-" + self.catDes()]);
                self.stageOne(true);
                self.stageTwo(false);
            }
        };

        self.confirmBiller = function() {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            newBillerModel.confirmNewBiller(self.data().transactionId, self.data().versionId, self.biller.billerId(), self.biller.relationshipNumber()).done(function(data, status, jqXHR) {
                self.baseURL = "payments/registeredBillers/" + self.biller.billerId() + "/relations/" + self.biller.relationshipNumber();
                self.externalReferenceId(data.externalReferenceId);

                if (data.tokenAvailable) {
                    self.stageTwo(false);
                } else {
                    self.stageOne(false);
                    self.stageTwo(false);
                    self.httpStatus = jqXHR.status;

                    let successMessage, statusMessages;

                    if (Params.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                        successMessage = self.common.confirmScreen.corpMaker;
                        statusMessages = self.billers.pendingApproval;
                    } else {
                        successMessage = self.billers.successMessage;
                        statusMessages = self.billers.sucessfull;
                    }

                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.billers.header,
                        hostReferenceNumber: data.externalReferenceId,
                        confirmScreenExtensions: {
                            successMessage: successMessage,
                            statusMessages: statusMessages,
                            isSet: true,
                            taskCode: "PC_N_PBR",
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/payments-template",
                            makePayment: self.makePayment
                        },
                        pay: true
                    });
                }
            });
        };

        self.paybillers = function() {
            history.back();
        };

        self.makePayment = function() {
            self.biller.autopopulate = true;

            if (Params.dashboard.appData.segment === "CORP") {
                Params.dashboard.loadComponent("bill-payments", self.biller);
            } else {
                self.selectedTab = "";
                self.biller.applicationType = "payments";
                self.biller.defaultTab = "bill-payments";
                Params.dashboard.loadComponent("manage-accounts", self.biller);
            }
        };
    };
});