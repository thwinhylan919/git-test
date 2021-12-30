define([
        "knockout",
        "jquery",
        "./model",
        "framework/js/configurations/config",
        "ojL10n!resources/nls/product-offers"
    ],
    function (ko, $, OffersModel, constants, resourceBundle) {
        "use strict";

        return function (rootParams) {
            const self = this;
            let i = 0;
            const getNewKoModel = function () {
                const KoModel = OffersModel.getNewModel();

                return KoModel;
            };

            ko.utils.extend(self, rootParams.rootModel);
            self.applicantObject = rootParams.applicantObject;
            self.dataLoaded = ko.observable(false);
            self.offers = ko.observable();
            self.resource = resourceBundle;
            self.noOffers = ko.observable(false);
            self.offerSelected = ko.observable(false);
            self.imageResourcePath = constants.imageResourcePath;

            if (!self.productDetails().offers) {
                self.productDetails().offers = getNewKoModel();
            }

            let requirementPayload = {};

            OffersModel.init(self.productDetails().submissionId.value, self.productDetails().productCode);

            OffersModel.getOffers().done(function (data) {
                if (data.products && data.products[0] && data.products[0].offers) {
                    self.offers(data.products[0].offers);
                }

                for (i = 0; i < self.offers().length; i++) {
                    self.offers()[i].selected = ko.observable(false);
                }

                if ($.isEmptyObject(data.products[0].offers)) {
                    self.noOffers(true);

                    return;
                }

                self.dataLoaded(true);

                OffersModel.fetchRequirements().done(function (data) {
                    if (!$.isEmptyObject(data.loanApplicationRequirementDTO)) {
                        requirementPayload = JSON.parse(JSON.stringify(data.loanApplicationRequirementDTO));

                        OffersModel.fetchSubmissionSummary().done(function (data) {
                            if (data.offerId) {
                                for (i = 0; i < self.offers().length; i++) {
                                    if (self.offers()[i].offerCode === data.offerId) {
                                        $("#offer" + i).addClass("selected");
                                        self.offers()[i].selected(true);
                                        self.offerSelected(true);
                                        self.productDetails().offers.offerId = data.offerId;
                                    }
                                }
                            }
                        });
                    }
                });
            });

            self.submitProductOffer = function (index, offerCode) {
                $("#offer" + index).toggleClass("selected");
                self.offers()[index].selected(!self.offers()[index].selected());

                for (i = 0; i < self.offers().length; i++) {
                    if (index !== i) {
                        $("#offer" + i).removeClass("selected");
                        self.offers()[i].selected(false);
                    }
                }

                for (i = 0; i < self.offers().length; i++) {
                    if (self.offers()[i].offerCode === offerCode) {
                        self.productDetails().offers.features = self.offers()[i].features;
                        self.productDetails().offers.offerName = self.offers()[i].offerName;
                        self.productDetails().offers.offerId = offerCode;
                        self.offers()[i].selected(false);
                        self.offerSelected(false);

                        if ($("#offer" + i).attr("class").match("selected")) {
                            self.offerSelected(true);
                            self.offers()[i].selected(true);
                        }
                    }
                }
            };

            self.continue = function () {
                if (self.offerSelected()) {
                    if (!self.productDetails().offers.offerName) {
                        for (i = 0; i < self.offers().length; i++) {
                            if (self.offers()[i].offerCode === self.productDetails().offers.offerId) {
                                self.productDetails().offers.offerName = self.offers()[i].offerName;
                            }
                        }
                    }

                    requirementPayload.offerId = self.productDetails().offers.offerId;

                    const url = "submissions/{submissionId}/loanApplications";

                    OffersModel.submitRequirements(url, self.toCleanJson(requirementPayload)).done(function () {
                        self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
                    });
                } else {
                    $("#offerSelect").trigger("openModal");
                }
            };
        };
    });