define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    /**
     * Main file for feedbackModel Model. This file contains the model definition
     * for list of properties fetched from the server from table digx_fw_config_all_b through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of properties:
     *          <ul>
     *              <li>[init()]{@link FeedbackModel.init}</li>.
     *
     *              <li>[getProperty()]{@link FeedbackModel.getPieChartData}</li>
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~FeedbackModel
     * @class FeedbackModel
     */
    const FeedbackModel = function() {
        const baseService = BaseService.getInstance();
        /* variable to make sure that in case there is no change
         * in model no additional fetch requests are fired.*/
        let getPieChartDataDeferred;
        /**
         * Private method to fetch the Feedback analytics data for the pie chart. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function getPieChartData
         * @memberOf FeedbackModel
         * @param {string} transactionId -Transaction identifier for feedback analytics.
         * @param {string} accessPoint - Access point which is based on analytics like internet, mobile.
         * @param {string} role - Feedback roles for request to be searched.
         * @param {string} fromDate - From date is when user selected date for analytics.
         * @param {string} toDate - From date is when user selected date for analytics.
         * @param {Object} deferred - An object type Deferred.
         *
         * @returns {void}
         * @private
         */
        const getPieChartData = function(transactionId, accessPoint, role, fromDate, toDate, deferred) {
            const options = {
                    url: "feedback/reports?transactionId={transactionId}&accessPoint={accessPoint}&role={role}&fromDate={fromDate}&toDate={toDate}",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                },
                params = {
                    transactionId: transactionId,
                    accessPoint: accessPoint,
                    role: role,
                    fromDate: fromDate,
                    toDate: toDate
                };

            baseService.fetch(options, params);
        };
        let getThreeTxnDataDeferred;
        /**
         * Private method to fetch the Feedback analytics data for the pie chart basis of top three and bottom three transactions. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function getThreeTxnData
         * @memberOf FeedbackModel
         * @param {string} topCount - Analysis data for top three transactions.
         * @param {string} bottomCount - Analysis data for bottom three transactions.
         * @param {Object} deferred - An object type Deferred.
         *
         * @returns {void}
         * @private
         */
        const getThreeTxnData = function(topCount, bottomCount, deferred) {
            const options = {
                    url: "feedback/reports?topCount=3&bottomCount=3",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                },
                params = {
                    topCount: topCount,
                    bottomCount: bottomCount
                };

            baseService.fetch(options, params);
        };
        let getLineChartDataDeferred;
        /**
         * Private method to fetch the Feedback analytics data for the line chart. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function getLineChartData
         * @memberOf FeedbackModel
         * @param {string} transactionId -Transaction identifier for feedback analytics.
         * @param {string} accessPoint - Access point which is based on analytics like internet, mobile.
         * @param {string} role - Feedback roles for request to be searched.
         * @param {Object} deferred - An object type Deferred.
         * @returns {void}
         * @private
         */
        const getLineChartData = function(transactionId, accessPoint, role, deferred) {
            const options = {
                    url: "feedback/reports?transactionId={transactionId}&accessPoint={accessPoint}&role={role}&ratingOverPeriodData=true",
                    success: function(data) {
                        deferred.resolve(data);
                    }
                },
                params = {
                    transactionId: transactionId,
                    accessPoint: accessPoint,
                    role: role,
                    ratingOverPeriodData: true
                };

            baseService.fetch(options, params);
        };
        let getFeedbackTransactionDeferred;
        /**
         * Private method to fetch the Feedback Transaction. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function getFeedbackTransaction
         * @memberOf FeedbackModel
         * @param {Object} deferred - An object type Deferred.
         * @returns {void}
         * @private
         */
        const getFeedbackTransaction = function(deferred) {
            const options = {
                url: "resourceTasks?view=hierarchy",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let getAccessPointDeferred;
        /**
         * Private method to fetch the Access point. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function getAccessPoint
         * @memberOf FeedbackModel
         * @param {Object} deferred - An object type Deferred.
         * @returns {void}
         * @private
         */
        const getAccessPoint = function(deferred) {
            const options = {
                url: "accessPoints?accessType=INT",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let getTimeFrameDataDeferred;
        /**
         * Private method to fetch time frame for analytics. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function getTimeFrameData
         * @memberOf FeedbackModel
         * @param {Object} deferred - An object type Deferred.
         * @returns {void}
         * @private
         */
        const getTimeFrameData = function(deferred) {
            const options = {
                url: "enumerations/feedbackPeriod",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let getFeedbackUserRoleDeferred;
        /**
         * Private method to fetch the user roles. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function getFeedbackUserRole
         * @memberOf FeedbackModel
         * @param {Object} deferred - An object type Deferred.
         * @returns {void}
         * @private
         */
        const getFeedbackUserRole = function(deferred) {
            const options = {
                url: "enterpriseRoles?isLocal=true",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };

        return {
            getPieChartData: function(transactionId, accessPoint, role, fromDate, toDate) {
                getPieChartDataDeferred = $.Deferred();
                getPieChartData(transactionId, accessPoint, role, fromDate, toDate, getPieChartDataDeferred);

                return getPieChartDataDeferred;
            },
            getThreeTxnData: function(topCount, bottomCount) {
                getThreeTxnDataDeferred = $.Deferred();
                getThreeTxnData(topCount, bottomCount, getThreeTxnDataDeferred);

                return getThreeTxnDataDeferred;
            },
            getAccessPoint: function() {
                getAccessPointDeferred = $.Deferred();
                getAccessPoint(getAccessPointDeferred);

                return getAccessPointDeferred;
            },
            getLineChartData: function(transactionId, accessPoint, role) {
                getLineChartDataDeferred = $.Deferred();
                getLineChartData(transactionId, accessPoint, role, getLineChartDataDeferred);

                return getLineChartDataDeferred;
            },
            getFeedbackTransaction: function() {
                getFeedbackTransactionDeferred = $.Deferred();
                getFeedbackTransaction(getFeedbackTransactionDeferred);

                return getFeedbackTransactionDeferred;
            },
            getTimeFrameData: function() {
                getTimeFrameDataDeferred = $.Deferred();
                getTimeFrameData(getTimeFrameDataDeferred);

                return getTimeFrameDataDeferred;
            },
            getFeedbackUserRole: function() {
                getFeedbackUserRoleDeferred = $.Deferred();
                getFeedbackUserRole(getFeedbackUserRoleDeferred);

                return getFeedbackUserRoleDeferred;
            }
        };
    };

    return new FeedbackModel();
});