define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/facility-overview",
    "text!./facility-overview.json",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojrowexpander",
    "ojs/ojflattenedtreetabledatasource",
    "ojs/ojarraytreedataprovider",
    "ojs/ojtreeview",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource",
    "ojs/ojmenu",
    "ojs/ojdatagrid",
    "ojs/ojoption",
    "ojs/ojarraydataprovider",
    "ojs/ojlistview",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton",
    "ojs/ojprogress",
    "ojs/ojinputnumber"

], function(oj, ko, $, FacilityModel, locale) {
    "use strict";

    return function(rootParams) {
        const self = this;
        let i;

        self.nls = locale;
        self.dataSourceCreated = ko.observable(false);
        rootParams.baseModel.registerComponent("tree-view", "credit-facility");
        rootParams.baseModel.registerElement("flow");
        rootParams.baseModel.registerComponent("facility-details", "credit-facility");
        rootParams.baseModel.registerElement("search-box");
        rootParams.baseModel.registerElement("segment-container");
        rootParams.baseModel.registerComponent("facility-hierarchy-panel", "credit-facility");
        self.generic = locale.structure.generic;
        self.dataSource = ko.observable();
        self.viewStructureDetailsDataSource = ko.observable();
        self.linkedAccountNoMap = {};
        self.structureType = ko.observable();
        self.description = ko.observable("");
        self.myHorizontal = ko.observable();
        self.myVertical = ko.observable();
        self.atHorizontal = ko.observable();
        self.partyIDoptions = ko.observable();
        self.partyIDoptions1 = ko.observableArray();
        self.atVertical = ko.observable();
        self.linkedAccountNoMap = {};
        self.rootfacilityTypesArray = ko.observableArray();
        self.todayDate = rootParams.baseModel.getDate();
        self.dd = ko.observable();
        self.facilityCategoryCode = ko.observable();

        const result1 = [];

        self.facilityData = ko.observableArray();
        self.datasource2 = ko.observable();
        self.dataSourceCreatedTree = ko.observable(false);
        self.nls = locale;
        rootParams.dashboard.headerName(self.nls.heading.CreditFacilityOverview);
        self.FundingTypeLabelArray = ko.observableArray();
        self.FacilityTypeLabelArray = ko.observableArray();
        self.CurrencyLabelArray = ko.observableArray();
        self.optionsFundingType = ko.observableArray();
        self.facilityOptions = ko.observableArray();
        self.optionsFacilityType = ko.observableArray();
        self.currencyListOptions = ko.observableArray();
        self.optionsCurrency = ko.observableArray();
        self.moreSearchOptions = ko.observable(false);
        self.loadTree = ko.observable(false);
        self.dropdownListLoaded = ko.observable(false);
        self.dropdownListLoaded5 = ko.observable(false);
        self.isCurrencyLoaded = ko.observable(false);
        self.dropdownListLoaded1 = ko.observable(false);
        self.dropdownListLoaded2 = ko.observable(false);
        self.fundingType = ko.observable("");
        self.revolvingLine = ko.observable("");
        self.expiringIn = ko.observable("");
        self.currency = ko.observable("");
        self.amount_min = ko.observable("");
        self.amount_max = ko.observable("");
        self.dataLoaded = false;
        self.close = ko.observable(false);
        self.compName = ko.observable("");
        self.menuSelection = ko.observable("");
        self.partyId = ko.observable("");
        self.filteredList = ko.observableArray([]);
        self.filteredList(result1);

        self.onFilterIconClick = function() {
            const popup = document.querySelector("#filter-popup");

            if (popup && popup.isOpen()) {
                popup.close();
            } else {

                $(".oj-popup-content").css("width", "20rem");
                $(".oj-popup-content").css("height", "28rem");
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

        let root = {},
            resultValue = {};

        const attrData = [];

        function findTreeRecursive(myData, lineCode1) {
            let i;

            for (i = 0; i < myData.length; i++) {
                myData[i].account.selected = false;

                if (myData[i].children) {
                    let j;

                    for (j = 0; j < myData[i].children.length; j++) {
                        myData[i].children[j].account.selected = false;
                    }
                }

                if (myData[i].account.mainLineCode === "") {
                    root = myData[i];
                }

                if (myData[i].account.lineCodeNew === lineCode1) {
                    myData[i].account.selected = true;
                    resultValue = root;
                    break;
                }

                if (myData[i].children) {
                    findTreeRecursive(myData[i].children, lineCode1);
                }
            }

            return resultValue;
        }

        self.findTree = function(data) {

            self.loadTree(false);
            ko.tasks.runEarly();

            const result2 = findTreeRecursive(self.dd(), data.lineCode + "_" + data.lineSerialNumber);

            self.datasource2(result2);

            let str = "Hierarchy";

            str = "\xa0" + str;

            rootParams.dashboard.openRightPanel("facility-hierarchy-panel", {
                facilityData: self.datasource2
            }, data.lineCode + "_" + data.lineSerialNumber + str);

            self.loadTree(true);

        };

        function convertTreeToJSON(myArr, result) {
            let i;

            for (i = 0; i < myArr.length; i++) {
                const obj = {};

                myArr[i].lineCodeNew = myArr[i].lineCode + "_" + myArr[i].lineSerialNumber;
                obj.account = Object.assign({}, myArr[i]);
                result.push(obj);

                if (myArr[i].childFacilities) {
                    obj.children = [];
                    convertTreeToJSON(myArr[i].childFacilities, obj.children);
                }
            }

            return result;
        }

        function convertTreeToArray(myArr1) {
            let i;

            for (i = 0; i < myArr1.length; i++) {
                myArr1[i].lineCodeNew = myArr1[i].lineCode + "_" + myArr1[i].lineSerialNumber;
                result1.push(myArr1[i]);

                if (myArr1[i].childFacilities) {
                    convertTreeToArray(myArr1[i].childFacilities);
                }
            }
        }

        self.datasource1 = new ko.observable(new oj.ArrayDataProvider(self.filteredList, {
            keyAttributes: "lineCodeNew"
        }));

        function checkAmountRange(facility) {
            if (self.amount_min() !== "" && self.amount_max() !== "") {
                return facility.availableAmount.amount >= self.amount_min() && facility.availableAmount.amount <= self.amount_max();
            } else if (self.amount_min() !== "") {
                return facility.availableAmount.amount >= self.amount_min();
            } else if (self.amount_max() !== "") {
                return facility.availableAmount.amount <= self.amount_max();
            }

            return true;

        }

        function checkFacilityCategory(facility) {
            if (self.facilityCategoryCode()) {
                return parseInt(facility.category) === parseInt(self.facilityCategoryCode());
            }

            return true;

        }

        function checkRevolvingLine(facility) {
            if (self.revolvingLine() !== "") {
                return facility.revolvingLine === self.revolvingLine();
            }

            return true;

        }

        function checkCurrency(facility) {
            if (self.currency() !== "") {
                return facility.currencyCode === self.currency();
            }

            return true;

        }

        function checkPartyId(facility) {
            if (self.partyId() !== "") {
                return facility.partyId.value === self.partyId();
            }

            return true;

        }

        function checkDescription(facility) {
            if (self.description() !== "undefined" && facility.description.toString().toLowerCase().indexOf(self.description().toString().toLowerCase()) >= 0) {
                return true;
            }

        }

        function checkExpiryDate(facility) {
            if (self.expiringIn() && self.expiringIn() !== "notApplicable") {
                return Math.ceil(Math.abs(new Date(facility.expiryDate).getTime() - rootParams.baseModel.getDate().getTime()) / 86400000) <= parseInt(self.expiringIn());
            } else if (self.expiringIn() === "notApplicable") {
                return !facility.expiryDate;
            }

            return true;
        }

        self.setFacilityList = function() {
            self.dataSourceCreated(false);
            ko.tasks.runEarly();
            self.filteredList(result1.filter(checkAmountRange).filter(checkFacilityCategory).filter(checkRevolvingLine).filter(checkCurrency).filter(checkPartyId).filter(checkDescription).filter(checkExpiryDate));
            self.dataSourceCreated(true);

            const popup = document.querySelector("#filter-popup");

            if (popup && popup.isOpen()) {
                popup.close();
            }

        };

        self.clear = function() {
            self.facilityCategoryCode("");
            self.expiringInVal(null);
            self.fundingType("");
            self.revolvingLine("");
            self.expiringIn("");
            self.currency("");
            self.amount_min("");
            self.amount_max("");
            ko.tasks.runEarly();
        };

        const rootNodes = {};

        function createOption(id, desc) {
            return {
                value: id,
                label: desc
            };
        }

        function setFacilityCategories(category) {

            if (category && category.subCategories && category.subCategories.length) {
                for (let i = 0; i < category.subCategories.length; i++) {
                    if (!category.subCategories[i].facilityType) {
                        self.rootfacilityTypesArray.push(createOption(category.subCategories[i].description, category.subCategories[i].description));
                    } else if (category.subCategories[i].facilityType) {
                        if (!rootNodes[category.subCategories[i].facilityType]) {
                            rootNodes[category.subCategories[i].facilityType] = [];
                        }

                        rootNodes[category.subCategories[i].facilityType].push(createOption(category.subCategories[i].description, category.subCategories[i].description, category.subCategories[i].facilityType));
                    }

                    if (category.subCategories && category.subCategories[i].subCategories && category.subCategories[i].subCategories.length) {
                        for (let k = 0; k < category.subCategories[i].subCategories.length; k++) {
                            setFacilityCategories(category.subCategories[k]);
                        }
                    }
                }
            }
        }

        self.treeDataProvider = ko.observable();

        FacilityModel.facilityParty().done(function(data) {

            if (data && data.facilityCategory) {
                setFacilityCategories(data.facilityCategory);
            }

            for (let l = 0; l < self.rootfacilityTypesArray().length; l++) {
                self.rootfacilityTypesArray()[l].childNode = rootNodes[self.rootfacilityTypesArray()[l].label] || [];
            }

            self.treeDataProvider(new oj.ArrayTreeDataProvider(self.rootfacilityTypesArray(), {
                keyAttributes: "value",
                childrenAttribute: "childNode"
            }));

            ko.tasks.runEarly();
            self.dropdownListLoaded1(true);
        });

        self.optionsFundingType().map((element, index) => {
            element.fundingLabel = self.FundingTypeLabelArray[index].fundingLabel;

            return true;
        });

        self.revolvingLineArray = [{
                label: self.nls.generic.common.yes,
                value: true
            },
            {
                label: self.nls.generic.common.no,
                value: false
            }
        ];

        FacilityModel.fetchLiabilityId().done(function(data) {
            FacilityModel.getFacilityList(data.liabilitydtos[0].id, data.liabilitydtos[0].branch, self.partyId(), "INR").done(function(data) {
                self.dataLoaded = true;
                self.dataSourceCreated(false);
                self.facilityData(data.facilitydtos);

                const convertedData = convertTreeToJSON(self.facilityData(), attrData);

                self.dd(convertedData);
                convertTreeToArray(self.facilityData());
                self.dataSourceCreated(true);
            });
        });

        FacilityModel.fetchParty().done(function(data) {
            FacilityModel.fetchPartyRelations().done(function(partyData) {
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

        FacilityModel.fetchCurrencies().then(function(data) {
            for (let i = 0; i < data.currencyList.length; i++) {
                self.currencyListOptions.push({
                    value: data.currencyList[i].code
                });

            }

            self.isCurrencyLoaded(true);
        });

        self.expiringInVal = ko.observable("");

        self.ExpiryArray = [{
                label: self.nls.CreditFacilityOverview.expiry1,
                value: 15
            },
            {
                label: self.nls.CreditFacilityOverview.expiry2,
                value: 30
            },
            {
                label: self.nls.CreditFacilityOverview.expiry3,
                value: 60
            },
            {
                label: self.nls.CreditFacilityOverview.expiry4,
                value: 90
            },
            {
                label: self.nls.CreditFacilityOverview.expiry5,
                value: 120
            },
            {
                label: self.nls.CreditFacilityOverview.expiry6,
                value: "custom"
            },
            {
                label: self.nls.CreditFacilityOverview.expiry7,
                value: "notApplicable"
            }
        ];

        self.expiryDateFilterHandler = function(event) {
            if (event.detail.value !== event.detail.previousValue) {
                self.expiringIn(event.detail.value !== "custom" ? event.detail.value : "");
            }
        };

        self.showMoreSearchOptions = function() {
            self.moreSearchOptions(!self.moreSearchOptions());
        };

        self.menuItems = [{
                id: "addSubFacility",
                label: self.nls.structure.labels.addSubFacility
            },
            {
                id: "amendFacility",
                label: self.nls.structure.labels.amendFacility
            }, {
                id: "viewCollateralGroups",
                label: self.nls.structure.labels.viewCollateralGroups
            },
            {
                id: "viewCovenants",
                label: self.nls.structure.labels.viewCovenants
            }
        ];

        self.openMenu = function(data, event) {
            document.getElementById("menuLauncher-billerlist-contents-" + data.lineCode + "_" + data.lineSerialNumber).open(event);

        };

        /* handle desktop more menu */
        self.menuItemSelect = function(data, event) {
            $("#menuLauncher-billerlist-contents-").hide();
            self.selectedBillerId = data.id;

            const menuId = event.target.value;

            if (menuId === "addSubFacility") {
                const parameters = {
                    productId: "facilityAmend",
                    dataSegments: ["fsgbu-ob-clmo-ds-facility-application", "fsgbu-ob-clmo-ds-collaterals", "fsgbu-ob-clmo-ds-upload-documents"],
                    data: data
                };

                rootParams.dashboard.loadComponent("segment-container", parameters);
            } else if (menuId === "amendFacility") {
                const parameters = {
                    productId: "facilityAmend",
                    dataSegments: ["fsgbu-ob-clmo-ds-facility-application", "fsgbu-ob-clmo-ds-collaterals", "fsgbu-ob-clmo-ds-upload-documents"],
                    data: data
                };

                rootParams.dashboard.loadComponent("segment-container", parameters);
            } else if (menuId === "viewCollateralGroups") {
                const parameters = {
                    directedThorughFacility: true,
                    facilityId: data.lineCode + "_" + data.lineSerialNumber,
                    compName: self.compName("collateral-groups"),
                    menuSelection: self.menuSelection("DRAFTS")
                };

                rootParams.dashboard.loadComponent("facility-details", parameters);
            } else if (menuId === "viewCovenants") {
                const parameters = {
                    directedThorughFacility: true,
                    facilityId: data.lineCode + "_" + data.lineSerialNumber,
                    compName: self.compName("facility-covenants"),
                    menuSelection: self.menuSelection("COVENANTS")
                };

                rootParams.dashboard.loadComponent("facility-details", parameters);
            }
        };

        self.calculateProgress = function(data1) {
            return Math.round(((data1.utilizedAmount.amount / data1.effectiveAmount.amount) * 100) * 100) / 100;
        };

        self.showFacilityDetails = function(data) {
            const parameters = {
                directedThorughFacility: true,
                facilityId: data.lineCode + "_" + data.lineSerialNumber
            };

            rootParams.dashboard.loadComponent("facility-details", parameters);

        };
    };
});