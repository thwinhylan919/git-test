define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-money-transfer",
    "ojs/ojinputnumber",
    "ojs/ojselectcombobox"
], function(ko,$,internationalPaymentModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.payments = ResourceBundle.payments;
        self.paymentDetail = ko.observable("");
        self.paymentDetails = ko.observableArray();
        self.correspondenceCharge = ko.observable("");
        self.correspondenceCharges = ko.observableArray();
        self.isChargesLoaded = ko.observable();
        self.correspondenceChargesMap = {};
        self.purpose(null);
        self.internationalNetworkTypes = ko.observableArray();
        self.isNetworkTypesLoaded = ko.observable();
        self.countries = ko.observableArray();
        self.isCountriesLoaded = ko.observable();
        self.clearingCodeType =ko.observable();

        self.addPaymentDetails = function() {
            if (self.paymentDetailsArray().length < 3) {
                self.paymentDetailsArray.push("");
            }
        };

        self.deletePaymentDetails = function(index) {
            self.paymentDetailsArray.splice(index, 1);
        };

    /**
      * This function is used reset fields related to intermediary bank details.
      *
      * @memberOf payment-international
      * @function resetNetworkTransferViaDetails
      * @returns {void}
      */
        function resetNetworkTransferViaDetails() {
            self.additionalNetworkTransferViaBankDetails(null);
            self.networkTransferViaBankName(null);
            self.networkTransferViaBankAddress(null);
            self.networkTransferViaCountry(null);
            self.networkTransferViaCity(null);
            self.networkTransferViaCode(null);

        }

        self.transferViaBankChanged = function(event) {
            if (event.detail && event.detail.value) {
                self.networkTransferVia("SWI");
                resetNetworkTransferViaDetails();
            }
        };

        self.networkTransferViaChanged = function(event) {
            if (event.detail && event.detail.value) {
                resetNetworkTransferViaDetails();
            }
        };

        self.region = ko.observable();

        self.transferViaArray = [{
            value: "YES",
            text: self.payments.generic.common.yes
        }, {
            value: "NO",
            text: self.payments.generic.common.no
        }];

        Params.baseModel.registerElement("bank-look-up");

        internationalPaymentModel.getBankConfiguration().then(function(data) {
            self.region(data.bankConfigurationDTO.region);
        });

        self.openNetworkTransferViaLookup = function() {
            self.clearingCodeType(self.networkTransferVia());
            $("#networkTransferViaBankLookUp").trigger("openModal");
        };

        self.resetTransferViaCode = function() {
            self.networkTransferViaCode(null);
            self.additionalNetworkTransferViaBankDetails(null);
        };

        self.verifyTransferViaCode = function() {
            if (self.networkTransferVia() === "SWI") {
                internationalPaymentModel.getBankDetailsBIC(self.networkTransferViaCode()).then(function(data) {
                    self.additionalNetworkTransferViaBankDetails(data);
                });
            } else if (self.networkTransferVia() === "NAC") {
                internationalPaymentModel.getBankDetailsNCC(self.networkTransferViaCode(), self.region()).then(function(data) {
                    self.additionalNetworkTransferViaBankDetails(data);
                });
            }
        };

        Params.baseModel.registerComponent("review-payment-international", "payments");
        internationalPaymentModel.init();

        if (self.stageOne()) {
            Promise.all([internationalPaymentModel.getCorrespondenceCharges(),internationalPaymentModel.getNetworkTypes(), internationalPaymentModel.getCountries(),internationalPaymentModel.getRemarks()]).then(function(response) {
                self.isChargesLoaded(false);

                for (let i = 0; i < response[0].enumRepresentations[0].data.length; i++) {
                    self.correspondenceCharges.push({
                        text: response[0].enumRepresentations[0].data[i].description,
                        value: response[0].enumRepresentations[0].data[i].code
                    });
                }

                self.correspondanceChrgFromFavourites();
                ko.tasks.runEarly();
                self.isChargesLoaded(true);

                for (let j = 0; j < response[1].enumRepresentations[0].data.length; j++) {
                    self.internationalNetworkTypes.push({
                        text: response[1].enumRepresentations[0].data[j].code,
                        value: response[1].enumRepresentations[0].data[j].code
                    });
                }

                self.isNetworkTypesLoaded(true);

                for (let z = 0; z < response[2].enumRepresentations[0].data.length; z++) {
                    self.countries.push({
                        text: response[2].enumRepresentations[0].data[z].description,
                        value: response[2].enumRepresentations[0].data[z].code
                    });
                }

                self.isCountriesLoaded(true);

               if(self.remarksArray.length===0)
             { self.remarksArray.removeAll();
                           ko.tasks.runEarly();

                             for (let z = 0; z < response[3].enumRepresentations[0].data.length; z++) {
                         self.remarksArray.push({
                          text: response[3].enumRepresentations[0].data[z].description,
                           value: response[3].enumRepresentations[0].data[z].code
                         });
                       }

                       self.remarkLoaded(true);}
            });
        } else if (self.stageTwo()) {
            const transferData = {
                header: Params.dashboard.headerName(),
                reviewMode: true
            };

            if (self.transferOn() === "later") { transferData.instructionId = self.paymentId(); } else if (self.transferOn() === "now") { transferData.paymentId = self.paymentId(); }

            Params.dashboard.loadComponent("review-payment-international", {
                transferData: transferData,
                retainedData: self
            }, self);
        }

        self.correspondanceChrgFromFavourites = function() {
            if ((self.params.transferObject && self.params.transferObject().isFavoriteTransaction) || (self.defaultData && self.defaultData.transferObject)) {
                const data = self.params.transferObject ? self.params.transferObject() : self.defaultData.transferObject();

                for (let j = 0; j < self.correspondenceCharges().length; j++) {
                    if (self.correspondenceCharges()[j].value === data.charges) {
                        self.charges(self.correspondenceCharges()[j].value + "_" + self.correspondenceCharges()[j].text);
                        break;
                    }
                }
            }
        };
    };
});