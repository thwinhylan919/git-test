/**
 * Demand draft address.
 *
 * @module payments
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} addressModel
 * @requires {object} ResourceBundle
 */
define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/demand-draft-address",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojselectcombobox",
    "ojs/ojradioset",
    "ojs/ojknockout-validation"
], function(ko, addressModel, resource) {
    "use strict";

    /** Demand draft address.
     *
     *IT allows user to select various type deliver mode and enter address for the same.
     *
     * @param {Object} Params  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     *
     */
    return function(Params) {
        const self = this;

        self.taxonomyDefinition = Params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.payment.dto.payee.DemandDraftPayeeRequestDTO");
        self.address = Params.address;
        self.typeOfDraft = Params.typeOfDraft;
        self.countries = ko.observableArray();
        self.resource = resource;

        const addressMap = {};

        self.myAddressArray = ko.observableArray();
        self.cityList = ko.observableArray();
        self.branchList = ko.observableArray();
        self.cityLoaded = ko.observable(false);
        self.branchLoaded = ko.observable(false);
        self.branchAddressLoaded = ko.observable(false);
        self.isCountriesLoaded = ko.observable(false);
        self.myAddressLoaded = ko.observable(false);

        addressModel.getCityList("all").then(function(data) {
            for (let i = 0; i < data.cities.length; i++) {
                self.cityList.push({
                    code: data.cities[i],
                    description: data.cities[i]
                });
            }

            self.cityLoaded(true);
        });

        if (self.typeOfDraft.toLowerCase() === "international") {
            addressModel.getCountries().then(function(data) {
                self.isCountriesLoaded(false);
                self.countries.removeAll();

                for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.countries.push({
                        text: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code
                    });
                }

                self.isCountriesLoaded(true);
            });
        }

        self.loadbranches = function() {
            if (self.address.postalAddress.city() !== "") {
                addressModel.getBranches("all", self.address.postalAddress.city()).then(function(data) {
                    self.branchLoaded(false);
                    self.branchList.removeAll();
                    ko.tasks.runEarly();

                    for (let i = 0; i < data.branchAddressDTO.length; i++) {
                        self.branchList.push({
                            code: data.branchAddressDTO[i].id,
                            description: data.branchAddressDTO[i].branchName
                        });
                    }

                    if (!self.address.postalAddress.branch()) {
                        self.address.postalAddress.branch(self.branchList()[0].code);
                    }

                    self.fetchBranchAddress();
                    self.branchLoaded(true);
                });
            }
        };

        self.fetchBranchAddress = function() {
            addressModel.getBranchAddress(self.address.postalAddress.branch()).then(function(data) {
                self.branchAddressLoaded(false);

                const branchAddress = data.addressDTO[0].branchAddress.postalAddress;

                self.address.postalAddress.line1(branchAddress.line1 ? branchAddress.line1 : "");
                self.address.postalAddress.line2(branchAddress.line2 ? branchAddress.line2 : "");
                self.address.postalAddress.line3(branchAddress.line3 ? branchAddress.line3 : "");
                self.address.postalAddress.line4(branchAddress.line4 ? branchAddress.line4 : "");
                self.address.postalAddress.line5(branchAddress.line5 ? branchAddress.line5 : "");
                self.address.postalAddress.line6(branchAddress.line6 ? branchAddress.line6 : "");
                self.address.postalAddress.line7(branchAddress.line7 ? branchAddress.line7 : "");
                self.address.postalAddress.line8(branchAddress.line8 ? branchAddress.line8 : "");
                self.address.postalAddress.line9(branchAddress.line9 ? branchAddress.line9 : "");
                self.address.postalAddress.line10(branchAddress.line10 ? branchAddress.line10 : "");
                self.address.postalAddress.state(branchAddress.state ? branchAddress.state : "");
                self.address.postalAddress.zipCode(branchAddress.postalCode ? branchAddress.postalCode : "");
                self.address.postalAddress.branchName(branchAddress.branchName ? branchAddress.branchName : "");
                self.address.postalAddress.country(branchAddress.country ? branchAddress.country : "");
                self.address.addressTypeDescription("");
                self.address.addressType("");

                if (self.address.postalAddress.city() === "") {
                    self.address.postalAddress.city(branchAddress.city ? branchAddress.city : "");
                }

                self.branchAddressLoaded(true);
            });
        };

        if (self.address.modeofDelivery()) {
            if (self.address.modeofDelivery() === "BRN") {
                self.loadbranches();
            }
        } else {
            self.address.modeofDelivery("BRN");
        }

        self.modeOfDeliveryArray = [{
                id: "BRN",
                label: self.resource.address.branch
            },
            {
                id: "MAI",
                label: self.resource.address.address
            },
            {
                id: "OTHADD",
                label: self.resource.address.otherAddress
            }
        ];

        /**
         * This function will be called to reset all address field.
         *
         * @memberOf demand-draft-address
         * @function reset
         * @returns {void}
         */
        function reset() {
            self.address.postalAddress.line1("");
            self.address.postalAddress.line2("");
            self.address.postalAddress.line3("");
            self.address.postalAddress.line4("");
            self.address.postalAddress.line5("");
            self.address.postalAddress.line6("");
            self.address.postalAddress.line7("");
            self.address.postalAddress.line8("");
            self.address.postalAddress.line9("");
            self.address.postalAddress.line10("");
            self.address.postalAddress.city("");
            self.address.postalAddress.state("");
            self.address.postalAddress.zipCode("");
            self.address.postalAddress.country("");
            self.address.postalAddress.branch(null);
            self.address.postalAddress.branchName("");
            self.address.addressType("");
            self.address.addressTypeDescription("");
        }

        Promise.all([addressModel.getMyAdressDetails(), addressModel.getMyAdressEnum()]).then(function(data) {
            self.myAddressLoaded(false);

            const enumData = data[1].enumRepresentations[0].data;
            let type;
            const addressData = data[0].party.addresses;

            for (let i = 0; i < addressData.length; i++) {
                type = ko.utils.arrayFirst(enumData, function(element) {
                    return element.code === addressData[i].type;
                });

                self.myAddressArray().push({
                    code: type.code,
                    description: type.description
                });

                addressMap[type.code] = {};

                addressMap[type.code] = {
                    addressType: enumData[i].code,
                    addressTypeDescription: type.description,
                    postalAddress: {
                        line1: addressData[i].postalAddress.line1 ? addressData[i].postalAddress.line1 : "",
                        line2: addressData[i].postalAddress.line2 ? addressData[i].postalAddress.line2 : "",
                        line3: addressData[i].postalAddress.line3 ? addressData[i].postalAddress.line3 : "",
                        line4: addressData[i].postalAddress.line4 ? addressData[i].postalAddress.line4 : "",
                        line5: addressData[i].postalAddress.line5 ? addressData[i].postalAddress.line5 : "",
                        line6: addressData[i].postalAddress.line6 ? addressData[i].postalAddress.line6 : "",
                        line7: addressData[i].postalAddress.line7 ? addressData[i].postalAddress.line7 : "",
                        line8: addressData[i].postalAddress.line8 ? addressData[i].postalAddress.line8 : "",
                        line9: addressData[i].postalAddress.line9 ? addressData[i].postalAddress.line9 : "",
                        line10: addressData[i].postalAddress.line10 ? addressData[i].postalAddress.line10 : "",
                        line11: addressData[i].postalAddress.line11 ? addressData[i].postalAddress.line11 : "",
                        line12: addressData[i].postalAddress.line12 ? addressData[i].postalAddress.line12 : "",
                        city: addressData[i].postalAddress.city ? addressData[i].postalAddress.city : "",
                        state: addressData[i].postalAddress.state ? addressData[i].postalAddress.state : "",
                        country: addressData[i].postalAddress.country ? addressData[i].postalAddress.country : "",
                        zipCode: addressData[i].postalAddress.postalCode ? addressData[i].postalAddress.postalCode : "",
                        branch: "",
                        branchName: ""
                    }
                };
            }

            self.myAddressLoaded(true);
        });

        self.modeOfDeliveryChangeHandler = function() {
            if (self.address.modeofDelivery() === "OTHADD") { reset(); }
        };

        self.setMyAddress = function() {
            self.address.postalAddress.line1(addressMap[self.address.addressType()].postalAddress.line1);
            self.address.postalAddress.line2(addressMap[self.address.addressType()].postalAddress.line2);
            self.address.postalAddress.line3(addressMap[self.address.addressType()].postalAddress.line3);
            self.address.postalAddress.line4(addressMap[self.address.addressType()].postalAddress.line4);
            self.address.postalAddress.line5(addressMap[self.address.addressType()].postalAddress.line5);
            self.address.postalAddress.line6(addressMap[self.address.addressType()].postalAddress.line6);
            self.address.postalAddress.line7(addressMap[self.address.addressType()].postalAddress.line7);
            self.address.postalAddress.line8(addressMap[self.address.addressType()].postalAddress.line8);
            self.address.postalAddress.line9(addressMap[self.address.addressType()].postalAddress.line9);
            self.address.postalAddress.line10(addressMap[self.address.addressType()].postalAddress.line10);
            self.address.postalAddress.city(addressMap[self.address.addressType()].postalAddress.city);
            self.address.postalAddress.state(addressMap[self.address.addressType()].postalAddress.state);
            self.address.postalAddress.zipCode(addressMap[self.address.addressType()].postalAddress.zipCode);
            self.address.postalAddress.branch(addressMap[self.address.addressType()].postalAddress.branch);
            self.address.postalAddress.country(addressMap[self.address.addressType()].postalAddress.country);
            self.address.postalAddress.branchName(addressMap[self.address.addressType()].postalAddress.branchName);
            self.address.addressTypeDescription(addressMap[self.address.addressType()].addressTypeDescription);
        };
    };
});