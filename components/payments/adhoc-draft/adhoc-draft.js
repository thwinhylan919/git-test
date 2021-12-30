define([

    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/adhoc-payments",
    "ojs/ojinputnumber",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojdatetimepicker",
    "ojs/ojdialog",
    "ojs/ojavatar",
    "ojs/ojselectcombobox"
], function(ko, $, AdhocPaymentModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(AdhocPaymentModel.getNewModel());

                return KoModel;
            };

        self.taxonomyDefinition = rootParams.dashboard.getTaxonomyDefinition("com.ofss.digx.app.payment.dto.payee.DemandDraftPayeeRequestDTO");
        self.payments = ResourceBundle.payments;
        self.currentAccountType = ko.observable("DOMESTIC");
        self.currentTask = ko.observable("PC_F_DOMDRAFT");
        self.payeeName = ko.observable();
        self.draftFavouring = ko.observable();
        self.payAtCity = ko.observable();
        self.viewlimitsFlag = ko.observable(false);
        self.isCitiesLoaded = ko.observable(false);
        self.cities = ko.observableArray();
        self.currentDateLoaded = ko.observable(false);
        self.currentDate = ko.observable();
        self.valueDate = ko.observable();
        self.additionalDetailsforAccount = ko.observable();
        self.additionalDetails = ko.observable();
        self.formattedTomorrow = ko.observable();
        self.isCountriesLoaded = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);
        self.loadAccessPointList = ko.observable(false);
        self.isLaterDateRequired = ko.observable();
        self.customCurrencyURL = ko.observable("payments/currencies?type=DOMESTICDRAFT");
        self.addressDetails = getNewKoModel().addressDetails;
        self.adhocPayLoad = getNewKoModel().adhocPaymentModel;
        self.amount = ko.observable();
        self.transferCurrency = ko.observable();
        self.debitAccountId = ko.observable();
        self.remarks = ko.observable();
        self.draftTypeChanged = ko.observable(true);
        self.countries = ko.observableArray();
        self.validationTracker = ko.observable();
        self.payAtCountry = ko.observable();
        self.customLimitType = ko.observable();
        self.isCommentRequired = ko.observable(true);
        self.customURL = ko.observable("demandDeposit?accountType=CURRENT,SAVING");

        self.transferOnArray = [{
                id: "NOW",
                label: self.payments.moneytransfer.now
            }
        ];

        self.issueDate = ko.observable(self.transferOnArray[0].id);
        ko.utils.extend(self, rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState) : rootParams.rootModel);
        rootParams.baseModel.registerComponent("demand-draft-address", "payments");
        rootParams.baseModel.registerComponent("available-limits", "financial-limits");

        rootParams.baseModel.registerElement([
            "comment-box",
            "amount-input",
            "confirm-screen",
            "modal-window",
            "account-input"
        ]);

        rootParams.baseModel.registerElement("address");
        rootParams.baseModel.registerComponent("review-adhoc-draft", "payments");

        if (self.currentAccountType() === "INTERNATIONAL") {
            self.currentTask("PC_F_ID");
            self.customCurrencyURL("payments/currencies?type=PC_F_ID");
        }

        if (self.currentDate() === undefined) {
            self.currentDateLoaded(false);
            rootParams.dashboard.headerName(self.payments.adhocDemandDraft);

            AdhocPaymentModel.getHostDate().done(function(data) {
                const today = new Date(data.currentDate.valueDate);

                self.currentDate(today);

                const tomorrow = new Date(data.currentDate.valueDate);

                tomorrow.setDate(today.getDate() + 1);
                self.formattedTomorrow(tomorrow);
                self.currentDateLoaded(true);
            });
        }

        AdhocPaymentModel.fetchBankConfiguration().then(function(data) {
            self.isCommentRequired(data.bankConfigurationDTO.region === "INDIA");
        });

        AdhocPaymentModel.getCities().done(function(data) {
            self.isCitiesLoaded(false);
            self.cities.removeAll();

            for (let i = 0; i < data.cities.length; i++) {
                self.cities.push({
                    text: data.cities[i],
                    value: data.cities[i]
                });
            }

            self.isCitiesLoaded(true);
        });

        self.getCountries = function() {
            AdhocPaymentModel.getCountries().done(function(data) {
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
        };

        self.getCountries();

        self.accountTypeChanged = function() {
            self.draftTypeChanged(false);

            if (self.currentAccountType() === "DOMESTIC") {
                self.currentTask("PC_F_DOMDRAFT");
                self.customCurrencyURL("payments/currencies?type=DOMESTICDRAFT");
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                self.currentTask("PC_F_ID");
                self.customCurrencyURL("payments/currencies?type=PC_F_ID");
            }

            self.draftTypeChanged(true);
        };

        self.dateChanged = function(event) {
            if (event.detail.value) {
                if (event.detail.value === "NOW") {
                    self.isLaterDateRequired(false);
                    self.valueDate(self.today);
                } else if (event.detail.value === "LATER") {
                    self.isLaterDateRequired(true);
                }
            }
        };

        self.currencyParser = function(data) {
            const output = {};

            output.currencies = [];

            if (data) {
                if (data.currencyList !== null) {
                    if (self.currentAccountType === "DOMESTIC") {
                        output.currencies.push({
                            code: data.currencyList[0].code,
                            description: data.currencyList[0].code
                        });
                    } else {
                        for (let i = 0; i < data.currencyList.length; i++) {
                            output.currencies.push({
                                code: data.currencyList[i].code,
                                description: data.currencyList[i].code
                            });
                        }
                    }

                    if (!self.transferCurrency()) { self.transferCurrency(output.currencies[0].code); }
                }
            }

            return output;
        };

        self.initiateDDIssue = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("drafttracker"))) {
                return;
            }

            if (self.currentAccountType() === "DOMESTIC") {
                self.payAtCountry("");
            }

            self.adhocPayLoad.genericPayout.amount.currency = self.transferCurrency();
            self.adhocPayLoad.genericPayout.amount.amount = self.amount();
            self.adhocPayLoad.genericPayout.inFavourOf = self.draftFavouring();
            self.adhocPayLoad.genericPayout.debitAccountId.value = self.debitAccountId();
            self.adhocPayLoad.genericPayout.remarks = self.remarks();
            self.adhocPayLoad.genericPayee.name = self.draftFavouring();
            self.adhocPayLoad.genericPayee.nickName = self.draftFavouring();
            self.adhocPayLoad.genericPayee.payAtCity = self.payAtCity();
            self.adhocPayLoad.genericPayee.payAtCountry = self.payAtCountry();
            self.adhocPayLoad.genericPayee.demandDraftDeliveryDTO.deliveryMode(self.addressDetails.modeofDelivery());
            self.adhocPayLoad.genericPayee.demandDraftDeliveryDTO.branch(self.addressDetails.postalAddress.branch());

            if (self.adhocPayLoad.genericPayee.demandDraftDeliveryDTO.deliveryMode() === "MAI") {
                self.adhocPayLoad.genericPayee.demandDraftDeliveryDTO.mailModeType("REM");
                self.adhocPayLoad.genericPayee.demandDraftDeliveryDTO.addressType(self.addressDetails.addressType());
            } else if (self.adhocPayLoad.genericPayee.demandDraftDeliveryDTO.deliveryMode() === "OTHADD") {
                self.adhocPayLoad.genericPayee.otherAddress.line1(self.addressDetails.postalAddress.line1());
                self.adhocPayLoad.genericPayee.otherAddress.line2(self.addressDetails.postalAddress.line2());
                self.adhocPayLoad.genericPayee.otherAddress.city(self.addressDetails.postalAddress.city());
                self.adhocPayLoad.genericPayee.otherAddress.state(self.addressDetails.postalAddress.state());
                self.adhocPayLoad.genericPayee.otherAddress.zipCode(self.addressDetails.postalAddress.zipCode());
                self.adhocPayLoad.genericPayee.otherAddress.country(self.addressDetails.postalAddress.country());
            }

            if (self.today === self.valueDate() || self.valueDate() === null) {
                if (self.currentAccountType() === "DOMESTIC") {
                    self.adhocPayLoad.paymentType("DOMESTICDRAFT");
                    self.adhocPayLoad.genericPayee.demandDraftPayeeType("DOM");
                } else if (self.currentAccountType() === "INTERNATIONAL") {
                    self.adhocPayLoad.paymentType("INTERNATIONALDRAFT");
                    self.adhocPayLoad.genericPayee.demandDraftPayeeType("INT");
                }
            } else if (self.currentAccountType() === "DOMESTIC") {
                self.adhocPayLoad.paymentType("DOMESTICDRAFT_PAYLATER");
                self.adhocPayLoad.genericPayee.demandDraftPayeeType("DOM");
                self.adhocPayLoad.genericPayout.startDate(self.valueDate());
                self.adhocPayLoad.genericPayout.endDate(self.valueDate());
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                self.adhocPayLoad.paymentType("INTERNATIONALDRAFT_PAYLATER");
                self.adhocPayLoad.genericPayee.demandDraftPayeeType("INT");
                self.adhocPayLoad.genericPayout.startDate(self.valueDate());
                self.adhocPayLoad.genericPayout.endDate(self.valueDate());
            }

            const adhocPayLoad = ko.toJSON(self.adhocPayLoad);

            AdhocPaymentModel.makeAdhocPayment(adhocPayLoad).done(function(data) {
                self.paymentId = ko.observable(data.paymentId);

                const adhocDraftParams = {
                    currentAccountType: self.currentAccountType,
                    payeeName: self.payeeName,
                    draftFavouring: self.draftFavouring,
                    payAtCity: self.payAtCity,
                    valueDate: self.valueDate,
                    addressDetails: self.addressDetails,
                    debitAccountId: self.debitAccountId,
                    remarks: self.remarks,
                    payAtCountry: self.payAtCountry,
                    paymentId: self.paymentId,
                    amount: self.amount,
                    genericPayeePayload: self.adhocPayLoad && self.adhocPayLoad.genericPayee,
                    transferCurrency: self.transferCurrency
                };

                rootParams.dashboard.loadComponent("review-adhoc-draft", ko.mapping.toJS(adhocDraftParams));
          });
      };

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.selectedChannelType = ko.observable();
        self.selectedChannelTypeName = ko.observable();
        self.channelList = ko.observableArray();

        AdhocPaymentModel.listAccessPoint().done(function(data) {
            self.channelList(data.accessPointListDTO);

            for (let i = 0; i < data.accessPointListDTO.length; i++) {
                if (data.accessPointListDTO[i].currentLoggedIn === true) {
                    self.selectedChannelIndex(i);
                }
            }

            self.selectedChannel(true);
            self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
            self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
            self.loadAccessPointList(true);
        });

        self.channelTypeChangeHandler = function() {
            if (self.selectedChannelIndex() !== null) {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };

        self.channelPopup = function() {
            const popup1 = document.querySelector("#channel-popup");

            if (popup1.isOpen()) {
                popup1.close();
            } else {
                popup1.open("#channel-disclaimer");
            }
        };

        self.viewLimits = function() {
            self.viewlimitsFlag(false);
            self.customLimitType(undefined);

            if (self.currentAccountType() === "DOMESTIC") {
                self.customLimitType("PC_F_CGNDDD");
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                self.customLimitType("PC_F_CGNIDD");
            }

            ko.tasks.runEarly();
            $("#viewlimits-ADD").trigger("openModal");
            self.viewlimitsFlag(true);
        };

        self.closeModal = function() {
            $("#viewlimits-ADD").trigger("closeModal");
        };

        if ((rootParams.options && rootParams.options.data && rootParams.options.data.fundTransferObject) || (self.params && self.params.fundTransferObject && self.params.fundTransferObject())) {
            const data = rootParams.options && rootParams.options.data ? rootParams.options.data.fundTransferObject : self.params.fundTransferObject ? self.params.fundTransferObject() : null;

            self.payeeName(data.accountName);
            self.draftFavouring(data.nickName);
            self.payAtCity(data.payAtCity);
            self.amount(data.amount);
            self.transferCurrency(data.currency);
            self.debitAccountId(data.debitAccountId);
            self.remarks(data.remarks);
        }
    };
});