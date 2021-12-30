define([
    "ojL10n!resources/nls/mapping-summary-details",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (resourceBundle, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.partyDetails = params.partyDetails;
        self.isModuleSelected = ko.observable(params.isModuleSelected);
        self.mappingData = null;
        self.isSetupExists = ko.observable(false);
        self.partySetUpNotExists = ko.observable(false);
        self.moduleData = ko.observable();
        self.dataToDisplay = ko.observableArray([]);
        self.dataLoaded = ko.observable(false);
        self.noData = ko.observable(false);
        params.baseModel.registerComponent("attribute-details", "corporate-resource-access");
        self.userData = params.userData;
        self.noAttributeMapMsg = ko.observable();

        self.onClickMap16 = function (event) {
            if (event) {
                const dataPassed = ko.mapping.toJS({
                    partyId: self.partyDetails.party.displayValue,
                    value: self.partyDetails.party.value,
                    partyName: self.partyDetails.partyName,
                    selectedModule: params.selectedModule,
                    editPressed: true,
                    accessData: self.mappingData.accessData,
                    attributeData: self.mappingData.attributeData,
                    userData: self.userData,
                    isUserSelected: params.isUserSelected,
                    accessLevel: params.accessLevel,
                    attributeName: self.mappingData.accessData.attributeName
                });

                params.dashboard.loadComponent("attribute-details", dataPassed);
            }
        };

        self.onClickAttributeName62 = function (event) {
            if (event) {
                const dataPassed = ko.mapping.toJS({
                    partyId: self.partyDetails.party.displayValue,
                    value: self.partyDetails.party.value,
                    partyName: self.partyDetails.partyName,
                    selectedModule: params.selectedModule,
                    editPressed: false,
                    accessData: self.mappingData.accessData,
                    attributeData: self.mappingData.attributeData,
                    userData: self.userData,
                    isUserSelected: params.isUserSelected,
                    accessLevel: params.accessLevel,
                    attributeName: self.mappingData.accessData.attributeName
                });

                params.dashboard.loadComponent("attribute-details", dataPassed);
            }
        };

        self.setData = function (data) {
            self.mappingData = data.attributeAccessDTOs[0];

            if (self.mappingData) {
                if (self.mappingData.setupInformation === "SETUP_EXISTS") {
                    self.isSetupExists(true);
                } else if (self.mappingData.setupInformation === "SETUP_NOT_CREATED") {
                    self.isSetupExists(false);
                } else if (self.mappingData.setupInformation === "PARTY_SETUP_MISSING") {
                    self.partySetUpNotExists(true);
                }

                if (self.mappingData.summary) {
                    self.dataToDisplay.push({
                        attributeName: self.mappingData.accessData.attributeName,
                        mappedAttributes: self.mappingData.summary.mappedAttributes,
                        totalAttributes: self.mappingData.summary.totalAttributes
                    });

                    let headerDynamicTextTotal, headerDynamicTextMapped;

                    if (self.mappingData.accessData.attributeName === "Facility") {
                        headerDynamicTextTotal = self.nls.totalNoFacilities;
                        headerDynamicTextMapped = self.nls.facilitiesMapped;
                    } else if (self.mappingData.accessData.attributeName === "Program") {
                        headerDynamicTextTotal = self.nls.totalNoPrograms;
                        headerDynamicTextMapped = self.nls.programsMapped;
                    } else if (self.mappingData.accessData.attributeName === "Remitter List") {
                        headerDynamicTextTotal = self.nls.totalNoRemitterLists;
                        headerDynamicTextMapped = self.nls.remitterListsMapped;
                    }

                    self.columnArray = [{
                            headerText: self.nls.resourceType
                        },
                        {
                            headerText: headerDynamicTextTotal

                        },
                        {
                            headerText: headerDynamicTextMapped
                        }
                    ];

                    if (self.mappingData.attributeData) {
                        self.mappingData.attributeData.sort(function (a, b) {
                            if (a.allowed) {
                                return -1;
                            } else if (b.allowed) {
                                return 1;
                            }

                            return 0;
                        });
                    }

                    if (self.mappingData.accessData.partyLevelAccess) {
                        self.mappingData.accessData.partyLevelAccess = ["true"];
                    } else {
                        self.mappingData.accessData.partyLevelAccess = [];
                    }

                    if (!self.mappingData.accessData.futureAttributeAccess) {
                        self.mappingData.accessData.futureAttributeAccess = false;
                    }
                }

                if (self.mappingData.accessData.attributeName === "Program") {
                    self.noAttributeMapMsg(self.nls.ProgramMappingSummary.NoProgramsmapped);
                } else if (self.mappingData.accessData.attributeName === "Facility") {
                    self.noAttributeMapMsg(self.nls.ProgramMappingSummary.NoProgramFacilities);
                } else if (self.mappingData.accessData.attributeName === "Remitter List") {
                    self.noAttributeMapMsg(self.nls.ProgramMappingSummary.NoRemitterLists);
                }

                self.moduleData(self.mappingData.summary);
                self.dataLoaded(true);

            } else {
                self.dataLoaded(false);
                self.noData(true);
            }
        };

        if (params.accessLevel === "PARTY") {
            params.readAttributeAccess(params.partyDetails.party.value(), params.selectedModule().code).then(function (data) {
                self.setData(data);
            });
        } else if (params.accessLevel === "USER") {
            params.readAttributeAccess(params.userData().userid, params.partyDetails.party.value(), params.selectedModule().code).then(function (data) {
                self.setData(data);
            });
        }

        self.dataSource4 = new oj.ArrayTableDataSource(self.dataToDisplay, {
            idAttribute: "attributeName"
        });

    };
});