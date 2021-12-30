define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/discrepancies",
    "ojs/ojnavigationlist",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox",
    "ojs/ojcube",
    "ojs/ojdatagrid",
    "ojs/ojswitch",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingdatagriddatasource",
    "ojs/ojvalidationgroup"
], function(oj, ko, ImportAmendmentModel, locale) {
    "use strict";

    return function(params) {
        const self = this;

        params.baseModel.registerComponent("customer-acceptance-nav-bar", "customer-acceptance");
        params.baseModel.registerComponent("review-amend-lc", "letter-of-credit");
        self.appNameArray = ko.observableArray();
        self.applicantPartyId = ko.observable();
        self.lcNumber = ko.observable(null);
        self.beneficiaryName = ko.observable(null);
        self.validationTracker = ko.observable();
        self.dataSourceImportAmendments = ko.observable(false);
        self.dataSourceForImportAmendment = ko.observable();
        self.listOfImportAmendments = ko.observableArray([]);
        self.lcAmendValues = ko.observable();
        self.amendmentDetails = ko.observable();
        self.amendmentId = ko.observable();
        self.benecountryName=ko.observable();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;

        ImportAmendmentModel.fetchPartyDetails().done(function(data) {
            self.appNameArray.removeAll();

            self.appNameArray.push({
                label: data.party.personalDetails.fullName,
                value: data.party.id.value
            });

            ImportAmendmentModel.fetchPartyRelations().done(function(partyData) {
                for (let i = 0; i < partyData.partyToPartyRelationship.length; i++) {
                    self.appNameArray.push({
                        label: partyData.partyToPartyRelationship[i].relatedPartyName,
                        value: partyData.partyToPartyRelationship[i].relatedParty.value
                    });
                }
            });
        });

        self.cancel = function() {
            params.dashboard.switchModule();
        };

        self.reset = function() {
            self.applicantPartyId([]);
            self.beneficiaryName("");
            self.lcNumber("");
            self.dataSourceImportAmendments(false);
        };

        self.fetchAmendmentDetails = function(values) {
            ImportAmendmentModel.getAmendmentDetails(values.lcNumber, values.amendmentNo).done(function(data) {
                const parameters = {
                    mode: "ACCEPTANCE",
                    lcAmendmentDetails: ko.mapping.fromJS(data.letterOfCreditAmendment)
                };

                params.dashboard.loadComponent("review-amend-lc", parameters);
            });
        };

        self.getImportAmendmentList = function() {
            const tracker = document.getElementById("importAmendmentTracker");

            if (tracker.valid === "valid") {

            self.dataSourceImportAmendments(false);

            ImportAmendmentModel.getImportAmendments(self.applicantPartyId(), self.beneficiaryName(), self.lcNumber()).done(function(data) {
                self.listOfImportAmendments.removeAll();

                for (let i = 0; i < data.letterOfCreditAmendmentDTOs.length; i++) {
                    self.listOfImportAmendments.push({
                        amendmentNo: data.letterOfCreditAmendmentDTOs[i].id,
                        productName: self.resourceBundle.productNameTable[data.letterOfCreditAmendmentDTOs[i].productType],
                        applicant: data.letterOfCreditAmendmentDTOs[i].applicantName,
                        lcNumber: data.letterOfCreditAmendmentDTOs[i].lcId,
                        lcAmount: params.baseModel.formatCurrency(data.letterOfCreditAmendmentDTOs[i].newAmount.amount, data.letterOfCreditAmendmentDTOs[i].newAmount.currency)
                    });
                }

                self.dataSourceForImportAmendment(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listOfImportAmendments())));
                self.dataSourceImportAmendments(true);
            });
        } else {
            tracker.showMessages();
            tracker.focusOn("@firstInvalidShown");
        }
        };
    };
});