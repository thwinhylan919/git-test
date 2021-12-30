define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/collateral-overview",
    "./model",
    "ojs/ojtable", "ojs/ojknockout", "ojs/ojarraydataprovider",
    "ojs/ojnavigationlist",
    "ojs/ojarraytabledatasource", "ojs/ojradioset", "ojs/ojbutton", "ojs/ojlabel", "ojs/ojvalidationgroup"
], function(oj, ko, $, locale, CollateralDetails) {
    "use strict";

    return function(params) {
        const self = this;

        self.locale = locale;

        params.baseModel.registerComponent("facility-covenants", "credit-facility");
        params.baseModel.registerComponent("collateral-id-details", "credit-facility");
        params.baseModel.registerElement("nav-bar");

        self.collateralId = ko.observable();
        self.partyId = ko.observable(params.dashboard.userData.userProfile.partyId.value);
        self.menuOptions = ko.observable();
        self.blank = ko.observable("-");
        self.uiOptions = ko.observable();
        self.treeDataLoaded3 = ko.observable(false);
        self.collateralIdValue = ko.observable();
        self.collateralIdOptions = ko.observableArray();

        self.showDetails = ko.observable(false);
        self.keepCheck = ko.observable(false);
        self.showFacilityModal = ko.observable(false);
        self.collateralDataLoaded = ko.observable(false);
        self.collateralData = ko.observableArray();
        self.liabilityId = ko.observable();

        ko.utils.extend(self, params.rootModel);

        if (self.params && self.params.directedThorughCollateralSummary) {
            self.collateralPopup = ko.observable(false);
        } else {
            self.collateralPopup = ko.observable(true);
        }

        const result3 = ko.observableArray();

        function convertTreeToArray3(myArr1) {
            result3([]);

            let i;

            for (i = 0; i < myArr1.length; i++) {
                result3.push(myArr1[i]);
            }
        }

        self.setCollateralRead = function() {
            CollateralDetails.fetchLiabilityId().done(function(data1) {
                self.liabilityId(data1.liabilitydtos[0].id);

                CollateralDetails.getCollateralDetails(self.liabilityId(), self.collateralId()).done(function(data) {
                    self.collateralDataLoaded(false);
                    params.dashboard.headerName(self.collateralId());
                    self.collateralData.removeAll();
                    self.collateralData(data);

                    result3([]);

                    self.treeDataLoaded3(false);
                    convertTreeToArray3(self.collateralData().collateralDTO.covenantDTO);
                    self.treeDataLoaded3(true);
                    self.collateralDataLoaded(true);
                });
            });
        };

        if (self.params && self.params.collateralId) {
            self.collateralId(self.params.collateralId);
            self.setCollateralRead();
        } else {
            CollateralDetails.fetchLiabilityId().done(function(data) {
                CollateralDetails.getCollateralList(data.liabilitydtos[0].id, self.partyId(), data.liabilitydtos[0].branch, "INR").done(function(data) {
                    for (let i = 0; i < data.collateraldtos.length; i++) {

                        self.collateralIdOptions.push({

                            id: data.collateraldtos[i].collateralCode,

                            label: data.collateraldtos[i].collateralCode
                        });
                    }

                    self.showFacilityModal(true);
                });
            });
        }

        if (!self.menuSelection) {
            self.menuSelection = ko.observable("TEMPLATES");
        }

        if (!self.compName) {
            self.compName = ko.observable("collateral-id-details");
        }

        self.menuOptions = ko.observable([{
            id: "TEMPLATES",
            label: "Details"
        }, {
            id: "COVENANTS",
            label: "Covenants"
        }]);

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        self.datasource2 = new oj.ArrayDataProvider(result3);

        self.menuSelectionSubscribe = self.menuSelection.subscribe(function(newValue) {
            if (newValue === "TEMPLATES") {
                self.compName("collateral-id-details");
                self.showDetails(true);
            } else if (newValue === "COVENANTS") {
                self.compName("facility-covenants");
            }

        });

        self.collateralIdChangeHandler = function(event) {
            if (event.detail.value) {
                self.collateralId(event.detail.value);
            }
        };

        self.proceed = function() {
            self.setCollateralRead();
            self.collateralPopup(false);
        };

        self.showModal = function() {
            $("#choicePopup").trigger("openModal");
            self.keepCheck(true);
        };

        self.closeHandler = function() {
            params.dashboard.switchModule();
        };

    };
});