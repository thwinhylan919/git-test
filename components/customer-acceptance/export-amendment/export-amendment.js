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
], function (oj, ko, ExportAmendmentModel, locale) {
    "use strict";

    return function (params) {
        const self = this;

        params.baseModel.registerComponent("customer-acceptance-nav-bar", "customer-acceptance");
        params.baseModel.registerComponent("review-amend-lc", "letter-of-credit");
        self.beneNameArray = ko.observableArray();
        self.benePartyId = ko.observable();
        self.lcNumber = ko.observable(null);
        self.applicantName = ko.observable(null);
        self.validationTracker = ko.observable();
        self.dataSourceExportAmendments = ko.observable(false);
        self.dataSourceForExportAmendment = ko.observable();
        self.listOfExportAmendments = ko.observableArray([]);
        self.lcAmendValues = ko.observable();
        self.amendmentDetails = ko.observable();
        self.amendmentId = ko.observable();
        self.benecountryName = ko.observable();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;

        ExportAmendmentModel.fetchPartyDetails().done(function (data) {
            self.beneNameArray.removeAll();

            self.beneNameArray.push({
                label: data.party.personalDetails.fullName,
                value: data.party.id.value
            });

            ExportAmendmentModel.fetchPartyRelations().done(function (partyData) {
                for (let i = 0; i < partyData.partyToPartyRelationship.length; i++) {
                    self.beneNameArray.push({
                        label: partyData.partyToPartyRelationship[i].relatedPartyName,
                        value: partyData.partyToPartyRelationship[i].relatedParty.value
                    });
                }
            });
        });

        self.cancel = function () {
            params.dashboard.switchModule();
        };

        self.reset = function () {
            self.benePartyId([]);
            self.applicantName("");
            self.lcNumber("");
            self.dataSourceExportAmendments(false);
        };

        self.fetchAmendmentDetails = function (values) {
            ExportAmendmentModel.getAmendmentDetails(values.lcNumber, values.amendmentNo).done(function (data) {
                const parameters = {
                    mode: "ACCEPTANCE",

                    lcAmendmentDetails: ko.mapping.fromJS(data.letterOfCreditAmendment)
                };

                params.dashboard.loadComponent("review-amend-lc", parameters);
            });
        };

        self.getExportAmendmentList = function () {
            const tracker = document.getElementById("exportAmendmentTracker");

            if (tracker.valid === "valid") {
                self.dataSourceExportAmendments(false);

                ExportAmendmentModel.getExportAmendments(self.benePartyId(), self.applicantName(), self.lcNumber()).done(function (data) {
                    self.listOfExportAmendments.removeAll();

                    for (let i = 0; i < data.letterOfCreditAmendmentDTOs.length; i++) {
                        self.listOfExportAmendments.push({
                            amendmentNo: data.letterOfCreditAmendmentDTOs[i].id,
                            productName: self.resourceBundle.productNameTable[data.letterOfCreditAmendmentDTOs[i].productType],
                            applicant: data.letterOfCreditAmendmentDTOs[i].applicantName ? data.letterOfCreditAmendmentDTOs[i].applicantName : "",
                            lcNumber: data.letterOfCreditAmendmentDTOs[i].lcId,
                            lcAmount_field: data.letterOfCreditAmendmentDTOs[i].newAmount ? data.letterOfCreditAmendmentDTOs[i].newAmount.amount : 0,
                            lcAmount: params.baseModel.formatCurrency(data.letterOfCreditAmendmentDTOs[i].newAmount.amount, data.letterOfCreditAmendmentDTOs[i].newAmount.currency)
                        });
                    }

                    self.dataSourceForExportAmendment(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listOfExportAmendments())));
                    self.dataSourceExportAmendments(true);
                });
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };
    };
});