define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/access-management",
    "ojs/ojinputtext",
    "ojs/ojpopup",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojrowexpander",
    "ojs/ojnavigationlist",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource",
    "ojs/ojflattenedtreetabledatasource"
], function(oj, ko, $, TransactionMappingModel, resourceBundle) {
    "use strict";

    return function viewModel(rootParams) {
        const self = this,
            inputParams = rootParams.rootModel.params;

        inputParams.createObservables(inputParams, ["transactionNames",
            "casaRequestPayload", "tdRequestPayload",
            "loanRequestPayload", "party", "lmRequestPayload", "virtualRequestPayload", "vamEnabledRealAccRequestPayload"
        ]);

        inputParams.party = ko.mapping.fromJS(inputParams.party);
        ko.utils.extend(self, inputParams);
        self.nls = resourceBundle;
        self.highlightedTabTrans("CASA");
        rootParams.baseModel.registerElement("nav-bar");

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, {
                user: self.nls.navLabels.PartyLevel_title
            }));
        } else if (self.accessLevel() === "USER" || self.accessLevel() === "USERLINKAGE") {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, {
                user: self.nls.navLabels.UserLevel_title
            }));
        }

        self.ok = function() {
            window.location = "account-access-management.html";
        };

        const getNewKoModel = function() {
            const KoModel = TransactionMappingModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = getNewKoModel();
        self.showReviewScreen = ko.observable(false);
        self.reloadCasaTable = ko.observable(false);
        self.reloadTDTable = ko.observable(false);
        self.reloadLoanTable = ko.observable(false);
        self.reloadLMTable = ko.observable(false);
        self.reloadVERTable = ko.observable(false);
        self.reloadVRATable = ko.observable(false);
        self.applySubscription=ko.observable(false);
        self.mapAllTransactionsToAllAccountCasa = ko.observable(false);
        self.mapAllTransactionsToAllAccountTrd = ko.observable(false);
        self.mapAllTransactionsToAllAccountLon = ko.observable(false);
        self.mapAllTransactionsToAllAccountLM = ko.observable(false);
        self.mapAllTransactionsToAllAccountVER = ko.observable(false);
        self.mapAllTransactionsToAllAccountVRA = ko.observable(false);
        self.mapAllTransactionsCasaFlag = ko.observableArray();
        self.mapAllTransactionsTdFlag = ko.observableArray();
        self.mapAllTransactionsLonFlag = ko.observableArray();
        self.mapAllTransactionsLMFlag = ko.observableArray();
        self.mapAllTransactionsVERFlag = ko.observableArray();
        self.mapAllTransactionsVRAFlag = ko.observableArray();
        self.fullCasaAccountListSorted = ko.observable([]);
        self.fulltdAccountListSorted = ko.observable([]);
        self.fullloanAccountListSorted = ko.observable([]);
        self.fullLMAccountListSorted = ko.observable([]);
        self.fullVirtualAccountListSorted = ko.observable([]);
        self.fullVAMEnabledRealAccountListSorted = ko.observable([]);
        self.casaMapAllTransactionIndicatorArray = ko.observableArray();
        self.trdMapAllTransactionIndicatorArray = ko.observableArray();
        self.loanMapAllTransactionIndicatorArray = ko.observableArray();
        self.lmMapAllTransactionIndicatorArray = ko.observableArray();
        self.VERMapAllTransactionIndicatorArray = ko.observableArray();
        self.VRAMapAllTransactionIndicatorArray = ko.observableArray();
        self.tmpTransactionCodeArray = ko.observableArray();
        self.tmpTransactionCodeTrdArray = ko.observableArray();
        self.tmpTransactionCodeLonArray = ko.observableArray();
        self.tmpTransactionCodeLMArray = ko.observableArray();
        self.tmpTransactionCodeVERArray = ko.observableArray();
        self.tmpTransactionCodeVRAArray = ko.observableArray();
        self.showTransactionMsg = ko.observable(true);
        self.closeDisclaimerMsg = ko.observable(false);
        self.idTrans=ko.observable();
        self.templateTrans=ko.observable();
        self.menuSelection= ko.observable("CASA");
        self.showTemplateTrans=ko.observable(false);

        const options = {
            expanded: "all",
            columns: [
                "accountID",
                "currency",
                "displayValue",
                "accountStatus"
            ]
        };

        self.activateTab = function() {
            self.highlightedTabTrans("CASA");
            self.templateTrans("casa-transaction-access");
            self.idTrans("CASA");
            self.showTemplateTrans(true);
        };

        self.backToeditAccountAccess = function() {
            self.editBackFromReview(true);
            self.isAccessCreated(true);
            rootParams.dashboard.hideDetails();
        };

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "USER") {
            self.tabLists = ko.observableArray([{
                    id: "CASA",
                    label: self.nls.navLabels.CASA,
                    template: "casa-transaction-access"
                },
                {
                    id: "TRD",
                    label: self.nls.navLabels.TD,
                    template: "td-transaction-access"
                },
                {
                    id: "LON",
                    label: self.nls.navLabels.Loans,
                    template: "loan-transaction-access"
                },
                {
                    id: "LER",
                    label: self.nls.navLabels.LER,
                    template: "lm-transaction-access"
                },
                {
                    id: "VER",
                    label: self.nls.navLabels.VER,
                    template: "virtual-enabled-real-transaction-access"
                },
                {
                    id: "VRA",
                    label: self.nls.navLabels.VRA,
                    template: "virtual-transaction-access"
                }
            ]);
        } else {
            self.tabLists = ko.observableArray([{
                    id: "CASA",
                    label: self.nls.navLabels.CASA,
                    template: "casa-transaction-access"
                },
                {
                    id: "TRD",
                    label: self.nls.navLabels.TD,
                    template: "td-transaction-access"
                },
                {
                    id: "LON",
                    label: self.nls.navLabels.Loans,
                    template: "loan-transaction-access"
                }
            ]);
        }

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

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "USER") {
            ko.utils.arrayForEach(self.selectedLMAccounts(), function(item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };

                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeLMArray.push(self.taskCodeObj);
            });

            ko.utils.arrayForEach(self.selectedVAMEnabledRealAccounts(), function(item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };

                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeVERArray.push(self.taskCodeObj);
            });

            ko.utils.arrayForEach(self.selectedVirtualAccounts(), function(item) {
                self.taskCodeObj = {
                    accountNumber: "",
                    taskIds: []
                };

                self.taskCodeObj.accountNumber = item;
                self.taskCodeObj.taskIds = [];
                self.tmpTransactionCodeVRAArray.push(self.taskCodeObj);
            });
        }

        self.casaMapAllTransactionIndicatorArray.subscribe(function(newSelectedArray) {
            if (newSelectedArray.length === self.selectedCasaAccounts().length) {
                self.mapAllTransactionsCasaFlag(["MAP_ALL"]);

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

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "USER") {
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
        }

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        rootParams.baseModel.registerElement("confirm-screen");

        $(window).scroll(function() {
            if ($(document).scrollTop() >= $(document).height() / 10) {
                $("#disclaimer-container").fadeIn("slow");
            } else {
                $("#disclaimer-container").fadeOut("slow");
            }
        });

        self.closeSPopup = function() {
            self.closeDisclaimerMsg(true);
            $("#disclaimer-container").fadeOut("slow");
        };

        if (self.highlightedTabTrans() === "CASA" || self.highlightedTabTrans() === undefined) {
            self.casaTransactionTabVisited(true);
        } else if (self.highlightedTabTrans() === "TRD") {
            self.tdTransactionTabVisited(true);
        } else if (self.highlightedTabTrans() === "LON") {
            self.loanTransactionTabVisited(true);
        } else if (self.accessLevel() === "PARTY" || self.accessLevel() === "USER") {
            if (self.highlightedTabTrans() === "LER") {
                self.lmTransactionTabVisited(true);
            } else if (self.highlightedTabTrans() === "VER") {
                self.vamEnabledRealAccountTabVisited(true);
            } else if (self.highlightedTabTrans() === "VRA") {
                self.virtualAccountTabVisited(true);
            }
        }

        self.uiOptions = {
            menuFloat: "right",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        const menuselectionSubscription = self.menuSelection.subscribe(function (newValue) {
            self.showTemplateTrans(false);

            if (newValue === "CASA") {
                self.highlightedTabTrans("CASA");
                self.templateTrans("casa-transaction-access");
                self.idTrans("CASA");
            } else if (newValue === "TRD") {
                self.highlightedTabTrans("TRD");
                self.templateTrans("td-transaction-access");
                self.idTrans("TRD");
            } else if (newValue === "LON") {
                self.highlightedTabTrans("LON");
                self.templateTrans("loan-transaction-access");
                self.idTrans("LON");
            } else if (newValue === "LER") {
                self.highlightedTabTrans("LER");
                self.templateTrans("lm-transaction-access");
                self.idTrans("LER");
            } else if (newValue === "VER") {
                self.highlightedTabTrans("VER");
                self.templateTrans("virtual-enabled-real-transaction-access");
                self.idTrans("VER");
            } else if(newValue==="VRA"){
                self.highlightedTabTrans("VRA");
                self.templateTrans("virtual-transaction-access");
                self.idTrans("VRA");
            }

            self.showTemplateTrans(true);
        });

        self.showReview = function() {
            self.showReviewScreen(true);
            self.showEditableForm(true);
        };

        self.sortCasaAccounts = function() {
            self.selectedCasaAccounts().sort(function(left, right) {
                return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
            });

            self.fullCasaAccountList().sort(function(left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            for (let i = 0; i < self.selectedCasaAccounts().length; i++) {
                ko.utils.arrayForEach(self.fullCasaAccountList(), function(item) {
                    if (item.accountNumber.value === self.selectedCasaAccounts()[i]) {
                        if (!(self.fullCasaAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedCasaAccounts()[i];
                            }).length > 0)) {
                            if (item.accountStatus === "ACTIVE") {
                                self.fullCasaAccountListSorted().push(item);
                            }
                        }
                    }
                });
            }

            self.fullCasaAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            self.fullCasaAccountListSorted().sort(function(left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            ko.utils.arrayForEach(self.fullCasaAccountList(), function(item) {
                if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                    if (item.accountStatus === "ACTIVE") {
                        self.fullCasaAccountListSorted().push(item);
                    }
                }
            });

            ko.utils.arrayForEach(self.fullCasaAccountList(), function(item) {
                if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                    if (item.accountStatus !== "ACTIVE") {
                        self.fullCasaAccountListSorted().push(item);
                    }
                }
            });

            self.fullCasaAccountList([]);

            ko.utils.arrayForEach(self.fullCasaAccountListSorted(), function(item) {
                self.fullCasaAccountList().push(item);
            });

            self.fullCasaAccountListSorted([]);

            self.casaData = $.map(ko.utils.unwrapObservable(self.fullCasaAccountList()), function(val) {
                val.attr = {
                    accountNumber: {
                        displayValue: val.accountNumber.displayValue,
                        value: val.accountNumber.value
                    },
                    accountStatus: val.accountStatus ? val.accountStatus : "-",
                    displayName: val.displayName ? val.displayName : "-",
                    accountID: val.accountNumber.displayValue,
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

            self.casaTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.casaData),options));
            self.reloadCasaTable(true);
        };

        if (self.fullCasaAccountList().length > 0) {
            self.sortCasaAccounts();
        }

        self.sortTdAccounts = function() {
            self.selectedTdAccounts().sort(function(left, right) {
                return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
            });

            self.fulltdAccountList().sort(function(left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            let j;

            for (j = 0; j < self.selectedTdAccounts().length; j++) {
                ko.utils.arrayForEach(self.fulltdAccountList(), function(item) {
                    if (item.accountNumber.value === self.selectedTdAccounts()[j]) {
                        if (!(self.fulltdAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedTdAccounts()[j];
                            }).length > 0)) {
                            if (item.accountStatus === "ACTIVE") {
                                self.fulltdAccountListSorted().push(item);
                            }
                        }
                    }
                });
            }

            self.fulltdAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            self.fulltdAccountListSorted().sort(function(left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            for (j = 0; j < self.selectedTdAccounts().length; j++) {
                ko.utils.arrayForEach(self.fulltdAccountList(), function(item) {
                    if (item.accountNumber.value === self.selectedTdAccounts()[j]) {
                        if (!(self.fulltdAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedTdAccounts()[j];
                            }).length > 0)) {
                            if (item.accountStatus !== "ACTIVE") {
                                self.fulltdAccountListSorted().push(item);
                            }
                        }
                    }
                });
            }

            ko.utils.arrayForEach(self.fulltdAccountList(), function(item) {
                if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                    if (item.accountStatus === "ACTIVE") {
                        self.fulltdAccountListSorted().push(item);
                    }
                }
            });

            ko.utils.arrayForEach(self.fulltdAccountList(), function(item) {
                if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                    if (item.accountStatus !== "ACTIVE") {
                        self.fulltdAccountListSorted().push(item);
                    }
                }
            });

            self.fulltdAccountList([]);

            ko.utils.arrayForEach(self.fulltdAccountListSorted(), function(item) {
                self.fulltdAccountList().push(item);
            });

            self.tdData = $.map(ko.utils.unwrapObservable(self.fulltdAccountList()), function(val) {
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

            self.tdTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.tdData),options));
            self.reloadTDTable(true);
        };

        if (self.fulltdAccountList().length > 0) {
            self.sortTdAccounts();
        }

        self.sortLoanAccounts = function() {
            self.selectedLoanAccounts().sort(function(left, right) {
                return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
            });

            self.fullloanAccountList().sort(function(left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            let k;

            for (k = 0; k < self.selectedLoanAccounts().length; k++) {
                ko.utils.arrayForEach(self.fullloanAccountList(), function(item) {
                    if (item.accountNumber.value === self.selectedLoanAccounts()[k]) {
                        if (!(self.fullloanAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedLoanAccounts()[k];
                            }).length > 0)) {
                            if (item.accountStatus === "ACTIVE") {
                                self.fullloanAccountListSorted().push(item);
                            }
                        }
                    }
                });
            }

            self.fullloanAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            self.fullloanAccountListSorted().sort(function(left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            for (k = 0; k < self.selectedLoanAccounts().length; k++) {
                ko.utils.arrayForEach(self.fullloanAccountList(), function(item) {
                    if (item.accountNumber.value === self.selectedLoanAccounts()[k]) {
                        if (!(self.fullloanAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedLoanAccounts()[k];
                            }).length > 0)) {
                            if (item.accountStatus !== "ACTIVE") {
                                self.fullloanAccountListSorted().push(item);
                            }
                        }
                    }
                });
            }

            ko.utils.arrayForEach(self.fullloanAccountList(), function(item) {
                if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                    if (item.accountStatus === "ACTIVE") {
                        self.fullloanAccountListSorted().push(item);
                    }
                }
            });

            ko.utils.arrayForEach(self.fullloanAccountList(), function(item) {
                if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                    if (item.accountStatus !== "ACTIVE") {
                        self.fullloanAccountListSorted().push(item);
                    }
                }
            });

            self.fullloanAccountList([]);

            ko.utils.arrayForEach(self.fullloanAccountListSorted(), function(item) {
                self.fullloanAccountList().push(item);
            });

            self.loanData = $.map(ko.utils.unwrapObservable(self.fullloanAccountList()), function(val) {
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

            self.loanTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.loanData),options));
            self.reloadLoanTable(true);
        };

        if (self.fullloanAccountList().length > 0) {
            self.sortLoanAccounts();
        }

        self.sortLMAccounts = function() {
            self.selectedLMAccounts().sort(function(left, right) {
                return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
            });

            self.fullLMAccountList().sort(function(left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            let j;

            for (j = 0; j < self.selectedLMAccounts().length; j++) {
                ko.utils.arrayForEach(self.fullLMAccountList(), function(item) {
                    if (item.accountNumber.value === self.selectedLMAccounts()[j]) {
                        if (!(self.fullLMAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedLMAccounts()[j];
                            }).length > 0)) {
                            if (item.accountStatus === "ACTIVE") {
                                self.fullLMAccountListSorted().push(item);
                            }
                        }
                    }
                });
            }

            self.fullLMAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            self.fullLMAccountListSorted().sort(function(left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            for (j = 0; j < self.selectedLMAccounts().length; j++) {
                ko.utils.arrayForEach(self.fullLMAccountList(), function(item) {
                    if (item.accountNumber.value === self.selectedLMAccounts()[j]) {
                        if (!(self.fullLMAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedLMAccounts()[j];
                            }).length > 0)) {
                            if (item.accountStatus !== "ACTIVE") {
                                self.fullLMAccountListSorted().push(item);
                            }
                        }
                    }
                });
            }

            ko.utils.arrayForEach(self.fullLMAccountList(), function(item) {
                if (self.selectedLMAccounts().indexOf(item.accountNumber.value) === -1) {
                    if (item.accountStatus === "ACTIVE") {
                        self.fullLMAccountListSorted().push(item);
                    }
                }
            });

            ko.utils.arrayForEach(self.fullLMAccountList(), function(item) {
                if (self.selectedLMAccounts().indexOf(item.accountNumber.value) === -1) {
                    if (item.accountStatus !== "ACTIVE") {
                        self.fullLMAccountListSorted().push(item);
                    }
                }
            });

            self.fullLMAccountList([]);

            ko.utils.arrayForEach(self.fullLMAccountListSorted(), function(item) {
                self.fullLMAccountList().push(item);
            });

            self.lmData = $.map(ko.utils.unwrapObservable(self.fullLMAccountList()), function(val) {
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

            self.lmTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.lmData),options));
            self.reloadLMTable(true);
        };

        self.sortVirtualAccounts = function() {
            self.selectedVirtualAccounts().sort(function(left, right) {
                return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
            });

            self.fullVirtualAccountList().sort(function(left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            let j;

            for (j = 0; j < self.selectedVirtualAccounts().length; j++) {
                ko.utils.arrayForEach(self.fullVirtualAccountList(), function(item) {
                    if (item.accountNumber.value === self.selectedVirtualAccounts()[j]) {
                        if (!(self.fullVirtualAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedVirtualAccounts()[j];
                            }).length > 0)) {
                            if (item.accountStatus === "ACTIVE") {
                                self.fullVirtualAccountListSorted().push(item);
                            }
                        }
                    }
                });
            }

            self.fullVirtualAccountListSorted().sort(function(left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            self.fullVirtualAccountListSorted().sort(function(left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            for (j = 0; j < self.selectedVirtualAccounts().length; j++) {
                ko.utils.arrayForEach(self.fullVirtualAccountList(), function(item) {
                    if (item.accountNumber.value === self.selectedVirtualAccounts()[j]) {
                        if (!(self.fullVirtualAccountListSorted().filter(function(e) {
                                return e.accountNumber.value === self.selectedVirtualAccounts()[j];
                            }).length > 0)) {
                            if (item.accountStatus !== "ACTIVE") {
                                self.fullVirtualAccountListSorted().push(item);
                            }
                        }
                    }
                });
            }

            ko.utils.arrayForEach(self.fullVirtualAccountList(), function(item) {
                if (self.selectedVirtualAccounts().indexOf(item.accountNumber.value) === -1) {
                    if (item.accountStatus === "ACTIVE") {
                        self.fullVirtualAccountListSorted().push(item);
                    }
                }
            });

            ko.utils.arrayForEach(self.fullVirtualAccountList(), function(item) {
                if (self.selectedVirtualAccounts().indexOf(item.accountNumber.value) === -1) {
                    if (item.accountStatus !== "ACTIVE") {
                        self.fullVirtualAccountListSorted().push(item);
                    }
                }
            });

            self.fullVirtualAccountList([]);

            ko.utils.arrayForEach(self.fullVirtualAccountListSorted(), function(item) {
                self.fullVirtualAccountList().push(item);
            });

            self.virtualData = $.map(ko.utils.unwrapObservable(self.fullVirtualAccountList()), function(val) {
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

            self.virtualTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.virtualData),options));
            self.reloadVRATable(true);
        };

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "USER") {
            if (self.fullLMAccountList().length > 0) {
                self.sortLMAccounts();
            }

            if (self.fullVirtualAccountList().length > 0) {
                self.sortVirtualAccounts();
            }

            if (self.fullVAMEnabledRealAccountList().length > 0) {
                self.selectedVAMEnabledRealAccounts().sort(function(left, right) {
                    return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
                });

                self.fullVAMEnabledRealAccountList().sort(function(left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                let j;

                for (j = 0; j < self.selectedVAMEnabledRealAccounts().length; j++) {
                    ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function(item) {
                        if (item.accountNumber.value === self.selectedVAMEnabledRealAccounts()[j]) {
                            if (!(self.fullVAMEnabledRealAccountListSorted().filter(function(e) {
                                    return e.accountNumber.value === self.selectedVAMEnabledRealAccounts()[j];
                                }).length > 0)) {
                                if (item.accountStatus === "ACTIVE") {
                                    self.fullVAMEnabledRealAccountListSorted().push(item);
                                }
                            }
                        }
                    });
                }

                self.fullVAMEnabledRealAccountListSorted().sort(function(left, right) {
                    return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
                });

                self.fullVAMEnabledRealAccountListSorted().sort(function(left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                for (j = 0; j < self.selectedVAMEnabledRealAccounts().length; j++) {
                    ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function(item) {
                        if (item.accountNumber.value === self.selectedVAMEnabledRealAccounts()[j]) {
                            if (!(self.fullVAMEnabledRealAccountListSorted().filter(function(e) {
                                    return e.accountNumber.value === self.selectedVAMEnabledRealAccounts()[j];
                                }).length > 0)) {
                                if (item.accountStatus !== "ACTIVE") {
                                    self.fullVAMEnabledRealAccountListSorted().push(item);
                                }
                            }
                        }
                    });
                }

                ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function(item) {
                    if (self.selectedVAMEnabledRealAccounts().indexOf(item.accountNumber.value) === -1) {
                        if (item.accountStatus === "ACTIVE") {
                            self.fullVAMEnabledRealAccountListSorted().push(item);
                        }
                    }
                });

                ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function(item) {
                    if (self.selectedVAMEnabledRealAccounts().indexOf(item.accountNumber.value) === -1) {
                        if (item.accountStatus !== "ACTIVE") {
                            self.fullVAMEnabledRealAccountListSorted().push(item);
                        }
                    }
                });

                self.fullVAMEnabledRealAccountList([]);

                ko.utils.arrayForEach(self.fullVAMEnabledRealAccountListSorted(), function(item) {
                    self.fullVAMEnabledRealAccountList().push(item);
                });

                self.vamEnabledRealData = $.map(ko.utils.unwrapObservable(self.fullVAMEnabledRealAccountList()), function(val) {
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

                self.verTransactionDatasource = new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(self.vamEnabledRealData),options));
                self.reloadVERTable(true);
            }
        }

        self.setMapAllTransactionsToAllAccount = function(module,data) {
            if (data.detail.updatedFrom === "external") {
                self.applySubscription(false);

                if (module === "CASA") {
                        self.mapAllTransactionsToAllAccountCasa(false);
                } else if (module === "LON") {
                        self.mapAllTransactionsToAllAccountLon(false);
                } else if (module === "TRD") {
                        self.mapAllTransactionsToAllAccountTrd(false);
                } else if (module === "LER") {
                        self.mapAllTransactionsToAllAccountLM(false);
                } else if (module === "VER") {
                        self.mapAllTransactionsToAllAccountVER(false);
                } else if (module === "VRA") {
                        self.mapAllTransactionsToAllAccountVRA(false);
                }

                 return; }

                    self.applySubscription(true);

            if (module === "CASA") {
                if(data.detail.value[0]=== "MAP_ALL"){
                    self.mapAllTransactionsToAllAccountCasa(true);
                    self.openRowExpander("CASA");
                } else {
                    self.mapAllTransactionsToAllAccountCasa(false);
                }
            } else if (module === "LON") {
                if(data.detail.value[0]=== "MAP_ALL"){
                    self.mapAllTransactionsToAllAccountLon(true);
                    self.openRowExpander("LON");
                } else {
                    self.mapAllTransactionsToAllAccountLon(false);
                }
            } else if (module === "TRD") {
                if(data.detail.value[0]=== "MAP_ALL"){
                    self.mapAllTransactionsToAllAccountTrd(true);
                    self.openRowExpander("TRD");
                } else {
                    self.mapAllTransactionsToAllAccountTrd(false);
                }
            } else if (module === "LER") {
                if(data.detail.value[0]=== "MAP_ALL"){
                    self.mapAllTransactionsToAllAccountLM(true);
                    self.openRowExpander("LER");
                } else {
                    self.mapAllTransactionsToAllAccountLM(false);
                }
            } else if (module === "VER") {
                if(data.detail.value[0]=== "MAP_ALL"){
                    self.mapAllTransactionsToAllAccountVER(true);
                    self.openRowExpander("VER");
                } else {
                    self.mapAllTransactionsToAllAccountVER(false);
                }
            } else if (module === "VRA") {
                if(data.detail.value[0]=== "MAP_ALL"){
                    self.mapAllTransactionsToAllAccountVRA(true);
                    self.openRowExpander("VRA");
                } else {
                    self.mapAllTransactionsToAllAccountVRA(false);
                }
            }
        };

        self.openRowExpander = function(token) {
            let myTokenClass;

            if (token === "CASA") {
                myTokenClass = "casa-token";
            } else if (token === "LON") {
                myTokenClass = "lon-token";
            } else if (token === "TRD") {
                myTokenClass = "trd-token";
            } else if (token === "LER") {
                myTokenClass = "lm-token";
            } else if (token === "VER") {
                myTokenClass = "ver-token";
            } else if (token === "VRA") {
                myTokenClass = "vra-token";
            }

            const a = $("." + myTokenClass).find("div .oj-rowexpander-touch-area").find("a");

            $(a).each(function() {
                if ($(this).attr("aria-expanded") === "false") {
                    $(this).trigger("click");
                }
            });
        };

        self.enableFormToUpdate = function() {
            self.showEditableForm(false);
            self.isAccessCreated(true);
            self.isAccessUpdated(false);
            self.editButtonPressed(true);
        };

        self.dispose = function () {
            menuselectionSubscription.dispose();
        };
    };
});