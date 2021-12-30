define([
        "jquery",
        "baseService"
    ],
    function($, BaseService) {
        "use strict";

        const SegmentReviewModel = function() {
            const baseService = BaseService.getInstance();
            let createSegmentReviewDeferred;
            const createSegmentReview = function(requestOptions, createParams, deferred) {
                const options = {
                    url: requestOptions.url,
                    version: requestOptions.version,
                    data: requestOptions.data,
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    }
                };

                baseService.add(options, createParams);
            };

            let updateSegmentReviewDeferred;
            const updateSegmentReview = function(requestOptions, updateParams, deferred) {
                const options = {
                        url: requestOptions.url,
                        version: requestOptions.version,
                        data: requestOptions.data,
                        success: function(data, status, jqXhr) {
                            deferred.resolve(data, status, jqXhr);
                        }
                    },
                    params = updateParams;

                baseService.update(options, params);
            };

            return {
                createSegmentReview: function(requestOptions, createParams) {
                    createSegmentReviewDeferred = $.Deferred();
                    createSegmentReview(requestOptions, createParams, createSegmentReviewDeferred);

                    return createSegmentReviewDeferred;
                },
                deleteDraftReference: function(draftReferenceId) {
                    return baseService.remove({
                        url: "processManagement/{draftReferenceId}"
                    }, {
                        draftReferenceId: draftReferenceId
                    });
                },
                updateSegmentReview: function(requestOptions, updateParams) {
                    updateSegmentReviewDeferred = $.Deferred();
                    updateSegmentReview(requestOptions, updateParams, updateSegmentReviewDeferred);

                    return updateSegmentReviewDeferred;
                }

            };

        };

        return new SegmentReviewModel();
    });