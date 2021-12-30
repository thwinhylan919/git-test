define([
    "ojL10n!resources/nls/preview-invoice-details",
    "./model",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojavatar",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (resourceBundle, Model, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.invoicegetVar = ko.observable();
        self.invoicegetinvoiceRefNo = ko.observable();
        self.selectedRole = ko.observable();
        self.partyDetails = ko.observable();
        self.showNote = ko.observable(false);
        params.baseModel.registerElement("modal-window");
        self.fromCreateFlow = ko.observable(false);
        self.initials = ko.observable();
        self.balanceDue = ko.observable();
        self.showPage = ko.observable(false);
        self.currencyValue = ko.observable();
        self.commodityDetails = ko.observable(false);
        self.commodityList = ko.observableArray();
        self.discountPercentage = ko.observable();
        self.discountAmount = ko.observable();
        self.supplierAddress = ko.observable();
        self.buyerAddress = ko.observable();
        self.selectedRole(params.rootModel.role);
        self.invoicegetinvoiceRefNo(params.rootModel.invoiceNo);
        self.partyDetails(params.rootModel.partyDetails);

        function setAddress(address1, address2, address3, address4, country, pin) {
            let address, addressArray;

            if (address1) {
                address = address1;

                if (address2) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(address2);
                }

                if (address3) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(address3);
                }

                if (address4) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(address4);
                }

                if (country) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(country);
                }

                if (pin) {
                    addressArray = address.split(/(?=[\s\S])/);

                    if (addressArray[addressArray.length - 1] !== ",") {
                        address = address.concat(",");
                    }

                    address = address.concat(pin);
                }

            } else {
                address = "";
            }

            return address;
        }

        function setAddressFromPartyDetails(partyDetails) {

            let addressFromPartyDerails = "";

            if (partyDetails && partyDetails.party && partyDetails.party.addresses && partyDetails.party.addresses.length > 0) {
                for (let i = 0; i < partyDetails.party.addresses.length; i++) {
                    if (partyDetails.party.addresses[i] && partyDetails.party.addresses[i].postalAddress) {
                        addressFromPartyDerails = setAddress(partyDetails.party.addresses[i].postalAddress.line1, partyDetails.party.addresses[i].postalAddress.line2, partyDetails.party.addresses[i].postalAddress.line3, partyDetails.party.addresses[i].postalAddress.city, partyDetails.party.addresses[i].postalAddress.country, partyDetails.party.addresses[i].postalAddress.postalCode);
                        break;
                    }
                }
            }

            return addressFromPartyDerails;
        }

        function setDetails(invoiceDetails, partyDetails) {
            if (invoiceDetails.invoiceDate) {
                let initials;
                const names = invoiceDetails.buyerName ? invoiceDetails.buyerName.split(/\s+/) : invoiceDetails.associatedParty.name.split(/\s+/);

                if (names.length > 0) {
                    initials = names[0].substring(0, 1).toUpperCase();

                    if (names.length > 1) {
                        initials += names[1].substring(0, 1).toUpperCase();
                    }
                }

                self.initials(initials);

                if (invoiceDetails.outstandingAmount && invoiceDetails.outstandingAmount > 0) {
                    self.balanceDue(invoiceDetails.outstandingAmount);
                } else if (self.fromCreateFlow()) {
                    self.balanceDue(invoiceDetails.totalAmount.amount);
                    self.currencyValue(invoiceDetails.amount.currency);
                } else {
                    self.balanceDue(0);
                }

                let supplierAddress, buyerAddress;

                if (invoiceDetails.supplierAddress) {
                    supplierAddress = setAddress(invoiceDetails.supplierAddress.line1, invoiceDetails.supplierAddress.line2, invoiceDetails.supplierAddress.city, invoiceDetails.supplierAddress.state, invoiceDetails.supplierAddress.country, invoiceDetails.supplierAddress.zipCode);
                    buyerAddress = setAddressFromPartyDetails(partyDetails);
                } else if (invoiceDetails.associatedParty && invoiceDetails.associatedParty.address) {
                    buyerAddress = setAddress(invoiceDetails.associatedParty.address.line1, invoiceDetails.associatedParty.address.line2, invoiceDetails.associatedParty.address.city, invoiceDetails.associatedParty.address.state, invoiceDetails.associatedParty.address.country, invoiceDetails.associatedParty.address.zipCode);
                    supplierAddress = setAddressFromPartyDetails(partyDetails);
                } else {
                    supplierAddress = "";
                    buyerAddress = "";
                }

                self.supplierAddress(supplierAddress);

                self.buyerAddress(buyerAddress);

                self.currencyValue(invoiceDetails.amount.currency);

                if (invoiceDetails.commodities && invoiceDetails.commodities.length > 0) {
                    let i;

                    for (i = 0; i < invoiceDetails.commodities.length; i++) {
                        self.commodityList().push({
                            commodityCode: i,
                            name: invoiceDetails.commodities[i].name,
                            description: invoiceDetails.commodities[i].description,
                            quantity: invoiceDetails.commodities[i].quantity,
                            costPerUnit: invoiceDetails.commodities[i].costPerUnit,
                            totalCost: invoiceDetails.commodities[i].totalCost
                        });
                    }

                    self.commodityDetails(true);
                }

                if (invoiceDetails.discountAllowed === "Y" || invoiceDetails.discountPercentage) {
                    self.discountPercentage = invoiceDetails.discountPercentage;
                    self.discountAmount = invoiceDetails.discountAmount;
                } else {
                    self.discountPercentage = 0;
                    self.discountAmount = 0;
                }

                self.showPage(true);
            }
        }

        if (params.rootModel.invoiceDetails) {
            self.invoicegetVar(params.rootModel.invoiceDetails);
            self.invoicegetVar().programName = params.rootModel.programName;

            if (!self.invoicegetVar().buyerName) {
                self.invoicegetVar().buyerName = self.invoicegetVar().associatedParty.name;
            }

            if (!self.invoicegetVar().supplierName) {
                self.invoicegetVar().supplierName = params.rootModel.supplierName;
            }

            self.fromCreateFlow(true);
            setDetails(self.invoicegetVar(), self.partyDetails());
        } else {
            Model.invoiceget(self.invoicegetinvoiceRefNo(), self.selectedRole()).then(function (response) {
                self.invoicegetVar(response.invoice);
                setDetails(self.invoicegetVar(), self.partyDetails());
            });
        }

        self.closeNote = function () {
            self.showNote(false);
        };

        self.dataSource39 = new oj.ArrayTableDataSource(self.commodityList, {
            idAttribute: "commodityCode"
        });

        function fetchPDF(invoiceRefNo, role) {
            return Model.downloadInvoice(invoiceRefNo, role);
        }

        self.downloadInvoice = function (event, data) {
            self.showNote(true);
            fetchPDF(self.invoicegetVar().invoiceId, self.selectedRole());
        };

    };
});