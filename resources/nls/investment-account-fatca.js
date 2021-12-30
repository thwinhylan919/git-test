define([
    "ojL10n!resources/nls/messages",
    "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
    "use strict";

    const FatcaDetailsLocale = function() {
        return {
            root: {
                addressType: "Address Type",
                addressType1: "Permanent",
                addressType2: "Current Residential",
                addressTypeOther: "Other",
                nationality: "Nationality",
                indian: "Indian",
                other: "Other",
                countryOfBirth: "Country of Birth",
                placeOfBirth: "Place within Country of Birth",
                pepStatus: "PEP Status",
                pepStatusDummy: "Non editable PEP Status",
                incomeSlab: "Gross Annual Income",
                occupation: "Occupation",
                openAccountHeader: "Open Investment Account",
                sourceOfIncome: "Source of Wealth/Income",
                fatherName: "Father/Spouse's Name",
                countryOfResidence: "Country of Residence",
                countryOfTaxResidence: "Country of Tax Residence",
                taxIdentificationNo: "Tax Identification No.",
                taxIdentificationDocuments: "Tax Identification Document",
                addAnother: "Add Another Country of Residence and Tax Details",
                sectionHeader: "Country of Residence and Tax Details {index}",
                clickToDelete: "Click to delete Country of Residence and Tax Details",
                deleteDetails: "Delete Country of Residence and Tax Details",
                select: "Select",
                modelWindowText: "Would you like to give additional inputs  like Assets & Liabilities, Investments and Relatives information? It will help us to tailor our investment advise better suits your needs.",
                noButtonText: "No, I will do it later",
                additionalDetails: "Additional Details",
                additionalInformation: "Additional Information",
                countryPopUpError: "Tax Residency Details",
                countryPopUpErrorMsg: "Tax residency details for this country already exists, please choose a different country",
                messages: Messages,
                generic: Generic
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

    return new FatcaDetailsLocale();
});