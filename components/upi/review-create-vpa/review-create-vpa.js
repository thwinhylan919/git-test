define([

    "knockout",
    "./model",

    "ojL10n!resources/nls/create-vpa",
    "ojs/ojinputtext",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup"
], function(ko, reviewCreateVpaModel, ResourceBundle) {
    "use strict";

    /** New VPA Creation.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.currentTask = ko.observable();
        self.createVpaModel = self.params.createVpaModel;

        rootParams.baseModel.registerComponent("transfer-payee-upi", "upi");
        rootParams.dashboard.headerName(!self.params.isEdit ? self.resource.createVpa.header : self.resource.createVpa.editHeader);

        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "row",
            "account-input"
        ]);

        const confirmScreenDetailsArray = [
            [{
                label: self.resource.createVpa.vpa,
                value: self.createVpaModel.id
            }, {
                label: self.resource.createVpa.accountNo,
                value: self.createVpaModel.accountId.displayValue
            }]
        ];

        self.getConfirmScreenMsg = function() {
            return !self.params.isEdit ? self.resource.createVpa.createVpaSuccess : self.resource.createVpa.editVpaSuccess;
        };

        self.confirmCreateVpa = function() {
            reviewCreateVpaModel.confirmCreateVpa(ko.toJSON(self.createVpaModel), self.params.isEdit).done(function(data, status, jqXHR) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: !self.params.isEdit ? self.resource.createVpa.header : self.resource.createVpa.editHeader,
                    confirmScreenExtensions: {
                        successMessage: self.resource.confirm.RETAIL_SUCCESS_MESSAGE,
                        isSet: true,
                        taskCode: "PC_F_SELF",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        confirmScreenMsgEval: self.getConfirmScreenMsg,
                        template: "confirm-screen/vpa-template"
                    }
                });
            });
        };
    };
});