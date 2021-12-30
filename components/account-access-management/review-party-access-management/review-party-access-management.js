define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/access-management",
    "ojs/ojswitch",
    "ojs/ojnavigationlist",
    "ojs/ojbutton",
    "ojs/ojcheckboxset",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojrowexpander",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource",
    "ojs/ojflattenedtreetabledatasource"
], function(oj, ko, $, reviewPartyAccountAccessModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.rootParams = ko.mapping.fromJS(rootParams.rootModel.params ? rootParams.rootModel.params.data : null);
        self.nls = resourceBundle;
        self.showReviewComponent = ko.observable(true);
        self.reviewCasaList = ko.observableArray([]);
        self.reviewTDList = ko.observableArray([]);
        self.reviewLoanList = ko.observableArray([]);
        self.reviewLMList = ko.observableArray([]);
        self.reviewVERList = ko.observableArray([]);
        self.reviewVRAList = ko.observableArray([]);
        self.accessLevel1 = ko.observable();
        self.isAccessCreated1 = ko.observable();
        self.showEditableForm1 = ko.observable();
        self.fullCasaAccountListSorted = ko.observable([]);
        self.fulltdAccountListSorted = ko.observable([]);
        self.fullloanAccountListSorted = ko.observable([]);
        self.fullLMAccountListSorted = ko.observable([]);
        self.fullVirtualAccountListSorted = ko.observable([]);
        self.fullVAMEnabledRealAccountListSorted = ko.observable([]);
        self.reloadCasaTable = ko.observable(false);
        self.reloadTDTable = ko.observable(false);
        self.reloadLoanTable = ko.observable(false);
        self.reloadLMTable = ko.observable(false);
        self.reloadVERTable = ko.observable(false);
        self.reloadVRATable = ko.observable(false);
        self.loadSummaryTable = ko.observable(false);
        self.isPreferenceExist = ko.observable(false);
        self.indexSelected = ko.observable();
        self.isLinkageExist = ko.observable(false);
        self.partySetUpNotExists = ko.observable(false);
        self.fullPartiesCasaAccountList = ko.observableArray();
        self.fullPartiesLoanAccountList = ko.observableArray();
        self.fullPartiesTDAccountList = ko.observableArray();
        self.fullPartiesLMAccountList = ko.observableArray();
        self.fullPartiesVAMRealAccountList = ko.observableArray();
        self.fullPartiesVirtualAccountList = ko.observableArray();
        self.fullCasaAccountListReview = ko.observable([]);
        self.fulltdAccountListReview = ko.observable([]);
        self.fullloanAccountListReview = ko.observable([]);
        self.fullLMAccountListReview = ko.observable([]);
        self.fullVERAccountListReview = ko.observable([]);
        self.fullVRAAccountListReview = ko.observable([]);
        self.showConfirmation = ko.observable(false);
        self.menuSelection = ko.observable("CASA");
        self.showTemplateReview = ko.observable(true);
        self.idReview = ko.observable("CASA");
        self.templateReview =ko.observable("casa-review");
        rootParams.baseModel.registerElement("nav-bar");

        rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, {
            user: self.nls.navLabels.PartyLevel_title
        }));

        const options = {
            expanded: "all",
            columns: [
                "accountID",
                "currency",
                "displayValue",
                "accountStatus"
            ]
        };

        if (self.rootParams && self.rootParams.partyAccountAccessDTOs) {
            self.parentAccessLevel = ko.observable();
            self.mapAllTransactionsCasaFlag = ko.observableArray();
            self.mapAllTransactionsTdFlag = ko.observableArray();
            self.mapAllTransactionsLonFlag = ko.observableArray();
            self.mapAllTransactionsLMFlag = ko.observableArray();
            self.mapAllTransactionsVERFlag = ko.observableArray();
            self.mapAllTransactionsVRAFlag = ko.observableArray();

            self.highlightedTabTrans = ko.observable("CASA");
            self.partyID = ko.observable(self.rootParams.partyAccountAccessDTOs()[0].party.value());
            self.party = self.rootParams.partyAccountAccessDTOs()[0].party;
            self.parentAccessLevel("PARTY");
            self.partyName = ko.observable(rootParams.rootModel.params.transactionDetails.partyName.fullName);
            self.accessLevel = ko.observable(self.rootParams.partyAccountAccessDTOs()[0].accessLevel());
            self.accessStatus = ko.observable(self.rootParams.partyAccountAccessDTOs()[0].accessStatus());
            self.showConfirmationForCreate = ko.observable(false);
            self.showEditableForm = ko.observable(false);
            self.disableAccountSelection = ko.observable(true);

            self.transactionNames = {
                casa: "CASA",
                loan: self.nls.navLabels.Loan,
                td: self.nls.navLabels.TD,
                lm: self.nls.navLabels.LER,
                ver: self.nls.navLabels.VER,
                vra: self.nls.navLabels.VRA
            };

            self.showEditableForm = ko.observable(true);

            for (let z = 0; z < self.rootParams.partyAccountAccessDTOs().length; z++) {
                if (self.rootParams.partyAccountAccessDTOs()[z].accountType() === "CSA") {
                    if (self.rootParams.partyAccountAccessDTOs()[z].accessStatus() === true) {
                        self.selectedCasaPolicy = ko.observable("casaAuto");
                    } else {
                        self.selectedCasaPolicy = ko.observable("casaManual");
                    }
                }

                if (self.rootParams.partyAccountAccessDTOs()[z].accountType() === "TRD") {
                    if (self.rootParams.partyAccountAccessDTOs()[z].accessStatus() === true) {
                        self.selectedTdPolicy = ko.observable("tdAuto");
                    } else {
                        self.selectedTdPolicy = ko.observable("tdManual");
                    }
                }

                if (self.rootParams.partyAccountAccessDTOs()[z].accountType() === "LON") {
                    if (self.rootParams.partyAccountAccessDTOs()[z].accessStatus() === true) {
                        self.selectedLoanPolicy = ko.observable("loanAuto");
                    } else {
                        self.selectedLoanPolicy = ko.observable("loanManual");
                    }
                }

                if (self.rootParams.partyAccountAccessDTOs()[z].accountType() === "LER") {
                    if (self.rootParams.partyAccountAccessDTOs()[z].accessStatus() === true) {
                        self.selectedLMPolicy = ko.observable("lmAuto");
                    } else {
                        self.selectedLMPolicy = ko.observable("lmManual");
                    }
                }

                if (self.rootParams.partyAccountAccessDTOs()[z].accountType() === "VRA") {
                    if (self.rootParams.partyAccountAccessDTOs()[z].accessStatus() === true) {
                        self.selectedVirtualPolicy = ko.observable("vraAuto");
                    } else {
                        self.selectedVirtualPolicy = ko.observable("vraManual");
                    }
                }

                if (self.rootParams.partyAccountAccessDTOs()[z].accountType() === "VER") {
                    if (self.rootParams.partyAccountAccessDTOs()[z].accessStatus() === true) {
                        self.selectedVamEnabledRealAccPolicy = ko.observable("verAuto");
                    } else {
                        self.selectedVamEnabledRealAccPolicy = ko.observable("verManual");
                    }
                }
            }

            self.selectedCasaAccounts = ko.observableArray();
            self.selectedTdAccounts = ko.observableArray();
            self.selectedLoanAccounts = ko.observableArray();
            self.selectedLMAccounts = ko.observableArray();
            self.selectedVirtualAccounts = ko.observableArray();
            self.selectedVAMEnabledRealAccounts = ko.observableArray();
            self.selectedAccounts = ko.observableArray();
            self.casaExclusionAccountNumberList = ko.observable([]);
            self.tdExclusionAccountNumberList = ko.observable([]);
            self.loanExclusionAccountNumberList = ko.observable([]);
            self.lmExclusionAccountNumberList = ko.observable([]);
            self.virtualExclusionAccountNumberList = ko.observable([]);
            self.vamEnabledRealExclusionAccountNumberList = ko.observable([]);
            self.updatedCASAExclusionNumberList = ko.observable([]);
            self.updatedTDExclusionNumberList = ko.observable([]);
            self.updatedLOANExclusionNumberList = ko.observable([]);
            self.updatedLMExclusionNumberList = ko.observable([]);
            self.updatedVirtualExclusionNumberList = ko.observable([]);
            self.updatedVAMEnabledRealExclusionNumberList = ko.observable([]);
            self.showReviewComponent = ko.observable(true);
            self.reviewCasaList = ko.observableArray([]);
            self.reviewTDList = ko.observableArray([]);
            self.reviewLoanList = ko.observableArray([]);
            self.reviewLMList = ko.observableArray([]);
            self.reviewVERList = ko.observableArray([]);
            self.reviewVRAList = ko.observableArray([]);
            self.fullCasaAccountListSorted = ko.observable([]);
            self.fulltdAccountListSorted = ko.observable([]);
            self.fullloanAccountListSorted = ko.observable([]);
            self.fullLMAccountListSorted = ko.observable([]);
            self.fullVirtualAccountListSorted = ko.observable([]);
            self.fullVAMEnabledRealAccountListSorted = ko.observable([]);
            self.selectedAccountsResources = ko.observableArray();
            self.fullCasaAccountList = ko.observable([]);
            self.fulltdAccountList = ko.observable([]);
            self.fullloanAccountList = ko.observable([]);
            self.fullLMAccountList = ko.observable([]);
            self.fullVirtualAccountList = ko.observable([]);
            self.fullVAMEnabledRealAccountList = ko.observable([]);
            self.resourceListCasa = ko.observable([]);
            self.resourceListTD = ko.observable([]);
            self.resourceListLON = ko.observable([]);
            self.resourceListLM = ko.observable([]);
            self.resourceListVER = ko.observable([]);
            self.resourceListVRA = ko.observable([]);
            self.casaTransactionTabVisited = ko.observable(false);
            self.tdTransactionTabVisited = ko.observable(false);
            self.loanTransactionTabVisited = ko.observable(false);
            self.lmTransactionTabVisited = ko.observable(false);
            self.vamEnabledRealAccountTabVisited = ko.observable(false);
            self.virtualAccountTabVisited = ko.observable(false);
            self.showReviewScreen = ko.observable(true);
            self.tmpTransactionCodeArray = ko.observableArray();
            self.tmpTransactionCodeTrdArray = ko.observableArray();
            self.tmpTransactionCodeLonArray = ko.observableArray();
            self.tmpTransactionCodeLMArray = ko.observableArray();
            self.tmpTransactionCodeVERArray = ko.observableArray();
            self.tmpTransactionCodeVRAArray = ko.observableArray();
            self.mapAllTransactionsToAllAccountCasa = ko.observable(false);
            self.mapAllTransactionsToAllAccountTrd = ko.observable(false);
            self.mapAllTransactionsToAllAccountLon = ko.observable(false);
            self.mapAllTransactionsToAllAccountLM = ko.observable(false);
            self.mapAllTransactionsToAllAccountVER = ko.observable(false);
            self.mapAllTransactionsToAllAccountVRA = ko.observable(false);
            self.casaMapAllTransactionIndicatorArray = ko.observableArray();
            self.trdMapAllTransactionIndicatorArray = ko.observableArray();
            self.loanMapAllTransactionIndicatorArray = ko.observableArray();
            self.lmMapAllTransactionIndicatorArray = ko.observableArray();
            self.VERMapAllTransactionIndicatorArray = ko.observableArray();
            self.VRAMapAllTransactionIndicatorArray = ko.observableArray();
            self.isCasaAllowed = ko.observable();
            self.isTDAllowed = ko.observable();
            self.isLoanAllowed = ko.observable();
            self.isLMAllowed = ko.observable();
            self.isVirtualAllowed = ko.observable();
            self.isVAMEnabledRealAllowed = ko.observable();
            self.casaAccountAccessId = ko.observable();
            self.tdAccountAccessId = ko.observable();
            self.loanAccountAccessId = ko.observable();
            self.lmAccountAccessId = ko.observable();
            self.virtualAccountAccessId = ko.observable();
            self.vamEnabledRealAccountAccessId = ko.observable();
            self.casaAccountNumbersArray = ko.observable([]);
            self.tdAccountNumbersArray = ko.observable([]);
            self.loanAccountNumbersArray = ko.observable([]);
            self.lmAccountNumbersArray = ko.observable([]);
            self.virtualAccountNumbersArray = ko.observable([]);
            self.vamEnabledRealAccountNumbersArray = ko.observable([]);
        }

        rootParams.baseModel.registerComponent("transaction-selection", "account-access-management");
        rootParams.baseModel.registerComponent("confirmation", "account-access-management");

        self.tabLists = ko.observableArray([{
            id: "CASA",
            label: self.nls.navLabels.CASA,
            template: "casa-review"
        },
        {
            id: "TRD",
            label: self.nls.navLabels.TD,
            template: "td-review"
        },
        {
            id: "LON",
            label: self.nls.navLabels.Loans,
            template: "loan-review"
        },
        {
            id: "LER",
            label: self.nls.navLabels.LER,
            template: "lm-review"
        },
        {
            id: "VER",
            label: self.nls.navLabels.VER,
            template: "virtual-enabled-real-review"
        },
        {
            id: "VRA",
            label: self.nls.navLabels.VRA,
            template: "virtual-review"
        }
        ]);

        self.uiOptions = {
            menuFloat: "right",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        const menuselectionSubscription = self.menuSelection.subscribe(function (newValue) {
            self.showTemplateReview(false);

            if (newValue === "CASA") {
                self.highlightedTabTrans("CASA");
                self.casaTransactionTabVisited(true);
                self.templateReview("casa-review");
                self.idReview("CASA");
            } else if (newValue === "TRD") {
                self.highlightedTabTrans("TRD");
                self.tdTransactionTabVisited(true);
                self.templateReview("td-review");
                self.idReview("TRD");
            } else if (newValue === "LON") {
                self.highlightedTabTrans("LON");
                self.loanTransactionTabVisited(true);
                self.templateReview("loan-review");
                self.idReview("LON");
            } else if (newValue === "LER") {
                self.highlightedTabTrans("LER");
                self.lmTransactionTabVisited(true);
                self.templateReview("lm-review");
                self.idReview("LER");
            } else if (newValue === "VER") {
                self.highlightedTabTrans("VER");
                self.vamEnabledRealAccountTabVisited(true);
                self.templateReview("virtual-enabled-real-review");
                self.idReview("VER");
            } else if (newValue === "VRA") {
                self.highlightedTabTrans("VRA");
                self.virtualAccountTabVisited(true);
                self.templateReview("virtual-review");
                self.idReview("VRA");
            }

            self.showTemplateReview(true);
        });

        self.populateSelectedAccounts = function() {
            self.casaExclusionAccountNumberList([]);
            self.tdExclusionAccountNumberList([]);
            self.loanExclusionAccountNumberList([]);
            self.lmExclusionAccountNumberList([]);
            self.vamEnabledRealExclusionAccountNumberList([]);
            self.virtualExclusionAccountNumberList([]);
            self.updatedCASAExclusionNumberList([]);
            self.updatedTDExclusionNumberList([]);
            self.updatedLOANExclusionNumberList([]);
            self.updatedLMExclusionNumberList([]);
            self.updatedVirtualExclusionNumberList([]);
            self.updatedVAMEnabledRealExclusionNumberList([]);

            if (self.rootParams && self.rootParams.partyAccountAccessDTOs) {
                if (self.rootParams.partyAccountAccessDTOs().length > 0) {
                    for (let x = 0; x < self.rootParams.partyAccountAccessDTOs().length; x++) {
                        if (self.rootParams.partyAccountAccessDTOs()[x].accountExclusionDTOs()) {
                            if (self.rootParams.partyAccountAccessDTOs()[x].accountType() === "CSA") {
                                self.isCasaAllowed(self.rootParams.partyAccountAccessDTOs()[x].accessStatus());

                                if (self.rootParams.partyAccountAccessDTOs()[x].accountAccessId) {
                                    self.casaAccountAccessId(self.rootParams.partyAccountAccessDTOs()[x].accountAccessId());
                                }

                                self.updatedCASAExclusionNumberList(self.rootParams.partyAccountAccessDTOs()[x].accountExclusionDTOs());

                                ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function(item) {
                                    self.casaAccountNumbersArray().push(item.accountNumber.value());
                                });

                                if (self.isCasaAllowed()) {
                                    ko.utils.arrayForEach(self.fullCasaAccountListReview(), function(item) {
                                        if (self.casaAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                                            for (let i = 0; i < self.updatedCASAExclusionNumberList().length; i++) {
                                                if (self.updatedCASAExclusionNumberList()[i].accountNumber.value() === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedCASAExclusionNumberList()[i].taskIds().length) {
                                                    self.selectedCasaAccounts.push(item.accountNumber.value);
                                                }
                                            }
                                        } else {
                                            self.selectedCasaAccounts.push(item.accountNumber.value);
                                        }
                                    });
                                } else {
                                    ko.utils.arrayForEach(self.updatedCASAExclusionNumberList(), function(item) {
                                        self.selectedCasaAccounts.push(item.accountNumber.value());
                                    });
                                }
                            } else if (self.rootParams.partyAccountAccessDTOs()[x].accountType() === "TRD") {
                                self.isTDAllowed(self.rootParams.partyAccountAccessDTOs()[x].accessStatus());

                                if (self.rootParams.partyAccountAccessDTOs()[x].accountAccessId) {
                                    self.tdAccountAccessId(self.rootParams.partyAccountAccessDTOs()[x].accountAccessId());
                                }

                                self.updatedTDExclusionNumberList(self.rootParams.partyAccountAccessDTOs()[x].accountExclusionDTOs());

                                ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function(item) {
                                    self.tdAccountNumbersArray().push(item.accountNumber.value());
                                });

                                if (self.isTDAllowed()) {
                                    ko.utils.arrayForEach(self.fulltdAccountListReview(), function(item) {
                                        if (self.tdAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                                            for (let i = 0; i < self.updatedTDExclusionNumberList().length; i++) {
                                                if (self.updatedTDExclusionNumberList()[i].accountNumber.value() === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedTDExclusionNumberList()[i].taskIds().length) {
                                                    self.selectedTdAccounts.push(item.accountNumber.value);
                                                }
                                            }
                                        } else {
                                            self.selectedTdAccounts.push(item.accountNumber.value);
                                        }
                                    });
                                } else {
                                    ko.utils.arrayForEach(self.updatedTDExclusionNumberList(), function(item) {
                                        self.selectedTdAccounts.push(item.accountNumber.value());
                                    });
                                }
                            } else if (self.rootParams.partyAccountAccessDTOs()[x].accountType() === "LON") {
                                self.isLoanAllowed(self.rootParams.partyAccountAccessDTOs()[x].accessStatus());

                                if (self.rootParams.partyAccountAccessDTOs()[x].accountAccessId) {
                                    self.loanAccountAccessId(self.rootParams.partyAccountAccessDTOs()[x].accountAccessId());
                                }

                                self.updatedLOANExclusionNumberList(self.rootParams.partyAccountAccessDTOs()[x].accountExclusionDTOs());

                                ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function(item) {
                                    self.loanAccountNumbersArray().push(item.accountNumber.value);
                                });

                                if (self.isLoanAllowed()) {
                                    ko.utils.arrayForEach(self.fullloanAccountListReview(), function(item) {
                                        if (self.loanAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                                            for (let i = 0; i < self.updatedLOANExclusionNumberList().length; i++) {
                                                if (self.updatedLOANExclusionNumberList()[i].accountNumber.value() === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedLOANExclusionNumberList()[i].taskIds().length) {
                                                    self.selectedLoanAccounts.push(item.accountNumber.value);
                                                }
                                            }
                                        } else {
                                            self.selectedLoanAccounts.push(item.accountNumber.value);
                                        }
                                    });
                                } else {
                                    ko.utils.arrayForEach(self.updatedLOANExclusionNumberList(), function(item) {
                                        self.selectedLoanAccounts.push(item.accountNumber.value());
                                    });
                                }
                            } else
                            if (self.rootParams.partyAccountAccessDTOs()[x].accountType() === "LER") {
                                self.isLMAllowed(self.rootParams.partyAccountAccessDTOs()[x].accessStatus());

                                if (self.rootParams.partyAccountAccessDTOs()[x].accountAccessId) {
                                    self.lmAccountAccessId(self.rootParams.partyAccountAccessDTOs()[x].accountAccessId());
                                }

                                self.updatedLMExclusionNumberList(self.rootParams.partyAccountAccessDTOs()[x].accountExclusionDTOs());

                                ko.utils.arrayForEach(self.updatedLMExclusionNumberList(), function(item) {
                                    self.lmAccountNumbersArray().push(item.accountNumber.value());
                                });

                                if (self.isLMAllowed()) {
                                    ko.utils.arrayForEach(self.fullLMAccountListReview(), function(item) {
                                        if (self.lmAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                                            for (let i = 0; i < self.updatedLMExclusionNumberList().length; i++) {
                                                if (self.updatedLMExclusionNumberList()[i].accountNumber.value() === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedLMExclusionNumberList()[i].taskIds().length) {
                                                    self.selectedLMAccounts.push(item.accountNumber.value);
                                                }
                                            }
                                        } else {
                                            self.selectedLMAccounts.push(item.accountNumber.value);
                                        }
                                    });
                                } else {
                                    ko.utils.arrayForEach(self.updatedLMExclusionNumberList(), function(item) {
                                        self.selectedLMAccounts.push(item.accountNumber.value());
                                    });
                                }
                            } else
                            if (self.rootParams.partyAccountAccessDTOs()[x].accountType() === "VER") {
                                self.isVAMEnabledRealAllowed(self.rootParams.partyAccountAccessDTOs()[x].accessStatus());

                                if (self.rootParams.partyAccountAccessDTOs()[x].accountAccessId) {
                                    self.vamEnabledRealAccountAccessId(self.rootParams.partyAccountAccessDTOs()[x].accountAccessId());
                                }

                                self.updatedVAMEnabledRealExclusionNumberList(self.rootParams.partyAccountAccessDTOs()[x].accountExclusionDTOs());

                                ko.utils.arrayForEach(self.updatedVAMEnabledRealExclusionNumberList(), function(item) {
                                    self.vamEnabledRealAccountNumbersArray().push(item.accountNumber.value());
                                });

                                if (self.isVAMEnabledRealAllowed()) {
                                    ko.utils.arrayForEach(self.fullVERAccountListReview(), function(item) {
                                        if (self.vamEnabledRealAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                                            for (let i = 0; i < self.updatedVAMEnabledRealExclusionNumberList().length; i++) {
                                                if (self.updatedVAMEnabledRealExclusionNumberList()[i].accountNumber.value() === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedVAMEnabledRealExclusionNumberList()[i].taskIds().length) {
                                                    self.selectedVAMEnabledRealAccounts.push(item.accountNumber.value);
                                                }
                                            }
                                        } else {
                                            self.selectedVAMEnabledRealAccounts.push(item.accountNumber.value);
                                        }
                                    });
                                } else {
                                    ko.utils.arrayForEach(self.updatedVAMEnabledRealExclusionNumberList(), function(item) {
                                        self.selectedVAMEnabledRealAccounts.push(item.accountNumber.value());
                                    });
                                }
                            } else
                            if (self.rootParams.partyAccountAccessDTOs()[x].accountType() === "VRA") {
                                self.isVirtualAllowed(self.rootParams.partyAccountAccessDTOs()[x].accessStatus());

                                if (self.rootParams.partyAccountAccessDTOs()[x].accountAccessId) {
                                    self.virtualAccountAccessId(self.rootParams.partyAccountAccessDTOs()[x].accountAccessId());
                                }

                                self.updatedVirtualExclusionNumberList(self.rootParams.partyAccountAccessDTOs()[x].accountExclusionDTOs());

                                ko.utils.arrayForEach(self.updatedVirtualExclusionNumberList(), function(item) {
                                    self.virtualAccountNumbersArray().push(item.accountNumber.value());
                                });

                                if (self.isVirtualAllowed()) {
                                    ko.utils.arrayForEach(self.fullVRAAccountListReview(), function(item) {
                                        if (self.virtualAccountNumbersArray().indexOf(item.accountNumber.value) > -1) {
                                            for (let i = 0; i < self.updatedVirtualExclusionNumberList().length; i++) {
                                                if (self.updatedVirtualExclusionNumberList()[i].accountNumber.value() === item.accountNumber.value && item.fullResourceTaskList.length !== self.updatedVirtualExclusionNumberList()[i].taskIds().length) {
                                                    self.selectedVirtualAccounts.push(item.accountNumber.value);
                                                }
                                            }
                                        } else {
                                            self.selectedVirtualAccounts.push(item.accountNumber.value);
                                        }
                                    });
                                } else {
                                    ko.utils.arrayForEach(self.updatedVirtualExclusionNumberList(), function(item) {
                                        self.selectedVirtualAccounts.push(item.accountNumber.value());
                                    });
                                }
                            }
                        }
                    }

                    self.createBaseForDataSource(self.rootParams.partyAccountAccessDTOs());
                }
            }
        };

        self.activateTab = function() {
            $("#tabs-container-select #tabGroups-select").ojTabs({
                selected: self.highlightedTabTrans()
            });
        };

        self.getAllAccountsCount = function() {
            reviewPartyAccountAccessModel.readAllAccountDetails(self.partyID()).done(function(data) {
                if (data.accounts.length > 0) {
                    ko.utils.arrayForEach(data.accounts, function(partyItem) {
                        self.fullCasaAccountList([]);
                        self.fulltdAccountList([]);
                        self.fullloanAccountList([]);
                        self.fullLMAccountList([]);
                        self.fullVirtualAccountList([]);
                        self.fullVAMEnabledRealAccountList([]);

                        self.Loader = false;

                        if (partyItem.setupInformation === "SETUP_EXISTS") {
                            self.isAccessCreated1(true);
                            self.showEditableForm1(true);
                        } else {
                            self.isAccessCreated1(false);
                            self.showEditableForm1(false);
                        }

                        if (partyItem.preferenceStatus === "ENABLED") {
                            self.isPreferenceExist(true);
                        } else {
                            self.isPreferenceExist(false);
                        }

                        self.accessLevel1(partyItem.accessLevel);

                        if (partyItem.accountsList) {
                            const casaPayload = [],
                                tdPayload = [],
                                loanPayload = [],
                                lmPayload = [],
                                verPayload = [],
                                vraPayload = [];

                            for (let x = 0; x < partyItem.accountsList.length; x++) {
                                if (partyItem.accountsList[x].accountType === "CSA") {
                                    casaPayload.push(partyItem.accountsList[x]);
                                }

                                if (partyItem.accountsList[x].accountType === "LON") {
                                    loanPayload.push(partyItem.accountsList[x]);
                                }

                                if (partyItem.accountsList[x].accountType === "TRD") {
                                    tdPayload.push(partyItem.accountsList[x]);
                                }

                                if (partyItem.accountsList[x].accountType === "LER") {
                                    lmPayload.push(partyItem.accountsList[x]);
                                }

                                if (partyItem.accountsList[x].accountType === "VER") {
                                    verPayload.push(partyItem.accountsList[x]);
                                }

                                if (partyItem.accountsList[x].accountType === "VRA") {
                                    vraPayload.push(partyItem.accountsList[x]);
                                }
                            }

                            if (casaPayload) {
                                ko.utils.arrayForEach(casaPayload, function(item) {
                                    self.newCasaObject = {
                                        accountType: "",
                                        accountNumber: {
                                            value: "",
                                            displayValue: ""
                                        },
                                        displayName: "",
                                        accountStatus: "",
                                        resourceListCasa: [],
                                        selectedTask: [],
                                        nonSelectedTask: [],
                                        currencyCode: "",
                                        fullResourceTaskList: []
                                    };

                                    ko.utils.arrayForEach(item.tasks, function(thisChildTaskItem) {
                                        self.newResourceObject = {
                                            childTasks: [],
                                            name: ""
                                        };

                                        ko.utils.arrayForEach(thisChildTaskItem.childTasks, function(thisItem) {
                                            self.newTaskObject = {
                                                id: "",
                                                name: "",
                                                supportedAccountTypes: [],
                                                approvalSupported: "",
                                                limitRequired: "",
                                                moduleType: "",
                                                type: "",
                                                allowed: ""
                                            };

                                            self.newTaskObject.id = thisItem.childTask.id;
                                            self.newTaskObject.name = thisItem.childTask.name;
                                            self.newTaskObject.supportedAccountTypes = thisItem.childTask.supportedAccountTypes;
                                            self.newTaskObject.approvalSupported = thisItem.childTask.approvalSupported;
                                            self.newTaskObject.limitRequired = thisItem.childTask.limitRequired;
                                            self.newTaskObject.moduleType = thisItem.childTask.moduleType;
                                            self.newTaskObject.type = thisItem.childTask.type;
                                            self.newTaskObject.allowed = thisItem.allowed;

                                            if (thisItem.allowed) {
                                                self.newCasaObject.selectedTask.push(thisItem.childTask.id);
                                            } else {
                                                self.newCasaObject.nonSelectedTask.push(thisItem.childTask.id);
                                            }

                                            self.newCasaObject.fullResourceTaskList.push(thisItem.childTask.id);
                                            self.newResourceObject.childTasks.push(self.newTaskObject);
                                            self.newResourceObject.name = thisChildTaskItem.name;
                                        });

                                        self.newCasaObject.resourceListCasa.push(self.newResourceObject);
                                    });

                                    self.newCasaObject.accountType = item.accountType;
                                    self.newCasaObject.accountNumber.value = item.accountNumber.value;
                                    self.newCasaObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newCasaObject.currencyCode = item.currencyCode;
                                    self.newCasaObject.accountStatus = item.accountStatus;
                                    self.newCasaObject.displayName = item.displayName;
                                    self.resourceListCasa([self.newCasaObject.resourceListCasa]);
                                    self.fullCasaAccountList().push(self.newCasaObject);
                                });

                                self.fullPartiesCasaAccountList().push(self.fullCasaAccountList());
                            }

                            if (tdPayload) {
                                ko.utils.arrayForEach(tdPayload, function(item) {
                                    self.newTdObject = {
                                        accountType: "",
                                        accountNumber: {
                                            value: "",
                                            displayValue: ""
                                        },
                                        displayName: "",
                                        accountStatus: "",
                                        resourceListTD: [],
                                        selectedTask: [],
                                        nonSelectedTask: [],
                                        currencyCode: "",
                                        fullResourceTaskList: []
                                    };

                                    ko.utils.arrayForEach(item.tasks, function(thisChildTaskItem) {
                                        self.newResourceObject = {
                                            childTasks: [],
                                            name: ""
                                        };

                                        ko.utils.arrayForEach(thisChildTaskItem.childTasks, function(thisItem) {
                                            self.newTaskObject = {
                                                id: "",
                                                name: "",
                                                supportedAccountTypes: [],
                                                approvalSupported: "",
                                                limitRequired: "",
                                                moduleType: "",
                                                type: "",
                                                allowed: ""
                                            };

                                            self.newTaskObject.id = thisItem.childTask.id;
                                            self.newTaskObject.name = thisItem.childTask.name;
                                            self.newTaskObject.supportedAccountTypes = thisItem.childTask.supportedAccountTypes;
                                            self.newTaskObject.approvalSupported = thisItem.childTask.approvalSupported;
                                            self.newTaskObject.limitRequired = thisItem.childTask.limitRequired;
                                            self.newTaskObject.moduleType = thisItem.childTask.moduleType;
                                            self.newTaskObject.type = thisItem.childTask.type;
                                            self.newTaskObject.allowed = thisItem.allowed;

                                            if (thisItem.allowed) {
                                                self.newTdObject.selectedTask.push(thisItem.childTask.id);
                                            } else {
                                                self.newTdObject.nonSelectedTask.push(thisItem.childTask.id);
                                            }

                                            self.newTdObject.fullResourceTaskList.push(thisItem.childTask.id);
                                            self.newResourceObject.childTasks.push(self.newTaskObject);
                                            self.newResourceObject.name = thisChildTaskItem.name;
                                        });

                                        self.newTdObject.resourceListTD.push(self.newResourceObject);
                                    });

                                    self.newTdObject.accountType = item.accountType;
                                    self.newTdObject.accountNumber.value = item.accountNumber.value;
                                    self.newTdObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newTdObject.currencyCode = item.currencyCode;
                                    self.newTdObject.accountStatus = item.accountStatus;
                                    self.newTdObject.displayName = item.displayName;
                                    self.resourceListTD([self.newTdObject.resourceListTD]);
                                    self.fulltdAccountList().push(self.newTdObject);
                                });

                                self.fullPartiesTDAccountList().push(self.fulltdAccountList());
                            }

                            if (loanPayload) {
                                ko.utils.arrayForEach(loanPayload, function(item) {
                                    self.newLoanObject = {
                                        accountType: "",
                                        accountNumber: {
                                            value: "",
                                            displayValue: ""
                                        },
                                        displayName: "",
                                        accountStatus: "",
                                        resourceListLON: [],
                                        selectedTask: [],
                                        nonSelectedTask: [],
                                        currencyCode: "",
                                        fullResourceTaskList: []
                                    };

                                    ko.utils.arrayForEach(item.tasks, function(thisChildTaskItem) {
                                        self.newResourceObject = {
                                            childTasks: [],
                                            name: ""
                                        };

                                        ko.utils.arrayForEach(thisChildTaskItem.childTasks, function(thisItem) {
                                            self.newTaskObject = {
                                                id: "",
                                                name: "",
                                                supportedAccountTypes: [],
                                                approvalSupported: "",
                                                limitRequired: "",
                                                moduleType: "",
                                                type: "",
                                                allowed: ""
                                            };

                                            self.newTaskObject.id = thisItem.childTask.id;
                                            self.newTaskObject.name = thisItem.childTask.name;
                                            self.newTaskObject.supportedAccountTypes = thisItem.childTask.supportedAccountTypes;
                                            self.newTaskObject.approvalSupported = thisItem.childTask.approvalSupported;
                                            self.newTaskObject.limitRequired = thisItem.childTask.limitRequired;
                                            self.newTaskObject.moduleType = thisItem.childTask.moduleType;
                                            self.newTaskObject.type = thisItem.childTask.type;
                                            self.newTaskObject.allowed = thisItem.allowed;

                                            if (thisItem.allowed) {
                                                self.newLoanObject.selectedTask.push(thisItem.childTask.id);
                                            } else {
                                                self.newLoanObject.nonSelectedTask.push(thisItem.childTask.id);
                                            }

                                            self.newLoanObject.fullResourceTaskList.push(thisItem.childTask.id);
                                            self.newResourceObject.childTasks.push(self.newTaskObject);
                                            self.newResourceObject.name = thisChildTaskItem.name;
                                        });

                                        self.newLoanObject.resourceListLON.push(self.newResourceObject);
                                    });

                                    self.newLoanObject.accountType = item.accountType;
                                    self.newLoanObject.accountNumber.value = item.accountNumber.value;
                                    self.newLoanObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newLoanObject.currencyCode = item.currencyCode;
                                    self.newLoanObject.accountStatus = item.accountStatus;
                                    self.newLoanObject.displayName = item.displayName;
                                    self.resourceListLON([self.newLoanObject.resourceListLON]);
                                    self.fullloanAccountList().push(self.newLoanObject);
                                });

                                self.fullPartiesLoanAccountList().push(self.fullloanAccountList());
                            }

                            if (lmPayload) {
                                ko.utils.arrayForEach(lmPayload, function(item) {
                                    self.newLMObject = {
                                        accountType: "",
                                        accountNumber: {
                                            value: "",
                                            displayValue: ""
                                        },
                                        displayName: "",
                                        accountStatus: "",
                                        resourceListLM: [],
                                        selectedTask: [],
                                        nonSelectedTask: [],
                                        currencyCode: "",
                                        fullResourceTaskList: []
                                    };

                                    ko.utils.arrayForEach(item.tasks, function(thisChildTaskItem) {
                                        self.newResourceObject = {
                                            childTasks: [],
                                            name: ""
                                        };

                                        ko.utils.arrayForEach(thisChildTaskItem.childTasks, function(thisItem) {
                                            self.newTaskObject = {
                                                id: "",
                                                name: "",
                                                supportedAccountTypes: [],
                                                approvalSupported: "",
                                                limitRequired: "",
                                                moduleType: "",
                                                type: "",
                                                allowed: ""
                                            };

                                            self.newTaskObject.id = thisItem.childTask.id;
                                            self.newTaskObject.name = thisItem.childTask.name;
                                            self.newTaskObject.supportedAccountTypes = thisItem.childTask.supportedAccountTypes;
                                            self.newTaskObject.approvalSupported = thisItem.childTask.approvalSupported;
                                            self.newTaskObject.limitRequired = thisItem.childTask.limitRequired;
                                            self.newTaskObject.moduleType = thisItem.childTask.moduleType;
                                            self.newTaskObject.type = thisItem.childTask.type;
                                            self.newTaskObject.allowed = thisItem.allowed;

                                            if (thisItem.allowed) {
                                                self.newLMObject.selectedTask.push(thisItem.childTask.id);
                                            } else {
                                                self.newLMObject.nonSelectedTask.push(thisItem.childTask.id);
                                            }

                                            self.newLMObject.fullResourceTaskList.push(thisItem.childTask.id);
                                            self.newResourceObject.childTasks.push(self.newTaskObject);
                                            self.newResourceObject.name = thisChildTaskItem.name;
                                        });

                                        self.newLMObject.resourceListLM.push(self.newResourceObject);
                                    });

                                    self.newLMObject.accountType = item.accountType;
                                    self.newLMObject.accountNumber.value = item.accountNumber.value;
                                    self.newLMObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newLMObject.currencyCode = item.currencyCode;
                                    self.newLMObject.accountStatus = item.accountStatus;
                                    self.newLMObject.displayName = item.displayName;
                                    self.resourceListLM([self.newLMObject.resourceListLM]);
                                    self.fullLMAccountList().push(self.newLMObject);
                                });

                                self.fullPartiesLMAccountList().push(self.fullLMAccountList());
                            }

                            if (verPayload) {
                                ko.utils.arrayForEach(verPayload, function(item) {
                                    self.newVERObject = {
                                        accountType: "",
                                        accountNumber: {
                                            value: "",
                                            displayValue: ""
                                        },
                                        displayName: "",
                                        accountStatus: "",
                                        resourceListVER: [],
                                        selectedTask: [],
                                        nonSelectedTask: [],
                                        currencyCode: "",
                                        fullResourceTaskList: []
                                    };

                                    ko.utils.arrayForEach(item.tasks, function(thisChildTaskItem) {
                                        self.newResourceObject = {
                                            childTasks: [],
                                            name: ""
                                        };

                                        ko.utils.arrayForEach(thisChildTaskItem.childTasks, function(thisItem) {
                                            self.newTaskObject = {
                                                id: "",
                                                name: "",
                                                supportedAccountTypes: [],
                                                approvalSupported: "",
                                                limitRequired: "",
                                                moduleType: "",
                                                type: "",
                                                allowed: ""
                                            };

                                            self.newTaskObject.id = thisItem.childTask.id;
                                            self.newTaskObject.name = thisItem.childTask.name;
                                            self.newTaskObject.supportedAccountTypes = thisItem.childTask.supportedAccountTypes;
                                            self.newTaskObject.approvalSupported = thisItem.childTask.approvalSupported;
                                            self.newTaskObject.limitRequired = thisItem.childTask.limitRequired;
                                            self.newTaskObject.moduleType = thisItem.childTask.moduleType;
                                            self.newTaskObject.type = thisItem.childTask.type;
                                            self.newTaskObject.allowed = thisItem.allowed;

                                            if (thisItem.allowed) {
                                                self.newVERObject.selectedTask.push(thisItem.childTask.id);
                                            } else {
                                                self.newVERObject.nonSelectedTask.push(thisItem.childTask.id);
                                            }

                                            self.newVERObject.fullResourceTaskList.push(thisItem.childTask.id);
                                            self.newResourceObject.childTasks.push(self.newTaskObject);
                                            self.newResourceObject.name = thisChildTaskItem.name;
                                        });

                                        self.newVERObject.resourceListVER.push(self.newResourceObject);
                                    });

                                    self.newVERObject.accountType = item.accountType;
                                    self.newVERObject.accountNumber.value = item.accountNumber.value;
                                    self.newVERObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newVERObject.currencyCode = item.currencyCode;
                                    self.newVERObject.accountStatus = item.accountStatus;
                                    self.newVERObject.displayName = item.displayName;
                                    self.resourceListVER([self.newVERObject.resourceListVER]);
                                    self.fullVAMEnabledRealAccountList().push(self.newVERObject);
                                });

                                self.fullPartiesVAMRealAccountList().push(self.fullVAMEnabledRealAccountList());
                            }

                            if (vraPayload) {
                                ko.utils.arrayForEach(vraPayload, function(item) {
                                    self.newVRAObject = {
                                        accountType: "",
                                        accountNumber: {
                                            value: "",
                                            displayValue: ""
                                        },
                                        displayName: "",
                                        accountStatus: "",
                                        resourceListVRA: [],
                                        selectedTask: [],
                                        nonSelectedTask: [],
                                        currencyCode: "",
                                        fullResourceTaskList: []
                                    };

                                    ko.utils.arrayForEach(item.tasks, function(thisChildTaskItem) {
                                        self.newResourceObject = {
                                            childTasks: [],
                                            name: ""
                                        };

                                        ko.utils.arrayForEach(thisChildTaskItem.childTasks, function(thisItem) {
                                            self.newTaskObject = {
                                                id: "",
                                                name: "",
                                                supportedAccountTypes: [],
                                                approvalSupported: "",
                                                limitRequired: "",
                                                moduleType: "",
                                                type: "",
                                                allowed: ""
                                            };

                                            self.newTaskObject.id = thisItem.childTask.id;
                                            self.newTaskObject.name = thisItem.childTask.name;
                                            self.newTaskObject.supportedAccountTypes = thisItem.childTask.supportedAccountTypes;
                                            self.newTaskObject.approvalSupported = thisItem.childTask.approvalSupported;
                                            self.newTaskObject.limitRequired = thisItem.childTask.limitRequired;
                                            self.newTaskObject.moduleType = thisItem.childTask.moduleType;
                                            self.newTaskObject.type = thisItem.childTask.type;
                                            self.newTaskObject.allowed = thisItem.allowed;

                                            if (thisItem.allowed) {
                                                self.newVRAObject.selectedTask.push(thisItem.childTask.id);
                                            } else {
                                                self.newVRAObject.nonSelectedTask.push(thisItem.childTask.id);
                                            }

                                            self.newVRAObject.fullResourceTaskList.push(thisItem.childTask.id);
                                            self.newResourceObject.childTasks.push(self.newTaskObject);
                                            self.newResourceObject.name = thisChildTaskItem.name;
                                        });

                                        self.newVRAObject.resourceListVRA.push(self.newResourceObject);
                                    });

                                    self.newVRAObject.accountType = item.accountType;
                                    self.newVRAObject.accountNumber.value = item.accountNumber.value;
                                    self.newVRAObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newVRAObject.currencyCode = item.currencyCode;
                                    self.newVRAObject.accountStatus = item.accountStatus;
                                    self.newVRAObject.displayName = item.displayName;
                                    self.resourceListVRA([self.newVRAObject.resourceListVRA]);
                                    self.fullVirtualAccountList().push(self.newVRAObject);
                                });

                                self.fullPartiesVirtualAccountList().push(self.fullVirtualAccountList());
                            }

                        } else {
                            self.fullPartiesCasaAccountList().push(self.fullCasaAccountList());
                            self.fullPartiesLoanAccountList().push(self.fullloanAccountList());
                            self.fullPartiesTDAccountList().push(self.fulltdAccountList());
                            self.fullPartiesLMAccountList().push(self.fullLMAccountList());
                            self.fullPartiesVAMRealAccountList().push(self.fullVAMEnabledRealAccountList());
                            self.fullPartiesVirtualAccountList().push(self.fullVirtualAccountList());
                        }

                        if (self.rootParams && self.rootParams.partyAccountAccessDTOs) {
                            if (partyItem.party.value === self.partyID()) {
                                self.fullCasaAccountListReview(self.fullCasaAccountList());
                                self.fullloanAccountListReview(self.fullloanAccountList());
                                self.fulltdAccountListReview(self.fulltdAccountList());
                                self.fullLMAccountListReview(self.fullLMAccountList());
                                self.fullVERAccountListReview(self.fullVAMEnabledRealAccountList());
                                self.fullVRAAccountListReview(self.fullVirtualAccountList());
                            }

                            self.populateSelectedAccounts();
                        } else {
                            self.createDataSource();
                        }
                    });
                }
            });
        };

        self.getAllAccountsCount();

        self.createTDDatasource = function(dataDTO) {
            self.accountExclusionTDAccountNumberItem = ko.observable([]);
            self.filteredTDTask = ko.observableArray([]);
            self.tdAcessStatus = ko.observable(dataDTO.accessStatus());

            ko.utils.arrayForEach(dataDTO.accountExclusionDTOs(), function(accountExclusionItem) {
                self.accountExclusionTDAccountNumberItem().push(accountExclusionItem.accountNumber.value());
            });

            ko.utils.arrayForEach(self.fulltdAccountListReview(), function(item) {
                self.tdTransactionMappedObject = {
                    accountNumber: {
                        value: "",
                        displayValue: ""
                    },
                    displayName: "",
                    accountStatus: "",
                    currencyCode: "",
                    selectedTask: [],
                    accountType: "",
                    nonSelectedTask: [],
                    resourceListTD: []
                };

                self.tdTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
                self.tdTransactionMappedObject.accountNumber.value = item.accountNumber.value;
                self.tdTransactionMappedObject.accountStatus = item.accountStatus;
                self.tdTransactionMappedObject.displayName = item.displayName;
                self.tdTransactionMappedObject.accountType = item.accountType;
                self.tdTransactionMappedObject.currencyCode = item.currencyCode;
                self.tdTransactionMappedObject.resourceListTD = item.resourceListTD;

                if (self.accountExclusionTDAccountNumberItem().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < dataDTO.accountExclusionDTOs().length; i++) {
                        self.filteredTDTask([]);

                        const exclusionItem = dataDTO.accountExclusionDTOs()[i];

                        for (let j = 0; j < item.fullResourceTaskList.length; j++) {
                            if (exclusionItem.accountNumber.value() === item.accountNumber.value) {
                                if (self.tdAcessStatus()) {
                                    if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) === -1) {
                                        self.filteredTDTask().push(item.fullResourceTaskList[j]);
                                        self.tdTransactionMappedObject.nonSelectedTask = exclusionItem.taskIds();
                                        self.tdTransactionMappedObject.selectedTask = self.filteredTDTask();
                                    }
                                } else if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) !== -1) {
                                    self.filteredTDTask().push(item.fullResourceTaskList[j]);
                                    self.tdTransactionMappedObject.nonSelectedTask = [];
                                    self.tdTransactionMappedObject.selectedTask = exclusionItem.taskIds();
                                }
                            }
                        }
                    }
                } else if (self.tdAcessStatus()) {
                    self.tdTransactionMappedObject.nonSelectedTask = [];
                    self.tdTransactionMappedObject.selectedTask = item.fullResourceTaskList;
                } else {
                    self.tdTransactionMappedObject.nonSelectedTask = [];
                    self.tdTransactionMappedObject.selectedTask = [];
                }

                if (!(self.selectedAccountsResources().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.tdTransactionMappedObject);
                }
            });
        };

        self.createCASADatasource = function(dataDTO) {
            self.accountExclusionCasaAccountNumberItem = ko.observable([]);
            self.filteredCasaTask = ko.observableArray([]);
            self.casaAcessStatus = ko.observable(dataDTO.accessStatus());

            ko.utils.arrayForEach(dataDTO.accountExclusionDTOs(), function(accountExclusionItem) {
                self.accountExclusionCasaAccountNumberItem().push(accountExclusionItem.accountNumber.value());
            });

            ko.utils.arrayForEach(self.fullCasaAccountListReview(), function(item) {
                self.casaTransactionMappedObject = {
                    accountNumber: {
                        value: "",
                        displayValue: ""
                    },
                    displayName: "",
                    accountStatus: "",
                    currencyCode: "",
                    selectedTask: [],
                    accountType: "",
                    nonSelectedTask: [],
                    resourceListCasa: []
                };

                self.casaTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
                self.casaTransactionMappedObject.accountStatus = item.accountStatus;
                self.casaTransactionMappedObject.displayName = item.displayName;
                self.casaTransactionMappedObject.accountNumber.value = item.accountNumber.value;
                self.casaTransactionMappedObject.accountType = item.accountType;
                self.casaTransactionMappedObject.currencyCode = item.currencyCode;
                self.casaTransactionMappedObject.resourceListCasa = item.resourceListCasa;

                if (self.accountExclusionCasaAccountNumberItem().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < dataDTO.accountExclusionDTOs().length; i++) {
                        self.filteredCasaTask([]);

                        const exclusionItem = dataDTO.accountExclusionDTOs()[i];

                        for (let j = 0; j < item.fullResourceTaskList.length; j++) {
                            if (exclusionItem.accountNumber.value() === item.accountNumber.value) {
                                if (self.casaAcessStatus()) {
                                    if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) === -1) {
                                        self.filteredCasaTask().push(item.fullResourceTaskList[j]);
                                        self.casaTransactionMappedObject.nonSelectedTask = exclusionItem.taskIds();
                                        self.casaTransactionMappedObject.selectedTask = self.filteredCasaTask();
                                    }
                                } else if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) !== -1) {
                                    self.filteredCasaTask().push(item.fullResourceTaskList[j]);
                                    self.casaTransactionMappedObject.nonSelectedTask = [];
                                    self.casaTransactionMappedObject.selectedTask = exclusionItem.taskIds();
                                }
                            }
                        }
                    }
                } else if (self.casaAcessStatus()) {
                    self.casaTransactionMappedObject.nonSelectedTask = [];
                    self.casaTransactionMappedObject.selectedTask = item.fullResourceTaskList;
                } else {
                    self.casaTransactionMappedObject.nonSelectedTask = [];
                    self.casaTransactionMappedObject.selectedTask = [];
                }

                if (!(self.selectedAccountsResources().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.casaTransactionMappedObject);
                }
            });
        };

        self.createLONDataSource = function(dataDTO) {
            self.loanAcessStatus = ko.observable(dataDTO.accessStatus());
            self.filteredLoanTask = ko.observableArray([]);
            self.accountExclusionLONAccountNumberItem = ko.observable([]);

            ko.utils.arrayForEach(dataDTO.accountExclusionDTOs(), function(accountExclusionItem) {
                self.accountExclusionLONAccountNumberItem().push(accountExclusionItem.accountNumber.value());
            });

            ko.utils.arrayForEach(self.fullloanAccountListReview(), function(item) {
                self.loanTransactionMappedObject = {
                    accountNumber: {
                        value: "",
                        displayValue: ""
                    },
                    displayName: "",
                    accountStatus: "",
                    currencyCode: "",
                    selectedTask: [],
                    accountType: "",
                    nonSelectedTask: [],
                    resourceListLON: []
                };

                self.loanTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
                self.loanTransactionMappedObject.accountNumber.value = item.accountNumber.value;
                self.loanTransactionMappedObject.accountStatus = item.accountStatus;
                self.loanTransactionMappedObject.displayName = item.displayName;
                self.loanTransactionMappedObject.accountType = item.accountType;
                self.loanTransactionMappedObject.currencyCode = item.currencyCode;
                self.loanTransactionMappedObject.resourceListLON = item.resourceListLON;

                if (self.accountExclusionLONAccountNumberItem().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < dataDTO.accountExclusionDTOs().length; i++) {
                        self.filteredLoanTask([]);

                        const exclusionItem = dataDTO.accountExclusionDTOs()[i];

                        for (let j = 0; j < item.fullResourceTaskList.length; j++) {
                            if (exclusionItem.accountNumber.value() === item.accountNumber.value) {
                                if (self.loanAcessStatus()) {
                                    if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) === -1) {
                                        self.filteredLoanTask().push(item.fullResourceTaskList[j]);
                                        self.loanTransactionMappedObject.nonSelectedTask = exclusionItem.taskIds();
                                        self.loanTransactionMappedObject.selectedTask = self.filteredLoanTask();
                                    }
                                } else if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) !== -1) {
                                    self.filteredLoanTask().push(item.fullResourceTaskList[j]);
                                    self.loanTransactionMappedObject.nonSelectedTask = [];
                                    self.loanTransactionMappedObject.selectedTask = exclusionItem.taskIds();
                                }
                            }
                        }
                    }
                } else if (self.loanAcessStatus()) {
                    self.loanTransactionMappedObject.nonSelectedTask = [];
                    self.loanTransactionMappedObject.selectedTask = item.fullResourceTaskList;
                } else {
                    self.loanTransactionMappedObject.nonSelectedTask = [];
                    self.loanTransactionMappedObject.selectedTask = [];
                }

                if (!(self.selectedAccountsResources().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.loanTransactionMappedObject);
                }
            });
        };

        self.createLMDataSource = function(dataDTO) {
            self.accountExclusionLMAccountNumberItem = ko.observable([]);
            self.filteredLMTask = ko.observableArray([]);
            self.lmAcessStatus = ko.observable(dataDTO.accessStatus());

            ko.utils.arrayForEach(dataDTO.accountExclusionDTOs(), function(accountExclusionItem) {
                self.accountExclusionLMAccountNumberItem().push(accountExclusionItem.accountNumber.value());
            });

            ko.utils.arrayForEach(self.fullLMAccountListReview(), function(item) {
                self.lmTransactionMappedObject = {
                    accountNumber: {
                        value: "",
                        displayValue: ""
                    },
                    displayName: "",
                    accountStatus: "",
                    currencyCode: "",
                    selectedTask: [],
                    accountType: "",
                    nonSelectedTask: [],
                    resourceListLM: []
                };

                self.lmTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
                self.lmTransactionMappedObject.accountNumber.value = item.accountNumber.value;
                self.lmTransactionMappedObject.accountStatus = item.accountStatus;
                self.lmTransactionMappedObject.displayName = item.displayName;
                self.lmTransactionMappedObject.accountType = item.accountType;
                self.lmTransactionMappedObject.currencyCode = item.currencyCode;
                self.lmTransactionMappedObject.resourceListTD = item.resourceListLM;

                if (self.accountExclusionLMAccountNumberItem().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < dataDTO.accountExclusionDTOs().length; i++) {
                        self.filteredTDTask([]);

                        const exclusionItem = dataDTO.accountExclusionDTOs()[i];

                        for (let j = 0; j < item.fullResourceTaskList.length; j++) {
                            if (exclusionItem.accountNumber.value() === item.accountNumber.value) {
                                if (self.lmAcessStatus()) {
                                    if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) === -1) {
                                        self.filteredLMTask().push(item.fullResourceTaskList[j]);
                                        self.lmTransactionMappedObject.nonSelectedTask = exclusionItem.taskIds();
                                        self.lmTransactionMappedObject.selectedTask = self.filteredLMTask();
                                    }
                                } else if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) !== -1) {
                                    self.filteredLMTask().push(item.fullResourceTaskList[j]);
                                    self.lmTransactionMappedObject.nonSelectedTask = [];
                                    self.lmTransactionMappedObject.selectedTask = exclusionItem.taskIds();
                                }
                            }
                        }
                    }
                } else if (self.lmAcessStatus()) {
                    self.lmTransactionMappedObject.nonSelectedTask = [];
                    self.lmTransactionMappedObject.selectedTask = item.fullResourceTaskList;
                } else {
                    self.lmTransactionMappedObject.nonSelectedTask = [];
                    self.lmTransactionMappedObject.selectedTask = [];
                }

                if (!(self.selectedAccountsResources().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.lmTransactionMappedObject);
                }
            });
        };

        self.createVERDatasource = function(dataDTO) {
            self.accountExclusionVERAccountNumberItem = ko.observable([]);
            self.filteredVERTask = ko.observableArray([]);
            self.verAcessStatus = ko.observable(dataDTO.accessStatus());

            ko.utils.arrayForEach(dataDTO.accountExclusionDTOs(), function(accountExclusionItem) {
                self.accountExclusionVERAccountNumberItem().push(accountExclusionItem.accountNumber.value());
            });

            ko.utils.arrayForEach(self.fullVERAccountListReview(), function(item) {
                self.verTransactionMappedObject = {
                    accountNumber: {
                        value: "",
                        displayValue: ""
                    },
                    displayName: "",
                    accountStatus: "",
                    currencyCode: "",
                    selectedTask: [],
                    accountType: "",
                    nonSelectedTask: [],
                    resourceListVER: []
                };

                self.verTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
                self.verTransactionMappedObject.accountNumber.value = item.accountNumber.value;
                self.verTransactionMappedObject.accountStatus = item.accountStatus;
                self.verTransactionMappedObject.displayName = item.displayName;
                self.verTransactionMappedObject.accountType = item.accountType;
                self.verTransactionMappedObject.currencyCode = item.currencyCode;
                self.verTransactionMappedObject.resourceListVER = item.resourceListVER;

                if (self.accountExclusionVERAccountNumberItem().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < dataDTO.accountExclusionDTOs().length; i++) {
                        self.filteredVERTask([]);

                        const exclusionItem = dataDTO.accountExclusionDTOs()[i];

                        for (let j = 0; j < item.fullResourceTaskList.length; j++) {
                            if (exclusionItem.accountNumber.value() === item.accountNumber.value) {
                                if (self.verAcessStatus()) {
                                    if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) === -1) {
                                        self.filteredVERTask().push(item.fullResourceTaskList[j]);
                                        self.verTransactionMappedObject.nonSelectedTask = exclusionItem.taskIds();
                                        self.verTransactionMappedObject.selectedTask = self.filteredVERTask();
                                    }
                                } else if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) !== -1) {
                                    self.filteredVERTask().push(item.fullResourceTaskList[j]);
                                    self.verTransactionMappedObject.nonSelectedTask = [];
                                    self.verTransactionMappedObject.selectedTask = exclusionItem.taskIds();
                                }
                            }
                        }
                    }
                } else if (self.verAcessStatus()) {
                    self.verTransactionMappedObject.nonSelectedTask = [];
                    self.verTransactionMappedObject.selectedTask = item.fullResourceTaskList;
                } else {
                    self.verTransactionMappedObject.nonSelectedTask = [];
                    self.verTransactionMappedObject.selectedTask = [];
                }

                if (!(self.selectedAccountsResources().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.verTransactionMappedObject);
                }
            });
        };

        self.createVRADatasource = function(dataDTO) {
            self.accountExclusionVRAAccountNumberItem = ko.observable([]);
            self.filteredVRATask = ko.observableArray([]);
            self.vraAcessStatus = ko.observable(dataDTO.accessStatus());

            ko.utils.arrayForEach(dataDTO.accountExclusionDTOs(), function(accountExclusionItem) {
                self.accountExclusionVRAAccountNumberItem().push(accountExclusionItem.accountNumber.value());
            });

            ko.utils.arrayForEach(self.fullVRAAccountListReview(), function(item) {
                self.vraTransactionMappedObject = {
                    accountNumber: {
                        value: "",
                        displayValue: ""
                    },
                    displayName: "",
                    accountStatus: "",
                    currencyCode: "",
                    selectedTask: [],
                    accountType: "",
                    nonSelectedTask: [],
                    resourceListVRA: []
                };

                self.vraTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
                self.vraTransactionMappedObject.accountNumber.value = item.accountNumber.value;
                self.vraTransactionMappedObject.accountStatus = item.accountStatus;
                self.vraTransactionMappedObject.displayName = item.displayName;
                self.vraTransactionMappedObject.accountType = item.accountType;
                self.vraTransactionMappedObject.currencyCode = item.currencyCode;
                self.vraTransactionMappedObject.resourceListVRA = item.resourceListVRA;

                if (self.accountExclusionVRAAccountNumberItem().indexOf(item.accountNumber.value) > -1) {
                    for (let i = 0; i < dataDTO.accountExclusionDTOs().length; i++) {
                        self.filteredVRATask([]);

                        const exclusionItem = dataDTO.accountExclusionDTOs()[i];

                        for (let j = 0; j < item.fullResourceTaskList.length; j++) {
                            if (exclusionItem.accountNumber.value() === item.accountNumber.value) {
                                if (self.vraAcessStatus()) {
                                    if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) === -1) {
                                        self.filteredVRATask().push(item.fullResourceTaskList[j]);
                                        self.vraTransactionMappedObject.nonSelectedTask = exclusionItem.taskIds();
                                        self.vraTransactionMappedObject.selectedTask = self.filteredVRATask();
                                    }
                                } else if (exclusionItem.taskIds().indexOf(item.fullResourceTaskList[j]) !== -1) {
                                    self.filteredVRATask().push(item.fullResourceTaskList[j]);
                                    self.vraTransactionMappedObject.nonSelectedTask = [];
                                    self.vraTransactionMappedObject.selectedTask = exclusionItem.taskIds();
                                }
                            }
                        }
                    }
                } else if (self.vraAcessStatus()) {
                    self.vraTransactionMappedObject.nonSelectedTask = [];
                    self.vraTransactionMappedObject.selectedTask = item.fullResourceTaskList;
                } else {
                    self.vraTransactionMappedObject.nonSelectedTask = [];
                    self.vraTransactionMappedObject.selectedTask = [];
                }

                if (!(self.selectedAccountsResources().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.vraTransactionMappedObject);
                }
            });
        };

        self.createBaseForDataSource = function(responseDTOs) {
            for (let x = 0; x < responseDTOs.length; x++) {
                if (responseDTOs[x].accountType() === "CSA") {
                    self.createCASADatasource(responseDTOs[x]);
                }

                if (responseDTOs[x].accountType() === "TRD") {
                    self.createTDDatasource(responseDTOs[x]);
                }

                if (responseDTOs[x].accountType() === "LON") {
                    self.createLONDataSource(responseDTOs[x]);
                }

                if (responseDTOs[x].accountType() === "LER") {
                    self.createLMDataSource(responseDTOs[x]);
                }

                if (responseDTOs[x].accountType() === "VER") {
                    self.createVERDatasource(responseDTOs[x]);
                }

                if (responseDTOs[x].accountType() === "VRA") {
                    self.createVRADatasource(responseDTOs[x]);
                }

                self.createDataSource();
            }
        };

        self.createDataSource = function() {
            ko.utils.arrayForEach(self.selectedAccountsResources(), function(item) {
                if (item.accountType === "CSA") {
                    self.reviewCasaList().push(item);
                } else if (item.accountType === "TRD") {
                    self.reviewTDList().push(item);
                } else if (item.accountType === "LON") {
                    self.reviewLoanList().push(item);
                } else if (item.accountType === "LER") {
                    self.reviewLMList().push(item);
                } else if (item.accountType === "VER") {
                    self.reviewVERList().push(item);
                } else if (item.accountType === "VRA") {
                    self.reviewVRAList().push(item);
                }
            });

            for (let i = 0; i < self.selectedCasaAccounts().length; i++) {
                ko.utils.arrayForEach(self.reviewCasaList(), function(item) {
                    if (item.accountNumber.value === self.selectedCasaAccounts()[i]) {
                        if (!(self.fullCasaAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedCasaAccounts()[i];
                            }).length > 0)) {
                            self.fullCasaAccountListSorted().push(item);
                        }
                    }
                });
            }

            self.fullCasaAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            ko.utils.arrayForEach(self.reviewCasaList(), function(item) {
                if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                    self.fullCasaAccountListSorted().push(item);
                }
            });

            self.reviewCasaList([]);

            ko.utils.arrayForEach(self.fullCasaAccountListSorted(), function(item) {
                if (!(self.reviewCasaList().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.reviewCasaList().push(item);
                }
            });

            for (let j = 0; j < self.selectedTdAccounts().length; j++) {
                ko.utils.arrayForEach(self.reviewTDList(), function(item) {
                    if (item.accountNumber.value === self.selectedTdAccounts()[j]) {
                        if (!(self.fulltdAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedTdAccounts()[j];
                            }).length > 0)) {
                            self.fulltdAccountListSorted().push(item);
                        }
                    }
                });
            }

            self.fulltdAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            ko.utils.arrayForEach(self.reviewTDList(), function(item) {
                if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                    self.fulltdAccountListSorted().push(item);
                }
            });

            self.reviewTDList([]);

            ko.utils.arrayForEach(self.fulltdAccountListSorted(), function(item) {
                if (!(self.reviewTDList().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.reviewTDList().push(item);
                }
            });

            for (let k = 0; k < self.selectedLoanAccounts().length; k++) {
                ko.utils.arrayForEach(self.reviewLoanList(), function(item) {
                    if (item.accountNumber.value === self.selectedLoanAccounts()[k]) {
                        if (!(self.fullloanAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedLoanAccounts()[k];
                            }).length > 0)) {
                            self.fullloanAccountListSorted().push(item);
                        }
                    }
                });
            }

            self.fullloanAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            ko.utils.arrayForEach(self.reviewLoanList(), function(item) {
                if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                    self.fullloanAccountListSorted().push(item);
                }
            });

            self.reviewLoanList([]);

            ko.utils.arrayForEach(self.fullloanAccountListSorted(), function(item) {
                if (!(self.reviewLoanList().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.reviewLoanList().push(item);
                }
            });

            for (let i = 0; i < self.selectedLMAccounts().length; i++) {
                ko.utils.arrayForEach(self.reviewLMList(), function(item) {
                    if (item.accountNumber.value === self.selectedLMAccounts()[i]) {
                        if (!(self.fullLMAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedLMAccounts()[i];
                            }).length > 0)) {
                            self.fullLMAccountListSorted().push(item);
                        }
                    }
                });
            }

            self.fullLMAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            ko.utils.arrayForEach(self.reviewLMList(), function(item) {
                if (self.selectedLMAccounts().indexOf(item.accountNumber.value) === -1) {
                    self.fullLMAccountListSorted().push(item);
                }
            });

            self.reviewLMList([]);

            ko.utils.arrayForEach(self.fullLMAccountListSorted(), function(item) {
                if (!(self.reviewLMList().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.reviewLMList().push(item);
                }
            });

            for (let k = 0; k < self.selectedVAMEnabledRealAccounts().length; k++) {
                ko.utils.arrayForEach(self.reviewVERList(), function(item) {
                    if (item.accountNumber.value === self.selectedVAMEnabledRealAccounts()[k]) {
                        if (!(self.fullVAMEnabledRealAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedVAMEnabledRealAccounts()[k];
                            }).length > 0)) {
                            self.fullVAMEnabledRealAccountListSorted().push(item);
                        }
                    }
                });
            }

            self.fullVAMEnabledRealAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            ko.utils.arrayForEach(self.reviewVERList(), function(item) {
                if (self.selectedVAMEnabledRealAccounts().indexOf(item.accountNumber.value) === -1) {
                    self.fullVAMEnabledRealAccountListSorted().push(item);
                }
            });

            self.reviewVERList([]);

            ko.utils.arrayForEach(self.fullVAMEnabledRealAccountListSorted(), function(item) {
                if (!(self.reviewVERList().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.reviewVERList().push(item);
                }
            });

            for (let k = 0; k < self.selectedVirtualAccounts().length; k++) {
                ko.utils.arrayForEach(self.reviewVRAList(), function(item) {
                    if (item.accountNumber.value === self.selectedVirtualAccounts()[k]) {
                        if (!(self.fullVirtualAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedVirtualAccounts()[k];
                            }).length > 0)) {
                            self.fullVirtualAccountListSorted().push(item);
                        }
                    }
                });
            }

            self.fullVirtualAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            ko.utils.arrayForEach(self.reviewVRAList(), function(item) {
                if (self.selectedVirtualAccounts().indexOf(item.accountNumber.value) === -1) {
                    self.fullVirtualAccountListSorted().push(item);
                }
            });

            self.reviewVRAList([]);

            ko.utils.arrayForEach(self.fullVirtualAccountListSorted(), function(item) {
                if (!(self.reviewVRAList().filter(function(e) {
                        return e.accountNumber.value === item.accountNumber.value;
                    }).length > 0)) {
                    self.reviewVRAList().push(item);
                }
            });

            if (self.showReviewScreen() === true) {
                self.casaReviewData = $.map(ko.utils.unwrapObservable(self.reviewCasaList()), function(val) {
                    val.attr = {
                        accountNumber: {
                            displayValue: val.accountNumber.displayValue,
                            value: val.accountNumber.value
                        },
                        accountStatus: val.accountStatus ? val.accountStatus : "-",
                        displayName: val.displayName ? val.displayName : "-",
                        accountID: val.accountNumber.value,
                        accountType: val.accountType,
                        mappingPolicy: val.allowed,
                        currency: val.currencyCode ? val.currencyCode : "-"
                    };

                    val.children = [{
                        attr: {
                            accountNumber: {
                                displayValue: val.accountNumber.displayValue,
                                value: val.accountNumber.value
                            },
                            accountStatus: val.accountStatus ? val.accountStatus : "-",
                            displayName: val.displayName ? val.displayName : "-",
                            selectedTask: val.selectedTask,
                            nonSelectedTask: val.nonSelectedTask,
                            accountType: val.accountType,
                            resoureTaskList: val.resourceListCasa
                        }
                    }];

                    return val;
                });

                self.casaReviewDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.casaReviewData), options));
                self.reloadCasaTable(true);

                self.tdData = $.map(ko.utils.unwrapObservable(self.reviewTDList()), function(val) {
                    val.attr = {
                        accountNumber: {
                            displayValue: val.accountNumber.displayValue,
                            value: val.accountNumber.value
                        },
                        accountStatus: val.accountStatus ? val.accountStatus : "-",
                        displayName: val.displayName ? val.displayName : "-",
                        accountID: val.accountNumber.value,
                        accountType: val.accountType,
                        mappingPolicy: val.allowed,
                        currency: val.currencyCode ? val.currencyCode : "-"
                    };

                    val.children = [{
                        attr: {
                            accountNumber: {
                                displayValue: val.accountNumber.displayValue,
                                value: val.accountNumber.value
                            },
                            accountStatus: val.accountStatus ? val.accountStatus : "-",
                            displayName: val.displayName ? val.displayName : "-",
                            selectedTask: val.selectedTask,
                            nonSelectedTask: val.nonSelectedTask,
                            accountType: val.accountType,
                            resoureTaskList: val.resourceListTD
                        }
                    }];

                    return val;
                });

                self.tdTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.tdData), options));
                self.reloadTDTable(true);

                self.loanData = $.map(ko.utils.unwrapObservable(self.reviewLoanList()), function(val) {
                    val.attr = {
                        accountNumber: {
                            displayValue: val.accountNumber.displayValue,
                            value: val.accountNumber.value
                        },
                        accountStatus: val.accountStatus ? val.accountStatus : "-",
                        displayName: val.displayName ? val.displayName : "-",
                        accountID: val.accountNumber.value,
                        accountType: val.accountType,
                        mappingPolicy: val.allowed,
                        currency: val.currencyCode ? val.currencyCode : "-"
                    };

                    val.children = [{
                        attr: {
                            accountNumber: {
                                displayValue: val.accountNumber.displayValue,
                                value: val.accountNumber.value
                            },
                            accountStatus: val.accountStatus ? val.accountStatus : "-",
                            displayName: val.displayName ? val.displayName : "-",
                            selectedTask: val.selectedTask,
                            nonSelectedTask: val.nonSelectedTask,
                            accountType: val.accountType,
                            resoureTaskList: val.resourceListLON
                        }
                    }];

                    return val;
                });

                self.loanTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.loanData), options));
                self.reloadLoanTable(true);

                self.lmReviewData = $.map(ko.utils.unwrapObservable(self.reviewLMList()), function(val) {
                    val.attr = {
                        accountNumber: {
                            displayValue: val.accountNumber.displayValue,
                            value: val.accountNumber.value
                        },
                        accountStatus: val.accountStatus ? val.accountStatus : "-",
                        displayName: val.displayName ? val.displayName : "-",
                        accountID: val.accountNumber.value,
                        accountType: val.accountType,
                        mappingPolicy: val.allowed,
                        currency: val.currencyCode ? val.currencyCode : "-"
                    };

                    val.children = [{
                        attr: {
                            accountNumber: {
                                displayValue: val.accountNumber.displayValue,
                                value: val.accountNumber.value
                            },
                            accountStatus: val.accountStatus ? val.accountStatus : "-",
                            displayName: val.displayName ? val.displayName : "-",
                            selectedTask: val.selectedTask,
                            nonSelectedTask: val.nonSelectedTask,
                            accountType: val.accountType,
                            resoureTaskList: val.resourceListLM
                        }
                    }];

                    return val;
                });

                self.lmReviewDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.lmReviewData), options));
                self.reloadLMTable(true);

                self.verReviewData = $.map(ko.utils.unwrapObservable(self.reviewVERList()), function(val) {
                    val.attr = {
                        accountNumber: {
                            displayValue: val.accountNumber.displayValue,
                            value: val.accountNumber.value
                        },
                        accountStatus: val.accountStatus ? val.accountStatus : "-",
                        displayName: val.displayName ? val.displayName : "-",
                        accountID: val.accountNumber.value,
                        accountType: val.accountType,
                        mappingPolicy: val.allowed,
                        currency: val.currencyCode ? val.currencyCode : "-"
                    };

                    val.children = [{
                        attr: {
                            accountNumber: {
                                displayValue: val.accountNumber.displayValue,
                                value: val.accountNumber.value
                            },
                            accountStatus: val.accountStatus ? val.accountStatus : "-",
                            displayName: val.displayName ? val.displayName : "-",
                            selectedTask: val.selectedTask,
                            nonSelectedTask: val.nonSelectedTask,
                            accountType: val.accountType,
                            resoureTaskList: val.resourceListVER
                        }
                    }];

                    return val;
                });

                self.verReviewDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.verReviewData), options));
                self.reloadVERTable(true);

                self.vraReviewData = $.map(ko.utils.unwrapObservable(self.reviewVRAList()), function(val) {
                    val.attr = {
                        accountNumber: {
                            displayValue: val.accountNumber.displayValue,
                            value: val.accountNumber.value
                        },
                        accountStatus: val.accountStatus ? val.accountStatus : "-",
                        displayName: val.displayName ? val.displayName : "-",
                        accountID: val.accountNumber.value,
                        accountType: val.accountType,
                        mappingPolicy: val.allowed,
                        currency: val.currencyCode ? val.currencyCode : "-"
                    };

                    val.children = [{
                        attr: {
                            accountNumber: {
                                displayValue: val.accountNumber.displayValue,
                                value: val.accountNumber.value
                            },
                            accountStatus: val.accountStatus ? val.accountStatus : "-",
                            displayName: val.displayName ? val.displayName : "-",
                            selectedTask: val.selectedTask,
                            nonSelectedTask: val.nonSelectedTask,
                            accountType: val.accountType,
                            resoureTaskList: val.resourceListVRA
                        }
                    }];

                    return val;
                });

                self.vraReviewDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.vraReviewData), options));
                self.reloadVRATable(true);

                self.createTaskCodeArray();
            }
        };

        self.editAccountAccess = function() {
            self.showEditableForm(false);
            self.editBackFromReview(true);
            rootParams.dashboard.hideDetails();
        };

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.createTaskCodeArray = function() {
            ko.utils.arrayForEach(self.selectedCasaAccounts(), function(item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };

                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeArray.push(self.taskCodeObj);
            });

            ko.utils.arrayForEach(self.selectedTdAccounts(), function(item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };

                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeTrdArray.push(self.taskCodeObj);
            });

            ko.utils.arrayForEach(self.selectedLoanAccounts(), function(item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };

                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeLonArray.push(self.taskCodeObj);
            });

            ko.utils.arrayForEach(self.selectedLMAccounts(), function(item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };

                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeArray.push(self.taskCodeObj);
            });

            ko.utils.arrayForEach(self.selectedVAMEnabledRealAccounts(), function(item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };

                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeArray.push(self.taskCodeObj);
            });

            ko.utils.arrayForEach(self.selectedVirtualAccounts(), function(item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };

                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeArray.push(self.taskCodeObj);
            });

            self.casaMapAllTransactionIndicatorArray.subscribe(function(newSelectedArray) {
                if (newSelectedArray.length === self.selectedCasaAccounts().length) {
                    self.mapAllTransactionsCasaFlag.push("MAP_ALL");
                } else {
                    self.mapAllTransactionsCasaFlag.removeAll();
                }
            });

            self.trdMapAllTransactionIndicatorArray.subscribe(function(newSelectedArray) {
                if (newSelectedArray.length === self.selectedTdAccounts().length) {
                    self.mapAllTransactionsTdFlag.push("MAP_ALL");
                } else {
                    self.mapAllTransactionsTdFlag.removeAll();
                }
            });

            self.loanMapAllTransactionIndicatorArray.subscribe(function(newSelectedArray) {
                if (newSelectedArray.length === self.selectedLoanAccounts().length) {
                    self.mapAllTransactionsLonFlag.push("MAP_ALL");
                } else {
                    self.mapAllTransactionsLonFlag.removeAll();
                }
            });

            self.lmMapAllTransactionIndicatorArray.subscribe(function(newSelectedArray) {
                if (newSelectedArray.length === self.selectedLMAccounts().length) {
                    self.mapAllTransactionsLMFlag.push("MAP_ALL");
                } else {
                    self.mapAllTransactionsLMFlag.removeAll();
                }
            });

            self.VERMapAllTransactionIndicatorArray.subscribe(function(newSelectedArray) {
                if (newSelectedArray.length === self.selectedVAMEnabledRealAccounts().length) {
                    self.mapAllTransactionsVERFlag.push("MAP_ALL");
                } else {
                    self.mapAllTransactionsVERFlag.removeAll();
                }
            });

            self.VRAMapAllTransactionIndicatorArray.subscribe(function(newSelectedArray) {
                if (newSelectedArray.length === self.selectedVirtualAccounts().length) {
                    self.mapAllTransactionsVRAFlag.push("MAP_ALL");
                } else {
                    self.mapAllTransactionsVRAFlag.removeAll();
                }
            });

            self.reloadCasaTable(false);
            self.reloadCasaTable(true);
        };

        self.dispose = function () {
            menuselectionSubscription.dispose();
        };
    };
});