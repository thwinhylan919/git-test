define([

    "knockout",
    "./model",

    "ojL10n!resources/nls/create-vpa",
    "ojs/ojinputtext",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup"
], function(ko, createVpaModel, ResourceBundle) {
    "use strict";

    /** New VPA Creation.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(createVpaModel.getNewModel());

                return KoModel;
            };

        self.createVpaModel = getNewKoModel().createVpaModel;
        self.vpaId = ko.observable();
        ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);
        self.isEdit = self.params.isEdit;
        self.resource = ResourceBundle;
        self.currentTask = ko.observable();
        self.groupValid = ko.observable();
        self.additionalDetails = ko.observable();
        self.vpaAvailable = ko.observable(false);
        self.checkAvailabilityLink = ko.observable(true);
        rootParams.baseModel.registerComponent("review-create-vpa", "upi");
        rootParams.dashboard.headerName(!self.params.isEdit ? self.resource.createVpa.header : self.resource.createVpa.editHeader);

        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "row",
            "account-input"
        ]);

        if (self.params.isEdit) {
            self.vpaId(self.params.vpaId);
            self.createVpaModel.id(self.vpaId());
        }

        self.checkAvailability = function() {
            createVpaModel.checkAvailability(self.createVpaModel.id()).then(function(response) {
                if (response.isUnique) {
                    self.vpaAvailable(true);
                } else {
                    self.vpaAvailable(false);
                }

                self.checkAvailabilityLink(false);
            });
        };

        self.accountsParser = function(data) {
            if (self.params.isEdit) {
                data.accounts = ko.utils.arrayFilter(data.accounts, function(item) {
                    if (item.id.value === self.params.accountId) {
                        self.createVpaModel.accountId.value(self.params.accountId);
                    }

                    return item.id.value === self.params.accountId || (item.id.value !== self.params.accountId && !self.params.vpaListMap[item.id.value]);
                });
            }

            return data;
        };

        const vpaId = self.vpaId.subscribe(function() {
                self.createVpaModel.id(self.vpaId() + self.resource.createVpa.vpaHandler);
                self.checkAvailabilityLink(true);
            }),

            additionalDetails = self.additionalDetails.subscribe(function() {
                self.createVpaModel.accountId.displayValue(self.additionalDetails().label);
            });

        self.dispose = function() {
            vpaId.dispose();
            additionalDetails.dispose();
        };

        self.createVpa = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("createVpaTracker"))) { return; }

            rootParams.dashboard.loadComponent("review-create-vpa", {
                createVpaModel: self.createVpaModel,
                vpaId: self.vpaId,
                params: self.params,
                isEdit: self.params.isEdit
            });
        };

    };
});