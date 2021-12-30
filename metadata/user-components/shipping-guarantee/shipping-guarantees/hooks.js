define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function mepartygetCall(payload, config) {
            return Model.mepartyget(payload, config);
        }

                function mepartyrelationsgetCall(payload, config) {
            return Model.mepartyrelationsget(payload, config);
        }

                function shippingGuaranteesgetCall(partyId, taskCode, q, sortBy, count, payload, config) {
            return Model.shippingGuaranteesget(partyId, taskCode, q, sortBy, count, payload, config);
        }

                function shippingGuaranteesidgetCall(id, payload, config) {
            return Model.shippingGuaranteesidget(id, payload, config);
        }

                function onClickMoreSearchOptions52() {
            self.moreSearchOptions(!self.moreSearchOptions());
            self.showSearchOptionsLink(false);
        }

                function onClickLessSearchOptions27() {
            self.showSearchOptionsLink(true);
            self.moreSearchOptions(!self.moreSearchOptions());
        }

                function onClickSearch3() {
            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                const qQuery = { criteria: [] };

                self.bgTableDataReturnedEmpty(false);
                self.bgTableDataLoaded(false);

                if (self.shippingGuaranteeReferenceNumber()) {
                    qQuery.criteria.push({
                        operand: "sGid",
                        operator: "EQUALS",
                        value: [self.shippingGuaranteeReferenceNumber()]
                    });
                }

                if (self.beneficiaryName()) {
                    qQuery.criteria.push({
                        operand: "CounterPartyName",
                        operator: "EQUALS",
                        value: [self.beneficiaryName()]
                    });
                }

                if (self.filterValues.lcLinked() === "true") {
                    qQuery.criteria.push({
                        operand: "islclinkage",
                        operator: "EQUALS",
                        value: ["Y"]
                    });
                } else {
                    qQuery.criteria.push({
                        operand: "islclinkage",
                        operator: "EQUALS",
                        value: ["N"]
                    });
                }

                if (self.shippingGuaranteeStatus()) {
                    qQuery.criteria.push({
                        operand: "Status",
                        operator: "EQUALS",
                        value: [self.shippingGuaranteeStatus()]
                    });
                }

                if (self.fromExpiryDate()) {
                    qQuery.criteria.push({
                        operand: "ExpiryDateFrom",
                        operator: "EQUALS",
                        value: [self.fromExpiryDate()]
                    });
                }

                if (self.toExpiryDate()) {
                    qQuery.criteria.push({
                        operand: "ExpiryDateTo",
                        operator: "EQUALS",
                        value: [self.toExpiryDate()]
                    });
                }

                if (self.fromAmount()) {
                    qQuery.criteria.push({
                        operand: "SgAmountFrom",
                        operator: "EQUALS",
                        value: [self.fromAmount()]
                    });
                }

                if (self.filterValues.lcNumber()) {
                    qQuery.criteria.push({
                        operand: "lcid",
                        operator: "EQUALS",
                        value: [self.filterValues.lcNumber()]
                    });
                }

                if (self.toAmount()) {
                    qQuery.criteria.push({
                        operand: "SgAmountTo",
                        operator: "EQUALS",
                        value: [self.toAmount()]
                    });
                }

                self.shippingGuaranteesgetq(JSON.stringify(qQuery));

                shippingGuaranteesgetCall(self.applicantName(), null, self.shippingGuaranteesgetq(), null).then(function (response) {
                    if (response.shippingGuarantees.length > 0) {
                        self.dataSourceShipping.removeAll();

                        for (let i = 0; i < response.shippingGuarantees.length; i++) {
                            self.dataSourceShipping.push({
                                beneficiary: response.shippingGuarantees[i].counterPartyName,
                                amount_feild: response.shippingGuarantees[i].amount.amount,
                                amount: params.baseModel.formatCurrency(response.shippingGuarantees[i].amount.amount, response.shippingGuarantees[i].amount.currency),
                                status: response.shippingGuarantees[i].status,
                                sg_number: response.shippingGuarantees[i].id,
                                lc_number: response.shippingGuarantees[i].letterOfCredit ? response.shippingGuarantees[i].letterOfCredit : "",
                                expiry_date: response.shippingGuarantees[i].expiryDate
                            });
                        }

                        ko.tasks.runEarly();
                        self.bgTableDataLoaded(true);
                    } else {
                        self.bgTableDataLoaded(false);
                        self.bgTableDataReturnedEmpty(true);
                    }
                });
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        }

                function onClickCancel76() {
            params.dashboard.switchModule();
        }

                function onClickReset1() {
            self.bgTableDataLoaded(false);
            self.shippingGuaranteeReferenceNumber("");
            self.beneficiaryName("");
            self.shippingGuaranteeStatus("");
            self.fromAmount("");
            self.filterValues.lcNumber("");
            self.toAmount("");
            self.applicantName("");
            self.fromExpiryDate("");
            self.toExpiryDate("");
            self.dataSourceShipping.removeAll();
        }

                function onClickShippingGuaranteeReferenceNumber49(data) {
            shippingGuaranteesidgetCall(data.sg_number).then(function (response) {
                const parameters = {
                    mode: "VIEW",
                    data: response.shippingGuarantee,
                    lc_number: data.lc_number ? data.lc_number : "",
                    sg_number: data.sg_number
                };

                params.dashboard.loadComponent("view-shipping-guarantee", parameters);
            });
        }

                function onClickShippingGuaranteeReferenceNumber24() {
            self.a = "b";
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.dataLoaded = ko.observable(false);
            self.moreSearchOptions = ko.observable(false);
            self.showSearchOptionsLink = ko.observable(true);
            self.dataSourceShipping = ko.observableArray();
            params.baseModel.registerComponent("collection-filters", "collection");
            params.baseModel.registerComponent("lc-lookup", "trade-finance");
            params.baseModel.registerComponent("view-shipping-guarantee", "shipping-guarantee");
            self.bgTableDataLoaded = ko.observable(false);
            self.mode = ko.observable("VIEW");
            self.appNameArray = ko.observableArray();
            self.filterGroupValid = ko.observable();
            self.bgTableDataReturnedEmpty = ko.observable(false);
            self.lcNumber = ko.observable();
            self.shippingGuaranteeReferenceNumber = ko.observable();
            self.applicantName = ko.observable();
            self.beneficiaryName = ko.observable();
            self.shippingGuaranteeStatus = ko.observable();
            self.fromAmount = ko.observable();
            self.toAmount = ko.observable();
            self.fromExpiryDate = ko.observable();
            self.toExpiryDate = ko.observable();
            self.isLCLookupRequired = ko.observable(false);

            self.filterValues = {
                paymentType: ko.observable("SIGHT"),
                docAttached: ko.observable("false"),
                lcLinked: ko.observable("false"),
                lcNumber: ko.observable()
            };

            self.pageRendered = function () {
                return true;
            };

            Promise.all([
                mepartygetCall(),
                mepartyrelationsgetCall()
            ]).then(function (response) {
                self.appNameArray.push({
                    label: response[0].party.personalDetails.fullName,
                    value: response[0].party.id.value
                });

                for (let i = 0; i < response[1].partyToPartyRelationship.length; i++) {
                    self.appNameArray.push({
                        label: response[1].partyToPartyRelationship[i].relatedPartyName,
                        value: response[1].partyToPartyRelationship[i].relatedParty.value
                    });
                }

                self.dataLoaded(true);
            });

            return true;
        }

        return {
            mepartygetCall: mepartygetCall,
            mepartyrelationsgetCall: mepartyrelationsgetCall,
            shippingGuaranteesgetCall: shippingGuaranteesgetCall,
            shippingGuaranteesidgetCall: shippingGuaranteesidgetCall,
            onClickMoreSearchOptions52: onClickMoreSearchOptions52,
            onClickLessSearchOptions27: onClickLessSearchOptions27,
            onClickSearch3: onClickSearch3,
            onClickCancel76: onClickCancel76,
            onClickReset1: onClickReset1,
            onClickShippingGuaranteeReferenceNumber49: onClickShippingGuaranteeReferenceNumber49,
            onClickShippingGuaranteeReferenceNumber24: onClickShippingGuaranteeReferenceNumber24,
            init: init
        };
    };
});