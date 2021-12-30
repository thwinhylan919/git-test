define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/collateral-overview",
    "./model",
    "ojs/ojbutton",
    "ojs/ojnavigationlist",
    "ojs/ojvalidationgroup",
    "ojs/ojformlayout"
], function(ko, $, resourceBundle, ChooseFacility) {
    "use strict";

    return function(params) {
        const self = this;

        self.nls = resourceBundle;
        ko.utils.extend(self, params.rootModel);
        params.baseModel.registerElement("segment-container");

        self.partyId = ko.observable();
        self.facilityId = ko.observable();
        self.partyLoaded = ko.observable(false);
        self.facilityListLoaded = ko.observable(false);
        self.facilityIdOptions = ko.observableArray([]);
        self.partyIdOptions = ko.observableArray([]);
        self.facilityData = ko.observableArray();
        self.facilityDataLoaded = ko.observable(false);
        self.liabilityId = ko.observable("");
        self.branchCode = ko.observable("");

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

        ChooseFacility.fetchLiabilityId().done(function(data) {
            self.liabilityId(data.liabilitydtos[0].id);
            self.branchCode(data.liabilitydtos[0].branch);

            ChooseFacility.getFacilityList(self.liabilityId(), self.partyId(), self.branchCode(), "INR").done(function(data) {
                convertTreeToJSON(data.facilitydtos);
                self.facilityListLoaded(true);
            });
        });

        ChooseFacility.fetchParty().done(function(data) {
            ChooseFacility.fetchPartyRelations().done(function(partyData) {
                const parties = [];

                parties.push({
                    label: data.party.id.displayValue,
                    value: data.party.id.value
                });

                const mappedParties = partyData.partyToPartyRelationship;

                for (let i = 0; i < mappedParties.length; i++) {
                    parties.push({
                        value: mappedParties[i].relatedParty.value,
                        label: mappedParties[i].relatedParty.displayValue
                    });
                }

                self.partyIdOptions(parties);
                self.partyLoaded(true);
            });
        });

        self.proceed = function() {
            ChooseFacility.fetchLiabilityId().done(function(data) {
                self.liabilityId(data.liabilitydtos[0].id);

                ChooseFacility.getFacilityDetails(self.liabilityId(), self.facilityId()).done(function(data) {
                    self.facilityData(data);
                    self.facilityDataLoaded(true);

                    const parameters = {
                        productId: "facilityAmend",
                        dataSegments: ["fsgbu-ob-clmo-ds-facility-application", "fsgbu-ob-clmo-ds-collaterals", "fsgbu-ob-clmo-ds-upload-documents"],
                        data: self.facilityData().facilityDTO
                    };

                    params.dashboard.loadComponent("segment-container", parameters);
                });
            });
        };

        self.showModal = function() {
            $("#choicePopup").trigger("openModal");
        };

        self.closeHandler = function() {
            params.dashboard.switchModule();
        };
    };
});