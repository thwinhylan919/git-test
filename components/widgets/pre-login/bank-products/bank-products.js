define([
        "knockout",
        "jquery",
        "./model",
        "ojL10n!resources/nls/quick-links",
        "ojL10n!resources/nls/bank-products",
        "ojs/ojfilmstrip"
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

            self.currentNavArrowPlacement = ko.observable("adjacent");
            self.currentNavArrowVisibility = ko.observable("auto");

            if (Params.baseModel.small() || Params.baseModel.medium()) {
                Params.dashboard.headerName(self.resource.headerName);
            }

            BankProductModel.fetchProductTiles().done(function(data) {
                self.productTiles(data.productTypes);
                self.renderModuleData(true);
            });

            self.switchPageProduct = function() {
                const productGroupData = {
                    allowedProductClassName: self.actionCardData().productClass,
                    creditPolicyTemplate: "USCP01",
                    description: self.resource.productGroupDescription[self.actionCardData().productType],
                    id: "LOAN-UN",
                    collateralRequired: false,
                    maxTerm: 84,
                    minTerm: 12,
                    productTypeConstants: self.actionCardData().productType
                };
                let url;

                if (self.className() === "LOANS") {
                    url = "productClass/LOANS/productGroups?isCollateralRequired=" + self.actionCardData().collateralRequired + "&productType=" + self.actionCardData().productType;
                } else if (self.className() === "CASA") {
                    url = "productClass/CASA/productGroups?productType=" + self.actionCardData().productType;
                }else if (self.className() === "CREDIT_CARD") {
                    url = "productClass/CASA/productGroups?productType=" + self.actionCardData().productClass;
                } else {
                    url = "productClass/" + self.className() + "/productGroups";
                }

                self.productGroupData = ko.observable();
                Params.baseModel.registerComponent("offers-panel", "home");

                BankProductModel.fetchProductGroups(url).done(function(data) {
                    if (data && data.productGroups && data.productGroups[0]) {
                        self.productGroupData(productGroupData);
                        self.productGroupData().id = data.productGroups[0].id;
                        self.productGroupData().maxTerm = data.productGroups[0].maxTerm;
                        self.productGroupData().minTerm = data.productGroups[0].minTerm;

                        if (self.actionCardData().productClass !== "LOANS") {
                            Params.dashboard.loadComponent("offers-panel", {
                                productGroupData: self.productGroupData(),
                                actionCardData: self.actionCardData(),
                                userLoggedIn: self.userLoggedIn()
                            });
                        } else if (self.actionCardData().productType === "AUTOMOBILE") {
                            BankProductModel.fetchDealerList().done(function(data) {
                                if (data.listDealers.length > 0) {
                                    self.dealerDetails = data.listDealers;
                                    Params.dashboard.loadComponent("search-vehicle", self);
                                    self.compName("search-vehicle");
                                } else if (!self.userLoggedIn()) {
                                    BankProductModel.createSession().done(function() {
                                        self.loadProduct(productGroupData);
                                    });
                                } else {
                                    self.loadProduct(productGroupData);
                                }
                            });
                        } else if (!self.userLoggedIn()) {
                            BankProductModel.createSession().done(function() {
                                self.loadProduct(productGroupData);
                            });
                        } else {
                            self.loadProduct(productGroupData);
                        }
                    }
                });
            };

            self.actionCardClick = function(cardData) {
                self.homePage(false);
                self.actionCardData(cardData);
                self.className(cardData.productClass);
                self.switchPageProduct(BankProductModel);
            };

            if (Params.dashboard.userData && Params.dashboard.userData.userProfile) {
                self.userProfile(Params.dashboard.userData.userProfile);
                self.userLoggedIn(true);
            }

            self.products = ko.observable("bank-products");
            self.sessionStorageData = {};

            self.loadProduct = function(productGroupData) {
                self.sessionStorageData.productCode = productGroupData.id;
                self.sessionStorageData.productDescription = productGroupData.description;
                self.sessionStorageData.productClassName = productGroupData.allowedProductClassName;
                self.sessionStorageData.inPrincipleApproval = self.actionCardData().inPrincipleApproval;
                self.sessionStorageData.productGroupMaxTerm = productGroupData.maxTerm;
                self.sessionStorageData.selectedOfferId = productGroupData.selectedOfferId;
                self.sessionStorageData.selectedCurrency = productGroupData.selectedCurrency;

                if (productGroupData.allowedProductClassName === "LOANS") {
                    self.sessionStorageData.collateralRequired = productGroupData.collateralRequired;
                    self.sessionStorageData.selectedOfferId = productGroupData.selectedOfferId;
                }

                if (productGroupData.productTypeConstants) {
                    self.sessionStorageData.productType = productGroupData.productTypeConstants;
                }

                Params.dashboard.loadComponent("product-base", self);
            };

            self.exitApplication = function() {
                $("#EXITAPPLICATION").show().trigger("openModal");
            };

            self.cancelApplication = function() {
                Params.dashboard.switchModule("home", true);
            };
        };
    });