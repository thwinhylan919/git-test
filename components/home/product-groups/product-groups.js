define([

    "knockout",
    "jquery",
    "./model",
    "framework/js/constants/constants",
    "ojs/ojmasonrylayout"
], function(ko, $, ProductGroupsModel, Constants) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);
        $(window).scrollTop(0);

        let productType = self.actionCardData().productClass;

        if (self.actionCardData().productType) {
            productType = self.actionCardData().productType;
        }

        self.productHeaderImage(productType + "-product-bg");
        self.hero = ko.observableArray([]);
        self.heroImages = ko.observableArray([]);
        self.productGroupImages = ko.observableArray([]);
        self.productGroupErrorImage = ko.observable();

        self.products = ko.observableArray([]);
        self.filteredProducts = ko.observable([]);
        self.renderModuleData = ko.observable(false);
        self.module = ko.observable();
        self.pagingModel = null;
        Params.baseModel.registerComponent("product-groups-card", "home");
        $(window).scrollTop(0);

        let url;

        if (self.className() === "LOANS") {
            url = "productClass/LOANS/productGroups?isCollateralRequired=" + self.actionCardData().collateralRequired + "&productType=" + self.actionCardData().productType;
        } else if (self.className() === "CASA") {
            url = "productClass/CASA/productGroups?productType=" + self.actionCardData().productType;
        } else {
            url = "productClass/" + self.className() + "/productGroups";
        }

        ProductGroupsModel.fetchProductGroups(url).done(function(data) {
            self.filteredProducts(data.productGroups);
            self.renderModuleData(true);
        });

        document.body.style.backgroundImage = "url(" + Constants.imageResourcePath + "/origination/BG/" + (Params.baseModel.medium() ? "medium/" : "/") + self.productHeaderImage() + ".jpg)";
    };
});