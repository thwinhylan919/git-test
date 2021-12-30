define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/segment-review",
    "ojs/ojknockout",
    "ojs/ojbutton",
    "ojs/ojaccordion",
    "ojs/ojanimation"
], function(oj, ko, $, SegmentReviewModel, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        self.nls = resourceBundle;
        self.back = params.rootModel.params.back;
        self.productData = ko.observable(params.rootModel.params.productData);
        self.goToSegment = params.rootModel.params.goToSegment;
        self.flagTermAndCondition = ko.observable();
        params.dashboard.headerName(params.rootModel.params.pageHeader);

        const panel = document.getElementById("panel"),
            initHeight = $(panel).css("height");

        self.buttonClick = function(id, event) {
            const segment = document.getElementById(id);

            if (segment.style.display === "block") {
                // Call the collapse method, then hide the extra content when animation ends.
                event.currentTarget.children[0].children[0].children[0].innerText = self.nls.showMore;

                oj.AnimationUtils.collapse(panel, {
                    endMaxHeight: initHeight
                }).then(function() {
                    segment.style.display = "none";
                });
            } else {
                // Mark the extra content to be displayed, followed by a call to the expand method.
                segment.style.display = "block";
                event.currentTarget.children[0].children[0].children[0].innerText = self.nls.showLess;

                oj.AnimationUtils.expand(panel, {
                    startMaxHeight: initHeight
                });
            }
        };

        self.confirm = function() {
            if (self.flagTermAndCondition()) {
                if (self.flagTermAndCondition()[0] === "checked") {
                    const options = {
                        url: self.productData().rests.review.url,
                        version: self.productData().rests.review.version,
                        data: ko.mapping.toJSON(self.productData().payload),
                        mode: self.productData().rests.review.mode || "create"
                    };

                    if (options.mode === "create") {
                        const createParams = self.productData().createParams;

                        SegmentReviewModel.createSegmentReview(options, createParams).done(function(data, status, jqXhr) {

                            if (status === "success" && self.productData().data.refId) {
                                SegmentReviewModel.deleteDraftReference(self.productData().data.refId);
                            }

                            params.baseModel.registerComponent(self.productData().confirmPage, self.productData().module);

                            params.dashboard.loadComponent(self.productData().confirmPage, {
                                data: data,
                                status: status,
                                jqXhr: jqXhr
                            }, self);
                        });
                    } else {
                        const updateParams = self.productData().updateParams;

                        SegmentReviewModel.updateSegmentReview(options, updateParams).done(function(data, status, jqXhr) {
                            params.baseModel.registerComponent(self.productData().confirmPage, self.productData().module);

                            params.dashboard.loadComponent(self.productData().confirmPage, {
                                data: data,
                                status: status,
                                jqXhr: jqXhr
                            }, self);
                        });

                    }
                } else {
                    params.baseModel.showMessages(null, [self.nls.errorForTermsAndCondition], "ERROR");
                }
            } else {
                params.baseModel.showMessages(null, [self.nls.errorForTermsAndCondition], "ERROR");
            }

        };

        self.showTermAndConditions = function() {
            $("#termsAndConditons").trigger("openModal");
        };

        self.closeTermAndConditionDialog = function() {
            $("#termsAndConditons").hide();
        };

    };
});