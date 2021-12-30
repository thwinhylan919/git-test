define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/collateral-overview",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojradioset",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojslider",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojrowexpander",
    "ojs/ojflattenedtreetabledatasource",
    "ojs/ojtreeview",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource",
    "ojs/ojmenu",
    "ojs/ojcube",
    "ojs/ojdatagrid",
    "ojs/ojselectcombobox",
    "ojs/ojoption",
    "ojs/ojarraydataprovider",
    "ojs/ojlistview",
    "ojs/ojprogress",
    "ojs/ojinputnumber"

], function(oj, ko, $, CollateralModel, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;
        let i, datac;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.groupdata = ko.observableArray([]);
        self.treeDataLoaded = ko.observable(false);
        params.baseModel.registerComponent("collateral-details", "credit-facility");
        params.baseModel.registerElement("search-box");
        self.notificationCount = ko.observable(0);
        self.treeDataLoaded2 = ko.observable(false);
        self.searchType = ko.observable("");
        self.groupID = ko.observable("");
        self.collateralID = ko.observable();
        self.selected = ko.observable();
        self.description = ko.observable("");
        self.partyId = ko.observable("");
        self.filteredList = ko.observableArray([]);
        self.myHorizontal = ko.observable();
        self.myVertical = ko.observable();
        self.atHorizontal = ko.observable();
        self.collateralData = ko.observableArray([]);
        self.partyIDoptions = ko.observable();
        self.atVertical = ko.observable();
        self.dropdownListLoaded = ko.observable(false);
        self.dropdownListLoaded5 = ko.observable(false);
        self.partyIDoptions1 = ko.observableArray([]);
        self.Group_Amount_Range_min = ko.observable("");
        self.Group_Amount_Range_max = ko.observable("");
        self.Available_Amount_Range_min = ko.observable("");
        self.Available_Amount_Range_max = ko.observable("");
        self.CollateralType = ko.observable("");
        self.Collateral_Amount_min = ko.observable("");
        self.Collateral_Amount_max = ko.observable("");
        self.collateralTypeListOptions = ko.observableArray([]);
        self.areTypesLoaded = ko.observable(false);
        self.allCollaterals = ko.observableArray([]);
        self.allCollateralsLoaded = ko.observable(false);
        self.allCollateralsLinkedToGroups = [];
        self.comparisonflag = ko.observable(false);
        self.counter = 0;
        self.partyId = ko.observable("");
        self.liabilityId = ko.observable("");
        self.branchCode = ko.observable("");
        self.blank = ko.observable("-");
        self.resources = resourceBundle.structure.labels;
        self.generic = resourceBundle.structure.generic;

        self.onFilterIconClick = function() {
            const popup = document.querySelector("#filter-popup");

            if (popup.isOpen()) {
                popup.close();
            } else {
                if (params.baseModel.large()) {
                    self.atHorizontal("end");
                    self.atVertical("bottom");
                    self.myHorizontal("end");
                    self.myVertical("top");
                } else {
                    self.myHorizontal("left");
                    self.myVertical("top");
                    self.atHorizontal("right");
                    self.atVertical("bottom");
                }

                $(".oj-popup-content").css("width", "15rem");
                $(".oj-popup-content").css("height", "32rem");
                $(".oj-popup-content").css("overflow-y", "scroll");
                popup.open("#enable-filter");

            }
        };

        self.callBack = function(id) {
            $("#" + id).keypress(function(event) {
                const charCode = event.which ? event.which : event.keyCode,
                    char = String.fromCharCode(charCode),
                    replacedValue = char.replace(/[^0-9\.]/g, "");

                if (char !== replacedValue) {
                    return false;
                }

                return true;
            });
        };

        CollateralModel.fetchCollateralTypes().then(function(data) {
            for (let i = 0; i < data.collateralTypes.length; i++) {
                self.collateralTypeListOptions.push({
                    label: data.collateralTypes[i].description,
                    value: data.collateralTypes[i].code
                });

            }

            self.areTypesLoaded(true);
        });

        self.comparison = function(collateralList) {
            let k;

            for (k = 0; k < collateralList.length; k++) {
                let l;

                for (l = 0; l < self.allCollaterals().length; l++) {
                    if (collateralList[k].collateralCode === self.allCollaterals()[l].collateralCode) {
                        self.allCollaterals().splice(l, 1);

                    }
                }
            }
        };

        CollateralModel.fetchLiabilityId().done(function(data1) {
            self.liabilityId(data1.liabilitydtos[0].id);
            self.branchCode(data1.liabilitydtos[0].branch);
            self.partyId(data1.liabilitydtos[0].partyId);

            Promise.all([CollateralModel.getAllCollaterals(self.partyId(), self.branchCode(), "INR", self.liabilityId()),
                    CollateralModel.getGroupList(self.liabilityId(), self.partyId(), self.branchCode(), "INR")
                ])
                .then(function(data) {
                    datac = data[0];

                    const listdata = data[1];
                    let i;

                    for (i = 0; i < datac.collateraldtos.length; i++) {
                        datac.collateraldtos[i].type = "C";
                        datac.collateraldtos[i].uiId = i + datac.collateraldtos[i].collateralCode;
                        self.allCollaterals.push(datac.collateraldtos[i]);
                    }

                    let k;

                    for (k = 0; k < listdata.collateralgroupdtos.length; k++) {

                        CollateralModel.getCollaterals(self.liabilityId(), listdata.collateralgroupdtos[k].poolId).done(function(collatData) {

                            let j,
                                n;

                            for (n = 0; n < listdata.collateralgroupdtos.length; n++) {
                                if (listdata.collateralgroupdtos[n].poolId === collatData.collateralGroupDTO.poolId) {
                                    listdata.collateralgroupdtos[n].sharedCollateral = collatData.collateralGroupDTO.sharedCollateral;

                                }
                            }

                            for (j = 0; j < collatData.collateralGroupDTO.sharedCollateral.length; j++) {

                                self.allCollateralsLinkedToGroups.push(collatData.collateralGroupDTO.sharedCollateral[j].collateralDetails);

                            }

                            self.comparison(self.allCollateralsLinkedToGroups);
                            self.counter++;

                            let l;

                            if (self.counter === listdata.collateralgroupdtos.length) {
                                for (l = 0; l < listdata.collateralgroupdtos.length; l++) {
                                    listdata.collateralgroupdtos[l].type = "P";
                                    listdata.collateralgroupdtos[l].uiId = l + listdata.collateralgroupdtos[l].poolId;

                                    self.allCollaterals.push(listdata.collateralgroupdtos[l]);

                                }

                                self.treeDataLoaded(true);
                            }
                        });

                    }
                });
        });

        self.progressValue = function(data) {
            if (data.groupAmount.amount === 0) {
                return 0;
            }

            return Math.round(((data.groupUtilizedAmount.amount + ~~data.groupBlockAmount.amount) * 100 / data.groupAmount.amount) * 100) / 100;

        };

        self.progressValueColleteral = function(data) {
            if (data.collateralValue.amount === 0) {
                return 0;
            }

            return Math.round((((data.collateralValue.amount - data.availableAmount.amount) / data.collateralValue.amount) * 100) * 100) / 100;

        };

        const result2 = ko.observableArray([]);

        function convertTreeToArray2(myArr1) {

            result2([]);

            let i;

            for (i = 0; i < myArr1.length; i++) {
                result2.push(myArr1[i]);
            }
        }

        self.datasource1 = new ko.observable(new oj.ArrayTableDataSource(self.allCollaterals, { idAttribute: "uiId" }));

        self.datasource = new oj.ArrayTableDataSource(result2);

        CollateralModel.fetchParty().done(function(data) {
            CollateralModel.fetchPartyRelations().done(function(partyData) {
                const parties = [];

                self.partyIDoptions1(data.party.personalDetails.fullName);
                self.dropdownListLoaded5(true);

                const mappedParties = partyData.partyToPartyRelationship;

                for (i = 0; i < mappedParties.length; i++) {
                    parties.push({
                        value: mappedParties[i].relatedParty.value,
                        label: mappedParties[i].relatedParty.displayValue
                    });
                }

                self.partyIDoptions(parties);
                self.dropdownListLoaded(true);
            });
        });

        function checkGroupAmountRange(collateralGroup) {
            if (self.Group_Amount_Range_min() !== "" && self.Group_Amount_Range_max() !== "") {
                return collateralGroup.groupAmount.amount >= self.Group_Amount_Range_min() && collateralGroup.groupAmount.amount <= self.Group_Amount_Range_max();
            } else if (self.Group_Amount_Range_min() !== "") {
                return collateralGroup.groupAmount.amount >= self.Group_Amount_Range_min();
            } else if (self.Group_Amount_Range_max() !== "") {
                return collateralGroup.groupAmount.amount <= self.Group_Amount_Range_max();
            }

            return true;

        }

        function checkCollateralValueRange(collateralGroup) {

            if (self.Group_Amount_Range_min() !== "" && self.Group_Amount_Range_max() !== "") {
                return collateralGroup.collateralValue.amount >= self.Group_Amount_Range_min() && collateralGroup.collateralValue.amount <= self.Group_Amount_Range_max();
            } else if (self.Group_Amount_Range_min() !== "") {
                return collateralGroup.collateralValue.amount >= self.Group_Amount_Range_min();
            } else if (self.Group_Amount_Range_max() !== "") {
                return collateralGroup.collateralValue.amount <= self.Group_Amount_Range_max();
            }

            return true;

        }

        function checkAvailableAmountRange(item) {
            if (item.type === "P") {
                let p;

                for (p = 0; p < item.sharedCollateral.length; p++) {
                    if (self.Available_Amount_Range_min() !== "" && self.Available_Amount_Range_max() !== "") {
                        return item.sharedCollateral[i].collateralDetails.collateralValue.amount >= self.Available_Amount_Range_min() && item.sharedCollateral[i].collateralDetails.collateralValue.amount <= self.Group_Amount_Range_max();
                    } else if (self.Available_Amount_Range_min() !== "") {
                        return item.sharedCollateral[i].collateralDetails.collateralValue.amount >= self.Available_Amount_Range_min();
                    } else if (self.Available_Amount_Range_max() !== "") {
                        return item.sharedCollateral[i].collateralDetails.collateralValue.amount <= self.Available_Amount_Range_max();
                    }

                    return true;
                }
            } else {
                if (self.Available_Amount_Range_min() !== "" && self.Available_Amount_Range_max() !== "") {
                    return item.availableAmount.amount >= self.Available_Amount_Range_min() && item.availableAmount.amount <= self.Available_Amount_Range_max();
                } else if (self.Available_Amount_Range_min() !== "") {
                    return item.availableAmount.amount >= self.Available_Amount_Range_min();
                } else if (self.Group_Amount_Range_max() !== "") {
                    return item.availableAmount.amount <= self.Available_Amount_Range_max();
                }

                return true;
            }
        }

        function checkGroupId(collateralGroup) {
            if (self.groupID() !== undefined && collateralGroup.externalReferenceId.toString().toLowerCase().indexOf(self.groupID().toString().toLowerCase()) >= 0) {
                return true;
            }

            return false;

        }

        function checkCollateralCode(item) {
            if (!self.collateralID()) {
                return true;
            }

            if (item.type === "P") {
                let p;

                for (p = 0; p < item.sharedCollateral.length; p++) {
                    if (item.sharedCollateral[i].collateralDetails.collateralCode.toString().toLowerCase().indexOf(self.collateralID().toString().toLowerCase()) >= 0) {
                        return true;
                    }
                }
            } else if (item.collateralCode.toString().toLowerCase().indexOf(self.collateralID().toString().toLowerCase()) >= 0) {
                return true;
            }

            return false;

        }

        function checkCollateralType(item) {
            if (!self.CollateralType()) {
                return true;
            }

            if (item.type === "P") {
                let p;

                for (p = 0; p < item.sharedCollateral.length; p++) {
                    if (item.sharedCollateral[i].collateralDetails.collateralType === self.CollateralType()) {
                        return true;
                    }
                }
            } else if (item.collateralType === self.CollateralType()) {
                return true;
            }

            return false;
        }

        function checkCollateralAmount(collateral) {
            const collateralAmount = (collateral.collateralValue && collateral.collateralValue.amount) || (collateral.groupAmount && collateral.groupAmount.amount);

            if (self.Collateral_Amount_min() && self.Collateral_Amount_max()) {
                return (collateralAmount >= parseInt(self.Collateral_Amount_min())) && (collateralAmount <= parseInt(self.Collateral_Amount_max()));
            } else if (self.Collateral_Amount_min() || self.Collateral_Amount_max()) {
                return (collateralAmount >= parseInt(self.Collateral_Amount_min())) || (collateralAmount <= parseInt(self.Collateral_Amount_max()));
            }

            return true;
        }

        function checkIfPool(collateralGroup) {

            return collateralGroup.type === "P";
        }

        function checkIfNotPool(collateralGroup) {

            return collateralGroup.type === "C";
        }

        self.setCollateralList = function() {
            if (self.searchType() === "ByCollateralGroup") {
                self.filteredList(self.allCollaterals().filter(checkIfPool).filter(checkGroupAmountRange).filter(checkAvailableAmountRange).filter(checkGroupId));
            }

            if (self.searchType() === "ByCollateral") {
                self.filteredList(self.allCollaterals().filter(checkCollateralType).filter(checkCollateralCode).filter(checkCollateralAmount).filter(checkAvailableAmountRange));
            }

            if (self.searchType() === "ByNonCollateralGroup") {
                self.filteredList(self.allCollaterals().filter(checkIfNotPool).filter(checkCollateralValueRange).filter(checkAvailableAmountRange).filter(checkCollateralCode));
            }

            self.datasource1(new oj.ArrayTableDataSource(self.filteredList(), { idAttribute: "uiId" }));

            const popup = document.querySelector("#filter-popup");

            if (popup.isOpen()) {
                popup.close();
            }
        };

        self.clear = function() {
            self.searchType("");
            self.groupID("");
            self.Group_Amount_Range_min("");
            self.Group_Amount_Range_max("");
            self.Available_Amount_Range_min("");
            self.Available_Amount_Range_max("");
            self.CollateralType("");
            self.collateralID("");
            self.Collateral_Amount_min("");
            self.Collateral_Amount_max("");
            self.datasource1(new oj.ArrayTableDataSource(self.allCollaterals(), { idAttribute: "uiId" }));
            ko.tasks.runEarly();
        };

        self.showCollateralDetails = function(data) {
            const parameters = {
                directedThorughCollateralSummary: true,

                collateralId: data.collateralCode
            };

            params.dashboard.loadComponent("collateral-details", parameters);
        };

        self.showCollateralDetails2 = function(data) {
            const parameters = {
                directedThorughCollateralSummary: true,
                collateralId: data.collateralDetails.collateralCode
            };

            params.dashboard.loadComponent("collateral-details", parameters);
        };

        self.showCollaterals = function(data) {

            if (self.selected() === data.poolId) {
                self.selected("");
            } else {
                self.selected(data.poolId);
            }

            CollateralModel.fetchLiabilityId().done(function(data1) {
                self.liabilityId(data1.liabilitydtos[0].id);

                CollateralModel.getCollaterals(self.liabilityId(), data.poolId).done(function(collatData) {
                    self.treeDataLoaded2(false);

                    for (let j = 0; j < collatData.collateralGroupDTO.sharedCollateral.length; j++) {
                        for (let i = 0; i < datac.collateraldtos.length; i++) {
                            if (datac.collateraldtos[i].collateralCode === collatData.collateralGroupDTO.sharedCollateral[j].collateralDetails.collateralCode) {
                                collatData.collateralGroupDTO.sharedCollateral[j].collateralDetails.endDate = datac.collateraldtos[i].endDate;
                                collatData.collateralGroupDTO.sharedCollateral[j].collateralDetails.lendableMargin = datac.collateraldtos[i].lendableMargin;
                                collatData.collateralGroupDTO.sharedCollateral[j].collateralDetails.childCollateralValue = datac.collateraldtos[i].collateralValue;
                                collatData.collateralGroupDTO.sharedCollateral[j].collateralDetails.childLimitContribution = datac.collateraldtos[i].limitContribution;
                                break;
                            }
                        }
                    }

                    convertTreeToArray2(collatData.collateralGroupDTO.sharedCollateral);
                    self.treeDataLoaded2(true);
                });
            });
        };

    };
});