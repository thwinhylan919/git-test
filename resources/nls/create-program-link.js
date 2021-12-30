define([], function () {
    "use strict";

    const createprogramlinkLocale = function () {
        return {
            root: {
                heading: { CreateProgram: "Create Program" },
                CreateProgram: {
                    SelectCounterparties: "Select Counterparties",
                    LinkCounterpartiesonthegotothenewlycreatedprogram: "Link Counterparties on the go to the newly created program.",
                    ShowSelected: "Show Selected",
                    ShowSelectedTitle: "Click for Show Selected",
                    ShowAll: "Show All",
                    ShowAllTitle: "Click for Show All",
                    SelectAll: "Select All",
                    SelectAllTitle: "Click for Select All",
                    DeselectAll: "Deselect All",
                    DeselectAllTitle: "Click for Deselect All",
                    ListofCounterpartiestobelinkedwithprogram: "List of Counterparties to be linked with program",
                    SelectOption: "Select Option",
                    CounterpartyName: "Counterparty Name",
                    IdspokeId: "Id - {spokeId}",
                    CounterpartyAddress: "Counterparty Address",
                    CharacterIndex: "Character Index",
                    CounterpartyNameCardView: "Counterparty Name Card View",
                    SelectOptionCardView: "Select Option Card View",
                    CounterpartyAddressCardView: "Counterparty Address Card View",
                    CharacterIndexincardview: "Character Index in card view",
                    Submit: "Submit",
                    Cancel: "Cancel",
                    Back: "Back",
                    noDataToDisplay: "There are no Counterparties on-boarded by you to display."
                },
                checkBoxLabel: "Select check box to select the card or list item",
                avatarLabel: "Initials for a particular spoke",
                errorMessage: "At least One Spoke is mandatory for Program Creation",
                componentHeader: "Create Program",
                listView: "List View",
                cardView: "Card View",
                editProgramHeader: "Edit Program"
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

    return new createprogramlinkLocale();
});