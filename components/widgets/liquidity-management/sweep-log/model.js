/**
 * Model for sweep-log
 * @param1 {object} BaseService base service instance for server communication
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
             * Method getSweepLogDetails fetches sweep details based on input parameters for executed and exceptions.
             *
             * @param {Object} sweepLogModel - Payload to be passed to.
             * @returns {Promise} Returns the promise object.
             */
            getSweepLogDetails: function(sweepLogModel) {
                return baseService.fetchWidget({
                    url: "liquidityManagement/sweepLogs?fromDate={fromDate}&toDate={toDate}&filter={filter}",
                    mockedUrl:"framework/json/design-dashboard/liquidity-management/sweep-details.json",
                    apiType: "extended"
                },{
                    fromDate:sweepLogModel.fromDate,
                    toDate:sweepLogModel.toDate,
                    filter:sweepLogModel.filter
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
                    url: "liquidityManagement/sweepLogs?media=application/pdf&fromDate={fromDate}&toDate={toDate}&filter={filter}",
                    apiType: "extended"
                },{
                    fromDate:sweepLogModel.fromDate,
                    toDate:sweepLogModel.toDate,
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
                    url: "liquidityManagement/sweepLogs?media=text/csv&mediaFormat=csv&fromDate={fromDate}&toDate={toDate}&filter={filter}",
                    apiType: "extended"
                },{
                    fromDate:sweepLogModel.fromDate,
                    toDate:sweepLogModel.toDate,
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
                    url: "liquidityManagement/sweepLogs/upcoming?media=application/pdf&fromDate={fromDate}&toDate={toDate}",
                    apiType: "extended"
                },{
                    fromDate:upcomingSweepListModel.fromDate,
                    toDate:upcomingSweepListModel.toDate
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
                    url: "liquidityManagement/sweepLogs/upcoming?media=text/csv&mediaFormat=csv&fromDate={fromDate}&toDate={toDate}",
                    apiType: "extended"
                },{
                    fromDate:upcomingSweepListModel.fromDate,
                    toDate:upcomingSweepListModel.toDate
                });
            },

            /**
             * GetUpcomingSweepLogDetails - fetches upcoming sweep lof details.
             *
             * @param {Object} sweepLogModel - Payload to be passed to.
             * @returns {Promise}  Returns the promise object.
             */
            getUpcomingSweepLogDetails: function(sweepLogModel) {
                return baseService.fetchWidget({
                    url: "liquidityManagement/sweepLogs/upcoming?fromDate={fromDate}&toDate={toDate}",
                    mockedUrl:"framework/json/design-dashboard/liquidity-management/upcomingsweep-details.json",
                    apiType: "extended"
                },{
                    fromDate:sweepLogModel.fromDate,
                    toDate:sweepLogModel.toDate
                });
            }
        };
    };

    return new viewSweepLogModel();
});