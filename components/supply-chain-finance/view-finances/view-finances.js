define([
    "ojL10n!resources/nls/view-finances",
    "./model",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojpagingdataproviderview",
    "ojs/ojarraydataprovider",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojlabel",
    "ojs/ojpopup",
    "ojs/ojswitch",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker"
], function (resourceBundle, Model, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.heading.ViewFinance);
        self.financeSearchResult = ko.observableArray();
        self.financeDataLoaded = ko.observable(false);
        self.partyName = ko.observable();
        self.partyId = ko.observable();
        self.interestAmount = ko.observable();
        self.principalAmount = ko.observable();
        self.currency = ko.observable();
        self.programNameList = ko.observableArray();
        self.programTypesLoaded = ko.observable(true);
        self.programCode = ko.observable();
        self.counterpartyId = ko.observable();
        self.counterPartyList = ko.observableArray();
        self.counterpartiesLoaded = ko.observableArray(false);
        self.showMoreOptionsClicked = ko.observable(false);
        self.lessSearchOptionsClicked = ko.observable(false);
        self.financeRefNo = ko.observable();
        self.financeStatusLoaded = ko.observable(true);
        self.financeStatus = ko.observable();
        self.financeStatusList = ko.observableArray();
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.currencyList = ko.observableArray();
        self.financeCurrency = ko.observable("");
        self.currencyLoaded = ko.observable(false);
        self.fromFinanceAmount = ko.observable();
        self.toFinanceAmount = ko.observable();
        self.requestId = ko.observable();
        params.baseModel.registerElement("amount-input");
        self.refresh = ko.observable(true);
        self.relation = null;
        self.dataSource = ko.observable();

        self.queryParameter = ko.observable({
            criteria: []
        });

        params.baseModel.registerComponent("view-finance-details", "supply-chain-finance");

        Model.mePartyGet().then(function (response) {
            self.partyId(response.party.id.displayValue);
            self.partyName(response.party.personalDetails.fullName);
        });

        if (params.rootModel.previousState) {
            self.programCode(params.rootModel.previousState.programCode);
            self.counterpartyId(params.rootModel.previousState.counterpartyId);
            self.financeRefNo(params.rootModel.previousState.financeRefNo);
            self.financeStatus(params.rootModel.previousState.financeStatus);
            self.fromDate(params.rootModel.previousState.fromDate);
            self.toDate(params.rootModel.previousState.toDate);
            self.financeCurrency(params.rootModel.previousState.financeCurrency);
            self.fromFinanceAmount(params.rootModel.previousState.fromFinanceAmount);
            self.toFinanceAmount(params.rootModel.previousState.toFinanceAmount);
            self.requestId(params.rootModel.previousState.requestId);
            self.queryParameter(params.rootModel.previousState.queryParameter);
            self.lessSearchOptionsClicked(false);
            self.showMoreOptionsClicked(true);
        }

        function onSelectCounterparty(newValue) {

            if (newValue !== "") {
                for (let i = 0; i < self.counterPartyList().length; i++) {
                    if (self.counterPartyList()[i].code === newValue) {
                        self.relation = self.counterPartyList()[i].relation;
                        break;
                    }
                }

                const parameters = {
                        criteria: [{
                            operand: "associatedPartyList.associatedPartyKey.id",
                            operator: "EQUALS",
                            value: [newValue]
                        }, {
                            operand: "role",
                            operator: "ENUM",
                            value: ["B"]
                        }]
                    },

                    promises = [];

                promises.push(Model.programsget(JSON.stringify(parameters)));

                parameters.criteria[1].value = ["S"];

                promises.push(Model.programsget(JSON.stringify(parameters)));

                Promise.all(promises).then(function (array) {
                    self.programNameList().splice(0, self.programNameList().length);

                    self.programTypesLoaded(false);

                    if (array[0].programs[0]) {
                        for (let i = 0; i < array[0].programs.length; i++) {
                            self.programNameList.push({
                                code: array[0].programs[i].programCode,
                                label: array[0].programs[i].programName
                            });
                        }
                    }

                    if (array[1].programs[0]) {
                        for (let i = 0; i < array[1].programs.length; i++) {
                            self.programNameList.push({
                                code: array[1].programs[i].programCode,
                                label: array[1].programs[i].programName
                            });
                        }
                    }

                    ko.tasks.runEarly();
                    self.programTypesLoaded(true);
                });
            }
        }

        Model.financeSearchGet(JSON.stringify(self.queryParameter())).then(function (response) {
            Model.financeStatusget().then(function (statuses) {
                self.financeStatusLoaded(false);
                self.financeSearchResult([]);

                for (let i = 0; i < statuses.enumRepresentations[0].data.length; i++) {
                    if (statuses.enumRepresentations[0].data[i].code !== "OTHERS") {
                        self.financeStatusList().push({
                            description: statuses.enumRepresentations[0].data[i].description,
                            code: statuses.enumRepresentations[0].data[i].code
                        });
                    }
                }

                if (response.finances) {
                    for (let i = 0; i < response.finances.length; i++) {
                        if (response.finances[i].amounts) {
                            for (let j = 0; j < response.finances[i].amounts.length; j++) {
                                if (response.finances[i].amounts[j].type === "OUTSTANDING") {
                                    response.finances[i].outstandingAmount = response.finances[i].amounts[j].totalAmount ? response.finances[i].amounts[j].totalAmount : "-";
                                } else if (response.finances[i].amounts[j].type === "REPAID") {
                                    response.finances[i].repaidAmount = response.finances[i].amounts[j].totalAmount ? response.finances[i].amounts[j].totalAmount : "-";
                                }
                            }
                        }

                        let statusFound = false;

                        if (response.finances[i].status) {
                            for (let j = 0; j < self.financeStatusList().length; j++) {
                                if (self.financeStatusList()[j].code === response.finances[i].status) {
                                    response.finances[i].statusDescription = self.financeStatusList()[j].description;
                                    statusFound = true;
                                    break;
                                }
                            }

                            if (!statusFound) {
                                response.finances[i].statusDescription = self.nls.FinanceList.others;
                            }

                            statusFound = false;
                        } else {
                            response.finances[i].statusDescription = self.nls.FinanceList.inProcess;
                        }

                        response.finances[i].requestId = response.finances[i].requestId ? response.finances[i].requestId : "-";

                        self.financeSearchResult().push(response.finances[i]);
                    }

                    self.financeDataLoaded(true);
                }

                self.dataSource(new oj.PagingDataProviderView(new oj.ArrayDataProvider(self.financeSearchResult(), {
                    idAttribute: "id"
                })));

                ko.tasks.runEarly();
                self.financeStatusLoaded(true);

            });
        });

        const qQuery = {
            criteria: [{
                operand: "relation",
                operator: "ENUM",
                value: ["BOTH"]
            }]
        };

        Model.counterPartiesget(JSON.stringify(qQuery)).then(function (response) {
            self.counterPartyList().splice(0, self.counterPartyList().length);

            self.counterpartiesLoaded(false);

            for (let i = 0; i < response.associatedParties.length; i++) {
                self.counterPartyList.push({
                    code: response.associatedParties[i].id.value,
                    label: response.associatedParties[i].name,
                    relation: response.associatedParties[i].relation
                });
            }

            if (self.counterpartyId() && self.counterpartyId() !== null && self.counterpartyId() !== "") {
                onSelectCounterparty(self.counterpartyId());
            }

            ko.tasks.runEarly();

            self.counterpartiesLoaded(true);
        });

        self.onClickFinance = function (data) {
            params.dashboard.loadComponent("view-finance-details", {
                financeNo: data.id,
                financeStatusDesc: data.statusDescription,
                programCode: self.programCode(),
                counterpartyId: self.counterpartyId(),
                financeRefNo: self.financeRefNo(),
                financeStatus: self.financeStatus(),
                fromDate: self.fromDate(),
                toDate: self.toDate(),
                financeCurrency: self.financeCurrency(),
                fromFinanceAmount: self.fromFinanceAmount(),
                toFinanceAmount: self.toFinanceAmount(),
                requestId: self.requestId(),
                queryParameter: self.queryParameter()
            });
        };

        self.openBreakup = function (data) {
            const popUpId = "#repaid-amount-".concat(data.id);

            for (let i = 0; i < data.amounts.length; i++) {
                if (data.amounts[i].type === "REPAID") {
                    self.principalAmount(data.amounts[i].principalAmount ? data.amounts[i].principalAmount.amount : "-");
                    self.interestAmount(data.amounts[i].interestAmount ? data.amounts[i].interestAmount.amount : "-");
                    break;
                }
            }

            self.currency(data.totalAmount.currency);

            const popup = document.getElementById("breakUpPopUp");

            popup.open(popUpId);
        };

        self.onClickMoreSearchOptions64 = function () {
            self.lessSearchOptionsClicked(false);
            self.showMoreOptionsClicked(true);
        };

        self.onClickLessSearchOptions4 = function () {
            self.lessSearchOptionsClicked(true);
            self.showMoreOptionsClicked(false);
        };

        self.onClickSearch = function () {
            self.queryParameter().criteria = [];

            if (self.programCode() !== undefined && self.programCode() !== "") {
                self.queryParameter().criteria.push({
                    operand: "programCode",
                    operator: "EQUALS",
                    value: [self.programCode()]
                });
            }

            if (self.financeStatus() !== undefined && self.financeStatus() !== "") {
                self.queryParameter().criteria.push({
                    operand: "status",
                    operator: "IN",
                    value: [self.financeStatus()]
                });
            }

            if (self.financeRefNo() !== undefined && self.financeRefNo() !== "") {
                self.queryParameter().criteria.push({
                    operand: "financeKey.id",
                    operator: "EQUALS",
                    value: [self.financeRefNo()]
                });
            }

            if (self.requestId() !== undefined && self.requestId() !== "") {
                self.queryParameter().criteria.push({
                    operand: "requestId",
                    operator: "EQUALS",
                    value: [self.requestId()]
                });
            }

            if (self.fromDate() !== undefined && self.fromDate() !== "") {
                self.queryParameter().criteria.push({
                    operand: "fromDueDate",
                    operator: "EQUALS",
                    value: [self.fromDate()]
                });
            }

            if (self.toDate() !== undefined && self.toDate() !== "") {
                self.queryParameter().criteria.push({
                    operand: "toDueDate",
                    operator: "EQUALS",
                    value: [self.toDate()]
                });
            }

            if (self.relation !== null && self.relation !== "" && self.counterpartyId() !== undefined && self.counterpartyId() !== "") {
                self.queryParameter().criteria.push({
                    operand: "relation",
                    operator: "ENUM",
                    value: [self.relation]
                });

                self.queryParameter().criteria.push({
                    operand: "counterpartyId",
                    operator: "EQUALS",
                    value: [self.counterpartyId()]
                });
            }

            if (self.fromFinanceAmount() !== undefined && self.fromFinanceAmount() !== "") {
                self.queryParameter().criteria.push({
                    operand: "fromFinanceAmount",
                    operator: "EQUALS",
                    value: [{
                        currency: self.financeCurrency(),
                        amount: self.fromFinanceAmount()
                    }]
                });
            }

            if (self.toFinanceAmount() !== undefined && self.toFinanceAmount() !== "") {
                self.queryParameter().criteria.push({
                    operand: "toFinanceAmount",
                    operator: "EQUALS",
                    value: [{
                        currency: self.financeCurrency(),
                        amount: self.toFinanceAmount()
                    }]
                });
            }

            if (self.financeCurrency() !== undefined && self.financeCurrency() !== "") {
                self.queryParameter().criteria.push({
                    operand: "currency",
                    operator: "EQUALS",
                    value: [self.financeCurrency()]
                });
            }

            Model.financeSearchGet(JSON.stringify(self.queryParameter())).then(function (response) {
                if (response.finances) {
                    self.financeDataLoaded(false);
                    self.financeSearchResult([]);

                    for (let i = 0; i < response.finances.length; i++) {
                        if (response.finances[i].amounts) {
                            for (let j = 0; j < response.finances[i].amounts.length; j++) {
                                if (response.finances[i].amounts[j].type === "OUTSTANDING") {
                                    response.finances[i].outstandingAmount = response.finances[i].amounts[j].totalAmount ? response.finances[i].amounts[j].totalAmount : "-";
                                } else if (response.finances[i].amounts[j].type === "REPAID") {
                                    response.finances[i].repaidAmount = response.finances[i].amounts[j].totalAmount ? response.finances[i].amounts[j].totalAmount : "-";
                                }
                            }
                        }

                        let statusFound = false;

                        if (response.finances[i].status) {
                            for (let j = 0; j < self.financeStatusList().length; j++) {
                                if (self.financeStatusList()[j].code === response.finances[i].status) {
                                    response.finances[i].statusDescription = self.financeStatusList()[j].description;
                                    statusFound = true;
                                    break;
                                }
                            }

                            if (!statusFound) {
                                response.finances[i].statusDescription = self.nls.FinanceList.others;
                            }

                            statusFound = false;
                        } else {
                            response.finances[i].statusDescription = self.nls.FinanceList.inProcess;
                        }

                        response.finances[i].requestId = response.finances[i].requestId ? response.finances[i].requestId : "-";

                        self.financeSearchResult().push(response.finances[i]);
                    }

                    self.dataSource(new oj.PagingDataProviderView(new oj.ArrayDataProvider(self.financeSearchResult(), {
                        idAttribute: "id"
                    })));

                    self.financeDataLoaded(true);
                }
            });
        };

        self.clearResults = function () {
            self.refresh(false);
            self.programNameList([]);
            self.programCode("");
            self.counterpartyId("");
            self.financeRefNo("");
            self.financeStatus("");
            self.fromDate("");
            self.toDate("");
            self.financeCurrency("");
            self.fromFinanceAmount("");
            self.toFinanceAmount("");
            self.requestId("");
            ko.tasks.runEarly();
            self.refresh(true);
        };

        self.currencyParser = function (data) {
            const output = {};

            output.currencies = [];

            output.currencies.push({
                code: "",
                description: ""
            });

            for (let i = 0; i < data.currencyList.length; i++) {
                output.currencies.push({
                    code: data.currencyList[i].code,
                    description: data.currencyList[i].code
                });
            }

            return output;
        };

        const counterpartySubscriber = self.counterpartyId.subscribe(onSelectCounterparty);

        self.dispose = function () {
            counterpartySubscriber.dispose();
        };
    };
});