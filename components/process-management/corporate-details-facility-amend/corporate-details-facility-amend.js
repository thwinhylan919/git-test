define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/corporate-details-facility",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojlistview",
    "ojs/ojpopup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(ko, CorpDetailsModel, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this,
            getNewModel = function() {
                const KoModel = ko.mapping.fromJS(CorpDetailsModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, params.rootModel);

        self.parties = ko.observableArray();
        self.partiesAddr = ko.observable();
        self.isPartyListLoaded = ko.observable(false);
        self.Nls = resourceBundle.corporateDetails;
        self.partySelected = ko.observable(false);
        self.review = params.review;

        if (params.rootModel.productData().payload !== undefined) {
            self.applicantDetails = params.rootModel.productData().payload.applicantDetails;
            self.basicapplicationDetails = params.rootModel.productData().payload.basicapplicationDetails;
        }

        self.addressDetails = ko.observable();
        self.partyName = ko.observable();
        self.contactDetails = ko.observable();
        self.incorporationCountry = ko.observable();
        self.addressLine1 = ko.observable();
        self.addressLine2 = ko.observable();
        self.addressLine3 = ko.observable();
        self.loginPartyId = ko.observable();
        self.onlyPartyId = ko.observable(false);
        self.shortName = ko.observable();
        self.city = ko.observable();
        self.country = ko.observable();
        self.postalCode = ko.observable();

        CorpDetailsModel.allPartyDetails().then(function(data) {

            self.selectedParty(data.party.id.value);
            params.rootModel.productData().data.type = "Facility Amendment";
            params.rootModel.productData().data.partyId = self.selectedParty();

            if (self.productData().payload.availableAmount) {
                params.rootModel.productData().data.amount = self.productData().payload.availableAmount.amount();
                params.rootModel.productData().data.currency = self.productData().payload.availableAmount.currency();
            }

            if (params.rootModel.productData().payload !== undefined) {
                const partyId = {
                    value: self.selectedParty()
                };

                params.rootModel.productData().payload.partyId = partyId;
            }

            const address = params.baseModel.format(self.Nls.address, {
                addressLine1: data.party.addresses[0].postalAddress.line1,
                addressLine2: data.party.addresses[0].postalAddress.line2,
                addressLine3: data.party.addresses[0].postalAddress.line3,
                city: data.party.addresses[0].postalAddress.city,
                country: data.party.addresses[0].postalAddress.country,
                postalCode: data.party.addresses[0].postalAddress.postalCode
            });

            self.addressLine1(data.party.addresses[0].postalAddress.line1);
            self.addressLine2(data.party.addresses[0].postalAddress.line2);
            self.addressLine3(data.party.addresses[0].postalAddress.line3);
            self.city = data.party.addresses[0].postalAddress.city;
            self.country = data.party.addresses[0].postalAddress.country;

            self.addressDetails(address);
            self.partyName(data.party.personalDetails.fullName);
            self.selectedParty(data.party.personalDetails.fullName);

            self.shortName(data.party.personalDetails.shortName);

            self.incorporationCountry(data.party.addresses[0].postalAddress.country);

            self.loginPartyId(data.party.id.value);

            self.postalCode = data.party.addresses[0].postalAddress.postalCode;

            for (let i = 0; i < data.party.contacts.length; i++) {
                if (data.party.contacts[i].phone !== undefined) {
                    self.contactDetails(data.party.contacts[i].phone.number);
                    break;
                }
            }

            if (params.rootModel.productData().payload.applicantDetails === undefined) {
                self.mappingDto();
            }

            self.onlyPartyId(true);
        });

        self.partyChangeHandler = function(event) {

            self.selectedParty(event.detail.value);

            CorpDetailsModel.fetchPartyDetails(event.detail.value).then(function(data) {

                const address = params.baseModel.format(self.Nls.address, {
                    addressLine1: data.party.addresses[0].postalAddress.line1,
                    addressLine2: data.party.addresses[0].postalAddress.line2,
                    addressLine3: data.party.addresses[0].postalAddress.line3,
                    city: data.party.addresses[0].postalAddress.city,
                    country: data.party.addresses[0].postalAddress.country,
                    postalCode: data.party.addresses[0].postalAddress.postalCode
                });

                self.addressLine1(data.party.addresses[0].postalAddress.line1);
                self.addressLine2(data.party.addresses[0].postalAddress.line2);
                self.addressLine3(data.party.addresses[0].postalAddress.line3);
                self.city = data.party.addresses[0].postalAddress.city;
                self.country = data.party.addresses[0].postalAddress.country;
                self.postalCode = data.party.addresses[0].postalAddress.postalCode;

                self.addressDetails(address);
                self.partyName(data.party.personalDetails.fullName);
                self.selectedParty(data.party.personalDetails.fullName);

                self.shortName(data.party.personalDetails.shortName);
                self.incorporationCountry(data.party.addresses[0].postalAddress.country);

                for (let i = 0; i < data.party.contacts.length; i++) {
                    if (data.party.contacts[i].phone !== undefined) {
                        self.contactDetails(data.party.contacts[i].phone.number);
                        break;
                    }
                }

            });

            self.mappingDto();
        };

        self.mappingDto = function() {
            self.applicantDetails = getNewModel().applicantDetails;
            self.applicantDetails.customerName(self.partyName());
            self.applicantDetails.telephoneNumber(self.contactDetails());

            self.applicantDetails.addressLine1 = self.addressLine1;
            self.applicantDetails.addressLine2 = self.addressLine2;
            self.applicantDetails.addressLine3 = self.addressLine3;
            self.applicantDetails.legalStatus(self.Nls.legalStatusValue);
            self.applicantDetails.customerNumber = self.selectedParty;
            self.applicantDetails.shortName = self.shortName;

            self.applicantContact = getNewModel().applicantContact;
            self.applicantContact.name(self.partyName());
            self.applicantContact.telephoneNumber(self.contactDetails());

            self.applicantContact.addressLine1 = self.addressLine1;
            self.applicantContact.addressLine2 = self.addressLine2;
            self.applicantContact.addressLine3 = self.addressLine3;
            self.applicantContact.city = self.city;

            self.applicantDetails.applicantContact.push(self.applicantContact);

            self.basicapplicationDetails = getNewModel().basicapplicationDetails;
            self.basicapplicationDetails.customerName = self.partyName;
            self.basicapplicationDetails.customerNumber = self.selectedParty;
            self.basicapplicationDetails.name = self.partyName;

        };

    };
});