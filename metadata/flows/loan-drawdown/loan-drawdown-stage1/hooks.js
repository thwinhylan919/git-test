define([
    "./model",
    "knockout",
    "jquery"
], function (Model, ko, $) {
    "use strict";

    return function () {
        let self;

                function liabilitiesgetCall(partyId, payload, config) {
            return Model.liabilitiesget(partyId, payload, config);
        }

                function liabilitiesliabilityIdfacilitiesgetCall(partyId, branchCode, currencyCode, liabilityId, payload, config) {
            return Model.liabilitiesliabilityIdfacilitiesget(partyId, branchCode, currencyCode, liabilityId, payload, config);
        }

                function productsloangetCall(payload, config) {
            return Model.productsloanget(payload, config);
        }

                function processManagementpostCall(payload, config) {
            return Model.processManagementpost(payload, config);
        }

                function purposesmoduleTypegetCall(moduleType, payload, config) {
            return Model.purposesmoduleTypeget(moduleType, payload, config);
        }

                function liabilitiesliabilityIdfacilitiesIdgetCall(Id, liabilityId, payload, config) {
            return Model.liabilitiesliabilityIdfacilitiesIdget(Id, liabilityId, payload, config);
        }

                function onClickChangeFacility16() {
            self.loadFacilityChangeDetails();
        }

        function init(bindingContext, _rootParams) {
            self = bindingContext;
            self.facilityDetails = ko.observable(self.getStageState("loan-drawdown-stage1") ? self.getStageState("loan-drawdown-stage1").facilityDetails : _rootParams.rootModel && _rootParams.rootModel.facilityDetails ? _rootParams.rootModel.facilityDetails : null);
            self.dataLoaded = ko.observable(true);
            self.facilityId = ko.observable();
            self.index = ko.observable();
            self.selectedFacility = ko.observable();
            self.liabilityliabilityIdfacilitygetVar = ko.observable();
            self.tenureMonths = ko.observableArray();
            self.liabilityId = ko.observable();
            self.result = ko.observable();
            self.openModal = ko.observable(false);
            self.refId = ko.observable();

            Model.liabilitiesget(self.liabilitiesliabilityIdfacilitiesgetpartyId()).then(function (response) {
                self.liabilityId(response.liabilitydtos[0].id);
            });

            self.month = ko.observable(self.getStageState("loan-drawdown-stage1") ? self.getStageState("loan-drawdown-stage1").month : null);
            self.year = ko.observable(self.getStageState("loan-drawdown-stage1") ? self.getStageState("loan-drawdown-stage1").year : null);

            if (self.getStageState("loan-drawdown-stage1") && self.getStageState("loan-drawdown-stage1").payload) {
                self.payload = ko.mapping.fromJS(self.getStageState("loan-drawdown-stage1").payload);
            } else if (_rootParams.rootModel && _rootParams.rootModel.payload) {
                self.refId(_rootParams.rootModel.refId ? _rootParams.rootModel.refId : null);
                self.payload = ko.mapping.fromJS(_rootParams.rootModel.payload);
                self.year(Math.floor(_rootParams.rootModel.payload.loanRequirements.tenure / 12));
                self.month(_rootParams.rootModel.payload.loanRequirements.tenure % 12);
            }

            _rootParams.baseModel.registerComponent("loan-application-listing", "process-management");
            _rootParams.baseModel.registerElement("confirm-screen");

            self.calculateProgress = function () {
                self.result = ko.observable(Math.round(self.facilityDetails().utilizedAmount.amount / self.facilityDetails().effectiveAmount.amount * 100 * 100) / 100);
            };

            purposesmoduleTypegetCall("LN").then(function (response) {
                self.purposesmoduleTypegetVar(response.purposeList);
            });

            productsloangetCall().then(function (response) {
                self.productsloangetVar(response.loanAccountDetails);
            });

            self.currencyParser = function (data) {
                const output = {};

                output.currencies = [];

                if (data) {
                    if (data.currencyList && data.currencyList !== null) {
                        for (let i = 0; i < data.currencyList.length; i++) {
                            output.currencies.push({
                                code: data.currencyList[i].code,
                                description: data.currencyList[i].code
                            });
                        }
                    }
                }

                return output;
            };

            for (let m = 0; m <= 11; m++) {
                self.tenureMonths.push({
                    displayValue: m.toString(),
                    value: m
                });
            }

            self.loadFacilityChangeDetails = function () {
                Model.liabilitiesget(self.liabilitiesliabilityIdfacilitiesgetpartyId()).then(function (response) {
                    Model.liabilitiesliabilityIdfacilitiesget(response.liabilitydtos[0].partyId, response.liabilitydtos[0].branch, "INR", response.liabilitydtos[0].id).then(function (response) {
                        self.liabilityliabilityIdfacilitygetVar(response);

                        let i;

                        for (i = 0; i < self.liabilityliabilityIdfacilitygetVar().facilitydtos.length; i++) {
                            self.liabilityliabilityIdfacilitygetVar().facilitydtos[i].lineCodeNew = self.liabilityliabilityIdfacilitygetVar().facilitydtos[i].lineCode + "_" + self.liabilityliabilityIdfacilitygetVar().facilitydtos[i].lineSerialNumber;
                        }

                        self.facilityId(self.liabilityliabilityIdfacilitygetVar().facilitydtos[0].lineCodeNew);
                        self.selectedFacility(self.liabilityliabilityIdfacilitygetVar().facilitydtos[0]);
                        $("#chooseFacility").trigger("openModal");
                    });
                });
            };

            self.facilityChangeHandler = function () {
                self.selectedFacility(ko.utils.arrayFirst(self.liabilityliabilityIdfacilitygetVar().facilitydtos, function (element) {
                    return element.lineCodeNew === self.facilityId();
                }));
            };

            self.proceed = function () {
                self.facilityDetails(self.selectedFacility());
                self.calculateProgress();
                $("#chooseFacility").hide();
                self.openModal(false);
            };

            self.cancel = function () {
                $("#chooseFacility").trigger("closeModal");
                self.openModal(false);
            };

            if (_rootParams.rootModel && (_rootParams.rootModel.facilityDetails || _rootParams.rootModel.payload)) {
                if (_rootParams.rootModel.payload) {
                    self.openModal = ko.observable(false);

                    liabilitiesliabilityIdfacilitiesIdgetCall(_rootParams.rootModel.payload.applicationDetails.facilityDTO[0].liabilityId, _rootParams.rootModel.payload.applicationDetails.facilityDTO[0].id).then(function (response) {
                        self.facilityDetails(response.facilityDTO);
                        self.facilityDetails().lineCodeNew = self.facilityDetails().lineCode + "_" + self.facilityDetails().lineSerialNumber;
                        self.calculateProgress();
                    });
                } else {
                    self.openModal(false);
                    self.calculateProgress();
                }
            } else if (!self.payload.applicationDetails.facilityDTO().length) {
                self.openModal(true);
            }

            self.pageRendered = function () {
                if (!(_rootParams.rootModel && (_rootParams.rootModel.facilityDetails || _rootParams.rootModel.payload))) {
                    if (!self.payload.applicationDetails.facilityDTO().length) {
                        self.loadFacilityChangeDetails();
                    }
                }
            };

            self.setPayloadData = function () {
                const tenure = parseInt(self.year()) * 12;

                self.payload.loanRequirements.tenure(self.month() + tenure);
            };

            self.getConfirmScreenDraftMessage = function () {
                return self.nls.draftSuccessMessage;
            };

            self.saveDraftData = function () {
                if (!_rootParams.baseModel.showComponentValidationErrors(document.getElementById("draftTracker"))) {
                    return false;
                }

                self.setPayloadData();
                self.processManagementpostv1payload = Model.getNewModel().processManagementpostv1payload;
                self.processManagementpostv1payload.payload = {};

                self.payload.applicationDetails.facilityDTO = [{
                        id: self.liabilityId(),
                        liabilityId: self.facilityDetails().lineCodeNew
                    }];

                self.processManagementpostv1payload.payload.json = ko.mapping.toJS(self.payload);
                self.processManagementpostv1payload.payload.typeOf = "GenericAppicationDetailsDTO";
                self.processManagementpostv1payload.moduleId = "OBCLPM";
                self.processManagementpostv1payload.draftName = self.draftName();
                self.processManagementpostv1payload.partyId = self.facilityDetails().partyId;
                self.processManagementpostv1payload.type = "Loan Drawdown";
                self.processManagementpostv1payload.status = "DRAFT";

                processManagementpostCall(ko.toJSON(self.processManagementpostv1payload)).then(function (response) {
                    _rootParams.dashboard.loadComponent("confirm-screen", {
                        transactionResponse: response,
                        transactionName: self.nls.componentHeader,
                        confirmScreenExtensions: {
                            isSet: true,
                            confirmScreenMsgEval: self.getConfirmScreenDraftMessage,
                            template: "confirm-screen/loan-drawdown-template"
                        },
                        draftReference: {
                            label: self.nls.referenceNumber,
                            number: response.processManagementDTO.refId ? response.processManagementDTO.refId : null
                        },
                        resource: self.nls
                    });
                });
            };

            self.draftName = ko.observable();

            self.openDraftModal = function () {
                $("#saveDraft").trigger("openModal");
            };

            self.closeHandler = function () {
                $("#saveDraft").trigger("closeModal");
                self.draftName("");
            };

            return true;
        }

        return {
            liabilitiesgetCall: liabilitiesgetCall,
            liabilitiesliabilityIdfacilitiesgetCall: liabilitiesliabilityIdfacilitiesgetCall,
            productsloangetCall: productsloangetCall,
            processManagementpostCall: processManagementpostCall,
            purposesmoduleTypegetCall: purposesmoduleTypegetCall,
            liabilitiesliabilityIdfacilitiesIdgetCall: liabilitiesliabilityIdfacilitiesIdgetCall,
            onClickChangeFacility16: onClickChangeFacility16,
            init: init
        };
    };
});