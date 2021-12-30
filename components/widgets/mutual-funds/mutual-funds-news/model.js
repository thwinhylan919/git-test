define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const NewsModel = function () {
        const baseService = BaseService.getInstance();
        let fetchNewsDeferred;
        /**
         * Private method to fetch news related to mutual funds
         * This method will resolve a passed deferred object which can be returned from calling function to the parent.
         *
         * @function fetchNews
         * @memberOf NewsModel
         * @returns {void}
         * @private
         * @param {Object} deferred - deferred object
         */
        const fetchNews = function (deferred) {
            const option = {
                url: "news",
                mockedUrl: "framework/json/design-dashboard/mutual-funds/mutual-funds-news.json",
                success: function (data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetchWidget(option);
        };

        return {
            /**
             * Public method to fetch news related to mutual funds. This method will
             * instantiate a new deferred object and will return the same to the callee function
             * which will be resolved after call completion with appropriate data and developer
             * can use .then(handler) to handle the data.
             * This method will resolve a passed deferred object which can be returned from calling function to the parent.
             *
             * @function fetchNews
             * @memberOf NewsModel
             * @param {Object} - - Deferred object.
             * @returns {Object} - DeferredObject.
             * @example
             *       NewsModel.fetchNews().done(function(data) {
             *
             *       });
             */
            fetchNews: function () {
                fetchNewsDeferred = $.Deferred();
                fetchNews(fetchNewsDeferred);

                return fetchNewsDeferred;
            }
        };
    };

    return new NewsModel();
});