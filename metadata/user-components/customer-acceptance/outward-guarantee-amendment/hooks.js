define([
    "./model",
    "knockout"
], function (Model, ko) {
    "use strict";

    return function () {
        let self,
         params;

                function mepartygetCall() {
            return Model.mepartyget();
        }

                function mepartyrelationsgetCall() {
            return Model.mepartyrelationsget();
        }

                function bankguaranteesbankGuaranteeIdamendmentsamendmentIdgetCall(amendmentId, amendStatus, authStatus, bankGuaranteeId) {
            return Model.bankguaranteesbankGuaranteeIdamendmentsamendmentIdget(amendmentId, amendStatus, authStatus, bankGuaranteeId);
        }

                function bankguaranteesamendmentsgetCall(bankGuaranteeId, applicantName, beneName, partyId, type) {
            return Model.bankguaranteesamendmentsget(bankGuaranteeId, applicantName, beneName, partyId, type);
        }

                function onClickSearch3() {
            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                self.searchTableDataLoaded(false);

                bankguaranteesamendmentsgetCall(self.bankguaranteesamendmentsgetbankGuaranteeId(), self.bankguaranteesamendmentsgetapplicantName(), self.bankguaranteesamendmentsgetbeneName(), self.bankguaranteesamendmentsgetpartyId(), self.bankguaranteesamendmentsgettype()).then(function (response) {
                    if (response && response.bankGuaranteeAmendmentDTOs && response.bankGuaranteeAmendmentDTOs.length > 0) {
                        self.searchTableDataSource.removeAll();

                        for (let i = 0; i < response.bankGuaranteeAmendmentDTOs.length; i++) {
                            self.searchTableDataSource.push({
                                amendmentId: response.bankGuaranteeAmendmentDTOs[i].id,
                                productName: self.nls.productNameBankGuarantee[response.bankGuaranteeAmendmentDTOs[i].productType],
                                applicantName: response.bankGuaranteeAmendmentDTOs[i].applicantName,
                                guaranteeNumber: response.bankGuaranteeAmendmentDTOs[i].bgId,
                                guaranteeAmount: params.baseModel.formatCurrency(response.bankGuaranteeAmendmentDTOs[i].newAmount.amount, response.bankGuaranteeAmendmentDTOs[i].newAmount.currency)
                            });
                        }

                        self.searchTableDataLoaded(true);
                        self.cancelButton1(false);
                        self.cancelButton2(true);
                    }
                });
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        }

                function onClickCancel97() {
            params.dashboard.switchModule();
        }

                function onClickReset6() {
            self.bankguaranteesamendmentsgetbankGuaranteeId("");
            self.bankguaranteesamendmentsgetapplicantName("");
            self.bankguaranteesamendmentsgetbeneName("");
            self.bankguaranteesamendmentsgetpartyId("");
            self.cancelButton1(true);
            self.cancelButton2(false);
            self.searchTableDataSource.removeAll();
            self.searchTableDataLoaded(false);
        }

                function onClickamendmentId56(data) {
            bankguaranteesbankGuaranteeIdamendmentsamendmentIdgetCall(data.amendmentId, null, null, data.guaranteeNumber).then(function (response) {
                const parameters = {
                    mode: "ACCEPTANCE",
                    data: response.bankGuaranteeAmendment,
                    guaranteeTransactionType: "OUTWARD"
                };

                params.dashboard.loadComponent("review-amendment", parameters);
            });
        }

                function onClickCancel95() {
            params.dashboard.switchModule();
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.beneNameArray = ko.observableArray([]);
            self.dataLoaded = ko.observable(false);
            self.searchTableDataLoaded = ko.observable(false);
            self.searchTableDataSource = ko.observableArray();
            self.bankguaranteesamendmentsgettype = ko.observable("OUTWARD");
            self.cancelButton1 = ko.observable(true);
            self.cancelButton2 = ko.observable(false);
            params.baseModel.registerComponent("review-amendment", "guarantee");

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
            bankguaranteesbankGuaranteeIdamendmentsamendmentIdgetCall: bankguaranteesbankGuaranteeIdamendmentsamendmentIdgetCall,
            bankguaranteesamendmentsgetCall: bankguaranteesamendmentsgetCall,
            onClickSearch3: onClickSearch3,
            onClickCancel97: onClickCancel97,
            onClickReset6: onClickReset6,
            onClickamendmentId56: onClickamendmentId56,
            onClickCancel95: onClickCancel95,
            init: init
        };
    };
});