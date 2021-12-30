define([
    "ojs/ojcore",
    "ojL10n!resources/nls/facility-application",
    "knockout",
    "jquery",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojprogress",
    "ojs/ojinputnumber",
    "ojs/ojdatetimepicker",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojarraydataprovider"

], function(oj, resourceBundle, ko, $, AddFacilityModel) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.review = params.review;
        self.facilityTypeListOptions = ko.observableArray([]);

        self.resourceBundle = resourceBundle;
        self.mode = ko.observable("editNew");

        self.updateFlag = ko.observable(false);

        if (self.productData().data.addSubFacilityFlag()) {
            self.datasource = new oj.ArrayTableDataSource(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });
        }

        params.baseModel.registerComponent("amend-facility-panel", "credit-facility");
        params.baseModel.registerComponent("apply-new-facility-panel", "credit-facility");

        params.dashboard.headerName(self.resourceBundle.componentHeader);

        function setFacilityCategories(category) {
            if (category) {
                self.facilityTypeListOptions.push({
                    label: category.description,
                    value: category.description,
                    type: category.facilityType
                });

                if (category.subCategories && category.subCategories.length) {
                    for (let i = 0; i < category.subCategories.length; i++) {
                        setFacilityCategories(category.subCategories[i]);
                    }
                }
            }
        }

        AddFacilityModel.fetchFacilityTypes().then(function(data) {
            if (data && data.facilityCategory) {
                setFacilityCategories(data.facilityCategory);
            }
        });

        self.openMenu = function(data, event) {
            document.getElementById("menuLauncher-billerlist-contents-" + data.availableAmount.currency() + "_" + data.availableAmount.amount() + "_" + data.description()).open(event);
        };

        self.openMenuMain = function(data, event) {
            document.getElementById("menuLauncher-billerlist-contents-" + self.productData().payload.availableAmount.currency() + "_" + self.productData().payload.availableAmount.amount() + "_" + self.productData().payload.description()).open(event);
        };

        if (self.review) {
            self.facilityReviewDetails = params.rootModel.productData().payload;
            self.datasourceReview = new oj.ArrayTableDataSource(self.facilityReviewDetails.childFacilities, { idAttribute: "categoryDesc" });

        }

        self.addFacility = function() {
            params.dashboard.openRightPanel("apply-new-facility-panel", {
                flag: self.productData().data,
                mode: self.mode("addNew"),
                payload: params.rootModel.productData().payload,
                productData: self.productData
            }, self.resourceBundle.addFacility);

            params.rootModel.productData().data.flag = self.flag;

        };

        if (!self.review) {
            if (!self.productData().data.addFacilityFlag()) {
                self.addFacility();
            }
        }

        function removeFacilities(data, index, payload) {
            if (data && payload && payload.length && payload.length > 0) {
                for (let j = 0; j < payload.length; j++) {
                    if (data.availableAmount.amount() === payload[j].availableAmount.amount() && data.availableAmount.currency() === payload[j].availableAmount.currency() && data.category() === payload[j].category() && data.lineStartDate() === payload[j].lineStartDate()) {
                        payload.splice(index, 1);
                        break;
                    } else if (payload[j].childFacilities && payload[j].childFacilities().length && payload[j].childFacilities().length > 0) {
                        for (let m = 0; m < payload[j].childFacilities().length; m++) {
                            removeFacilities(data, m, payload[j].childFacilities());
                        }
                    }
                }
            }
        }

        self.menuItemSelect = function(data, index, event) {
            $("#menuLauncher-billerlist-contents-").hide();
            self.selectedBillerId = data.id;

            const menuId = event.target.value;

            if (menuId === "addSubFacilityMain") {
                if (!self.productData().data.addSubFacilityFlag()) {
                    self.datasource = new oj.ArrayTableDataSource(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });
                }

                params.dashboard.openRightPanel("apply-new-facility-panel", {
                    payload: params.rootModel.productData().payload,
                    mode: self.mode(menuId),
                    datasource: self.datasource,
                    flag: self.productData().data,
                    productData: self.productData

                }, self.resourceBundle.addSubFacility);

            } else if (menuId === "editDetails") {
                params.dashboard.openRightPanel("apply-new-facility-panel", {
                    payload: params.rootModel.productData().payload,
                    updateFlag: self.updateFlag,
                    mode: self.mode(menuId),
                    flag: self.productData().data,
                    productData: self.productData

                }, self.resourceBundle.editFacilityDetails);

            } else if (menuId === "editFacility") {
                params.dashboard.openRightPanel("apply-new-facility-panel", {
                    payload: params.rootModel.productData().payload,
                    updateFlag: self.updateFlag,
                    mode: self.mode(menuId),
                    flag: self.productData().data,
                    data: data
                }, self.resourceBundle.editFacilityDetails);
            } else if (menuId === "removeFacility") {
                removeFacilities(data, index, self.productData().payload.childFacilities());
                self.datasource.reset(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });

                if (self.productData().payload.childFacilities().length === 0) {
                    self.productData().data.addSubFacilityFlag(false);
                }
            } else if (menuId === "removeFacilityMain") {
                self.productData().payload = {};
                self.productData().data.addFacilityFlag(false);
            } else if (menuId === "addSubFacility") {
                if (!self.productData().data.addSubFacilityFlag()) {
                    self.datasource = new oj.ArrayTableDataSource(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });
                }

                self.datasourceNew = new oj.ArrayTableDataSource(data.childFacilities, { idAttribute: "categoryDesc" });

                params.dashboard.openRightPanel("apply-new-facility-panel", {
                    data: data,
                    mode: self.mode(menuId),
                    payload: params.rootModel.productData().payload,
                    datasource: self.datasource,
                    datasourceNew: self.datasourceNew,
                    productData: self.productData
                }, self.resourceBundle.addSubFacility);

            }

        };

        self.datasourceNewCreate = function(data) {
            self.datasourceNew = new oj.ArrayTableDataSource(data.childFacilities, { idAttribute: "categoryDesc" });

            return self.datasourceNew;
        };

        self.findFacilityType = function(data) {
            for (let i = 0; i < self.facilityTypeListOptions().length; i++) {
                if (data === self.facilityTypeListOptions()[i].value) {
                    return self.facilityTypeListOptions()[i].label;

                }
            }
        };

        self.menuItemsMain = [{
                id: "addSubFacilityMain",
                label: self.resourceBundle.addSubFacility

            },
            {
                id: "editDetails",
                label: self.resourceBundle.editFacility

            },
            {
                id: "removeFacilityMain",
                label: self.resourceBundle.removeFacility

            }
        ];

        self.menuItems = [{
                id: "addSubFacility",
                label: self.resourceBundle.addSubFacility

            },
            {
                id: "editFacility",
                label: self.resourceBundle.editFacility

            },
            {
                id: "removeFacility",
                label: self.resourceBundle.removeFacility

            }
        ];

        self.calculateYears = function(data) {
            const one_day = 1000 * 60 * 60 * 24,
                diff = (new Date(data.expiryDate())).getTime() - (new Date(data.lineStartDate())).getTime(),

                days = Math.round(diff / one_day);

            return Math.floor(days / 365);
        };

        self.calculateMonths = function(data) {
            const one_day = 1000 * 60 * 60 * 24,
                diff = (new Date(data.expiryDate())).getTime() - (new Date(data.lineStartDate())).getTime(),

                days = Math.floor(diff / one_day);

            return Math.floor((days % 365) / 30);
        };

        params.rootModel.successHandler = function() {

            return new Promise(function(resolve) {
                if (self.productData().data.addFacilityFlag()) {

                    resolve();
                } else {
                    const s = [];

                    s.push(self.resourceBundle.createWarningMessage);
                    params.baseModel.showMessages(null, s, "ERROR");
                }

            });

        };
    };
});