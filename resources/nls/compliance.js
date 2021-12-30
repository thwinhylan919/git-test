define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";

    const ComplianceLocale = function() {
        return {
            root: {
                fatcaHeader: "FATCA & CRS Self-Certification Form for Individuals",
                fatcaText: "Tax regulations require the collection of certain information about each account holder's tax residency and citizenship status. Please complete the following relevant sections and provide any additional information that may be required. In certain circumstances there may be a requirement to share this information with relevant tax authorities. Please refer to the accompanying guidance notes when completing this form. Please consult your professional tax advisor if you have any questions regarding this form.",
                fullName: "{firstName} {middleName} {lastName}",
                country: "Country",
                state: "State",
                city: "City",
                zip: "Zip Code",
                address: "Address",
                confirmationSuccessMessage: "Thank you for submitting your details. You might be contacted by the bank in case any further information or documents are required.",
                formCompletionError: "Please complete the form",
                heading: {
                    customerIdentificationInfo: "Customer Identification",
                    additionalkycInfo: "Additional KYC Information",
                    taxResidencyInfo: "Tax Residency Information",
                    declaration: "Declaration"
                },
                customerIdentificationInfo: {
                    title: "Title",
                    fullName: "Full Name",
                    addressType: "Address Type",
                    addressType1: "Permanent",
                    addressType2: "Current Residential",
                    addressTypeOther: "Other",
                    otherAddress: "Other Address",
                    mailingAddress: "Mailing Address",
                    sameAsAbove: "Same as above",
                    nationality: "Nationality",
                    countryOfBirth: "Country of Birth",
                    placeOfBirth: "City/Place of Birth",
                    identificationType: "Identification Type",
                    identificationNumber: "Identification Number",
                    fathersName: "Father's Name",
                    spousesName: "Spouse's Name"
                },
                additionalkycInfo: {
                    occupation: "Occupation",
                    grossAnnualIncome: "Gross Annual Income",
                    pepStatus: "Politically Exposed Person (PEP) Status",
                    pepStatus1: "I am a Politically Exposed Person",
                    pepStatus2: "I am related to a Politically Exposed Person",
                    pepStatus3: "Not Applicable"
                },
                taxResidencyInfo: {
                    ques1: "Are you a tax resident of any country other than India?",
                    ques2: "Are you a Citizen of the United States of America?",
                    ques3: "Do you meet the Substantial Presence Test?",
                    ques4: "Do you have a U.S Green Card?",
                    ques5: "Was the Entity established in a country other than India?(Applicable to Sole Proprietor Only)",
                    countryOfTaxResidence: "Country of Tax Residence",
                    tinAvailable: "TIN Available",
                    reasonForNonAvailability: "Reason for Non Availability",
                    taxIdentificationType: "Tax Identification Type",
                    TIN: "TIN/TIN Equivalent",
                    addAnotherCountry: "Add Another Country",
                    removeCountry: "Remove Country",
                    removeCountryClick: "Click to remove added country of residence",
                    addAnotherCountryClick: "Click to add another country of residence",
                    tinInfo: "A Taxpayer Identification Number (TIN) is an identifying number used for tax purposes that is issued by the government. A TIN is known by different terms in different countries.",
                    tinInfoAlt: "Link to view more information about TIN",
                    tinInfoTitle: "Click here to view more information about TIN",
                    sptInfo: "To know more, Please read the Substantial Presence Test info at the bottom of the page.",
                    sptInfoAlt: "Link to view more information about Substantial Presence Test",
                    sptInfoTitle: "Click here to view more information about Substantial Presence Test",
                    otherTaxIdentificationType: "Other Tax Identification Type",
                    other: "Other"
                },
                declaration: {
                    declarationText1: "I acknowledge and agree that information contained in this form and information regarding income above may be reported to the tax authorities of the country in which such income arises and that those tax authorities may provide the information to the country or countries in which I am a resident for tax purposes.",
                    declarationText2: "Futura Bank is not able to offer any tax advice on FATCA or CRS or its impact on me. I shall seek advice from a professional tax advisor for any tax related questions. I undertake to notify Futura Bank of any change in circumstances that causes any information on this form to become incorrect and to provide Futura Bank with updated information within 30 days of said change.",
                    declarationText3: "I authorize Futura Bank to close or suspend my account(s) without any obligation of advising me of the same if any information provided by me in this form or hereafter is found to be false, untrue or misleading. I have understood the FATCA and CRS instructions and the requirement of information collected through this form and hereby confirm that the information provided by me in this form is true, correct and complete to the best of my knowledge.",
                    declarationAccept: "I, {fullName} declare acceptance of all statements above"
                },
                messages: {
                    occupation: "Please select your occupation",
                    grossAnnualIncome: "Please enter your gross annual income",
                    pepStatus: "Please select your Politically Exposed Person status",
                    title: "Please select your title",
                    fullName: "Please enter your full name",
                    addressType: "Please select your address type",
                    otherAddressType: "Please enter the other address type",
                    nationality: "Please select your nationality",
                    countryOfBirth: "Please select your country of birth",
                    placeOfBirth: "Please select your city/place of birth",
                    domesticTaxResident: "Please select if you are tax resident of any country other than India",
                    uSCitizen: "Please select if you are a Citizen of the United States of America",
                    sPTstatus: "Please select if you meet the Substantial Presence Test",
                    uSGreenCardOwner: "Please select if you have a U.S Green Card",
                    country: "Please select country",
                    state: "Please select state",
                    city: "Please enter your city",
                    zipcode: "Please enter zip code",
                    line1: "Please enter the 1st line of address",
                    countryOfTaxResidence: "Please select your country of tax residence",
                    reasonForNonAvailability: "Please enter the reason for non availability",
                    taxIdentificationType: "Please select tax identification type",
                    tinAvailable: "Please select if your TIN is available",
                    TIN: "Please enter your TIN",
                    declarationCheckbox: "Please indicate that you accept the above statements",
                    line2: "Please enter valid address",
                    otherAddressTypeValid: "Please enter a valid address type",
                    identificationNumber: "Please enter your identification number",
                    fathersName: "Please enter your father's name",
                    spouseName: "Please enter your spouse's name",
                    otherTaxIdentificationType: "Please enter your other tax identification type"
                },
                viewMore: "View More",
                viewLess: "View Less",
                continue: "Continue",
                editSection: "Edit {sectionName} section",
                editSectionTitle: "Edit {sectionName} section",
                reviewHeader: "Please review the following details before you submit the FATCA & CRS Self-Certification Form.",
                pleaseSelect: "Please Select",
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

    return new ComplianceLocale();
});