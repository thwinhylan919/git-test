define([
    "./model",
    "jquery",
    "knockout",
    "ojs/ojcore"
], function (Model, $, ko, oj) {
    "use strict";

    return function () {
        let self,
         params;

                function mepartyrelationsgetCall(payload, config) {
            return Model.mepartyrelationsget(payload, config);
        }

                function letterofcreditsdraftsgetCall(name, payload, config) {
            return Model.letterofcreditsdraftsget(name, payload, config);
        }

                function mepartygetCall(media, payload, config) {
            return Model.mepartyget(media, payload, config);
        }

                function letterofcreditsdraftsletterOfCreditIdgetCall(letterOfCreditId, payload, config) {
            return Model.letterofcreditsdraftsletterOfCreditIdget(letterOfCreditId, payload, config);
        }

                function letterofcreditsgetCall(lcNumber, beneName, lcStatus, fromAmount, toAmount, currency, status, issueDatefrom, issueDateto, expiryDatefrom, expiryDateto, shipmentDatefrom, shipmentDateto, expiryStatus, partyId, lcType, applicantName, isAmendable, payload, config) {
            return Model.letterofcreditsget(lcNumber, beneName, lcStatus, fromAmount, toAmount, currency, status, issueDatefrom, issueDateto, expiryDatefrom, expiryDateto, shipmentDatefrom, shipmentDateto, expiryStatus, partyId, lcType, applicantName, isAmendable, payload, config);
        }

                function tradeApplicationsgetCall(status, partyId, applicationDate, processCode, applicationId, toDate, fromDate, payload, config) {
            return Model.tradeApplicationsget(status, partyId, applicationDate, processCode, applicationId, toDate, fromDate, payload, config);
        }

                function bankguaranteesdraftsbankGuaranteeIdgetCall(bankGuaranteeId, payload, config) {
            return Model.bankguaranteesdraftsbankGuaranteeIdget(bankGuaranteeId, payload, config);
        }

                function letterofcreditsletterOfCreditIddeleteCall(letterOfCreditId, payload, config) {
            return Model.letterofcreditsletterOfCreditIddelete(letterOfCreditId, payload, config);
        }

                function paymentscurrentDategetCall(payload, config) {
            return Model.paymentscurrentDateget(payload, config);
        }

                function onClickfilter88() {
            const popup = document.querySelector("#popup-filter");

            if (popup.isOpen()) {
                popup.close();
            } else {
                if (params.baseModel.large()) {
                    self.atHorizontal("center");
                    self.atVertical("bottom");
                    self.myHorizontal("left");
                    self.myVertical("top");
                } else {
                    self.myHorizontal("left");
                    self.myVertical("top");
                    self.atHorizontal("center");
                    self.atVertical("bottom");
                }

                popup.open("#enable-filter");
            }
        }

                function onClickDelete55(data, event) {
            self.selectedDraft.name(data.name);
            self.selectedDraft.id(event.key);
            self.selectedDraft.type(data.processManagementApplicationType);
            $("#deleteTemplate").trigger("openModal");
        }

                function onClickBack99() {
            params.dashboard.loadComponent("application-tracker-film-strip", {});
        }

                function onClickReset57() {
            self.selectedApplicationDuration("1Y");
            self.selectedApplicationType("ALL");

            const popup = document.querySelector("#popup-filter");

            if (popup.isOpen()) {
                popup.close();
            }
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            params.baseModel.registerComponent("initiate-lc", "letter-of-credit");
            params.baseModel.registerElement("nav-bar");
            params.baseModel.registerComponent("trade-finance-tracker-details", "trade-finance");
            params.baseModel.registerElement("search-box");
            params.baseModel.registerComponent("initiate-guarantee", "guarantee");
            params.baseModel.registerComponent("application-tracker-film-strip", "process-management");
            ko.utils.extend(self, params.rootModel.previousState || params.rootModel);
            self.selectedApplicationDuration = params.rootModel.params && params.rootModel.params.selectedApplicationDuration !== undefined ? ko.observable(params.rootModel.params.selectedApplicationDuration) : ko.observable("1Y");
            self.selectedApplicationType = params.rootModel.params && params.rootModel.params.selectedApplicationType !== undefined ? ko.observable(params.rootModel.params.selectedApplicationType) : ko.observable("LETTER_OF_CREDIT");
            self.dataAvailable = params.rootModel.params && params.rootModel.params.dataAvailable !== undefined ? ko.observable(params.rootModel.params.dataAvailable) : ko.observable(false);
            self.selectedItem = params.rootModel.params && params.rootModel.params.selectedItem !== undefined ? ko.observable(params.rootModel.params.selectedItem) : ko.observable("SUBMITTED");
            self.selectedCustomerId = params.rootModel.params && params.rootModel.params.selectedCustomerId !== undefined ? ko.observable(params.rootModel.params.selectedCustomerId) : ko.observable();
            self.selectedCustomerName = params.rootModel.params && params.rootModel.params.selectedCustomerName !== undefined ? ko.observable(params.rootModel.params.selectedCustomerName) : ko.observable();
            self.tradeApplications = params.rootModel.params && params.rootModel.params.tradeApplications !== undefined ? ko.observableArray(params.rootModel.params.tradeApplications) : ko.observableArray([]);
            self.searchText = params.rootModel.params && params.rootModel.params.searchText !== undefined ? ko.observable(params.rootModel.params.searchText) : ko.observable(self.nls.searchByApplications);
            self.currentDate = params.baseModel.getDate();
            self.myHorizontal = ko.observable();
            self.myVertical = ko.observable();
            self.atHorizontal = ko.observable();
            self.atVertical = ko.observable();
            self.menuCountOptions = ko.observableArray();

            self.selectedDraft = {
                id: ko.observable(),
                name: ko.observable(),
                type: ko.observable()
            };

            self.selectedTab = ko.observable();
            self.search = ko.observable();
            self.updateDraft = ko.observable(false);
            self.customerName = ko.observableArray([]);
            self.applicantNameArray = ko.observableArray([]);
            self.searchRefresh = ko.observable(true);
            self.selectedApplication = ko.observableArray([]);
            self.responseLoaded = ko.observable(false);
            self.tradeFinanceImage = "process-management/trade-finance.svg";

            if (self.applicantNameArray().length === 0) {
                mepartygetCall().then(function (data) {
                    self.mepartygetVar(data);

                    self.applicantNameArray.push({
                        label: data.party.personalDetails.fullName,
                        value: data.party.id.value
                    });

                    mepartyrelationsgetCall().then(function (partyData) {
                        self.mepartyrelationsgetVar(partyData);

                        for (let i = 0; i < partyData.partyToPartyRelationship.length; i++) {
                            self.applicantNameArray.push({
                                label: partyData.partyToPartyRelationship[i].relatedPartyName,
                                value: partyData.partyToPartyRelationship[i].relatedParty.value
                            });
                        }

                        self.responseLoaded(true);
                    });
                });
            }

            self.applicationTypeArray = ko.observableArray([
                {
                    id: "ALL",
                    label: self.nls.TradeFinance.all
                },
                {
                    id: "LETTER_OF_CREDIT",
                    label: self.nls.TradeFinance.letterOfCredit
                },
                {
                    id: "BANK_GUARANTEE",
                    label: self.nls.TradeFinance.bankGuarantee
                },
                {
                    id: "IMPORT_LETTER_OF_CREDIT_AMENDMENT",
                    label: self.nls.TradeFinance.importletterOfCreditAmendment
                },
                {
                    id: "EXPORT_LC_AMENDMENT_CUST_ACCEPTANCE",
                    label: self.nls.TradeFinance.exportletterOfCreditAmendmentCustAccept
                },
                {
                    id: "BILL_DISCREPANCY_CUST_ACCEPTANCE",
                    label: self.nls.TradeFinance.billDiscrepancyCustAcceptance
                }
            ]);

            self.applicationDuration = ko.observableArray([
                {
                    id: "7D",
                    label: self.nls.TradeFinance.lastSevenDays
                },
                {
                    id: "15D",
                    label: self.nls.TradeFinance.lastFifteenDays
                },
                {
                    id: "1M",
                    label: self.nls.TradeFinance.lastOneMonth
                },
                {
                    id: "3M",
                    label: self.nls.TradeFinance.lastThreeMonths
                },
                {
                    id: "6M",
                    label: self.nls.TradeFinance.lastSixMonths
                },
                {
                    id: "1Y",
                    label: self.nls.TradeFinance.lastOneYear
                }
            ]);

            self.tradeApplicationsgetstatus(self.selectedItem());

            self.getTradeApplications = function (option) {
                self.tradeApplicationsgetstatus(option);
                self.tradeApplicationsgetpartyId(self.selectedCustomerId());
                self.tradeApplicationsgetprocessCode(self.selectedApplicationType());

                if (self.selectedCustomerId() && self.tradeApplicationsgetstatus()) {
                    tradeApplicationsgetCall(self.tradeApplicationsgetstatus(), self.tradeApplicationsgetpartyId(), self.tradeApplicationsgetapplicationDate(), self.tradeApplicationsgetprocessCode(), self.tradeApplicationsgetapplicationId(), self.tradeApplicationsgettoDate(), self.tradeApplicationsgetfromDate()).then(function (response) {
                        self.tradeApplications(response.tradeApplicationDTOList);
                        self.dataAvailable(true);
                    });
                }
            };

            self.selectedCustomerId.subscribe(function () {
                for (let i = 0; i < self.applicantNameArray().length; i++) {
                    if (self.applicantNameArray()[i].value === self.selectedCustomerId()) {
                        self.selectedCustomerName(self.applicantNameArray()[i].label);
                    }
                }

                self.tradeApplications.removeAll();
                self.dataAvailable(false);
                self.getTradeApplications(self.selectedItem());
            });

            self.selectedApplicationDuration.subscribe(function (menuOption) {
                paymentscurrentDategetCall().then(function (data) {
                    self.currentDate = new Date(data.currentDate.valueDate);

                    if (self.selectedApplicationDuration() === "7D") {
                        self.tradeApplicationsgettoDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate)));
                        self.tradeApplicationsgetfromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate.getFullYear(), self.currentDate.getMonth(), self.currentDate.getDate() - 7)));
                    } else if (self.selectedApplicationDuration() === "15D") {
                        self.tradeApplicationsgettoDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate)));
                        self.tradeApplicationsgetfromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate.getFullYear(), self.currentDate.getMonth(), self.currentDate.getDate() - 15)));
                    } else if (self.selectedApplicationDuration() === "1M") {
                        self.tradeApplicationsgettoDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate)));
                        self.tradeApplicationsgetfromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate.getFullYear(), self.currentDate.getMonth() - 1, self.currentDate.getDate())));
                    } else if (self.selectedApplicationDuration() === "3M") {
                        self.tradeApplicationsgettoDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate)));
                        self.tradeApplicationsgetfromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate.getFullYear(), self.currentDate.getMonth() - 3, self.currentDate.getDate())));
                    } else if (self.selectedApplicationDuration() === "6M") {
                        self.tradeApplicationsgettoDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate)));
                        self.tradeApplicationsgetfromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate.getFullYear(), self.currentDate.getMonth() - 6, self.currentDate.getDate())));
                    } else if (self.selectedApplicationDuration() === "1Y") {
                        self.tradeApplicationsgettoDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate)));
                        self.tradeApplicationsgetfromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate.getFullYear() - 1, self.currentDate.getMonth(), self.currentDate.getDate())));
                    }
                });

                self.selectedApplicationDuration(menuOption);
                self.refreshListView();
                self.getTradeApplications(self.selectedItem());
            });

            self.selectedApplicationType.subscribe(function (menuOption) {
                self.selectedApplicationType(menuOption);
                self.refreshListView();
                self.getTradeApplications(self.selectedItem());
            });

            const subscription = self.selectedItem.subscribe(function (menuOption) {
                if (menuOption === "DRAFT") {
                    self.searchText(self.nls.searchByDraftName);
                } else {
                    self.searchText(self.nls.searchByApplications);
                }

                self.tradeApplicationsgetstatus(menuOption);
                self.refreshListView();
                self.getTradeApplications(menuOption);
            });

            self.onCardSelection = function (data, event) {
                if (self.selectedItem() === "DRAFT") {
                    if (event.target.firstSelectedItem.data.processManagementApplicationType === "LETTER_OF_CREDIT") {
                        self.letterofcreditsdraftsletterOfCreditIdgetletterOfCreditId(event.target.firstSelectedItem.data.applicationNumber);

                        letterofcreditsdraftsletterOfCreditIdgetCall(self.letterofcreditsdraftsletterOfCreditIdgetletterOfCreditId()).then(function (data) {
                            const dataToBePassed = data.letterOfCredit;

                            if (dataToBePassed.draftsRequired) {
                                for (let i = 0; i < dataToBePassed.billingDrafts.length; i++) {
                                    if (!dataToBePassed.billingDrafts[i].otherInformation) {
                                        dataToBePassed.billingDrafts[i].otherInformation = null;
                                    }
                                }
                            }

                            self.updateDraft(true);

                            const parameters = {
                                applicationTracker: true,
                                mode: "EDIT",
                                letterOfCreditDetails: dataToBePassed,
                                selectedItem: self.selectedItem(),
                                selectedCustomerName: self.selectedCustomerName(),
                                selectedCustomerId: self.selectedCustomerId(),
                                selectedApplicationType: self.selectedApplicationType(),
                                selectedApplicationDuration: self.selectedApplicationDuration(),
                                tradeApplications: self.tradeApplications(),
                                dataAvailable: self.dataAvailable(),
                                searchText: self.searchText()
                            };

                            params.dashboard.loadComponent("initiate-lc", parameters);
                        });
                    } else if (event.target.firstSelectedItem.data.processManagementApplicationType === "BANK_GUARANTEE") {
                        self.bankguaranteesdraftsbankGuaranteeIdgetbankGuaranteeId(event.target.firstSelectedItem.data.applicationNumber);

                        bankguaranteesdraftsbankGuaranteeIdgetCall(self.bankguaranteesdraftsbankGuaranteeIdgetbankGuaranteeId()).then(function (data) {
                            const dataToBePassed = data.bankGuarantee;

                            self.updateDraft(true);

                            const parameters = {
                                applicationTracker: true,
                                mode: "EDIT",
                                guaranteeDetails: dataToBePassed,
                                selectedItem: self.selectedItem(),
                                selectedCustomerName: self.selectedCustomerName(),
                                selectedCustomerId: self.selectedCustomerId(),
                                selectedApplicationType: self.selectedApplicationType(),
                                selectedApplicationDuration: self.selectedApplicationDuration(),
                                tradeApplications: self.tradeApplications(),
                                dataAvailable: self.dataAvailable(),
                                searchText: self.searchText()
                            };

                            params.dashboard.loadComponent("initiate-guarantee", parameters);
                        });
                    }
                } else {
                    const parameters = {
                        applicationDetails: event.target.firstSelectedItem.data,
                        selectedItem: self.selectedItem(),
                        selectedCustomerName: self.selectedCustomerName(),
                        selectedCustomerId: self.selectedCustomerId(),
                        selectedApplicationType: self.selectedApplicationType(),
                        selectedApplicationDuration: self.selectedApplicationDuration(),
                        tradeApplications: self.tradeApplications(),
                        dataAvailable: self.dataAvailable()
                    };

                    params.dashboard.loadComponent("trade-finance-tracker-details", parameters);
                }
            };

            self.refreshListView = function () {
                self.tradeApplications.removeAll();
                self.dataAvailable(false);
            };

            self.dispose = function () {
                subscription.dispose();
            };

            return true;
        }

        return {
            mepartyrelationsgetCall: mepartyrelationsgetCall,
            letterofcreditsdraftsgetCall: letterofcreditsdraftsgetCall,
            mepartygetCall: mepartygetCall,
            letterofcreditsdraftsletterOfCreditIdgetCall: letterofcreditsdraftsletterOfCreditIdgetCall,
            letterofcreditsgetCall: letterofcreditsgetCall,
            tradeApplicationsgetCall: tradeApplicationsgetCall,
            bankguaranteesdraftsbankGuaranteeIdgetCall: bankguaranteesdraftsbankGuaranteeIdgetCall,
            letterofcreditsletterOfCreditIddeleteCall: letterofcreditsletterOfCreditIddeleteCall,
            paymentscurrentDategetCall: paymentscurrentDategetCall,
            onClickfilter88: onClickfilter88,
            onClickDelete55: onClickDelete55,
            onClickBack99: onClickBack99,
            onClickReset57: onClickReset57,
            init: init
        };
    };
});