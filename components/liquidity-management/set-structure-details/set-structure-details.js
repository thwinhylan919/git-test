/**
 * set-structure-details contains all the methods to create a structure.
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} * @requires {object} createStructureModel
 * @requires {object} ResourceBundle
 */
define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/set-structure-details",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojpopup",
    "ojs/ojdatetimepicker"
], function(ko, $, setStructureDetailsModel, ResourceBundle) {
    "use strict";

    /** Set-structure-details.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     *
     */
    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(setStructureDetailsModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.setStructureDetailsModel = rootParams.defaultData || getNewKoModel().setStructureDetailsModel;
        self.resource = ResourceBundle;
        self.mode = rootParams.mode;
        self.frequencyList = ko.observableArray();
        self.instructionTypeList = ko.observableArray();
        self.reallocationMethodList = ko.observableArray();
        self.accountList = ko.observableArray();
        self.interestMethodList = ko.observableArray();
        self.structureTypeList = ko.observableArray();
        self.structureType = ko.observable(self.setStructureDetailsModel.structureType || null);
        self.dataLoaded = ko.observable(false);
        self.interestMethod = ko.observable(self.setStructureDetailsModel.interestMethod || null);
        self.currentDate = ko.observable();
        self.effDate = ko.observable(self.setStructureDetailsModel.effDate || null);
        self.endDate = ko.observable(self.setStructureDetailsModel.endDate || null);
        self.resetEndDate = ko.observable(true);
        self.centralAccountRequired = ko.observable(false);
        rootParams.baseModel.registerElement(["page-section", "modal-window"]);

        self.currentDate(rootParams.baseModel.getDate());

        self.minEndDate = ko.pureComputed(function() {
            if (self.endDate() && self.effDate() && (new Date(self.endDate()) < new Date(self.effDate()))) {
                return new Date(new Date(self.effDate())).getTime() + 60000;
            } else if (self.endDate() && (new Date(self.endDate()) < self.currentDate())) {
                return self.currentDate();
            }
        });

        const minEndDate = self.minEndDate.subscribe(function() {
            self.resetEndDate(false);
            ko.tasks.runEarly();
            self.resetEndDate(true);
        });

        setStructureDetailsModel.init(rootParams.dashboard.userData.userProfile.partyId.value);

        const payload = ko.mapping.toJSON(getNewKoModel().setStructureDetailsModel);

        Promise.all([setStructureDetailsModel.getStructureType(), setStructureDetailsModel.getInterestMethod(), setStructureDetailsModel.getReallocationMethod(), setStructureDetailsModel.getInstructionType(payload), setStructureDetailsModel.getFrequency(payload), setStructureDetailsModel.fetchAccount()]).then(function(response) {
            const structureTypeResponse = response[0],
                interestMethodResponse = response[1],
                reallocationMethodResponse = response[2],
                instructionTypeResponse = response[3],
                frequencyResponse = response[4],
                accountListResponse = response[5];

            if (structureTypeResponse && structureTypeResponse.enumRepresentations[0].data !== null && structureTypeResponse.enumRepresentations[0].data.length > 0) {
                for (let i = 0; i < structureTypeResponse.enumRepresentations[0].data.length; i++) {
                    self.structureTypeList.push({
                        text: structureTypeResponse.enumRepresentations[0].data[i].description,
                        value: structureTypeResponse.enumRepresentations[0].data[i].code
                    });
                }
            }

            if (interestMethodResponse && interestMethodResponse.enumRepresentations[0].data !== null && interestMethodResponse.enumRepresentations[0].data.length > 0) {
                for (let i = 0; i < interestMethodResponse.enumRepresentations[0].data.length; i++) {
                    self.interestMethodList.push({
                        text: interestMethodResponse.enumRepresentations[0].data[i].description,
                        value: interestMethodResponse.enumRepresentations[0].data[i].code
                    });
                }
            }

            if (reallocationMethodResponse && reallocationMethodResponse.enumRepresentations[0].data !== null && reallocationMethodResponse.enumRepresentations[0].data.length > 0) {
                for (let j = 0; j < reallocationMethodResponse.enumRepresentations[0].data.length; j++) {
                    self.reallocationMethodList.push({
                        text: reallocationMethodResponse.enumRepresentations[0].data[j].description,
                        value: reallocationMethodResponse.enumRepresentations[0].data[j].code
                    });
                }
            }

            self.reallocationMethodChangeHandler(self.setStructureDetailsModel.reallocationMethod);

            if (instructionTypeResponse && instructionTypeResponse.jsonNode.instructiondetailList && instructionTypeResponse.jsonNode.instructiondetailList.length > 0) {
                for (let i = 0; i < instructionTypeResponse.jsonNode.instructiondetailList.length; i++) {
                    self.instructionTypeList.push({
                        text: instructionTypeResponse.jsonNode.instructiondetailList[i].instructionDetailDesc,
                        value: instructionTypeResponse.jsonNode.instructiondetailList[i].instructionDetailKey.instructionDetailId,
                        data: instructionTypeResponse.jsonNode.instructiondetailList[i]
                    });
                }
            }

            if (frequencyResponse && frequencyResponse.jsonNode.frequencyList && frequencyResponse.jsonNode.frequencyList.length > 0) {
                for (let i = 0; i < frequencyResponse.jsonNode.frequencyList.length; i++) {
                    self.frequencyList.push({
                        text: frequencyResponse.jsonNode.frequencyList[i].freqDesc,
                        value: frequencyResponse.jsonNode.frequencyList[i].freqId,
                        data: frequencyResponse.jsonNode.frequencyList[i]
                    });
                }
            }

            if (accountListResponse && accountListResponse.jsonNode.accountList.length) {
                for (let i = 0; i < accountListResponse.jsonNode.accountList.length; i++) {

                    if (!accountListResponse.jsonNode.accountList[i].isExtAccChk) {

                            if(!accountListResponse.jsonNode.accountList[i].accountDetails){

                            self.accountList.push({
                                value: accountListResponse.jsonNode.accountList[i].accountKey.accountNo.value,
                                displayValue: accountListResponse.jsonNode.accountList[i].accountKey.accountNo.displayValue,
                                centralAccBr: accountListResponse.jsonNode.accountList[i].accountKey.branchCodeId,
                                centralAccCcy: accountListResponse.jsonNode.accountList[i].accountKey.ccyId
                                });
                            }
                            else{

                                self.accountList.push({
                                    value: accountListResponse.jsonNode.accountList[i].accountDetails.accountKey.accountNo.value,
                                    displayValue: accountListResponse.jsonNode.accountList[i].accountDetails.accountKey.accountNo.displayValue,
                                    centralAccBr: accountListResponse.jsonNode.accountList[i].accountDetails.accountKey.branchCodeId,
                                    centralAccCcy: accountListResponse.jsonNode.accountList[i].accountDetails.accountKey.ccyId
                                });
                            }

                    }
                }
            }

            self.dataLoaded(true);
        });

        let structureTypeChanged = false;

        /**
         * @function structureTypeChangeHandler
         * @memberof set-structure-details
         * @param  {Object} event - Change events of select item.
         * @return {void}
         */
        self.structureTypeChangeHandler = function(event) {
            if (event.detail.value) {
                self.structureType(event.detail.value);
                structureTypeChanged = true;

                if (self.structureType() !== "Pool") {
                    self.interestMethod("I");
                }
            }
        };

        /**
         * @function reallocationMethodChangeHandler
         * @memberof set-structure-details
         * @param  {Object} event - Change events of select item.
         * @return {void}
         */
        self.reallocationMethodChangeHandler = function(event) {
            const reallocation = self.resource.centralDistribution;

            if (event && (event === reallocation || (event.detail && event.detail.value && event.detail.value === reallocation))) {
                self.centralAccountRequired(true);
            }else {
                self.setStructureDetailsModel.centralAccBr = null;
                self.setStructureDetailsModel.centralAccCcy = null;
                self.setStructureDetailsModel.centralAcc = "";
                self.setStructureDetailsModel.centralAccDisplayValue = null;
                self.centralAccountRequired(false);
            }
        };

        /**
         * @function centralAccountChangeHandler
         * @memberof set-structure-details
         * @param  {Object} event - Change events of select item.
         * @return {void}
         */
        self.centralAccountChangeHandler = function(event) {
            if (event.detail.value && self.accountList()) {
                for (let k = 0; k < self.accountList().length; k++) {
                    if (event.detail.value === self.accountList()[k].value) {
                        self.setStructureDetailsModel.centralAccBr = self.accountList()[k].centralAccBr;
                        self.setStructureDetailsModel.centralAccCcy = self.accountList()[k].centralAccCcy;
                        self.setStructureDetailsModel.centralAccDisplayValue = self.accountList()[k].displayValue;
                    }
                }
            }
        };

        self.openPopup = function() {
            const popup = document.querySelector("#default-instruction-info-popup");

            if (popup.isOpen()) {
                popup.close();
            } else {
                popup.open("#instruction-poop-up");
            }
        };

        self.closeDefaultInstructionsModal = function() {
            $("#default-instructions").trigger("closeModal");
        };

        self.resetDefaultInstructions = function() {
            $("#default-instructions").trigger("closeModal");

            self.setStructureDetailsModel.interestMethod = self.interestMethod();
            self.setStructureDetailsModel.structureType = self.structureType();
            self.setStructureDetailsModel.effDate = self.effDate();
            self.setStructureDetailsModel.endDate = self.endDate();
            self.setStructureDetailsModel.structureTypeChanged = structureTypeChanged;

            rootParams.stageChangeHandler("set-structure-details", self.setStructureDetailsModel, "next");
        };

        self.next = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("setStructureDetailsTracker"))) {
                return;
            }

            if (self.setStructureDetailsModel.instructionType || self.setStructureDetailsModel.defaultFrequency || self.setStructureDetailsModel.reverseFrequency) {
                $("#default-instructions").trigger("openModal");
            } else {
                self.resetDefaultInstructions();
            }
        };

        /**
         * This function will be triggered to cleanup the memory allocated to subscribed functions.
         *
         * @memberOf set-structure-details
         * @function dispose
         * @returns {void}
         */
        self.dispose = function() {
            minEndDate.dispose();
        };
    };
});