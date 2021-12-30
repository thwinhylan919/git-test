define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "load!./content.json",
    "load!./template.json",
    "load!./pages.json",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/product",
    "../generic/product-generic",
    "ojs/ojknockout-validation"
], function(oj, ko, $, ProductService, contentJsonData, templateJsonData, pagesJsonData, constants, resourceBundle, ProductGeneric) {
    "use strict";

    return function(rootParams) {
        const self = this;
        let requirements;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.accordionNames = resourceBundle;
        self.dataLoaded = ko.observable(false);
        self.purposeDetail = ko.observable();
        self.previousPluginComponent = ko.observable();
        self.relations = ko.observableArray([]);
        self.coApplicantsRelation = ko.observableArray();
        self.displayModal = ko.observable(false);
        self.securityCodeModel = ko.observable(false);
        self.showFinancialDetails = ko.observable(true);
        self.productGroupSerialNumber = ko.observable();
        self.userType = "primary";
        self.submissionIdExists = ko.observable(false);
        self.accountId = ko.observable();
        self.appRefNo = ko.observable();
        self.applicationStatus = ko.observable();
        self.dealerDetailsPostErrorMsg = ko.observable();
        self.submissionErrorMessage = ko.observable("");
        self.isRequirementRequired = ko.observable(false);
        self.registrationCompulsory = ko.observable(false);
        self.isApplicationCancelled = ko.observable(false);
        self.documentsUploaded = ko.observableArray([]);
        self.ownerList = ko.observable(true);
        self.disableFinalSubmitButton = ko.observable(false);
        self.pageTitle = self.resource.pageTitle;
        self.host = constants.host;

        self.applicantDetails = ko.observable([{
            applicantRefId: "",
            applicantId: ko.observable({
                displayValue: "",
                value: ""
            }),
            applicantRelationshipType: "APPLICANT"
        }]);

        self.isVehicleDetailsSubmitted = ko.observable(false);
        self.vehicleDetails = ko.observable();
        self.todayIsoDate = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate());

        self.homePage = ko.observable(false);
        self.userProfile = ko.observable();
        self.userRoles = ko.observableArray();
        self.label = ko.observable();
        self.userLoggedIn = ko.observable();
        self.socialMediaResponse = ko.observable();
        self.applicationStartedFromDraft = false;
        self.componentName = ko.observable("product");
        rootParams.baseModel.registerComponent("tooltip", "home");
        self.dollar = String.fromCharCode(self.resource.generic.common.dollarAscii);

        self.productDetails = ko.observable({
            applicantList: ko.observableArray([]),
            baseCurrency: self.localCurrency,
            applicantDetailsFetched: ko.observable(false),
            sectionBeingEdited: ko.observable(),
            collabData: ko.observable({}),
            isUserAssociated: false,
            isRegistered: false,
            repaymentAmount: ko.observable()
        });

        self.productHeaderImage = ko.observable();
        self.tenure = ko.observable();
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerComponent("cancel-application", "origination");
        rootParams.baseModel.registerComponent("user-creation", "origination");
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerComponent("submission-confirmation", "origination");
        rootParams.baseModel.registerComponent("apply-online", "origination");
        self.label = self.productHeadingName;

        let sessionTransactionRefNumber, sessionStorageData;
        // eslint-disable-next-line no-storage/no-browser-storage
        const sessionStorageDataTemp = sessionStorage.sessionStorageData;

        // eslint-disable-next-line no-storage/no-browser-storage
        sessionStorage.removeItem("sessionStorageData");

        if (sessionStorageDataTemp) {
            sessionStorageData = JSON.parse(sessionStorageDataTemp);
        } else if (rootParams.rootModel.params && rootParams.rootModel.params.sessionStorageData) {
            sessionStorageData = rootParams.rootModel.params.sessionStorageData;
        } else {
            sessionStorageData = self.applicationArguments;
        }

        if (sessionStorageData.entity) {
            constants.currentEntity = sessionStorageData.entity;
            // eslint-disable-next-line no-storage/no-browser-storage
            sessionStorage.setItem("entity", sessionStorageData.entity);
        }

        if (sessionStorageData.transactionRefNumber) {
            sessionTransactionRefNumber = sessionStorageData.transactionRefNumber;
        }

        if (sessionStorageData.applicationStartedFromDraft) {
            self.productDetails().applicationStartedFromDraft = sessionStorageData.applicationStartedFromDraft;
        }

        if (sessionStorageData.productCode) {
            if (sessionStorageData.productCodeTD) {
                self.productDetails().productCodeTD = sessionStorageData.productCodeTD;
            }

            self.productDetails().productCode = sessionStorageData.productCode;
            self.productDetails().productDescription = sessionStorageData.productDescription;

            const sessionStorageOffers = sessionStorageData.offers;

            if (sessionStorageOffers) {
                self.productDetails().offers = JSON.parse(sessionStorageOffers);
                self.productDetails().selectedOfferId = self.productDetails().offers.offerId;

                if (sessionStorageData.offerCurrencies) {
                    self.productDetails().offerCurrencies = JSON.parse(sessionStorageData.offerCurrencies);
                }
            }

            if (sessionStorageData.minimumCreditLimit) {
                self.productDetails().minimumCreditLimit = JSON.parse(sessionStorageData.minimumCreditLimit);
            }

            if (sessionStorageData.productClassName === "LOANS") {
                self.productDetails().collateralRequired = sessionStorageData.collateralRequired;
                self.productDetails().productClassName = sessionStorageData.productClassName;
            }else {
                self.productDetails().productClassName = sessionStorageData.productClassName;
            }

            let productClass;

            switch (sessionStorageData.productClassName) {
                case "CREDIT_CARD":
                    productClass = "CC";
                    break;
                case "CASA":
                    productClass = sessionStorageData.productClassName;
                    break;
                case "TERM_DEPOSITS":
                    productClass = sessionStorageData.productClassName;
                    break;
                default:
                    break;
            }

            if (sessionStorageData.selectedOfferId) {
                self.productDetails().selectedOfferId = sessionStorageData.selectedOfferId;

                ProductService.fetchOffersAdditionalDetails(self.productDetails().selectedOfferId, productClass).then(function(data) {
                    if (data.offerDetailsDTO) {
                        self.productDetails().offers = data.offerDetailsDTO;
                        self.productDetails().offers.offerId = self.productDetails().selectedOfferId;
                    }

                    ProductService.listOffers(self.productDetails().productCode).then(function(data) {
                        let productIndex, offerIndex;

                        for (productIndex = 0; productIndex < data.products.length; productIndex++) {
                            if (data.products[productIndex].offers) {
                                for (offerIndex = 0; offerIndex < data.products[productIndex].offers.length; offerIndex++) {
                                    if (self.productDetails().selectedOfferId === data.products[productIndex].offers[offerIndex].offerId) {
                                        if (!self.productDetails().offers) {
                                            self.productDetails().offers = {};
                                            self.productDetails().offers.offerId = self.productDetails().selectedOfferId;
                                        }

                                        self.productDetails().offers.offerName = data.products[productIndex].offers[offerIndex].offerName;
                                    }
                                }
                            }
                        }
                    });
                });
            }

            if (sessionStorageData.productType) {
                self.productDetails().productType = sessionStorageData.productType;
                rootParams.baseModel.registerComponent("review", "origination");
            }

            let productType = self.productDetails().productClassName;

            if (self.productDetails().productType) {
                productType = self.productDetails().productType;
            }

            self.productHeaderImage = ko.observable(productType + "-product-bg");
        }

        self.modifyFlowStages = function(deleteCount, stages, stageId, stageName, insertStageId, obj) {
            let index, prvsIndex = 0;
            const stageLocation = deleteCount ? stageId : insertStageId;

            index = ko.utils.arrayFilter(stages, function(stage) {
                if (stage.id === stageLocation) {
                    return stage.sequenceNumber;
                }
            });

            index = index[0].sequenceNumber;

            if (deleteCount > 0) {
                stages.splice(index - 1, deleteCount);
                index--;
            } else {
                stages.splice(index, 0, JSON.parse(JSON.stringify(stages[index - 1])));
                $.extend(stages[index], obj);

                ko.utils.arrayForEach(stages, function(stage) {
                    if (prvsIndex === stage.sequenceNumber) {
                        stage.sequenceNumber++;
                        prvsIndex = stage.sequenceNumber;
                    } else if (index === stage.sequenceNumber) {
                        prvsIndex = index;
                    }
                });

                stages[index].id = stageId;
                stages[index].name = stageName;

                if (stages[index].nextStagename) {
                    stages[index + 1].previousStage = stages[index].id;
                }
            }

            stages[index].previousStage = stages[index - 1].id;
            stages[index - 1].nextStagename = stages[index].id;
        };

        self.createFlow = function() {
            const pageData = JSON.parse(JSON.stringify(pagesJsonData));

            self.flowPages = ko.observable(pageData);

            const contentData = JSON.parse(JSON.stringify(contentJsonData));

            self.flowContent = ko.observable(contentData);

            const flowData = JSON.parse(JSON.stringify(templateJsonData));

            self.flowTemplate = ko.observable(flowData);

            ProductService.fetchRequiredWorkflow(self.productDetails().productClassName, self.productDetails().productType).then(function(data) {
                self.requiredFlow = ko.observable(data);

                const SearchStage = function(key, array) {
                        for (let i = 0; i < array.length; i++) {
                            if (array[i].workflowId === key) {
                                return array[i];
                            }
                        }
                    },
                    SearchStageIndex = function(key, array) {
                        for (let i = 0; i < array.length; i++) {
                            if (array[i].workflowId === key) {
                                return i;
                            }
                        }
                    },
                    sortWorkflow = function(workflowStages) {
                        const applicationStages = ko.utils.arrayFilter(workflowStages, function(stage) {
                                if (stage.stepCategory === "APPLICATION") {
                                    return stage;
                                }
                            }),
                            applicantStages = ko.utils.arrayFilter(workflowStages, function(stage) {
                                if (stage.stepCategory === "APPLICANT") {
                                    return stage;
                                }
                            });

                        for (let a = 0; a < applicationStages.length; a++) {
                            workflowStages[a] = JSON.parse(JSON.stringify(applicationStages[a]));
                        }

                        for (let b = 0; b < applicantStages.length; b++) {
                            workflowStages[applicationStages.length + b] = JSON.parse(JSON.stringify(applicantStages[b]));
                        }

                        return workflowStages;
                    },
                    stagesNotForProspect = ["FUNDINF"];
                let insertPoint, applicationFormInsertPoint, stagesLength,
                    count = 1;

                for (let m = 0; m < data.workflows[0].head.steps.length; m++) {
                    const object1 = SearchStage(data.workflows[0].head.steps[m].id, self.flowPages().productStages);

                    if (self.flowTemplate().productDetails.productStages.length === 0) {
                        object1.sequenceNumber = 1;
                        self.flowTemplate().productDetails.productStages.push(object1);
                    } else {
                        object1.sequenceNumber = m + 1;

                        if (m > 0) {
                            self.modifyFlowStages(0, self.flowTemplate().productDetails.productStages, object1.id, object1.name, self.flowTemplate().productDetails.productStages[m - 1].id, object1);
                        }
                    }

                    applicationFormInsertPoint = m;
                }

                self.modifyFlowStages(0, self.flowTemplate().productDetails.productStages, self.flowPages().productStages[2].id, self.flowPages().productStages[2].name, self.flowTemplate().productDetails.productStages[self.flowTemplate().productDetails.productStages.length - 1].id, self.flowPages().productStages[2]);
                self.flowTemplate().productDetails.productStages[self.flowTemplate().productDetails.productStages.length - 1].sequenceNumber = self.flowTemplate().productDetails.productStages.length;

                const applicationFormIndex = SearchStageIndex("application-form", self.flowTemplate().productDetails.productStages);

                for (let k = 0; k < data.workflows[0].body.steps.length; k++) {
                    if (data.workflows[0].body.steps[k].id === "FLLAF" || data.workflows[0].body.steps[k].id === "UBSAF") {
                        insertPoint = SearchStageIndex("AF", self.flowTemplate().productDetails.productStages[applicationFormIndex].stages);
                    } else {
                        insertPoint = SearchStageIndex(data.workflows[0].body.steps[k].id, self.flowTemplate().productDetails.productStages[applicationFormIndex].stages);
                    }

                    if (!self.applicantDetails()[0].newApplicant) {
                        sortWorkflow(data.workflows[0].body.steps[k].steps);
                    }

                    for (let j = 0; j < data.workflows[0].body.steps[k].steps.length; j++) {
                        if (!(self.applicantDetails()[0].newApplicant && $.inArray(data.workflows[0].body.steps[k].steps[j].id, stagesNotForProspect) !== -1)) {
                            const object = SearchStage(data.workflows[0].body.steps[k].steps[j].id, self.flowContent().stages);

                            object.stepCategory = data.workflows[0].body.steps[k].steps[j].stepCategory;

                            if (self.flowTemplate().productDetails.productStages[applicationFormIndex].stages[insertPoint].stages.length === 0) {
                                object.sequenceNumber = 1;
                                self.flowTemplate().productDetails.productStages[applicationFormIndex].stages[insertPoint].stages.push(object);
                            } else {
                                object.sequenceNumber = ++count;
                                stagesLength = self.flowTemplate().productDetails.productStages[applicationFormIndex].stages[insertPoint].stages.length;
                                self.modifyFlowStages(0, self.flowTemplate().productDetails.productStages[applicationFormIndex].stages[insertPoint].stages, object.id, object.name, self.flowTemplate().productDetails.productStages[applicationFormIndex].stages[insertPoint].stages[stagesLength - 1].id, object);
                            }
                        }
                    }
                }

                for (let n = 0; n < data.workflows[0].tail.steps.length; n++) {
                    const object2 = SearchStage(data.workflows[0].tail.steps[n].id, self.flowPages().productStages);

                    object2.sequenceNumber = n + applicationFormInsertPoint + 2;
                    self.modifyFlowStages(0, self.flowTemplate().productDetails.productStages, object2.id, object2.name, self.flowTemplate().productDetails.productStages[self.flowTemplate().productDetails.productStages.length - 1].id, object2);
                }

                self.productFlowSuccessHandler(JSON.parse(JSON.stringify(self.flowTemplate())));
            });
        };

        self.productFlowSuccessHandler = function(data) {
            self.productDetails().productName = data.productDetails.productName;
            self.productDetails().productStages = data.productDetails.productStages;
            self.productDetails().currentStage = self.productDetails().productStages[0];

            for (let j = 0; j < self.productDetails().productStages.length; j++) {
                self.productDetails().productStages[j].module = "origination";
            }

            self.productComponentName(self.productDetails().productStages[0].id);
            self.productHeadingName(self.productDetails().productName);
            rootParams.baseModel.registerComponent(self.productDetails().productStages[0].id, self.productDetails().productStages[0].module);

            if (sessionStorageData.submissionId) {
                const len = self.productDetails().productStages.length;

                for (let i = 0; i < len; i++) {
                    if (self.productDetails().productStages[i].id === "application-form") {
                        self.productDetails().currentStage = self.productDetails().productStages[i];
                        self.setCurrentStage(0);
                        break;
                    }
                }
            }

            if (self.productDetails().requirements && parseInt(self.productDetails().requirements.noOfCoApplicants)) {
                self.fetchAdditionalFlow();
            }

            self.dataLoaded(true);
        };

        self.productSummarySuccessHandler = function(data) {
            if (!self.productDetails().requirements) {
                self.productDetails().requirements = {};
            }

            if (data.noOfCoapplicants || data.noOfCoapplicants === 0) {
                self.productDetails().requirements.noOfCoApplicants = data.noOfCoapplicants;
            }

            if (data.repaymentFrequency) {
                self.productDetails().requirements.frequency = ko.observable(data.repaymentFrequency);
            } else {
                self.productDetails().requirements.frequency = ko.observable();
            }

            if (data.tenure) {
                self.productDetails().requirements.requestedTenure = data.tenure;
                self.productDetails().requirements.requestedTenure.years = ko.observable(self.productDetails().requirements.requestedTenure.years);
                self.productDetails().requirements.requestedTenure.months = ko.observable(self.productDetails().requirements.requestedTenure.months);
            }

            if (data.loanApplicationAmount) {
                self.productDetails().requirements.requestedAmount = data.loanApplicationAmount;
                self.productDetails().requirements.requestedAmount.amount = ko.observable(self.productDetails().requirements.requestedAmount.amount);
            }

            if (data.productSubClass) {
                self.productHeaderImage(data.productSubClass + "-product-bg");
                self.productDetails().productType = data.productSubClass;
            }

            ProductService.fetchApplicants(self.productDetails().submissionId.value).then(function(data) {
                self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
                self.createFlow();
            });

            self.applicationStartedFromDraft = true;
        };

        self.getPreviousStage = function() {
            if (self.productDetails().sectionBeingEdited() === self.productDetails().currentStage.id) {
                self.productComponentName("review");
            } else {
                history.back();
                self.setCurrentStage(-1);
            }
        };

        ko.utils.extend(self, new ProductGeneric(self));

        const loanRequirementPayload = {
                requestedAmount: {
                    currency: self.localCurrency,
                    amount: ""
                },
                requestedTenure: {
                    days: 0,
                    months: 0,
                    years: 0
                },
                inPrincipalApproval: false,
                capitalizeFeesOpted: false,
                settlementRequired: false,
                purpose: {
                    code: ""
                },
                facilityId: "",
                purposeType: "",
                frequency: "MONTHLY",
                noOfCoApplicants: "0",
                productGroupCode: null,
                productGroupName: null,
                productGroupSerialNumber: "",
                productClass: null,
                productSubClass: null,
                productId: null,
                vehicleDetails: {
                    collateralId: "",
                    addedAsCollateral: true,
                    vehicleIdentificationNum: null,
                    vehicleMakeType: null,
                    vehicleModel: null,
                    vehicleSubType: "CAR",
                    vehicleType: "PASSENGER_VEHICLE",
                    vehicleYear: null,
                    vehicleNew: true,
                    registrationState: null,
                    distanceTravelled: null
                }
            },
            // eslint-disable-next-line no-storage/no-browser-storage
            entity = sessionStorage.entity,

            meCallback = function() {
                if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
                    self.userProfile(rootParams.dashboard.userData.userProfile);
                    self.userLoggedIn(true);
                    self.productDetails().isRegistered = true;
                    self.applicantDetails()[0].applicantId().value = self.userProfile().partyId.value;

                    if (self.queryMap && self.queryMap.regRefNo) {
                        self.productHeaderImage("my-applications");
                        self.productComponentName("row");
                        self.showPluginComponent("user-creation");
                        self.dataLoaded(true);

                        return;
                    }

                    if (sessionStorageData.submissionId) {
                        self.productDetails().submissionId = JSON.parse(sessionStorageData.submissionId);

                        if (sessionStorageData.requirements) {
                            requirements = JSON.parse(sessionStorageData.requirements);
                            self.productDetails().facilityId = requirements.facilityId;
                            self.productDetails().isUserAssociated = true;
                            self.productGroupSerialNumber(requirements.productGroupSerialNumber);
                            self.productDetails().requirements = {};

                            if (requirements.requestedAmount) {
                                self.productDetails().requirements.requestedAmount = {};
                                self.productDetails().requirements.requestedAmount.amount = ko.observable(requirements.requestedAmount.amount);
                            }

                            if (requirements.requestedTenure) {
                                self.productDetails().requirements.requestedTenure = {};
                                self.productDetails().requirements.requestedTenure.years = ko.observable(requirements.requestedTenure.years);
                                self.productDetails().requirements.requestedTenure.months = ko.observable(requirements.requestedTenure.months);
                            }
                        }

                        self.productDetails().typeApplication = sessionStorageData.typeApplication;
                        self.submissionIdExists(true);

                        ProductService.fetchProductSummary(self.productDetails().submissionId.value).then(function(data) {
                            self.productSummarySuccessHandler(data);
                        });
                    } else {
                        const isnewApplicant = true,
                            payloadSubmission = {
                                productGroupCode: self.productDetails().productCode,
                                productClass: self.productDetails().productClassName,
                                productSubClass: self.productDetails().productType
                            },
                            applicantPayload = {
                                applicantRelationshipType: "APPLICANT",
                                newApplicant: isnewApplicant,
                                applicantId: {
                                    value: self.userProfile().partyId.value
                                }
                            };

                        ProductService.fetchSubmissionList().then(function(data) {
                            const createSubmissionDeferred = $.Deferred();

                            if (data.submissions && data.submissions.length > 0) {
                                for (let i = 0; i < data.submissions.length; i++) {
                                    if (data.submissions[i].submitted && JSON.parse(data.submissions[i].submitted)) {
                                        applicantPayload.newApplicant = false;
                                        break;
                                    }
                                }

                                createSubmissionDeferred.resolve();
                            } else {
                                ProductService.fetchPartyDetails(self.userProfile().partyId.value).then(function(data) {
                                    if (data.party) {
                                        applicantPayload.newApplicant = false;
                                    }

                                    createSubmissionDeferred.resolve();
                                }, function() {
                                    createSubmissionDeferred.resolve();
                                });
                            }

                            createSubmissionDeferred.done(function() {
                                ProductService.createSubmission(payloadSubmission, entity).then(function(data) {
                                    self.productDetails().submissionId = data.submissionId;
                                    self.productGroupSerialNumber(data.products[0].productGroupSerialNumber);
                                    self.productDetails().facilityId = data.products[0].facilityId;

                                    if ((self.queryMap && self.queryMap.TransactionRefNumber) || sessionTransactionRefNumber) {
                                        const transactionRefNumber = self.queryMap.TransactionRefNumber ? self.queryMap.TransactionRefNumber : sessionTransactionRefNumber,
                                            dealerDetailsPostDeferred1 = $.Deferred();

                                        self.postDealerDetails(transactionRefNumber, dealerDetailsPostDeferred1).done(function() {
                                            ProductService.createApplicant(self.productDetails().submissionId.value, applicantPayload).then(function(data) {
                                                self.applicantDetails()[0].applicantId().displayValue = data.applicantId.displayValue;
                                                self.applicantDetails()[0].applicantId().value = data.applicantId.value;

                                                ProductService.fetchApplicants(self.productDetails().submissionId.value).then(function(data) {
                                                    self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
                                                    self.createFlow();
                                                });
                                            });
                                        });
                                    } else {
                                        ProductService.createApplicant(self.productDetails().submissionId.value, applicantPayload).then(function(data) {
                                            self.applicantDetails()[0].applicantId().displayValue = data.applicantId.displayValue;
                                            self.applicantDetails()[0].applicantId().value = data.applicantId.value;

                                            ProductService.fetchApplicants(self.productDetails().submissionId.value).then(function(data) {
                                                self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
                                                self.createFlow();
                                            });
                                        });
                                    }
                                }, function(data) {
                                    if (data.responseJSON.message && data.responseJSON.message.validationError && data.responseJSON.message.validationError[0]) {
                                        self.submissionErrorMessage(data.responseJSON.message.validationError[0].errorMessage);
                                        $("#createSubmissionError").trigger("openModal");
                                    }
                                });
                            });
                        });
                    }
                } else if (self.queryMap && self.queryMap.regRefNo) {
                    self.productHeaderImage("my-applications");
                    self.productComponentName("row");
                    self.showPluginComponent("user-creation");
                    self.dataLoaded(true);
                } else {
                    const payload = {
                            productGroupCode: self.productDetails().productCode,
                            productClass: self.productDetails().productClassName,
                            productSubClass: self.productDetails().productType
                        },
                        createApplicantPayload = {
                            applicantRelationshipType: "APPLICANT",
                            newApplicant: true
                        };

                    ProductService.createSubmission(payload, entity).then(function(data) {
                        self.productDetails().submissionId = data.submissionId;
                        self.productGroupSerialNumber(data.products[0].productGroupSerialNumber);
                        self.productDetails().facilityId = data.products[0].facilityId;

                        if (self.queryMap && self.queryMap.TransactionRefNumber) {
                            const transactionRefNumber = self.queryMap.TransactionRefNumber,
                                dealerDetailsPostDeferred2 = $.Deferred();

                            self.postDealerDetails(transactionRefNumber, dealerDetailsPostDeferred2).done(function() {
                                ProductService.createApplicant(self.productDetails().submissionId.value, createApplicantPayload).then(function(data) {
                                    self.applicantDetails()[0].applicantId().displayValue = data.applicantId.displayValue;
                                    self.applicantDetails()[0].applicantId().value = data.applicantId.value;

                                    ProductService.fetchApplicants(self.productDetails().submissionId.value).then(function(data) {
                                        self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
                                        self.createFlow();
                                    });
                                });
                            });
                        } else {
                            ProductService.createApplicant(self.productDetails().submissionId.value, createApplicantPayload).then(function(data) {
                                self.applicantDetails()[0].applicantId().displayValue = data.applicantId.displayValue;
                                self.applicantDetails()[0].applicantId().value = data.applicantId.value;

                                ProductService.fetchApplicants(self.productDetails().submissionId.value).then(function(data) {
                                    self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
                                    self.createFlow();
                                });
                            });
                        }
                    });
                }
            };

        ProductService.getMe().then(meCallback, meCallback);

        self.postDealerDetails = function(transactionRefNumber, deferred) {
            ProductService.getDealerVehicleDetails(transactionRefNumber).then(function(data) {
                loanRequirementPayload.productGroupCode = self.productDetails().productCode;
                loanRequirementPayload.productClass = self.productDetails().productClassName;
                loanRequirementPayload.productSubClass = self.productDetails().productType;
                loanRequirementPayload.purchasePrice = {};
                loanRequirementPayload.purchasePrice.amount = data.vehicleDetails.purchasePrice.amount;
                loanRequirementPayload.purchasePrice.currency = data.vehicleDetails.purchasePrice.currency;
                loanRequirementPayload.downpaymentAmount = {};
                loanRequirementPayload.downpaymentAmount.amount = data.vehicleDetails.downpaymentAmount.amount;
                loanRequirementPayload.downpaymentAmount.currency = data.vehicleDetails.downpaymentAmount.currency;
                loanRequirementPayload.requestedAmount.amount = parseInt(data.vehicleDetails.purchasePrice.amount) - parseInt(data.vehicleDetails.downpaymentAmount.amount);
                loanRequirementPayload.requestedAmount.currency = data.vehicleDetails.purchasePrice.currency;
                loanRequirementPayload.requestedTenure.years = data.vehicleDetails.loanTenure.years;
                loanRequirementPayload.requestedTenure.months = data.vehicleDetails.loanTenure.months;
                loanRequirementPayload.requestedTenure.days = data.vehicleDetails.loanTenure.days;
                loanRequirementPayload.vehicleDetails.vehicleModel = data.vehicleDetails.model;
                loanRequirementPayload.vehicleDetails.vehicleMakeType = data.vehicleDetails.make;
                loanRequirementPayload.vehicleDetails.vehicleYear = data.vehicleDetails.year;

                ProductService.submitRequirements(self.productDetails().submissionId.value, ko.mapping.toJSON(loanRequirementPayload, {
                    ignore: "temp_selectedValues"
                })).then(function() {
                    deferred.resolve();
                }, function(data) {
                    if (data.responseJSON.message && data.responseJSON.message.validationError && data.responseJSON.message.validationError.length > 0) {
                        self.dealerDetailsPostErrorMsg(data.responseJSON.message.validationError[0].errorMessage);
                        $("#dealerDetailsPostError").trigger("openModal");
                    }
                });
            });

            return deferred;
        };

        document.body.style.backgroundImage = "url(" + constants.imageResourcePath + "/origination/BG" + (rootParams.baseModel.medium() ? "/medium/" : "/") + self.productHeaderImage() + ".jpg)";

        self.hidePluginComponent = function() {
            self.productflowComponent(true);
        };

        self.closeModalAndGoToHomePage = function(selector) {

            rootParams.baseModel.registerComponent("apply-online", "origination");
            rootParams.baseModel.modalInteraction(selector, "closeModal", null);

            if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
                rootParams.dashboard.loadComponent("apply-online", self);
            } else {
                rootParams.dashboard.switchModule("home");
            }
        };
    };
});