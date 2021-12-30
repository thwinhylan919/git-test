define([
    "ojL10n!resources/nls/amend-facility",
    "knockout",
    "ojs/ojcore",
    "jquery",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource"
], function(resourceBundle, ko, oj, $, Model) {
    "use strict";

    return function(params) {
        const self = this;

        self.nls = resourceBundle;
        self.newCollateralsArray = ko.observableArray([]);
        self.newcollateralListDataLoaded = ko.observable(false);
        self.liabilityliabilityIdcollateralgetVar = ko.observable();

        if (params.rootModel.productData().payload.collateralDetails) {
            if (Array.isArray(params.rootModel.productData().payload.collateralDetails)) {
                self.newCollateralsArray(params.rootModel.productData().payload.collateralDetails);
            } else {
                self.newCollateralsArray(params.rootModel.productData().payload.collateralDetails());

            }

            self.newcollateralListDataLoaded(true);
        }

        self.newCollateralsArrayReview = ko.observableArray([]);
        self.review = params.review;
        self.mode = ko.observable("add");

        if (self.review && params.rootModel.productData().payload.collateralDetails) {
            if (Array.isArray(params.rootModel.productData().payload.collateralDetails)) {
                self.newCollateralsArrayReview(params.rootModel.productData().payload.collateralDetails);
            } else {
                self.newCollateralsArrayReview(params.rootModel.productData().payload.collateralDetails());

            }

            self.newCollateralsDataSource = new oj.ArrayTableDataSource(self.newCollateralsArrayReview, { idAttribute: "collateralType" });

        } else {
            self.newCollateralsDataSource = new oj.ArrayTableDataSource(self.newCollateralsArray, { idAttribute: "collateralType" });
        }

        self.menuItems = [{
                id: "edit",
                label: self.nls.AmendFacility.edit
            },
            {
                id: "remove",
                label: self.nls.AmendFacility.remove
            }
        ];

        self.menuItemSelect = function(data, index, event) {
            $("#menuLauncher-billerlist-contents-").hide();
            self.selectedBillerId = data.id;

            const menuId = event.target.value;

            if (menuId === "edit") {

                params.dashboard.openRightPanel("add-collateral", {
                    newCollateralsArray: self.newCollateralsArray,
                    newcollateralListDataLoaded: self.newcollateralListDataLoaded,
                    mode: self.mode(menuId),
                    data: data
                }, self.nls.AmendFacility.AddCollaterals);

            } else if (menuId === "remove") {
                self.newCollateralsArray.splice(index, 1);

            }

        };

        self.openMenu = function(data, event) {
            document.getElementById("menuLauncher-billerlist-contents-" + data.collateralType() + "-" + data.collateralDesc()).open(event);
        };

        self.collateralListDataLoaded = ko.observable(false);
        params.baseModel.registerComponent("add-collateral", "credit-facility");

        self.listData = ko.observableArray([]);

        Model.fetchLiabilityId().done(function(data) {
            params.rootModel.productData().createParams = {
                liabilityId: data.liabilitydtos[0].id
            };

            Model.liabilityliabilityIdcollateralget(data.liabilitydtos[0].partyId, data.liabilitydtos[0].branch, "INR", data.liabilitydtos[0].id).then(function(response) {
                self.liabilityliabilityIdcollateralgetVar(response);
                self.listData(response.collateraldtos);
                self.try();
                self.collateralListDataLoaded(true);

            });
        });

        self.try = function() {
            self.dataSource36 = new oj.ArrayTableDataSource(self.listData, { idAttribute: "collateralCode" });
        };

        self.onClickCancel23 = function() {
            params.dashboard.switchModule();
        };

        self.addCollaterals = function() {
            params.dashboard.openRightPanel("add-collateral", {
                newCollateralsArray: self.newCollateralsArray,
                newcollateralListDataLoaded: self.newcollateralListDataLoaded,
                newCollateralsDataSource: self.newCollateralsDataSource
            }, self.nls.AmendFacility.AddCollaterals);

            const collateralDetailsone = self.newCollateralsArray();

            params.rootModel.productData().payload.collateralDetails = collateralDetailsone;
        };

        params.rootModel.successHandler = function() {

            return new Promise(function(resolve) {
                resolve();
            });
        };
    };

});