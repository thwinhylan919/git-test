define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/external-payment",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojbutton"
], function(ko, $, ExternalPaymentModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;
        let additionalDetailsQueryString = "";
        const getNewKoModel = function() {
            const KoModel = ko.mapping.fromJS(ExternalPaymentModel.getNewModel());

            return KoModel;
        };

        ko.utils.extend(self, rootParams.rootModel);
        self.account = ko.observable(null);
        self.epi = ResourceBundle.epi;
        self.common = ResourceBundle.common;
        self.generic = ResourceBundle.generic;
        self.amount = ko.observable();
        self.currency = ko.observable();
        self.paymentId = ko.observable();
        self.merchantCode = ko.observable();
        self.merchantDescription = ko.observable();
        self.baseURL = "";
        self.stageOne = ko.observable(false);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        rootParams.dashboard.headerName(self.epi.epiHeader);
        self.isMerchantDataLoaded = ko.observable(false);
        self.isCurrencyLoaded = ko.observable(false);
        self.isError = ko.observable(false);
        self.validationTracker = ko.observable();
        self.epiId = ko.observable();
        self.additionalDetails = ko.observable();
        self.EPIModel = getNewKoModel().EPIModel;
        self.EPIVerifyModel = getNewKoModel().EPIVerifyModel;
        self.isLoaded = ko.observable(false);

        history.pushState({
            external: true
        }, document.title, "");

        $(document).on("2facancelled", function() {
            window.location = self.EPIVerifyModel.dynamicFailureUrl();
        });

        window.onpopstate = function() {
            window.location = self.EPIVerifyModel.dynamicFailureUrl();
        };

        rootParams.baseModel.registerElement([
            "confirm-screen",
            "account-input"
        ]);

        ExternalPaymentModel.init();
        self.userAccountFlag = ko.observable();
        self.userAccNum = ko.observable();
        self.additionalDetailsArray = ko.observable();
        self.epiRefId = ko.observable();

        self.fetchQueryParams = function(rootData) {
            if (rootData.queryMap) {
                self.epiRefId(rootData.queryMap.epiRefId);
            }

            ExternalPaymentModel.readMerchantTransfer(self.epiRefId()).done(function(data) {
                self.amount(data.txnAmt.amount + data.txnScAmt.amount);
                self.EPIModel.transferDetails.merchantCode(data.merchantCode);
                self.EPIModel.transferDetails.transactionAmount.amount(data.txnAmt.amount);
                self.EPIModel.transferDetails.serviceCharges.amount(data.txnScAmt.amount);
                self.EPIModel.transferDetails.userReferenceNo(data.merchRefNbr);
                self.EPIModel.transferDetails.amount.amount(data.txnAmt.amount + data.txnScAmt.amount);
                self.EPIModel.epiRefid(self.epiRefId());
                self.additionalDetailsArray(data.additionalInfo);

                for (let i = 0; i < self.additionalDetailsArray().length; i++) {
                    additionalDetailsQueryString += "&name=" + self.additionalDetailsArray()[i].name + "&value=" + self.additionalDetailsArray()[i].value;
                }

                if (data.userAccNum) {
                    self.userAccNum(data.userAccNum);
                    self.account(data.userAccNum.value);
                }

                self.merchantCode(data.merchantCode);
                self.merchantDescription(data.description);
                self.EPIVerifyModel.successStaticUrlFlag(data.flgSucStat);
                self.EPIVerifyModel.failureStaticUrlFlag(data.flgFailStat);
                self.EPIVerifyModel.dynamicSuccessUrl(data.dynamicSuccessUrl);
                self.EPIVerifyModel.dynamicFailureUrl(data.dynamicFailureUrl);
                self.EPIVerifyModel.merchantCode(self.merchantCode());
                self.isMerchantDataLoaded(true);
                self.stageOne(true);
            }).fail(function() {
                self.isError(true);
            });
        };

        self.initiatePayment = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker()) || self.account() === null) {
                return;
            }

            self.EPIModel.transferDetails.amount.currency(self.currency());
            self.EPIModel.transferDetails.serviceCharges.currency(self.currency());
            self.EPIModel.transferDetails.debitAccountId.value(self.account());
            self.EPIModel.transferDetails.transactionAmount.currency(self.currency());

            const EPIPayload = ko.toJSON(self.EPIModel);

            ExternalPaymentModel.initiatePayment(EPIPayload).done(function(data) {
                self.paymentId(data.paymentId);
                self.baseURL = "payments/transfers/external/" + self.paymentId();
                self.stageOne(false);
                self.stageTwo(true);
                rootParams.dashboard.headerName(self.epi.review);
            });
        };

        self.cancelPayment = function() {
            self.stageOne(true);
            self.stageTwo(false);
        };

        self.userLogout = function(redirectedURL) {

            const event = new CustomEvent("logout", {
                detail: {
                    callback: function() {
                        window.location.href = redirectedURL + additionalDetailsQueryString;
                    }
                }
            });

            window.dispatchEvent(event);
        };

        self.fetchAttribute = function(url) {
            let uri_dec = url.replace(/&#x2f;/g, "/").replace(/&#x3f;/g, "?").replace(/&#x3d;/g, "=").replace(/&#x3a;/g, ":");

            uri_dec.substr(0, uri_dec.indexOf("?"));
            uri_dec = uri_dec.substr(uri_dec.indexOf("?") + 1);
            uri_dec.substr(0, uri_dec.indexOf("="));
            uri_dec = uri_dec.substr(uri_dec.indexOf("=") + 1);

            return uri_dec;
        };

        self.verifyPayment = function() {
            const EPIPayload = ko.toJSON(self.EPIVerifyModel);

            ExternalPaymentModel.verifyPayment(EPIPayload, self.paymentId()).done(function(data) {
                if (data.refLinks[0].href ? data.refLinks[0].href : false) {
                    const redirectedURL = self.fetchAttribute(data.refLinks[0].href);

                    self.userLogout(redirectedURL);
                }
            }).fail(function(data) {
                if (data.responseJSON.refLinks[0].href ? data.responseJSON.refLinks[0].href : false) {
                    const redirectedURL = self.fetchAttribute(data.responseJSON.refLinks[0].href);

                    self.userLogout(redirectedURL);
                }
            });
        };

        let password = true;

        self.togglePassword = function() {
            password = !password;

            const eye = $("#eyecon");

            eye.removeClass("icon-eye icon-eye-slash");

            if (password) {
                eye.addClass("icon-eye-slash");

                $("#otp").prop({
                    type: "password"
                });
            } else {
                eye.addClass("icon-eye");

                $("#otp").prop({
                    type: "text"
                });
            }
        };

        self.cancel = function() {
            history.back();
        };

        ExternalPaymentModel.getDomesticCurrency().done(function(data) {
            self.currency(data.bankConfigurationDTO.localCurrency);
            self.isCurrencyLoaded(true);
        });
    };
});