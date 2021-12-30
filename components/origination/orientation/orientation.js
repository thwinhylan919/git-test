define([

    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/orientation",
    "framework/js/constants/constants",
    "ojs/ojoffcanvas",
    "ojs/ojbutton"
], function(ko, $, OrientationModelObject, resourceBundle, Constants) {
    "use strict";

    return function(rootParams) {
        const self = this,
            OrientationModel = new OrientationModelObject();

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        rootParams.baseModel.registerComponent("social-media", "social-media");

        self.initializeModel = function() {
            OrientationModel.init(self.productDetails().submissionId.value);
        };

        self.initializeModel();
        self.orientationPartial = ko.observable();

        const className = self.productDetails().productClassName;

        self.orientationPartial(className.toLowerCase().replace(/#|_/g, "-"));

        self.showPrivacyPolicy = function() {
            $("#privacyPolicy").ojDialog("open");
        };

        self.showSecurityPolicy = function() {
      $("#securityPolicy").ojDialog("open");
    };

    if (rootParams.baseModel.small() || rootParams.baseModel.medium()) {
      rootParams.dashboard.headerName(self.resource.headerName);
    }

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

            self.getNextStage();
        };

        self.exitApplication = function() {
            $("#EXITAPPLICATION").show().trigger("openModal");
        };

        const payload = {
            productClass: self.productDetails().productClassName,
            currentStep: "ORIENTATION",
            cancellationReasonsDTOs: [{
                code: "OTHERS",
                description: "OTHERS"
            }]
        };

        self.cancelApplication = function() {
            OrientationModel.saveModel(ko.toJSON(payload)).then(function() {

                rootParams.dashboard.switchModule("home", true);
            });
        };

        self.sessionStorageData = {};

        self.login = function() {
            self.sessionStorageData.productCode = self.productDetails().productCode;
            self.sessionStorageData.productDescription = self.productDetails().productDescription;
            self.sessionStorageData.collateralRequired = self.productDetails().collateralRequired;
            self.sessionStorageData.productClassName = self.productDetails().productClassName;

            if (self.productDetails().productType) {
                self.sessionStorageData.productType = self.productDetails().productType;
            }

            if (self.queryMap && self.queryMap.TransactionRefNumber) {
                self.sessionStorageData.transactionRefNumber = self.queryMap.TransactionRefNumber;
            }

            self.sessionStorageData.customer = true;
            self.sessionStorageData.loginRedirection = true;
            self.sessionStorageData.entity = Constants.currentEntity;
            self.sessionStorageData.currency = self.localCurrency;
            self.sessionStorageData.selectedOfferId = self.productDetails().selectedOfferId;

            if (self.productDetails().offers) {
                self.sessionStorageData.offers = JSON.stringify(self.productDetails().offers);
            }

            // eslint-disable-next-line no-storage/no-browser-storage
            sessionStorage.sessionStorageData = JSON.stringify(self.sessionStorageData);

            OrientationModel.deleteSession().done(function() {
                rootParams.baseModel.switchPage({
                    homeComponent: "product-base",
                    homeModule: "origination",
                    context: "index"
                }, true, true);
            });
        };
    };
});