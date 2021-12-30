define([
    "ojL10n!resources/nls/messages",
    "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
    "use strict";

    const onboardcounterpartyformLocale = function() {
        return {
            root: {
                heading: {
                    onboardcounterpartyform: "onboard-counter-party-form"
                },
                onboardcounterpartyform: {
                    PartyName: "Party Name",
                    ShortName: "Short Name",
                    CategoryOfCorporate: "Category Of Corporate",
                    CorporateRegistrationNumber: "Corporate Registration Number",
                    select: "Select",
                    TaxRegistrationNumber: "Tax Registration Number",
                    CorporatePAN: "Corporate PAN",
                    MobileNumber: "Mobile Number",
                    EmailID: "Email ID",
                    LandLineNumber: "Landline Number",
                    AddLandLine: "Add Landline",
                    AddLandLineTitle: "Click here to Add Landline",
                    PreferredCommunicationMode: "Preferred Communication Mode",
                    Email: "Email",
                    Mobile: "Mobile",
                    AddressLine: "Address Line 1",
                    AddressLine2: "Address Line 2",
                    City: "City",
                    State: "State",
                    Country: "Country",
                    PINCode: "PIN Code",
                    Submit: "Submit",
                    Cancel: "Cancel",
                    Back: "Back",
                    countryCode: "Country Code"
                },
                componentHeader: "Onboard Counter party",
                PartyID: "Party ID: {partyId}",
                messages: Messages,
                generic: Generic,
                nameError: "Please enter a valid name",
                regError: "Please Enter Valid registration Number",
                panError: "Please Enter Valid PAN",
                countryCodeError: "Please Enter Valid Country code",
                transactionName: "Onboard Counter party",
                contactHint: "Please Provide Landline Number",
                CorporateRegistrationNumberHint: "Only Alphanumeric characters allowed",
                panHint: "Only Alphanumeric characters allowed",
                AddressHint: "Only 'hyphen(-)', 'comma(,)',single inverted comma('),  and 'ampersand(&)' special characters are allowed. Max Characters Allowed :105",
                invalidContact: "Invalid Contact number",
                mobileNoError: "Please Enter Valid Mobile Number",
                landlineNoError: "Please Enter Valid Landline Number"
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

    return new onboardcounterpartyformLocale();
});