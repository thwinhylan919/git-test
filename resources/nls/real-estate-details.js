define(function() {
    "use strict";

    const realEstateDetailsOverview = function() {
        return {
            root: {
                realEstateDetails: {
                    realEstateDetailsHeader: "Real Estate Details",
                    realEstateDetailsDescription: "Please verify & update your Real Estate details.",
                    propertyType: "Specify the type of property",
                    propertyStatus: "What is the status of the property?",
                    constructionStatus: "What is the current status of construction?",
                    constructionCompletion: "When is the construction expected to be completed?",
                    constructionCompleted: "If construction has been completed, enter the date of completion",
                    propertyPurchase: "Enter the date on which the property was purchased",
                    registrationNumber: "Specify the registration number / unique reference number of the property",
                    propertyLocation: "Where is the property located?",
                    city: "City",
                    state: "State",
                    country: "Country",
                    zipCode: "Zip Code",
                    propertyArea: "What is the area of property?",
                    unit: "Unit",
                    marketValue: "What is the market value of the property?",
                    eligibleValue: "What is the eligible value of property?",
                    builderName: "What is the name of the builder?",
                    builderClassification: "Specify the classification of the builder",
                    ownershipStatus: "Specify the status of ownership",
                    pendingCharges: "Are there any existing charges pending against the property?",
                    zone: "Specify zone in which the property is located",
                    select: "Select",
                    date: "DD MM YYYY",
                    regNumber: "Enter Registration Number",
                    enterCity: "Enter City",
                    addressLine1: "Address Line 1",
                    addressLine2: "Address Line 2",
                    addressLine3: "Address Line 3",
                    addressLine4: "Address Line 4",
                    yes: "Yes",
                    no: "No",
                    isZone: "Is your property located in a special zone?",
                    completed: "Completed",
                    underConstruction: "Under Construction",
                    new: "New",
                    existing: "Existing",
                    freeHold: "Freehold",
                    leaseHold: "Leasehold",
                    listPendingCharges: "Specify charges pending against property",
                    addMore: "Add Line",
                    removeAddressLine: "Remove Line",
                    onlyNumber: "Only Number Allowed"
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

    return new realEstateDetailsOverview();
});