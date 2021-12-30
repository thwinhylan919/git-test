define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/access-management",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojpopup",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojswitch",
    "ojs/ojbutton",
    "ojs/ojcheckboxset",
    "ojs/ojnavigationlist",
    "ojs/ojarraytabledatasource",
    "ojs/ojrowexpander",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource"
], function (oj, ko, $, resourceBundle) {
    "use strict";

    return function viewModel(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.highlightedTab = rootParams.rootModel.selectedModule;
        self.isAllCasaSelected = ko.observable();
        self.loadCasaTemplate = ko.observable(true);
        self.isAllTdSelected = ko.observable();
        self.loadTdTemplate = ko.observable(true);
        self.isAllLoansSelected = ko.observable();
        self.loadLoansTemplate = ko.observable(true);
        self.isAllLMSelected = ko.observable();
        self.loadLMTemplate = ko.observable(true);
        self.isAllVERSelected = ko.observable();
        self.loadVERTemplate = ko.observable(true);
        self.isAllVRASelected = ko.observable();
        self.loadVRATemplate = ko.observable(true);
        self.mapAllCasaAccounts = ko.observableArray([]);
        self.mapAllTdAccounts = ko.observableArray([]);
        self.mapAllLoanAccounts = ko.observableArray([]);
        self.mapAllLMAccounts = ko.observableArray([]);
        self.mapAllVirtualEnabledRealAccts = ko.observableArray([]);
        self.mapAllVirtualAccounts = ko.observableArray([]);
        self.fullCasaAccountListCopy = ko.observable([]);
        self.fullCasaAccountListNotActive = ko.observable([]);
        self.fulltdAccountListCopy = ko.observable([]);
        self.fulltdAccountListNotActive = ko.observable([]);
        self.fullloanAccountListCopy = ko.observable([]);
        self.fullloanAccountListNotActive = ko.observable([]);
        self.fullLMAccountListCopy = ko.observable([]);
        self.fullLMAccountListNotActive = ko.observable([]);
        self.fullVAMEnabledRealAccountListCopy = ko.observable([]);
        self.fullVAMEnabledRealAccountListNotActive = ko.observable([]);
        self.fullVirtualAccountListCopy = ko.observable([]);
        self.fullVirtualAccountListNotActive = ko.observable([]);
        self.showDisclaimer = ko.observable(true);
        self.closeDisclaimer = ko.observable(false);
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("nav-bar");
        self.id=ko.observable();
        self.template=ko.observable();
        self.menuSelection= ko.observable("CASA");
        self.showTemplate=ko.observable(false);

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, {
                user: self.nls.navLabels.PartyLevel_title
            }));
        } else if (self.accessLevel() === "USER" || self.accessLevel() === "USERLINKAGE") {
            rootParams.dashboard.headerName(rootParams.baseModel.format(self.nls.pageTitle.accessManagement, {
                user: self.nls.navLabels.UserLevel_title
            }));
        }

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "USER") {

            self.tabLists = ko.observableArray([{
                    id: "CASA",
                    label: self.nls.navLabels.CASA,
                    template: "casa-account-access"
                },
                {
                    id: "TRD",
                    label: self.nls.navLabels.TD,
                    template: "td-account-access"
                },
                {
                    id: "LON",
                    label: self.nls.navLabels.Loans,
                    template: "loan-account-access"
                },
                {
                    id: "LER",
                    label: self.nls.navLabels.LER,
                    template: "lm-account-access"
                },
                {
                    id: "VER",
                    label: self.nls.navLabels.VER,
                    template: "virtual-enabled-real-account-access"
                },
                {
                    id: "VRA",
                    label: self.nls.navLabels.VRA,
                    template: "virtual-account-access"
                }
            ]);
        } else {
            self.tabLists = ko.observableArray([{
                    id: "CASA",
                    label: self.nls.navLabels.CASA,
                    template: "casa-account-access"
                },
                {
                    id: "TRD",
                    label: self.nls.navLabels.TD,
                    template: "td-account-access"
                },
                {
                    id: "LON",
                    label: self.nls.navLabels.Loans,
                    template: "loan-account-access"
                }
            ]);
        }

        if (self.highlightedTab() === "CASA" || self.highlightedTab() === undefined) {
            self.casaAccountTabVisited(true);
            self.template("casa-account-access");
            self.id("CASA");
        } else if (self.highlightedTab() === "TRD") {
            self.tdAccountTabVisited(true);
            self.template("td-account-access");
            self.id("TRD");
        } else if (self.highlightedTab() === "LON") {
            self.loanAccountTabVisited(true);
            self.template("loan-account-access");
            self.id("LON");
        } else if (self.highlightedTab() === "LER") {
            self.lmAccountTabVisited(true);
            self.template("lm-account-access");
            self.id("LER");
        } else if (self.highlightedTab() === "VER") {
            self.vamEnabledRealAccountTabVisited(true);
            self.template("virtual-enabled-real-account-access");
            self.id("VER");
        } else if (self.highlightedTab() === "VRA") {
            self.virtualAccountTabVisited(true);
            self.template("virtual-account-access");
            self.id("VRA");
        }

        const uniqueCasaSelectedArray = self.selectedCasaAccounts().filter(function (item, pos) {
            return self.selectedCasaAccounts().indexOf(item) === pos;
        });

        self.selectedCasaAccounts.removeAll();
        ko.utils.arrayPushAll(self.selectedCasaAccounts(), uniqueCasaSelectedArray);

        const uniqueTdSelectedArray = self.selectedTdAccounts().filter(function (item, pos) {
            return self.selectedTdAccounts().indexOf(item) === pos;
        });

        self.selectedTdAccounts.removeAll();
        ko.utils.arrayPushAll(self.selectedTdAccounts(), uniqueTdSelectedArray);

        const uniqueLoanSelectedArray = self.selectedLoanAccounts().filter(function (item, pos) {
            return self.selectedLoanAccounts().indexOf(item) === pos;
        });

        self.selectedLoanAccounts.removeAll();
        ko.utils.arrayPushAll(self.selectedLoanAccounts(), uniqueLoanSelectedArray);

        self.uiOptions = {
            menuFloat: "right",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        const menuselectionSubscription = self.menuSelection.subscribe(function (newValue) {
            self.showTemplate(false);

            if (newValue === "CASA") {
                self.casaAccountTabVisited(true);
                self.highlightedTab("CASA");
                self.template("casa-account-access");
                self.id("CASA");
                self.closeDisclaimer(false);
            } else if (newValue === "TRD") {
                self.tdAccountTabVisited(true);
                self.highlightedTab("TRD");
                self.template("td-account-access");
                self.id("TRD");
                self.closeDisclaimer(false);
            } else if (newValue === "LON") {
                self.loanAccountTabVisited(true);
                self.highlightedTab("LON");
                self.template("loan-account-access");
                self.id("LON");
                self.closeDisclaimer(false);
            } else if (newValue === "LER") {
                self.lmAccountTabVisited(true);
                self.highlightedTab("LER");
                self.template("lm-account-access");
                self.id("LER");
                self.closeDisclaimer(false);
            } else if (newValue === "VER") {
                self.vamEnabledRealAccountTabVisited(true);
                self.highlightedTab("VER");
                self.template("virtual-enabled-real-account-access");
                self.id("VER");
                self.closeDisclaimer(false);
            } else if(newValue==="VRA"){
                self.virtualAccountTabVisited(true);
                self.highlightedTab("VRA");
                self.template("virtual-account-access");
                self.id("VRA");
                self.closeDisclaimer(false);
            }

            self.showTemplate(true);
        });

        self.cancel = function () {
            rootParams.dashboard.switchModule(true);
        };

        $(window).scroll(function () {
            if ($(document).scrollTop() >= $(document).height() / 10) {
                $("#disclaimer-container").fadeIn("slow");
            } else {
                $("#disclaimer-container").fadeOut("slow");
            }
        });

        self.closeSPopup = function () {
            self.closeDisclaimer(true);
            $("#disclaimer-container").fadeOut("slow");
        };

        self.fullCasaAccountList().sort(function (left, right) {
            return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
        });

        self.fulltdAccountList().sort(function (left, right) {
            return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
        });

        self.fullloanAccountList().sort(function (left, right) {
            return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
        });

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "USER") {
            const uniqueLMSelectedArray = self.selectedLMAccounts().filter(function (item, pos) {
                return self.selectedLMAccounts().indexOf(item) === pos;
            });

            self.selectedLMAccounts.removeAll();
            ko.utils.arrayPushAll(self.selectedLMAccounts(), uniqueLMSelectedArray);

            const uniqueVERSelectedArray = self.selectedVAMEnabledRealAccounts().filter(function (item, pos) {
                return self.selectedVAMEnabledRealAccounts().indexOf(item) === pos;
            });

            self.selectedVAMEnabledRealAccounts.removeAll();
            ko.utils.arrayPushAll(self.selectedVAMEnabledRealAccounts(), uniqueVERSelectedArray);

            const uniqueVRASelectedArray = self.selectedVirtualAccounts().filter(function (item, pos) {
                return self.selectedVirtualAccounts().indexOf(item) === pos;
            });

            self.selectedVirtualAccounts.removeAll();
            ko.utils.arrayPushAll(self.selectedVirtualAccounts(), uniqueVRASelectedArray);

            self.fullLMAccountList().sort(function (left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            self.fullVirtualAccountList().sort(function (left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            self.fullVAMEnabledRealAccountList().sort(function (left, right) {
                return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
            });

            if (!self.isAccessCreated()) {

                ko.utils.arrayForEach(self.fullLMAccountList(), function (item) {
                    if (item.accountStatus === "ACTIVE") {
                        self.fullLMAccountListCopy().push(item);
                    } else {
                        self.fullLMAccountListNotActive().push(item);
                    }
                });

                self.fullLMAccountListCopy().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                self.fullLMAccountListNotActive().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                self.fullLMAccountList([]);

                ko.utils.arrayForEach(self.fullLMAccountListCopy(), function (item) {
                    self.fullLMAccountList().push(item);
                });

                ko.utils.arrayForEach(self.fullLMAccountListNotActive(), function (item) {
                    self.fullLMAccountList().push(item);
                });

                ko.utils.arrayForEach(self.fullVirtualAccountList(), function (item) {
                    if (item.accountStatus === "ACTIVE") {
                        self.fullVirtualAccountListCopy().push(item);
                    } else {
                        self.fullVirtualAccountListNotActive().push(item);
                    }
                });

                self.fullVirtualAccountListCopy().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                self.fullVirtualAccountListNotActive().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                self.fullVirtualAccountList([]);

                ko.utils.arrayForEach(self.fullVirtualAccountListCopy(), function (item) {
                    self.fullVirtualAccountList().push(item);
                });

                ko.utils.arrayForEach(self.fullVirtualAccountListNotActive(), function (item) {
                    self.fullVirtualAccountList().push(item);
                });

                ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function (item) {
                    if (item.accountStatus === "ACTIVE") {
                        self.fullVAMEnabledRealAccountListCopy().push(item);
                    } else {
                        self.fullVAMEnabledRealAccountListNotActive().push(item);
                    }
                });

                self.fullVAMEnabledRealAccountListCopy().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                self.fullVAMEnabledRealAccountListNotActive().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                self.fullVAMEnabledRealAccountList([]);

                ko.utils.arrayForEach(self.fullVAMEnabledRealAccountListCopy(), function (item) {
                    self.fullVAMEnabledRealAccountList().push(item);
                });

                ko.utils.arrayForEach(self.fullVAMEnabledRealAccountListNotActive(), function (item) {
                    self.fullVAMEnabledRealAccountList().push(item);
                });
            }

        }

        if (!self.isAccessCreated()) {
            ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                if (item.accountStatus === "ACTIVE") {
                    self.fullCasaAccountListCopy().push(item);
                } else {
                    self.fullCasaAccountListNotActive().push(item);
                }
            });

            self.fullCasaAccountListCopy().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            self.fullCasaAccountListNotActive().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            self.fullCasaAccountList([]);

            ko.utils.arrayForEach(self.fullCasaAccountListCopy(), function (item) {
                self.fullCasaAccountList().push(item);
            });

            ko.utils.arrayForEach(self.fullCasaAccountListNotActive(), function (item) {
                self.fullCasaAccountList().push(item);
            });

            ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                if (item.accountStatus === "ACTIVE") {
                    self.fulltdAccountListCopy().push(item);
                } else {
                    self.fulltdAccountListNotActive().push(item);
                }
            });

            self.fulltdAccountListCopy().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            self.fulltdAccountListNotActive().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            self.fulltdAccountList([]);

            ko.utils.arrayForEach(self.fulltdAccountListCopy(), function (item) {
                self.fulltdAccountList().push(item);
            });

            ko.utils.arrayForEach(self.fulltdAccountListNotActive(), function (item) {
                self.fulltdAccountList().push(item);
            });

            ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                if (item.accountStatus === "ACTIVE") {
                    self.fullloanAccountListCopy().push(item);
                } else {
                    self.fullloanAccountListNotActive().push(item);
                }
            });

            self.fullloanAccountListCopy().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            self.fullloanAccountListNotActive().sort(function (left, right) {
                return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
            });

            self.fullloanAccountList([]);

            ko.utils.arrayForEach(self.fullloanAccountListCopy(), function (item) {
                self.fullloanAccountList().push(item);
            });

            ko.utils.arrayForEach(self.fullloanAccountListNotActive(), function (item) {
                self.fullloanAccountList().push(item);
            });

        }

        self.sortCasaAccounts = function () {
            if (self.selectedCasaAccounts().length !== 0) {
                self.selectedCasaAccounts().sort(function (left, right) {
                    return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
                });

                self.fullCasaAccountList().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                let i;

                for (i = 0; i < self.selectedCasaAccounts().length; i++) {
                    ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedCasaAccounts()[i]) {
                            if (!(self.fullCasaAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedCasaAccounts()[i];
                                }).length > 0)) {
                                if (item.accountStatus === "ACTIVE") {
                                    self.fullCasaAccountListCopy().push(item);
                                }
                            }
                        }
                    });
                }

                self.fullCasaAccountListCopy().sort(function (left, right) {
                    return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
                });

                self.fullCasaAccountListCopy().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                for (i = 0; i < self.selectedCasaAccounts().length; i++) {
                    ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedCasaAccounts()[i]) {
                            if (!(self.fullCasaAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedCasaAccounts()[i];
                                }).length > 0)) {
                                if (item.accountStatus !== "ACTIVE") {
                                    self.fullCasaAccountListCopy().push(item);
                                }
                            }
                        }
                    });
                }

                let flagCASA, flagCASACopy;

                ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                    if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                        flagCASA = false;

                        for (i = 0; i < self.fullCasaAccountListCopy().length; i++) {

                            if (item.accountNumber.value === self.fullCasaAccountListCopy()[i].accountNumber.value) {
                                flagCASA = true;
                                break;
                            }
                        }

                        if (flagCASA === false) {
                            if (item.accountStatus === "ACTIVE") {
                                self.fullCasaAccountListCopy().push(item);
                            }
                        }
                    }
                });

                ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
                    if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                        flagCASACopy = false;

                        for (let i = 0; i < self.fullCasaAccountListCopy().length; i++) {

                            if (item.accountNumber.value === self.fullCasaAccountListCopy()[i].accountNumber.value) {
                                flagCASACopy = true;
                                break;
                            }
                        }

                        if (flagCASACopy === false) {
                            if (item.accountStatus !== "ACTIVE") {
                                self.fullCasaAccountListCopy().push(item);
                            }
                        }
                    }
                });

                self.fullCasaAccountList([]);

                ko.utils.arrayForEach(self.fullCasaAccountListCopy(), function (item) {
                    self.fullCasaAccountList().push(item);
                });
            }
        };

        self.sortTdAccounts = function () {
            if (self.selectedTdAccounts().length !== 0) {
                self.selectedTdAccounts().sort(function (left, right) {
                    return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
                });

                self.fulltdAccountList().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                let j;

                for (j = 0; j < self.selectedTdAccounts().length; j++) {
                    ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedTdAccounts()[j]) {
                            if (!(self.fulltdAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedTdAccounts()[j];
                                }).length > 0)) {
                                if (item.accountStatus === "ACTIVE") {
                                    self.fulltdAccountListCopy().push(item);
                                }
                            }
                        }
                    });
                }

                self.fulltdAccountListCopy().sort(function (left, right) {
                    return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
                });

                self.fulltdAccountListCopy().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                for (j = 0; j < self.selectedTdAccounts().length; j++) {
                    ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedTdAccounts()[j]) {
                            if (!(self.fulltdAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedTdAccounts()[j];
                                }).length > 0)) {
                                if (item.accountStatus !== "ACTIVE") {
                                    self.fulltdAccountListCopy().push(item);
                                }
                            }
                        }
                    });
                }

                let flagTD, flagTDCopy;

                ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                    if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                        flagTD = false;

                        for (j = 0; j < self.fulltdAccountListCopy().length; j++) {

                            if (item.accountNumber.value === self.fulltdAccountListCopy()[j].accountNumber.value) {
                                flagTD = true;
                                break;
                            }
                        }

                        if (flagTD === false) {
                            if (item.accountStatus === "ACTIVE") {
                                self.fulltdAccountListCopy().push(item);
                            }
                        }
                    }
                });

                ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
                    if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                        flagTDCopy = false;

                        for (j = 0; j < self.fulltdAccountListCopy().length; j++) {

                            if (item.accountNumber.value === self.fulltdAccountListCopy()[j].accountNumber.value) {
                                flagTDCopy = true;
                                break;
                            }
                        }

                        if (flagTDCopy === false) {
                            if (item.accountStatus !== "ACTIVE") {
                                self.fulltdAccountListCopy().push(item);
                            }
                        }
                    }
                });

                self.fulltdAccountList([]);

                ko.utils.arrayForEach(self.fulltdAccountListCopy(), function (item) {
                    self.fulltdAccountList().push(item);
                });
            }
        };

        self.sortLoanAccounts = function () {
            if (self.selectedLoanAccounts().length !== 0) {
                self.selectedLoanAccounts().sort(function (left, right) {
                    return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
                });

                self.fullloanAccountList().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                let k;

                for (k = 0; k < self.selectedLoanAccounts().length; k++) {
                    ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedLoanAccounts()[k]) {
                            if (!(self.fullloanAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedLoanAccounts()[k];
                                }).length > 0)) {
                                if (item.accountStatus === "ACTIVE") {
                                    self.fullloanAccountListCopy().push(item);
                                }
                            }
                        }
                    });
                }

                self.fullloanAccountListCopy().sort(function (left, right) {
                    return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
                });

                self.fullloanAccountListCopy().sort(function (left, right) {
                    return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                });

                for (k = 0; k < self.selectedLoanAccounts().length; k++) {
                    ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                        if (item.accountNumber.value === self.selectedLoanAccounts()[k]) {
                            if (!(self.fullloanAccountListCopy().filter(function (e) {
                                    return e.accountNumber.value === self.selectedLoanAccounts()[k];
                                }).length > 0)) {
                                if (item.accountStatus !== "ACTIVE") {
                                    self.fullloanAccountListCopy().push(item);
                                }
                            }
                        }
                    });
                }

                let flagLoan, flagLoanCopy;

                ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                    if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                        flagLoan = false;

                        for (k = 0; k < self.fullloanAccountListCopy().length; k++) {

                            if (item.accountNumber.value === self.fullloanAccountListCopy()[k].accountNumber.value) {
                                flagLoan = true;
                                break;
                            }
                        }

                        if (flagLoan === false) {
                            if (item.accountStatus === "ACTIVE") {
                                self.fullloanAccountListCopy().push(item);
                            }
                        }
                    }
                });

                ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
                    if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                        flagLoanCopy = false;

                        for (k = 0; k < self.fullloanAccountListCopy().length; k++) {

                            if (item.accountNumber.value === self.fullloanAccountListCopy()[k].accountNumber.value) {
                                flagLoan = true;
                                break;
                            }
                        }

                        if (flagLoanCopy === false) {
                            if (item.accountStatus !== "ACTIVE") {
                                self.fullloanAccountListCopy().push(item);
                            }
                        }
                    }
                });

                self.fullloanAccountList([]);

                ko.utils.arrayForEach(self.fullloanAccountListCopy(), function (item) {
                    self.fullloanAccountList().push(item);
                });
            }
        };

        if (self.isAccessCreated()) {
            self.sortCasaAccounts();
            self.sortTdAccounts();
            self.sortLoanAccounts();
        }

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "USER") {

            self.sortLMAccounts = function () {
                if (self.selectedLMAccounts().length !== 0) {
                    self.selectedLMAccounts().sort(function (left, right) {
                        return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
                    });

                    self.fullLMAccountList().sort(function (left, right) {
                        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                    });

                    let j;

                    for (j = 0; j < self.selectedLMAccounts().length; j++) {
                        ko.utils.arrayForEach(self.fullLMAccountList(), function (item) {
                            if (item.accountNumber.value === self.selectedLMAccounts()[j]) {
                                if (!(self.fullLMAccountListCopy().filter(function (e) {
                                        return e.accountNumber.value === self.selectedLMAccounts()[j];
                                    }).length > 0)) {
                                    if (item.accountStatus === "ACTIVE") {
                                        self.fullLMAccountListCopy().push(item);
                                    }
                                }
                            }
                        });
                    }

                    self.fullLMAccountListCopy().sort(function (left, right) {
                        return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
                    });

                    self.fullLMAccountListCopy().sort(function (left, right) {
                        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                    });

                    for (j = 0; j < self.selectedLMAccounts().length; j++) {
                        ko.utils.arrayForEach(self.fullLMAccountList(), function (item) {
                            if (item.accountNumber.value === self.selectedLMAccounts()[j]) {
                                if (!(self.fullLMAccountListCopy().filter(function (e) {
                                        return e.accountNumber.value === self.selectedLMAccounts()[j];
                                    }).length > 0)) {
                                    if (item.accountStatus !== "ACTIVE") {
                                        self.fullLMAccountListCopy().push(item);
                                    }
                                }
                            }
                        });
                    }

                    let flagLM, flagLMCopy;

                    ko.utils.arrayForEach(self.fullLMAccountList(), function (item) {
                        if (self.selectedLMAccounts().indexOf(item.accountNumber.value) === -1) {
                            flagLM = false;

                            for (j = 0; j < self.fullLMAccountListCopy().length; j++) {

                                if (item.accountNumber.value === self.fullLMAccountListCopy()[j].accountNumber.value) {
                                    flagLM = true;
                                    break;
                                }
                            }

                            if (flagLM === false) {
                                if (item.accountStatus === "ACTIVE") {
                                    self.fullLMAccountListCopy().push(item);
                                }
                            }
                        }
                    });

                    ko.utils.arrayForEach(self.fullLMAccountList(), function (item) {
                        if (self.selectedLMAccounts().indexOf(item.accountNumber.value) === -1) {
                            flagLMCopy = false;

                            for (j = 0; j < self.fullLMAccountListCopy().length; j++) {

                                if (item.accountNumber.value === self.fullLMAccountListCopy()[j].accountNumber.value) {
                                    flagLMCopy = true;
                                    break;
                                }
                            }

                            if (flagLMCopy === false) {
                                if (item.accountStatus !== "ACTIVE") {
                                    self.fullLMAccountListCopy().push(item);
                                }
                            }
                        }
                    });

                    self.fullLMAccountList([]);

                    ko.utils.arrayForEach(self.fullLMAccountListCopy(), function (item) {
                        self.fullLMAccountList().push(item);
                    });
                }
            };

            self.sortVirtualAccounts = function () {
                if (self.selectedVirtualAccounts().length !== 0) {
                    self.selectedVirtualAccounts().sort(function (left, right) {
                        return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
                    });

                    self.fullVirtualAccountList().sort(function (left, right) {
                        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                    });

                    let j;

                    for (j = 0; j < self.selectedVirtualAccounts().length; j++) {
                        ko.utils.arrayForEach(self.fullVirtualAccountList(), function (item) {
                            if (item.accountNumber.value === self.selectedVirtualAccounts()[j]) {
                                if (!(self.fullVirtualAccountListCopy().filter(function (e) {
                                        return e.accountNumber.value === self.selectedVirtualAccounts()[j];
                                    }).length > 0)) {
                                    if (item.accountStatus === "ACTIVE") {
                                        self.fullVirtualAccountListCopy().push(item);
                                    }
                                }
                            }
                        });
                    }

                    self.fullVirtualAccountListCopy().sort(function (left, right) {
                        return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
                    });

                    self.fullVirtualAccountListCopy().sort(function (left, right) {
                        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                    });

                    for (j = 0; j < self.selectedVirtualAccounts().length; j++) {
                        ko.utils.arrayForEach(self.fullVirtualAccountList(), function (item) {
                            if (item.accountNumber.value === self.selectedVirtualAccounts()[j]) {
                                if (!(self.fullVirtualAccountListCopy().filter(function (e) {
                                        return e.accountNumber.value === self.selectedVirtualAccounts()[j];
                                    }).length > 0)) {
                                    if (item.accountStatus !== "ACTIVE") {
                                        self.fullVirtualAccountListCopy().push(item);
                                    }
                                }
                            }
                        });
                    }

                    let flagVRA, flagVRACopy;

                    ko.utils.arrayForEach(self.fullVirtualAccountList(), function (item) {
                        if (self.selectedVirtualAccounts().indexOf(item.accountNumber.value) === -1) {
                            flagVRA = false;

                            for (j = 0; j < self.fullVirtualAccountListCopy().length; j++) {

                                if (item.accountNumber.value === self.fullVirtualAccountListCopy()[j].accountNumber.value) {
                                    flagVRA = true;
                                    break;
                                }
                            }

                            if (flagVRA === false) {
                                if (item.accountStatus === "ACTIVE") {
                                    self.fullVirtualAccountListCopy().push(item);
                                }
                            }
                        }
                    });

                    ko.utils.arrayForEach(self.fullVirtualAccountList(), function (item) {
                        if (self.selectedVirtualAccounts().indexOf(item.accountNumber.value) === -1) {
                            flagVRACopy = false;

                            for (j = 0; j < self.fullVirtualAccountListCopy().length; j++) {

                                if (item.accountNumber.value === self.fullVirtualAccountListCopy()[j].accountNumber.value) {
                                    flagVRACopy = true;
                                    break;
                                }
                            }

                            if (flagVRACopy === false) {
                                if (item.accountStatus !== "ACTIVE") {
                                    self.fullVirtualAccountListCopy().push(item);
                                }
                            }
                        }
                    });

                    self.fullVirtualAccountList([]);

                    ko.utils.arrayForEach(self.fullVirtualAccountListCopy(), function (item) {
                        self.fullVirtualAccountList().push(item);
                    });
                }
            };

            self.sortVamEnabledRealAccounts = function () {
                if (self.selectedVAMEnabledRealAccounts().length !== 0) {
                    self.selectedVAMEnabledRealAccounts().sort(function (left, right) {
                        return left.value === right.value ? 0 : left.value < right.value ? -1 : 1;
                    });

                    self.fullVAMEnabledRealAccountList().sort(function (left, right) {
                        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                    });

                    let j;

                    for (j = 0; j < self.selectedVAMEnabledRealAccounts().length; j++) {
                        ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function (item) {
                            if (item.accountNumber.value === self.selectedVAMEnabledRealAccounts()[j]) {
                                if (!(self.fullVAMEnabledRealAccountListCopy().filter(function (e) {
                                        return e.accountNumber.value === self.selectedVAMEnabledRealAccounts()[j];
                                    }).length > 0)) {
                                    if (item.accountStatus === "ACTIVE") {
                                        self.fullVAMEnabledRealAccountListCopy().push(item);
                                    }
                                }
                            }
                        });
                    }

                    self.fullVAMEnabledRealAccountListCopy().sort(function (left, right) {
                        return left.accountNumber.value === right.accountNumber.value ? 0 : left.accountNumber.value < right.accountNumber.value ? -1 : 1;
                    });

                    self.fullVAMEnabledRealAccountListCopy().sort(function (left, right) {
                        return left.currencyCode === right.currencyCode ? 0 : left.currencyCode < right.currencyCode ? -1 : 1;
                    });

                    for (j = 0; j < self.selectedVAMEnabledRealAccounts().length; j++) {
                        ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function (item) {
                            if (item.accountNumber.value === self.selectedVAMEnabledRealAccounts()[j]) {
                                if (!(self.fullVAMEnabledRealAccountListCopy().filter(function (e) {
                                        return e.accountNumber.value === self.selectedVAMEnabledRealAccounts()[j];
                                    }).length > 0)) {
                                    if (item.accountStatus !== "ACTIVE") {
                                        self.fullVAMEnabledRealAccountListCopy().push(item);
                                    }
                                }
                            }
                        });
                    }

                    let flagVER, flagVERCopy;

                    ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function (item) {
                        if (self.selectedVAMEnabledRealAccounts().indexOf(item.accountNumber.value) === -1) {
                            flagVER = false;

                            for (j = 0; j < self.fullVAMEnabledRealAccountListCopy().length; j++) {

                                if (item.accountNumber.value === self.fullVAMEnabledRealAccountListCopy()[j].accountNumber.value) {
                                    flagVER = true;
                                    break;
                                }
                            }

                            if (flagVER === false) {
                                if (item.accountStatus === "ACTIVE") {
                                    self.fullVAMEnabledRealAccountListCopy().push(item);
                                }
                            }
                        }
                    });

                    ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function (item) {
                        if (self.selectedVAMEnabledRealAccounts().indexOf(item.accountNumber.value) === -1) {
                            flagVERCopy = false;

                            for (j = 0; j < self.fullVAMEnabledRealAccountListCopy().length; j++) {

                                if (item.accountNumber.value === self.fullVAMEnabledRealAccountListCopy()[j].accountNumber.value) {
                                    flagVERCopy = true;
                                    break;
                                }
                            }

                            if (flagVERCopy === false) {
                                if (item.accountStatus !== "ACTIVE") {
                                    self.fullVAMEnabledRealAccountListCopy().push(item);
                                }
                            }
                        }
                    });

                    self.fullVAMEnabledRealAccountList([]);

                    ko.utils.arrayForEach(self.fullVAMEnabledRealAccountListCopy(), function (item) {
                        self.fullVAMEnabledRealAccountList().push(item);
                    });
                }
            };

            if (self.isAccessCreated()) {
                self.sortLMAccounts();
                self.sortVirtualAccounts();
                self.sortVamEnabledRealAccounts();
            }
        }

        function filterArray(array, item, i) {
            let counter = 0;

            for (let x = 0; x < array.length; x++) {
                if (item.accountNumber.value === array[x].accountNumber.value) {
                    if (counter !== i) {
                        return false;
                    }

                    return true;
                }

                counter++;
            }
        }

        if (self.fullCasaAccountList()) {
            const uniqueFullCasaList = $.grep(self.fullCasaAccountList(), function (item, i) {
                return filterArray(self.fullCasaAccountList(), item, i);
            });

            self.fullCasaAccountList([]);

            ko.utils.arrayForEach(uniqueFullCasaList, function (item) {
                self.fullCasaAccountList().push(item);
            });
        }

        if (self.fullloanAccountList()) {
            const uniquefullloanAccountList = $.grep(self.fullloanAccountList(), function (item, i) {
                return filterArray(self.fullloanAccountList(), item, i);
            });

            self.fullloanAccountList([]);

            ko.utils.arrayForEach(uniquefullloanAccountList, function (item) {
                self.fullloanAccountList().push(item);
            });
        }

        if (self.fulltdAccountList()) {
            const uniquefulltdAccountList = $.grep(self.fulltdAccountList(), function (item, i) {
                return filterArray(self.fulltdAccountList(), item, i);
            });

            self.fulltdAccountList([]);

            ko.utils.arrayForEach(uniquefulltdAccountList, function (item) {
                self.fulltdAccountList().push(item);
            });
        }

        if (self.accessLevel() === "PARTY" || self.accessLevel() === "USER") {

            if (self.fullLMAccountList()) {
                const uniquefullLMAccountList = $.grep(self.fullLMAccountList(), function (item, i) {
                    return filterArray(self.fullLMAccountList(), item, i);
                });

                self.fullLMAccountList([]);

                ko.utils.arrayForEach(uniquefullLMAccountList, function (item) {
                    self.fullLMAccountList().push(item);
                });
            }

            if (self.fullVirtualAccountList()) {
                const uniquefullVirtualAccountList = $.grep(self.fullVirtualAccountList(), function (item, i) {
                    return filterArray(self.fullVirtualAccountList(), item, i);
                });

                self.fullVirtualAccountList([]);

                ko.utils.arrayForEach(uniquefullVirtualAccountList, function (item) {
                    self.fullVirtualAccountList().push(item);
                });
            }

            if (self.fullVAMEnabledRealAccountList()) {
                const uniquefullVAMEnabledRealAccountList = $.grep(self.fullVAMEnabledRealAccountList(), function (item, i) {
                    return filterArray(self.fullVAMEnabledRealAccountList(), item, i);
                });

                self.fullVAMEnabledRealAccountList([]);

                ko.utils.arrayForEach(uniquefullVAMEnabledRealAccountList, function (item) {
                    self.fullVAMEnabledRealAccountList().push(item);
                });
            }

            const parsedDataForLM = $.map(ko.utils.unwrapObservable(self.fullLMAccountList()), function (val) {
                val.ID = val.accountNumber.displayValue;
                val.mappingPolicy = val.allowed;
                val.currency = val.currencyCode ? val.currencyCode : "-";
                val.displayName = val.displayName ? val.displayName : "-";
                val.accountStatus = val.accountStatus ? val.accountStatus : "-";

                return val;
            });

            self.lmAccountdataSource = new oj.ArrayTableDataSource(parsedDataForLM, {
                idAttribute: "ID"
            });

            const parsedDataForVER = $.map(ko.utils.unwrapObservable(self.fullVAMEnabledRealAccountList()), function (val) {
                val.ID = val.accountNumber.displayValue;
                val.mappingPolicy = val.allowed;
                val.currency = val.currencyCode ? val.currencyCode : "-";
                val.displayName = val.displayName ? val.displayName : "-";
                val.accountStatus = val.accountStatus ? val.accountStatus : "-";

                return val;
            });

            self.verAccountdataSource = new oj.ArrayTableDataSource(parsedDataForVER, {
                idAttribute: "ID"
            });

            const parsedDataForVRA = $.map(ko.utils.unwrapObservable(self.fullVirtualAccountList()), function (val) {
                val.ID = val.accountNumber.displayValue;
                val.mappingPolicy = val.allowed;
                val.currency = val.currencyCode ? val.currencyCode : "-";
                val.displayName = val.displayName ? val.displayName : "-";
                val.accountStatus = val.accountStatus ? val.accountStatus : "-";

                return val;
            });

            self.vraAccountdataSource = new oj.ArrayTableDataSource(parsedDataForVRA, {
                idAttribute: "ID"
            });

            ko.utils.arrayForEach(self.fullLMAccountList(), function (item) {
                self.lmTransactionMappedObject = {
                    accountNumber: {
                        displayValue: "",
                        value: ""
                    },
                    accountStatus: "",
                    displayName: "",
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
                self.lmTransactionMappedObject.nonSelectedTask = item.nonSelectedTask;
                self.lmTransactionMappedObject.selectedTask = item.selectedTask;
                self.lmTransactionMappedObject.currencyCode = item.currencyCode;
                self.lmTransactionMappedObject.resourceListLM = item.resourceListLM;

                if (!(self.selectedAccountsResources().filter(function (e) {
                        return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.lmTransactionMappedObject);
                }
            });

            ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function (item) {
                self.VERTransactionMappedObject = {
                    accountNumber: {
                        displayValue: "",
                        value: ""
                    },
                    accountStatus: "",
                    displayName: "",
                    currencyCode: "",
                    selectedTask: [],
                    accountType: "",
                    nonSelectedTask: [],
                    resourceListVER: []
                };

                self.VERTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
                self.VERTransactionMappedObject.accountNumber.value = item.accountNumber.value;
                self.VERTransactionMappedObject.accountStatus = item.accountStatus;
                self.VERTransactionMappedObject.displayName = item.displayName;
                self.VERTransactionMappedObject.accountType = item.accountType;
                self.VERTransactionMappedObject.nonSelectedTask = item.nonSelectedTask;
                self.VERTransactionMappedObject.selectedTask = item.selectedTask;
                self.VERTransactionMappedObject.currencyCode = item.currencyCode;
                self.VERTransactionMappedObject.resourceListVER = item.resourceListVER;

                if (!(self.selectedAccountsResources().filter(function (e) {
                        return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.VERTransactionMappedObject);
                }
            });

            ko.utils.arrayForEach(self.fullVirtualAccountList(), function (item) {
                self.VRATransactionMappedObject = {
                    accountNumber: {
                        displayValue: "",
                        value: ""
                    },
                    accountStatus: "",
                    displayName: "",
                    currencyCode: "",
                    selectedTask: [],
                    accountType: "",
                    nonSelectedTask: [],
                    resourceListVRA: []
                };

                self.VRATransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
                self.VRATransactionMappedObject.accountNumber.value = item.accountNumber.value;
                self.VRATransactionMappedObject.accountStatus = item.accountStatus;
                self.VRATransactionMappedObject.displayName = item.displayName;
                self.VRATransactionMappedObject.accountType = item.accountType;
                self.VRATransactionMappedObject.nonSelectedTask = item.nonSelectedTask;
                self.VRATransactionMappedObject.selectedTask = item.selectedTask;
                self.VRATransactionMappedObject.currencyCode = item.currencyCode;
                self.VRATransactionMappedObject.resourceListVRA = item.resourceListVRA;

                if (!(self.selectedAccountsResources().filter(function (e) {
                        return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                    }).length > 0)) {
                    self.selectedAccountsResources().push(self.VRATransactionMappedObject);
                }
            });

            self.isAllLMSelected.subscribe(function (newValue) {
                if (newValue === true) {
                    self.mapAllLMAccounts(["ALL"]);
                } else {
                    self.mapAllLMAccounts.removeAll();
                }
            });

            self.isAllVRASelected.subscribe(function (newValue) {
                if (newValue === true) {
                    self.mapAllVirtualAccounts(["ALL"]);
                } else {
                    self.mapAllVirtualAccounts.removeAll();
                }
            });

            self.isAllVERSelected.subscribe(function (newValue) {
                if (newValue === true) {
                    self.mapAllVirtualEnabledRealAccts(["ALL"]);
                } else {
                    self.mapAllVirtualEnabledRealAccts.removeAll();
                }
            });

            self.isLMAllowed.subscribe(function (newValue) {
                if (newValue === true) {
                    self.selectedLMPolicy("lmAuto");
                    self.selectedLMPolicyChecked(["lmAuto"]);
                } else {
                    self.selectedLMPolicy("lmManual");
                    self.selectedLMPolicyChecked(["lmManual"]);
                }
            });

            self.isVirtualAllowed.subscribe(function (newValue) {
                if (newValue === true) {
                    self.selectedVirtualPolicy("vraAuto");
                    self.selectedVirtualPolicyChecked(["vraAuto"]);
                } else {
                    self.selectedVirtualPolicy("vraManual");
                    self.selectedVirtualPolicyChecked(["vraManual"]);
                }
            });

            self.isVAMEnabledRealAllowed.subscribe(function (newValue) {
                if (newValue === true) {
                    self.selectedVamEnabledRealAccPolicy("verAuto");
                    self.selectedVERPolicyChecked(["verAuto"]);
                } else {
                    self.selectedVamEnabledRealAccPolicy("verManual");
                    self.selectedVERPolicyChecked(["verManual"]);
                }
            });

            self.selectedLMAccounts.subscribe(function (newSelectedArray) {
                if (newSelectedArray && newSelectedArray.length > 0) {
                    if (newSelectedArray.length === self.fullLMAccountList().length) {
                        self.isAllLMSelected(true);
                    } else {
                        self.isAllLMSelected(false);
                    }

                    if (self.isAccessCreated() && !self.editBackFromReview()) {
                        ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
                            if (self.selectedLMAccounts().indexOf(item.accountNumber.value) === -1) {
                                ko.utils.arrayForEach(self.fullLMAccountList(), function (thisItem) {
                                    if (thisItem.accountNumber.value === item.accountNumber.value && thisItem.accountType === item.accountType) {
                                        self.selectedAccountsResources.remove(item);

                                        self.newObject = {
                                            accountNumber: {
                                                displayValue: "",
                                                value: ""
                                            },
                                            accountStatus: "",
                                            displayName: "",
                                            currencyCode: "",
                                            selectedTask: [],
                                            accountType: "LER",
                                            nonSelectedTask: [],
                                            resourceListLM: []
                                        };

                                        self.newObject.accountNumber.value = item.accountNumber.value;
                                        self.newObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                        self.newObject.accountStatus = item.accountStatus;
                                        self.newObject.currencyCode = item.currencyCode;
                                        self.newObject.nonSelectedTask = thisItem.fullResourceTaskList;
                                        self.newObject.resourceListLM = item.resourceListLM;
                                        self.newObject.displayName = item.displayName;
                                        self.selectedAccountsResources().push(self.newObject);
                                    }
                                });
                            }
                        });
                    }
                }
            });

            self.selectedVirtualAccounts.subscribe(function (newSelectedArray) {
                if (newSelectedArray && newSelectedArray.length > 0) {
                    if (newSelectedArray.length === self.fullVirtualAccountList().length) {
                        self.isAllVRASelected(true);
                    } else {
                        self.isAllVRASelected(false);
                    }

                    if (self.isAccessCreated() && !self.editBackFromReview()) {
                        ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
                            if (self.selectedVirtualAccounts().indexOf(item.accountNumber.value) === -1) {
                                ko.utils.arrayForEach(self.fullVirtualAccountList(), function (thisItem) {
                                    if (thisItem.accountNumber.value === item.accountNumber.value && thisItem.accountType === item.accountType) {
                                        self.selectedAccountsResources.remove(item);

                                        self.newObject = {
                                            accountNumber: {
                                                displayValue: "",
                                                value: ""
                                            },
                                            accountStatus: "",
                                            displayName: "",
                                            currencyCode: "",
                                            selectedTask: [],
                                            accountType: "VRA",
                                            nonSelectedTask: [],
                                            resourceListVRA: []
                                        };

                                        self.newObject.accountNumber.value = item.accountNumber.value;
                                        self.newObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                        self.newObject.accountStatus = item.accountStatus;
                                        self.newObject.currencyCode = item.currencyCode;
                                        self.newObject.nonSelectedTask = thisItem.fullResourceTaskList;
                                        self.newObject.resourceListVRA = item.resourceListVRA;
                                        self.newObject.displayName = item.displayName;
                                        self.selectedAccountsResources().push(self.newObject);
                                    }
                                });
                            }
                        });
                    }
                }
            });

            self.selectedVAMEnabledRealAccounts.subscribe(function (newSelectedArray) {
                if (newSelectedArray && newSelectedArray.length > 0) {
                    if (newSelectedArray.length === self.fullVAMEnabledRealAccountList().length) {
                        self.isAllVERSelected(true);
                    } else {
                        self.isAllVERSelected(false);
                    }

                    if (self.isAccessCreated() && !self.editBackFromReview()) {
                        ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
                            if (self.selectedVAMEnabledRealAccounts().indexOf(item.accountNumber.value) === -1) {
                                ko.utils.arrayForEach(self.fullVAMEnabledRealAccountList(), function (thisItem) {
                                    if (thisItem.accountNumber.value === item.accountNumber.value && thisItem.accountType === item.accountType) {
                                        self.selectedAccountsResources.remove(item);

                                        self.newObject = {
                                            accountNumber: {
                                                displayValue: "",
                                                value: ""
                                            },
                                            accountStatus: "",
                                            displayName: "",
                                            currencyCode: "",
                                            selectedTask: [],
                                            accountType: "VER",
                                            nonSelectedTask: [],
                                            resourceListVER: []
                                        };

                                        self.newObject.accountNumber.value = item.accountNumber.value;
                                        self.newObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                        self.newObject.accountStatus = item.accountStatus;
                                        self.newObject.currencyCode = item.currencyCode;
                                        self.newObject.nonSelectedTask = thisItem.fullResourceTaskList;
                                        self.newObject.resourceListVER = item.resourceListVER;
                                        self.newObject.displayName = item.displayName;
                                        self.selectedAccountsResources().push(self.newObject);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }

        const parsedDataForCasa = $.map(ko.utils.unwrapObservable(self.fullCasaAccountList()), function (val) {
            val.ID = val.accountNumber.displayValue;
            val.mappingPolicy = val.allowed;
            val.currency = val.currencyCode ? val.currencyCode : "-";
            val.displayName = val.displayName ? val.displayName : "-";
            val.accountStatus = val.accountStatus ? val.accountStatus : "-";

            return val;
        });

        self.casaAccountdataSource = new oj.ArrayTableDataSource(parsedDataForCasa, {
            idAttribute: "ID"
        });

        const parsedDataForTd = $.map(ko.utils.unwrapObservable(self.fulltdAccountList()), function (val) {
            val.ID = val.accountNumber.displayValue;
            val.mappingPolicy = val.allowed;
            val.currency = val.currencyCode ? val.currencyCode : "-";
            val.displayName = val.displayName ? val.displayName : "-";
            val.accountStatus = val.accountStatus ? val.accountStatus : "-";

            return val;
        });

        self.tdAccountdataSource = new oj.ArrayTableDataSource(parsedDataForTd, {
            idAttribute: "ID"
        });

        const parsedDataForLoan = $.map(ko.utils.unwrapObservable(self.fullloanAccountList()), function (val) {
            val.ID = val.accountNumber.displayValue;
            val.mappingPolicy = val.allowed;
            val.currency = val.currencyCode ? val.currencyCode : "-";
            val.displayName = val.displayName ? val.displayName : "-";
            val.accountStatus = val.accountStatus ? val.accountStatus : "-";

            return val;
        });

        self.loanAccountdataSource = new oj.ArrayTableDataSource(parsedDataForLoan, {
            idAttribute: "ID"
        });

        self.activateTab = function() {
            self.highlightedTab("CASA");
            self.template("casa-account-access");
            self.id("CASA");
            self.showTemplate(true);
        };

        ko.utils.arrayForEach(self.fullCasaAccountList(), function (item) {
            self.casaTransactionMappedObject = {
                accountNumber: {
                    displayValue: "",
                    value: ""
                },
                accountStatus: "",
                displayName: "",
                currencyCode: "",
                selectedTask: [],
                accountType: "",
                nonSelectedTask: [],
                resourceListCasa: []
            };

            self.casaTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
            self.casaTransactionMappedObject.accountStatus = item.accountStatus;
            self.casaTransactionMappedObject.accountNumber.value = item.accountNumber.value;
            self.casaTransactionMappedObject.accountType = item.accountType;
            self.casaTransactionMappedObject.nonSelectedTask = item.nonSelectedTask;
            self.casaTransactionMappedObject.selectedTask = item.selectedTask;
            self.casaTransactionMappedObject.currencyCode = item.currencyCode;
            self.casaTransactionMappedObject.displayName = item.displayName;
            self.casaTransactionMappedObject.resourceListCasa = item.resourceListCasa;

            if (!(self.selectedAccountsResources().filter(function (e) {
                    return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                }).length > 0)) {
                self.selectedAccountsResources().push(self.casaTransactionMappedObject);
            }
        });

        ko.utils.arrayForEach(self.fulltdAccountList(), function (item) {
            self.tdTransactionMappedObject = {
                accountNumber: {
                    displayValue: "",
                    value: ""
                },
                accountStatus: "",
                displayName: "",
                currencyCode: "",
                selectedTask: [],
                accountType: "",
                nonSelectedTask: [],
                resourceListTD: []
            };

            self.tdTransactionMappedObject.accountNumber.displayValue = item.accountNumber.displayValue;
            self.tdTransactionMappedObject.accountStatus = item.accountStatus;
            self.tdTransactionMappedObject.displayName = item.displayName;
            self.tdTransactionMappedObject.accountNumber.value = item.accountNumber.value;
            self.tdTransactionMappedObject.accountType = item.accountType;
            self.tdTransactionMappedObject.nonSelectedTask = item.nonSelectedTask;
            self.tdTransactionMappedObject.selectedTask = item.selectedTask;
            self.tdTransactionMappedObject.currencyCode = item.currencyCode;
            self.tdTransactionMappedObject.resourceListTD = item.resourceListTD;

            if (!(self.selectedAccountsResources().filter(function (e) {
                    return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                }).length > 0)) {
                self.selectedAccountsResources().push(self.tdTransactionMappedObject);
            }
        });

        ko.utils.arrayForEach(self.fullloanAccountList(), function (item) {
            self.loanTransactionMappedObject = {
                accountNumber: {
                    displayValue: "",
                    value: ""
                },
                accountStatus: "",
                displayName: "",
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
            self.loanTransactionMappedObject.nonSelectedTask = item.nonSelectedTask;
            self.loanTransactionMappedObject.selectedTask = item.selectedTask;
            self.loanTransactionMappedObject.currencyCode = item.currencyCode;
            self.loanTransactionMappedObject.resourceListLON = item.resourceListLON;

            if (!(self.selectedAccountsResources().filter(function (e) {
                    return e.accountNumber.value === item.accountNumber.value && e.accountType === item.accountType;
                }).length > 0)) {
                self.selectedAccountsResources().push(self.loanTransactionMappedObject);
            }
        });

        const isCasaAllowedSubscription = self.isCasaAllowed.subscribe(function (newValue) {
            if (newValue === true) {
                self.selectedCasaPolicy("casaAuto");
                self.selectedCasaPolicyChecked(["casaAuto"]);
            } else {
                self.selectedCasaPolicy("casaManual");
                self.selectedCasaPolicyChecked(["casaManual"]);
            }
        });

        self.isTDAllowed.subscribe(function (newValue) {
            if (newValue === true) {
                self.selectedTdPolicy("tdAuto");
                self.selectedTdPolicyChecked(["tdAuto"]);
            } else {
                self.selectedTdPolicy("tdManual");
                self.selectedTdPolicyChecked(["tdManual"]);
            }
        });

        self.isLoanAllowed.subscribe(function (newValue) {
            if (newValue === true) {
                self.selectedLoanPolicy("loanAuto");
                self.selectedLoanPolicyChecked(["loanAuto"]);
            } else {
                self.selectedLoanPolicy("loanManual");
                self.selectedLoanPolicyChecked(["loanManual"]);
            }
        });

        self.cancelAccess = function () {
            rootParams.dashboard.loadComponent("user-access-managment-base", {});
        };

        self.casaDefaultPolicyChangeHandler = function (event) {
            if (Array.isArray(event.detail.value)) {
                event.detail.value = event.detail.value[0];
            }

            if (event.detail.value === "casaAuto") {
                self.isCasaAllowed(true);
            } else {
                self.isCasaAllowed(false);
            }

            self.casaAllowedButtonsPressed(true);
        };

        self.tdDefaultPolicyChangeHandler = function (event) {

            if (Array.isArray(event.detail.value)) {
                event.detail.value = event.detail.value[0];
            }

            if (event.detail.value === "tdAuto") {
                self.isTDAllowed(true);
            } else {
                self.isTDAllowed(false);
            }

            self.tdAllowedButtonsPressed(true);
        };

        self.loanDefaultPolicyChangeHandler = function (event) {

            if (Array.isArray(event.detail.value)) {
                event.detail.value = event.detail.value[0];
            }

            if (event.detail.value === "loanAuto") {
                self.isLoanAllowed(true);
            } else {
                self.isLoanAllowed(false);
            }

            self.loanAllowedButtonsPressed(true);
        };

        self.lmDefaultPolicyChangeHandler = function (event) {

            if (Array.isArray(event.detail.value)) {
                event.detail.value = event.detail.value[0];
            }

            if (event.detail.value === "lmAuto") {
                self.isLMAllowed(true);
            } else {
                self.isLMAllowed(false);
            }

            self.lmAllowedButtonsPressed(true);
        };

        self.verDefaultPolicyChangeHandler = function (event) {

            if (Array.isArray(event.detail.value)) {
                event.detail.value = event.detail.value[0];
            }

            if (event.detail.value === "verAuto") {
                self.isVAMEnabledRealAllowed(true);
            } else {
                self.isVAMEnabledRealAllowed(false);
            }

            self.vamEnabledRealAllowedButtonsPressed(true);
        };

        self.vraDefaultPolicyChangeHandler = function (event) {

            if (Array.isArray(event.detail.value)) {
                event.detail.value = event.detail.value[0];
            }

            if (event.detail.value === "vraAuto") {
                self.isVirtualAllowed(true);
            } else {
                self.isVirtualAllowed(false);
            }

            self.virtualAllowedButtonsPressed(true);
        };

        self.toggleAllCheckbox = function () {
            if (!self.showEditableForm()) {
                self.isAllCasaSelected(!self.isAllCasaSelected());

                if (self.isAllCasaSelected()) {
                    self.selectedCasaAccounts.removeAll();

                    for (let i = 0; i < self.fullCasaAccountList().length; i++) {
                        self.selectedCasaAccounts.push(self.fullCasaAccountList()[i].accountNumber.value);
                    }

                    self.loadCasaTemplate(false);
                    self.loadCasaTemplate(true);

                    return false;
                }

                self.selectedCasaAccounts.removeAll();
                self.loadCasaTemplate(false);
                self.loadCasaTemplate(true);

                return false;
            }
        };

        self.toggleAllCheckboxTd = function () {
            if (!self.showEditableForm()) {
                self.isAllTdSelected(!self.isAllTdSelected());

                if (self.isAllTdSelected()) {
                    self.selectedTdAccounts.removeAll();

                    for (let i = 0; i < self.fulltdAccountList().length; i++) {
                        self.selectedTdAccounts.push(self.fulltdAccountList()[i].accountNumber.value);
                    }

                    self.loadTdTemplate(false);
                    self.loadTdTemplate(true);

                    return false;
                }

                self.selectedTdAccounts.removeAll();
                self.loadTdTemplate(false);
                self.loadTdTemplate(true);

                return false;
            }
        };

        self.toggleAllLoansCheckbox = function () {
            if (!self.showEditableForm()) {
                self.isAllLoansSelected(!self.isAllLoansSelected());

                if (self.isAllLoansSelected()) {
                    self.selectedLoanAccounts.removeAll();

                    for (let i = 0; i < self.fullloanAccountList().length; i++) {
                        self.selectedLoanAccounts.push(self.fullloanAccountList()[i].accountNumber.value);
                    }

                    self.loadLoansTemplate(false);
                    self.loadLoansTemplate(true);

                    return false;
                }

                self.selectedLoanAccounts.removeAll();
                self.loadLoansTemplate(false);
                self.loadLoansTemplate(true);

                return false;
            }
        };

        self.toggleAllLMCheckbox = function () {
            if (!self.showEditableForm()) {
                self.isAllLMSelected(!self.isAllLMSelected());

                if (self.isAllLMSelected()) {
                    self.selectedLMAccounts.removeAll();

                    for (let i = 0; i < self.fullLMAccountList().length; i++) {
                        self.selectedLMAccounts.push(self.fullLMAccountList()[i].accountNumber.value);
                    }

                    self.loadLMTemplate(false);
                    self.loadLMTemplate(true);

                    return false;
                }

                self.selectedLMAccounts.removeAll();
                self.loadLMTemplate(false);
                self.loadLMTemplate(true);

                return false;
            }
        };

        self.toggleAllVERCheckbox = function () {
            if (!self.showEditableForm()) {
                self.isAllVERSelected(!self.isAllVERSelected());

                if (self.isAllVERSelected()) {
                    self.selectedVAMEnabledRealAccounts.removeAll();

                    for (let i = 0; i < self.fullVAMEnabledRealAccountList().length; i++) {
                        self.selectedVAMEnabledRealAccounts.push(self.fullVAMEnabledRealAccountList()[i].accountNumber.value);
                    }

                    self.loadVERTemplate(false);
                    self.loadVERTemplate(true);

                    return false;
                }

                self.selectedVAMEnabledRealAccounts.removeAll();
                self.loadVERTemplate(false);
                self.loadVERTemplate(true);

                return false;
            }
        };

        self.toggleAllVRACheckbox = function () {
            if (!self.showEditableForm()) {
                self.isAllVRASelected(!self.isAllVRASelected());

                if (self.isAllVRASelected()) {
                    self.selectedVirtualAccounts.removeAll();

                    for (let i = 0; i < self.fullVirtualAccountList().length; i++) {
                        self.selectedVirtualAccounts.push(self.fullVirtualAccountList()[i].accountNumber.value);
                    }

                    self.loadVRATemplate(false);
                    self.loadVRATemplate(true);

                    return false;
                }

                self.selectedVirtualAccounts.removeAll();
                self.loadVRATemplate(false);
                self.loadVRATemplate(true);

                return false;
            }
        };

        self.selectedCasaAccounts.subscribe(function (newSelectedArray) {
            if (newSelectedArray && newSelectedArray.length > 0) {
                if (newSelectedArray.length === self.fullCasaAccountList().length) {
                    self.isAllCasaSelected(true);
                } else {
                    self.isAllCasaSelected(false);
                }

                if (self.isAccessCreated() && !self.editBackFromReview()) {
                    ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
                        if (self.selectedCasaAccounts().indexOf(item.accountNumber.value) === -1) {
                            ko.utils.arrayForEach(self.fullCasaAccountList(), function (thisItem) {
                                if (thisItem.accountNumber.value === item.accountNumber.value && thisItem.accountType === item.accountType) {
                                    self.selectedAccountsResources.remove(item);

                                    self.newObject = {
                                        accountNumber: {
                                            displayValue: "",
                                            value: ""
                                        },
                                        accountStatus: "",
                                        displayName: "",
                                        currencyCode: "",
                                        selectedTask: [],
                                        accountType: "CSA",
                                        nonSelectedTask: [],
                                        resourceListCasa: []
                                    };

                                    self.newObject.currencyCode = item.currencyCode;
                                    self.newObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newObject.accountNumber.value = item.accountNumber.value;
                                    self.newObject.accountStatus = item.accountStatus;
                                    self.newObject.displayName = item.displayName;
                                    self.newObject.nonSelectedTask = thisItem.fullResourceTaskList;
                                    self.newObject.resourceListCasa = item.resourceListCasa;
                                    self.selectedAccountsResources().push(self.newObject);
                                }
                            });
                        }
                    });
                }
            } else {
                self.isAllCasaSelected(false);
            }
        });

        self.selectedTdAccounts.subscribe(function (newSelectedArray) {
            if (newSelectedArray && newSelectedArray.length > 0) {
                if (newSelectedArray.length === self.fulltdAccountList().length) {
                    self.isAllTdSelected(true);
                } else {
                    self.isAllTdSelected(false);
                }

                if (self.isAccessCreated() && !self.editBackFromReview()) {
                    ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
                        if (self.selectedTdAccounts().indexOf(item.accountNumber.value) === -1) {
                            ko.utils.arrayForEach(self.fulltdAccountList(), function (thisItem) {
                                if (thisItem.accountNumber.value === item.accountNumber.value && thisItem.accountType === item.accountType) {
                                    self.selectedAccountsResources.remove(item);

                                    self.newObject = {
                                        accountNumber: {
                                            displayValue: "",
                                            value: ""
                                        },
                                        displayName: "",
                                        accountStatus: "",
                                        currencyCode: "",
                                        selectedTask: [],
                                        accountType: "TRD",
                                        nonSelectedTask: [],
                                        resourceListTD: []
                                    };

                                    self.newObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newObject.accountNumber.value = item.accountNumber.value;
                                    self.newObject.accountStatus = item.accountStatus;
                                    self.newObject.displayName = item.displayName;
                                    self.newObject.currencyCode = item.currencyCode;
                                    self.newObject.nonSelectedTask = thisItem.fullResourceTaskList;
                                    self.newObject.resourceListTD = item.resourceListTD;
                                    self.selectedAccountsResources().push(self.newObject);
                                }
                            });
                        }
                    });
                }
            } else {
                self.isAllTdSelected(false);
            }
        });

        self.selectedLoanAccounts.subscribe(function (newSelectedArray) {
            if (newSelectedArray && newSelectedArray.length > 0) {
                if (newSelectedArray.length === self.fullloanAccountList().length) {
                    self.isAllLoansSelected(true);
                } else {
                    self.isAllLoansSelected(false);
                }

                if (self.isAccessCreated() && !self.editBackFromReview()) {
                    ko.utils.arrayForEach(self.selectedAccountsResources(), function (item) {
                        if (self.selectedLoanAccounts().indexOf(item.accountNumber.value) === -1) {
                            ko.utils.arrayForEach(self.fullloanAccountList(), function (thisItem) {
                                if (thisItem.accountNumber.value === item.accountNumber.value && thisItem.accountType === item.accountType) {
                                    self.selectedAccountsResources.remove(item);

                                    self.newObject = {
                                        accountNumber: {
                                            displayValue: "",
                                            value: ""
                                        },
                                        accountStatus: "",
                                        displayName: "",
                                        currencyCode: "",
                                        selectedTask: [],
                                        accountType: "LON",
                                        nonSelectedTask: [],
                                        resourceListLON: []
                                    };

                                    self.newObject.accountNumber.value = item.accountNumber.value;
                                    self.newObject.accountNumber.displayValue = item.accountNumber.displayValue;
                                    self.newObject.accountStatus = item.accountStatus;
                                    self.newObject.currencyCode = item.currencyCode;
                                    self.newObject.nonSelectedTask = thisItem.fullResourceTaskList;
                                    self.newObject.resourceListLON = item.resourceListLON;
                                    self.newObject.displayName = item.displayName;
                                    self.selectedAccountsResources().push(self.newObject);
                                }
                            });
                        }
                    });
                }
            } else {
                self.isAllLoansSelected(false);
            }
        });

        self.isAllCasaSelected.subscribe(function (newValue) {
            if (newValue === true) {
                self.mapAllCasaAccounts(["ALL"]);
            } else {
                self.mapAllCasaAccounts.removeAll();
            }
        });

        self.isAllTdSelected.subscribe(function (newValue) {
            if (newValue === true) {
                self.mapAllTdAccounts(["ALL"]);
            } else {
                self.mapAllTdAccounts.removeAll();
            }
        });

        self.isAllLoansSelected.subscribe(function (newValue) {
            if (newValue === true) {
                self.mapAllLoanAccounts(["ALL"]);
            } else {
                self.mapAllLoanAccounts.removeAll();
            }
        });

        self.LoadTransactionMappingComponent = function () {
            self.disableAccountSelection(true);

            const params = {
                disableAccountSelection: self.disableAccountSelection,
                highlightedTabTrans: self.highlightedTabTrans,
                accessLevel: self.accessLevel,
                selectedCasaAccounts: self.selectedCasaAccounts,
                selectedTdAccounts: self.selectedTdAccounts,
                selectedLoanAccounts: self.selectedLoanAccounts,
                selectedLMAccounts: self.selectedLMAccounts,
                selectedVAMEnabledRealAccounts: self.selectedVAMEnabledRealAccounts,
                selectedVirtualAccounts: self.selectedVirtualAccounts,
                casaTransactionTabVisited: self.casaTransactionTabVisited,
                loanTransactionTabVisited: self.loanTransactionTabVisited,
                tdTransactionTabVisited: self.tdTransactionTabVisited,
                virtualAccountTabVisited: self.virtualAccountTabVisited,
                vamEnabledRealAccountTabVisited: self.vamEnabledRealAccountTabVisited,
                lmTransactionTabVisited: self.LMTransactionTabVisited,
                fullCasaAccountList: self.fullCasaAccountList,
                fulltdAccountList: self.fulltdAccountList,
                fullloanAccountList: self.fullloanAccountList,
                fullLMAccountList: self.fullLMAccountList,
                fullVirtualAccountList: self.fullVirtualAccountList,
                fullVAMEnabledRealAccountList: self.fullVAMEnabledRealAccountList,
                showEditableForm: self.showEditableForm,
                isAccessUpdated: self.isAccessUpdated,
                isAccessCreated: self.isAccessCreated,
                partyID: self.partyID,
                partyName: self.partyName,
                selectedUserId: self.selectedUserId,
                selectedUserName: self.selectedUserName,
                enableFormToUpdate: self.enableFormToUpdate,
                editButtonPressed: self.editButtonPressed,
                resourceListCasa: self.resourceListCasa,
                resourceListTD: self.resourceListTD,
                resourceListLON: self.resourceListLON,
                resourceListLM: self.resourceListLM,
                resourceListVER: self.resourceListVER,
                resourceListVRA: self.resourceListVRA,
                selectedAccountsResources: self.selectedAccountsResources,
                showConfirmationForCreate: self.showConfirmationForCreate,
                parentAccessLevel: self.parentAccessLevel,
                updateAccess: self.updateAccess,
                getCasaPayload: self.getCasaPayload,
                getTDPayload: self.getTDPayload,
                getLoanPayload: self.getLoanPayload,
                getLMPayload: self.getLMPayload,
                getVERPayload: self.getVERPayload,
                getVRAPayload: self.getVRAPayload,
                casaRequestPayload: self.casaRequestPayload,
                tdRequestPayload: self.tdRequestPayload,
                loanRequestPayload: self.loanRequestPayload,
                lmRequestPayload: self.lmRequestPayload,
                virtualRequestPayload: self.virtualRequestPayload,
                vamEnabledRealAccRequestPayload: self.vamEnabledRealAccRequestPayload,
                isBatchEnable: self.isBatchEnable
            };

            rootParams.dashboard.loadComponent("account-transactions-mapping", params);
        };

        self.isDataModified = function () {
            if (self.selectedTdAccounts().length > 0 || self.selectedLoanAccounts().length > 0 || self.selectedCasaAccounts().length > 0) {
                $("#backConfirmationModal").trigger("openModal");
            } else {
                self.backFirst();
            }
        };

        self.backFirst = function () {
            self.fullCasaAccountList([]);
            self.fulltdAccountList([]);
            self.fullloanAccountList([]);
            self.fullLMAccountList([]);
            self.fullVAMEnabledRealAccountList([]);
            self.fullVirtualAccountList([]);
            self.selectedTdAccounts([]);
            self.selectedLoanAccounts([]);
            self.selectedCasaAccounts([]);
            self.selectedLMAccounts([]);
            self.selectedVirtualAccounts([]);
            self.selectedVAMEnabledRealAccounts([]);
            self.backForPartyAccess(true);
            self.editButtonPressed(false);

            if (self.accessLevel() === "PARTY" || self.accessLevel() === "LINKAGE") {

                rootParams.dashboard.loadComponent("access-management-base", ko.mapping.toJS({
                    userListLoaded: self.userListLoaded,
                    selectedAccountsResources: self.selectedAccountsResources,
                    accessLevel: self.accessLevel,
                    showPartyValidateComponent: self.showPartyValidateComponent,
                    casaExclusionAccountNumberList: self.casaExclusionAccountNumberList,
                    tdExclusionAccountNumberList: self.tdExclusionAccountNumberList,
                    loanExclusionAccountNumberList: self.loanExclusionAccountNumberList,
                    lmExclusionAccountNumberList: self.lmExclusionAccountNumberList,
                    virtualExclusionAccountNumberList: self.virtualExclusionAccountNumberList,
                    vamEnabledRealExclusionAccountNumberList: self.vamEnabledRealExclusionAccountNumberList,
                    updatedCASAExclusionNumberList: self.updatedCASAExclusionNumberList,
                    updatedTDExclusionNumberList: self.updatedTDExclusionNumberList,
                    updatedLOANExclusionNumberList: self.updatedLOANExclusionNumberList,
                    updatedLMExclusionNumberList: self.updatedLMExclusionNumberList,
                    updatedVirtualExclusionNumberList: self.updatedVirtualExclusionNumberList,
                    updatedVAMEnabledRealExclusionNumberList: self.updatedVAMEnabledRealExclusionNumberList,
                    partyID: self.partyID,
                    backForPartyAccess: self.backForPartyAccess,
                    loadUserListComponent: self.loadUserListComponent,
                    maskedPartyId: self.maskedPartyId,
                    partyName: self.partyName,
                    fullCasaAccountList: self.fullCasaAccountList,
                    fulltdAccountList: self.fulltdAccountList,
                    fullloanAccountList: self.fullloanAccountList,
                    fullLMAccountList: self.fullLMAccountList,
                    fullVirtualAccountList: self.fullVirtualAccountList,
                    fullVAMEnabledRealAccountList: self.fullVAMEnabledRealAccountList,
                    selectedVAMEnabledRealAccounts: self.selectedVAMEnabledRealAccounts,
                    selectedVirtualAccounts: self.selectedVirtualAccounts,
                    selectedTdAccounts: self.selectedTdAccounts,
                    selectedLoanAccounts: self.selectedLoanAccounts,
                    selectedCasaAccounts: self.selectedCasaAccounts,
                    selectedLMAccounts: self.selectedLMAccounts,
                    casaFullResourceTaskList: self.casaFullResourceTaskList,
                    tdFullResourceTaskList: self.tdFullResourceTaskList,
                    loanFullResourceTaskList: self.loanFullResourceTaskList,
                    lmFullResourceTaskList: self.lmFullResourceTaskList,
                    virtualFullResourceTaskList: self.virtualFullResourceTaskList,
                    vamEnabledRealFullResourceTaskList: self.vamEnabledRealFullResourceTaskList,
                    selectedUserId: self.selectedUserId,
                    showEditableForm: self.showEditableForm,
                    resourceListCasa: self.resourceListCasa,
                    resourceListTD: self.resourceListTD,
                    resourceListLON: self.resourceListLON,
                    resourceListLM: self.resourceListLM,
                    resourceListVER: self.resourceListVER,
                    resourceListVRA: self.resourceListVRA,
                    accountAccessSummaryObject: self.accountAccessSummaryObject,
                    selectedUserName: self.selectedUserName,
                    transactionName: self.transactionName,
                    isCasaAllowed: self.isCasaAllowed,
                    isTDAllowed: self.isTDAllowed,
                    isLoanAllowed: self.isLoanAllowed,
                    isLMAllowed: self.isLMAllowed,
                    isVirtualAllowed: self.isVirtualAllowed,
                    isVAMEnabledRealAllowed: self.isVAMEnabledRealAllowed,
                    showModuleToMap: self.showModuleToMap,
                    loanAccountAccessId: self.loanAccountAccessId,
                    casaAccountAccessId: self.casaAccountAccessId,
                    tdAccountAccessId: self.tdAccountAccessId,
                    lmAccountAccessId: self.lmAccountAccessId,
                    virtualAccountAccessId: self.virtualAccountAccessId,
                    vamEnabledRealAccountAccessId: self.vamEnabledRealAccountAccessId,
                    casaAccountNumbersArray: self.casaAccountNumbersArray,
                    tdAccountNumbersArray: self.tdAccountNumbersArray,
                    loanAccountNumbersArray: self.loanAccountNumbersArray,
                    lmAccountNumbersArray: self.lmAccountNumbersArray,
                    virtualAccountNumbersArray: self.virtualAccountNumbersArray,
                    vamEnabledRealAccountNumbersArray: self.vamEnabledRealAccountNumbersArray,
                    showDeleteButton: self.showDeleteButton,
                    casaAccountTabVisited: self.casaAccountTabVisited,
                    lmAccountTabVisited: self.lmAccountTabVisited,
                    tdAccountTabVisited: self.tdAccountTabVisited,
                    loanAccountTabVisited: self.loanAccountTabVisited,
                    virtualAccountTabVisited: self.virtualAccountTabVisited,
                    vamEnabledRealAccountTabVisited: self.vamEnabledRealAccountTabVisited,
                    casaTransactionTabVisited: self.casaTransactionTabVisited,
                    tdTransactionTabVisited: self.tdTransactionTabVisited,
                    loanTransactionTabVisited: self.loanTransactionTabVisited,
                    lmTransactionTabVisited: self.lmTransactionTabVisited,
                    virtualTransactionTabVisited: self.virtualTransactionTabVisited,
                    vamEnabledRealAccTransactionTabVisited: self.vamEnabledRealAccTransactionTabVisited,
                    casaAllowedButtonsPressed: self.casaAllowedButtonsPressed,
                    tdAllowedButtonsPressed: self.tdAllowedButtonsPressed,
                    loanAllowedButtonsPressed: self.loanAllowedButtonsPressed,
                    lmAllowedButtonsPressed: self.lmAllowedButtonsPressed,
                    virtualAllowedButtonsPressed: self.virtualAllowedButtonsPressed,
                    vamEnabledRealAllowedButtonsPressed: self.vamEnabledRealAllowedButtonsPressed,
                    disableAccountSelection: self.disableAccountSelection,
                    highlightedTabTrans: self.highlightedTabTrans,
                    editButtonPressed: self.editButtonPressed,
                    casaRequestPayload: self.casaRequestPayload,
                    tdRequestPayload: self.tdRequestPayload,
                    loanRequestPayload: self.loanRequestPayload,
                    lmRequestPayload: self.lmRequestPayload,
                    virtualRequestPayload: self.virtualRequestPayload,
                    vamEnabledRealAccRequestPayload: self.vamEnabledRealAccRequestPayload,
                    selectedCasaPolicy: self.selectedCasaPolicy,
                    selectedTdPolicy: self.selectedTdPolicy,
                    selectedLoanPolicy: self.selectedLoanPolicy,
                    selectedLMPolicy: self.selectedLMPolicy,
                    selectedVirtualPolicy: self.selectedVirtualPolicy,
                    selectedVamEnabledRealAccPolicy: self.selectedVamEnabledRealAccPolicy,
                    selectedVirtualPolicyChecked: self.selectedVirtualPolicyChecked,
                    selectedVERPolicyChecked: self.selectedVERPolicyChecked,
                    isBatchEnable: self.isBatchEnable,
                    selectedCasaPolicyChecked: self.selectedCasaPolicyChecked,
                    selectedTdPolicyChecked: self.selectedTdPolicyChecked,
                    selectedLoanPolicyChecked: self.selectedLoanPolicyChecked,
                    selectedLMPolicyChecked: self.selectedLMPolicyChecked,
                    transactionNames: self.transactionNames,
                    createObservables: self.createObservables
                }));
            } else if (self.accessLevel() === "USER") {
                self.loadUserListComponent(true);

                const params = ko.mapping.toJS({
                    userListLoaded: self.userListLoaded,
                    selectedAccountsResources: self.selectedAccountsResources,
                    accessLevel: self.accessLevel,
                    showPartyValidateComponent: self.showPartyValidateComponent,
                    casaExclusionAccountNumberList: self.casaExclusionAccountNumberList,
                    tdExclusionAccountNumberList: self.tdExclusionAccountNumberList,
                    loanExclusionAccountNumberList: self.loanExclusionAccountNumberList,
                    lmExclusionAccountNumberList: self.lmExclusionAccountNumberList,
                    virtualExclusionAccountNumberList: self.virtualExclusionAccountNumberList,
                    vamEnabledRealExclusionAccountNumberList: self.vamEnabledRealExclusionAccountNumberList,
                    updatedCASAExclusionNumberList: self.updatedCASAExclusionNumberList,
                    updatedTDExclusionNumberList: self.updatedTDExclusionNumberList,
                    updatedLOANExclusionNumberList: self.updatedLOANExclusionNumberList,
                    updatedLMExclusionNumberList: self.updatedLMExclusionNumberList,
                    updatedVirtualExclusionNumberList: self.updatedVirtualExclusionNumberList,
                    updatedVAMEnabledRealExclusionNumberList: self.updatedVAMEnabledRealExclusionNumberList,
                    partyID: self.partyID,
                    backForPartyAccess: self.backForPartyAccess,
                    loadUserListComponent: self.loadUserListComponent,
                    maskedPartyId: self.maskedPartyId,
                    partyName: self.partyName,
                    fullCasaAccountList: self.fullCasaAccountList,
                    fulltdAccountList: self.fulltdAccountList,
                    fullloanAccountList: self.fullloanAccountList,
                    fullLMAccountList: self.fullLMAccountList,
                    fullVirtualAccountList: self.fullVirtualAccountList,
                    fullVAMEnabledRealAccountList: self.fullVAMEnabledRealAccountList,
                    selectedTdAccounts: self.selectedTdAccounts,
                    selectedLoanAccounts: self.selectedLoanAccounts,
                    selectedCasaAccounts: self.selectedCasaAccounts,
                    selectedLMAccounts: self.selectedLMAccounts,
                    selectedVAMEnabledRealAccounts: self.selectedVAMEnabledRealAccounts,
                    selectedVirtualAccounts: self.selectedVirtualAccounts,
                    casaFullResourceTaskList: self.casaFullResourceTaskList,
                    tdFullResourceTaskList: self.tdFullResourceTaskList,
                    loanFullResourceTaskList: self.loanFullResourceTaskList,
                    lmFullResourceTaskList: self.lmFullResourceTaskList,
                    virtualFullResourceTaskList: self.virtualFullResourceTaskList,
                    vamEnabledRealFullResourceTaskList: self.vamEnabledRealFullResourceTaskList,
                    selectedUserId: self.selectedUserId,
                    showEditableForm: self.showEditableForm,
                    resourceListCasa: self.resourceListCasa,
                    resourceListTD: self.resourceListTD,
                    resourceListLON: self.resourceListLON,
                    resourceListLM: self.resourceListLM,
                    resourceListVER: self.resourceListVER,
                    resourceListVRA: self.resourceListVRA,
                    accountAccessSummaryObject: self.accountAccessSummaryObject,
                    selectedUserName: self.selectedUserName,
                    transactionName: self.transactionName,
                    isCasaAllowed: self.isCasaAllowed,
                    isTDAllowed: self.isTDAllowed,
                    isLoanAllowed: self.isLoanAllowed,
                    isLMAllowed: self.isLMAllowed,
                    isVAMEnabledRealAllowed: self.isVAMEnabledRealAllowed,
                    isVirtualAllowed: self.isVirtualAllowed,
                    showModuleToMap: self.showModuleToMap,
                    loanAccountAccessId: self.loanAccountAccessId,
                    casaAccountAccessId: self.casaAccountAccessId,
                    tdAccountAccessId: self.tdAccountAccessId,
                    lmAccountAccessId: self.lmAccountAccessId,
                    virtualAccountAccessId: self.virtualAccountAccessId,
                    vamEnabledRealAccountAccessId: self.vamEnabledRealAccountAccessId,
                    casaAccountNumbersArray: self.casaAccountNumbersArray,
                    tdAccountNumbersArray: self.tdAccountNumbersArray,
                    loanAccountNumbersArray: self.loanAccountNumbersArray,
                    lmAccountNumbersArray: self.lmAccountNumbersArray,
                    virtualAccountNumbersArray: self.virtualAccountNumbersArray,
                    vamEnabledRealAccountNumbersArray: self.vamEnabledRealAccountNumbersArray,
                    showDeleteButton: self.showDeleteButton,
                    casaAccountTabVisited: self.casaAccountTabVisited,
                    tdAccountTabVisited: self.tdAccountTabVisited,
                    loanAccountTabVisited: self.loanAccountTabVisited,
                    lmAccountTabVisited: self.lmAccountTabVisited,
                    virtualAccountTabVisited: self.virtualAccountTabVisited,
                    vamEnabledRealAccountTabVisited: self.vamEnabledRealAccountTabVisited,
                    casaTransactionTabVisited: self.casaTransactionTabVisited,
                    tdTransactionTabVisited: self.tdTransactionTabVisited,
                    loanTransactionTabVisited: self.loanTransactionTabVisited,
                    lmTransactionTabVisited: self.lmTransactionTabVisited,
                    vamEnabledRealAccTransactionTabVisited: self.vamEnabledRealAccTransactionTabVisited,
                    virtualTransactionTabVisited: self.virtualTransactionTabVisited,
                    casaAllowedButtonsPressed: self.casaAllowedButtonsPressed,
                    tdAllowedButtonsPressed: self.tdAllowedButtonsPressed,
                    loanAllowedButtonsPressed: self.loanAllowedButtonsPressed,
                    lmAllowedButtonsPressed: self.lmAllowedButtonsPressed,
                    virtualAllowedButtonsPressed: self.virtualAllowedButtonsPressed,
                    vamEnabledRealAllowedButtonsPressed: self.vamEnabledRealAllowedButtonsPressed,
                    disableAccountSelection: self.disableAccountSelection,
                    highlightedTabTrans: self.highlightedTabTrans,
                    editButtonPressed: self.editButtonPressed,
                    casaRequestPayload: self.casaRequestPayload,
                    tdRequestPayload: self.tdRequestPayload,
                    loanRequestPayload: self.loanRequestPayload,
                    lmRequestPayload: self.lmRequestPayload,
                    virtualRequestPayload: self.virtualRequestPayload,
                    vamEnabledRealAccRequestPayload: self.vamEnabledRealAccRequestPayload,
                    selectedLMPolicy: self.selectedLMPolicy,
                    selectedVirtualPolicy: self.selectedVirtualPolicy,
                    selectedVamEnabledRealAccPolicy: self.selectedVamEnabledRealAccPolicy,
                    selectedVirtualPolicyChecked: self.selectedVirtualPolicyChecked,
                    selectedVERPolicyChecked: self.selectedVERPolicyChecked,
                    selectedCasaPolicy: self.selectedCasaPolicy,
                    selectedTdPolicy: self.selectedTdPolicy,
                    selectedLoanPolicy: self.selectedLoanPolicy,
                    isBatchEnable: self.isBatchEnable,
                    selectedCasaPolicyChecked: self.selectedCasaPolicyChecked,
                    selectedTdPolicyChecked: self.selectedTdPolicyChecked,
                    selectedLoanPolicyChecked: self.selectedLoanPolicyChecked,
                    selectedLMPolicyChecked: self.selectedLMPolicyChecked,
                    transactionNames: self.transactionNames,
                    createObservables: self.createObservables,
                    cameBack: self.cameBack
                });

                rootParams.dashboard.loadComponent("summary", params);
            }

        };

        self.deleteClicked = function () {
            $("#deleteConfirmationModal").trigger("openModal");
        };

        self.backOnEdit = function () {
            $("#backConfirmationModal").trigger("openModal");
        };

        self.hideDelete = function () {
            $("#deleteConfirmationModal").hide();
        };

        self.hideBack = function () {
            $("#backConfirmationModal").hide();
        };

        $(document).on("change", "div input:checkbox", function () {
            if ($(this).prop("checked") === true) {
                $(this).addClass("oj-selected");
            } else {
                $(this).removeClass("oj-selected");
            }
        });

        self.dispose = function () {
            isCasaAllowedSubscription.dispose();
            menuselectionSubscription.dispose();
        };
    };
});