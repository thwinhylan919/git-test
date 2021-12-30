define([], function() {
    "use strict";

    const processmanagementLocale = function() {
        return {
            root: {
                approvalMessages: {
                    APPROVED: {
                        successmsg: "You have successfully approved the transaction",
                        statusmsg: "Completed"
                    },
                    PENDING_APPROVAL: {
                        successmsg: "You have successfully approved the request. It is pending for further approval.",
                        statusmsg: "Pending Approval"
                    },
                    REJECTED: {
                        successmsg: "You have rejected the request.",
                        statusmsg: "Rejected"
                    },
                    FAILED: {
                        successmsg: "Rejected by host.",
                        statusmsg: "Failed"
                    }
                },
                newApplicationLink: "New Loan Application",
                appTracker: "Go To Application Tracker",
                amountNeeded: "Enter the amount of loan that you require",
                loanAmount: "Enter loan Amount",
                currencyType: "Currency",
                year: "Year",
                month: "Month",
                durationOfLoan: "For how long do you need this loan?",
                linkFacilities: "Link Facilities",
                noFacilitiesAvailable: "No Facilities are Available",
                loanAmountDescription: "Please let us know your requirement so as to serve you better.",
                priority: "Priority",
                percentage: "Percentage",
                linkageId: "Linked Facility ID",
                youCanFacilitiesAvailable: "You can link multiple facilities for your loan requirement.",
                businessNature: "What is the nature of your business?",
                turnoverccy: "Currency in which you deal with",
                OperatingProfit: "What is your operating profit for the year?",
                placeholderProfit: "Enter the current year Operating profit",
                placeholdetExport: "Export import license number",
                exportImportLicenceNo: "Enter your export import license number",
                currentYear: "Current Year",
                balanceSheetSize: "Specify your balance sheet size",
                placeholderBalance: "Enter your balance sheet size",
                currentYearNetProfit: "What is your net profit for the year?",
                placeholderYear: "Enter current year Net profit",
                documentUploaded: "Document is uploaded",
                noDocumentUploaded: "No Document Uploaded",
                availableFacility: "Facility connected",
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
                zone: "Select the zone in which the property is located",
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
                listPendingCharges: "Select the charges pending against your property",
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
                remarks: "Remarks",
                select: "Select",
                yearPlaceholder: "Year",
                documentType:{
                   ADDRESDOC:"Address Proof",
                   INDENTDOC:"Identification Documents"
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

    return new processmanagementLocale();
});