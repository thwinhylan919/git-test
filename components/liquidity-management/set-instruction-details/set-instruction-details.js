/**
 * set-instruction-details contains all the methods to create a structure.
 *
 * @module liquidity-managemnt
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} * @requires {object} createStructureModel
 * @requires {object} ResourceBundle
 */
define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/set-instruction-details",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojdatetimepicker"
], function(ko, setInstructionDetailsModel, ResourceBundle) {
    "use strict";

    /** Set-instruction-details.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     *
     */
    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(setInstructionDetailsModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.instructionDetailListModel = getNewKoModel().instructionDetailList;
        self.instructionParamListModel = getNewKoModel().instructionParamList;
        self.instructionDetailModel = getNewKoModel().instructionDetail;
        self.frequencyListModel = getNewKoModel().frequencyList;
        self.instructionParamListLoaded = ko.observable(false);
        self.resources = ResourceBundle;
        self.frequencyList = ko.observableArray();
        self.instructionTypeList = ko.observableArray();
        self.sweepDirectionList = ko.observableArray();
        self.dataLoaded = ko.observable(false);
        self.revFreq = ko.observable();
        rootParams.baseModel.registerElement(["page-section"]);
        rootParams.baseModel.registerComponent("tree-view", "liquidity-management");
        self.structureDetails = ko.observable(self.structureDetails);
        self.sweepDirection = ko.observable(self.nodeDetails()[1].account.sweepDirection);
        self.isIEBrowser = ko.observable(false);

        /* Sample function that returns boolean in case the browser is Internet Explorer*/
        function isIE() {
            const ua = navigator.userAgent,
                is_ie = ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1;

            return is_ie;
        }

        /* Create an alert to show if the browser is IE or not */
        if (isIE()) {
            self.isIEBrowser(true);
        } else {
            self.isIEBrowser(false);
        }

        if (self.nodeDetails()[1].account.instructionList.instructiondetailList) {
            ko.utils.extend(self.instructionDetailListModel.instructiondetailList(), self.nodeDetails()[1].account.instructionList.instructiondetailList);
            ko.utils.extend(self.instructionDetailModel, self.nodeDetails()[1].account.instructionList.instructiondetailList[0]);
            ko.utils.extend(self.frequencyListModel, self.nodeDetails()[1].account.instructionList.instructiondetailList[0].frequencyList.frequencyList);
            self.instructionParamListModel = ko.mapping.toJS(self.nodeDetails()[1].account.instructionList.instructiondetailList[0].instructionParamLst);
            self.revFreq(self.nodeDetails()[1].account.revFreq);
            self.sweepDirection(self.nodeDetails()[1].account.sweepDirection);
        }

        if (!self.instructionStatusMap[self.nodeDetails()[0].accountDetails.accountKey.accountNo.value + "~" + self.nodeDetails()[1].account.accountDetails.accountKey.accountNo.value]) {
            if (self.defaultInstructions.instructionType) {
                self.instructionDetailModel.instructionDetailKey.instructionDetailId = self.defaultInstructions.instructionType;
            }

            if (self.defaultInstructions.reverseFrequency) {
                self.revFreq(self.defaultInstructions.reverseFrequency);
            }

            if (self.defaultInstructions.defaultFrequency) {
                self.frequencyListModel.frequencyKeyDTO.frequencyId = self.defaultInstructions.defaultFrequency;
            }
        }

        self.treeJson = ko.observableArray();

        const childArray = [];

        childArray.push(self.nodeDetails()[1]);

        self.treeJson({
            account: self.nodeDetails()[0],
            children: childArray
        });

        self.cashCCMethod = ko.observable(self.nodeDetails()[1].account.cashCCMethod);
        setInstructionDetailsModel.init(rootParams.dashboard.userData.userProfile.partyId.value);

        const payload = ko.mapping.toJSON(getNewKoModel().setInstructionDetailsModel);

        Promise.all([setInstructionDetailsModel.getInstructionType(payload), setInstructionDetailsModel.getFrequency(payload), setInstructionDetailsModel.getSweepDirection()]).then(function(response) {
            const instructionTypeResponse = response[0],
                frequencyResponse = response[1],
                sweepDirectionResponse = response[2];

            if (instructionTypeResponse && instructionTypeResponse.jsonNode.instructiondetailList && instructionTypeResponse.jsonNode.instructiondetailList.length > 0) {
                for (let i = 0; i < instructionTypeResponse.jsonNode.instructiondetailList.length; i++) {
                    self.instructionTypeList.push({
                        text: instructionTypeResponse.jsonNode.instructiondetailList[i].instructionDetailDesc,
                        value: instructionTypeResponse.jsonNode.instructiondetailList[i].instructionDetailKey.instructionDetailId,
                        data: instructionTypeResponse.jsonNode.instructiondetailList[i]
                    });
                }

                self.instructionTypeChangeHandler({
                    detail: {
                        value: self.instructionDetailModel.instructionDetailKey.instructionDetailId || self.instructionTypeList()[0].value
                    }
                });
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

            if (sweepDirectionResponse && sweepDirectionResponse.enumRepresentations[0].data !== null && sweepDirectionResponse.enumRepresentations[0].data.length > 0) {
                for (let i = 0; i < sweepDirectionResponse.enumRepresentations[0].data.length; i++) {
                    self.sweepDirectionList.push({
                        text: sweepDirectionResponse.enumRepresentations[0].data[i].description,
                        value: sweepDirectionResponse.enumRepresentations[0].data[i].code
                    });
                }
            }

            self.dataLoaded(true);
        });

        /**
         * @function frequencyChangeHandler
         * @memberof set-instruction-details
         * @param  {Object} event - Change events of select item.
         * @return {void}
         */
        self.frequencyChangeHandler = function(event) {
            if (event.detail.value) {
                for (let i = 0; i < self.frequencyList().length; i++) {
                    if (self.frequencyList()[i].value === event.detail.value) {
                        self.frequencyListModel.cronExpression = self.frequencyList()[i].data.cronExpression;
                        self.frequencyListModel.description = self.frequencyList()[i].text;
                    }
                }
            }
        };

        /**
         * @function instructionTypeChangeHandler
         * @memberof set-instruction-details
         * @param  {Object} event - Change events of select item.
         * @return {void}
         */
        self.instructionTypeChangeHandler = function(event) {
            if (event.detail.value) {
                self.instructionParamListLoaded(false);

                for (let i = 0; i < self.instructionTypeList().length; i++) {
                    if (self.instructionTypeList()[i].value === event.detail.value) {
                        self.instructionDetailModel.instructionType = self.instructionTypeList()[i].text;

                        if (!event.detail.trigger && self.nodeDetails()[1].account.instructionList.instructiondetailList && self.instructionDetailModel.instructionDetailKey.instructionDetailId === event.detail.value) {
                            const instructionParamDetails = ko.mapping.toJS(self.nodeDetails()[1].account.instructionList.instructiondetailList[0].instructionParamLst);

                            self.instructionParamListModel = ko.mapping.fromJS(instructionParamDetails);
                        } else {
                            self.instructionParamListModel = ko.mapping.fromJS(self.instructionTypeList()[i].data.instructionParamLst);
                        }

                    }
                }

                ko.tasks.runEarly();
                self.instructionParamListLoaded(true);
            }
        };

        /**
         * @function update
         * @memberof set-instruction-details
         * @return {void}
         */
        self.update = function() {
            const instructiondetailListArray = [];

            if (self.instructionDetailModel.frequencyList.frequencyList && self.instructionDetailModel.frequencyList.frequencyList !== "") {
                self.instructionDetailModel.frequencyList.frequencyList = self.frequencyListModel;
            }

            if (self.instructionDetailModel.instructionParamLst && self.instructionDetailModel.instructionParamLst !== "") {
                self.instructionDetailModel.instructionParamLst = self.instructionParamListModel;
            }

            instructiondetailListArray.push(self.instructionDetailModel);
            self.instructionDetailListModel.instructiondetailList = instructiondetailListArray;
            self.nodeDetails()[1].account.instructionList = self.instructionDetailListModel;
            self.nodeDetails()[1].account.sweepDirection = self.sweepDirection();
            self.nodeDetails()[1].account.revFreq = self.revFreq();

            if (!self.instructionStatusMap[self.nodeDetails()[0].accountDetails.accountKey.accountNo.value + "~" + self.nodeDetails()[1].account.accountDetails.accountKey.accountNo.value]) {
                self.instructionStatusMap[self.nodeDetails()[0].accountDetails.accountKey.accountNo.value + "~" + self.nodeDetails()[1].account.accountDetails.accountKey.accountNo.value] = true;
            }

            rootParams.closeHandler();
        };
    };
});