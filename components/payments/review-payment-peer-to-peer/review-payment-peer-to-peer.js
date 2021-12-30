define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/review-payment-peer-to-peer",
    "ojs/ojknockout"
], function(ko, P2PModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.dataLoaded = ko.observable(false);
        self.p2ppaymentData = ko.observable();
        self.facebookDataLoaded = ko.observable(false);
        self.preview = ko.observable();

        if (self.params.header) {
            rootParams.dashboard.headerName(self.params.header);
        }

        self.confirmScreenDetails = rootParams.rootModel.confirmScreenDetails;

        function loadImage() {
            P2PModel.retrieveImage(self.p2ppaymentData().contentId.value).then(function(data) {
                if (data && data.contentDTOList[0]) {
                    self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
                }
            });
        }

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        P2PModel.getPayeeMaintenance().then(function(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (rootParams.dashboard.appData.segment === "CORP") {
                self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            } else {
                self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            }
        });

        P2PModel.readP2P(self.params.paymentId).done(function(data) {
            if (data.transferMode === "TWITTER") {
                data.transferValue = self.params.retainedData.selectedTwitterUser()[0].screenName;
            }

            self.p2ppaymentData(data);

            if (self.p2ppaymentData().contentId) {
                loadImage();
            }

            self.dataLoaded(true);

            const confirmScreenDetailsArray = [
                [{
                        label: self.resource.payvia,
                        value: data.transferMode
                    },
                    {
                        label: self.resource.transferto,
                        value: data.transferMode === "TWITTER" ? self.params.retainedData.selectedTwitterUser()[0].screenName : data.transferValue
                    }
                ],
                [{
                        label: self.resource.amount,
                        value: data.transferDetails.amount.amount,
                        currency: data.transferDetails.amount.currency,
                        isCurrency: true
                    },
                    {
                        label: self.resource.transferfrom,
                        value: data.transferDetails.debitAccountId.displayValue
                    }
                ]
            ];

            if (self.shareMessage) {
                self.shareMessage(rootParams.baseModel.format(self.shareMessage(), {
                    amount: rootParams.baseModel.formatCurrency(data.transferDetails.amount.amount, data.transferDetails.amount.currency),
                    transferTo: data.transferValue,
                    valueDate: data.transferDetails.valueDate
                }));
            }

            if (typeof self.confirmScreenDetails === "function") {
                self.confirmScreenDetails(confirmScreenDetailsArray);
            }
        });

        self.hideDetails = function () {
            history.back();
          };

        self.loadFriendList = function(response) {
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].id === self.p2ppaymentData().transferValue.split("#")[0]) {
                    self.p2ppaymentData().transferValue = response.data[i].name;
                    self.confirmScreenDetails()[0][1].value = response.data[i].name;
                    break;
                }
            }

            self.facebookDataLoaded(true);
        };
    };
});