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

                function bankguaranteesamendmentsgetCall(bankGuaranteeId, applicantName, beneName, partyId, type, payload, config) {
            return Model.bankguaranteesamendmentsget(bankGuaranteeId, applicantName, beneName, partyId, type, payload, config);
        }

                function bankguaranteesbankGuaranteeIdamendmentsamendmentIdgetCall(amendmentId, amendStatus, authStatus, bankGuaranteeId, payload, config) {
            return Model.bankguaranteesbankGuaranteeIdamendmentsamendmentIdget(amendmentId, amendStatus, authStatus, bankGuaranteeId, payload, config);
        }

                function onClickSearch76() {
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
                                guaranteeAmount_feild: response.bankGuaranteeAmendmentDTOs[i].newAmount.amount,
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

                function onClickCancel40() {
            params.dashboard.switchModule();
        }

                function onClickReset58() {
            self.bankguaranteesamendmentsgetbankGuaranteeId("");
            self.bankguaranteesamendmentsgetapplicantName("");
            self.bankguaranteesamendmentsgetbeneName("");
            self.bankguaranteesamendmentsgetpartyId("");
            self.cancelButton1(true);
            self.cancelButton2(false);
            self.searchTableDataSource.removeAll();
            self.searchTableDataLoaded(false);
        }

                function onClickAmendmentId61(data) {
            bankguaranteesbankGuaranteeIdamendmentsamendmentIdgetCall(data.amendmentId, null, null, data.guaranteeNumber).then(function (response) {
                const parameters = {
                    mode: "ACCEPTANCE",
                    data: response.bankGuaranteeAmendment,
                    guaranteeTransactionType: "INWARD"
                };

                params.dashboard.loadComponent("review-amendment", parameters);
            });
        }

                function onClickCancel35() {
            params.dashboard.switchModule();
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.appNameArray = ko.observableArray([]);
            self.dataLoaded = ko.observable(false);
            self.searchTableDataLoaded = ko.observable(false);
            self.searchTableDataSource = ko.observableArray();
            self.cancelButton1 = ko.observable(true);
            self.cancelButton2 = ko.observable(false);
            self.bankguaranteesamendmentsgettype = ko.observable("INWARD");
            params.baseModel.registerComponent("review-amendment", "guarantee");

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
            bankguaranteesamendmentsgetCall: bankguaranteesamendmentsgetCall,
            bankguaranteesbankGuaranteeIdamendmentsamendmentIdgetCall: bankguaranteesbankGuaranteeIdamendmentsamendmentIdgetCall,
            onClickSearch76: onClickSearch76,
            onClickCancel40: onClickCancel40,
            onClickReset58: onClickReset58,
            onClickAmendmentId61: onClickAmendmentId61,
            onClickCancel35: onClickCancel35,
            init: init
        };
    };
});