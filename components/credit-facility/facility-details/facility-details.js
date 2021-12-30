define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/collateral-overview",
    "./model",
    "ojs/ojtable", "ojs/ojknockout", "ojs/ojarraydataprovider",
    "ojs/ojnavigationlist",
    "ojs/ojarraytabledatasource", "ojs/ojradioset", "ojs/ojbutton", "ojs/ojlabel", "ojs/ojvalidationgroup"
], function(oj, ko, $, locale, FacilityDetailModel) {
    "use strict";

    return function(params) {
        const self = this;
        let datac;

        ko.utils.extend(self, params.rootModel);
        self.locale = locale;
        params.baseModel.registerComponent("facility-covenants", "credit-facility");
        params.baseModel.registerComponent("collateral-groups", "credit-facility");
        params.baseModel.registerComponent("details", "credit-facility");
        params.baseModel.registerElement("nav-bar");
        params.dashboard.headerName(self.locale.creditFacilityDetails);

        self.treeDataLoaded = ko.observable(false);
        self.treeDataLoaded2 = ko.observable(false);
        self.treeDataLoaded3 = ko.observable(false);
        self.collateralData = ko.observable();
        self.allCollaterals = ko.observableArray([]);

        self.showDetails = ko.observable(false);
        self.keepCheck = ko.observable(false);
        self.facilityData = ko.observableArray();
        self.facilityIdOptions = ko.observableArray();
        self.facilityId = ko.observable();
        self.facilityDataLoaded = ko.observable(false);
        self.facilityValue = ko.observable();
        self.facilityValuepopup = ko.observable();
        self.displayCollaterals = ko.observable(false);
        self.collateralData = ko.observable();
        self.poolId = ko.observable();
        self.blank = ko.observable("-");
        self.partyId = ko.observable(params.dashboard.userData.userProfile.partyId.value);
        self.scheduleData = ko.observableArray();
        self.componentSequenceArray = ko.observableArray();
        self.displaySchedule = ko.observable(false);
        self.compName = ko.observable("");
        self.collateralPool = ko.observable();

        if (params.rootModel.menuSelection) {
            self.menuSelection = ko.observable(params.rootModel.menuSelection());
            self.compName = ko.observable(params.rootModel.compName());
        } else {
            self.menuSelection = ko.observable("");
        }

        if (self.params.directedThorughFacility) {
            self.facilityPopup = ko.observable(false);
        } else {
            self.facilityPopup = ko.observable(true);
        }

        const result1 = ko.observableArray(),
            result2 = ko.observableArray(),
            result3 = ko.observableArray();

        function convertTreeToArray(myArr1) {
            result1([]);

            let i;

            for (i = 0; i < myArr1.length; i++) {
                result1.push(myArr1[i]);
            }
        }

        function convertTreeToArray2(myArr1) {
            result2([]);

            let i;

            for (i = 0; i < myArr1.length; i++) {
                result2.push(myArr1[i]);
            }
        }

        function convertTreeToArray3(myArr1) {
            result3([]);

            let i;

            for (i = 0; i < myArr1.length; i++) {
                result3.push(myArr1[i]);
            }
        }

        self.loadFacilityDetails = function() {
            FacilityDetailModel.fetchLiabilityId().done(function(data) {

                FacilityDetailModel.getFacilityDetails(data.liabilitydtos[0].id, self.facilityValue()).done(function(data) {
                    self.facilityData(data);
                    self.componentSequenceArray([]);

                    if (self.facilityData().facilityDTO.scheduleDetails) {
                        self.scheduleData(self.facilityData().facilityDTO.scheduleDetails);
                    }

                    for (let i = 0; i < self.scheduleData().length; i++) {
                        self.componentSequenceArray.push({
                            date: self.scheduleData()[i].limitDate,
                            amount: self.scheduleData()[i].limitAmount.amount,
                            currency: self.scheduleData()[i].limitAmount.currency,
                            isVisited: false
                        });
                    }

                    if (self.componentSequenceArray().length > 0) {
                        self.displaySchedule(true);
                    } else {
                        self.displaySchedule(false);
                    }

                    result1([]);
                    result2([]);
                    result3([]);

                    self.treeDataLoaded3(false);
                    convertTreeToArray3(self.facilityData().facilityDTO.covenantDTO);
                    self.treeDataLoaded3(true);
                    self.displayCollaterals(false);

                    if (self.facilityData().facilityDTO.collateralPool && self.facilityData().facilityDTO.collateralPool.length > 0) {
                        self.poolId = self.facilityData().facilityDTO.collateralPool[0].collateralGroupDTO.poolId;
                        convertTreeToArray(self.facilityData().facilityDTO.collateralPool);

                        FacilityDetailModel.fetchLiabilityId().done(function(data) {
                            FacilityDetailModel.getCollaterals(data.liabilitydtos[0].id, self.poolId).done(function(collatData1) {
                                self.collateralData(collatData1);
                                self.treeDataLoaded2(false);

                                for (let j = 0; j < collatData1.collateralGroupDTO.sharedCollateral.length; j++) {
                                    for (let i = 0; i < datac.collateraldtos.length; i++) {
                                        if (datac.collateraldtos[i].collateralCode === collatData1.collateralGroupDTO.sharedCollateral[j].collateralDetails.collateralCode) {
                                            collatData1.collateralGroupDTO.sharedCollateral[j].collateralDetails.endDate = datac.collateraldtos[i].endDate;
                                            collatData1.collateralGroupDTO.sharedCollateral[j].collateralDetails.lendableMargin = datac.collateraldtos[i].lendableMargin;
                                            collatData1.collateralGroupDTO.sharedCollateral[j].collateralDetails.childCollateralValue = datac.collateraldtos[i].collateralValue;
                                            collatData1.collateralGroupDTO.sharedCollateral[j].collateralDetails.childLimitContribution = datac.collateraldtos[i].limitContribution;
                                            break;
                                        }
                                    }
                                }

                                convertTreeToArray2(collatData1.collateralGroupDTO.sharedCollateral);
                                self.treeDataLoaded2(true);
                            });
                        });

                        self.displayCollaterals(true);
                    } else {
                        self.poolId = null;
                        self.displayCollaterals(false);
                    }

                    self.datasource1 = new oj.ArrayDataProvider(result1);
                    self.datasource = new oj.ArrayDataProvider(result2);
                    self.datasource2 = new oj.ArrayDataProvider(result3);

                    self.facilityDataLoaded(true);
                    self.keepCheck(false);
                });
            });
        };

        if (!self.menuSelection()) {
            self.menuSelection = ko.observable("TEMPLATES");
        }

        if (!self.compName()) {
            self.compName = ko.observable("details");
        }

        self.menuOptions = ko.observable([{
                id: "TEMPLATES",
                label: "Details"
            }, {
                id: "DRAFTS",
                label: "Collateral Groups"
            }, {
                id: "COVENANTS",
                label: "Covenants"
            }

        ]);

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        function convertTreeToJSON(myArr) {
            let i;

            for (i = 0; i < myArr.length; i++) {
                self.facilityIdOptions.push({
                    id: myArr[i].lineCode + "_" + myArr[i].lineSerialNumber,
                    label: myArr[i].lineCode + "_" + myArr[i].lineSerialNumber
                });

                if (myArr[i].childFacilities) {
                    convertTreeToJSON(myArr[i].childFacilities);
                }
            }
        }

        self.liabilityId = ko.observable();
        self.branchCode = ko.observable();
        self.partyId = ko.observable();

        FacilityDetailModel.fetchLiabilityId().done(function(data1) {
            self.liabilityId(data1.liabilitydtos[0].id);
            self.branchCode(data1.liabilitydtos[0].branch);
            self.partyId(data1.liabilitydtos[0].partyId);

            Promise.all([FacilityDetailModel.getAllCollaterals(self.partyId(), self.branchCode(), "INR", self.liabilityId()),
                    FacilityDetailModel.getGroupList(self.liabilityId(), self.partyId(), self.branchCode(), "INR")
                ])
                .then(function(data) {
                    datac = data[0];

                    let i;

                    for (i = 0; i < datac.collateraldtos.length; i++) {
                        datac.collateraldtos[i].type = "C";
                        datac.collateraldtos[i].uiId = i + datac.collateraldtos[i].collateralCode;
                        self.allCollaterals.push(datac.collateraldtos[i]);
                    }

                });
        });

        self.showModal = function() {
            $("#choicePopup").trigger("openModal");
            self.keepCheck(true);
        };

        self.closeHandler = function() {
            params.dashboard.switchModule();
        };

        self.menuSelectionSubscribe = self.menuSelection.subscribe(function(newValue) {
            if (newValue === "TEMPLATES") {
                self.compName("details");
                self.showDetails(true);
            } else if (newValue === "DRAFTS") {
                self.compName("collateral-groups");
                self.showDetails(true);
            } else if (newValue === "COVENANTS") {
                self.compName("facility-covenants");
                self.showDetails(true);
            }
        });

        self.showFacilityModal = ko.observable(false);
        self.displayDetails = ko.observable(false);

        FacilityDetailModel.fetchLiabilityId().done(function(data) {

            FacilityDetailModel.getFacilityList(data.liabilitydtos[0].id, data.liabilitydtos[0].branch, self.partyId(), "INR").done(function(data) {
                convertTreeToJSON(data.facilitydtos);
                self.showFacilityModal(true);
            });
        });

        self.facilityValueOnChange = function(event) {
            if (event.detail.value) {
                self.facilityValue(event.detail.value);
                self.loadFacilityDetails();
            }
        };

        if (self.params.facilityId) {
            self.facilityValue(self.params.facilityId);
            self.loadFacilityDetails();
        }

        self.proceed = function() {
            self.displayDetails(true);
            self.facilityPopup(false);
        };

    };
});