define([
    "ojL10n!resources/nls/view-associated-party-details",
    "knockout",
    "ojs/ojcore",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojlistview",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojbutton",
    "ojs/ojchart"
], function (resourceBundle, ko, oj, Model) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.mepartygetVar = ko.observable();
        self.associatedPartyId = ko.observable();
        self.associatedPartygetVar = ko.observable();
        self.buttonRole = ko.observable();
        self.buyerOtherDetailsgetVar = ko.observable();
        self.sellerOtherDetailsgetVar = ko.observable();
        self.partyName = ko.observable();
        self.partyId = ko.observable();
        self.showOtherDetails = ko.observable(false);
        self.showGraph = ko.observable(false);
        self.isSeller = ko.observable(false);
        self.isTableLoaded = ko.observable(false);
        self.finalAddress = ko.observable();
        self.buyerlinkedPrograms = ko.observableArray();
        self.supplierlinkedPrograms = ko.observableArray();
        self.finalLinkedPrograms = ko.observableArray();
        self.buyerTopPrograms = ko.observableArray();
        self.supplierTopPrograms = ko.observableArray();
        self.topPrograms = ko.observableArray();
        self.innerRadius = ko.observable(0.9);
        self.centerLabel = ko.observable();
        self.categoryOfCorporate = ko.observable();
        self.dataLabelPositionValue = ko.observable("outsideSlice");
        self.legendRendered = ko.observable("on");
        self.legendPosition = ko.observable("bottom");
        self.donutColors = ko.observableArray(["#13B6CF", "#EF0073", "#3E913E", "#FF7D0E", "#FECA00"]);
        self.numberformatter = ko.observable();
        self.prgCount = ko.observable();
        self.programHeading = ko.observable();
        self.count = ko.observable(5);
        self.relation = params.rootModel.params.relation;

        self.queryParameterSupplier = ko.observable({
            criteria: []
        });

        self.queryParameterBuyer = ko.observable({
            criteria: []
        });

        self.sortByParameter = ko.observableArray();
        self.count = ko.observable();
        self.grouping = ko.observable("Program");
        self.groupingExtra = ko.observable("Currency,Program");
        self.localCurrency = ko.observable();

        const converterFactory = oj.Validation.converterFactory("number");
        let currencyConverter;

        const invoiceStatusArray = [],
            paymentStausArray = [];

        self.labelStyle = ko.observable({
            color: "#2c3251",
            position: "absolute",
            textAlign: "center",
            paddingTop: "15%"
        });

        self.topProgramGroup = ko.observableArray();
        self.buyerTotalBusiness = ko.observable();
        self.supplierTotalBusiness = ko.observable();
        self.associatedPartyId(params.rootModel.params.partyId);
        params.baseModel.registerComponent("counter-party-list", "supply-chain-finance");
        params.baseModel.registerComponent("view-invoice", "supply-chain-finance");
        params.baseModel.registerComponent("program-details-view", "supply-chain-finance");

        const statusArray = [],
            jsonData = self.nls.Status,
            keys = Object.keys(jsonData);

        keys.forEach(function (key) {
            statusArray.push({
                key: key,
                value: jsonData[key],
                style: key.toLowerCase()
            });
        });

        Model.mepartyget().then(function (response) {
            self.mepartygetVar(response);
            self.partyId(self.mepartygetVar().party.id.displayValue);
            self.partyName(self.mepartygetVar().party.personalDetails.fullName);
        });

        Model.partyget(self.associatedPartyId(), params.rootModel.params.relation).then(function (response) {
            self.associatedPartygetVar(response.associatedParty);

            if (self.associatedPartygetVar()) {
                self.showOtherDetails(true);
            }

            let address, addressArray;

            if (self.associatedPartygetVar().address) {
                if (self.associatedPartygetVar().address.line1) {
                    address = self.associatedPartygetVar().address.line1;

                    if (self.associatedPartygetVar().address.line2) {
                        addressArray = address.split(/(?=[\s\S])/);

                        if (addressArray[addressArray.length - 1] !== ",") {
                            address = address.concat(",");
                        }

                        address = address.concat(self.associatedPartygetVar().address.line2);
                    }

                    if (self.associatedPartygetVar().address.country) {
                        addressArray = address.split(/(?=[\s\S])/);

                        if (addressArray[addressArray.length - 1] !== ",") {
                            address = address.concat(",");
                        }

                        address = address.concat(self.associatedPartygetVar().address.country);
                    }
                } else {
                    address = "-";
                }
            } else {
                address = "-";
            }

            self.finalAddress(address);

            for (let k = 0; k < statusArray.length; k++) {
                if (self.associatedPartygetVar().status === statusArray[k].key) {
                    self.associatedPartygetVar().statusValue = statusArray[k].value;
                    break;
                }
            }

            let i;

            if (self.showOtherDetails()) {

                Model.corporatecategoryget().then(function (data) {
                    let categoryFound, categoryCode;

                    if (data.jsonNode.ScfApplicationParamModelKeyCollection && data.jsonNode.ScfApplicationParamModelKeyCollection.length > 0 && data.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel && data.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel.length > 0) {
                        categoryFound = false;

                        categoryCode = self.associatedPartygetVar().category;

                        for (i = 0; i < data.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel.length; i++) {
                            if (data.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel[i].code === categoryCode) {
                                self.categoryOfCorporate(data.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel[i].description);
                                categoryFound = true;
                                break;
                            }
                        }

                        if (!categoryFound) {
                            self.categoryOfCorporate(self.nls.Others);
                        }
                    } else {
                        self.categoryOfCorporate(self.nls.Others);
                    }
                });

                const jsonDataInvoiceStatus = self.nls.InvoiceStatus,
                    jsonDataPaymentStatus = self.nls.PaymentStatus;

                Object.keys(jsonDataInvoiceStatus).forEach(function (key) {
                    invoiceStatusArray.push(key);
                });

                Object.keys(jsonDataPaymentStatus).forEach(function (key) {
                    paymentStausArray.push(key);
                });

                self.queryParameterSupplier().criteria.push({
                    operand: "program.role",
                    operator: "ENUM",
                    value: ["S"]
                }, {
                    operand: "invoiceStatus",
                    operator: "IN",
                    value: invoiceStatusArray
                }, {
                    operand: "paymentStatus",
                    operator: "IN",
                    value: paymentStausArray
                }, {
                    operand: "associatedParty.associatedPartyKey.id",
                    operator: "EQUALS",
                    value: [self.associatedPartyId()]
                });

                self.queryParameterBuyer().criteria.push({
                    operand: "program.role",
                    operator: "ENUM",
                    value: ["B"]
                }, {
                    operand: "invoiceStatus",
                    operator: "IN",
                    value: invoiceStatusArray
                }, {
                    operand: "paymentStatus",
                    operator: "IN",
                    value: paymentStausArray
                }, {
                    operand: "associatedParty.associatedPartyKey.id",
                    operator: "EQUALS",
                    value: [self.associatedPartyId()]
                });

                self.sortByParameter().push({
                    sortBy: "amount",
                    sortOrder: "DESC"
                });

                self.count(5);

                let j, totalBusiness, programName;

                Promise.all([
                    Model.invoiceget(self.grouping(), JSON.stringify(self.queryParameterSupplier()), JSON.stringify(self.sortByParameter()), self.count()),
                    Model.invoiceget(self.grouping(), JSON.stringify(self.queryParameterBuyer()), JSON.stringify(self.sortByParameter()), self.count()),
                    Model.invoiceget(self.groupingExtra(), JSON.stringify(self.queryParameterSupplier())),
                    Model.invoiceget(self.groupingExtra(), JSON.stringify(self.queryParameterBuyer()))
                ]).then(function (response) {

                    if (response[0] && response[0].aggregatedData) {

                        self.sellerOtherDetailsgetVar(response[0].aggregatedData);

                        if (self.sellerOtherDetailsgetVar().resource && self.sellerOtherDetailsgetVar().groups && self.sellerOtherDetailsgetVar().groups.length > 0) {

                            totalBusiness = 0;

                            for (i = 0; i < self.sellerOtherDetailsgetVar().groups.length; i++) {

                                if (self.sellerOtherDetailsgetVar().groups[i] && self.sellerOtherDetailsgetVar().groups[i].intervals) {
                                    programName = self.sellerOtherDetailsgetVar().groups[i].id.split("~");

                                    for (j = 0; j < self.sellerOtherDetailsgetVar().groups[i].intervals.length; j++) {
                                        totalBusiness = totalBusiness + self.sellerOtherDetailsgetVar().groups[i].intervals[j].amount.amount;
                                        self.localCurrency(self.sellerOtherDetailsgetVar().groups[i].intervals[j].amount.currency);

                                        self.supplierTopPrograms.push({
                                            name: programName[1],
                                            items: [{
                                                value: self.sellerOtherDetailsgetVar().groups[i].intervals[j].amount.amount,
                                                label: self.sellerOtherDetailsgetVar().groups[i].intervals[j].amount.amount
                                            }]
                                        });
                                    }
                                }
                            }

                            self.supplierTotalBusiness(params.baseModel.formatCurrency(totalBusiness, self.localCurrency()));

                            currencyConverter = converterFactory.createConverter({
                                style: "currency",
                                currency: self.localCurrency()
                            });

                            self.numberformatter(currencyConverter);

                            self.centerLabel(params.baseModel.format(self.nls.TopAssociatedPrograms.Receivables, {
                                amount: self.supplierTotalBusiness()
                            }));

                            self.buttonRole("S");
                            self.topPrograms([]);
                            self.topPrograms(self.supplierTopPrograms());
                            self.isSeller(true);
                        }

                    }

                    if (response[1] && response[1].aggregatedData) {
                        self.buyerOtherDetailsgetVar(response[1].aggregatedData);

                        if (self.buyerOtherDetailsgetVar().resource && self.buyerOtherDetailsgetVar().groups && self.buyerOtherDetailsgetVar().groups.length > 0) {

                            totalBusiness = 0;

                            for (i = 0; i < self.buyerOtherDetailsgetVar().groups.length; i++) {

                                if (self.buyerOtherDetailsgetVar().groups[i] && self.buyerOtherDetailsgetVar().groups[i].intervals) {
                                    programName = self.buyerOtherDetailsgetVar().groups[i].id.split("~");

                                    for (j = 0; j < self.buyerOtherDetailsgetVar().groups[i].intervals.length; j++) {
                                        totalBusiness = totalBusiness + self.buyerOtherDetailsgetVar().groups[i].intervals[j].amount.amount;
                                        self.localCurrency(self.buyerOtherDetailsgetVar().groups[i].intervals[j].amount.currency);

                                        self.buyerTopPrograms.push({
                                            name: programName[1],
                                            items: [{
                                                value: self.buyerOtherDetailsgetVar().groups[i].intervals[j].amount.amount,
                                                label: self.buyerOtherDetailsgetVar().groups[i].intervals[j].amount.amount
                                            }]
                                        });
                                    }
                                }
                            }

                            self.buyerTotalBusiness(params.baseModel.formatCurrency(totalBusiness, self.localCurrency()));

                            currencyConverter = converterFactory.createConverter({
                                style: "currency",
                                currency: self.localCurrency()
                            });

                            self.numberformatter(currencyConverter);

                            if (!self.isSeller()) {
                                self.centerLabel(params.baseModel.format(self.nls.TopAssociatedPrograms.Payables, {
                                    amount: self.buyerTotalBusiness()
                                }));

                                self.buttonRole("B");
                                self.topPrograms([]);
                                self.topPrograms(self.buyerTopPrograms());
                            }
                        }
                    }

                    const combinedArray = [];

                    combinedArray.push(response[2]);
                    combinedArray.push(response[3]);

                    if(params.rootModel.params.buttonRole){
                        self.buttonRole(params.rootModel.params.buttonRole);

                        if(params.rootModel.params.buttonRole === "S") {
                            self.topPrograms(self.supplierTopPrograms());
                        } else {
                            self.topPrograms(self.buyerTopPrograms());
                        }
                    }

                    self.showTableData(combinedArray);

                    if (self.buttonRole() !== "B" && self.buttonRole() !== "S") {
                        self.buttonRole("B");
                    }

                    self.showGraph(true);

                    if(self.topPrograms().length >= 5) {
                        self.prgCount(self.count());
                        self.programHeading(self.nls.heading.TopAssociatedPrograms);
                    } else {
                        self.programHeading(self.nls.heading.TopAssociatedProgram);
                    }

                    self.topProgramGroup.push("Programs");
                });
            }
        });

        self.dataSource28 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.finalLinkedPrograms, {
            idAttribute: "Code"
        }));

        self.onClickCancel16 = function () {
            params.dashboard.switchModule();
        };

        self.onClickBack99 = function () {
            params.dashboard.loadComponent("counter-party-list");
        };

        self.roleChanger = function () {
            self.showGraph(false);
            self.finalLinkedPrograms([]);
            self.topPrograms([]);

            if (self.buttonRole() === "S") {
                self.finalLinkedPrograms(self.supplierlinkedPrograms());
                self.topPrograms(self.supplierTopPrograms());

                self.centerLabel(params.baseModel.format(self.nls.TopAssociatedPrograms.Receivables, {
                    amount: self.supplierTotalBusiness()
                }));

                if (self.supplierTopPrograms().length > 0) {
                    currencyConverter = converterFactory.createConverter({
                        style: "currency",
                        currency: self.localCurrency()
                    });

                    self.numberformatter(currencyConverter);
                }
            } else {
                self.finalLinkedPrograms(self.buyerlinkedPrograms());
                self.topPrograms(self.buyerTopPrograms());

                self.centerLabel(params.baseModel.format(self.nls.TopAssociatedPrograms.Payables, {
                    amount: self.buyerTotalBusiness()
                }));

                if (self.buyerTopPrograms().length > 0) {
                    currencyConverter = converterFactory.createConverter({
                        style: "currency",
                        currency: self.localCurrency()
                    });

                    self.numberformatter(currencyConverter);
                }
            }

            self.showGraph(true);
            ko.tasks.runEarly();

            if (document.getElementById("AssociatedPrograms34") !== null) {
                document.getElementById("AssociatedPrograms34").refresh();
                document.getElementById("AssociatedPrograms38").refresh();
            }

            if (document.getElementById("AssociatedPrograms42") !== null) {
                document.getElementById("AssociatedPrograms42").refresh();
            }
        };

        self.showTableData = function (response) {

            const jsonDataRole = self.nls.Role,
                jsonDataRelation = self.nls.Relation;

            let i, j, programDetails, partyRole;

            if (response[0] && response[0].aggregatedData) {

                self.sellerOtherDetailsgetVar(response[0].aggregatedData);

                if (self.sellerOtherDetailsgetVar().resource && self.sellerOtherDetailsgetVar().groups && self.sellerOtherDetailsgetVar().groups.length > 0) {

                    for (i = 0; i < self.sellerOtherDetailsgetVar().groups.length; i++) {

                        partyRole = "";

                        if (self.sellerOtherDetailsgetVar().groups[i] && self.sellerOtherDetailsgetVar().groups[i].intervals) {
                            programDetails = self.sellerOtherDetailsgetVar().groups[i].identifiers[1].split("~");

                            if (jsonDataRelation[programDetails[2]] && jsonDataRole[programDetails[3]]) {
                                if (jsonDataRelation[programDetails[2]] === jsonDataRelation.A) {
                                    partyRole = partyRole.concat(jsonDataRelation.CP);
                                } else {
                                    partyRole = partyRole.concat(jsonDataRelation.A);
                                }

                                partyRole = partyRole.concat("-");

                                if (jsonDataRole[programDetails[3]] === jsonDataRole.B) {
                                    partyRole = partyRole.concat(jsonDataRole.S);
                                } else {
                                    partyRole = partyRole.concat(jsonDataRole.B);
                                }
                            } else {
                                partyRole = "-";
                            }

                            for (j = 0; j < self.sellerOtherDetailsgetVar().groups[i].intervals.length; j++) {

                                self.supplierlinkedPrograms.push({
                                    Code: Math.floor((Math.random() * 10000) + 1),
                                    programName: programDetails[1],
                                    programCode: programDetails[0],
                                    partyRole: partyRole,
                                    outStandingInvoicesCount: self.sellerOtherDetailsgetVar().groups[i].intervals[j].count,
                                    outStandingInvoicesAmount: self.sellerOtherDetailsgetVar().groups[i].intervals[j].amount.amount,
                                    currencyValue: self.sellerOtherDetailsgetVar().groups[i].identifiers[0],
                                    status: self.nls.Status.ACTIVE
                                });
                            }
                        }
                    }
                }
            }

            if (response[1] && response[1].aggregatedData) {

                self.buyerOtherDetailsgetVar(response[1].aggregatedData);

                if (self.buyerOtherDetailsgetVar().resource && self.buyerOtherDetailsgetVar().groups && self.buyerOtherDetailsgetVar().groups.length > 0) {

                    for (i = 0; i < self.buyerOtherDetailsgetVar().groups.length; i++) {

                        partyRole = "";

                        if (self.buyerOtherDetailsgetVar().groups[i] && self.buyerOtherDetailsgetVar().groups[i].intervals) {
                            programDetails = self.buyerOtherDetailsgetVar().groups[i].identifiers[1].split("~");

                            if (jsonDataRelation[programDetails[2]] && jsonDataRole[programDetails[3]]) {
                                if (jsonDataRelation[programDetails[2]] === jsonDataRelation.A) {
                                    partyRole = partyRole.concat(jsonDataRelation.CP);
                                } else {
                                    partyRole = partyRole.concat(jsonDataRelation.A);
                                }

                                partyRole = partyRole.concat("-");

                                if (jsonDataRole[programDetails[3]] === jsonDataRole.B) {
                                    partyRole = partyRole.concat(jsonDataRole.S);
                                } else {
                                    partyRole = partyRole.concat(jsonDataRole.B);
                                }
                            } else {
                                partyRole = "-";
                            }

                            for (j = 0; j < self.buyerOtherDetailsgetVar().groups[i].intervals.length; j++) {

                                self.buyerlinkedPrograms.push({
                                    Code: Math.floor((Math.random() * 10000) + 1),
                                    programName: programDetails[1],
                                    programCode: programDetails[0],
                                    partyRole: partyRole,
                                    outStandingInvoicesCount: self.buyerOtherDetailsgetVar().groups[i].intervals[j].count,
                                    outStandingInvoicesAmount: self.buyerOtherDetailsgetVar().groups[i].intervals[j].amount.amount,
                                    currencyValue: self.buyerOtherDetailsgetVar().groups[i].identifiers[0],
                                    status: self.nls.Status.ACTIVE
                                });
                            }
                        }
                    }
                }
            }

            self.finalLinkedPrograms([]);

            if (self.buttonRole() === "S") {
                self.finalLinkedPrograms(self.supplierlinkedPrograms());
            } else {
                self.finalLinkedPrograms(self.buyerlinkedPrograms());
            }

            self.isTableLoaded(true);

        };

        self.onClickGoToInvoices = function (event) {
            params.dashboard.loadComponent("view-invoice", {
                programCode: event.programCode,
                currency: event.currencyValue,
                showOutstanding: true,
                spokeId: self.associatedPartyId(),
                role: self.buttonRole(),
                invoiceStatusArray: invoiceStatusArray,
                paymentStausArray: paymentStausArray
            });
        };

        self.onClickGoToProgramDetails = function (event) {
            params.dashboard.loadComponent("program-details-view", {
                programId: event.programCode,
                selectedRole: self.buttonRole(),
                status: event.status
            });
        };

    };
});