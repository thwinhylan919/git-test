define([
    "ojL10n!resources/nls/counter-party-list",
    "knockout",
    "ojs/ojcore",
    "./model",
    "jquery",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojavatar",
    "ojs/ojpagingtabledatasource",
    "ojs/ojpagingcontrol"
], function (resourceBundle, ko, oj, Model, $) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.counterPartiesList = ko.observable();
        self.counterPartiesgetprogramCode = ko.observable();
        self.searchCounterparty = ko.observable();
        self.showList = ko.observable(false);
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        self.filterCriterion = ko.observable("BOTH");
        params.baseModel.registerElement("search-box");
        self.activeLayout = ko.observable();
        self.counterpartiesData = ko.observableArray();

        const queryParams = {
            criteria: [{
                operand: "relation",
                operator: "ENUM",
                value: ["BOTH"]
            }]
        };

        if (params.rootModel.isEditMode) {
            params.dashboard.headerName(self.nls.editProgramHeader);
        }

        params.baseModel.registerComponent("view-associated-party-details", "supply-chain-finance");
        params.baseModel.registerComponent("onboard-counter-party-form", "supply-chain-finance");

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

        const statusArray = [],
            jsonData = self.nls.status,
            keys = Object.keys(jsonData);

        keys.forEach(function (key) {
            statusArray.push({
                key: key,
                value: jsonData[key],
                style: key.toLowerCase()
            });
        });

        Model.mepartyget().then(function (response) {
            self.partyId(response.party.id.displayValue);
            self.partyName(response.party.personalDetails.fullName);
        });

        self.onboardParty = function () {
            params.dashboard.loadComponent("onboard-counter-party-form");
        };

        self.fetchCounterPartyList = function (queryParams) {
            Model.counterPartiesget(JSON.stringify(queryParams)).then(function (response) {
                self.showList(false);

                self.counterPartiesList(response.associatedParties);

                self.counterpartiesData.removeAll();

                for (let j = 0; j < self.counterPartiesList().length; j++) {
                    let spokeInitials = "";

                    const parts = self.counterPartiesList()[j].name.split(/\s+/);

                    for (let i = 0; i < parts.length; i++) {
                        if (parts[i].length > 0 && parts[i] !== "") {
                            spokeInitials = spokeInitials + parts[i][0];
                        }

                        if (spokeInitials.length === 2) {
                            break;
                        }
                    }

                    switch (self.counterPartiesList()[j].relation) {
                        case "COUNTER_PARTY":
                            self.counterPartiesList()[j].relationship = self.nls.Search.Counterparty;
                            break;
                        case "ANCHOR":
                            self.counterPartiesList()[j].relationship = self.nls.Search.Anchor;
                            break;
                        case "BOTH":
                            self.counterPartiesList()[j].relationship = self.nls.Search.Anchor + "," + self.nls.Search.Counterparty;
                            break;
                        default:
                            self.counterPartiesList()[j].relationship = "";
                    }

                    for (let k = 0; k < statusArray.length; k++) {
                        if (self.counterPartiesList()[j].status === statusArray[k].key) {
                            self.counterPartiesList()[j].statusValue = statusArray[k].value;
                            self.counterPartiesList()[j].statusColor = statusArray[k].style;
                            break;
                        }
                    }

                    self.counterpartiesData.push({
                        spokeInitials: spokeInitials,
                        relation: self.counterPartiesList()[j].relation,
                        roleRelation: self.counterPartiesList()[j].relationship,
                        spokeName: self.counterPartiesList()[j].name,
                        spokeId: self.counterPartiesList()[j].id.displayValue,
                        id: self.counterPartiesList()[j].id.value,
                        partyStatus: self.counterPartiesList()[j].statusValue,
                        statusCode: self.counterPartiesList()[j].status,
                        statusColor: self.counterPartiesList()[j].statusColor,
                        taxRegistrationNumber: self.counterPartiesList()[j].taxRegistrationNumber ? self.counterPartiesList()[j].taxRegistrationNumber : self.nls.Search.notApplicable,
                        spokeAddress: self.counterPartiesList()[j].address ? self.counterPartiesList()[j].address.line1 + "," + self.counterPartiesList()[j].address.country : "",
                        uniqueId: Math.floor((Math.random() * 10000) + 1)
                    });
                }

                ko.tasks.runEarly();

                self.showList(true);
            });
        };

        self.fetchCounterPartyList(queryParams);

        self.onSelectionChange = function (changedValue) {
            const queryParams = {
                criteria: [{
                    operand: "relation",
                    operator: "ENUM",
                    value: [changedValue.detail.value]
                }]
            };

            self.fetchCounterPartyList(queryParams);
        };

        self.dataSource26 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.counterpartiesData, {
            idAttribute: "uniqueId"
        }));

        const buttonview100Subscriber = self.activeLayout.subscribe(function () {
            const listview = document.getElementById("listview");

            $(listview).toggleClass("oj-listview-card-layout");
            listview.refresh();
        });

        self.formatLayout = function () {
            if (self.showList()) {
                const listview = document.getElementById("listview");

                if (self.activeLayout() === "listView") {
                    $(listview).toggleClass("oj-listview-card-layout");
                }
            }
        };

        self.onClickCounterparty = function (data) {
            params.dashboard.loadComponent("view-associated-party-details", {
                partyId: data.id,
                relation: data.relation
            });
        };

        self.onHoverEvent = function (x, z) {
            const y = document.getElementById(x + "_hover");

            if(z.fromElement && z.fromElement.id === y.id) {
                $(y).removeClass("hover-color");
            } else {
                $(y).addClass("hover-color");
            }
        };

        self.dispose = function () {
            buttonview100Subscriber.dispose();
        };
    };
});