define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/party-linkage",
    "ojs/ojtable",
    "ojs/ojknockout-validation"
], function(oj, ko, $, CreateLinkageModel, resourceBundle) {
    "use strict";

    return function viewModel(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.showChildPartyValidateComponent = ko.observable(true);
        self.showAddedLinkedPartiesTable = ko.observable(false);
        self.childPartyId = ko.observable();
        self.childPartyName = ko.observable();
        self.linkedPartiesArray = ko.observable([]);
        self.showReviewComponent = ko.observable(false);

        const partyArray = [];

        rootParams.baseModel.registerComponent("child-party-validate", "party-linkage");

        self.loadLinkageReviewComponent = function() {
            self.reviewFor("create");

            if (self.linkedPartiesDatasource && self.linkedPartiesArray().length > 0) { self.showReviewComponent(true); } else { rootParams.baseModel.showMessages(null, [self.nls.errors.emptyPartyCheck], "ERROR"); }
        };

        const getNewKoModel = function() {
            const KoModel = CreateLinkageModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.showBackModalWidnow = function() {
            $("#backConfirmationModal").trigger("openModal");
        };

        self.cancelOnCreate = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.back = function() {
            self.showStaticPartyInfo(true);
            self.isDataRecieved(true);
            self.isLinkageCreated(false);
            self.loadSummaryTable(false);
            self.loadUpdateComponent(false);
            self.loadCreateComponent(false);
            $("#backConfirmationModal").hide();
        };

        self.createLinkageModelInstance = ko.observable(getNewKoModel());

        self.linkedPartiesDatasource = new oj.ArrayTableDataSource(self.linkedPartiesArray(), {
            idAttribute: "relatedPartyId"
        });

        const createLinkageModelSubscription = self.createLinkageModelInstance().partyDetails.partyDetailsFetched.subscribe(function(flag) {
            if (flag) {
                CreateLinkageModel.fetchPreferenceForParty(self.createLinkageModelInstance().partyDetails.partyId()).done(function(data) {
                    self.childPartyId(self.createLinkageModelInstance().partyDetails.partyId());

                    if (data.partyPreferencesDTOs && data.partyPreferencesDTOs.enabled) {
                        if (self.partyId() === self.createLinkageModelInstance().partyDetails.partyId()) {
                            rootParams.baseModel.showMessages(null, [self.nls.errors.parentPartyCheck], "ERROR");
                            self.createLinkageModelInstance().partyDetails.partyId("reset");
                            self.createLinkageModelInstance().partyDetails.partyId("");
                            self.createLinkageModelInstance().partyDetails.partyIdDisplay("reset");
                            self.createLinkageModelInstance().partyDetails.partyIdDisplay("");
                            self.createLinkageModelInstance().partyDetails.partyName("reset");
                            self.createLinkageModelInstance().partyDetails.partyName("");
                            self.createLinkageModelInstance().partyDetails.partyDetailsFetched(false);
                        } else if (partyArray.indexOf(self.childPartyId()) > -1) {
                            rootParams.baseModel.showMessages(null, [self.nls.errors.partyAddedAlready], "ERROR");
                            self.showChildPartyValidateComponent(false);
                        } else {
                            self.childPartyName(self.createLinkageModelInstance().partyDetails.partyName());

                            const party = {};

                            party.value = self.partyId();

                            const relatedParty = {};

                            relatedParty.value = self.childPartyId();

                            self.linkedPartiesArray().push({
                                party: party,
                                relatedParty: relatedParty,
                                relatedPartyId: self.childPartyId(),
                                relatedPartyName: self.childPartyName(),
                                relatedPartyIdDisplay: self.createLinkageModelInstance().partyDetails.partyIdDisplay(),
                                relatedPartyFirstName: self.createLinkageModelInstance().partyDetails.partyFirstName(),
                                relatedPartyLastName: self.createLinkageModelInstance().partyDetails.partyLastName()
                            });

                            partyArray.push(self.childPartyId());
                            self.showAddedLinkedPartiesTable(false);
                            self.linkedPartiesDatasource.reset(self.linkedPartiesArray());
                            self.showAddedLinkedPartiesTable(true);
                            self.showChildPartyValidateComponent(false);
                        }
                    } else {
                        self.createLinkageModelInstance().partyDetails.partyId("reset");
                        self.createLinkageModelInstance().partyDetails.partyId("");
                        self.createLinkageModelInstance().partyDetails.partyIdDisplay("reset");
                        self.createLinkageModelInstance().partyDetails.partyIdDisplay("");
                        self.createLinkageModelInstance().partyDetails.partyName("reset");
                        self.createLinkageModelInstance().partyDetails.partyName("");
                        self.createLinkageModelInstance().partyDetails.partyDetailsFetched(false);

                        if (data.partyPreferencesDTOs && !data.partyPreferencesDTOs.enabled) { rootParams.baseModel.showMessages(null, [self.nls.errors.channelAccessCheck], "ERROR"); } else { rootParams.baseModel.showMessages(null, [self.nls.errors.partyPreferenceCheck], "ERROR"); }
                    }
                });
            }
        });

        self.removeChildParty = function(context) {
            const data = context.row;

            self.remove(self.linkedPartiesArray(), data.relatedPartyId);

            const position = partyArray.indexOf(data.relatedPartyId);

            partyArray.splice(position, 1);
        };

        self.remove = function(array, relatedPartyId) {
            ko.utils.arrayForEach(array, function(item) {
                if (relatedPartyId === item.relatedPartyId) {
                    const index = array.indexOf(item);

                    self.linkedPartiesArray().splice(index, 1);
                    self.linkedPartiesDatasource.reset(self.linkedPartiesArray());
                    self.showAddedLinkedPartiesTable(false);
                    self.showAddedLinkedPartiesTable(true);
                }
            });
        };

        self.addMoreRecords = function() {
            self.createLinkageModelInstance().partyDetails.partyId("reset");
            self.createLinkageModelInstance().partyDetails.partyId("");
            self.createLinkageModelInstance().partyDetails.partyIdDisplay("reset");
            self.createLinkageModelInstance().partyDetails.partyIdDisplay("");
            self.createLinkageModelInstance().partyDetails.partyName("reset");
            self.createLinkageModelInstance().partyDetails.partyName("");
            self.createLinkageModelInstance().partyDetails.partyDetailsFetched(false);
            self.showChildPartyValidateComponent(true);
            self.showAddedLinkedPartiesTable(false);
            self.showAddedLinkedPartiesTable(true);
        };

        self.dispose = function() {
            createLinkageModelSubscription.dispose();
        };

        self.hideModal = function() {
            $("#backConfirmationModal").hide();
        };

        self.onBack = function() {
            if (!self.showAddedLinkedPartiesTable()) {
                self.back();
            } else {
                self.showBackModalWidnow();
            }
        };

        self.columnsArray = [{
            headerText: self.nls.common.partyID,
            field: "relatedPartyIdDisplay"
        }, {
            headerText: self.nls.common.partyName,
            field: "relatedPartyName"
        }, {
            headerText: self.nls.columnHeader.action,
            renderer: oj.KnockoutTemplateUtils.getRenderer("delete_record", true)
        }];
    };
});