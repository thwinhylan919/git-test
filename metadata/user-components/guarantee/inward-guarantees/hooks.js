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

                function bankguaranteesgetCall(bgNumber, custRefNo, beneName, bgStatus, fromAmount, toAmount, currency, issueDatefrom, issueDateto, expiryDatefrom, expiryDateto, partyId, applicantName, lcId, transactionType, payload, config) {
            return Model.bankguaranteesget(bgNumber, custRefNo, beneName, bgStatus, fromAmount, toAmount, currency, issueDatefrom, issueDateto, expiryDatefrom, expiryDateto, partyId, applicantName, lcId, transactionType, payload, config);
        }

                function bankguaranteesbankGuaranteeIdgetCall(bankGuaranteeId, versionNo, payload, config) {
            return Model.bankguaranteesbankGuaranteeIdget(bankGuaranteeId, versionNo, payload, config);
        }

                function onClickMoreSearchOptions32() {
            self.moreSearchOptions(!self.moreSearchOptions());
            self.showSearchOptionsLink(false);
        }

                function onClickLessSearchOptions80() {
            self.showSearchOptionsLink(true);
            self.moreSearchOptions(!self.moreSearchOptions());
        }

                function onClickSearch99() {
            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                bankguaranteesgetCall(self.bankguaranteesgetbgNumber(), self.bankguaranteesgetcustRefNo(), self.bankguaranteesgetbeneName(), self.bankguaranteesgetbgStatus(), self.bankguaranteesgetfromAmount(), self.bankguaranteesgettoAmount(), self.bankguaranteesgetcurrency(), self.bankguaranteesgetissueDatefrom(), self.bankguaranteesgetissueDateto(), self.bankguaranteesgetexpiryDatefrom(), self.bankguaranteesgetexpiryDateto(), self.bankguaranteesgetpartyId(), self.bankguaranteesgetapplicantName(), self.bankguaranteesgetlcId(), self.bgTransactionType()).then(function (response) {
                    self.bgTableDataReturnedEmpty(false);
                    self.bgTableDataLoaded(false);
                    response.bankGuaranteeDTO = params.baseModel.sortLib(response.bankGuaranteeDTO, ["expiryDate"], ["desc"]);

                    if (response.bankGuaranteeDTO.length > 0) {
                        self.dataSource.removeAll();
                        self.claimsDataSource(response.bankGuaranteeDTO);

                        for (let i = 0; i < response.bankGuaranteeDTO.length; i++) {
                            self.dataSource.push({
                                beneficiary: response.bankGuaranteeDTO[i].partyName,
                                issue_date: response.bankGuaranteeDTO[i].issueDate,
                                amount_field: response.bankGuaranteeDTO[i].contractAmount.amount ? response.bankGuaranteeDTO[i].contractAmount.amount : 0,
                                amount: params.baseModel.formatCurrency(response.bankGuaranteeDTO[i].contractAmount.amount, response.bankGuaranteeDTO[i].contractAmount.currency),
                                outstanding_amount_field: response.bankGuaranteeDTO[i].guaranteeAmount.amount ? response.bankGuaranteeDTO[i].guaranteeAmount.amount : 0,
                                outstanding_amount: params.baseModel.formatCurrency(response.bankGuaranteeDTO[i].guaranteeAmount.amount, response.bankGuaranteeDTO[i].guaranteeAmount.currency),
                                expiry_date: response.bankGuaranteeDTO[i].expiryDate,
                                bg_status: response.bankGuaranteeDTO[i].guaranteeStatus,
                                bg_number: response.bankGuaranteeDTO[i].bgId,
                                totalAvailment_field: response.bankGuaranteeDTO[i].totalClaims ? response.bankGuaranteeDTO[i].totalClaims : 0,
                                totalAvailment: params.baseModel.formatCurrency(response.bankGuaranteeDTO[i].totalClaims, response.bankGuaranteeDTO[i].guaranteeAmount.currency),
                                claimAmount: response.bankGuaranteeDTO[i].totalClaims
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

                function onClickCancel5() {
            params.dashboard.switchModule();
        }

                function onClickReset9() {
            self.bgTableDataLoaded(false);
            self.dataSource.removeAll();
            self.bankguaranteesgetbgNumber("");
            self.bankguaranteesgetcustRefNo("");
            self.bankguaranteesgetbeneName("");
            self.bankguaranteesgetbgStatus("");
            self.bankguaranteesgetfromAmount("");
            self.bankguaranteesgettoAmount("");
            self.bankguaranteesgetcurrency("");
            self.bankguaranteesgetissueDatefrom("");
            self.bankguaranteesgetissueDateto("");
            self.bankguaranteesgetexpiryDatefrom("");
            self.bankguaranteesgetexpiryDateto("");
            self.bankguaranteesgetpartyId("");
            self.bankguaranteesgetapplicantName("");
            self.bankguaranteesgetlcId("");
        }

                function onClickGuaranteeNumber68(data) {
            bankguaranteesbankGuaranteeIdgetCall(data.bg_number).then(function (response) {
                const parameters = {
                    mode: "VIEW",
                    guaranteeDetails: response.bankGuarantee,
                    guaranteeTransactionType: "INWARD",
                    list: self.dataSource(),
                    applicantName: self.bankguaranteesgetapplicantName,
                    beneName: self.bankguaranteesgetpartyId,
                    bgNumber: self.bankguaranteesgetbgNumber,
                    bgStatus: self.bankguaranteesgetbgStatus,
                    fromAmount: self.bankguaranteesgetfromAmount,
                    toAmount: self.bankguaranteesgettoAmount,
                    issueDatefrom: self.bankguaranteesgetissueDatefrom,
                    issueDateto: self.bankguaranteesgetissueDateto
                };

                params.dashboard.loadComponent("view-bank-guarantee", parameters);
            });
        }

                function onClickClaims28(event) {
            const popup = document.querySelector("#claim-details");

            if (popup.isOpen()) {
                popup.close();
            } else {
                let totalAmount = 0;

                for (let i = 0; i < self.claimsDataSource().length; i++) {
                    if (event.bg_number === self.claimsDataSource()[i].bgId) {
                        self.claimsData.removeAll();

                        for (let j = 0; j < self.claimsDataSource()[i].claims.length; j++) {
                            self.claimsData.push({
                                availmentId: self.claimsDataSource()[i].claims[j].availmentId,
                                claimDate: self.claimsDataSource()[i].claims[j].availmentDate,
                                description: self.claimsDataSource()[i].claims[j].description,
                                claimAmount: params.baseModel.formatCurrency(self.claimsDataSource()[i].claims[j].availmentAmount.amount, self.claimsDataSource()[i].claims[j].availmentAmount.currency)
                            });

                            totalAmount = totalAmount + self.claimsDataSource()[i].claims[j].availmentAmount.amount;
                        }
                    }
                }

                self.totalClaimsAmount(totalAmount);
                popup.open();
            }
        }

                function onClickGuaranteeNumber93(data) {
            bankguaranteesbankGuaranteeIdgetCall(data.bg_number).then(function (response) {
                const parameters = {
                    mode: "VIEW",
                    guaranteeDetails: response.bankGuarantee,
                    guaranteeTransactionType: "INWARD"
                };

                params.dashboard.loadComponent("view-bank-guarantee", parameters);
            });
        }

                function onClickCancel94() {
            params.dashboard.switchModule();
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.dataSource = ko.observableArray();
            self.bgTableDataLoaded = ko.observable(false);

            if (params.rootModel.params.backView && params.rootModel.params.backView()) {
                if (params.rootModel.params.list.length > 0) {
                    self.dataSource(params.rootModel.params.list);
                    self.bgTableDataLoaded(true);
                }

                self.bankguaranteesgetapplicantName = params.rootModel.params.applicantName;
                self.bankguaranteesgetpartyId = params.rootModel.params.beneName;
                self.bankguaranteesgetbgNumber = params.rootModel.params.bgNumber;
                self.bankguaranteesgetbgStatus = params.rootModel.params.bgStatus;
                self.bankguaranteesgetfromAmount = params.rootModel.params.fromAmount;
                self.bankguaranteesgettoAmount = params.rootModel.params.toAmount;
                self.bankguaranteesgetissueDatefrom = params.rootModel.params.issueDatefrom;
                self.bankguaranteesgetissueDateto = params.rootModel.params.issueDateto;
            }

            self.beneNameArray = ko.observableArray([]);
            self.dataLoaded = ko.observable(false);
            self.moreSearchOptions = ko.observable(false);
            self.showSearchOptionsLink = ko.observable(true);
            params.baseModel.registerComponent("view-bank-guarantee", "guarantee");
            self.bgTableDataReturnedEmpty = ko.observable(false);
            self.bgTransactionType = ko.observable("INWARD");
            self.claimsDataSource = ko.observableArray();
            self.claimsData = ko.observableArray();
            self.totalClaimsAmount = ko.observable();

            Promise.all([
                mepartygetCall(),
                mepartyrelationsgetCall()
            ]).then(function (response) {
                self.beneNameArray.push({
                    label: response[0].party.personalDetails.fullName,
                    value: response[0].party.id.value
                });

                for (let i = 0; i < response[1].partyToPartyRelationship.length; i++) {
                    self.beneNameArray.push({
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
            bankguaranteesgetCall: bankguaranteesgetCall,
            bankguaranteesbankGuaranteeIdgetCall: bankguaranteesbankGuaranteeIdgetCall,
            onClickMoreSearchOptions32: onClickMoreSearchOptions32,
            onClickLessSearchOptions80: onClickLessSearchOptions80,
            onClickSearch99: onClickSearch99,
            onClickCancel5: onClickCancel5,
            onClickReset9: onClickReset9,
            onClickGuaranteeNumber68: onClickGuaranteeNumber68,
            onClickClaims28: onClickClaims28,
            onClickGuaranteeNumber93: onClickGuaranteeNumber93,
            onClickCancel94: onClickCancel94,
            init: init
        };
    };
});