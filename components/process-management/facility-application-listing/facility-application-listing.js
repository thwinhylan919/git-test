define([
    "knockout",
    "jquery",
    "./model",
    "text!./facility-application-listing.json",
    "ojL10n!resources/nls/loan-application-listing",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojknockout",
    "ojs/ojfilmstrip",
    "ojs/ojavatar",
    "ojs/ojnavigationlist"

], function(ko, $, ApplicationListingModel, ProcessStatusMap, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        rootParams.baseModel.registerElement("nav-bar");

        self.processStatusMap = JSON.parse(ProcessStatusMap).processStatusMap;

        self.processStatusList = ko.observableArray([]);
        self.filteredApplicationList = ko.observableArray([]);
        self.filteredApplicationListLoaded = ko.observable(false);
        rootParams.baseModel.registerComponent("application-tracker-film-strip", "process-management");
        self.moduleDescription = ko.observable("Credit Facilities");
        self.processStatusListLoaded = ko.observable(false);
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.header);
        self.selectedProcStatusList = ko.observableArray([]);
        self.selectedModule = ko.observable("FCM");
        self.searchAppName = ko.observable();
        self.selectedApplicationDetails = ko.observable();
        self.datasegments = ko.observableArray([]);
        self.selectedModuleDetails = self.selectedModuleDetails || ko.observable(rootParams.rootModel.params.selectedModuleDetails);
        self.myHorizontal = ko.observable();
        self.myVertical = ko.observable();
        self.atHorizontal = ko.observable();
        self.atVertical = ko.observable();
        self.menuSelection = ko.observable();
        self.originalList = ko.observableArray([]);
        self.facilityType = ko.observable();
        self.searchRefresh = ko.observable(true);
        self.creditFacilityImage = "credit-facility/facility.svg";

        const flag = {
            addFacilityFlag: ko.observable(false),
            addSubFacilityFlag: ko.observable(false)
        };

        self.requestTypeArray = ko.observableArray([{ key: self.nls.requestType.all }, { key: self.nls.requestType.newFacility }, { key: self.nls.requestType.facilityAmendment }]);

        self.durationArray = ko.observableArray([{
                key: self.nls.duration.sevenDays,
                value: 7
            },
            {
                key: self.nls.duration.fifteenDays,
                value: 15
            },
            {
                key: self.nls.duration.oneMonth,
                value: 30
            },
            {
                key: self.nls.duration.threeMonths,
                value: 90
            },
            {
                key: self.nls.duration.sixMonths,
                value: 180
            },
            {
                key: self.nls.duration.sevenDays,
                value: 365
            }
        ]);

        rootParams.baseModel.registerElement("search-box");
        rootParams.baseModel.registerComponent("details-screen", "process-management");
        self.selectedRequestType = ko.observable();
        self.selectedDuration = ko.observable();
        self.DraftArray = ko.observableArray([]);
        self.SubmittedArray = ko.observableArray([]);
        self.InProgressArray = ko.observableArray([]);
        self.ApprovedArray = ko.observableArray([]);
        self.RejectedArray = ko.observableArray([]);
        self.tempDraftname = ko.observable("Draft");

        const todayDate = rootParams.baseModel.getDate();

        self.remove = function(data) {
            self.draftArray.splice(data, 1);
        };

        self.applyDraftFilter = function() {
            self.filteredApplicationList.removeAll();

            ApplicationListingModel.facilityData().then(function(data) {

                for (let i = 0; i < data.processManagementDTOs.length; i++) {
                    if (data.processManagementDTOs[i].otherInformation) {
                        const otherInfo = data.processManagementDTOs[i].otherInformation.split("~");

                        data.processManagementDTOs[i].facilityDesc = otherInfo[0];
                        data.processManagementDTOs[i].facilityExpiryDate = otherInfo[1];
                    } else {
                        data.processManagementDTOs[i].facilityDesc = "";
                        data.processManagementDTOs[i].facilityExpiryDate = "";
                    }

                    if (data.processManagementDTOs[i].status === "IN_PROGRESS") {
                        self.InProgressArray.push(data.processManagementDTOs[i]);
                    }

                    if (data.processManagementDTOs[i].status === "APPROVED") {
                        self.ApprovedArray.push(data.processManagementDTOs[i]);
                    }

                    if (data.processManagementDTOs[i].status === "REJECTED") {
                        self.RejectedArray.push(data.processManagementDTOs[i]);
                    }

                    if (data.processManagementDTOs[i].status === "DRAFT") {
                        self.DraftArray.push(data.processManagementDTOs[i]);
                    }

                    if (data.processManagementDTOs[i].status === "SUBMITTED") {

                        ApplicationListingModel.readApp(data.processManagementDTOs[i].refId).then(function(res) {
                            self.SubmittedArray.push({
                                midOfficeRefNo: data.processManagementDTOs[i].midOfficeRefNo,
                                refId: data.processManagementDTOs[i].refId,
                                creationDate: data.processManagementDTOs[i].creationDate,
                                facilityDesc: res.processManagementDTO.payload.json && res.processManagementDTO.payload.json.facilityDetailsModel ? res.processManagementDTO.payload.json.facilityDetailsModel.facilityDescription : res.processManagementDTO.payload.json.collateralDesc,
                                amount: {
                                    amount: data.processManagementDTOs[i].amount ? data.processManagementDTOs[i].amount.amount : null,
                                    currency: data.processManagementDTOs[i].amount ? data.processManagementDTOs[i].amount.currency : null
                                },
                                partyId: {
                                    displayValue: data.processManagementDTOs[i].partyId.displayValue,
                                    value: data.processManagementDTOs[i].partyId.value
                                },
                                status: data.processManagementDTOs[i].status,
                                type: data.processManagementDTOs[i].type,
                                moduleId: data.processManagementDTOs[i].moduleId
                            });
                        });
                    }
                }

                self.menuSelection("DRAFT");

            });

        };

        self.applyDraftFilter();

        self.menuOptions = ko.observable([{
                id: "DRAFT",
                label: "Draft"
            }, {
                id: "SUBMITTED",
                label: "Submitted"
            }, {
                id: "inPROGRESS",
                label: "In Progress"
            }, {
                id: "APPROVED",
                label: "Approved"
            }, {
                id: "REJECTED",
                label: "Rejected"
            }

        ]);

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        self.menuSelectionSubscribe = self.menuSelection.subscribe(function(newValue) {
            self.filteredApplicationListLoaded(false);
            ko.tasks.runEarly();

            if (newValue === "SUBMITTED") {
                self.filteredApplicationList(self.SubmittedArray());
                self.originalList(self.SubmittedArray());

                self.filteredApplicationListLoaded(true);
            } else if (newValue === "DRAFT") {
                self.filteredApplicationList(self.DraftArray());
                self.originalList(self.DraftArray());

                self.filteredApplicationListLoaded(true);
            } else if (newValue === "inPROGRESS") {
                self.filteredApplicationList(self.InProgressArray());
                self.originalList(self.InProgressArray());

                self.filteredApplicationListLoaded(true);
            } else if (newValue === "REJECTED") {
                self.filteredApplicationList(self.RejectedArray());
                self.originalList(self.RejectedArray());

                self.filteredApplicationListLoaded(true);
            } else if (newValue === "APPROVED") {
                self.filteredApplicationList(self.ApprovedArray());
                self.originalList(self.ApprovedArray());
                self.filteredApplicationListLoaded(true);
            }
        });

        if (self.processStatusListLoaded() === false) {
            let key;

            for (key in self.processStatusMap) {
                if (key !== undefined) {
                    const status = {
                        procStatus: self.processStatusMap[key]
                    };

                    self.processStatusList.push(status);
                }
            }

            self.processStatusListLoaded(true);
        }

        self.onFilterIconClick = function() {
            const popup = document.querySelector("#filter-popup");

            if (popup.isOpen()) {
                popup.close();
            } else {
                if (rootParams.baseModel.large()) {
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

                popup.open("#enable-filter");
                $(".oj-popup-content").css("width", "15rem");
                $(".oj-popup-content").css("height", "9rem");
                $(".pStatus").css("font-weight", "bold");
                $(".statusDiv").css("font-size", "1rem");

                $(".process-status").css({
                    float: "left",
                    width: "0.7rem",
                    height: "0.7rem",
                    "border-radius": "50%",
                    "margin-left": "0.4rem",
                    "margin-right": "0.4rem",
                    "margin-top": "0.3rem"
                });

                $(".submitted").css("background-color", "#0A8BE6");
                $(".draft").css("background-color", "#5F2D61");
                $(".inProgress").css("background-color", "#FD6A02");
                $(".approved").css("background-color", "#FD6A02");
                $(".rejected").css("background-color", "#FD6A02");

            }
        };

        self.clear = function() {
            self.selectedDuration("");
            self.selectedRequestType("All");

        };

        self.applyFilter = function() {
            self.filteredApplicationList.removeAll();

            if (self.selectedModule() || self.selectedProcStatusList().length > 0) {
                self.filteredApplicationListLoaded(false);

                if (self.selectedModule()) {
                    if (self.selectedModule() === "FCM") {
                        self.applicationList.removeAll();

                        ApplicationListingModel.fetchApplicationDetails().then(function(data) {
                            data.jsonNode.data.pendingApplicationModelList.forEach(function(dataNew) {
                                self.applicationList.push(dataNew);
                                self.filteredApplicationListLoaded(false);

                                self.filteredApplicationList.push(dataNew);
                                self.filteredApplicationListLoaded(true);

                            });

                        });
                    }
                }

            }
        };

        function checkRequestType(listItem) {
            if (self.selectedRequestType() === "New Facility Application") {
                if (listItem.type === "New Facility Application") {
                    return true;
                }

                return false;
            }

            if (self.selectedRequestType() === "Facility Amendment") {
                if (listItem.type === "Facility Amendment") {
                    return true;
                }

                return false;
            }

            return true;
        }

        function checkDuration(listItem) {
            if (self.selectedDuration() === "") {
                return true;
            }

            const newDate = new Date(todayDate);

            newDate.setDate(newDate.getDate() - self.selectedDuration());

            return new Date(listItem.creationDate) >= newDate;

        }

        self.requestTypeChangedHandler = function(event) {
            self.filteredApplicationList(self.originalList().filter(checkRequestType).filter(checkDuration));

            const popup = document.querySelector("#filter-popup");

            if (popup.isOpen()) {
                popup.close();
            }
        };

        self.onReset = function() {
            self.selectedProcStatusList.removeAll();
            self.selectedModule("");

            const popup = document.querySelector("#filter-popup");

            if (popup.isOpen()) {
                popup.close();
            }
        };

        rootParams.baseModel.registerElement("segment-container");

        self.onAppSelect = function(data) {
            ApplicationListingModel.readApp(data.refId).then(function(res) {
                res.processManagementDTO.payload = res.processManagementDTO.payload.json;

                if (res.processManagementDTO.payload && res.processManagementDTO.payload.partyDemographics) {
                    res.processManagementDTO.payload.partyDemographics.partyId = res.processManagementDTO.partyId.value;
                }

                if (res.processManagementDTO.status === "DRAFT") {

                    if (data.type === "Facility Amendment") {
                        flag.id = data.refId;

                        const details = ko.mapping.fromJS(res.processManagementDTO.payload),
                            parameters = {
                                productId: "facility",
                                dataSegments: ["fsgbu-ob-clmo-ds-facility-application", "fsgbu-ob-clmo-ds-collaterals", "fsgbu-ob-clmo-ds-upload-documents"],
                                payload: details,
                                data: flag
                            };

                        rootParams.dashboard.loadComponent("segment-container", parameters);
                    } else if (data.type === "New Facility Application") {
                        if (res.processManagementDTO.payload.facilityDetailsModel) {
                            flag.addFacilityFlag(true);
                        }

                        if (res.processManagementDTO.payload.facilityDetailsModel && res.processManagementDTO.payload.facilityDetailsModel.facilityDetailsList.length > 0) {
                            flag.addSubFacilityFlag(true);
                        }

                        flag.id = data.refId;

                        const details = ko.mapping.fromJS(res.processManagementDTO.payload),
                            parameters = {
                                productId: "facility",
                                dataSegments: ["fsgbu-ob-clmo-ds-facility-application-create", "fsgbu-ob-clmo-ds-collaterals", "fsgbu-ob-clmo-ds-upload-documents"],
                                payload: details,
                                data: flag
                            };

                        rootParams.dashboard.loadComponent("segment-container", parameters);
                    } else if (data.type === "Collateral Evaluation") {
                        const details = ko.mapping.fromJS(res.processManagementDTO.payload),
                            parameters = {
                                productId: "collateralEvaluation",
                                dataSegments: [
                                    "fsgbu-ob-clmo-ds-collateral-evaluation-details",
                                    "fsgbu-ob-clmo-ds-collateral-evaluation-ownership-details",
                                    "fsgbu-ob-clmo-ds-collateral-evaluation-seniority-details",
                                    "fsgbu-ob-clmo-ds-collateral-evaluation-documents-upload"
                                ],
                                payload: details,
                                data: {
                                    module: "OBCFPM",
                                    type: "Collateral Evaluation",
                                    partyId: res.processManagementDTO.partyId.value,
                                    refId: data.refId
                                }
                            };

                        rootParams.dashboard.loadComponent("segment-container", parameters);
                    }
                } else {

                    rootParams.dashboard.loadComponent("details-screen", res.processManagementDTO);

                }
            });

        };

        self.applicationNumber = ko.observable();
        self.nameOfDraft = ko.observable();

        self.deleteDraft = function() {
            $("#deleteTemplate").hide();

            let message;

            ApplicationListingModel.deleteDraft(self.applicationNumber()).then(function(data) {
                if (data.status.result === "SUCCESSFUL") {
                    self.DraftArray.remove(function(DraftArray) { return DraftArray.refId === self.applicationNumber(); });
                    self.filteredApplicationList(self.DraftArray());

                    message = rootParams.baseModel.format(self.nls.draftDeleteMsg, {
                        referenceId: self.nameOfDraft()
                    });

                    rootParams.baseModel.showMessages(null, [message], "CONFIRMATION");
                }

            });

        };

        $(document).ready(function() {
            $("#trashIcon").click(function(event) {
                event.stopPropagation();
                event.preventdefault();
            });
        });

        self.confirmDelete = function(data) {
            self.applicationNumber(data.refId);
            self.nameOfDraft(data.draftName);
            $("#deleteTemplate").trigger("openModal");
        };

        self.hideDeleteTemplate = function() {
            $("#deleteTemplate").hide();
        };

        self.onClickCancel = function() {
            rootParams.dashboard.switchModule();
        };

        self.onClickBack = function() {
            rootParams.dashboard.loadComponent("application-tracker-film-strip", {});
        };

    };
});