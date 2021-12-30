define(function () {
    "use strict";

    const equipmentDetailsOverview = function () {
        return {
            root: {
                equipmentDetails: {
                    equipmentDetailsHeader: "Equipment Details",
                    equipmentDetailsDescription: "Please verify & update your equipment details.",
                    labelMachineryType: "Specify the type of machinery being purchased.",
                    machineryType: "Enter Machinery Type",
                    labelMachineDetails: "Please provide additional details of the machinery",
                    machineDetails: "Enter Machine Details",
                    labelManufacturedYear: "When was the machine manufactured?",
                    labelPurchaseDate: "When was the machinery purchased?",
                    purchaseDate: "DD MM YYYY",
                    labelManufacturerName: "Who has manufactured the machinery?",
                    manufacturerName: "Enter Manufacturer Name",
                    labelManufacturerModel: "What is the model number of the machinery?",
                    manufacturerModel: "Enter Manufacturer Model",
                    labelIntendedUse: "Specify the purpose for which the machinery is being purchased.",
                    intendedUse: "Enter Intended Use",
                    labelAssetValue: "What is the total value of the machinery?",
                    assetValue: "Enter Asset Value",
                    currency: "Currency",
                    labelRemarks: "Do you have any specific instructions for us?",
                    remarks:"Remarks",
                    select: "Select",
                    yearPlaceholder:"Year",
                    onlyNumber:"Only Number is allowed"
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

    return new equipmentDetailsOverview();
});