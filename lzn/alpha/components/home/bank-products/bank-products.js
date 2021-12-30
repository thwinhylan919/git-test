define([
        "knockout",
        "jquery",
        "./model",
        "ojL10n!resources/nls/quick-links",
        "ojL10n!resources/nls/bank-products"
    ],
    function(ko, $, BankProductModel, resourceBundle, resourceBundleProducts) {
        "use strict";

        return function(Params) {
            const self = this;

            ko.utils.extend(self, Params.rootModel);
            self.nls = resourceBundle;
            self.resource = resourceBundleProducts;
            self.renderModuleData = ko.observable(false);
            self.productTiles = ko.observable();
            self.tiles = ko.observableArray([]);

            self.showPage = ko.observable(false);
            Params.baseModel.registerComponent("layout", "home");
            Params.baseModel.registerComponent("bank-products", "home");
            self.compName = ko.observable();
            self.compName("bank-products");
            self.productHeaderImage = ko.observable("");
            self.isLogin = ko.observable(false);
            self.userLoggedIn = ko.observable(false);
            self.homePage = ko.observable(true);
            self.label = ko.observable();
            self.context = ko.observable();
            self.userProfile = ko.observable();
            self.userRoles = ko.observableArray();

            self.actionCardData = ko.observable();
            self.type = ko.observable();
            self.className = ko.observable();
            self.productGroupData = ko.observable();
            self.showComponent = ko.observable(true);
            Params.baseModel.registerComponent("product-base", "origination");
            Params.baseModel.registerComponent("tooltip", "home");
            Params.baseModel.registerElement("row");
            Params.baseModel.registerElement("modal-window");
            Params.baseModel.registerComponent("product-groups", "home");
            Params.baseModel.registerElement("page-section");
            Params.baseModel.registerComponent("search-vehicle", "home");

            BankProductModel.fetchProductTiles().done(function(data) {
                self.productTiles(data.productTypes);
                self.renderModuleData(true);
            });

            self.switchPageProduct = function() {
                Params.dashboard.loadComponent("product-groups", self);
                self.compName("product-groups");
            };

            self.actionCardClick = function(data, cardData) {
                self.homePage(false);
                self.type(data);
                self.actionCardData(cardData);
                self.className(cardData.productClass);
                self.switchPageProduct(BankProductModel);
            };

            if (Params.dashboard.userData && Params.dashboard.userData.userProfile) {
                self.userProfile(Params.dashboard.userData.userProfile);
                self.userLoggedIn(true);
            }

            Params.baseModel.registerComponent("page-banner", "widgets/pre-login");
            Params.baseModel.registerComponent("tools-and-calculators", "home");
            Params.baseModel.registerComponent("loan-showcase", "home");
            Params.baseModel.registerComponent("goals", "home");
            Params.baseModel.registerComponent("company-links", "home");
            self.products = ko.observable("bank-products");
            self.sessionStorageData = {};

            self.loadProduct = function(productGroupData) {
                self.sessionStorageData.productCode = productGroupData.id;
                self.sessionStorageData.productDescription = productGroupData.description;
                self.sessionStorageData.productClassName = productGroupData.allowedProductClassName;
                self.sessionStorageData.inPrincipleApproval = self.actionCardData().inPrincipleApproval;
                self.sessionStorageData.productGroupMaxTerm = productGroupData.maxTerm;
                self.sessionStorageData.selectedOfferId = productGroupData.selectedOfferId;

                if (productGroupData.allowedProductClassName === "LOANS") {
                    self.sessionStorageData.collateralRequired = productGroupData.collateralRequired;
                }

                if (productGroupData.productTypeConstants) {
                    self.sessionStorageData.productType = productGroupData.productTypeConstants;
                }

                Params.baseModel.switchPage({
                    homeComponent: {
                        component: "product-base",
                        module: "origination",
                        query: {
                            context: "index"
                        }
                    }
                }, false, true, self.sessionStorageData);
            };

            self.exitApplication = function() {
                $("#EXITAPPLICATION").show().trigger("openModal");
            };

            self.cancelApplication = function() {
                Params.dashboard.switchModule("home", true);
            };
        };
    });