define([

    "knockout",

    "./model",
    "ojL10n!resources/nls/service-requests-form-builder",
    "ojs/ojnavigationlist",
    "ojs/ojaccordion",
    "ojs/ojcheckboxset",
    "ojs/ojlabel",
    "ojs/ojradioset",
    "ojs/ojselectcombobox",
    "ojs/ojfilepicker"
], function(ko, ServiceRequestFileUploadModel, ResourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        self.resource = ResourceBundle;
        self.isDisabled = ko.observable(params.isDisabled);
        self.formData = ko.observable(false);
        self.needtoupload = ko.observable(true);
        self.testInput = ko.observableArray();
        self.displayValue = ko.observableArray();
        self.fileName = ko.observable();
        self.isRequired = params.rootModel.validation.mandatory;
        ko.utils.extend(self, params.rootModel);
        self.errorMessage = ko.observable();
        self.errorMessage(params.rootModel.errorMessage);

        if (params.dashboard.appData.segment === "ADMIN") {
            self.needtoupload(false);
        }

        if (params.formData) {
            self.testInput = params.formData.values;
            self.displayValue = params.formData.displayValues;
        }

        if (self.testInput().length) {
            self.fileName(self.displayValue()[0]);
            self.formData(true);
        }

        self.fileSelectListener = function(event) {
            self.formData(false);

            const files = event.detail.files[0],
                formData = new FormData();

            formData.append("file", files, files.name);
            formData.append("moduleIdentifier", "SERVICE_REQUEST");

            ServiceRequestFileUploadModel.uploadDocument(formData).done(function(data) {
                self.testInput().splice(0, self.testInput().length);

                self.testInput().push(
                    data.contentDTOList[0].contentId.value
                );

                self.displayValue()[0] = event.detail.files[0].name;
                self.fileName(event.detail.files[0].name);
                ko.tasks.runEarly();
                self.formData(true);
            }).fail();
        };
    };
});