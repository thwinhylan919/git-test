/**
 * Model for view-sweep-log
 * @param {object} BaseService base service instance for server communication
 * @return {object} viewSweepLogModel instance
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";

    const viewSweepLogModel = function() {
        /**
         * In case more than one instance of view sweep log details is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const baseService = BaseService.getInstance();

        return {
            /**
             * Method to fetch date from Host.
             *
             * @returns {Promise} Returns the promise object.
             */
            getHostDate: function() {
                return baseService.fetch({
                    url: "payments/currentDate"
                });
            },
            /**
             * Method to enumeration of sweep status.
             *
             * @returns {Promise} Returns the promise object.
             */
            fetchSweepStatus: function() {
                return baseService.fetch({
                    url: "enumerations/sweepStatus"
                });
            },
            /**
             * Method getSweepLogDetails fetches sweep details based on input parameters for executed and exceptions.
             *
             * @param {Object} sweepLogModel - Payload to be passed to.
             * @returns {Promise} Returns the promise object.
             */
            getSweepLogDetails: function(sweepLogModel) {
                return baseService.fetch({
                    url: "liquidityManagement/sweepLogs?fromDate={fromDate}&toDate={toDate}&structureId={structureId}&filter={filter}",
                    apiType: "extended"
                },{
                    fromDate:sweepLogModel.fromDate,
                    toDate:sweepLogModel.toDate,
                    structureId:sweepLogModel.structureId,
                    filter:sweepLogModel.filter
                });
            },
            /**
             * GetStructureListDetails - fetches structure list for a particular party/user.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getStructureListDetails: function() {
                return baseService.fetch({
                    url: "liquidityManagement/structure/details",
                    apiType: "extended"
                });
            },
            /**
             * FetchPDF - download pdf for sweep log details for executed and exception sweeps.
             *
             * @param {Object} sweepLogModel - Payload to be passed to.
             * @returns {Promise}  Returns the promise object.
             */
            fetchPDF: function(sweepLogModel) {
                return baseService.downloadFile({
                    url: "liquidityManagement/sweepLogs?media=application/pdf&fromDate={fromDate}&toDate={toDate}&structureId={structureId}&filter={filter}",
                    apiType: "extended"
                },{
                    fromDate:sweepLogModel.fromDate,
                    toDate:sweepLogModel.toDate,
                    structureId:sweepLogModel.structureId,
                    filter:sweepLogModel.filter
                });
            },

            /**
             * FetchCSV - download sweep log details in CSV format for executed and exception sweeps.
             *
             * @param {Object} sweepLogModel - Payload to be passed to.
             * @returns {Promise}  Returns the promise object.
             */
            fetchCSV: function(sweepLogModel) {
                return baseService.downloadFile({
                    url: "liquidityManagement/sweepLogs?media=text/csv&mediaFormat=csv&fromDate={fromDate}&toDate={toDate}&structureId={structureId}&filter={filter}",
                    apiType: "extended"
                },{
                    fromDate:sweepLogModel.fromDate,
                    toDate:sweepLogModel.toDate,
                    structureId:sweepLogModel.structureId,
                    filter:sweepLogModel.filter
                });
            },

            /**
             * FetchUpcomingPDF - download pdf for sweep log details for upcoming sweeps.
             *
             * @param {Object} upcomingSweepListModel - Payload to be passed to.
             * @returns {Promise}  Returns the promise object.
             */
            fetchUpcomingPDF: function(upcomingSweepListModel) {
                return baseService.downloadFile({
                    url: "liquidityManagement/sweepLogs/upcoming?media=application/pdf&fromDate={fromDate}&toDate={toDate}&structID={structID}",
                    apiType: "extended"
                },{
                    fromDate:upcomingSweepListModel.fromDate,
                    toDate:upcomingSweepListModel.toDate,
                    structID:upcomingSweepListModel.structID
                });
            },

            /**
             * FetchUpcomingCSV - download sweep log details in csv format for upcoming sweeps.
             *
             * @param {Object} upcomingSweepListModel - Payload to be passed to.
             * @returns {Promise}  Returns the promise object.
             */
            fetchUpcomingCSV: function(upcomingSweepListModel) {
                return baseService.downloadFile({
                    url: "liquidityManagement/sweepLogs/upcoming?media=text/csv&mediaFormat=csv&fromDate={fromDate}&toDate={toDate}&structID={structID}",
                    apiType: "extended"
                },{
                    fromDate:upcomingSweepListModel.fromDate,
                    toDate:upcomingSweepListModel.toDate,
                    structID:upcomingSweepListModel.structID
                });
            },

            /**
             * GetUpcomingSweepLogDetails - fetches upcoming sweep lof details.
             *
             * @param {Object} sweepLogModel - Payload to be passed to.
             * @returns {Promise}  Returns the promise object.
             */
            getUpcomingSweepLogDetails: function(sweepLogModel) {
                return baseService.fetch({
                    url: "liquidityManagement/sweepLogs/upcoming?fromDate={fromDate}&toDate={toDate}&structID={structID}",
                    apiType: "extended"
                },{
                    fromDate:sweepLogModel.fromDate,
                    toDate:sweepLogModel.toDate,
                    structID:sweepLogModel.structID
                });
            }
        };
    };

    return new viewSweepLogModel();
});