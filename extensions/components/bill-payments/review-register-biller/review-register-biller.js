define([

    "knockout",

    "./model",
    "ojL10n!resources/nls/register-biller",
    "ojL10n!extensions/resources/nls/biller-labels",
    "ojs/ojbutton",
    "ojs/ojknockout"
], function(ko, ReviewBillerRegistrationModel, resourceBundle, billerLabels) {
    "use strict";

    return function(params) {
        const self = this;

        self.mode = ko.observable();
        self.updateBiller = ko.observable(false);
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.billerLabelsResource = billerLabels;
        params.baseModel.registerElement("help");
        params.baseModel.registerComponent("manage-bill-payments", "bill-payments");
        params.baseModel.registerComponent("register-biller", "bill-payments");
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.resourceBundle.messages.review;
        self.reviewTransactionName.reviewHeader = self.resourceBundle.messages.reviewMsg;
        self.reviewUpdateTransactionName = [];
        self.reviewUpdateTransactionName.header = self.resourceBundle.messages.review;
        self.reviewUpdateTransactionName.reviewHeader = self.resourceBundle.messages.reviewUpdateMsg;

        let confirmScreenDetailsArray;

        if (params.mode) {
            self.mode(params.mode);
        } else if (self.params.mode) {
            self.mode(self.params.mode);
        }

        self.fillconfirmScreenExtension = function() {
            confirmScreenDetailsArray = [
                [{
                        label: self.resourceBundle.labels.billerName,
                        value: self.dropdownLabels.biller()
                    },
                    {
                        label: self.resourceBundle.labels.billerNickname,
                        value: self.registerBillerDetails.billerNickName ? self.registerBillerDetails.billerNickName : self.nickname()
                    }
                ]
            ];

            if (self.registerBillerDetails.autopay && self.registerBillerDetails.autopay.toString() === "true") {
                confirmScreenDetailsArray.push([{
                        label: self.resourceBundle.labels.billerCategory,
                        value: self.dropdownLabels.category()
                    },
                    {
                        label: self.resourceBundle.labels.autoPay,
                        value: self.resourceBundle.labels.yes
                    }
                ]);
            } else if (self.registerBillerDetails.schedulePayment && self.registerBillerDetails.schedulePayment.toString() === "true") {
                confirmScreenDetailsArray.push([{
                        label: self.resourceBundle.labels.billerCategory,
                        value: self.dropdownLabels.category()
                    },
                    {
                        label: self.resourceBundle.labels.scheduledPay,
                        value: self.resourceBundle.labels.yes
                    }
                ]);
            } else {
                confirmScreenDetailsArray.push([{
                    label: self.resourceBundle.labels.billerCategory,
                    value: self.dropdownLabels.category()
                }]);
            }

            if (typeof self.confirmScreenDetails === "function") { self.confirmScreenDetails(confirmScreenDetailsArray); }
        };

        /**
         *  This function will allow the user to approve the register biller when the user is either a Approver.
         *
         *  @memberOf review-register-biller
         *  @returns {void}
         */
        self.detailsForApprover = function() {
            if (self.confirmScreenExtensions) {
                ko.utils.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    taskCode: self.registerBillerDetails.category ? "EB_M_CBR" : "EB_M_UBR",
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    template: "confirm-screen/bill-payments"
                });
            }
        };

        if (params.registerBillerDetails) {
            self.registerBillerDetails = params.registerBillerDetails;

            if (params.modifiedBillerDetails) {
                ko.utils.extend(self.registerBillerDetails, params.modifiedBillerDetails);
                self.updateBiller(true);
            }
        } else if (self.params && self.params.registerBillerDetails) {
            self.registerBillerDetails = self.params.registerBillerDetails;
        } else if (self.params && self.mode() === "approval" && self.params.data) {
            self.approvalBillerType = ko.observable();
            self.customerName = ko.observable();
            self.nickname = ko.observable();
            self.registerBillerDetails = ko.mapping.toJS(self.params.data);
        }

        if (self.mode() !== "REVIEW") {
            self.updateBiller(true);
            self.relationshipDetails = ko.observableArray([]);

            self.dropdownLabels = {
                category: ko.observable(),
                location: ko.observable(),
                biller: ko.observable(),
                currentAccountType: ko.observable()
            };

            if (self.mode() === "approval" && self.registerBillerDetails.autopayInstructions) {
                self.dropdownLabels.currentAccountType(self.registerBillerDetails.autopayInstructions.paymentType);

                if (!self.registerBillerDetails.category) {
                    Promise.all([ReviewBillerRegistrationModel.fetchRegisteredBillerDetails(self.registerBillerDetails.billerRegistrationId)])
                        .then(function(data) {
                            self.customerName(data[0].billerRegistration.customerName);

                            const billerID = data[0].billerRegistration.billerId;

                            ReviewBillerRegistrationModel.fetchBillerDetails(billerID).done(function(datas) {
                                self.dropdownLabels.category(datas.biller.areaCategoryDetails[0].categoryName);
                                self.dropdownLabels.location(datas.biller.areaCategoryDetails[0].operationalAreaName);
                                self.dropdownLabels.biller(datas.biller.name);

                                let i;
                                const specsArray = [];

                                for (i = 0; i < datas.biller.specifications.length; i++) {
                                    specsArray[datas.biller.specifications[i].id] = datas.biller.specifications[i];
                                }

                                for (i = 0; i < data[0].billerRegistration.relationshipDetails.length; i++) {
                                    self.relationshipDetails.push({
                                        label: specsArray[data[0].billerRegistration.relationshipDetails[i].labelId].label,
                                        dataType: specsArray[data[0].billerRegistration.relationshipDetails[i].labelId].dataType,
                                        value: data[0].billerRegistration.relationshipDetails[i].value
                                    });
                                }

                                self.approvalBillerType(datas.biller.type);
                                self.fillconfirmScreenExtension();
                                self.detailsForApprover();
                            });
                        });
                } else {
                    self.approvalBillerType(self.registerBillerDetails.billerType);
                }
            } else if (self.mode() === "approval" && !self.registerBillerDetails.autopayInstructions) {
                if (!self.registerBillerDetails.category) {
                    Promise.all([ReviewBillerRegistrationModel.fetchRegisteredBillerDetails(self.registerBillerDetails.id)])
                        .then(function(data) {
                            self.customerName(data[0].billerRegistration.customerName);
                            self.nickname(data[0].billerRegistration.billerNickName);

                            const billerID = data[0].billerRegistration.billerId;

                            ReviewBillerRegistrationModel.fetchBillerDetails(billerID).done(function(datas) {
                                self.dropdownLabels.category(datas.biller.areaCategoryDetails[0].categoryName);
                                self.dropdownLabels.location(datas.biller.areaCategoryDetails[0].operationalAreaName);
                                self.dropdownLabels.biller(datas.biller.name);

                                let i;
                                const specsArray = [];

                                for (i = 0; i < datas.biller.specifications.length; i++) {
                                    specsArray[datas.biller.specifications[i].id] = datas.biller.specifications[i];
                                }

                                for (i = 0; i < data[0].billerRegistration.relationshipDetails.length; i++) {
                                    self.relationshipDetails.push({
                                        label: specsArray[data[0].billerRegistration.relationshipDetails[i].labelId].label,
                                        dataType: specsArray[data[0].billerRegistration.relationshipDetails[i].labelId].dataType,
                                        value: data[0].billerRegistration.relationshipDetails[i].value
                                    });
                                }

                                self.approvalBillerType(datas.biller.type);
                                self.fillconfirmScreenExtension();
                                self.detailsForApprover();
                            });
                        });
                }
            }

            if (self.registerBillerDetails.autopay) {
                if (self.registerBillerDetails.autopayInstructions.limitAmount && self.registerBillerDetails.autopayInstructions.limitAmount.amount > 0) {
                    self.autoPayLimit = ko.observable("limitAmount");
                } else {
                    self.autoPayLimit = ko.observable("billAmount");
                }
            }

            if (self.registerBillerDetails.category) {
                ReviewBillerRegistrationModel.fetchCategory(self.registerBillerDetails.category.id).done(function(data) {
                    self.dropdownLabels.category(data.category.name);
                });

                ReviewBillerRegistrationModel.fetchLocationDetails(self.registerBillerDetails.location.id).done(function(response) {
                    let location = null;
                    const data = response.operationalArea;

                    if (!data.areaName) {
                        location = data.city;

                        if (data.state) {
                            if (location.length > 0) {
                                location = params.baseModel.format(self.resourceBundle.labels.location, {
                                    location: location
                                });
                            }

                            location = location + data.state;
                        }

                        if (data.country) {
                            if (location.length > 0) {
                                location = params.baseModel.format(self.resourceBundle.labels.location, {
                                    location: location
                                });
                            }

                            location = location + data.country;
                        }
                    } else {
                        location = data.areaName;
                    }

                    self.dropdownLabels.location(location);
                });

                ReviewBillerRegistrationModel.fetchBillerDetails(self.registerBillerDetails.billerId).done(function(response) {
                    self.dropdownLabels.biller(response.biller.name);

                    let i;
                    const specsArray = [];

                    for (i = 0; i < response.biller.specifications.length; i++) {
                        specsArray[response.biller.specifications[i].id] = response.biller.specifications[i];
                    }

                    for (i = 0; i < self.registerBillerDetails.relationshipDetails.length; i++) {
                        self.relationshipDetails.push({
                            label: specsArray[self.registerBillerDetails.relationshipDetails[i].labelId].label,
                            dataType: specsArray[self.registerBillerDetails.relationshipDetails[i].labelId].dataType,
                            value: self.registerBillerDetails.relationshipDetails[i].value
                        });
                    }

                    if (self.mode() === "approval" && self.registerBillerDetails.category) {
                        self.fillconfirmScreenExtension();
                        self.detailsForApprover();
                    }
                });
            }

            if (self.mode() !== "approval") {
                params.dashboard.headerName(self.resourceBundle.heading.billerDetails);
            }
        } else {
            if (self.updateBiller()) {
                params.dashboard.headerName(self.resourceBundle.heading.manageBillers);
            } else {
                params.dashboard.headerName(self.resourceBundle.heading.addBiller);
            }

            params.baseModel.registerElement("confirm-screen");
        }

        /**
         * This function redirects to the confirmation screen.
         *
         * @function loadConfirmationScreen
         * @param {Object} jqXhr - Response object.
         * @param {string} transactionName - Name of the transaction.
         * @param {Object} taskCode - Task code of the current transaction.
         * @param {Object} successMessage - Success message to be displayed.
         * @param {arrayList} statusMessages - Transaction status messages.
         * @param {arrayList} confirmScreenDetailsArray - Additional details to be displayed on confirm screen.
         * @returns {void}
         */
        function loadConfirmationScreen(jqXhr, transactionName, taskCode, successMessage, statusMessages, confirmScreenDetailsArray) {
            params.dashboard.loadComponent("confirm-screen", {
                jqXHR: jqXhr,
                transactionName: transactionName,
                confirmScreenExtensions: {
                    successMessage: successMessage,
                    statusMessages: statusMessages,
                    taskCode: taskCode,
                    isSet: true,
                    confirmScreenDetails: confirmScreenDetailsArray,
                    template: "confirm-screen/bill-payments"
                }
            }, self);
        }

        self.confirm = function() {
            let successMessage, statusMessages, transactionName;

            confirmScreenDetailsArray = [
                [{
                        label: self.resourceBundle.labels.billerName,
                        value: self.dropdownLabels.biller()
                    },
                    {
                        label: self.resourceBundle.labels.billerNickname,
                        value: self.registerBillerDetails.billerNickName
                    }
                ]
            ];

            if (self.registerBillerDetails.autopay === "true") {
                confirmScreenDetailsArray.push([{
                        label: self.resourceBundle.labels.billerCategory,
                        value: self.dropdownLabels.category()
                    },
                    {
                        label: self.resourceBundle.labels.autoPay,
                        value: self.resourceBundle.labels.yes
                    }
                ]);
            } else if (self.registerBillerDetails.schedulePayment === "true") {
                confirmScreenDetailsArray.push([{
                        label: self.resourceBundle.labels.billerCategory,
                        value: self.dropdownLabels.category()
                    },
                    {
                        label: self.resourceBundle.labels.scheduledPay,
                        value: self.resourceBundle.labels.yes
                    }
                ]);
            } else {
                confirmScreenDetailsArray.push([{
                    label: self.resourceBundle.labels.billerCategory,
                    value: self.dropdownLabels.category()
                }]);
            }

            if (params.modifiedBillerDetails) {
                ReviewBillerRegistrationModel.updateBiller(params.modifiedBillerDetails.billerRegistrationId, ko.mapping.toJSON(params.modifiedBillerDetails)).done(function(data, status, jqXhr) {
                    if (params.dashboard.appData.segment === "CORP" && jqXhr.status && jqXhr.status === 202) {
                        successMessage = self.resourceBundle.messages.corpMaker;
                        statusMessages = self.resourceBundle.messages.pendingApproval;
                    } else {
                        successMessage = self.resourceBundle.messages.updateSuccessMessage;
                        statusMessages = self.resourceBundle.messages.sucessfull;
                    }

                    transactionName = self.resourceBundle.heading.updteBiller;
                    loadConfirmationScreen(jqXhr, transactionName, "EB_M_UBR", successMessage, statusMessages, confirmScreenDetailsArray);
                });
            } else {
                ReviewBillerRegistrationModel.registerBiller(ko.mapping.toJSON(params.registerBillerDetails)).done(function(data, status, jqXhr) {
                    if (params.dashboard.appData.segment === "CORP" && jqXhr.status && jqXhr.status === 202) {
                        successMessage = self.resourceBundle.messages.corpMaker;
                        statusMessages = self.resourceBundle.messages.pendingApproval;
                    } else {
                        successMessage = self.resourceBundle.messages.addSuccessMessage;
                        statusMessages = self.resourceBundle.messages.sucessfull;
                    }

                    transactionName = self.resourceBundle.heading.addBiller;
                    loadConfirmationScreen(jqXhr, transactionName, "EB_M_CBR", successMessage, statusMessages, confirmScreenDetailsArray);
                });
            }
        };

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") { return self.resourceBundle.common.confirmScreen.approvalMessages.FAILED.successmsg; } else if (jqXHR.responseJSON.transactionAction) { return self.resourceBundle.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg; }
        };

        self.goBack = function() {
            params.dashboard.headerName(self.resourceBundle.heading.bills);
            self.currentStage("LIST");
        };

        self.editBiller = function() {
            self.currentStage("CREATE");
        };
    };
});