/**
 * Model for create-structure
 * @return {object} createStructureModel Modal instance
 */
define([], function() {
    "use strict";

    const createStructureModel = function() {
        /**
         * In case more than one instance of createStructure is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const Model = function() {
            this.createStructure = {
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
                    multibankChk: true,
                    crossBorderChk: true,
                    crossCcyChk: true,
                    allowSweepOnCcyHol: false,
                    interestMethod: null,
                    holidayTreatment: "H",
                    reallocationMethod: null,
                    structureType: null,
                    structureStatus: "Resumed",
                    balType: "VD",
                    fxRatePickUp: "Offline",
                    source1: "OBDX",
                    considerPostSweepBal: true,
                    accountlst: []
                }]
            };
        };

        return {
            /**
             * Method to get new modal instance.
             *
             * @returns {Object}  Returns the modelData.
             */
            getNewModel: function() {
                return new Model();
            }
        };
    };

    return new createStructureModel();
});