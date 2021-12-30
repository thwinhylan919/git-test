define([], function() {
    "use strict";

    const onboardcounterpartyreviewLocale = function() {
        return {
            root: {
                heading: {
                    ReviewBanner: "Review Banner",
                    CounterPartyDetails: "Counter Party Details"
                },
                ReviewBanner: {},
                CounterPartyDetails: {
                    PartyName: "Party Name",
                    ShortName: "Short Name",
                    CategoryofCorporate: "Category of Corporate",
                    CorporatePANNumber: "Corporate PAN",
                    Mobile: "Mobile",
                    Email: "Email",
                    mobileNumberValue: "+{code} -{number}",
                    notApplicable: "NA",
                    LandlineNumber: "Landline Number",
                    CorporateRegistrationNumber: "Corporate Registration Number",
                    TaxRegistrationNumber: "Tax Registration Number",
                    Fax: "Fax",
                    EmailId: "Email Id",
                    Address: "Address",
                    PreferredCommunicationMode: "Preferred Communication Mode",
                    PINCode: "PIN Code",
                    Confirm: "Confirm",
                    totalAddress: "{address1} {address2} {city} {state} {country} -{pinCode}",
                    Cancel: "Cancel",
                    Back: "Back"
                },
                confirmScreen: {
                    viewCounterparties: "View Counterparties",
                    scfDashboard: "Supply Chain Dashboard",
                    dashboard: "Go to Dashboard",
                    programName: "Program Name:",
                    programId: "Program ID:",
                    confirmMessage: "Your request has been initiated successfully !",
                    navigationText: "What would you like to do next?"
                },
                componentHeader: "onboard counter party",
                reviewCaption: "Review",
                reviewHeader: "You initiated a request for onboarding a counter party. Please review details before you confirm!",
                Others: "Others"
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

    return new onboardcounterpartyreviewLocale();
});