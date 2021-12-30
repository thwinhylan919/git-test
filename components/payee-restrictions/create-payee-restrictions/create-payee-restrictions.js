/**
  * create-payee-restrictions.
  *
  * @module payee-restrictions
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} payeeCountLimitModel
  * @requires {object} ResourceBundle
  */
define([
        "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/create-payee-restrictions",
    "promise",
    "ojs/ojinputnumber",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function(ko, $, payeeCountLimitModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(payeeCountLimitModel.getNewModel());

                return KoModel;
            };

        Params.baseModel.registerComponent("review-create-payee-restrictions", "payee-restrictions");
        self.targetType =ko.observable();
        self.targetValue = ko.observable();
        self.enterpriseRole =ko.observable();
        self.segmentSelectedForRole=ko.observable();
        self.payeeRestrictionModel = getNewKoModel().payeeRestrictionModel;
        ko.utils.extend(self, Params.rootModel.previousState ? ko.mapping.fromJS(Params.rootModel.previousState) : Params.rootModel);

        if(self.params && self.params.targetType){
        self.targetType(self.params.targetType);
        self.targetValue(self.params.targetValue);
        self.enterpriseRole(self.params.enterpriseRole);
        self.segmentSelectedForRole(self.params.segmentSelectedForRole);
        }

        self.resource = ResourceBundle;
        Params.dashboard.headerName(self.resource.payeeCount.title);

        const payeeTypeList = ["ALL", "INTERNAL", "DOMESTIC", "INTERNATIONAL"],
            ukDomesticAccountType = ["UKDOMESTICFASTER", "UKDOMESTICNONFASTER"],
            sepaDomesticAccountType = ["SEPADOMESTICCARDTRANSFER", "SEPADOMESTICCREDITTRANSFER"];
        let region = "";

        self.payeeLimitStatus = [{
                id: true,
                label: self.resource.generic.common.yes
            },
            {
                id: false,
                label: self.resource.generic.common.no
            }
        ];

        /**
      * This function is used to create payee count limit payload.
         *
      * @memberOf payee-restrictions
      * @function createPayeeCountLimit
      * @returns {void}
      */
        function createPayeeCountLimit() {
            payeeCountLimitModel.fetchBankConfiguration().then(function(data) {
                region = data.bankConfigurationDTO.region;

                for (let i = 0; i < payeeTypeList.length; i++) {
                    switch (payeeTypeList[i]) {
                        case "ALL":
                        case "INTERNAL":
                            self.payeeTypeData = getNewKoModel().payeeTypeData;
                            self.updateAccountElement = getNewKoModel().updateElement;
                            self.updateAccountElement.entityDTO.type(self.targetType());
                            self.updateAccountElement.entityDTO.value(self.targetValue());
                            self.updateAccountElement.payeeType(payeeTypeList[i]);
                            self.updateAccountElement.payeesPerDay(0);
                            self.updateAccountElement.payeeCountLimitStatus(false);
                            self.payeeTypeData.accountPayee.push(self.updateAccountElement);
                            self.payeeTypeData.draftpayee = ko.observableArray([]);
                            self.payeeTypeData.payeeType(payeeTypeList[i]);
                            self.payeeRestrictionModel.payeeCountLimitList.push(self.payeeTypeData);
                            break;
                        case "DOMESTIC":
                            self.payeeTypeData = getNewKoModel().payeeTypeData;
                            self.payeeTypeData.payeeType(payeeTypeList[i]);
                            self.updateDraftElement = getNewKoModel().updateElement;
                            self.updateDraftElement.entityDTO.type(self.targetType());
                            self.updateDraftElement.entityDTO.value(self.targetValue());
                            self.updateDraftElement.payeeType("DOMESTICDEMANDDRAFT");
                            self.updateDraftElement.payeesPerDay(0);
                            self.updateDraftElement.payeeCountLimitStatus(false);
                            self.payeeTypeData.draftpayee.push(self.updateDraftElement);

                            if (region === "INDIA") {
                                self.updateAccountElement = getNewKoModel().updateElement;
                                self.updateAccountElement.entityDTO.type(self.targetType());
                                self.updateAccountElement.entityDTO.value(self.targetValue());
                                self.updateAccountElement.payeeType("INDIADOMESTIC");
                                self.updateAccountElement.payeesPerDay(0);
                                self.updateAccountElement.payeeCountLimitStatus(false);
                                self.payeeTypeData.accountPayee.push(self.updateAccountElement);
                            } else if (region === "UK") {
                                for (let j = 0; j < ukDomesticAccountType.length; j++) {
                                    self.updateAccountElement = getNewKoModel().updateElement;
                                    self.updateAccountElement.entityDTO.type(self.targetType());
                                    self.updateAccountElement.entityDTO.value(self.targetValue());
                                    self.updateAccountElement.payeeType(ukDomesticAccountType[j]);
                                    self.updateAccountElement.payeesPerDay(0);
                                    self.updateAccountElement.payeeCountLimitStatus(false);
                                    self.payeeTypeData.accountPayee.push(self.updateAccountElement);
                                }

                            } else if (region === "SEPA") {
                                for (let k = 0; k < sepaDomesticAccountType.length; k++) {
                                    self.updateAccountElement = getNewKoModel().updateElement;
                                    self.updateAccountElement.entityDTO.type(self.targetType());
                                    self.updateAccountElement.entityDTO.value(self.targetValue());
                                    self.updateAccountElement.payeesPerDay(0);
                                    self.updateAccountElement.payeeCountLimitStatus(false);
                                    self.updateAccountElement.payeeType(sepaDomesticAccountType[k]);
                                    self.payeeTypeData.accountPayee.push(self.updateAccountElement);
                                }

                            }

                            self.payeeRestrictionModel.payeeCountLimitList.push(self.payeeTypeData);
                            break;
                        case "INTERNATIONAL":
                            self.payeeTypeData = getNewKoModel().payeeTypeData;
                            self.payeeTypeData.payeeType(payeeTypeList[i]);
                            self.updateAccountElement = getNewKoModel().updateElement;
                            self.updateAccountElement.entityDTO.type(self.targetType());
                            self.updateAccountElement.entityDTO.value(self.targetValue());
                            self.updateAccountElement.payeesPerDay(0);
                            self.updateAccountElement.payeeCountLimitStatus(false);
                            self.updateAccountElement.payeeType(payeeTypeList[i]);
                            self.payeeTypeData.accountPayee.push(self.updateAccountElement);
                            self.updateDraftElement = getNewKoModel().updateElement;
                            self.updateDraftElement.entityDTO.type(self.targetType());
                            self.updateDraftElement.entityDTO.value(self.targetValue());
                            self.updateDraftElement.payeesPerDay(0);
                            self.updateDraftElement.payeeCountLimitStatus(false);
                            self.updateDraftElement.payeeType("INTERNATIONALDEMANDDRAFT");
                            self.payeeTypeData.draftpayee.push(self.updateDraftElement);
                            self.payeeRestrictionModel.payeeCountLimitList.push(self.payeeTypeData);
                            break;

                    }
                }
            });
        }

        if (!Params.rootModel.previousState) {
            createPayeeCountLimit();
        }

        self.showWarning = function() {
            $("#effectivedate").trigger("openModal");
        };

        self.hideWarning = function() {
            $("#effectivedate").hide();
        };

        self.save = function() {
            Params.dashboard.loadComponent("review-create-payee-restrictions", ko.mapping.toJS({
                            payeeRestrictionModel: self.payeeRestrictionModel,
                            targetValue: self.targetValue,
                            targetType: self.targetType,
                            enterpriseRole :self.enterpriseRole,
                            segmentSelectedForRole : self.segmentSelectedForRole,
                            showCreateScreen:self.params.showCreateScreen,
                            userSegmentsList:self.params.userSegmentsList,
                            userSegmentsForRoleList:self.params.userSegmentsForRoleList,
                            userSegmentsLoaded:self.params.userSegmentsLoaded,
                            userSegmentsForRoleLoaded:self.params.userSegmentsForRoleLoaded
                        }));
        };
    };
});