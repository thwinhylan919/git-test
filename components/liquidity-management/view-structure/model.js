/** Model for view-structure
 * @param {object} BaseService base service instance for server communication
 * @return {object} viewStructureModel
 */
define(["baseService"], function(BaseService) {
    "use strict";

    const viewStructureModel = function() {
        /**
         * In case more than one instance of viewStructureModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const baseService = BaseService.getInstance();
        let partyCode, structureCode, versionNo, desc;
        const Model = function() {
                this.pauseStructureModel = {
                    structureList: [{
                        structureKey: {
                            structureId: null,
                            versionNo: null
                        },
                        customerId: null,
                        desc: null,
                        priority: null,
                        effDate: null,
                        endDate: null,
                        multibankChk: null,
                        crossBorderChk: null,
                        crossCcyChk: null,
                        allowSweepOnCcyHol: null,
                        interestMethod: null,
                        eodexecution: null,
                        holidayTreatment: null,
                        maxBackwardDays: null,
                        reallocationMethod: null,
                        structureType: null,
                        structureStatus: null,
                        balType: null,
                        fxRatePickUp: null,
                        considerPostSweepBal: null,
                        accountlst: [{
                                accountDetails: {
                                    accountKey: {
                                        accountNo: null,
                                        branchCode: null,
                                        branchCodeId: null,
                                        ccy: null,
                                        ccyId: null
                                    }
                                },
                                thirdPartAccountChk: false,
                                baseAmt: null,
                                level: null,
                                allowRevSweep: null,
                                hold: null,
                                eodexecution: null,
                                percentageShare: null
                            },
                            {
                                accountDetails: {
                                    accountKey: {
                                        accountNo: null,
                                        branchCode: null,
                                        branchCodeId: null,
                                        ccy: null,
                                        ccyId: null
                                    }
                                },
                                parentAccountKey: {
                                    accountNo: null,
                                    branchCode: null,
                                    branchCodeId: null,
                                    ccy: null,
                                    ccyId: null
                                },
                                thirdPartAccountChk: null,
                                level: null,
                                baseAmt: null,
                                rateType: null,
                                cashCCMethod: null,
                                sweepDirection: null,
                                allowRevSweep: null,
                                hold: null,
                                eodexecution: null,
                                percentageShare: null,
                                instructionPriority: null,
                                paymentInstructionList: {
                                    paymentAccInstructList: [{
                                        networkId: null,
                                        swpDirection: null
                                    }]
                                },
                                instructionList: {
                                    instructiondetailList: [{
                                        instructionDetailKey: {
                                            instructionDetailId: null
                                        },
                                        frequencyList: {
                                            frequencyList: [{
                                                frequencyKeyDTO: {
                                                    frequencyId: null
                                                }
                                            }]
                                        }
                                    }]
                                }
                            }
                        ],
                        audit: {
                            revNo: null,
                            makerId: null,
                            checkerId: null,
                            makerDateStamp: null,
                            chekerDateStamp: null,
                            onceAuth: null,
                            authStat: null,
                            recordStat: null
                        }
                    }]
                };

                this.executeStructureModel = {
                    strListKeyDTO: [{
                        structureId: structureCode,
                        desc : desc,
                        versionNo: versionNo
                    }],
                    customerId: partyCode,
                    overRidePending: false
                };
            };

        return {

            /**
             * Method to initiate model.
             *
             * @param {string} structureId - Of structure.
             * @param {string} version - Structure version.
             * @param {string} partyId - Party id.
             * @param {string} structDesc - Structure description.
             */
            init: function(structureId, version, partyId, structDesc) {
                partyCode = partyId;
                versionNo = version;
                structureCode = structureId;
                desc = structDesc;
            },

            /**
             * Method to get new modal instance.
             *
             * @returns {Object}  Returns the modelData.
             */
            getNewModel: function() {
                return new Model();
            },

            /**
             * PauseStructure - pause a particular structure based on input data.
             *
             * @param {Object} pauseStructureModel - Payload to be passed to.
             * @param {string} action - Action to be performed. Values could be 'pause' or 'resume'.
             * @returns {Promise}  Returns the promise object.
             */
            pauseStructure: function(pauseStructureModel, action) {
                return baseService.add({url: "liquidityManagement/structure/{action}",
                        apiType: "extended",
                        data: pauseStructureModel
                    },{
                        action:action
                    });
            },

            /**
             * EditStructure - edits structure in the host.
             *
             * @param {Object} createStructureModel - Payload to be passed to create structure.
             * @returns {Promise}  Returns the promise object.
             */
            editStructure: function(createStructureModel) {
                return baseService.add({
                    url: "liquidityManagement/structure/edit",
                    apiType: "extended",
                    data: createStructureModel
                });
            },

            /**
             * ViewStructure - fetches data to view in tree structure for a particular structure ID.
             *
             * @param {Object} structureId - Structure id of the structure.
             * @returns {Promise}  Returns the promise object.
             */
            viewStructure: function(structureId) {
                return baseService.fetch({
                    url: "liquidityManagement/structure/details/{structureId}",
                    apiType: "extended"
                },{
                    structureId:structureId
                });
            },

            /**
             * viewStructureByStructureId - fetches data to view in tree structure for a particular structure ID.
             *
             * @param {Object} structureId - Structure id of the structure.
             * @returns {Promise}  Returns the promise object.
             */
            viewStructureByStructureId: function(structureId) {
                return baseService.fetch({
                    url: "liquidityManagement/structure/details?structureId={structureId}",
                    apiType: "extended"
                },{
                    structureId:structureId
                });
            },

            /**
             * FetchPDF - download pdf for sweep log details for executed and exception sweeps.
             *
             * @param {Object} structureId - Structure id of the structure.
             * @returns {Promise}  Returns the promise object.
             */
            fetchPDF: function(structureId) {
                return baseService.downloadFile({
                    url: "liquidityManagement/structure/details/{structureId}?media=application/pdf&eodexecution=false",
                    apiType: "extended"
                },{
                    structureId:structureId
                });
            },

            /**
             * GetPartyDetails - fetches party details of current entity.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getPartyDetails: function() {
                return baseService.fetch({
                    url: "me/party"
                });
            },

            /**
             * CreateStructure - Creates structure in the host.
             *
             * @param {Object} createStructureModel - Payload to be passed to create structure.
             * @returns {Promise}  Returns the promise object.
             */
            createStructure: function(createStructureModel) {
                return baseService.add({
                    url: "liquidityManagement/structure",
                    apiType: "extended",
                    data: createStructureModel
                });
            },

            /**
             * ExecuteStructure - Execute a particular structure based on input data.
             *
             * @param {Object} executeStructureModel - Payload to be passed to.
             * @returns {Promise}  Returns the promise object.
             */
            executeStructure: function(executeStructureModel) {
                return baseService.add({
                    url: "liquidityManagement/structure/execution",
                    apiType: "extended",
                    data: executeStructureModel
                });
            }
        };
    };

    return new viewStructureModel();
});