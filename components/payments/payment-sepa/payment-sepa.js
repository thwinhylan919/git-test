define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-money-transfer",
    "ojL10n!resources/nls/review-payment-domestic",
    "ojs/ojinputnumber",
    "ojs/ojselectcombobox",
    "ojs/ojradioset"
], function(ko, $, domesticPaymentModel, sepaResourceBundle, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.paymentType = ko.observable();
        self.resource = ResourceBundle;
        self.payments = sepaResourceBundle.payments;
        self.purposeText = ko.observable();
        self.isDataLoaded = ko.observable(false);
        self.paymentTypeLoaded = ko.observable(false);

        self.paymentTypeMap = {
            CAT: self.payments.payee.domestic.sepa.cardtransfer,
            CRT: self.payments.payee.domestic.sepa.credittransfer
        };

        self.transactionPurposeList = ko.observableArray();
        self.transactionPurposeMap = {};
        self.isTransactionPurposeListLoaded = ko.observable(true);
        domesticPaymentModel.init();
        Params.baseModel.registerComponent("review-payment-domestic", "payments");

        self.purposeChanged = function(event) {
            if (event.detail.value) {
                self.otherPurpose(event.detail.value === "OTH_Other");

                if (event.detail.value !== "OTH_Other") { self.otherPurposeValue(""); }
            }
        };

        if (self.stageOne()) {
            $.when(domesticPaymentModel.getTransferPurpose(), domesticPaymentModel.getPayeeData(self.customPayeeId(), self.groupId(), "domestic")).then(function(transferPurposeResponse, payeeDataResponse) {
                self.isTransactionPurposeListLoaded(false);
                self.paymentTypeLoaded(false);
                self.transactionPurposeList.removeAll();

                if (transferPurposeResponse.linkageList.length) {
                    for (let i = 0; i < transferPurposeResponse.linkageList[0].purposeList.length; i++) {
                        self.transactionPurposeList.push({
                            text: transferPurposeResponse.linkageList[0].purposeList[i].description,
                            value: transferPurposeResponse.linkageList[0].purposeList[i].code
                        });

                        self.transactionPurposeMap[transferPurposeResponse.linkageList[0].purposeList[i].code] = transferPurposeResponse.linkageList[0].purposeList[i].description;
                    }
                }

                self.purposeFromFavourites();
                self.isTransactionPurposeListLoaded(true);
                self.paymentType(payeeDataResponse.domesticPayee.sepaDomesticPayee.paymentType);
                self.paymentTypeLoaded(true);
            });
        } else if (self.stageTwo()) {
            const transferData = {
                header: Params.dashboard.headerName(),
                reviewMode: true
            };

            if (self.transferOn() === "later") { transferData.instructionId = self.paymentId(); } else if (self.transferOn() === "now") { transferData.paymentId = self.paymentId(); }

            Params.dashboard.loadComponent("review-payment-domestic", {
                transferData: transferData,
                retainedData: self
            }, self);
        }

        self.purposeFromFavourites = function() {
            if (self.params.relationshipNumber) {
                if (self.params.purpose === "OTH") {
                    for (let i = 0; i < self.transactionPurposeList().length; i++) {
                        if (self.transactionPurposeList()[i].value === self.params.purpose) {
                            self.purpose(self.transactionPurposeList()[i].value + "_" + self.transactionPurposeList()[i].text);
                            break;
                        }
                    }

                    self.otherPurposeValue(self.params.otherPurposeText);
                    self.otherPurpose(true);
                } else {
                    for (let j = 0; j < self.transactionPurposeList().length; j++) {
                        if (self.transactionPurposeList()[j].value === self.params.purpose) {
                            self.purpose(self.transactionPurposeList()[j].value + "_" + self.transactionPurposeList()[j].text);
                            break;
                        }
                    }
                }
            }
        };
    };
});