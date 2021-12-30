define([

        "knockout",
        "jquery",
        "./model",
        "ojL10n!resources/nls/offers-panel",
        "framework/js/constants/constants",
        "ojs/ojcheckboxset",
        "ojs/ojconveyorbelt",
        "ojs/ojbutton"
    ],
    function(ko, $, OffersModel, resourceBundle, Constants) {
        "use strict";

        return function(rootParams) {
            const self = this;

            ko.utils.extend(self, rootParams.rootModel);
            self.resource = resourceBundle;

            self.dataLoaded = ko.observable(false);
            self.productClass = ko.observable(self.params.actionCardData.productClass.toLowerCase().replace(/#|_/g, "-"));
            self.productHeaderImage = ko.observable();

            let productHeader = self.params.actionCardData.productClass;

            if (self.params.actionCardData.productType) {
                productHeader = self.params.actionCardData.productType;
            }

            self.productHeaderImage(productHeader + "-product-bg");
            self.additionalOfferDetailsLoaded = ko.observable(false);
            self.offers = ko.observableArray();
            self.currentProductOffers = ko.observable();
            self.currentProductOfferDetails = ko.observable();
            self.maxOffersToCompare = 3;
            self.offerDetails = {};
            self.firstOffer = ko.observable();
            self.offerAdditionalDetails = {};
            self.sessionStorageData = {};
            self.offerIdsToCompare = ko.observableArray();
            self.comparisonArrayUpdated = ko.observable(false);
            self.isOfferLoaded = ko.observable(false);
            self.wantsToCompare = ko.observable(false);
            self.showAdditionalDetails = ko.observable(false);
            self.showComparison = ko.observable(false);
            self.offerAdditionalDetailsAvailable = false;

            let productType;

            switch (self.params.actionCardData.productClass) {
                case "CREDIT_CARD":
                    productType = "CC";
                    break;
                case "CASA":
                    productType = "CASA";
                    break;
                case "TERM_DEPOSITS":
                    productType = "TD";
                    break;
                default:
                    break;
            }

            self.offerDetailsToCompare = ko.observableArray();

            rootParams.dashboard.headerName(rootParams.baseModel.format(self.resource.ptOffers, {
                productType: self.resource.productType[self.params.productGroupData.productTypeConstants]
            }));

            OffersModel.init(self.params.productGroupData.id);

            OffersModel.getOffers().done(function(data) {
                let productIndex, offerIndex;

                for (productIndex = 0; productIndex < data.products.length; productIndex++) {
                    if (data.products[productIndex].offers) {
                        for (offerIndex = 0; offerIndex < data.products[productIndex].offers.length; offerIndex++) {
                            data.products[productIndex].offers[offerIndex].isOfferDetails = ko.observable(false);
                            data.products[productIndex].offers[offerIndex].showOffers = ko.observable(self.resource.more);
                            data.products[productIndex].offers[offerIndex].selectedCurrency = ko.observable();

                            if (!data.products[productIndex].offers[offerIndex].offerName) {
                                data.products[productIndex].offers[offerIndex].offerName = data.products[productIndex].offers[offerIndex].offerCode;
                            }

                            self.offers().push(data.products[productIndex].offers[offerIndex]);
                            self.offerDetails[data.products[productIndex].offers[offerIndex].offerId] = data.products[productIndex].offers[offerIndex];
                        }
                    }
                }

                self.currentProductOffers(self.offers()[0]);

                for (offerIndex = 0; offerIndex < self.offers().length; offerIndex++) {
                    if ($.inArray(rootParams.dashboard.appData.localCurrency, self.offers()[offerIndex].allowedCurrencies) > -1) {
                        self.offers()[offerIndex].selectedCurrency(rootParams.dashboard.appData.localCurrency);
                    } else if (self.offers()[offerIndex].allowedCurrencies.length > 0) {
                        self.offers()[offerIndex].selectedCurrency(self.offers()[offerIndex].allowedCurrencies[0]);
                    }
                }

                self.dataLoaded(true);
            });

            self.fetchOfferDetails = function(event) {
                const offerCode = self.offers()[event.detail.value].offerCode;

                self.currentProductOffers(self.offerDetails[offerCode]);

                const indexOfOffer = self.offerIdsToCompare().indexOf(offerCode);

                if (indexOfOffer >= 0) {
                    self.wantsToCompare(true);
                } else {
                    self.wantsToCompare(false);
                }
            };

            self.sessionStorageOfferData = {};

            self.fetchOfferAdditionalDetails = function(offer, index) {
                self.additionalOfferDetailsLoaded(false);

                let offerDetailsAvailable = false;

                if (self.offerAdditionalDetails[offer.offerCode]) {
                    offerDetailsAvailable = true;
                }

                if (!offerDetailsAvailable) {
                    OffersModel.fetchOffersAdditionalDetails(offer.offerCode, productType).done(function(data) {
                        self.offerAdditionalDetails[offer.offerCode] = data;

                        if (!self.offerAdditionalDetails[offer.offerCode].selectedCurrencyIndex) {
                            self.offerAdditionalDetails[offer.offerCode].selectedCurrencyIndex = 0;
                        }

                        self.currentProductOfferDetails(data);
                        self.additionalOfferDetailsLoaded(true);

                        if (self.isOfferLoaded()) {
                            self.offers()[index].isOfferDetails(false);
                            self.submitProductOffer(offer);
                        } else {
                            self.offers()[index].isOfferDetails(true);
                        }
                    });
                } else {
                    if (!self.offerAdditionalDetails[offer.offerCode].selectedCurrencyIndex) {
                        self.offerAdditionalDetails[offer.offerCode].selectedCurrencyIndex = 0;
                    }

                    self.currentProductOfferDetails(self.offerAdditionalDetails[offer.offerCode]);
                    self.additionalOfferDetailsLoaded(true);

                    if (self.isOfferLoaded()) {
                        self.offers()[index].isOfferDetails(false);
                        self.submitProductOffer(offer);
                    } else {
                        self.offers()[index].isOfferDetails(true);
                    }
                }
            };

            self.submitOffer = function(index, data1) {
                OffersModel.fetchOffersAdditionalDetails(data1.offerCode, productType).done(function(data) {
                    data1.offerAdditionalDetails = data.offerDetailsDTO;
                    self.submitProductOffer(index, data1);
                });
            };

            self.submitProductOffer = function(index, data) {
                self.sessionStorageOfferData = data;
                self.selectedOfferId = data.offerCode;

                const productGroupData = self.params.productGroupData;

                productGroupData.selectedCurrency = self.offers()[index].selectedCurrency();

                if (!self.params.userLoggedIn) {
                    OffersModel.createSession().done(function() {
                        self.loadProduct(productGroupData);
                    });
                } else {
                    self.loadProduct(productGroupData);
                }
            };

            self.showMoreDetails = function(data, index) {
                if (!self.showAdditionalDetails()) {
                    self.additionalOfferDetailsLoaded(false);
                    self.fetchOfferAdditionalDetails(data, index);
                    self.showAdditionalDetails(true);
                    self.offers()[index].showOffers(self.resource.less);
                } else {
                    self.showAdditionalDetails(false);
                    self.offers()[index].isOfferDetails(false);
                    self.offers()[index].showOffers(self.resource.more);
                }
            };

            const getMinBalanceAmountForCurrency = function(selectedCurrency, offerData, offerAdditionalDetails) {
                if(offerData.productClass!=="CREDIT_CARD"){
                for (let i = 0; i < offerAdditionalDetails.offerDetailsDTO.currencySpecificParameterDTOList.length; i++) {
                    if (selectedCurrency === offerAdditionalDetails.offerDetailsDTO.currencySpecificParameterDTOList[i].currencyCode) {
                        offerAdditionalDetails.selectedCurrencyIndex = i;
                        break;
                    }
                }
            }else{

                for (let i = 0; i < offerAdditionalDetails.offerDetailsDTO.allowedCurrencies.length; i++) {
                    if (selectedCurrency === offerAdditionalDetails.offerDetailsDTO.allowedCurrencies[i]) {
                        offerAdditionalDetails.selectedCurrencyIndex = i;
                        break;
                    }
                }
            }

                if (offerData.isOfferDetails()) {
                    offerData.isOfferDetails(false);
                    ko.tasks.runEarly();
                    offerData.isOfferDetails(true);
                }
            };

            self.currencyChangedHandler = function(event, offerData) {
                if (!offerData.offerAdditionalDetailsAvailable) {
                    OffersModel.fetchOffersAdditionalDetails(offerData.offerCode, productType).done(function(data) {
                        self.offerAdditionalDetails[offerData.offerCode] = data;
                        offerData.offerAdditionalDetailsAvailable = true;
                        getMinBalanceAmountForCurrency(event.detail.value, offerData, self.offerAdditionalDetails[offerData.offerCode]);
                    });
                } else {
                    getMinBalanceAmountForCurrency(event.detail.value, offerData, self.offerAdditionalDetails[offerData.offerCode]);
                }
            };

            self.loadProduct = function(productGroupData) {
                self.sessionStorageData.productCode = productGroupData.id;
                self.sessionStorageData.productDescription = productGroupData.description;
                self.sessionStorageData.productClassName = productGroupData.allowedProductClassName;
                self.sessionStorageData.inPrincipleApproval = self.params.actionCardData.inPrincipleApproval;
                self.sessionStorageData.productGroupMaxTerm = productGroupData.maxTerm;
                self.sessionStorageData.selectedOfferId = self.selectedOfferId;
                self.sessionStorageData.selectedCurrency = productGroupData.selectedCurrency;

                if (productGroupData.productTypeConstants) {
                    self.sessionStorageData.productType = productGroupData.productTypeConstants;
                }

                rootParams.dashboard.loadComponent("product-base", self);
            };

            document.body.style.backgroundImage = "url(" + Constants.imageResourcePath + "/origination/BG/" + (rootParams.baseModel.medium() ? "medium/" : "/") + self.productHeaderImage() + ".jpg)";

            self.showEffect = function(id) {
                $("#" + id).css("opacity", "0.7");
            };

            self.hideEffect = function(id) {
                $("#" + id).css("opacity", "1");
            };

            self.hoverMoreDetails = function(id) {
                $("#" + id).addClass("more-details-hover");
            };

            self.hoverOutMoreDetails = function(id) {
                $("#" + id).removeClass("more-details-hover");
            };
        };
    });