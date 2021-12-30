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
    "ojs/ojdatetimepicker"

], function(oj, resourceBundle, ko, $, AddFacilityModel) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.review = params.review;

        self.resourceBundle = resourceBundle;
        self.data = self.productData().data;
        self.facilityTypeListOptions = ko.observableArray([]);
        self.dataLoaded = ko.observable(false);

        self.findFacilityCode = function(data) {
            for (let i = 0; i < self.facilityTypeListOptions().length; i++) {
                if (data === self.facilityTypeListOptions()[i].label) {
                    return self.facilityTypeListOptions()[i].value;
                }
            }
        };

        const flag = {
            addFacilityFlag: ko.observable(false),
            addSubFacilityFlag: ko.observable(false),
            updateAmountFlag: ko.observable(false),
            updateDateFlag: ko.observable(false),
            updateBankInstructionsFlag: ko.observable(false)
        };

        if (self.productData().data.type === "Facility Amendment") {
            self.productData().updateParams = {
                liabilityId: self.productData().data.liabilityNumber,
                facilityId: self.productData().data.lineCode
            };
        }

        self.mode = ko.observable("");

        if (!self.productData().data.flag) {
            self.productData().data.flag = flag;

        }

        params.baseModel.registerElement("segment-container");

        params.baseModel.registerComponent("amend-facility-panel", "credit-facility");
        params.baseModel.registerComponent("apply-new-facility-panel", "credit-facility");

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
            document.getElementById("menuLauncher-billerlist-contents-" + ko.mapping.toJS(self.productData().payload.lineCode) + "_1").open(event);
        };

        if (self.review) {
            self.facilityReviewDetails = params.rootModel.productData().payload;
            self.datasourceReview = new oj.ArrayTableDataSource(self.facilityReviewDetails.childFacilities, { idAttribute: "categoryDesc" });

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
                if (!self.productData().data.flag.addSubFacilityFlag()) {
                    self.datasource = new oj.ArrayTableDataSource(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });
                }

                params.dashboard.openRightPanel("apply-new-facility-panel", {
                    payload: params.rootModel.productData().payload,
                    mode: self.mode(menuId),
                    datasource: self.datasource,
                    flag: self.productData().data.flag,
                    productData: self.productData

                }, self.resourceBundle.addSubFacility);

            } else if (menuId === "editDetails") {
                params.dashboard.openRightPanel("amend-facility-panel", {
                    facilityPayload: self.facilityPayload || self.productData().payload,
                    data: self.facilityData(),
                    updateAmountFlag: self.productData().data.flag.updateAmountFlag,
                    updateDateFlag: self.productData().data.flag.updateDateFlag,
                    updateBankInstructionsFlag: self.productData().data.flag.updateBankInstructionsFlag,
                    payload: params.rootModel.productData().payload,
                    productData: self.productData()
                }, self.resourceBundle.editFacilityDetails);

            } else if (menuId === "editFacility") {
                params.dashboard.openRightPanel("apply-new-facility-panel", {
                    data: data,
                    mode: self.mode(menuId),
                    payload: params.rootModel.productData().payload,
                    flag: self.productData().data.flag,
                    productData: self.productData
                }, self.resourceBundle.editFacilityDetails);
            } else if (menuId === "addSubFacility") {
                if (!self.productData().data.flag.addSubFacilityFlag()) {
                    self.datasource = new oj.ArrayTableDataSource(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });
                }

                self.datasourceNew = new oj.ArrayTableDataSource(data.childFacilities, { idAttribute: "categoryDesc" });

                params.dashboard.openRightPanel("apply-new-facility-panel", {
                    data: data,
                    mode: self.mode(menuId),
                    payload: params.rootModel.productData().payload,
                    datasource: self.datasource,
                    datasourceNew: self.datasourceNew,
                    flag: self.productData().data.flag,
                    productData: self.productData
                }, self.resourceBundle.addSubFacility);

            } else if (menuId === "removeFacility") {
                removeFacilities(data, index, self.productData().payload.childFacilities());

                self.datasource.reset(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });

                if (self.productData().payload.childFacilities().length === 0) {
                    self.productData().data.flag.addSubFacilityFlag(false);
                }
            }
        };

        self.calculateProgress = function() {
            return Math.round(((self.facilityData().utilizedAmount.amount / self.facilityData().effectiveAmount.amount) * 100) * 100) / 100;
        };

        self.datasourceNewCreate = function(data) {
            self.datasourceNew = new oj.ArrayTableDataSource(data.childFacilities, { idAttribute: "categoryDesc" });

            return self.datasourceNew;
        };

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

        self.findFacilityType = function(data) {
            for (let i = 0; i < self.facilityTypeListOptions().length; i++) {
                if (data === self.facilityTypeListOptions()[i].value) {
                    return self.facilityTypeListOptions()[i].label;

                }
            }
        };

        AddFacilityModel.fetchLiabilityId().done(function(data) {
            if (self.data.lineCode) {
                AddFacilityModel.getFacilityDetails(data.liabilitydtos[0].id, self.data.lineCode + "_" + self.data.lineSerialNumber).done(function(data) {
                    self.facilityData = ko.observable(data.facilityDTO);
                    self.dataLoaded(true);

                    if (!self.productData().payload.childFacilities) {
                        self.facilityPayload = {
                            availableAmount: {
                                amount: ko.observable(self.facilityData().effectiveAmount.amount),
                                currency: ko.observable(self.facilityData().effectiveAmount.currency)
                            },
                            lineStartDate: ko.observable(self.facilityData().lineStartDate),
                            expiryDate: ko.observable(self.facilityData().expiryDate),
                            categoryDesc: "Funded",
                            category: ko.observable(self.facilityData().categoryDesc),
                            description: ko.observable(self.facilityData().description),
                            instructions: ko.observable(""),
                            childFacilities: ko.observableArray([]),
                            lineCode: self.facilityData().lineCode
                        };

                        self.productData().data.module = "OBCFPM";
                        self.productData().payload = self.facilityPayload;

                    }

                    self.datasource = new oj.ArrayTableDataSource(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });
                });

            } else if (self.productData) {
                AddFacilityModel.getFacilityDetails(data.liabilitydtos[0].id, ko.mapping.toJS(self.productData().payload.lineCode) + "_" + self.data.lineSerialNumber).done(function(data) {
                    self.facilityData = ko.observable(data.facilityDTO);
                    self.dataLoaded(true);

                    self.facilityPayload = {
                        availableAmount: {
                            amount: ko.observable(self.facilityData().effectiveAmount.amount),
                            currency: ko.observable(self.facilityData().effectiveAmount.currency)
                        },
                        lineStartDate: ko.observable(self.facilityData().lineStartDate),
                        expiryDate: ko.observable(self.facilityData().expiryDate),
                        categoryDesc: "Funded",
                        category: ko.observable(self.facilityData().categoryDesc),
                        description: ko.observable(self.facilityData().description),
                        instructions: ko.observable(""),
                        childFacilities: ko.observableArray([]),
                        lineCode: self.facilityData().lineCode
                    };

                    self.datasource = new oj.ArrayTableDataSource(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });

                    if (self.productData().payload.childFacilities().length > 0) {
                        self.productData().data.flag.addSubFacilityFlag(true);
                    }

                    if (self.productData().payload.availableAmount.amount !== self.facilityData().effectiveAmount.amount || self.productData().payload.availableAmount.currency !== self.facilityData().availableAmountInBaseCurr.currency) {
                        self.productData().data.flag.updateAmountFlag(true);
                    }

                    if (self.productData().payload.instructions !== self.facilityData().instructions) {
                        self.productData().data.flag.updateBankInstructionsFlag(true);
                    }

                    if (self.productData().payload.expiryDate !== self.facilityData().expiryDate) {
                        self.productData().data.flag.updateDateFlag(true);
                    }
                });
            } else {
                AddFacilityModel.getFacilityDetails(data.liabilitydtos[0].id, ko.mapping.toJS(self.payload.lineCode) + "_" + self.data.lineSerialNumber).done(function(data) {
                    self.facilityData = ko.observable(data.facilityDTO);
                    self.dataLoaded(true);

                    self.facilityPayload = {
                        availableAmount: {
                            amount: ko.observable(self.facilityData().effectiveAmount.amount),
                            currency: ko.observable(self.facilityData().effectiveAmount.currency)
                        },
                        lineStartDate: ko.observable(self.facilityData().lineStartDate),
                        expiryDate: ko.observable(self.facilityData().expiryDate),
                        categoryDesc: "Funded",
                        category: ko.observable(self.facilityData().categoryDesc),
                        description: ko.observable(self.facilityData().description),
                        instructions: ko.observable(""),
                        childFacilities: ko.observableArray([]),
                        lineCode: self.facilityData().lineCode
                    };

                    if (!self.productData().data.flag.addSubFacilityFlag()) {
                        self.datasource = new oj.ArrayTableDataSource(self.productData().payload.childFacilities, { idAttribute: "categoryDesc" });
                    }

                });
            }
        });

        if (self.productData().payload && self.productData().payload.availableAmount) {
            params.rootModel.productData().amount = self.productData().payload.availableAmount.amount();
            params.rootModel.productData().currency = self.productData().payload.availableAmount.currency();
        }

        self.menuItemsMain = [{
                id: "addSubFacilityMain",
                label: self.resourceBundle.addSubFacility
            },
            {
                id: "editDetails",
                label: self.resourceBundle.editFacility
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

        params.rootModel.successHandler = function() {

            return new Promise(function(resolve) {

                resolve();

            });

        };
    };
});