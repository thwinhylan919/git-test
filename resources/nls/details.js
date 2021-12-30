define(["ojL10n!resources/nls/generic"], function (Generic) {
    "use strict";

    const detailsLocale = function () {
        return {
            root: {
                generic: Generic,
                heading: { CreditFacilityDetails: "Credit Facility Details" },
                CreditFacilityDetails: {
                    Details: "Details",
                    CollateralGroups: "Collateral Groups",
                    Covenants: "Covenants",
                    navigation: "Navigation",
                    CovenantHeader:"Covenant ID 001",
                    FundingType: "Funding Type",
                    FacilityType: "Facility Type",
                    BlockAmount: "Block Amount",
                    Status: "Status",
                    StartDate: "Start Date",
                    navBarDescription:"Details navigation Description",
                    ExpiryDate: "Expiry Date",
                    ReviewFrequency: "Review Frequency",
                    NextReviewDate: "Next Review Date",
                    AmendFacility: "Amend Facility",
                    AddSubFacility: "Add Sub Facility",
                    Cancel: "Cancel",
                    Back: "Back",
                    facilitySchedule:"Facility Schedule",
                    RevolvingLine: "Revolving Line"
                }
            },
            ar: true,
            fr: true,
            cs: true,
            sv: true,
            en: false,
es :true,
            "en-us": false,
            el: true
        };
    };

    return new detailsLocale();
});