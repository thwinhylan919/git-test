define([
    "ojL10n!resources/nls/create-program-link",
    "ojs/ojcore",
    "jquery",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojbutton",
    "ojs/ojselectcombobox",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojcheckboxset",
    "ojs/ojavatar",
    "ojs/ojindexermodeltreedatasource"
], function (resourceBundle, oj, $, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);

        if (params.rootModel.isEditMode) {
            params.dashboard.headerName(self.nls.editProgramHeader);
        }

        self.searchCounterparty = ko.observable();
        self.showSearch = ko.observable(false);
        self.showList = ko.observable(false);
        self.showAll = params.rootModel.showAll;
        self.showSelected = ko.observable(false);
        self.unselectedItems = ko.observableArray();
        self.activeLayout = ko.observable();
        self.fetchedCounterparties = params.rootModel.fetchedCounterparties;
        self.selectedCounterparties = ko.observableArray();

        if (self.fetchedCounterparties().length > 0) {
            self.showList(true);
        }

        self.layoutViewRadios = [{
                id: "thumbView",
                icon: "oj-fwk-icon-grid oj-fwk-icon",
                label: self.nls.cardView
            },
            {
                id: "listView",
                icon: "oj-fwk-icon-list oj-fwk-icon",
                label: self.nls.listView
            }
        ];

        self.activeLayout("thumbView");

        self.onSpokeSelect = function (event, data) {
            if (event.detail.value[0]) {
                data.borderColor("select-color");
            } else {
                data.borderColor("unselect-color");
            }
        };

        const findAvailableSectionlistview = function (section) {
                const missing = self.dataSource26.getMissingSections();

                if (missing.indexOf(section) > -1) {
                    const sections = self.dataSource26().getIndexableSections(),
                        index = sections.indexOf(section);

                    if (index + 1 < sections.length) {
                        section = sections[index + 1];

                        return findAvailableSectionlistview(section);
                    }

                    return null;

                }

                return section;

            },
            handleSectionClicklistview = function (section) {
                return new Promise(function (resolve, reject) {
                    try {
                        section = findAvailableSectionlistview(section);

                        if (section !== null) {
                            document.getElementById("listview").scrollToItem({
                                key: section
                            });
                        }

                        resolve(section);
                    } catch (e) {
                        reject(e);
                    }
                });
            };

        self.dataSource26 = new oj.IndexerModelTreeDataSource(self.fetchedCounterparties(), "associatedPartyId.value", handleSectionClicklistview, {
            groupingAttribute: "associatedPartyName"
        });

        function buttonviewValueChange() {
            const listview = document.getElementById("listview");

            $(listview).toggleClass("oj-listview-card-layout");
            listview.refresh();
        }

        const buttonviewSubscriber = self.activeLayout.subscribe(buttonviewValueChange);

        self.onClickShowSelected = function () {
            const tempArray = [];

            for (let i = 0; i < self.fetchedCounterparties().length; i++) {
                if (self.fetchedCounterparties()[i].selected().length === 0) {
                    self.unselectedItems.push(self.fetchedCounterparties()[i]);
                } else {
                    tempArray.push(self.fetchedCounterparties()[i]);
                }
            }

            self.fetchedCounterparties().length = 0;

            for (let j = 0; j < tempArray.length; j++) {
                self.fetchedCounterparties.push(tempArray[j]);
            }

            self.showSelected(true);
            self.showAll(false);

            const listview = document.getElementById("listview");

            listview.refresh();
        };

        self.onClickShowAll = function () {
            self.unselectedItems().length = 0;
            self.showSelected(false);

            const listview = document.getElementById("listview");

            listview.refresh();
        };

        self.onClickSelectAll = function () {
            for (let i = 0; i < self.fetchedCounterparties().length; i++) {
                self.fetchedCounterparties()[i].selected([]);
                self.fetchedCounterparties()[i].selected.push("checked");
            }

            self.unselectedItems().length = 0;
            self.showAll(false);
        };

        self.onClickDeselectAll = function () {
            for (let i = 0; i < self.fetchedCounterparties().length; i++) {
                self.fetchedCounterparties()[i].selected([]);
            }

            self.unselectedItems().length = 0;
            self.showAll(true);
        };

        self.onClickSubmit = function () {
            for (let i = 0; i < self.fetchedCounterparties().length; i++) {
                if (self.fetchedCounterparties()[i].selected().length !== 0) {
                    self.selectedCounterparties.push(self.fetchedCounterparties()[i]);
                }
            }

            if (self.selectedCounterparties().length === 0) {
                params.baseModel.showMessages(null, [self.nls.errorMessage], "ERROR");
            } else {
                self.selectedCounterparties(JSON.parse(JSON.stringify(self.selectedCounterparties())));

                for (let i = 0; i < self.selectedCounterparties().length; i++) {
                    self.selectedCounterparties()[i].id = self.selectedCounterparties()[i].associatedPartyId;
                    self.selectedCounterparties()[i].name = self.selectedCounterparties()[i].associatedPartyName;
                    delete self.selectedCounterparties()[i].associatedPartyId;
                    delete self.selectedCounterparties()[i].associatedPartyName;
                    delete self.selectedCounterparties()[i].associatedPartyInitials;
                    delete self.selectedCounterparties()[i].selected;
                    delete self.selectedCounterparties()[i].sequenceNo;
                    delete self.selectedCounterparties()[i].associatedPartyAddress;
                    delete self.selectedCounterparties()[i].borderColor;
                    delete self.selectedCounterparties()[i].isDisabled;
                    delete self.selectedCounterparties()[i].outstandingInvoice;
                }

                params.rootModel.modelInstance.associatedParties = self.selectedCounterparties;
                params.baseModel.registerComponent("create-program-review", "supply-chain-finance");

                params.dashboard.loadComponent("create-program-review", {
                    createProgram: params.rootModel.createProgram,
                    editProgram: params.rootModel.editProgram,
                    isEditMode: params.rootModel.isEditMode,
                    data: params.rootModel.modelInstance,
                    fetchedCounterparties: self.fetchedCounterparties(),
                    editAssociatedParties: false,
                    showAll: self.showAll()
                });
            }
        };

        self.dispose = function () {
            buttonviewSubscriber.dispose();
        };

        self.onClickCancel = function () {
            params.dashboard.switchModule();
        };

        self.onClickBack = function () {
            params.rootModel.previousStep();
        };
    };
});