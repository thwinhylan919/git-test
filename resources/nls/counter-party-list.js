define([], function () {
    "use strict";

    const counterpartylistLocale = function () {
        return {
            root: {
                heading: {
                    Search: "Search"
                },
                Search: {
                    AssociatedPartyList: "Associated Party List",
                    All: "All",
                    Anchor: "Anchor",
                    Counterparty: "Counterparty",
                    ListofCounterpartiestobelinkedwithprogram: "List of Counterparties to be linked with program",
                    Counterpartyname: "Counterparty name",
                    CounterpartyAddress: "Counterparty Address",
                    Id: "Id -",
                    CounterpartyIdentifier: "Counterparty Identifier",
                    BEINobeiNumber: "Contact Number {phoneNumber}",
                    Product: "Product",
                    CounterpartyNameCardView: "Counterparty Name Card View",
                    CounterpartyNameCardViewTitle: "Click here for Associated Party details",
                    IdspokeId: "Id - {spokeId}",
                    Active: "Active",
                    Address: "Address",
                    UserRole: "Party Role",
                    taxRegistrationNumber: "Tax Registration No.",
                    notApplicable: "NA",
                    Pannumber: "Pan number",
                    Cancel: "Cancel"
                },
                status: {
                    ACTIVE: "Active",
                    INACTIVE: "Inactive",
                    INITIATED: "Initiated",
                    MODIFIED: "Modified",
                    OTHERS: "Others"
                },
                componentHeader: "View Associated Parties",
                listView: "List View",
                cardView: "Card View",
                sectionLabel: "Can't find what you are looking for?",
                onboard: "Onboard new",
                searchName: "Name",
                partyLabel: "Party ID : {partyId}",
                editProgramHeader: "Edit Program",
                anchor: "Anchor"
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

    return new counterpartylistLocale();
});