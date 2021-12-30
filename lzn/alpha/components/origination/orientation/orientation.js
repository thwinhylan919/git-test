define([

    "knockout",
    "jquery",
    "./model",

    "ojL10n!lzn/alpha/resources/nls/orientation",
    "ojs/ojoffcanvas",
    "ojs/ojbutton"
], function(ko, $, OrientationModelObject, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            OrientationModel = new OrientationModelObject();

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        rootParams.baseModel.registerComponent("social-media", "social-media");

        self.loadNextStage = function(socialMediaResponse) {
            self.socialMediaResponse({});

            if (socialMediaResponse.values) {
                self.socialMediaResponse().firstName = socialMediaResponse.values[0].firstName;
                self.socialMediaResponse().lastName = socialMediaResponse.values[0].lastName;
                self.socialMediaResponse().email = socialMediaResponse.values[0].emailAddress;
                self.socialMediaResponse().location = socialMediaResponse.values[0].location;
            } else {
                self.socialMediaResponse().firstName = socialMediaResponse.first_name;
                self.socialMediaResponse().lastName = socialMediaResponse.last_name;
                self.socialMediaResponse().email = socialMediaResponse.email;
                self.socialMediaResponse().gender = socialMediaResponse.gender;
            }

            if (self.productDetails().productClassName === "CREDIT_CARD") {
                require(["lzn/alpha/components/origination/requirements"], function(RequirementViewModel) {
                    rootParams = {
                        rootModel: self,
                        baseModel: rootParams.baseModel
                    };

                    new RequirementViewModel.viewModel(rootParams);
                });
            } else {
                self.getNextStage();
            }
        };

        self.orientationPartial = ko.observable();

        const className = self.productDetails().productClassName;

        self.orientationPartial(className.toLowerCase().replace(/#|_/g, "-"));

        self.openPrivacyPolicy = function() {
            $("#privacyAndSecurityPolicy").trigger("openModal");
        };

        self.showPrivacyPolicy = function() {
            $("#privacyPolicy").ojDialog("open");
        };

        self.showSecurityPolicy = function() {
            $("#securityPolicy").ojDialog("open");
        };

        self.exitApplication = function() {
            $("#EXITAPPLICATION").trigger("openModal");
        };

        self.save = function() {

            rootParams.dashboard.switchModule("home", true);
        };

        self.sessionStorageData = {};
        self.sessionStorageOfferData = {};

        self.login = function() {
            self.sessionStorageData.productCode = self.productDetails().productCode;
            self.sessionStorageData.productType = self.productDetails().productType;
            self.sessionStorageData.productDescription = self.productDetails().productDescription;
            self.sessionStorageData.collateralRequired = self.productDetails().collateralRequired;
            self.sessionStorageData.productClassName = self.productDetails().productClassName;

            if (self.productDetails().offers) {
                self.sessionStorageOfferData.offers = ko.toJSON(self.productDetails().offers);
                self.sessionStorageOfferData.selectedOfferId = self.productDetails().selectedOfferId;

                if (self.productDetails().offerCurrencies) {
                    self.sessionStorageOfferData.offerCurrencies = ko.toJSON(self.productDetails().offerCurrencies);
                }
            }

            self.sessionStorageOfferData.productCodeTD = self.productDetails().productCodeTD;
            self.sessionStorageOfferData.productCodeCASA = self.productDetails().productCodeCASA;
            self.sessionStorageData.inPrincipleApproval = self.productDetails().inPrincipleApproval;
            self.sessionStorageData.loginRedirection = true;
            // eslint-disable-next-line no-storage/no-browser-storage
            sessionStorage.sessionStorageData = JSON.stringify(self.sessionStorageData);

            OrientationModel.deleteSession().done(function() {
                rootParams.baseModel.switchPage({
                    homeComponent: {
                        component: "product-base",
                        module: "origination",
                        query: {
                            context: "index"
                        }
                    }
                }, true, true);
            });
        };
    };
});